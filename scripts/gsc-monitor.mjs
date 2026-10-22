// CONPLANOS GSC monitor. Node >=20; no dependencies.
// GOOGLE_SERVICE_ACCOUNT_JSON: JSON secret from an authorized service account.
// PREVIOUS_STATE: optional path of preceding snapshot JSON.
// OUTPUT_STATE: optional output path. This script never edits production.
import { createSign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const SITE = 'sc-domain:conplanos.com';
const SITEMAP = 'https://conplanos.com/sitemap.xml';
const EXPECTED = 16;
const IMPORTANT = 'https://conplanos.com/licencia-funcionamiento/';
const inspectionEndpoint = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const apiRoot = 'https://www.googleapis.com/webmasters/v3';
const b64 = x => Buffer.from(JSON.stringify(x)).toString('base64url');

async function getToken() {
  const account = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');
  if (!account.client_email || !account.private_key) throw new Error('Missing authorized GOOGLE_SERVICE_ACCOUNT_JSON');
  const now = Math.floor(Date.now() / 1000);
  const msg = b64({ alg: 'RS256', typ: 'JWT' }) + '.' +
    b64({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3500 });
  const sign = createSign('RSA-SHA256'); sign.update(msg); sign.end();
  const assertion = msg + '.' + sign.sign(account.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
  if (!res.ok) throw new Error('Google auth failed: HTTP ' + res.status);
  const data = await res.json(); return data.access_token;
}
async function jsonRequest(url, token, options={}) {
  const res = await fetch(url, { ...options, headers: { Authorization: 'Bearer ' + token, ...options.headers } });
  if (!res.ok) throw new Error('Google API failed: HTTP ' + res.status + ' ' + url.split('?')[0]);
  return res.json();
}
function extractUrls(xml) {
  return [...xml.matchAll(/<loc>\s*(https:\/\/conplanos\.com\/[^<]*)\s*<\/loc>/g)]
    .map(m => m[1].trim()).filter(u => !u.endsWith('/sitemap.xml'));
}
function indexed(row) { return row?.verdict === 'PASS' && row?.coverageState?.toLowerCase().includes('indexed'); }
const meaningful = (prev, cur) => {
  if (!prev || !prev.urls) return []; // initial run establishes baseline, never alerts
  const alerts = [];
  for (const [url, state] of Object.entries(cur.urls)) {
    const old = prev.urls[url];
    if (!old) continue;
    if (!indexed(old) && indexed(state) && url !== 'https://conplanos.com/') alerts.push('INDEXED: ' + url);
    if (state.verdict === 'FAIL' && old.verdict !== 'FAIL') alerts.push('INDEX ERROR: ' + url);
    if (state.verdict === 'NEUTRAL' && old.verdict !== 'NEUTRAL') alerts.push('INDEX WARNING: ' + url);
  }
  if (cur.sitemap.errors > (prev.sitemap?.errors ?? 0) || cur.sitemap.warnings > (prev.sitemap?.warnings ?? 0)) alerts.push('SITEMAP ERRORS/WARNINGS');
  if (Object.values(cur.urls).length === EXPECTED && Object.values(cur.urls).every(indexed) && !Object.values(prev.urls).every(indexed)) alerts.push('ALL 16 INDEXED');
  return alerts;
};
const token = process.env.GOOGLE_ACCESS_TOKEN || await getToken();
const siteParam = encodeURIComponent(SITE);
const apiSitemap = await jsonRequest(apiRoot + '/sites/' + siteParam + '/sitemaps/' + encodeURIComponent(SITEMAP), token);
const xmlRes = await fetch(SITEMAP);
if (!xmlRes.ok) throw new Error('Sitemap HTTP ' + xmlRes.status);
const xml = await xmlRes.text();
const urls = [...new Set(extractUrls(xml))];
if (urls.length !== EXPECTED || !urls.includes(IMPORTANT)) throw new Error('Sitemap URL set mismatch: expected 16 including license, found ' + urls.length);
const current = { checkedAt: new Date().toISOString(), sitemap: { errors: Number(apiSitemap.errors ?? 0), warnings: Number(apiSitemap.warnings ?? 0) }, urls: {} };
for (const url of urls) {
  const data = await jsonRequest(inspectionEndpoint, token, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }) });
  const result = data.inspectionResult?.indexStatusResult || {};
  current.urls[url] = { verdict: result.verdict || 'UNKNOWN', coverageState: result.coverageState || '', indexingState: result.indexingState || '' };
}
let previous = null;
try { previous = JSON.parse(await readFile(process.env.PREVIOUS_STATE || 'seo-state.json', 'utf8')); }
catch (e) { if (e.code !== 'ENOENT') throw e; }
const alerts = meaningful(previous, current);
await writeFile(process.env.OUTPUT_STATE || 'seo-state.json', JSON.stringify(current, null, 2) + '\n');
console.log(JSON.stringify({ count: urls.length, indexed: Object.values(current.urls).filter(indexed).length, alerts, isBaseline: !previous }, null, 2));
