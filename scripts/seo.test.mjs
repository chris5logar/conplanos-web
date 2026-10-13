import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import test from 'node:test';

const source = path.resolve(import.meta.dirname, '..');
const services = JSON.parse(fs.readFileSync(path.join(source, 'content/services.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(source, 'content/guides.json'), 'utf8'));
const routes = ['/', ...services.map(s => `/${s.slug}/`), '/guias/', ...guides.map(g => `/guias/${g.slug}/`)];
const page = 'dist/proyectos-construccion/index.html';
const origin = 'https://conplanos.com';

function fixture(t, preview = false, siteOrigin, cloudflare = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'conplanos-seo-test-'));
  const cleanupTasks = [];
  t.after(async () => {
    for (const cleanup of cleanupTasks) await cleanup();
    // Only remove the directory allocated by mkdtemp for this test.
    assert(root.startsWith(path.join(path.resolve(os.tmpdir()), 'conplanos-seo-test-')));
    fs.rmSync(root, { recursive: true, force: true });
  });
  for (const dir of ['scripts', 'content', 'dist/assets']) fs.cpSync(path.join(source, dir), path.join(root, dir), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'));
  const env = { ...process.env };
  delete env.SITE_MODE;
  delete env.SITE_ORIGIN;
  for (const name of ['CF_PAGES', 'CF_PAGES_BRANCH', 'CF_PAGES_URL']) delete env[name];
  if (siteOrigin) env.SITE_ORIGIN = siteOrigin;
  Object.assign(env, cloudflare);
  const run = (script, args = []) => spawnSync(process.execPath, [path.join(root, 'scripts', script), ...args], { cwd: root, env, encoding: 'utf8' });
  const build = run(preview ? 'build-preview.mjs' : 'build.mjs');
  assert.equal(build.status, 0, build.stderr);
  return {
    root, env,
    beforeCleanup: cleanup => cleanupTasks.push(cleanup),
    rebuild: () => run(preview ? 'build-preview.mjs' : 'build.mjs'),
    check: () => run('check.mjs', preview ? ['--preview'] : []),
    read: file => fs.readFileSync(path.join(root, file), 'utf8'),
    replace(file, before, after) {
      const filename = path.join(root, file);
      const text = fs.readFileSync(filename, 'utf8');
      assert(text.includes(before), `Mutation target missing: ${before}`);
      fs.writeFileSync(filename, text.replace(before, after));
    }
  };
}

test('production build passes checks for every catalog page and 404', t => {
  const f = fixture(t);
  const result = f.check();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /producción.*\d+ validaciones/);
  assert.equal((f.read('dist/sitemap.xml').match(/<loc>/g) || []).length, routes.length);
});

test('preview disables GA4 and noindexes every document', t => {
  const f = fixture(t, true);
  const result = f.check();
  assert.equal(result.status, 0, result.stderr);
  for (const route of routes) {
    const html = f.read('dist' + route + 'index.html');
    assert(html.includes('content="noindex, nofollow"'));
    assert(!html.includes('G-7DCRJN061J'));
  }
  assert(f.read('dist/404.html').includes('content="noindex, nofollow"'));
});

test('custom preview origin, including trailing slash, is consistent', t => {
  const f = fixture(t, true, 'https://seo-review.example.test/');
  assert.equal(f.check().status, 0);
  assert(f.read(page).includes('href="https://seo-review.example.test/proyectos-construccion/"'));
  assert(!f.read(page).includes('https://seo-review.example.test//'));
});

const cloudflareUrl = 'https://abc123.conplanos-web.pages.dev';
const cloudflareEnv = branch => ({ CF_PAGES: '1', CF_PAGES_BRANCH: branch, CF_PAGES_URL: cloudflareUrl });

test('Cloudflare main branch builds production: indexable with GA4', t => {
  const f = fixture(t, false, undefined, cloudflareEnv('main'));
  const result = f.check();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /producción/);
  for (const route of routes) {
    const html = f.read('dist' + route + 'index.html');
    assert(html.includes('content="index, follow"'));
    assert(html.includes('G-7DCRJN061J'));
    assert(html.includes(`rel="canonical" href="${origin}${route}"`));
  }
  assert.equal(f.read('dist/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  assert(!f.read('dist/_headers').includes('X-Robots-Tag'));
});

test('Cloudflare non-main branch builds preview: noindex without GA4', t => {
  const f = fixture(t, false, undefined, cloudflareEnv('fix/any-branch'));
  const result = f.check();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /preview/);
  for (const route of routes) {
    const html = f.read('dist' + route + 'index.html');
    assert(html.includes('content="noindex, nofollow"'));
    assert(!html.includes('G-7DCRJN061J'));
    assert(!html.includes('googletagmanager'));
    assert(html.includes(`rel="canonical" href="${cloudflareUrl}${route}"`));
  }
  assert(f.read('dist/404.html').includes('content="noindex, nofollow"'));
  assert.equal(f.read('dist/robots.txt'), 'User-agent: *\nDisallow: /\n');
  assert(f.read('dist/_headers').includes('X-Robots-Tag: noindex, nofollow'));
});

test('SITE_ORIGIN still overrides the Cloudflare deployment URL', t => {
  const f = fixture(t, false, 'https://seo-review.example.test', cloudflareEnv('fix/any-branch'));
  assert.equal(f.check().status, 0);
  assert(f.read(page).includes('href="https://seo-review.example.test/proyectos-construccion/"'));
  assert(f.read(page).includes('content="noindex, nofollow"'));
});

test('local build without Cloudflare variables stays production', t => {
  const f = fixture(t);
  assert.equal(f.env.CF_PAGES_BRANCH, undefined);
  assert.equal(f.check().status, 0);
  assert(f.read(page).includes('content="index, follow"'));
  assert(f.read(page).includes('G-7DCRJN061J'));
  assert(f.read(page).includes(`rel="canonical" href="${origin}/proyectos-construccion/"`));
});

const mutations = [
  ['canonical without trailing slash', page, 'rel="canonical" href="https://conplanos.com/proyectos-construccion/"', 'rel="canonical" href="https://conplanos.com/proyectos-construccion"', /canonical final/],
  ['OG differs from canonical', page, 'property="og:url" content="https://conplanos.com/proyectos-construccion/"', 'property="og:url" content="https://conplanos.com/"', /og:url/],
  ['breadcrumb differs from canonical', page, '"item":"https://conplanos.com/proyectos-construccion/"', '"item":"https://conplanos.com/proyectos-construccion"', /BreadcrumbList/],
  ['sitemap differs from canonical', 'dist/sitemap.xml', `${origin}/proyectos-construccion/`, `${origin}/proyectos-construccion`, /Sitemap/],
  ['relative internal link redirects', 'dist/index.html', 'href="/proyectos-construccion/"', 'href="/proyectos-construccion"', /enlace interno que redirige/],
  ['absolute internal link redirects', 'dist/index.html', 'href="/proyectos-construccion/"', 'href="https://conplanos.com/proyectos-construccion"', /enlace interno que redirige/],
  ['internal index.html link redirects', page, 'href="/ejecucion-obra/"', 'href="/ejecucion-obra/index.html"', /enlace interno que redirige/],
  ['404 is indexable', 'dist/404.html', 'content="noindex, follow"', 'content="index, follow"', /robots/],
  ['404 canonical to homepage', 'dist/404.html', '</head>', `<link rel="canonical" href="${origin}/"></head>`, /404 no debe declarar canonical/],
  ['duplicate GA4 loader', page, '</head>', '<script async src="https://www.googletagmanager.com/gtag/js?id=G-7DCRJN061J"></script></head>', /etiqueta GA4 duplicada/],
  ['duplicate GA4 config', page, '</head>', "<script>gtag('config','G-7DCRJN061J');</script></head>", /configuración GA4 duplicada/],
  ['redirect has intermediate hop', 'dist/_redirects', '/proyectos-construccion/index.html /proyectos-construccion/ 301', '/proyectos-construccion/index.html /proyectos-construccion 301', /Redirecciones directas/],
  ['redirect loop', 'dist/_redirects', '/proyectos-construccion /proyectos-construccion/ 301', '/proyectos-construccion/ /proyectos-construccion/ 301', /Redirecciones directas/],
  ['duplicate analytics event', 'dist/assets/main.js', "names.push('click_whatsapp');", "names.push('click_whatsapp'); names.push('click_whatsapp');", /Evento click_whatsapp/]
];
for (const [name, file, before, after, diagnostic] of mutations) {
  test(`check rejects ${name}`, t => {
    const f = fixture(t);
    f.replace(file, before, after);
    if (file === 'dist/assets/main.js') assert.equal(f.rebuild().status, 0);
    const result = f.check();
    assert.notEqual(result.status, 0, 'Regression was not detected');
    assert.match(result.stderr, diagnostic);
  });
}

test('check rejects an indexable preview', t => {
  const f = fixture(t, true);
  f.replace(page, 'content="noindex, nofollow"', 'content="index, follow"');
  const result = f.check();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /robots/);
});

test('check rejects production GA4 in preview', t => {
  const f = fixture(t, true);
  f.replace(page, '</head>', '<script async src="https://www.googletagmanager.com/gtag/js?id=G-7DCRJN061J"></script></head>');
  const result = f.check();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /etiqueta GA4/);
});

test('production check rejects a preview build even without SITE_MODE in the shell', t => {
  const f = fixture(t, true);
  const result = spawnSync(process.execPath, [path.join(f.root, 'scripts/check.mjs')], { cwd: f.root, env: f.env, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
});

test('local HTTP serves ten pages and preserves 404 fallback', { timeout: 15000 }, async t => {
  const f = fixture(t);
  const server = spawn(process.execPath, [path.join(f.root, 'scripts/serve.mjs')], { cwd: f.root, env: f.env, stdio: ['ignore', 'pipe', 'pipe'] });
  f.beforeCleanup(async () => {
    if (server.exitCode === null && server.signalCode === null) {
      const stopped = once(server, 'exit');
      server.kill('SIGKILL');
      await stopped;
    }
  });
  await Promise.race([
    once(server.stdout, 'data'),
    once(server, 'exit').then(([code]) => { throw new Error(`Server exited before listening: ${code}`); })
  ]);
  for (const route of routes) {
    const response = await fetch('http://127.0.0.1:4173' + route, { signal: AbortSignal.timeout(3000) });
    assert.equal(response.status, 200, route);
    assert.match(await response.text(), /content="index, follow"/);
  }
  for (const route of ['/seo-test-missing/', '/404', '/404/']) {
    const response = await fetch('http://127.0.0.1:4173' + route, { signal: AbortSignal.timeout(3000) });
    assert.equal(response.status, 404, route);
    const html = await response.text();
    assert(html.includes('content="noindex, follow"'));
    assert(!html.includes('rel="canonical"'));
  }
  const explicit = await fetch('http://127.0.0.1:4173/404.html');
  assert.equal(explicit.status, 200);
  assert((await explicit.text()).includes('content="noindex, follow"'));
});
