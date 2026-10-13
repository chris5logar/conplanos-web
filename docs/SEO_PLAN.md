# Plan SEO y de crecimiento orgánico · conplanos.com

Plan de trabajo priorizado. Redactado por Claude Code el 2026-10-13. Las reglas del proyecto están en `../AGENTS.md`; el estado vivo, en `SEO_HANDOFF.md`; las decisiones, en `SEO_DECISIONS.md`. Este archivo se actualiza cuando cambia una prioridad o se cierra una línea de trabajo.

## 1. Diagnóstico

| Área | Estado | Comentario |
| --- | --- | --- |
| SEO técnico | Bueno | Sitio estático rápido, HTML semántico, imágenes WebP con srcset, canonical/404/redirecciones corregidos en el PR #1. |
| Contenido de servicios | Débil | 9 páginas con buena estructura pero poco texto propio (unas 250 palabras útiles cada una) y títulos con el nombre del servicio en plural, no con la búsqueda real. |
| Contenido informativo | Inexistente | No hay ninguna página que responda «qué es», «requisitos» o «cómo se tramita». Esas búsquedas las ganan en el Perú estudios de abogados y blogs (velizyasociados.com, geonovaperu.com, perugestiona.pe, milay.pe, urbania.pe, notarías). |
| Datos estructurados | Parcial | `ProfessionalService` y `BreadcrumbList`. Faltaba `Service` por servicio y `Article` para contenido. |
| Ficha de Google (GBP) | Débil | Verificada y con categoría «Ingeniero», pero 0 reseñas. Nombre «CON PLANOS» distinto del de la web («CONPLANOS»). |
| Citas y enlaces | Sin datos | Una búsqueda web desde el entorno del agente no devolvió menciones de la marca (búsqueda no localizada en el Perú; confirmar con Search Console). Sin directorios ni enlaces conocidos. |
| Analítica | Correcta | GA4 con `click_whatsapp`, `click_phone` y `quote_request`, sin PII. Falta confirmar que estén marcados como eventos clave y que Search Console esté vinculado a GA4. |
| Datos de búsqueda | No revisados | Ningún agente ha visto aún Search Console ni GA4. Sin esos datos, las prioridades de palabras clave se basan en intención de búsqueda, no en volumen medido. |

Competencia local observada (Cusco): Geoperu SAC (topografía), GeoEquipos Cusco (venta de equipos), además de profesionales independientes. En consultas locales con intención de contratar («topógrafo en Cusco», «empresa constructora Cusco») el factor decisivo es el paquete local de Google Maps, que depende sobre todo de la ficha, las reseñas y la relevancia de la web.

## 2. Mapa de palabras clave

Agrupadas por la prioridad comercial (Ingeniería > Construcción > Saneamiento > Declaratoria de fábrica). Volúmenes pendientes de medir con Search Console o Keyword Planner.

Asignación de páginas a prioridades (decisión por defecto de Claude, ver `SEO_DECISIONS.md`):

| Prioridad | Páginas | Búsquedas objetivo (ejemplos) |
| --- | --- | --- |
| 1. Ingeniería | `levantamientos-topograficos`, `puntos-geodesicos`, `habilitaciones-urbanas`, guía `levantamiento-topografico` | levantamiento topográfico Cusco, topógrafo en Cusco, plano perimétrico, plano topográfico con curvas de nivel, punto geodésico certificado IGN, georreferenciación de predio, habilitación urbana Cusco, lotización de terreno |
| 2. Construcción | `proyectos-construccion`, `ejecucion-obra`, guía `licencia-de-edificacion` | empresa constructora Cusco, construcción de casas en Cusco, planos para licencia de construcción, licencia de edificación Cusco, modalidades A B C D, presupuesto de obra por partidas |
| 3. Saneamiento | `titulaciones`, `comunidades-campesinas`, `asesoramiento-legal`, guía `saneamiento-fisico-legal` | saneamiento físico legal de predios Cusco, titulación de terrenos Cusco, independización de predio, rectificación de área y linderos, deslinde de comunidades campesinas |
| 4. Declaratoria | `declaratoria-fabrica`, guía `declaratoria-de-fabrica` | declaratoria de fábrica Cusco, qué es la declaratoria de fábrica, regularización de construcción sin licencia, conformidad de obra |

Regla: una búsqueda principal por URL. Las guías atacan la intención informativa («qué es», «requisitos») y enlazan al servicio, que ataca la intención de contratar («… en Cusco»).

## 3. Plan priorizado

Responsable: **C** = Claude u otro agente en el repositorio; **P** = propietario (requiere su cuenta o su aprobación).

### Ahora (0 a 30 días)

| # | Acción | Resp. | Impacto | Estado |
| --- | --- | --- | --- | --- |
| 1 | Merge del PR #1 y verificación de producción | P, C | Alto | En curso |
| 2 | Profundizar las 9 páginas de servicio: títulos orientados a la búsqueda, bloque «En qué consiste», preguntas frecuentes adicionales, enlace a la guía | C | Alto | Hecho en la rama `seo/plan-crecimiento-organico` |
| 3 | Sección `/guias/` con 4 guías iniciales (licencia de edificación, declaratoria de fábrica, saneamiento físico legal, levantamiento topográfico) | C | Alto | Hecho en la misma rama; requiere revisión técnica y legal del propietario antes del merge |
| 4 | Datos estructurados `Service` en cada servicio, `Article` en guías, `CollectionPage` en el índice | C | Medio | Hecho en la misma rama |
| 5 | Programa de reseñas en Google: pedir reseña por WhatsApp al entregar cada encargo, con el enlace corto de la ficha. Sin incentivos, sin reseñas de familiares ni del equipo. Responder todas | P | Muy alto | Pendiente. Plantilla en el apartado 5 |
| 6 | Search Console: enviar de nuevo el sitemap tras cada merge, inspeccionar y solicitar indexación de las URLs nuevas, vincular Search Console con GA4 | P | Alto | Pendiente |
| 7 | GA4: marcar `click_whatsapp` y `click_phone` como eventos clave. No marcar también `quote_request` como clave para no duplicar contactos | P | Medio | Pendiente |
| 8 | GBP: enlace de la web con UTM (`https://conplanos.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`) para medir las visitas que llegan desde la ficha | P | Medio | Propuesta |

### Siguiente (30 a 90 días)

| # | Acción | Resp. | Impacto |
| --- | --- | --- | --- |
| 9 | GBP: propuesta de categorías secundarias acordes con los servicios reales (por ejemplo «Topógrafo», «Empresa constructora», «Arquitecto»). La principal sigue siendo «Ingeniero» | P aprueba | Alto |
| 10 | GBP: servicios de la ficha alineados 1 a 1 con las 9 páginas, cada uno con su descripción y, si la ficha lo permite, su URL | P | Medio |
| 11 | GBP: publicaciones quincenales con fotos reales de trabajos (campo, GNSS, obra) y enlace a la página del servicio | P, C redacta | Medio |
| 12 | Unificar el nombre comercial: la web dice «CONPLANOS» y la ficha «CON PLANOS». Elegir uno y usarlo igual en todas partes. Cambiar el nombre de la ficha es un cambio sensible | P decide | Medio |
| 13 | Citas locales con el mismo nombre, dirección y teléfono: Facebook, LinkedIn de empresa, Bing Places, Apple Business Connect, Páginas Amarillas Perú | P | Medio |
| 14 | Página «Proyectos» con casos reales: tipo de encargo, distrito, alcance, fotos propias y resultado, sin datos personales del cliente. Es la única vía aceptada para posicionar en otras zonas (no se crean páginas por ciudad sin contenido real) | P aporta material, C publica | Alto |
| 15 | Página «Nosotros/Equipo» con formación y colegiatura (CIP, CAP, CAC) solo si el propietario la proporciona | P aporta, C publica | Medio |
| 16 | Horario de atención en la web, el JSON-LD y la ficha, si existe uno real | P confirma | Bajo |

### Continuo (a partir del mes 3)

| # | Acción | Resp. |
| --- | --- | --- |
| 17 | Una guía nueva al mes, priorizada con datos de Search Console. Candidatas: independización de un predio, subdivisión de lote, rectificación de área y linderos, conformidad de obra, certificado de parámetros urbanísticos, plano perimétrico frente a topográfico, prescripción adquisitiva | C redacta, P revisa |
| 18 | Enlaces de calidad: socios reales (notarías, inmobiliarias, proveedores), entidades profesionales, medios locales, Registro Nacional de Proveedores si aplica. Nada de compra de enlaces ni granjas | P, C propone |
| 19 | Informe mensual: impresiones, clics y posición media por grupo de búsquedas (Search Console); contactos por WhatsApp y teléfono (GA4); reseñas y acciones en la ficha | C con acceso de lectura |
| 20 | Revisar cada trimestre las guías: normas citadas, enlaces y fecha de actualización | C, P |

## 4. Qué no se hace

- Páginas por ciudad o distrito sin contenido propio verificable.
- Repetir palabras clave para «forzar» el posicionamiento.
- Reseñas falsas, pagadas o incentivadas; testimonios inventados.
- Cifras, plazos, precios, matrículas o certificaciones que el propietario no haya confirmado.
- Cambios en la ficha de Google sin aprobación expresa.

## 5. Plantilla para pedir reseñas (WhatsApp)

> Hola, [nombre]. Gracias por confiar en CONPLANOS para [servicio]. Si quedó conforme con nuestro trabajo, nos ayudaría mucho que deje una reseña en Google contando su experiencia: [enlace corto de la ficha]. Toma menos de un minuto. ¡Gracias!

El enlace corto se obtiene en la ficha de Google: «Pedir reseñas» o «Compartir perfil». Pedir la reseña al cerrar el encargo, una sola vez, a todos los clientes por igual.

## 6. Accesos y datos que necesita un agente

Un agente no puede iniciar sesión en cuentas de Google. Para medir y priorizar con datos reales, el propietario puede:

1. Search Console: Rendimiento › Resultados de búsqueda, últimos 3 meses, exportar a CSV (consultas y páginas). Subirlo al proyecto.
2. GA4: Informes › Interacción › Eventos, últimos 3 meses, exportar. Y Adquisición de tráfico por canal.
3. Ficha de Google: captura de «Rendimiento» (búsquedas, vistas, clics a la web, llamadas, chats).

Con eso se calcula la línea base y se prioriza el contenido por búsquedas reales.

## 7. Indicadores de éxito

- Reseñas en Google: crecimiento constante mes a mes, con respuesta a todas.
- Search Console: aumento de impresiones y clics en las búsquedas de los 4 grupos del apartado 2, con prioridad en Ingeniería.
- GA4: contactos (`click_whatsapp` + `click_phone`) desde tráfico orgánico y desde la ficha.
- Indexación: todas las URLs del sitemap indexadas.
