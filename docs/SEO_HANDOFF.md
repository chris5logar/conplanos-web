# SEO Handoff · conplanos.com

Estado real del proyecto. Actualizar al terminar cada tarea importante. Historial en `SEO_WORKLOG.md`; decisiones en `SEO_DECISIONS.md`; reglas en `../AGENTS.md`.

Última actualización: 2026-10-13, Claude Code.

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

- Nombre: CON PLANOS. Ficha verificada.
- Web: https://conplanos.com
- Teléfono: +51 928 400 600. WhatsApp configurado.
- Categoría principal: Ingeniero. Sin categorías secundarias en la última revisión.
- Descripción actualizada. 10 servicios cargados (la web tiene 9 páginas de servicio; la correspondencia no está documentada).
- 0 reseñas en la última auditoría.
- No cambiar automáticamente la categoría principal ni otros datos sensibles.

## Trabajo en curso: Fase 1 SEO técnica

- Rama: `fix/seo-url-canonical-404`
- PR: #1 «fix: align canonical URLs and 404 SEO», base `main`, en borrador. No hacer merge sin aprobación.
- Commit técnico: `3539a01`
- Commit de documentación: «docs: add cross-agent SEO handoff» (el siguiente a `3539a01` en la rama).

### Terminado

- Política única de URL con barra final en canonical, og:url, BreadcrumbList, sitemap y enlaces internos.
- `_redirects`: 19 reglas 301 directas (`/index.html` y, por servicio, variante sin barra e `/index.html`).
- 404 con `noindex, follow`, sin canonical, og:url ni JSON-LD comercial.
- `scripts/check.mjs` ampliado y `scripts/seo.test.mjs` (21 pruebas, `npm test`).
- Documentación de continuidad: `AGENTS.md`, `CLAUDE.md`, `docs/SEO_HANDOFF.md`, `docs/SEO_DECISIONS.md`, `docs/SEO_WORKLOG.md`.
- `docs/ENTREGA.md` y `docs/PRUEBAS.md` actualizados con la política actual.

### Validado el 2026-10-13

Pruebas locales sobre `3539a01` (Node 24.19.0 del runtime de Codex): `check.mjs` OK en producción con 1612 validaciones; `seo.test.mjs` 21 de 21. Build de producción y build de preview ejecutados en una copia temporal, ambos con check OK. Detalle en el worklog.

Preview https://fix-seo-url-canonical-404.conplanos-web.pages.dev, por HTTP:

| Comprobación | Resultado |
| --- | --- |
| 10 URLs finales con barra | 200; canonical y og:url iguales a `https://conplanos.com/<ruta>/` |
| 9 variantes sin barra | 301 directo a la URL con barra |
| 9 variantes `/<slug>/index.html` y `/index.html` | 301 directo a la URL final |
| `/no-existe-xyz/` y `/no-existe-xyz` | 404; `noindex, follow`; sin canonical ni og:url |
| `/404` | 200 (comportamiento de Cloudflare Pages); `noindex, follow`; sin canonical |
| `/404/` y `/404.html` | 308 a `/404` |
| `sitemap.xml` | 200, `application/xml`, 10 URLs con barra, origen conplanos.com |
| `robots.txt` | 200, `Allow: /` y `Sitemap: https://conplanos.com/sitemap.xml` |

### Bloqueo antes del merge

La preview de Cloudflare se compiló en modo producción, no en modo preview:

- `<meta name="robots" content="index, follow">` en las 10 páginas, en lugar de `noindex, nofollow`.
- GA4 `G-7DCRJN061J` cargado y configurado en las 10 páginas y en el 404.
- `robots.txt` con `Allow: /` en lugar de `Disallow: /`.

Causa: Cloudflare Pages ejecuta `node scripts/build.mjs` sin `SITE_MODE=preview` en el entorno Preview.

Atenuante: Cloudflare añade por su cuenta `x-robots-tag: noindex` a los despliegues `*.pages.dev` de preview, así que no hay riesgo real de indexación. Lo que sí ocurre es que las visitas y clics en cualquier preview se registran en el GA4 de producción.

Esto no es un defecto del contenido que se publicaría en producción (ese HTML es justo el que se validó), pero incumple la política de preview y el propietario pidió tratarlo como bloqueo.

### Estado de producción (sin cambios)

conplanos.com sigue sirviendo `main` (`f961a40`), con el problema original: canonical sin barra, `/servicio/index.html` en dos saltos y 404 con `index, follow` y canonical a la portada. Se corrige al hacer merge del PR #1.

## Observaciones menores

- `dist/robots.txt` versionado termina con una línea en blanco extra respecto a lo que genera el build. Sin efecto: Cloudflare regenera el archivo al compilar.
- `node` no está en el PATH del equipo Windows del propietario; ver «Entorno» en `AGENTS.md`.

## Próximo paso

Pedir aprobación al propietario (aún no dada: es un cambio de código) y, con ella, hacer que las previews de Cloudflare Pages se compilen en modo preview: en `scripts/build.mjs`, activar el modo preview cuando `CF_PAGES_BRANCH` exista y no sea `main`, usando `CF_PAGES_URL` como origen de canonical, og:url y sitemap, igual que hace hoy `SITE_MODE=preview`; añadir la prueba correspondiente, hacer push a `fix/seo-url-canonical-404` y volver a comprobar en la preview: `noindex, nofollow`, sin GA4, `robots.txt` con `Disallow: /` y cabecera `X-Robots-Tag: noindex, nofollow`. Después de eso el PR #1 queda listo para revisión de merge.

Lo que el HTML de producción publicará (canonical a conplanos.com, `index, follow`, GA4) ya quedó validado en la preview actual y lo cubren `check.mjs` y las pruebas; una vez corregido el modo, la preview dejará de mostrarlo.

No hay fases posteriores definidas. Tras el merge del PR #1, el orquestador decide la siguiente.
