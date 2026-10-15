# Handoff general · Web CONPLANOS

Última actualización: 2026-10-15.

Este documento resume dónde está la web, cómo se creó, cómo se publica y cómo debe continuar cualquier agente (Claude, ChatGPT, Jules, Antigravity, Cursor u otro) sin depender del historial de conversación.

## 1. Identidad del proyecto

- Web oficial: https://conplanos.com
- Repositorio fuente de verdad: `chris5logar/conplanos-web`
- Rama de producción: `main`
- Hosting: Cloudflare Pages
- Aplicación interna separada: https://app.conplanos.com
- Repositorio/app interna fuera de alcance: `conplanos-app`
- No mezclar este proyecto con GNSS, LeicaAgent, CAD, Render o Neon.

## 2. Cómo se creó la web

La web pública se construyó como sitio estático ligero, sin framework de frontend y sin backend.

Arquitectura principal:
- `scripts/build.mjs`: genera la web final.
- `content/services.json`: contenido editable de servicios.
- `content/contacts.json`: fuente única de contactos.
- `content/guides.json`: guías SEO informativas.
- `dist/`: salida publicada.
- `dist/assets/styles.css`: estilos.
- `dist/assets/main.js`: interacción ligera y eventos GA4.
- `dist/assets/brand/`: logo, favicon y tarjeta social.
- `dist/assets/images/`: imágenes reales y de apoyo.
- `scripts/check.mjs`: validaciones técnicas.
- `scripts/seo.test.mjs`: pruebas SEO.
- `scripts/site-mode.mjs`: decide producción o preview.

No requiere dependencias npm externas. Node >= 20.11.

## 3. Publicación actual

Producción está activa en https://conplanos.com.

Estado:
- HTTPS activo.
- `www.conplanos.com` redirige 301 a `https://conplanos.com`, conservando rutas y parámetros.
- Cloudflare Pages publica desde `main`.
- La salida de build es `dist`.
- Producción usa `index, follow` y GA4.
- Previews de ramas distintas de `main` usan `noindex, nofollow` y no cargan GA4.

DNS relevante:
- raíz y `www` -> Cloudflare Pages (`conplanos-web.pages.dev` como destino del proyecto).
- `app.conplanos.com` conserva su destino en Render y no debe modificarse desde este repositorio.
- correo y FTP conservan la infraestructura anterior; no modificar DNS desde tareas de código o SEO.

No tocar DNS, dominio, correo, FTP, Render o Neon salvo tarea explícita aprobada por el propietario.

## 4. Google y medición

- Search Console: propiedad `conplanos.com` verificada.
- Sitemap: https://conplanos.com/sitemap.xml
- GA4: `G-7DCRJN061J`
- Eventos:
  - `click_whatsapp`
  - `click_phone`
  - `quote_request`
- No enviar PII a GA4.
- `quote_request` y `click_whatsapp` pueden originarse en el mismo clic; no sumar ambos como dos leads.

La continuidad SEO detallada vive en:
- `docs/SEO_HANDOFF.md`
- `docs/SEO_DECISIONS.md`
- `docs/SEO_WORKLOG.md`
- `docs/SEO_PLAN.md`

## 5. Flujo Git obligatorio

`main` es producción.

Para cambios importantes:
1. Leer documentación de continuidad.
2. Crear rama de trabajo desde `main`.
3. Implementar cambio pequeño y controlado.
4. Ejecutar pruebas.
5. Hacer commit en la rama.
6. Push de la rama.
7. Crear PR.
8. Validar preview de Cloudflare.
9. Merge a `main` solo con aprobación expresa del propietario.
10. Validar producción.
11. Actualizar documentación.

No usar:
- `git reset --hard`
- `git clean` destructivo
- `push --force`
- merge automático con conflictos.

## 6. Pruebas mínimas

Antes de proponer merge:

```bash
npm run build
npm run check
npm test
```

Si se tocó el modo preview:

```bash
npm run build:preview
npm run check:preview
```

El build regenera `dist/` y `docs/TEXTOS.md`.

## 7. Ruta local usada en Windows

La copia local usada durante el desarrollo está en:

```text
C:\Cursor\CONPLANOS\conplanos-web
```

Esa carpeta es un clon del repositorio GitHub. No crear una segunda copia salvo necesidad real.

Para comprobar que es la copia correcta:

```powershell
cd C:\Cursor\CONPLANOS\conplanos-web
git remote -v
git branch --show-current
git status
```

El remoto esperado es:
`https://github.com/chris5logar/conplanos-web.git`

## 8. Continuidad con Claude Desktop

Claude debe usar dos fuentes de contexto:

1. GitHub: `chris5logar/conplanos-web`
2. Carpeta local: `C:\Cursor\CONPLANOS\conplanos-web`

Al iniciar una tarea:
- leer `AGENTS.md`;
- leer `CLAUDE.md`;
- leer este archivo;
- leer `docs/SEO_HANDOFF.md`;
- leer `docs/SEO_DECISIONS.md`;
- revisar `git status`, rama y últimos commits.

La carpeta local permite revisar y modificar el clon de trabajo. GitHub sigue siendo la fuente de verdad.

Claude no debe asumir que una conversación anterior contiene el estado vigente: debe consultar estos archivos y el repositorio.

## 9. Identidad y diseño

Identidad actual:
- negro/grafito;
- blanco;
- amarillo corporativo aproximado `#FFC63A`.

Principios:
- empresarial;
- técnico;
- sobrio;
- profesional;
- sin apariencia de plantilla genérica;
- sin inventar cifras, certificaciones, premios, colegiaturas, proyectos o testimonios;
- fotografías reales se distinguen de imágenes referenciales.

Servicios principales y contenido comercial viven en `content/services.json`.

Contacto principal y WhatsApp se leen de `content/contacts.json`.

## 10. Regla de prioridad

Antes de proponer cambios:
1. no romper producción;
2. mantener claridad comercial;
3. mantener SEO y analítica;
4. mejorar UX y conversión;
5. preservar rendimiento;
6. evitar complejidad innecesaria.

No introducir framework, CMS, backend o dependencia pesada sin justificarlo y obtener aprobación.

## 11. Documentos que mandan

Orden de lectura recomendado:
1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/PROJECT_HANDOFF.md` (este archivo)
4. `docs/SEO_HANDOFF.md`
5. `docs/SEO_DECISIONS.md`
6. `docs/SEO_WORKLOG.md` solo para historial
7. `docs/ENTREGA.md` para publicación e infraestructura

Si documentación y repositorio se contradicen, manda el estado real del repositorio; corregir la documentación antes de continuar.
