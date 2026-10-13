# Registro de trabajo SEO

Append-only: añadir entradas nuevas al final y no reescribir las anteriores. Una entrada por tarea importante.

## 2026-10-13 — Auditoría SEO técnica y Fase 1 (URLs canónicas y 404)

- Agente: ChatGPT Codex. Entrada reconstruida por Claude Code a partir del repositorio y de lo informado por el orquestador; lo marcado como «reportado» no fue presenciado por Claude.
- Objetivo: alinear las URLs canónicas con la URL que realmente sirve Cloudflare Pages y corregir el SEO de la página 404.
- Rama: `fix/seo-url-canonical-404` (creada desde `main`).
- Commit inicial: `f961a40`
- Trabajo realizado:
  - Auditoría previa (reportada): canonical, og:url y BreadcrumbList de los servicios sin barra final mientras el sitio servía la URL con barra; `/servicio/index.html` redirigía en dos saltos; la 404 era `index, follow` con canonical a la portada.
  - `scripts/build.mjs`: política única `publicPath`/`publicUrl` con barra final para canonical, og:url, BreadcrumbList, sitemap y enlaces internos; origen normalizado sin barra final; 404 con `noindex, follow`, sin canonical, og:url ni JSON-LD; `_redirects` con variante sin barra e `/index.html` por servicio.
  - `scripts/check.mjs`: comprobaciones de canonical, og:url, breadcrumbs, sitemap, enlaces internos que redirigen, redirecciones, robots por modo, 404 y GA4 duplicado.
  - `scripts/seo.test.mjs`: nuevo, 21 pruebas con archivos temporales.
  - `package.json`: script `test`.
  - `README.md`: sección «Política y validación técnica SEO».
- Archivos modificados: `README.md`, `package.json`, `scripts/build.mjs`, `scripts/check.mjs`, `scripts/seo.test.mjs`, `dist/_redirects`, `dist/404.html`, `dist/index.html` y los 9 `dist/<slug>/index.html` (17 archivos, +291 −46).
- Pruebas: Codex reportó haber ejecutado `npm run build`, `npm run check`, `npm run build:preview`, `npm run check:preview` y `npm test` con resultado correcto.
- Resultado: implementado. PR #1 «fix: align canonical URLs and 404 SEO» abierto en borrador contra `main`. Cloudflare creó la preview del commit.
- Commit final: `3539a01bbd1e64ce1933f7233ade9a399eff326c`
- Pendientes: documentación de continuidad; actualizar `docs/ENTREGA.md` y `docs/PRUEBAS.md`; registrar la validación completa de la preview.
- Siguiente paso: completar documentación y validación de preview.

## 2026-10-13 — Documentación de continuidad y validación de la preview

- Agente: Claude Code.
- Objetivo: dejar el proyecto retomable por cualquier agente sin contexto previo y completar la validación de la preview del PR #1. Sin cambios de código ni de `dist/`.
- Rama: `fix/seo-url-canonical-404`
- Commit inicial: `3539a01`
- Trabajo realizado:
  - Diagnóstico inicial: rama al día con `origin`, working tree limpio, sin archivos sin versionar; Codex no dejó cambios sin confirmar.
  - Creados `AGENTS.md`, `CLAUDE.md`, `docs/SEO_HANDOFF.md`, `docs/SEO_DECISIONS.md` y `docs/SEO_WORKLOG.md`.
  - `docs/ENTREGA.md`: rutas de servicio con barra final, política canonical/404, modos preview y producción, comandos de validación, GA4 activo.
  - `docs/PRUEBAS.md`: sección de verificación de la Fase 1.
  - Prueba de handoff con un agente sin contexto leyendo solo `AGENTS.md`, `CLAUDE.md`, `docs/SEO_HANDOFF.md` y `docs/SEO_DECISIONS.md`: identificó proyecto, web, repositorio, rama de producción, trabajo en curso, lo terminado, prioridades, límites y siguiente paso. Señaló huecos que se corrigieron: comandos sin `npm`, cómo compilar en una copia temporal, qué archivos de `dist/` son fuente, alcance completo del modo preview, permiso de commit y push, y que la aprobación del siguiente paso aún no está dada. Quedan dos preguntas para el propietario, anotadas en el handoff: qué páginas cuentan como «Ingeniería» y por qué GBP tiene 10 servicios frente a 9 páginas.
- Archivos modificados: `AGENTS.md`, `CLAUDE.md`, `docs/SEO_HANDOFF.md`, `docs/SEO_DECISIONS.md`, `docs/SEO_WORKLOG.md` (nuevos); `docs/ENTREGA.md`, `docs/PRUEBAS.md`.
- Pruebas:
  - Entorno: `node`, `npm` y `gh` no están en el PATH. Se usó por ruta completa, sin instalar nada ni cambiar el PATH, el Node 24.19.0 que Codex dejó en `%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`. Los scripts se invocaron con `node` directamente, no a través de `npm`.
  - `node scripts/check.mjs` sobre el `dist/` versionado: OK (producción), 1612 validaciones, 11 documentos HTML.
  - `node --test scripts/seo.test.mjs`: 21 pruebas, 21 correctas.
  - `node scripts/build.mjs` y `node scripts/build-preview.mjs` no se ejecutaron en el repositorio para no reescribir `dist/`. Se ejecutaron en una copia temporal: ambos build correctos y `check.mjs` OK en producción y en `--preview`. El build de producción reproduce el `dist/` versionado salvo una línea en blanco final de `robots.txt`.
  - Preview https://fix-seo-url-canonical-404.conplanos-web.pages.dev por HTTP (curl, solo GET):
    - `/` y las 9 URLs de servicio con barra: 200; canonical = og:url = `https://conplanos.com/<ruta>/` en las 10.
    - 9 variantes sin barra: 301 directo a la URL con barra.
    - 9 variantes `/<slug>/index.html` y `/index.html`: 301 directo a la URL final.
    - `/no-existe-xyz/` y `/no-existe-xyz`: 404, `noindex, follow`, sin canonical ni og:url.
    - `/404`: 200, `noindex, follow`, sin canonical. `/404/` y `/404.html`: 308 a `/404`.
    - `sitemap.xml`: 200, `application/xml; charset=utf-8`, 10 URLs con barra.
    - `robots.txt`: 200, `Allow: /`, `Sitemap: https://conplanos.com/sitemap.xml`.
    - Robots meta en las 10 páginas: `index, follow`. GA4 `G-7DCRJN061J` presente en las 10 páginas y en el 404. Cabecera `x-robots-tag: noindex` añadida por Cloudflare en todas las respuestas.
  - No verificado: estado del PR #1 en GitHub (sin `gh` ni acceso a la API en esta sesión); envío real de eventos a GA4 desde la preview (solo se comprobó que el código está en el HTML); producción no se usó para esta validación.
- Resultado: URLs, redirecciones, 404, sitemap y robots correctos para producción. Bloqueo: la preview de Cloudflare se compila en modo producción (`index, follow`, GA4 activo, `robots.txt` abierto), contra la política de preview. Cloudflare evita la indexación con su cabecera, pero el tráfico de preview llega al GA4 de producción.
- Commit final: el commit «docs: add cross-agent SEO handoff» que sigue a `3539a01` en la rama (ver `git log`).
- Pendientes: corregir el modo de compilación de las previews; revisión y merge del PR #1 por el propietario.
- Siguiente paso: con aprobación, activar el modo preview en `scripts/build.mjs` cuando `CF_PAGES_BRANCH` no sea `main` y revalidar la preview.

## 2026-10-13 — Modo preview automático en Cloudflare Pages

- Agente: Claude Code.
- Objetivo: que las previews de Cloudflare Pages se compilen en modo preview (`noindex, nofollow`, sin GA4) sin alterar producción. Cambio aprobado por el propietario.
- Rama: `fix/seo-url-canonical-404`
- Commit inicial: `b69c0fa`
- Trabajo realizado:
  - Confirmadas en la documentación oficial de Cloudflare Pages las variables de build `CF_PAGES`, `CF_PAGES_COMMIT_SHA`, `CF_PAGES_BRANCH` y `CF_PAGES_URL`.
  - Nuevo `scripts/site-mode.mjs` con la regla única: preview si `SITE_MODE=preview` o si `CF_PAGES_BRANCH` existe y no es `main`. En una preview de Cloudflare expone `CF_PAGES_URL` como origen.
  - `scripts/build.mjs` y `scripts/check.mjs` usan esa regla. Orden del origen: `SITE_ORIGIN`, luego `CF_PAGES_URL` en previews de Cloudflare, luego el valor por defecto de siempre.
  - Sin cambios en textos, diseño, eventos GA4 ni en el `dist/` versionado.
- Archivos modificados: `scripts/site-mode.mjs` (nuevo), `scripts/build.mjs`, `scripts/check.mjs`, `scripts/seo.test.mjs`, `README.md`, `AGENTS.md`, `docs/ENTREGA.md`, `docs/PRUEBAS.md`, `docs/SEO_DECISIONS.md`, `docs/SEO_HANDOFF.md`, `docs/SEO_WORKLOG.md`.
- Pruebas (Node 24.19.0 del runtime de Codex, por ruta completa, scripts invocados con `node`):
  - 4 pruebas nuevas en `seo.test.mjs`: Cloudflare `main` da `index, follow`, GA4 y canonical a conplanos.com; Cloudflare en otra rama da `noindex, nofollow`, sin GA4, `Disallow: /` y cabecera noindex; `SITE_ORIGIN` sigue teniendo prioridad; build local sin variables de Cloudflare sigue en producción. El fixture ahora limpia las variables `CF_PAGES*`.
  - `node --test scripts/seo.test.mjs`: 25 de 25.
  - `node scripts/check.mjs` sobre el `dist/` versionado: OK (producción), 1612 validaciones.
  - En copia temporal: build de producción idéntico al `dist/` versionado (salvo la línea en blanco final de `robots.txt` ya conocida); build con `CF_PAGES_BRANCH=main` idéntico al de producción; build con `CF_PAGES_BRANCH=fix/seo-url-canonical-404` en modo preview y check OK; `build-preview.mjs` + `check.mjs --preview` OK.
  - Preview real tras el push, https://fix-seo-url-canonical-404.conplanos-web.pages.dev (despliegue `4e7ab4ea`), por HTTP: 10 URLs con 200, `noindex, nofollow`, sin rastro de GA4, canonical = og:url = URL del despliegue con barra; 18 de 18 redirecciones de servicio y `/index.html` con 301 directo; rutas inexistentes con 404 y `noindex, nofollow`; `/404` 200 y `/404/` 308; `sitemap.xml` con 10 URLs; `robots.txt` con `Disallow: /`; cabecera `x-robots-tag: noindex, nofollow`.
  - Producción comprobada sin cambios: portada con `index, follow`, canonical `https://conplanos.com/` y GA4.
  - No verificado: el panel de Cloudflare (variables de entorno del proyecto); el build de producción real en Cloudflare con `CF_PAGES_BRANCH=main`, que solo ocurre al hacer merge y aquí está cubierto por prueba y simulación.
- Resultado: bloqueo resuelto. PR #1 abierto, en borrador, sin merge.
- Commit final: `a37144d` (código y documentación de comportamiento) más el commit de documentación que añade esta entrada.
- Pendientes: revisión y merge del PR #1 por el propietario; verificación de producción después del merge.
- Siguiente paso: el propietario decide el merge del PR #1.

## 2026-10-13 — Merge del PR #1 y validación de producción

- Agente: Claude Code (validación). El merge lo hizo el propietario.
- Objetivo: confirmar en https://conplanos.com que la Fase 1 quedó publicada correctamente. Solo lectura sobre producción; sin cambios de código.
- Rama: `main` (producción). Rama local de trabajo sin cambios de código.
- Commit inicial: `f961a40` (`main` antes del merge).
- Trabajo realizado:
  - Un primer aviso de merge a las 18:18 UTC no se correspondía con GitHub: el PR #1 seguía abierto y en borrador, y `main` en `f961a40`. No se validó ni se documentó nada entonces.
  - Merge real del PR #1 a las 18:47:14 UTC. Merge commit `efe9ee1ff18c233dfedd669fa0be73da118c00fb`.
  - Despliegue de Producción en Cloudflare Pages para `efe9ee1`: correcto, completado a las 18:47:31 UTC (despliegue `7a8951fb`), según el check «Cloudflare Pages» de GitHub.
  - Validación HTTP de producción a las 18:50 UTC.
- Archivos modificados: `docs/SEO_HANDOFF.md`, `docs/SEO_WORKLOG.md`.
- Pruebas (curl, solo GET, contra https://conplanos.com):
  - Portada y 9 servicios con barra: 200 las 10; `index, follow`; ningún `noindex`.
  - canonical = `https://conplanos.com/<ruta>/` y og:url = canonical en las 10.
  - BreadcrumbList en los 9 servicios con `https://conplanos.com/` y la URL final con barra.
  - 18 de 18 variantes de servicio (sin barra e `/index.html`) con 301 directo; `/index.html` con 301 a `/`; cadena de un solo salto.
  - `sitemap.xml`: 200, 10 URLs, las 10 con barra. `robots.txt`: 200, `Allow: /`, `Sitemap: https://conplanos.com/sitemap.xml`.
  - `/no-existe-xyz/` y `/no-existe-xyz`: 404, `noindex, follow`, sin canonical, og:url ni JSON-LD. `/404`: 200 con `noindex, follow`. `/404/`: 308 a `/404`.
  - GA4 `G-7DCRJN061J`: una etiqueta y una configuración en cada una de las 10 páginas; sin GTM.
  - `assets/main.js`: `click_whatsapp`, `click_phone` y `quote_request` una vez cada uno; sin datos de contacto.
  - `www.conplanos.com` y `http://` redirigen con 301 a `https://conplanos.com/`.
  - No verificado: panel de Cloudflare (se usó el check de GitHub); llegada real de eventos a GA4; Search Console.
- Resultado: Fase 1 cerrada, sin incidencias en producción.
- Commit final: `efe9ee1` en `main`. La actualización de esta documentación va en un commit posterior de solo documentación.
- Pendientes: ninguno de la Fase 1. Seguimiento recomendado en Search Console de la recogida de los canonical nuevos.
- Siguiente paso: el orquestador decide sobre la Fase 2 (PR #2, en borrador).

## 2026-10-13 — Fase 3: velocidad y Core Web Vitals (primer PR)

- Agente: Claude Code.
- Objetivo: medir el rendimiento y aplicar las mejoras de más impacto sin cambiar textos ni diseño. Autorizado por el prompt maestro del propietario (fases 3 a 6) y su «continúa» del 2026-10-13.
- Rama: `perf/core-web-vitals`, desde `main` (`6946b7b`). Independiente del PR #2.
- Línea base (Lighthouse 13.5.0, perfil móvil simulado, servidor local sin compresión ni cabeceras de Cloudflare): portada rendimiento 98, LCP 2,4 s; `/proyectos-construccion/` 100, LCP 1,7 s; `/levantamientos-topograficos/` 96, LCP 2,7 s. CLS 0 y TBT 0 ms en las tres. Accesibilidad 100, SEO 100, buenas prácticas 96 (solo por el error de red de GA4 en el entorno del agente).
- Trabajo realizado:
  - Imágenes: variantes intermedias `conplanos-visita-tecnica-predio-rural-640/960.webp` y `conplanos-medicion-gnss-campo-600.webp` (WebP calidad 80, a partir de las versiones existentes). En móvil la portada pasa a descargar 640 px (113 KB) en lugar de 800 px (185 KB) con DPR 1,75. No se borró ningún archivo.
  - Logo de cabecera y pie: `conplanos-logo-360.webp` (6 KB) y `-600.webp` (12 KB) con srcset en lugar de 1100 px (31 KB) en todas las páginas. El logo de JSON-LD sigue siendo el original.
  - Accesibilidad: el enlace de la marca incluía texto visible («Registra y construye») fuera de su nombre accesible; ahora lo incluye.
  - Caché: `styles.css` con versión por hash como `main.js`; ambos con `max-age=31536000, immutable`; imágenes y marca con 7 días. Se eliminó la regla genérica `/assets/*` para que no se solape (Cloudflare une los valores de reglas que coinciden).
  - `check.mjs`: valida la versión de la hoja de estilos y que solo los archivos versionados sean inmutables, sin reglas solapadas. `seo.test.mjs`: 2 regresiones nuevas (27 pruebas).
- Pruebas (Node 22.22.0): `npm run build` y `npm run check` OK (1702 validaciones); `npm run build:preview` y `npm run check:preview` OK en copia temporal; `npm test` 27/27. Lighthouse después: portada 99, LCP 2,3 s; topografía 97, LCP 2,6 s; proyectos 100; aviso de nombre accesible resuelto. Captura móvil a 3x de la cabecera correcta.
- No verificado: PageSpeed Insights sobre producción (la API responde 429 sin clave desde el entorno del agente) ni datos de campo de CrUX. Las cifras son de laboratorio local, sin la compresión ni la caché de Cloudflare.
- Resultado: margen de mejora técnico pequeño; la web ya era rápida. Lo que más pesa ahora son las fotos de campo (vegetación con mucho detalle); la mejora real requiere originales de mayor calidad exportados según `docs/IMAGENES.md`.
- Siguiente paso: revisión del PR y validación de la preview (cabeceras de caché por HTTP).

## 2026-10-13 — Fase 3: validación HTTP de la preview del PR #4

- Agente: Claude Code (curl de solo lectura desde el equipo del propietario; el contenedor no alcanza `*.pages.dev`).
- Preview: `https://58fc57e4.conplanos-web.pages.dev` (commit `19cc825`).
- Resultado, todo correcto:
  - `/` y `/levantamientos-topograficos/`: 200, `noindex, nofollow` en meta y `X-Robots-Tag`, sin GA4, canonical = og:url de la preview, `nosniff` y `SAMEORIGIN`.
  - `/assets/styles.css?v=629294dcc573` y `/assets/main.js?v=c20b25d30fed`: `Cache-Control: public, max-age=31536000, immutable`, un solo valor (sin reglas solapadas).
  - Variantes nuevas de `projects/` y `brand/` y `favicon.svg`: 200 y `public, max-age=604800`.
  - HTML: `public, max-age=0, must-revalidate`.
  - `/sitemap.xml` con 10 URLs; `/no-existe-xyz/` devuelve 404.
- Siguiente paso: aprobación de merge del propietario; después, PageSpeed Insights sobre producción.

## 2026-10-13 — Nombre alternativo «CON PLANOS» en los datos estructurados

- Agente: Claude Code.
- Objetivo: aplicar la decisión del propietario de usar los dos nombres («quiero usar los 2. conplanos y con planos»).
- Rama: `seo/nombre-alternativo`, desde `main` (`6946b7b`).
- Cambios: `alternateName: "CON PLANOS"` en el JSON-LD `ProfessionalService`; `check.mjs` valida `name` y `alternateName`; `seo.test.mjs` añade una regresión (falta el nombre alternativo). Sin cambios de texto visible ni en Google Business.
- Pruebas (Node 22.22.0): `npm run build` y `npm run check` OK (1632 validaciones); `npm run build:preview` y `npm run check:preview` OK en copia temporal; `npm test` 26/26.
- Siguiente paso: revisión y merge del PR. Validar en producción con la prueba de resultados enriquecidos de Google.

## 2026-10-13 — Fase 4: paquete de SEO local y Google Business Profile

- Agente: Claude Code.
- Objetivo: preparar todo lo que el propietario necesita para la ficha de Google sin que ningún agente la modifique.
- Rama: `docs/seo-local-gbp`, desde `main` (`6946b7b`). Solo documentación.
- Trabajo realizado: `docs/SEO_LOCAL_GBP.md` con coherencia de datos (incluida la diferencia «CONPLANOS» / «CON PLANOS»), enlace con UTM, propuesta de categorías secundarias, correspondencia de los 10 servicios de la ficha con las 9 páginas y descripciones de hasta 300 caracteres, programa de reseñas con plantillas, fotos, cuatro publicaciones por prioridad comercial, directorios y un registro de cambios de la ficha.
- Pruebas: sin cambios de código ni de `dist/`; `npm run check` OK sobre el `dist/` de `main`.
- Resultado: pendiente de revisión del propietario. Ningún cambio aplicado en la ficha.
- Siguiente paso: el propietario decide el nombre único y las categorías secundarias, y empieza a pedir reseñas.
