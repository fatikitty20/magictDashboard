# Documentacion del Proyecto

Esta carpeta concentra los documentos tecnicos del proyecto. El `README.md` principal se queda en la raiz porque GitHub lo usa como portada del repositorio.

## Indice

| Tema | Documento | Para que sirve |
| --- | --- | --- |
| Arquitectura | [arquitectura/ARCHITECTURE.md](arquitectura/ARCHITECTURE.md) | Explica estructura general, flujo de API y carpetas principales. |
| Arquitectura por features | [arquitectura/FEATURES_ARCHITECTURE.md](arquitectura/FEATURES_ARCHITECTURE.md) | Explica como se organizan los modulos dentro de `src/features`. |
| Analisis global | [analisis/ANALISIS_GLOBAL_PROYECTO.md](analisis/ANALISIS_GLOBAL_PROYECTO.md) | Resume fortalezas, riesgos y deuda tecnica. |
| Seguridad | [seguridad/PATRONES_SEGURIDAD.md](seguridad/PATRONES_SEGURIDAD.md) | Explica rutas protegidas, roles y pendientes de seguridad. |
| Features | [features/REVISION_FEATURES.md](features/REVISION_FEATURES.md) | Revisa modulo por modulo que hace cada feature. |
| Calidad | [calidad/ESLINT.md](calidad/ESLINT.md) | Explica ESLint, scripts y archivos modificados. |
| Tickets | [tickets/TICKETS_ACCIONABLES.md](tickets/TICKETS_ACCIONABLES.md) | Lista tareas recomendadas para continuar el proyecto. |

## Regla de organizacion

- Documentos de arquitectura: `docs/arquitectura/`
- Documentos de seguridad: `docs/seguridad/`
- Documentos de calidad: `docs/calidad/`
- Documentos de analisis: `docs/analisis/`
- Documentos por feature: `docs/features/`
- Tickets y backlog: `docs/tickets/`

## Nota actual de arquitectura

`payments` es el feature modelo porque ya usa API real con `api`, `domain`, `hooks` y `mappers`. `orders`, `clients`, `reports` y `transactions` ya tienen esas carpetas preparadas, pero aun usan mocks mientras no exista backend real para esas vistas.
