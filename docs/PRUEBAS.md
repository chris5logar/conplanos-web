# Verificación de la primera versión

- Diez páginas comerciales y una página 404 generadas.
- Once documentos HTML comprobados: H1 único, títulos propios, meta description, canonical, Open Graph, JSON-LD válido, alt y dimensiones de imágenes.
- 222 referencias locales comprobadas, incluidos archivos y enlaces de navegación.
- Archivos de srcset presentes y mensaje exacto de WhatsApp comprobado.
- Inicio, nueve páginas de servicio, robots y sitemap responden HTTP 200; ruta inexistente responde 404.
- Revisión visual de la portada en escritorio y viewport móvil solicitado de 390×844. Sin desbordamiento horizontal observado.
- Menú móvil abre, aria-expanded cambia a true, y se cierra al seleccionar Servicios.
- Página de proyectos de construcción revisada en móvil. Imágenes principales cargan; las imágenes inferiores usan carga diferida.
- No se han enviado mensajes de prueba a WhatsApp ni efectuado llamadas.
- No se ha ejecutado Lighthouse: no se afirma puntuación de rendimiento, SEO ni conformidad completa WCAG.
- La dirección se comprobó en la ficha abierta de Google Maps de CON PLANOS, junto al teléfono 928 400 600.

## Verificación de la Fase 1 SEO técnica (2026-10-13)

Sustituye a los puntos anteriores en lo relativo a URLs, canonical y 404.

- Las nueve páginas de servicio usan URL final con barra (`/<slug>/`); canonical, og:url, BreadcrumbList, sitemap y enlaces internos coinciden.
- Validación automática: `npm run build`, `npm run check` y `npm test`; en modo preview, `npm run build:preview` y `npm run check:preview`.
- `npm run check` sobre el build de producción: 1612 validaciones, 11 documentos HTML, 364 referencias locales.
- `npm test`: 25 pruebas correctas, incluidas las de detección automática de Cloudflare y las que rechazan canonical sin barra, 404 indexable, redirecciones con salto intermedio, GA4 duplicado, preview indexable y preview con GA4.
- Producción: `index, follow` y GA4 activo. Preview: `noindex, nofollow` y sin GA4.
- 404: `noindex, follow`, sin canonical ni og:url.
- Preview de Cloudflare del PR #1 comprobada por HTTP: diez URLs finales con 200, variantes sin barra e `index.html` con 301 directo, ruta inexistente con 404, sitemap de diez URLs.
- Las previews automáticas de Cloudflare se compilan en modo preview desde `a37144d`; comprobado en la preview real: `noindex, nofollow`, sin GA4 y `robots.txt` con `Disallow: /`.

Antes del lanzamiento final: confirmar horario, datos legales de empresa, áreas de atención y credenciales del equipo; sustituir la foto de oficina por una toma de mayor resolución y completar casos de construcción reales.

