# SEO Handoff · conplanos.com

Estado real del proyecto. Actualizar al terminar cada tarea importante. Historial en `SEO_WORKLOG.md`; decisiones en `SEO_DECISIONS.md`; reglas en `../AGENTS.md`.

Última actualización: 2026-10-13, Claude Code, tras sincronizar el PR #2 con `main` y aplicar la revisión legal del propietario.

## Proyecto

- Web: https://conplanos.com
- Repositorio: `chris5logar/conplanos-web`
- Hosting: Cloudflare Pages (build `node scripts/build.mjs`, salida `dist`)
- Producción: rama `main`
- Fuera de alcance: app.conplanos.com, conplanos-app, GNSS, LeicaAgent, CAD, DNS, Render, Neon

## Prioridad comercial

1. Ingeniería
2. Construcción
3. Saneamiento de predios
4. Declaratoria de fábrica

Asignación de páginas por defecto (decisión «asignación de páginas a la prioridad comercial» en `SEO_DECISIONS.md`, pendiente de confirmación del propietario): Ingeniería = `levantamientos-topograficos`, `puntos-geodesicos`, `habilitaciones-urbanas`; Construcción = `proyectos-construccion`, `ejecucion-obra`; Saneamiento = `titulaciones`, `comunidades-campesinas`, `asesoramiento-legal`; Declaratoria = `declaratoria-fabrica`. No crear una landing «Ingeniería» sin analizar antes intención de búsqueda y canibalización.

## Arquitectura

- HTML estático generado por `scripts/build.mjs`, sin dependencias.
- En producción: portada + 9 páginas de servicio + 404 (el PR #2 añade `/guias/` y 4 guías). Slugs en `content/services.json`: `proyectos-construccion`, `ejecucion-obra`, `levantamientos-topograficos`, `titulaciones`, `comunidades-campesinas`, `declaratoria-fabrica`, `puntos-geodesicos`, `habilitaciones-urbanas`, `asesoramiento-legal`.
- `sitemap.xml` (10 URLs), `robots.txt`, `_headers`, `_redirects`.
- JSON-LD `ProfessionalService` en todas las páginas comerciales y `BreadcrumbList` en los servicios.
- Imágenes WebP con srcset y lazy loading.
- GA4 directo.

## Search Console (último estado conocido, informado por el propietario el 2026-10-13, no verificado por un agente)

- Propiedad conplanos.com verificada.
- Sitemap aceptado: https://conplanos.com/sitemap.xml
- Última referencia conocida: 10 URLs.

## GA4

- ID de medición: `G-7DCRJN061J`.
- Eventos funcionando: `click_whatsapp`, `click_phone`, `quote_request`.
- `quote_request` y `click_whatsapp` pueden proceder del mismo clic (los botones de cotización abren WhatsApp). No son automáticamente dos leads: no sumarlos.
- Sin PII en los eventos.

## Google Business Profile (último estado conocido, informado por el propietario el 2026-10-13, no verificado por un agente)

- Nombre: CON PLANOS. Ficha verificada. Se mantiene: el propietario decidió usar los dos nombres (ver SEO_DECISIONS, 2026-10-13); la web declara «CON PLANOS» como `alternateName`.
- Web: https://conplanos.com
- Teléfono: +51 928 400 600. WhatsApp configurado.
- Categoría principal: Ingeniero. Sin categorías secundarias en la última revisión.
- Descripción actualizada. 10 servicios cargados (la web tiene 9 páginas de servicio; la correspondencia no está documentada).
- 0 reseñas en la última auditoría.
- No cambiar automáticamente la categoría principal ni otros datos sensibles.

## Fase 1 SEO técnica: CERRADA

- PR #1 «fix: align canonical URLs and 404 SEO» mergeado a `main` por el propietario el 2026-10-13 a las 18:47 UTC.
- Commit de `main` en producción: `efe9ee1` (merge commit de `3539a01`, `b69c0fa`, `a37144d` y `f1b7906`).
- Cloudflare Pages: despliegue de Producción de `efe9ee1` correcto, completado el 2026-10-13 a las 18:47 UTC (despliegue `7a8951fb`). Leído del check «Cloudflare Pages» en GitHub; el panel de Cloudflare no se abrió.
- La rama `fix/seo-url-canonical-404` ya está integrada: no reutilizarla para trabajo nuevo.

### Qué quedó en producción

- Política única de URL con barra final en canonical, og:url, BreadcrumbList, sitemap y enlaces internos.
- `_redirects`: 19 reglas 301 directas.
- 404 con `noindex, follow`, sin canonical, og:url ni JSON-LD.
- Modo automático en Cloudflare Pages (`scripts/site-mode.mjs`): `main` compila producción; cualquier otra rama compila preview (`noindex, nofollow`, sin GA4).
- `scripts/check.mjs` y `scripts/seo.test.mjs` con 25 pruebas.

### Validación de producción, 2026-10-13 18:50 UTC

Por HTTP contra https://conplanos.com, sin incidencias:

| Comprobación | Resultado |
| --- | --- |
| Portada y 9 servicios con barra | 200 las 10 |
| 9 variantes sin barra | 301 directo a la URL con barra |
| 9 variantes `/<slug>/index.html` y `/index.html` | 301 directo a la URL final, un solo salto |
| canonical | `https://conplanos.com/<ruta>/` en las 10 |
| og:url | igual al canonical en las 10 |
| BreadcrumbList | en los 9 servicios: portada y URL final con barra |
| robots meta | `index, follow` en las 10; ningún `noindex` |
| `sitemap.xml` | 200, `application/xml`, exactamente 10 URLs, todas con barra |
| `robots.txt` | 200, `Allow: /`, `Sitemap: https://conplanos.com/sitemap.xml` |
| URL inexistente | 404, con y sin barra |
| Página 404 | `noindex, follow`, sin canonical, sin og:url, sin JSON-LD |
| `/404` | 200 (comportamiento de Cloudflare Pages), `noindex, follow`; `/404/` da 308 a `/404` |
| GA4 | `G-7DCRJN061J`: una etiqueta y una configuración por página; sin GTM |
| Eventos en `main.js` | `click_whatsapp`, `click_phone` y `quote_request`, una vez cada uno; sin datos de contacto |
| `www` y `http` | 301 a `https://conplanos.com/` |

No verificado: la recepción real de eventos en GA4 (no se hicieron clics de prueba) y el estado en Search Console.

## Fase 2 contenido y estructura SEO: CERRADA

- PR #2 «feat: contenido de servicios, guías y datos estructurados (Fase 2 SEO)» mergeado por el propietario en `main` (`2414e78`) el 2026-10-13, tras su revisión legal final (comentario en el PR #2). Producción validada por HTTP el mismo día y validación completa posterior (15 URLs, JSON-LD, redirecciones, preview, revisión visual y Lighthouse) sin errores (ver SEO_WORKLOG).
- Cualquier guía nueva o cambio en el texto legal de una guía requiere de nuevo la revisión del propietario antes del merge.
- Plan completo y roadmap de fases: `docs/SEO_PLAN.md`.
- Sincronizada con `main` (`6946b7b`) mediante merge, sin force push; los documentos de cierre de la Fase 1 se tomaron de `main`.
- Contenido: títulos orientados a la búsqueda (`seoTitle`), bloque «En qué consiste» y FAQs extra en los 9 servicios; sección `/guias/` con 4 guías en `content/guides.json` (licencia de edificación, declaratoria de fábrica, saneamiento físico legal, levantamiento topográfico).
- Datos estructurados: `Service` por servicio enlazado a `#business`; `Article` en guías; `CollectionPage` en `/guias/`; migas de tres niveles en guías.
- Sitemap: 15 URLs (portada, 9 servicios, índice de guías y 4 guías). `_redirects`: 29 reglas 301 directas.
- `check.mjs` y `seo.test.mjs` (28 pruebas) derivan el catálogo de `services.json` + `guides.json`.
- Revisión legal del propietario (comentario en el PR #2) aplicada: límite del 31/12/2016 para la vía Ley 27157/30830; modalidades A/B/C/D remitidas a la Ley 29090, reglamento vigente y TUPA; comunidades campesinas con Ley 24657 y modificatorias, autoridad agraria regional y papel técnico de CONPLANOS; WGS84/UTM, Ministerio de Cultura y requisitos municipales «según el caso».
- Preview de `df04c37` validada por HTTP el 2026-10-13 desde el equipo del propietario (detalle en el worklog): 15 URLs con 200, `noindex, nofollow`, sin GA4, canonical = og:url, redirecciones de `/guias/` en un salto, sitemap con 15 URLs, 404 correcto y JSON-LD `Service`/`Article`. El entorno cloud de Claude no puede abrir `*.pages.dev` ni `conplanos.com` (proxy 403).

## Fase 3 velocidad y Core Web Vitals: EN PRODUCCIÓN

- PR #4 (rama `perf/core-web-vitals`).
- Cambios: variantes de imagen intermedias, logo ligero con srcset, `styles.css` versionado, caché inmutable solo para `main.js` y `styles.css`, 7 días para imágenes, nombre accesible del enlace de la marca.
- Lighthouse móvil local: 96 a 100 antes y 97 a 100 después; CLS 0 y TBT 0. Sin datos de campo (CrUX/PSI) todavía.
- Preview `https://58fc57e4.conplanos-web.pages.dev` validada por HTTP desde el equipo del propietario: `styles.css?v=` y `main.js?v=` con `public, max-age=31536000, immutable` (un solo valor), imágenes y marca con `public, max-age=604800`, HTML con `max-age=0, must-revalidate`, noindex y sin GA4, sitemap 10 URLs, 404 correcto.
- PR #4 mergeado por el propietario en `main` (`217672f`) el 2026-10-13.
- Producción validada por HTTP el 2026-10-13 (ver SEO_WORKLOG): todo correcto salvo `main.js?v=c20b25d30fed`, que Cloudflare sigue sirviendo desde una copia de borde anterior al merge con `max-age=86400`. Se corrige solo al caducar (antes del 2026-10-14 ~17:00 UTC) o purgando esa URL en Cloudflare (acción del propietario). Sin efecto en SEO.
- Pendiente: medir con PageSpeed Insights / Search Console (Core Web Vitals) cuando haya datos.

## Observaciones menores

- `dist/robots.txt` versionado termina con una línea en blanco extra respecto a lo que genera el build. Sin efecto: Cloudflare regenera el archivo al compilar.
- `node` no está en el PATH del equipo Windows del propietario; ver «Entorno» en `AGENTS.md`.
- No se comprobó en el panel de Cloudflare si hay variables `SITE_MODE` o `SITE_ORIGIN` definidas. Por los resultados no las hay. Si `SITE_MODE=preview` se definiera para Producción, `main` saldría sin indexar: no definirla ahí.
- Google puede tardar en recoger los canonical nuevos; en Search Console pueden verse durante un tiempo las URLs sin barra como «Página con redirección». Es lo esperado.
- Preguntas abiertas para el propietario: confirmar la asignación de páginas a «Ingeniería»; GBP tiene 10 servicios (incluye «Lotizaciones y parcelaciones», que en la web cae dentro de `habilitaciones-urbanas`) frente a 9 páginas.

## Próximo paso

Fases 1 a 3 en producción y paquete de la Fase 4 entregado. Acciones del propietario: enviar de nuevo el sitemap en Search Console (15 URLs) y pedir la indexación de `/guias/` y de las 4 guías; aplicar en Google Business las categorías secundarias y empezar a pedir reseñas (`docs/SEO_LOCAL_GBP.md`); exportar CSV de Search Console y GA4 para la Fase 5. Opcional: purgar en Cloudflare `https://conplanos.com/assets/main.js?v=c20b25d30fed`. Ningún agente hace merge ni toca `main` sin aprobación expresa.
