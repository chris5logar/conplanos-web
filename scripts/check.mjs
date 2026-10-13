import fs from 'node:fs';
import path from 'node:path';
import strictAssert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { siteMode } from './site-mode.mjs';
let validations = 0;
function assert(...args) { validations++; strictAssert(...args); }
for (const method of ['equal', 'match', 'deepEqual']) {
 assert[method] = (...args) => { validations++; strictAssert[method](...args); };
}
const root=path.resolve(import.meta.dirname,'../dist');
const mode = siteMode();
const preview = process.argv.includes('--preview') || mode.preview;
const origin = (process.env.SITE_ORIGIN || mode.cloudflareOrigin || (preview ? 'https://conplanos-web-preview.pages.dev' : 'https://conplanos.com')).replace(/\/+$/, '');
const services = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../content/services.json'), 'utf8'));
const commercialPaths = ['/', ...services.map(s => `/${s.slug}/`)];
const expectedUrls = commercialPaths.map(route => origin + route);
const canonicals = [];
function attributes(tag) {
 return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
}
function metaContent(html, attribute, value) {
 const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attributes(m[0])).filter(tag => tag[attribute] === value);
 assert.equal(tags.length, 1, `Meta única: ${value}`);
 return tags[0].content;
}
const contacts=JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname,'../content/contacts.json'),'utf8'));
const team=[contacts.primary,...contacts.additional.filter(c=>c.enabled)];
for(const c of team){assert(c.name?.trim(),'Contacto sin nombre');assert.match(c.phone,/^\+51\d{9}$/,`Teléfono no válido: ${c.phone}`);}
assert(contacts.whatsappMessage?.trim(),'Mensaje de WhatsApp ausente');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p)}}
walk(root);
const mainVersion = createHash('sha256').update(fs.readFileSync(path.join(root, 'assets/main.js'), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);
const titles=new Set();
let refs=0;
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: H1 único`);
 const title=html.match(/<title>(.*?)<\/title>/)[1];
 assert(!titles.has(title),'Title duplicado');titles.add(title);
 assert.equal((html.match(new RegExp('src="/assets/main\\.js\\?v=' + mainVersion + '" defer', 'g')) || []).length, 1, 'Script único y versión actual');
 assert.equal(html.includes('window.gtag=function gtag()'), !preview, 'gtag global solo en producción');
 for (const tag of html.matchAll(/<a\b[^>]*data-lead="quote"[^>]*>/g)) assert(tag[0].includes('data-contact="whatsapp"'), 'Cotización debe ser WhatsApp');
 assert(html.includes('data-lead="quote"'), 'Cotización sin marcar');
 assert(html.includes('name="description"'),'Description ausente');
 const notFound = path.relative(root, file) === '404.html';
 const canonicalTags = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attributes(m[0])).filter(tag => tag.rel === 'canonical');
 const robots = metaContent(html, 'name', 'robots');
 assert.equal(robots, preview ? 'noindex, nofollow' : notFound ? 'noindex, follow' : 'index, follow', `${file}: robots del modo correcto`);
 if (notFound) {
  assert.equal(canonicalTags.length, 0, '404 no debe declarar canonical');
  assert(!html.includes('property="og:url"'), '404 no debe presentarse con URL comercial');
  assert(!html.includes('"@type":"ProfessionalService"'), '404 no debe describirse como página comercial');
 } else {
  const relative = path.relative(root, file).split(path.sep).join('/');
  const route = relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
  assert(commercialPaths.includes(route), `${file}: página fuera del catálogo`);
  assert.equal(canonicalTags.length, 1, `${file}: canonical único`);
  const canonical = canonicalTags[0].href;
  assert.equal(canonical, origin + route, `${file}: canonical final con barra`);
  assert.equal(metaContent(html, 'property', 'og:url'), canonical, `${file}: og:url debe coincidir con canonical`);
  canonicals.push(canonical);
  const breadcrumbs = [...html.matchAll(/type="application\/ld\+json">(.*?)<\/script>/g)].map(m => JSON.parse(m[1])).filter(data => data['@type'] === 'BreadcrumbList');
  assert.equal(breadcrumbs.length, route === '/' ? 0 : 1, `${file}: BreadcrumbList`);
  if (breadcrumbs.length) {
   const items = breadcrumbs[0].itemListElement;
   assert.deepEqual(items.map(item => item.item), [origin + '/', canonical], `${file}: URLs finales de BreadcrumbList`);
   assert.deepEqual(items.map(item => item.position), [1, 2], `${file}: posiciones de BreadcrumbList`);
  }
 }
 assert(html.includes('property="og:image"'),'Open Graph ausente');
 for(const match of html.matchAll(/type="application\/ld\+json">(.*?)<\/script>/g)){const data=JSON.parse(match[1]);if(data.telephone)assert.equal(data.telephone,contacts.primary.phone,`${file}: teléfono JSON-LD`);}
 for(const c of team)assert((html.match(new RegExp(`href="tel:\\${c.phone}"`,'g'))||[]).length>=(html.includes('id="contacto"')?2:1),`${file}: falta ${c.name} en contacto o footer`);
 assert(html.includes('class="wa-float"'),`${file}: WhatsApp principal ausente`);
 for(const match of html.matchAll(/(?:src|href)="(\/[^"#]*)/g)){
  let ref=decodeURIComponent(match[1].split(/[?#]/)[0]);let target=path.join(root,ref);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),`${file}: referencia no encontrada ${ref}`);refs++;
 }
 for (const match of html.matchAll(/<a\b[^>]*>/g)) {
  const href = attributes(match[0]).href;
  if (!href) continue;
  const url = new URL(href, origin + '/');
  if (url.origin !== origin) continue;
  const route = url.pathname;
  const finalRoute = route === '/index.html' ? '/' : route.replace(/\/index\.html$/, '/').replace(/\/?$/, '/');
  assert(commercialPaths.includes(finalRoute), `${file}: enlace interno fuera del catálogo: ${href}`);
  assert.equal(route, finalRoute, `${file}: enlace interno que redirige: ${href}`);
 }
 for(const match of html.matchAll(/<img\b[^>]*>/g)){assert(/alt="[^"]+"/.test(match[0]),'Alt ausente');assert(/width="\d+"/.test(match[0])&&/height="\d+"/.test(match[0]),'Dimensiones ausentes');}
 for(const match of html.matchAll(/href="(https:\/\/wa.me\/[^\"]+)"/g)){
  const u=new URL(match[1]);assert.equal(u.pathname,'/'+contacts.primary.phone.slice(1));assert.equal(u.searchParams.get('text'),contacts.whatsappMessage);
 }
 for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const item of match[1].split(', ')){assert(fs.existsSync(path.join(root,item.split(' ')[0])),'Srcset no encontrado');}
}
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  assert.equal((html.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-7DCRJN061J/g) || []).length, preview ? 0 : 1, `${file}: etiqueta GA4 duplicada, ausente o activa en preview`);
  assert.equal((html.match(/gtag\('config','G-7DCRJN061J'\)/g) || []).length, preview ? 0 : 1, `${file}: configuración GA4 duplicada, ausente o activa en preview`);
  assert.equal((html.match(/GTM-[A-Z0-9]+/g) || []).length, 0, `${file}: Google Tag Manager no corresponde`);
  assert.equal((html.match(/G-[A-Z0-9]+/g) || []).length, preview ? 0 : 2, `${file}: ID de medición inesperado`);
}
const analytics = fs.readFileSync(path.join(root, 'assets', 'main.js'), 'utf8');
for (const name of ['click_whatsapp', 'click_phone', 'quote_request']) assert.equal((analytics.match(new RegExp(`'${name}'`, 'g')) || []).length, 1, `Evento ${name}`);
assert.equal((analytics.match(/document\.addEventListener\('click'/g) || []).length, 1, 'Listener de conversiones duplicado');
assert(!/\+51|text=|@/.test(analytics), 'La medición no debe incluir datos de contacto');
assert.equal(files.length,11,'Diez páginas y 404');
assert.equal((fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').match(/<loc>/g)||[]).length,10);
const sitemap = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.deepEqual([...sitemap].sort(), [...expectedUrls].sort(), 'Sitemap: diez URLs finales del catálogo');
assert.deepEqual([...sitemap].sort(), [...canonicals].sort(), 'Sitemap debe coincidir con canonical');
const redirects = fs.readFileSync(path.join(root, '_redirects'), 'utf8').trim().split(/\r?\n/).map(line => line.trim().split(/\s+/));
const expectedRedirects = [['/index.html', '/', '301'], ...services.flatMap(s => [[`/${s.slug}`, `/${s.slug}/`, '301'], [`/${s.slug}/index.html`, `/${s.slug}/`, '301']])];
assert.deepEqual(redirects, expectedRedirects, 'Redirecciones directas: sin ciclos ni saltos intermedios');
for (const [source, destination] of redirects) {
 assert(commercialPaths.includes(destination), `Destino final: ${source}`);
 assert(!redirects.some(rule => rule[0] === destination), `Destino no debe redirigir: ${source}`);
}
assert.equal(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').trim(), preview ? 'User-agent: *\nDisallow: /' : `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`, 'robots.txt correcto');
const headers = fs.readFileSync(path.join(root, '_headers'), 'utf8');
assert.equal(headers.includes('/*\n  X-Content-Type-Options: nosniff'), true, 'Cabeceras de seguridad conservadas');
assert.equal(headers.includes('  X-Robots-Tag: noindex, nofollow'), preview, 'Cabecera noindex global solo en preview');
console.log(`OK (${preview ? 'preview' : 'producción'}): ${validations} validaciones, ${files.length} documentos HTML, ${refs} enlaces/recursos locales, 10 canonical/sitemap, breadcrumbs, redirecciones, 404, GA4, H1, titles, metadatos, JSON-LD, alt, srcset, WhatsApp y ${team.length} contactos.`);

