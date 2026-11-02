---
name: cierre-tarea
description: Cierra una tarea de la web CONPLANOS con pruebas verificables y actualizaciones de los MD SEO para continuidad entre agentes.
---

# Cierre de tarea · Web CONPLANOS

Aplicar después de cada tarea relevante. Las reglas de `AGENTS.md` y `CLAUDE.md` prevalecen. No instalar MCP.

1. Comprobar `git status`, rama, últimos commits y PR; confirmar alcance.
2. Documentar cambios reales, archivos y riesgos; no inventar resultados de CI ni despliegues.
3. Ejecutar `npm run build`, `npm run check`, `npm test` cuando el entorno lo permita. Si afecta preview, ejecutar también sus validaciones. Registrar los resultados o explicar «No ejecutado».
4. Actualizar `docs/SEO_HANDOFF.md` con el estado SEO **comprobado** y un siguiente paso concreto, solo si cambió.
5. Añadir entrada al final de `docs/SEO_WORKLOG.md` (append-only) para tareas relevantes.
6. Actualizar `docs/SEO_DECISIONS.md` solo ante una decisión nueva o sustituida; `docs/PROJECT_HANDOFF.md` solo si cambian arquitectura, publicación o flujo.
7. Incluir los MD en el PR de la tarea. No hacer push a `main`, merge ni publicar sin autorización.
8. Entregar al propietario un informe breve con enlaces al PR y commit, pruebas, bloqueos y próximo paso.

## Formato de informe

- **Objetivo:**
- **Rama / commit / PR:**
- **Archivos y cambios:**
- **Pruebas realmente ejecutadas:**
- **Pendiente de verificar:**
- **Riesgos / reversión:**
- **MD actualizados:**
- **Siguiente paso único:**

Si no hubo cambio de estado, no sobrescribir documentos solo para cambiar la fecha.
