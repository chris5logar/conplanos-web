# SEO Handoff · conplanos.com

Estado real del proyecto. Actualizar al terminar cada tarea importante. Historial en `SEO_WORKLOG.md`; decisiones en `SEO_DECISIONS.md`; reglas en `../AGENTS.md`.

Última actualización: 2026-10-13, Claude Code, tras el commit `a37144d`.

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
- PR: #1 «fix: align canonical URLs and 404 SEO», base `main`, en borrador. No hacer merge sin aprobación expresa del propietario.
- Commits de la rama sobre `main` (`f961a40`):
  - `3539a01` fix: align canonical URLs and 404 SEO
  - `b69c0fa` docs: add cross-agent SEO handoff
  - `a37144d` fix: auto-detect Cloudflare preview mode
  - el commit de documentación que registra esta validación (el último de la rama, ver `git log`)

### Terminado

- Política única de URL con barra final en canonical, og:url, BreadcrumbList, sitemap y enlaces internos.
- `_redirects`: 19 reglas 301 directas (`/index.html` y, por servicio, variante sin barra e `/index.html`).
- 404 sin canonical, og:url ni JSON-LD comercial; `noindex, follow` en producción.
- Modo automático en Cloudflare Pages (`scripts/site-mode.mjs`): `CF_PAGES_BRANCH` igual a `main` compila producción; cualquier otra rama compila preview con `CF_PAGES_URL` como origen. Sin esa variable (local) nada cambia: producción salvo `SITE_MODE=preview`.
- `scripts/check.mjs` ampliado y `scripts/seo.test.mjs` con 25 pruebas (`npm test`).
- Documentación de continuidad y `docs/ENTREGA.md`, `docs/PRUEBAS.md` y `README.md` al día.

### Validado el 2026-10-13

Pruebas locales sobre `a37144d` (Node 24.19.0 del runtime de Codex): `check.mjs` OK en producción con 1612 validaciones; `seo.test.mjs` 25 de 25. En una copia temporal: build de producción idéntico al `dist/` versionado, build simulando Cloudflare `main` idéntico al de producción, build simulando una rama de Cloudflare en modo preview con check OK, y `build-preview` + `check --preview` OK.

El HTML de producción (canonical a `https://conplanos.com/<ruta>/`, `index, follow`, GA4) se validó por HTTP en la preview de `3539a01`, antes de la detección automática; el detalle está en el worklog. Ese HTML no cambió: el build de producción sigue reproduciendo el mismo `dist/`.

Preview de `a37144d`, por HTTP, en https://fix-seo-url-canonical-404.conplanos-web.pages.dev (despliegue https://4e7ab4ea.conplanos-web.pages.dev):

| Comprobación | Resultado |
| --- | --- |
| 10 URLs finales con barra | 200; `noindex, nofollow`; sin GA4; canonical = og:url = URL del despliegue + ruta con barra |
| 9 variantes sin barra | 301 directo a la URL con barra |
| 9 variantes `/<slug>/index.html` y `/index.html` | 301 directo a la URL final |
| `/no-existe-xyz/` y `/no-existe-xyz` | 404; `noindex, nofollow`; sin canonical ni og:url; sin GA4 |
| `/404` | 200 (comportamiento de Cloudflare Pages); `noindex, nofollow`; sin canonical |
| `/404/` | 308 a `/404` |
| `sitemap.xml` | 200, `application/xml`, 10 URLs con barra, origen del despliegue |
| `robots.txt` | 200, `User-agent: *` y `Disallow: /` |
| Cabecera | `x-robots-tag: noindex, nofollow` en todas las respuestas |

En una preview el canonical apunta a la URL del despliegue (`https://<hash>.conplanos-web.pages.dev`), no al alias de la rama. Es coherente con og:url y sitemap y la página no es indexable.

### Bloqueos

Ninguno técnico. El bloqueo anterior (previews compiladas como producción, con `index, follow` y GA4) quedó resuelto en `a37144d` y verificado en la preview real.

### Estado de producción (sin cambios)

conplanos.com sigue sirviendo `main` (`f961a40`), con el problema original: canonical sin barra, `/servicio/index.html` en dos saltos y 404 con `index, follow` y canonical a la portada. Se corrige al hacer merge del PR #1. Comprobado el 2026-10-13 que la portada de producción sigue con `index, follow`, canonical `https://conplanos.com/` y GA4.

## Observaciones menores

- `dist/robots.txt` versionado termina con una línea en blanco extra respecto a lo que genera el build. Sin efecto: Cloudflare regenera el archivo al compilar.
- `node` no está en el PATH del equipo Windows del propietario; ver «Entorno» en `AGENTS.md`.
- No se comprobó en el panel de Cloudflare si hay variables `SITE_MODE` o `SITE_ORIGIN` definidas. Por el resultado de la preview no las hay en el entorno Preview. Si `SITE_MODE=preview` estuviera definida para Producción, `main` saldría sin indexar: no definirla ahí.
- Preguntas abiertas para el propietario: qué páginas cuentan como «Ingeniería», y por qué GBP tiene 10 servicios frente a 9 páginas.

## Próximo paso

El propietario revisa el PR #1, lo pasa de borrador a listo y hace el merge a `main`. Ningún agente hace ese merge sin su orden expresa.

Inmediatamente después del merge, el agente de turno verifica en https://conplanos.com: las 10 URLs con 200, canonical con barra, `index, follow`, GA4 presente, redirecciones en un salto, 404 con `noindex, follow`, y `sitemap.xml` y `robots.txt` de producción. Luego registra el resultado en el worklog.

No hay fases posteriores definidas. Tras esa verificación, el orquestador decide la siguiente.
