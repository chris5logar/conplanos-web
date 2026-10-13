# SEO local y Google Business Profile · CONPLANOS

Paquete de trabajo de la Fase 4. Preparado por Claude Code el 2026-10-13. **Ningún agente aplica estos cambios en la ficha**: el propietario los revisa y los aplica, o autoriza expresamente cada cambio no sensible si un agente obtiene acceso. Nombre, categoría principal, dirección, propietarios y usuarios no se tocan sin aprobación expresa (`SEO_DECISIONS.md`).

## 1. Coherencia de datos (NAP)

| Dato | Web (conplanos.com) | Ficha de Google | Acción |
| --- | --- | --- | --- |
| Nombre | CONPLANOS | CON PLANOS | Decidido por el propietario el 2026-10-13: se usan los dos. La ficha se queda como «CON PLANOS» (no se renombra) y la web declara «CON PLANOS» como `alternateName` en su JSON-LD (PR #6, mergeado en `main` el 2026-10-13). |
| Dirección | Av. Micaela Bastidas 321, Cusco | (confirmar) | Debe coincidir carácter por carácter en web, ficha y directorios. |
| Teléfono | +51 928 400 600 | +51 928 400 600 | Correcto. |
| Web | https://conplanos.com | https://conplanos.com | Proponer la versión con UTM del apartado 2. |
| Horario | No publicado (visitas con cita) | (confirmar) | Si hay horario real de oficina, publicarlo igual en ficha y web. |

## 2. Enlace de la web en la ficha

Usar `https://conplanos.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` para distinguir en GA4 las visitas que llegan desde la ficha. El canonical de la portada es `https://conplanos.com/`, así que el parámetro no crea una URL duplicada en Google. Cambio no sensible.

## 3. Categorías

- Principal: **Ingeniero** (se mantiene; decisión activa).
- Secundarias propuestas, solo si describen servicios que CONPLANOS presta de verdad. Elegir el nombre exacto que ofrezca el buscador de categorías de la ficha:
  - Topógrafo
  - Empresa constructora (o Contratista general)
  - Arquitecto
- No añadir categorías legales (abogado) salvo que la empresa preste ese servicio como actividad propia y el propietario lo confirme.

Cambiar o añadir categorías afecta al posicionamiento local. El propietario aprobó esta propuesta el 2026-10-13 («sí a todo») y la aplica él mismo en la ficha, porque ningún agente tiene acceso.

## 4. Servicios de la ficha y páginas de la web

La ficha tiene 10 servicios y la web 9 páginas. Correspondencia propuesta y descripción para cada servicio (máximo 300 caracteres, sin promesas de plazos ni resultados):

| Servicio en la ficha | Página de la web | Descripción propuesta |
| --- | --- | --- |
| Levantamientos topográficos | /levantamientos-topograficos/ | Medición en campo con equipo topográfico y GNSS para conocer medidas, área, linderos y relieve del terreno. Planos perimétricos, de ubicación y topográficos según la finalidad del encargo. |
| Puntos geodésicos | /puntos-geodesicos/ | Planificación y medición GNSS de puntos de referencia para georreferenciar proyectos y expedientes. Preparación del expediente para la certificación del IGN cuando el encargo lo incluye. |
| Habilitaciones urbanas | /habilitaciones-urbanas/ | Evaluación técnica y legal, topografía, diseño y documentación para habilitar un terreno, según la zonificación y la normativa aplicable. |
| Lotizaciones y parcelaciones | /habilitaciones-urbanas/ | Evaluación y planos para dividir un terreno en lotes o parcelas, previa revisión de su situación legal y de los requisitos de la entidad competente. |
| Proyectos de construcción | /proyectos-construccion/ | Diseño arquitectónico y coordinación de especialidades para obtener un proyecto listo para construir y la documentación técnica de la licencia, cuando corresponda. |
| Ejecución de obra | /ejecucion-obra/ | Planificación, presupuesto por partidas, coordinación de equipos y seguimiento de avances de obra con un alcance definido por escrito. |
| Titulación de predios | /titulaciones/ | Evaluación técnica y legal de predios urbanos y rurales para formalizar su propiedad, según sus antecedentes y el procedimiento aplicable. |
| Saneamiento físico legal | /titulaciones/ | Diagnóstico de documentos, catastro y medición del predio para que su situación física coincida con la legal, y propuesta de la ruta que corresponda a cada caso. |
| Declaratoria de fábrica | /declaratoria-fabrica/ | Medición de lo construido, revisión de antecedentes y documentación técnica para declarar o regularizar una edificación, por la vía que admita la normativa en cada caso. |
| Asesoramiento legal predial | /asesoramiento-legal/ | Revisión de documentos y antecedentes de un predio antes de comprar, vender, heredar o construir, coordinada con el trabajo técnico. |

«Comunidades campesinas» tiene página propia en la web pero no figura como servicio en la ficha. Propuesta: añadirlo como servicio, con la descripción: «Apoyo técnico y asesoría a comunidades campesinas: trabajo de campo GNSS, planos y documentación de su territorio, en coordinación con sus representantes.»

## 5. Reseñas

Es la acción de mayor impacto en el mapa de Google (la ficha tiene 0).

- Pedir la reseña a **todos** los clientes al cerrar el encargo, una sola vez, con el enlace corto de la ficha («Pedir reseñas» en el panel).
- Nada de incentivos, descuentos, reseñas del equipo, familiares o cuentas propias, ni pedir solo a clientes satisfechos: va contra las políticas de Google.
- Responder todas las reseñas en 48 horas, sin datos personales del cliente ni del expediente.

Mensaje para WhatsApp:

> Hola, [nombre]. Gracias por confiar en CONPLANOS para [servicio]. Si tiene un minuto, nos ayudaría mucho que deje su opinión sobre nuestro trabajo en Google: [enlace corto]. ¡Muchas gracias!

Respuesta a una reseña positiva:

> Gracias, [nombre], por su confianza. Fue un gusto acompañarle en [servicio]. Quedamos a su disposición para lo que necesite.

Respuesta a una reseña negativa:

> Lamentamos que su experiencia no haya sido la esperada. Queremos revisar su caso con atención: por favor, escríbanos al +51 928 400 600 para conversarlo directamente.

## 6. Fotos

Subir solo fotos reales y propias, sin documentos legibles ni datos de clientes: fachada y acceso de la oficina (ayuda a encontrarla), interior, equipo con instrumentos, trabajo de campo (estación total, GNSS) y obras con autorización. Lista detallada en `IMAGENES.md`. No subir imágenes generadas.

## 7. Publicaciones

Una cada dos semanas, con foto real y botón «Más información» a la página del servicio. Borradores (ajustar al caso real antes de publicar):

1. **Ingeniería · Topografía**: «¿Vas a construir, lotizar o sanear tu terreno? Todo empieza por conocer sus medidas reales. Realizamos levantamientos topográficos con equipo GNSS en Cusco y otras regiones. Escríbenos con la ubicación de tu predio.» → /levantamientos-topograficos/
2. **Construcción**: «Antes de construir, define tu proyecto: planos, especialidades y presupuesto por partidas. Te ayudamos desde el terreno hasta la obra.» → /proyectos-construccion/
3. **Saneamiento**: «¿El área de tu título no coincide con la de tu terreno? Revisamos documentos, catastro y medición para proponerte la ruta que corresponde a tu caso.» → /titulaciones/
4. **Declaratoria de fábrica**: «Si construiste o ampliaste y la edificación no figura en Registros Públicos, evaluamos tu caso y la vía de regularización que admite la normativa.» → /declaratoria-fabrica/

## 8. Directorios y citas

Crear o revisar, con la misma dirección, teléfono y web (nombre «CONPLANOS» o «CON PLANOS», ambos válidos): Facebook (página de empresa), LinkedIn (página de empresa), Bing Places (permite importar desde Google), Apple Business Connect y Páginas Amarillas Perú. Registrar en este archivo cada alta con su fecha y URL.

## 9. Registro de cambios en la ficha

| Fecha | Cambio | Quién | Aprobado por |
| --- | --- | --- | --- |
| | | | |
