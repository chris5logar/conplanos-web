# Entrega de CONPLANOS web

## Alcance

Sitio comercial completamente separado de conplanos-app y conplanos-gnss. No se han modificado los repositorios existentes, app.conplanos.com, DNS, Render o Neon. No se han realizado pagos ni upgrades.

## Estado de entrega

Repositorio creado y primera versión subida: https://github.com/chris5logar/conplanos-web, rama main.

Proyecto temporal creado en Cloudflare Pages: `conplanos-web-preview`. El panel confirma el hostname `conplanos-web-preview.pages.dev`, pero la carga no terminó: la extensión ChatGPT de Edge requiere habilitar «Permitir el acceso a las direcciones URL de archivo». No se debe presentar esa dirección como una preview publicada hasta completar la carga y verificar el despliegue.

Alternativa manual: abrir el proyecto de carga directa en Cloudflare y subir `conplanos-cloudflare-preview.zip`, después pulsar Deploy site. El ZIP tiene index.html en raíz, imágenes y noindex. No contiene credenciales. El proyecto definitivo puede crearse aparte con integración Git, nombre conplanos-web y salida dist.

La vía Sites se detuvo: la revisión automática rechazó pasar su credencial al proceso de publicación. No se ejecutó ese paso ni se publicó el borrador de Sites. El proyecto estático y GitHub están completos.

## Páginas

Inicio `/`, `/proyectos-construccion`, `/ejecucion-obra`, `/levantamientos-topograficos`, `/titulaciones`, `/comunidades-campesinas`, `/declaratoria-fabrica`, `/puntos-geodesicos`, `/habilitaciones-urbanas`, `/asesoramiento-legal`. Incluye 404.

Cada servicio contiene introducción propia, qué resuelve, alcance, información inicial, proceso, preguntas frecuentes, servicios relacionados elegidos en content/services.json, WhatsApp, dirección y fotografía de oficina. La portada agrupa los servicios en tres áreas: Topografía y geodesia, Saneamiento y propiedad, y Proyectos y obras.

## Textos y contacto

Hero: «Ingeniería, topografía y saneamiento de predios en Cusco»

«Medimos tu terreno, desarrollamos tu proyecto u obra y ordenamos la documentación de tu propiedad, con ingenieros, arquitectos y abogados trabajando de forma coordinada.»

Paleta tomada del logotipo original: amarillo #FFC63A sobre negro y blanco. Las variables de color, tipografía, espaciado, radios y anchos están al inicio de dist/assets/styles.css.

Identidad conservada: CONPLANOS, REGISTRA Y CONSTRUYE, ABOGADOS - ARQUITECTOS - INGENIEROS y CONSTRUIMOS CONFIANZA, ASEGURAMOS TU PATRIMONIO.

WhatsApp principal: +51 928 400 600, Ing. Loaiza. Todos los botones utilizan: «Hola, vengo de conplanos.com y quisiera información sobre sus servicios.»

Dirección comprobada en la ficha de Google Maps: Av. Micaela Bastidas 321, Cusco. Se evita publicar el horario de 24 horas sin confirmarlo. Visitas por coordinación. Botón al enlace suministrado: https://maps.app.goo.gl/65JH3DPn1SEizeC67. No mapa embebido, API ni facturación.

Ing. Kimberly Peñalva, +51 927 003 900, y Per. Ernesto, +51 955 593 110, se muestran como contactos adicionales en la sección de contacto y el footer. Todos los contactos y el mensaje de WhatsApp se editan en content/contacts.json; para ocultar uno, desactivar enabled y regenerar. No se inventan perfiles profesionales ni credenciales.

## SEO

Titles y descripciones propios por página; H1 único; canonical; Open Graph y tarjeta de marca; favicon; sitemap de diez URLs; robots; JSON-LD ProfessionalService con nombre, contacto, dirección, coordenadas comprobadas en Maps y área atendida (Cusco y Perú), más BreadcrumbList en las páginas de servicio. No se añaden reseñas, horarios, matrículas o garantías sin verificar.

La preview debe permanecer noindex. El build final para conplanos.com habilita indexación. Publicar archivos SEO no garantiza posiciones en Google: luego deben verificarse dominio, rastreo y contenido en Search Console.

HTML renderizado sin JavaScript, fuentes del sistema, sin frameworks de cliente ni dependencias, WebP responsive, dimensiones reservadas, lazy loading excepto imagen principal. Menú móvil (sin JavaScript la navegación se muestra como fila de enlaces), foco visible, enlace de salto, alt descriptivos, respeto a movimiento reducido. No se afirma una puntuación Lighthouse sin medirla.

## Cloudflare Pages: publicación gratuita sin DNS

1. En Cloudflare, abrir Workers & Pages y crear un proyecto de Pages mediante importación de Git.
2. Conectar GitHub y permitir acceso únicamente a `chris5logar/conplanos-web`.
3. Seleccionar rama `main`, framework `None`, build `node scripts/build.mjs`, salida `dist`.
4. Para la primera revisión en pages.dev, configurar `SITE_MODE=preview` y `SITE_ORIGIN=https://<nombre-asignado>.pages.dev`. El nombre real lo confirma Cloudflare; no se supone que esté disponible.
5. Publicar y probar inicio, las nueve rutas, teléfono, Maps, menú y WhatsApp desde celular.
6. No agregar dominio personalizado ni modificar DNS durante esta revisión.
7. Antes de conectar conplanos.com: quitar SITE_MODE, configurar SITE_ORIGIN=https://conplanos.com y publicar de nuevo. Mantener previews de otras ramas en modo preview/noindex.

También puedes crear un proyecto de Direct Upload y subir únicamente dist. Elegir el método al inicio: un proyecto de Git integration no se puede convertir después a Direct Upload. Los pasos de interfaz pueden variar.

Fuentes oficiales revisadas:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## DNS futuro: propuesta, no aplicada

Primero exportar e inventariar los registros existentes, especialmente `app`, correo, MX, TXT, SPF, DKIM y DMARC. No borrar ni reemplazar registros de la aplicación.

Si conplanos.com ya está como zona en Cloudflare, asociar `conplanos.com` en Pages > Custom domains. Cloudflare creará o solicitará el CNAME de raíz hacia el hostname real del proyecto `*.pages.dev` mediante flattening. Confirmar el destino exacto en el panel antes de aprobar el cambio.

Si el DNS autoritativo está fuera de Cloudflare, el dominio raíz con Pages requiere incorporar la zona y cambiar los nameservers a los asignados por Cloudflare. Es una migración que se debe aprobar y revisar aparte; importar y verificar todos los registros, en especial app.conplanos.com y correo, antes del cambio.

Opcionalmente asociar también `www.conplanos.com` en Pages y usar CNAME `www` hacia el hostname asignado. Configurar redirección 301 de www al dominio raíz y verificar HTTPS. Asociar los dominios en Pages antes de introducir el CNAME; un CNAME manual sin esa asociación puede fallar.

No modificar el registro de `app.conplanos.com`, Render ni Neon. No introducir A records o IP inventadas. Mantener una copia para rollback de los registros que se autorice modificar.

## Conversión y material audiovisual

- Prioridad inmediata: casos reales con ubicación, necesidad del cliente, alcance contratado, entregables y resultado comprobable; obtener autorización antes de publicar personas o documentos.
- Fotos y perfiles reales del equipo con nombres completos, especialidades y credenciales verificadas.
- Confirmar horario, cobertura geográfica y tiempo realista de respuesta. Preparar respuestas rápidas de WhatsApp para ubicación, servicio y etapa.
- Verificar Google Business Profile y actualizar el enlace a conplanos.com después del lanzamiento. Solicitar reseñas auténticas a clientes, sin inventar testimonios.
- Después, medir clics WhatsApp, llamadas y Maps con una herramienta acordada. Existe un evento local conplanos:contact para conexión futura; actualmente no se transmite analítica.
- Producir videos verticales de 20–40 s: «qué enviar para cotizar», medición GNSS real, avance de obra y revisión de planos. Subtítulos legibles y cierre con WhatsApp.
- Producir un video de 60–90 s de presentación del equipo y oficina, y casos de 45–60 s con problema, proceso y entrega. Confirmar resultados y evitar mostrar DNI, firmas o expedientes legibles.
- Grabaciones de obra con seguridad y permiso; tomas aéreas solo cuando exista autorización y operador habilitado según corresponda. No cargar videos pesados automáticamente en el hero; usar poster y reproducción voluntaria.

Consultar IMAGENES.md para fotos exactas, reemplazos y prompts por servicio.

