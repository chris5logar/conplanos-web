# CLAUDE.md

Este repositorio es la web https://conplanos.com. Las reglas completas están en `AGENTS.md`; este archivo define el procedimiento específico para Claude.

## Contexto que Claude debe leer antes de modificar

1. `AGENTS.md`
2. `docs/PROJECT_HANDOFF.md`
3. `docs/SEO_HANDOFF.md`
4. `docs/SEO_DECISIONS.md`

Consultar `docs/SEO_WORKLOG.md` cuando haga falta historial.

No depender de conversaciones anteriores como fuente de verdad. Si el chat contradice el repositorio o estos documentos, manda el estado real del repositorio.

## Repositorio y carpeta local

- GitHub: `chris5logar/conplanos-web`
- Producción: rama `main`
- Web: https://conplanos.com
- Carpeta local usada en Windows: `C:\Cursor\CONPLANOS\conplanos-web`

Antes de trabajar revisar:

```powershell
git status
git branch --show-current
git log --oneline -5
git remote -v
```

## Forma de trabajo

- No modificar `main` directamente para cambios importantes.
- Crear una rama por tarea.
- Hacer cambios pequeños y controlados.
- No tocar app.conplanos.com, Render, Neon, DNS, correo ni FTP desde tareas normales del repositorio.
- No introducir credenciales en código.
- No inventar datos comerciales, legales, técnicos o profesionales.
- Mantener el sitio estático salvo aprobación expresa para cambiar arquitectura.
- Conservar SEO, GA4, sitemap, robots, JSON-LD, responsive y accesibilidad.

## Antes de terminar una tarea

Ejecutar las pruebas disponibles y no declarar las que no se pudieron ejecutar:

```bash
npm run build
npm run check
npm test
```

Si se tocó preview:

```bash
npm run build:preview
npm run check:preview
```

Después:

- revisar `git diff`;
- actualizar `docs/SEO_HANDOFF.md` si cambia el estado SEO;
- añadir entrada a `docs/SEO_WORKLOG.md` si la tarea es relevante;
- actualizar `docs/SEO_DECISIONS.md` si hubo decisión nueva;
- actualizar `docs/PROJECT_HANDOFF.md` si cambia arquitectura, publicación o flujo general;
- indicar commit resultante y siguiente paso.

`main` es producción: no hacer push a `main` ni merge sin aprobación expresa del propietario.
