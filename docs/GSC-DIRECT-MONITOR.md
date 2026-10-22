# CONPLANOS — conexión directa a Google Search Console

Estado: preparación, NO desplegado. Propiedad: `sc-domain:conplanos.com`. Sitemap: https://conplanos.com/sitemap.xml. Vigilar 16 URLs, incluida https://conplanos.com/licencia-funcionamiento/.

## Autorización (una vez)
1. En https://console.cloud.google.com/ seleccionar el proyecto Google Cloud existente de CONPLANOS, si lo hay. No crear recursos de pago.
2. Habilitar **Google Search Console API** (Search Console API incluye URL Inspection) en https://console.cloud.google.com/apis/library/searchconsole.googleapis.com.
3. Crear una **cuenta de servicio** en https://console.cloud.google.com/iam-admin/serviceaccounts; guardar su correo electrónico, no su clave en el repositorio.
4. Abrir https://search.google.com/search-console, elegir `sc-domain:conplanos.com` > Configuración > Usuarios y permisos > Añadir usuario; agregar el correo de la cuenta de servicio con permiso suficiente para inspeccionar URLs.
5. Configurar credenciales en GitHub Actions Secrets, nunca en archivos versionados. Preferir Workload Identity Federation/OIDC para evitar claves JSON persistentes; comprobar disponibilidad y permisos antes de implementarlo.

## Implementación pendiente
- Ejecutar diariamente mediante GitHub Actions (workflow_dispatch para prueba).
- Consultar el sitemap y los 16 URL Inspection resultados; guardar snapshot histórico duradero (no depender de archivos efímeros del runner).
- Comparar solo contra snapshot previo válido. No alertar por primera ejecución, por errores de autenticación repetidos o por un cambio no significativo.
- Alertar solo si una guía/servicio pasa a indexada, aparece error/advertencia de indexación, el sitemap reporta error/advertencia, o las 16 quedan indexadas.
- Registrar separadamente errores operativos de autorización y cuota; no interpretarlos como errores de indexación.
- Validar las 16 URLs antes de activar la automatización. No modificar producción ni activar cobros.

## Referencias
- https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect
- https://developers.google.com/webmaster-tools/v1/sitemaps/get
