# CONPLANOS · Registra y construye

Web pública comercial estática, independiente de conplanos-app y conplanos-gnss. HTML, CSS y JavaScript sin dependencias ni backend. Preparada para Cloudflare Pages.

## Arquitectura

- `dist/`: sitio terminado, listo para publicar. Diez páginas HTML, 404, sitemap, robots, cabeceras y redirecciones.
- `dist/assets/brand/`: logo original extraído del material entregado, favicon y tarjeta social.
- `dist/assets/images/projects/`: fotografías reales de campo, WebP responsive.
- `dist/assets/images/services/`: oficina real e imágenes conceptuales de apoyo.
- `content/services.json`: textos editables de las nueve páginas de servicio.
- `content/contacts.json`: fuente única de contactos. Contacto principal (también número de WhatsApp), contactos adicionales y mensaje predeterminado de WhatsApp.
- `scripts/build.mjs`: generador de HTML con Node, sin paquetes externos.
- `scripts/serve.mjs`: servidor local estático, puerto 4173.
- `scripts/check.mjs`: verificación de rutas, recursos y metadatos.
- `docs/`: guía de publicación, fotografías, textos y conversión.

## Trabajar localmente

Con Node.js instalado: `npm run build`, `npm run check`, `npm run dev`. Abrir http://127.0.0.1:4173.

No requiere instalar paquetes. Los cambios en `content/services.json` se regeneran con el build. La portada, navegación, estilos y estructuras están en el generador y en `dist/assets/`.

## Publicación final en Cloudflare Pages

Repositorio: chris5logar/conplanos-web. Rama: main. Framework: None. Build: `node scripts/build.mjs`. Directorio de salida: `dist`. Origen predeterminado: https://conplanos.com. Consultar docs/ENTREGA.md antes de asociar el dominio.

## Preview

Para una preview sin indexación, definir `SITE_MODE=preview` y `SITE_ORIGIN` igual a su URL real antes del build, o ejecutar `npm run build:preview`. Validar con `npm run check:preview` usando el mismo SITE_ORIGIN. Preview usa `noindex, nofollow` y no instala GA4. Para producción, quitar SITE_MODE, usar `https://conplanos.com` como origen y ejecutar `npm run build` y `npm run check`. Las páginas comerciales usan `index, follow` y GA4 activo. No subir a producción un build de preview.

## Política y validación técnica SEO

La portada usa `/`; cada servicio usa `/<slug>/`. Canonical, og:url, BreadcrumbList, sitemap y enlaces internos deben coincidir con esa URL final. `_redirects` lleva las variantes sin barra y `index.html` directamente al destino con barra en un solo salto.

Ejecutar `npm run build`, `npm run check` y `npm test`. Los checks conservan las verificaciones de contenido, contactos, recursos e imágenes y comprueban coherencia de URLs, 404, redirecciones y GA4. Las pruebas usan archivos temporales y no despliegan ni envían eventos reales a Google.

Conservar `dist/404.html`: Cloudflare Pages lo necesita para responder HTTP 404 a rutas inexistentes. En producción usa `noindex, follow`, sin canonical ni og:url comercial. Cloudflare puede servir la ruta explícita `/404` con HTTP 200; permanece fuera de indexación y del sitemap. En preview también la página de error usa `noindex, nofollow`.

Antes de publicar, validar en una preview de Cloudflare las diez URLs finales (200), variantes sin barra e `index.html` (un salto), y una ruta inexistente (404). El servidor local comprueba contenido y fallback 404, pero no reproduce las reglas `_redirects` de Cloudflare. Producción requiere revisión previa: no hacer push a main para esta validación.

## Contenido y activos

Solo las fotografías suministradas aparecen como trabajo real. Los apoyos generados no representan obras ejecutadas por CONPLANOS. No se incluyen testimonios, matrículas, resultados, cifras o certificaciones no verificados. GA4 está instalado con `G-7DCRJN061J`; mide `click_whatsapp`, `click_phone` y `quote_request`. No se ha activado Google Maps API, formularios externos ni publicidad. Las consultas se abren en WhatsApp y no se envían automáticamente.

Los derechos de marca y fotografías pertenecen a sus titulares. No se concede licencia sobre ellos.

