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
