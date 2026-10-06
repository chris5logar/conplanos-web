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

Para una preview sin indexación, definir `SITE_MODE=preview` y `SITE_ORIGIN` igual a su URL real antes del build. Para producción, quitar SITE_MODE y conservar el origen final. El sitemap y canonical se generan con SITE_ORIGIN. No subir a producción un build con noindex.

## Contenido y activos

Solo las fotografías suministradas aparecen como trabajo real. Los apoyos generados no representan obras ejecutadas por CONPLANOS. No se incluyen testimonios, matrículas, resultados, cifras o certificaciones no verificados. No se ha activado Google Maps API, formularios externos, analítica ni publicidad. Las consultas se abren en WhatsApp y no se envían automáticamente.

Los derechos de marca y fotografías pertenecen a sus titulares. No se concede licencia sobre ellos.

