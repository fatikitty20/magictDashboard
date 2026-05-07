# Documentacion Tecnica - Magictronic PSP

Esta carpeta contiene solo documentacion viva: debe describir lo que el proyecto hace hoy, no planes viejos.

## Documentos principales

| Documento | Uso |
| --- | --- |
| `arquitectura/ARCHITECTURE.md` | Explica estructura, capas y comunicacion entre archivos. |
| `api/ENDPOINTS_BACKEND.md` | Lista endpoints reales y como se consumen desde frontend. |
| `seguridad/PATRONES_SEGURIDAD.md` | Explica login, token, roles, rutas protegidas y riesgos. |
| `calidad/ESLINT.md` | Comandos de calidad, lint, typecheck, tests y build. |

## Regla de mantenimiento

Cuando se agregue o cambie un endpoint, se actualiza primero `api/ENDPOINTS_BACKEND.md`.
Cuando se cambie la estructura de carpetas o flujo entre archivos, se actualiza `arquitectura/ARCHITECTURE.md`.
