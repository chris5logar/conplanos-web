# AGENTS.md · SEO Web CONPLANOS

Instrucciones comunes para cualquier agente (Claude Code, Codex, ChatGPT u otro) que trabaje en este repositorio. ChatGPT actúa como orquestador del proyecto; la continuidad entre agentes vive en estos archivos, no en las conversaciones.

## Qué es este proyecto

- Web: https://conplanos.com (web comercial estática de CONPLANOS, Cusco).
- Repositorio fuente de verdad: `chris5logar/conplanos-web`.
- Hosting: Cloudflare Pages. Build `node scripts/build.mjs`, salida `dist`.
- `main` = producción. Todo push a `main` se publica en conplanos.com.

## Qué NO es

No mezclar con, ni tocar desde aquí:

- app.conplanos.com ni el repositorio conplanos-app
- GNSS (conplanos-gnss)
- LeicaAgent
- CAD
- DNS, Render o Neon

## Antes de trabajar

Leer, en este orden:

1. `AGENTS.md` (este archivo)
2. `docs/PROJECT_HANDOFF.md` (arquitectura, publicación, ruta local y continuidad general)
3. `docs/SEO_HANDOFF.md` (estado SEO actual y siguiente paso)
4. `docs/SEO_DECISIONS.md` (decisiones activas)
5. `docs/SEO_WORKLOG.md` solo si se necesita historial
6. `git status`
7. rama actual (`git branch --show-current`)
8. último commit (`git log --oneline -5`)

Si el estado real del repositorio contradice el handoff, manda el repositorio: corregir el handoff antes de continuar.

## Al terminar toda tarea importante

1. Ejecutar las pruebas disponibles: `npm run build`, `npm run check`, `npm test` (y `npm run build:preview` + `npm run check:preview` si se tocó el modo preview).
2. Revisar `git diff`.
3. Actualizar `docs/SEO_HANDOFF.md`.
4. Añadir una entrada al final de `docs/SEO_WORKLOG.md` (append-only: no reescribir entradas anteriores).
5. Actualizar `docs/SEO_DECISIONS.md` si hubo una decisión nueva.
6. Dejar un siguiente paso concreto, uno solo, en el handoff.

No declarar pruebas que no se ejecutaron. Si una herramienta no está disponible, decirlo en el worklog.

## Reglas de Git

- No hacer push a `main` ni merge de PRs sin aprobación expresa del propietario.
- No descartar cambios ajenos: nada de `reset --hard`, `checkout` destructivo ni `push --force`.
- Trabajar en ramas y PRs en borrador; validar en la preview de Cloudflare antes de proponer el merge.
- Commit y push a una rama de trabajo solo cuando el propietario lo haya pedido para esa tarea. Cambios de código o de configuración requieren su aprobación previa.
- `dist/` está versionado. Si un cambio altera la salida del build, se hace commit también del `dist/` regenerado.

## Analítica

- GA4 directo, ID de medición `G-7DCRJN061J`. Sin Google Tag Manager.
- Eventos: `click_whatsapp`, `click_phone`, `quote_request`.
- `quote_request` y `click_whatsapp` pueden salir del mismo clic; no son dos leads.
- No enviar PII a Analytics (teléfonos, nombres, correos ni texto de mensajes).

## Política SEO

- Producción: `index, follow` + GA4.
- Preview: `noindex, nofollow` + sin GA4. En Cloudflare Pages es automático para toda rama distinta de `main` (`CF_PAGES_BRANCH`, ver `scripts/site-mode.mjs`); en local se activa con `SITE_MODE=preview`. El build de preview también pone `Disallow: /` en `robots.txt` y la cabecera `X-Robots-Tag: noindex, nofollow`, y usa la URL de la preview como origen de canonical, og:url y sitemap.
- Servicios: URL canónica con barra final (`/<slug>/`). Canonical, og:url, BreadcrumbList, sitemap y enlaces internos deben coincidir.
- 404: `noindex, follow`, sin canonical ni og:url.
- No crear páginas geográficas artificiales (ciudades sin contenido local real).
- No keyword stuffing.
- No inventar testimonios, reseñas, cifras, matrículas ni certificaciones.
- No hacer cambios sensibles en Google Business Profile automáticamente; requieren aprobación.

## Entorno

- Node >= 20.11, sin dependencias npm.
- En el equipo Windows del propietario `node` puede no estar en el PATH. Existe un Node empaquetado por Codex en `%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; se puede invocar por ruta completa. No instalar software ni cambiar el PATH global sin autorización.
- `npm run build` reescribe `dist/` y `docs/TEXTOS.md`. `npm run check` solo lee. `npm test` trabaja en un directorio temporal y usa el puerto 4173.
- Sin `npm`, los equivalentes son: `node scripts/build.mjs`, `node scripts/check.mjs`, `node --test scripts/seo.test.mjs`, `node scripts/build-preview.mjs` y `node scripts/check.mjs --preview`. `build-preview.mjs` fija `SITE_MODE=preview` por sí mismo.
- Para probar un build sin ensuciar el repositorio, copiar `scripts/`, `content/`, `dist/`, `docs/` y `package.json` a un directorio temporal y compilar allí.
- Fuentes editables: `scripts/`, `content/*.json` y, dentro de `dist/assets/`, `main.js`, `styles.css` e imágenes. El resto de `dist/` (HTML, sitemap, robots, `_headers`, `_redirects`) lo genera el build: no editarlo a mano.
