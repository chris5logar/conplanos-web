# CONPLANOS — Política de automatización

## Objetivo

Reducir al mínimo la intervención manual del propietario manteniendo trazabilidad, pruebas y reversibilidad.

## Roles

### ChatGPT
- Director técnico y orquestador.
- Revisa PR, diff, checks y riesgos.
- Puede marcar PR como Ready, aprobar y mergear cambios seguros.
- Valida producción y Search Console cuando disponga de las herramientas.
- Escala al propietario solo decisiones sensibles o irreversibles.

### Claude Code / Codex
- Programan y corrigen.
- Trabajan siempre en rama.
- Ejecutan build, tests y validaciones.
- Hacen commit, push y crean PR.
- Actualizan documentación de continuidad.
- No hacen force-push ni cambios destructivos.

## Cambios que pueden avanzar sin intervención del propietario

- documentación;
- tests, lint y checks;
- correcciones técnicas reversibles;
- refactors sin cambio comercial;
- SEO técnico;
- canonical, robots, sitemap y schema;
- mejoras de rendimiento;
- bugs evidentes;
- ajustes de accesibilidad;
- cambios internos sin efectos legales o financieros.

Para estos cambios:
1. rama separada;
2. pruebas en verde;
3. PR;
4. revisión de ChatGPT;
5. merge automático si no hay conflictos, secretos ni riesgos sensibles;
6. validación posterior.

## Cambios que requieren escalamiento al propietario

- force push o reset destructivo;
- eliminar datos o repositorios;
- secretos, credenciales o permisos críticos;
- DNS, dominio o transferencia de propiedad;
- pagos, compras o compromisos financieros;
- textos o decisiones legales sensibles;
- precios, contratos o condiciones comerciales;
- cambios de identidad principal del negocio;
- cambios críticos en Google Business Profile;
- migraciones irreversibles o con riesgo alto de pérdida de datos.

## Reglas GitHub

- `main` es producción.
- No hacer push directo a `main` salvo emergencia expresamente documentada.
- Usar PR pequeños y trazables.
- No mergear con conflictos.
- No mergear con pruebas relevantes fallando.
- Para cambios de código, revisar el diff antes del merge.
- Mantener `AGENTS.md`, `CLAUDE.md`, `docs/SEO_HANDOFF.md`, `docs/SEO_DECISIONS.md` y `docs/SEO_WORKLOG.md` como fuente de continuidad.

## Flujo automático preferido

objetivo → agente programador → rama → pruebas → PR → revisión ChatGPT → merge → deploy → validación → documentación

## Uso de agentes

- Una tarea normal usa un solo programador: Claude Code o Codex.
- Una tarea importante puede usar un segundo agente como auditor.
- Evitar duplicar trabajo y consumir cuotas sin necesidad.
- Si una tarea puede resolverse directamente con conectores de ChatGPT, no abrir una sesión de programación innecesaria.

## Principio de seguridad

Automatizar todo lo reversible y verificable. Escalar solo lo irreversible, sensible o que requiera una decisión empresarial real.
