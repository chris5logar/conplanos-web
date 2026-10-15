# Entrega de CONPLANOS web

Última actualización general: 2026-10-15.

## Estado actual

La web oficial está publicada y operativa:

- Producción: https://conplanos.com
- Repositorio: `chris5logar/conplanos-web`
- Rama de producción: `main`
- Hosting: Cloudflare Pages
- Build: `node scripts/build.mjs`
- Salida: `dist`
- HTTPS: activo
- `www.conplanos.com`: redirección 301 al dominio raíz, conservando rutas y parámetros
- Producción: `index, follow` y GA4 activo
- Previews: `noindex, nofollow` y sin GA4

La web comercial está separada de `app.conplanos.com`. No tocar Render, Neon o el repositorio de la app desde este proyecto.

## Infraestructura y DNS

Cloudflare administra la zona DNS del dominio.

Estado conocido:
- raíz y `www` asociados a Cloudflare Pages;
- `app.conplanos.com` conserva su destino en Render y no debe modificarse desde este repositorio;
- correo y FTP conservan la infraestructura anterior;
- MX conserva `mail.conplanos.com`.

Cambios de DNS, correo, FTP, app, Render o Neon requieren una tarea separada y aprobación expresa.

## Arquitectura

Sitio estático sin framework de cliente ni backend.

Fuentes principales:
- `scripts/build.mjs`: generador HTML.
- `scripts/site-mode.mjs`: producción/preview.
- `scripts/check.mjs`: validaciones.
- `scripts/seo.test.mjs`: pruebas SEO.
- `content/services.json`: servicios.
- `content/contacts.json`: contactos y WhatsApp.
- `content/guides.json`: guías SEO.
- `dist/assets/styles.css`: estilos.
- `dist/assets/main.js`: interacción ligera y eventos GA4.
- `dist/assets/brand/`: activos de marca.
- `dist/assets/images/`: fotografías e imágenes de apoyo.
- `dist/`: salida final publicada.

Node requerido: >= 20.11. No hay dependencias npm externas.

## Páginas

Producción incluye:
- portada `/`;
- 9 páginas de servicio;
- `/guias/`;
- guías informativas;
- 404.

La URL canónica de cada servicio usa barra final.

Los slugs de servicio están en `content/services.json`. Las guías están en `content/guides.json`.

## Diseño y textos

Hero principal:
«Ingeniería, topografía y saneamiento de predios en Cusco».

Identidad:
- negro/grafito;
- blanco;
- amarillo corporativo aproximado `#FFC63A`.

La web prioriza apariencia técnica, empresarial, sobria y profesional.

No publicar afirmaciones no verificadas sobre:
- años de experiencia;
- cifras de clientes;
- certificaciones;
- colegiaturas;
- premios;
- garantías;
- resultados;
- testimonios.

Las fotografías reales deben distinguirse de imágenes referenciales.

## Contactos

Fuente única: `content/contacts.json`.

Contacto principal:
- Ing. Loaiza
- +51 928 400 600

Contactos adicionales:
- Ing. Kimberly Peñalva
- +51 927 003 900
- Per. Ernesto
- +51 955 593 110

WhatsApp principal:
`https://wa.me/51928400600`

Mensaje:
«Hola, vengo de conplanos.com y quisiera información sobre sus servicios.»

Dirección:
Av. Micaela Bastidas 321, Cusco.

## SEO y medición

- Search Console: propiedad `conplanos.com` verificada.
- Sitemap: https://conplanos.com/sitemap.xml
- Robots: https://conplanos.com/robots.txt
- GA4: `G-7DCRJN061J`
- Eventos: `click_whatsapp`, `click_phone`, `quote_request`
- Sin Google Tag Manager.
- Sin PII en Analytics.

Estado SEO detallado:
- `docs/SEO_HANDOFF.md`
- `docs/SEO_DECISIONS.md`
- `docs/SEO_WORKLOG.md`
- `docs/SEO_PLAN.md`

## Producción y previews

Cloudflare Pages decide el modo a partir de `CF_PAGES_BRANCH` mediante `scripts/site-mode.mjs`:

- `main` -> producción, `index, follow`, GA4.
- otra rama -> preview, `noindex, nofollow`, sin GA4.

En local:
- producción: `npm run build`
- preview: `npm run build:preview`

No publicar un build de preview en producción.

## Comandos

```bash
npm run build
npm run check
npm test
npm run dev
```

Preview:

```bash
npm run build:preview
npm run check:preview
```

Servidor local:
`http://127.0.0.1:4173`

## Flujo Git

`main` es producción.

Flujo recomendado:
1. partir de `main` actualizado;
2. crear rama de tarea;
3. implementar;
4. ejecutar build/check/tests;
5. revisar diff;
6. commit y push de la rama;
7. PR;
8. validar preview de Cloudflare;
9. merge a `main` solo con aprobación;
10. validar producción;
11. actualizar handoff/worklog.

No usar force push ni operaciones destructivas.

## Carpeta local usada

La copia local histórica usada en Windows es:

```text
C:\Cursor\CONPLANOS\conplanos-web
```

Comprobar:

```powershell
cd C:\Cursor\CONPLANOS\conplanos-web
git remote -v
git status
git branch --show-current
```

Remoto esperado:
`https://github.com/chris5logar/conplanos-web.git`

GitHub es la fuente de verdad.

## Continuidad para Claude y otros agentes

Leer en orden:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/PROJECT_HANDOFF.md`
4. `docs/SEO_HANDOFF.md`
5. `docs/SEO_DECISIONS.md`
6. `docs/SEO_WORKLOG.md` si se requiere historial

Si documentación y repositorio se contradicen, manda el repositorio. Corregir la documentación antes de continuar.

## Historia resumida

La primera versión se construyó como sitio estático generado con Node, se versionó en GitHub y se probó inicialmente mediante previews de Cloudflare Pages. Posteriormente se publicó `conplanos.com`, se migró/validó DNS en Cloudflare, se preservaron `app.conplanos.com`, correo y FTP, y se completaron las primeras fases de SEO técnico, contenido, rendimiento y analítica.

El detalle histórico no debe usarse como estado vigente. Para estado actual consultar `docs/PROJECT_HANDOFF.md` y `docs/SEO_HANDOFF.md`.

## Material audiovisual y conversión

Prioridades de mejora futura:
- casos reales autorizados;
- más fotografías reales de obra, topografía y equipo;
- logo vectorial/transparente cuando exista;
- reseñas auténticas;
- videos verticales cortos;
- presentación del equipo;
- seguimiento de conversiones.

Consultar `docs/IMAGENES.md` para activos y reemplazos.
