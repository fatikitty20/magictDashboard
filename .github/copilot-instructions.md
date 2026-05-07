# Instrucciones para Copilot - Magictronic PSP

## Contexto

Proyecto React + TypeScript + Vite. No es Next.js actualmente.

La app es un dashboard PSP con autenticacion real por JWT, rutas protegidas y arquitectura basada en features.

## Reglas de arquitectura

No llamar `fetch` desde componentes visuales.

Flujo recomendado:

```text
View -> hook -> domain -> api -> apiClient -> backend
```

Carpetas por feature:

```text
views/       pantalla completa
components/  UI del feature
hooks/       React Query / estado del feature
domain/      reglas de negocio
api/         endpoints reales
mappers/     DTO backend -> UI
types/       contratos TypeScript
```

## Autenticacion y seguridad

- Login real: `POST /api/v1/auth/login`.
- El token se guarda solo en memoria con `tokenManager`.
- El rol debe venir del JWT o respuesta backend.
- No inferir rol por correo, nombre ni texto.
- Si no hay rol valido, no crear sesion.
- El sidebar es UX; la seguridad real esta en `RutaProtegida`, rutas y backend.

## Calidad

- Codigo corto, claro y tipado.
- Nombres significativos.
- Comentarios moderados solo para conexiones importantes.
- Evitar duplicacion.
- Mantener diseño visual intacto salvo instruccion directa.
- Ejecutar `npm run check` antes de entregar cambios.
