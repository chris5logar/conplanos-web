# SEO Handoff · conplanos.com

Estado real del proyecto. Actualizar al terminar cada tarea importante. Historial en `SEO_WORKLOG.md`; decisiones en `SEO_DECISIONS.md`; reglas en `../AGENTS.md`.

Última actualización: 2026-10-13, Claude Code, tras validar producción en `efe9ee1`.

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

El propietario no ha asignado cada página a una prioridad. Como referencia, la web agrupa los servicios en tres áreas: Topografía y geodesia (`levantamientos-topograficos`, `puntos-geodesicos`), Proyectos y obras (`proyectos-construccion`, `ejecucion-obra`, `habilitaciones-urbanas`) y Saneamiento y propiedad (`titulaciones`, `comunidades-campesinas`, `declaratoria-fabrica`, `asesoramiento-legal`). Qué páginas cuentan como «Ingeniería» debe confirmarlo el propietario antes de priorizar contenido.

## Arquitectura

- HTML estático generado por `scripts/build.mjs`, sin dependencias.
- Portada + 9 páginas de servicio + 404. Slugs en `content/services.json`: `proyectos-construccion`, `ejecucion-obra`, `levantamientos-topograficos`, `titulaciones`, `comunidades-campesinas`, `declaratoria-fabrica`, `puntos-geodesicos`, `habilitaciones-urbanas`, `asesoramiento-legal`.
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

## Otros trabajos abiertos

- PR #2 «feat: contenido de servicios, guías y datos estructurados (Fase 2 SEO)», rama `seo/plan-crecimiento-organico`, base `main`, en borrador. No lo abrió ni lo revisó este agente. No tocarlo sin orden del propietario.

## Observaciones menores

- `dist/robots.txt` versionado termina con una línea en blanco extra respecto a lo que genera el build. Sin efecto: Cloudflare regenera el archivo al compilar.
- `node` no está en el PATH del equipo Windows del propietario; ver «Entorno» en `AGENTS.md`.
- No se comprobó en el panel de Cloudflare si hay variables `SITE_MODE` o `SITE_ORIGIN` definidas. Por los resultados no las hay. Si `SITE_MODE=preview` se definiera para Producción, `main` saldría sin indexar: no definirla ahí.
- Google puede tardar en recoger los canonical nuevos; en Search Console pueden verse durante un tiempo las URLs sin barra como «Página con redirección». Es lo esperado.
- Preguntas abiertas para el propietario: qué páginas cuentan como «Ingeniería», y por qué GBP tiene 10 servicios frente a 9 páginas.

## Próximo paso

El orquestador decide cómo continuar con la Fase 2 (PR #2, en borrador). Hasta esa orden, ningún agente modifica ese PR ni `main`.
