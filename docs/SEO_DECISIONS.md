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

## 2026-10-13 — política de caché de recursos estáticos

- Decisión: `main.js` y `styles.css` se sirven siempre con `?v=<hash>` y `Cache-Control: public, max-age=31536000, immutable`. Imágenes (`/assets/images/*`) y marca (`/assets/brand/*`) con `max-age=604800` (7 días), porque sus nombres no llevan versión. No se usan reglas genéricas que se solapen con estas.
- Motivo: mejorar visitas repetidas sin riesgo de servir CSS o JS antiguos; Cloudflare Pages une los valores de varias reglas `_headers` que coinciden con la misma ruta.
- Consecuencias: si se reemplaza una imagen con el mismo nombre, puede tardar hasta 7 días en renovarse en navegadores; para cambios urgentes, usar un nombre nuevo. `check.mjs` impide marcar como inmutable un archivo sin versión.
- Estado: Activa. Implementada en la rama `perf/core-web-vitals`, pendiente de merge.

## 2026-10-13 — se usan los dos nombres: CONPLANOS y CON PLANOS

- Decisión: el propietario quiere usar los dos nombres. La web sigue usando «CONPLANOS» (logo, títulos, `og:site_name`) y la ficha de Google Business se mantiene como «CON PLANOS». El JSON-LD `ProfessionalService` declara `name: "CONPLANOS"` y `alternateName: "CON PLANOS"`.
- Motivo: Google relaciona mejor la web con la ficha cuando el dato estructurado reconoce el nombre de la ficha, y los clientes buscan de las dos formas. No hay que renombrar nada.
- Consecuencias: `check.mjs` exige los dos valores en cada página con `ProfessionalService`. En directorios y perfiles externos puede usarse cualquiera de los dos, pero siempre con la misma dirección y el mismo teléfono. El nombre de la ficha de Google no se cambia.
- Estado: Activa. Decidida por el propietario el 2026-10-13.

## 2026-10-13 — asignación de páginas a la prioridad comercial

- Decisión: «Ingeniería» agrupa `levantamientos-topograficos`, `puntos-geodesicos` y `habilitaciones-urbanas`; «Construcción», `proyectos-construccion` y `ejecucion-obra`; «Saneamiento de predios», `titulaciones`, `comunidades-campesinas` y `asesoramiento-legal`; «Declaratoria de fábrica», `declaratoria-fabrica`.
- Motivo: la pregunta estaba abierta en el handoff y el propietario pidió no consultar decisiones rutinarias. Es la agrupación que mejor coincide con la categoría «Ingeniero» de la ficha de Google.
- Consecuencias: el orden de contenido, enlazado y medición de `SEO_PLAN.md` sigue esta tabla. El propietario puede cambiarla; si lo hace, marcar esta decisión como sustituida.
- Estado: Activa. Decisión por defecto de Claude Code, pendiente de confirmación del propietario.

## 2026-10-13 — sección de guías informativas

- Decisión: se crea `/guias/` con guías propias que responden búsquedas informativas («qué es», «requisitos», «cómo se tramita») y enlazan al servicio correspondiente. Contenido en `content/guides.json`, generado por `scripts/build.mjs`, con `Article` y `BreadcrumbList` de tres niveles.
- Motivo: las búsquedas informativas sobre licencia, declaratoria de fábrica y saneamiento las ganan hoy blogs y estudios de abogados; la web no tenía contenido para competir ni para demostrar experiencia.
- Consecuencias: cada guía cita normas solo de forma general y verificable, sin plazos, precios ni cifras no confirmadas, e incluye aviso de que no sustituye la evaluación del caso. Toda guía nueva o modificada requiere revisión técnica y legal del propietario antes del merge. `check.mjs` incorpora las guías al catálogo de URLs, sitemap y redirecciones.
- Estado: Activa. Implementada en la rama `seo/plan-crecimiento-organico`, pendiente de revisión.

## 2026-10-13 — redacción prudente de contenido legal y normativo

- Decisión: las guías y textos de servicio que citan normas usan formulaciones condicionadas («según el caso», «cuando corresponda», «según el procedimiento aplicable», «según la entidad competente») y remiten a la norma vigente, su reglamento y el TUPA en lugar de resumir supuestos concretos como reglas universales. La vía registral de regularización de la Ley 27157, modificada por la Ley 30830, se presenta siempre con su límite: según SUNARP, edificaciones culminadas hasta el 31/12/2016. CONPLANOS aparece con su papel técnico y de asesoría, nunca ejerciendo funciones de la autoridad.
- Motivo: revisión del propietario en el PR #2 (2026-10-13) y prompt maestro del proyecto (reglas de contenido).
- Consecuencias: ninguna guía legal se publica sin revisión final del propietario. Al añadir o cambiar una guía, revisar estas reglas antes del PR.
- Estado: Activa.
