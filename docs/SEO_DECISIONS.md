# Decisiones SEO activas

Registro de decisiones vigentes del proyecto conplanos.com. Añadir decisiones nuevas al final. Para cambiar una decisión, no borrarla: marcarla como `Sustituida` y añadir la nueva.

Las once primeras decisiones fueron dictadas por el propietario a través del orquestador y registradas el 2026-10-13; varias ya estaban aplicadas en el código. Donde el propietario no dio el motivo, lo redactó Claude Code a partir del código y del contexto.

## 2026-10-13 — main es producción

- Decisión: la rama `main` es producción. Cloudflare Pages publica conplanos.com desde `main`.
- Motivo: un único punto de publicación, fácil de auditar.
- Consecuencias: no se hace push a `main` ni merge sin aprobación expresa. El trabajo va en ramas y PRs validados en preview.
- Estado: Activa.

## 2026-10-13 — conplanos-web corresponde solo a conplanos.com

- Decisión: el repositorio `chris5logar/conplanos-web` es la fuente de verdad de https://conplanos.com y de nada más.
- Motivo: evitar mezclar la web comercial con otros productos.
- Consecuencias: no se toca app.conplanos.com, conplanos-app, GNSS, LeicaAgent, CAD, DNS, Render ni Neon desde este proyecto.
- Estado: Activa.

## 2026-10-13 — los servicios usan barra final

- Decisión: la portada es `/` y cada servicio es `/<slug>/`. Esa es la URL canónica.
- Motivo: Cloudflare Pages sirve los directorios con barra final; el canonical sin barra apuntaba a una URL que redirigía.
- Consecuencias: canonical, og:url, BreadcrumbList, sitemap y enlaces internos deben coincidir con la URL con barra. `_redirects` lleva las variantes sin barra y `/index.html` al destino final en un solo salto. `scripts/check.mjs` y `scripts/seo.test.mjs` lo verifican.
- Estado: Activa. Implementada en 3539a01; pendiente de llegar a producción con el merge del PR #1.

## 2026-10-13 — el sitio sigue siendo estático

- Decisión: HTML estático generado por `scripts/build.mjs`, sin framework, backend ni dependencias npm, salvo necesidad justificada.
- Motivo: rendimiento, coste cero y mantenimiento simple.
- Consecuencias: cualquier propuesta de framework, CMS o backend requiere justificación y aprobación antes de implementarse.
- Estado: Activa.

## 2026-10-13 — GA4 directo, sin GTM por ahora

- Decisión: GA4 se instala directamente con `gtag.js` y el ID `G-7DCRJN061J`. No se usa Google Tag Manager.
- Motivo: solo hay tres eventos; GTM añadiría peso y complejidad sin beneficio actual.
- Consecuencias: eventos `click_whatsapp`, `click_phone` y `quote_request` definidos en `dist/assets/main.js`. `check.mjs` falla si aparece un contenedor `GTM-`, un ID de medición distinto o una etiqueta duplicada.
- Estado: Activa.

## 2026-10-13 — sin PII en Analytics

- Decisión: no se envían datos personales a GA4.
- Motivo: privacidad y cumplimiento de las políticas de Google Analytics.
- Consecuencias: los eventos no incluyen teléfonos, nombres, correos ni el texto del mensaje de WhatsApp. `check.mjs` verifica que el código de medición no contenga datos de contacto.
- Estado: Activa.

## 2026-10-13 — prioridad comercial

- Decisión: el orden de prioridad es Ingeniería > Construcción > Saneamiento de predios > Declaratoria de fábrica.
- Motivo: definido por el negocio.
- Consecuencias: contenido, enlazado interno, mejoras y medición se priorizan en ese orden.
- Estado: Activa.

## 2026-10-13 — sin páginas por ciudades sin contenido local real

- Decisión: no se crean páginas geográficas artificiales ni se hace keyword stuffing.
- Motivo: son páginas de entrada de baja calidad; riesgo de penalización y de dañar la marca.
- Consecuencias: una página local solo se crea si hay contenido propio y verificable de esa zona (casos, fotos, alcance real).
- Estado: Activa.

## 2026-10-13 — Google Business Profile no se automatiza

- Decisión: ningún agente cambia datos sensibles de Google Business Profile sin aprobación expresa del propietario.
- Motivo: los cambios en la ficha pueden provocar reverificación o suspensión.
- Consecuencias: los agentes proponen cambios; el propietario los aprueba y aplica.
- Estado: Activa.

## 2026-10-13 — la categoría principal de GBP sigue siendo «Ingeniero»

- Decisión: la categoría principal «Ingeniero» se mantiene hasta decisión expresa del propietario.
- Motivo: coincide con la prioridad comercial; cambiarla afecta al posicionamiento local.
- Consecuencias: no cambiarla ni añadir categorías secundarias de forma automática.
- Estado: Activa.

## 2026-10-13 — preview sin indexar y sin GA4; producción indexable y con GA4

- Decisión: producción usa `index, follow` y GA4. Toda preview usa `noindex, nofollow`, `robots.txt` con `Disallow: /`, cabecera `X-Robots-Tag: noindex, nofollow` y no carga GA4.
- Motivo: no indexar copias del sitio ni contaminar la analítica con tráfico de revisión.
- Consecuencias: las previews deben compilarse con `SITE_MODE=preview`. Un build de preview nunca se publica en producción; `check.mjs` lo rechaza.
- Estado: Activa. En Cloudflare Pages se aplica sola desde la decisión «las previews de Cloudflare Pages se detectan automáticamente».

## 2026-10-13 — las previews de Cloudflare Pages se detectan automáticamente

- Decisión: el build decide el modo con la variable oficial `CF_PAGES_BRANCH` de Cloudflare Pages. Si existe y es `main`, compila producción; si existe y es cualquier otra rama, compila preview. Si no existe (desarrollo local), se mantiene el comportamiento anterior: producción salvo `SITE_MODE=preview`.
- Motivo: las previews automáticas se compilaban en modo producción, con `index, follow` y GA4 activo, porque Cloudflare no recibía `SITE_MODE`. Depender de una variable configurada a mano en el panel es frágil.
- Consecuencias: la regla vive en `scripts/site-mode.mjs` y la usan `build.mjs` y `check.mjs`. En una preview de Cloudflare el origen de canonical, og:url y sitemap es `CF_PAGES_URL` (la URL del despliegue), salvo que se defina `SITE_ORIGIN`. No hay que configurar variables en el panel de Cloudflare. Si algún día cambia la rama de producción, hay que cambiar `productionBranch` en ese archivo.
- Estado: Activa. Aprobada por el propietario el 2026-10-13.
