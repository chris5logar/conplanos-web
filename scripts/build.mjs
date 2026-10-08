import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const origin = process.env.SITE_ORIGIN || 'https://conplanos.com';
const preview = process.env.SITE_MODE === 'preview';
// Change the script URL whenever its contents change, including on rebuilds.
const mainVersion = createHash('sha256').update(fs.readFileSync(path.join(dist, 'assets', 'main.js'), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));

const contacts = readJson('contacts.json');
const services = readJson('services.json');

const formatPhone = phone => {
  const m = /^\+51(\d{3})(\d{3})(\d{3})$/.exec(phone);
  if (!m) throw new Error(`Teléfono no válido en content/contacts.json: ${phone}`);
  return `+51 ${m[1]} ${m[2]} ${m[3]}`;
};
const primary = { ...contacts.primary, display: formatPhone(contacts.primary.phone) };
const team = [primary, ...contacts.additional.filter(c => c.enabled).map(c => ({ ...c, display: formatPhone(c.phone) }))];
const wa = 'https://wa.me/' + primary.phone.slice(1) + '?text=' + encodeURIComponent(contacts.whatsappMessage);
const maps = 'https://maps.app.goo.gl/65JH3DPn1SEizeC67';
const address = 'Av. Micaela Bastidas 321, Cusco';

const areas = [
  { id: 'topografia', name: 'Topografía y geodesia', text: 'Información precisa del terreno para proyectar, delimitar y sanear.' },
  { id: 'saneamiento', name: 'Saneamiento y propiedad', text: 'Evaluación técnica y legal para formalizar y registrar tu propiedad.' },
  { id: 'proyectos', name: 'Proyectos y obras', text: 'Diseño, desarrollo urbano y ejecución de obra con coordinación técnica.' }
];
const areaOf = s => areas.find(a => a.id === s.area) || (() => { throw new Error(`Área desconocida en ${s.slug}: ${s.area}`); })();
const bySlug = slug => services.find(s => s.slug === slug) || (() => { throw new Error(`Servicio relacionado inexistente: ${slug}`); })();

const hero = {
  title: 'Ingeniería, topografía y saneamiento de predios en Cusco',
  lead: 'Medimos tu terreno, desarrollamos tu proyecto u obra y ordenamos la documentación de tu propiedad, con ingenieros, arquitectos y abogados trabajando de forma coordinada.'
};

const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const waAttrs = `href="${wa}" target="_blank" rel="noopener noreferrer" data-contact="whatsapp"`;
const quoteLabels = new Set(['Cotizar por WhatsApp', 'Consultar por WhatsApp', 'Consultar mi proyecto', 'Consultar mi caso']);
const button = (label, style = 'primary') => `<a class="button ${style}" ${waAttrs}${quoteLabels.has(label) ? ' data-lead="quote"' : ''}>${label}</a>`;
const telLink = (c, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="tel:${c.phone}">${c.display}</a>`;

const images = {
  'conplanos-visita-tecnica-predio-rural': { folder: 'projects', widths: [480, 800, 1280], size: [1286, 965] },
  'conplanos-medicion-gnss-campo': { folder: 'projects', widths: [480, 800], size: [724, 965] },
  'oficina-conplanos-cusco': { folder: 'services', widths: [480, 800], size: [544, 965] },
  'arquitectura-conplanos': { folder: 'services', widths: [480, 960, 1440], size: [1536, 1024], generated: true },
  'construccion-conplanos': { folder: 'services', widths: [480, 960, 1440], size: [1536, 1024], generated: true }
};
function photo(name, alt, { sizes = '(max-width: 860px) 100vw, 50vw', eager = false } = {}) {
  const img = images[name];
  const src = w => `/assets/images/${img.folder}/${name}-${w}.webp`;
  const seen = new Set();
  const srcset = img.widths.map(w => [src(w), Math.min(w, img.size[0])]).filter(([, d]) => !seen.has(d) && seen.add(d)).map(([u, d]) => `${u} ${d}w`).join(', ');
  return `<img src="${src(img.widths[1])}" srcset="${srcset}" sizes="${sizes}" width="${img.size[0]}" height="${img.size[1]}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const serviceImage = s => images[s.image].generated
  ? { alt: s.image.startsWith('construccion') ? 'Imagen referencial de una estructura de concreto en construcción con casco y planos' : 'Imagen referencial de planos arquitectónicos y maqueta', caption: 'Imagen referencial' }
  : s.image.includes('gnss')
    ? { alt: 'Técnico de CONPLANOS midiendo con equipo GNSS en un terreno', caption: 'Medición GNSS en campo · fotografía de CONPLANOS' }
    : { alt: 'Personal de CONPLANOS durante una visita técnica a un predio rural', caption: 'Visita técnica a un predio rural · fotografía de CONPLANOS' };

function head(title, description, route = '', extraSchema = []) {
  const url = origin + (route ? '/' + route : '/');
  const business = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': origin + '/#business',
    name: 'CONPLANOS', url: origin, telephone: primary.phone,
    description: 'Ingeniería, topografía, saneamiento de predios, arquitectura y asesoramiento legal en Cusco.',
    logo: origin + '/assets/brand/conplanos-logo.webp', image: origin + '/assets/images/services/oficina-conplanos-cusco-800.webp',
    address: { '@type': 'PostalAddress', streetAddress: 'Av. Micaela Bastidas 321', addressLocality: 'Cusco', addressRegion: 'Cusco', addressCountry: 'PE' },
    geo: { '@type': 'GeoCoordinates', latitude: -13.5232548, longitude: -71.9625877 },
    areaServed: [{ '@type': 'AdministrativeArea', name: 'Cusco' }, { '@type': 'Country', name: 'Perú' }],
    hasMap: maps
  };
  const schemas = [business, ...extraSchema].map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('');
  const measurementId = 'G-7DCRJN061J';
  const ga = preview ? '' : `<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script><script>window.dataLayer=window.dataLayer||[];window.gtag=function gtag(){window.dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${measurementId}');</script>`;
  return `<!doctype html><html lang="es-PE"><head>${ga}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${preview ? 'noindex, nofollow' : 'index, follow'}"><meta name="theme-color" content="#0B0B0C"><link rel="canonical" href="${url}"><link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg"><meta property="og:type" content="website"><meta property="og:locale" content="es_PE"><meta property="og:site_name" content="CONPLANOS"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/brand/conplanos-social.webp"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="CONPLANOS. Registra y construye. Abogados, arquitectos e ingenieros."><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/styles.css"><script>document.documentElement.classList.add('js')</script><script src="/assets/main.js?v=${mainVersion}" defer></script>${schemas}</head><body>`;
}

const logo = (extra = '') => `<img src="/assets/brand/conplanos-logo.webp" width="1100" height="128" alt="CONPLANOS"${extra}>`;

const header = `<a class="skip" href="#contenido">Saltar al contenido</a><header class="header"><div class="wrap header-inner"><a class="brand" href="/" aria-label="CONPLANOS, inicio">${logo()}<span>REGISTRA Y CONSTRUYE</span></a><button class="menu-toggle" type="button" aria-controls="navigation" aria-expanded="false">Menú</button><nav id="navigation" aria-label="Navegación principal"><a href="/#servicios">Servicios</a><a href="/#trabajos">Trabajo en campo</a><a href="/#equipo">Equipo</a><a href="/#contacto">Contacto</a></nav><a class="button primary header-cta" ${waAttrs} data-lead="quote">Cotizar por WhatsApp</a></div></header>`;

const footer = `<footer class="site-footer"><div class="wrap footer-grid"><div class="footer-brand"><a href="/" aria-label="CONPLANOS, inicio">${logo(' loading="lazy" decoding="async"')}</a><p class="footer-tagline">REGISTRA Y CONSTRUYE</p><p>Abogados · Arquitectos · Ingenieros</p><p>${address}</p></div><div><p class="footer-title">Servicios</p><ul class="footer-list">${services.map(s => `<li><a href="/${s.slug}">${esc(s.name)}</a></li>`).join('')}</ul></div><div><p class="footer-title">Contacto</p><ul class="footer-list">${team.map(c => `<li><a href="tel:${c.phone}">${c.display} · ${esc(c.name)}</a></li>`).join('')}<li><a ${waAttrs}>WhatsApp · ${esc(primary.name)}</a></li><li><a href="${maps}" target="_blank" rel="noopener noreferrer">Ver ubicación en Google Maps</a></li></ul></div><div><p class="footer-title">Navegación</p><ul class="footer-list"><li><a href="/">Inicio</a></li><li><a href="/#servicios">Servicios</a></li><li><a href="/#trabajos">Trabajo en campo</a></li><li><a href="/#equipo">Equipo</a></li><li><a href="/#contacto">Contacto</a></li></ul></div></div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} CONPLANOS</span><span>Construimos confianza, aseguramos tu patrimonio.</span></div></footer><a class="wa-float" ${waAttrs} aria-label="Consultar por WhatsApp al ${esc(primary.name)}"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M27 15.5A11.5 11.5 0 0 1 10 25.7L4 28l2-6A11.5 11.5 0 1 1 27 15.5Z"/><path fill="currentColor" d="M11 9c-3 2-1 7 3 10 4 3 7 3 9 0l-4-3-2 2c-2-1-4-3-5-5l2-1-3-3Z"/></svg><span>WhatsApp</span></a></body></html>`;

const roleOf = c => c === primary ? 'Contacto principal' : 'Contacto';

function steps() {
  const items = [
    ['Consulta', 'Nos cuentas qué necesitas y dónde está el predio, por WhatsApp o en la oficina.'],
    ['Evaluación', 'Revisamos la información disponible y definimos si hace falta una visita técnica.'],
    ['Propuesta', 'Recibes una cotización con el alcance, los entregables y las condiciones.'],
    ['Ejecución', 'Desarrollamos el trabajo acordado y te mantenemos informado del avance.']
  ];
  return `<section class="section paper" aria-labelledby="proceso-titulo"><div class="wrap"><div class="section-head"><div><p class="label">Cómo trabajamos</p><h2 id="proceso-titulo">De la consulta a un alcance definido</h2></div><p>Los plazos y aprobaciones de trámites dependen de las entidades competentes. Por eso cada encargo empieza con una evaluación de tu caso.</p></div><ol class="steps">${items.map(([t, p], i) => `<li><span class="step-number">0${i + 1}</span><h3>${t}</h3><p>${p}</p></li>`).join('')}</ol></div></section>`;
}

function contact() {
  return `<section class="section contact" id="contacto" aria-labelledby="contacto-titulo"><div class="wrap contact-grid"><div><p class="label">Contacto</p><h2 id="contacto-titulo">Cuéntanos tu caso</h2><p class="lead">Envíanos la ubicación del predio, lo que necesitas y los documentos que tengas. Te indicaremos el siguiente paso y si hace falta una visita técnica.</p><div class="actions">${button('Escribir por WhatsApp')}<a class="button secondary" href="tel:${primary.phone}">Llamar al ${primary.display}</a></div><ul class="contact-list">${team.map(c => `<li><span>${roleOf(c)}</span><strong>${esc(c.name)}</strong>${telLink(c)}</li>`).join('')}<li><span>Oficina</span><strong>${address}</strong><a href="${maps}" target="_blank" rel="noopener noreferrer">Ver en Google Maps</a></li></ul><p class="small-note">Las visitas a la oficina se coordinan previamente por WhatsApp.</p></div><figure class="office">${photo('oficina-conplanos-cusco', 'Fachada y acceso de la oficina de CONPLANOS en Cusco', { sizes: '(max-width: 860px) 100vw, 40vw' })}<figcaption>Oficina de CONPLANOS · ${address}</figcaption></figure></div></section>`;
}

const otherConsults = ['Parcelaciones', 'Lotizaciones', 'Independizaciones', 'Subdivisiones', 'Diseño de proyectos', 'Licencias de construcción'];

function homepage() {
  const highlights = [
    ['Técnico y legal', 'Ingenieros, arquitectos y abogados en un mismo equipo.'],
    ['Trabajo en campo', 'Reconocimiento y medición topográfica y GNSS en el predio.'],
    ['Alcance por escrito', 'Cotización con alcance, entregables y condiciones.'],
    ['Oficina en Cusco', 'Atención presencial previa coordinación.']
  ];
  const fieldPoints = [
    ['Reconocimiento del predio', 'Ubicación, accesos, colindancias y situación actual.'],
    ['Medición topográfica y GNSS', 'Datos de campo para planos y georreferenciación.'],
    ['Revisión de antecedentes', 'Documentos técnicos y legales del inmueble.']
  ];
  return head('CONPLANOS | Ingeniería, topografía y saneamiento de predios en Cusco', 'Topografía y GNSS, titulación y saneamiento de predios, proyectos y ejecución de obra en Cusco. Ingenieros, arquitectos y abogados. Cotiza por WhatsApp.') + header + `<main id="contenido">`
    + `<section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><p class="label">Ingeniería · Topografía · Saneamiento</p><h1>${hero.title}</h1><p class="lead">${hero.lead}</p><div class="actions">${button('Cotizar por WhatsApp')}<a class="button secondary" href="#servicios">Ver servicios</a></div><p class="hero-meta">Cusco y otras regiones del Perú · Oficina en ${address}</p></div><figure class="hero-figure">${photo('conplanos-visita-tecnica-predio-rural', 'Personal de CONPLANOS durante una visita técnica a un predio rural', { sizes: '(max-width: 860px) 100vw, 46vw', eager: true })}<figcaption>Visita técnica a un predio rural · fotografía de CONPLANOS</figcaption></figure></div></section>`
    + `<section class="highlights" aria-label="Por qué CONPLANOS"><ul class="wrap">${highlights.map(([t, p]) => `<li><strong>${t}</strong><span>${p}</span></li>`).join('')}</ul></section>`
    + `<section class="section" id="servicios" aria-labelledby="servicios-titulo"><div class="wrap"><div class="section-head"><div><p class="label">Servicios</p><h2 id="servicios-titulo">Lo que hacemos</h2></div><p>Tres áreas que se complementan: conocer el terreno, formalizar la propiedad y desarrollar el proyecto o la obra.</p></div><div class="areas">${areas.map((a, i) => `<div class="area"><span class="area-number">0${i + 1}</span><h3>${a.name}</h3><p>${a.text}</p><ul class="service-list">${services.filter(s => s.area === a.id).map(s => `<li><a href="/${s.slug}"><strong>${esc(s.name)}</strong><span>${esc(s.summary)}</span></a></li>`).join('')}</ul></div>`).join('')}</div><div class="more"><p>También atendemos consultas sobre:</p>${otherConsults.map(n => `<a ${waAttrs}>${n}</a>`).join('')}</div></div></section>`
    + `<section class="section field" id="trabajos" aria-labelledby="trabajos-titulo"><div class="wrap split"><figure class="field-figure">${photo('conplanos-medicion-gnss-campo', 'Técnico de CONPLANOS midiendo con equipo GNSS en un terreno', { sizes: '(max-width: 860px) 100vw, 40vw' })}<figcaption>Medición GNSS en campo · fotografía de CONPLANOS</figcaption></figure><div><p class="label">Trabajo en campo</p><h2 id="trabajos-titulo">Cada encargo empieza en el terreno</h2><p class="lead">Antes de proponer una solución revisamos los antecedentes y, cuando el caso lo requiere, visitamos el predio. Esa información es la base de los planos, expedientes y presupuestos que preparamos.</p><ul class="checklist numbered">${fieldPoints.map(([t, p], i) => `<li><span>0${i + 1}</span><div><strong>${t}</strong><p>${p}</p></div></li>`).join('')}</ul><div class="actions">${button('Consultar mi proyecto', 'secondary')}</div></div></div></section>`
    + steps()
    + `<section class="section band" aria-labelledby="obras-titulo"><div class="wrap split"><div><p class="label">Proyectos y obras</p><h2 id="obras-titulo">Del proyecto a la obra, con una misma coordinación</h2><p class="lead">Diseñamos el proyecto, coordinamos sus especialidades y planificamos la ejecución con presupuesto por partidas y seguimiento de avances.</p><ul class="link-list"><li><a href="/proyectos-construccion">Proyectos de construcción</a></li><li><a href="/ejecucion-obra">Ejecución de obra</a></li><li><a href="/habilitaciones-urbanas">Habilitaciones urbanas</a></li></ul></div><figure class="band-figure">${photo('construccion-conplanos', 'Imagen referencial de una estructura de concreto en construcción con casco y planos', { sizes: '(max-width: 860px) 100vw, 50vw' })}<figcaption>Imagen referencial</figcaption></figure></div></section>`
    + `<section class="section team" id="equipo" aria-labelledby="equipo-titulo"><div class="wrap"><div class="section-head"><div><p class="label">Equipo</p><h2 id="equipo-titulo">Abogados, arquitectos e ingenieros</h2></div><p>Coordinamos las especialidades que requiere cada encargo, desde la medición del terreno hasta la documentación final. Comunícate directamente con nuestro equipo.</p></div><ul class="team-grid">${team.map(c => `<li class="person${c === primary ? ' is-primary' : ''}"><span class="role">${roleOf(c)}</span><h3>${esc(c.name)}</h3>${telLink(c, 'phone')}${c === primary ? `<p>Primer contacto para consultas, cotizaciones y coordinación de visitas.</p><a class="text-link" ${waAttrs}>Escribir por WhatsApp</a>` : `<a class="text-link" href="tel:${c.phone}" aria-label="Llamar a ${esc(c.name)}">Llamar</a>`}</li>`).join('')}</ul></div></section>`
    + contact() + `</main>` + footer;
}

function servicePage(s) {
  const area = areaOf(s);
  const img = serviceImage(s);
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: origin + '/' },
    { '@type': 'ListItem', position: 2, name: s.name, item: `${origin}/${s.slug}` }
  ] };
  return head(`${s.name} en Cusco | CONPLANOS`, s.description, s.slug, [breadcrumb]) + header + `<main id="contenido">`
    + `<section class="hero page-hero"><div class="wrap hero-inner"><div class="hero-copy"><nav class="breadcrumb" aria-label="Ruta de navegación"><ol><li><a href="/">Inicio</a></li><li><a href="/#servicios">Servicios</a></li><li aria-current="page">${esc(s.name)}</li></ol></nav><p class="label">${area.name}</p><h1>${esc(s.name)}</h1><p class="service-headline">${esc(s.headline)}</p><p class="lead">${esc(s.description)}</p><div class="actions">${button('Consultar por WhatsApp')}<a class="button secondary" href="tel:${primary.phone}">Llamar al ${primary.display}</a></div><p class="small-note">${esc(primary.name)} · ${primary.display}</p></div><figure class="hero-figure">${photo(s.image, img.alt, { sizes: '(max-width: 860px) 100vw, 46vw', eager: true })}<figcaption>${img.caption}</figcaption></figure></div></section>`
    + `<section class="section"><div class="wrap detail"><div><p class="label">Qué resuelve</p><h2>¿Cuándo necesitas este servicio?</h2><ul class="checklist">${s.solves.map(t => `<li><p>${esc(t)}</p></li>`).join('')}</ul></div><div><p class="label">Qué puede incluir</p><h2>Alcance del servicio</h2><ul class="checklist numbered">${s.scope.map((t, i) => `<li><span>0${i + 1}</span><p>${esc(t)}</p></li>`).join('')}</ul><p class="small-note">El alcance, los entregables y las condiciones se precisan en la cotización. Los trámites y aprobaciones dependen de las entidades competentes.</p></div></div></section>`
    + `<section class="start" aria-labelledby="empezar-titulo"><div class="wrap start-box"><div><p class="label">Para empezar</p><h2 id="empezar-titulo">Ten a mano</h2><p>Si aún no tienes toda la información, cuéntanos qué tienes disponible.</p></div><ul class="bullets">${s.requirements.map(r => `<li>${esc(r)}</li>`).join('')}</ul><div>${button('Consultar mi caso')}</div></div></section>`
    + steps()
    + `<section class="section" aria-labelledby="faq-titulo"><div class="wrap faq"><p class="label">Preguntas frecuentes</p><h2 id="faq-titulo">Antes de empezar</h2>${s.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>`
    + `<section class="section related" aria-labelledby="relacionados-titulo"><div class="wrap"><p class="label">Servicios relacionados</p><h2 id="relacionados-titulo">También puede interesarte</h2><ul class="related-list">${s.related.map(bySlug).map(x => `<li><a href="/${x.slug}"><span>${areaOf(x).name}</span><strong>${esc(x.name)}</strong><p>${esc(x.summary)}</p></a></li>`).join('')}</ul></div></section>`
    + contact() + `</main>` + footer;
}

function notFound() {
  return head('Página no encontrada | CONPLANOS', 'Encuentra los servicios de CONPLANOS y contacta con nuestro equipo.') + header + `<main id="contenido" class="section not-found"><div class="wrap"><p class="label">Error 404</p><h1>Esta página no está disponible</h1><p class="lead">Puede que la dirección haya cambiado. Revisa nuestros servicios o escríbenos directamente.</p><div class="actions"><a class="button primary" href="/">Ir al inicio</a>${button('Escribir por WhatsApp', 'secondary')}</div><ul class="link-list">${services.map(s => `<li><a href="/${s.slug}">${esc(s.name)}</a></li>`).join('')}</ul></div></main>` + footer;
}

fs.writeFileSync(path.join(dist, 'index.html'), homepage());
if (!process.argv.includes('--home-only')) {
  for (const s of services) {
    fs.mkdirSync(path.join(dist, s.slug), { recursive: true });
    fs.writeFileSync(path.join(dist, s.slug, 'index.html'), servicePage(s));
  }
  fs.writeFileSync(path.join(dist, '404.html'), notFound());
}
const sitemapUrls = [origin + '/', ...services.map(s => `${origin}/${s.slug}/`)];
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(loc => `<url><loc>${loc}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Frame-Options: SAMEORIGIN\n${preview ? '  X-Robots-Tag: noindex, nofollow\n' : ''}/sitemap.xml\n  Content-Type: application/xml; charset=utf-8\n/assets/*\n  Cache-Control: public, max-age=86400\n`);
fs.writeFileSync(path.join(dist, '_redirects'), '/index.html / 301\n' + services.map(s => `/${s.slug}/index.html /${s.slug} 301`).join('\n') + '\n');

const homeText = homepage().split('<main id="contenido">')[1].split('</main>')[0].replace(/<\/(h[1-6]|p|li|section|article|figcaption)>/g, '\n\n').replace(/<[^>]+>/g, ' ').replace(/ +/g, ' ').replace(/\n /g, '\n').replace(/\n{3,}/g, '\n\n').trim();
fs.writeFileSync(path.join(root, 'docs', 'TEXTOS.md'), '# Textos de la web\n\nArchivo generado por scripts/build.mjs. Los textos de cada servicio se editan en content/services.json y los contactos en content/contacts.json; la portada está en el generador.\n\n## Inicio\n\n' + hero.title + '\n\n' + hero.lead + '\n\n' + services.map(s => `## ${s.name}\n\n${s.headline}\n\n${s.description}\n\n### Qué resuelve\n${s.solves.map(x => '- ' + x).join('\n')}\n\n### Alcance\n${s.scope.map(x => '- ' + x).join('\n')}\n\n### Información inicial\n${s.requirements.map(x => '- ' + x).join('\n')}\n\n### Preguntas\n${s.faq.map(([q, a]) => `**${q}**\n${a}`).join('\n\n')}`).join('\n\n') + '\n\n## Texto completo de portada\n\n' + homeText + '\n');
console.log(`Generadas ${process.argv.includes('--home-only') ? 1 : 10} páginas. Origen: ${origin}. Modo: ${preview ? 'preview (noindex)' : 'producción'}.`);
