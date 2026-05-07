# Endpoints Backend

Los endpoints se centralizan en `src/shared/api/apiConfig.ts` y se consumen con `src/shared/api/apiClient.ts`.

## Base de desarrollo

El navegador llama a:

```text
/api/v1
```

Vite reenvia esa ruta al backend configurado en `vite.config.ts`.

## Endpoints actuales

| Endpoint | Metodo | Estado frontend | Archivo principal |
| --- | --- | --- | --- |
| `/auth/login` | `POST` | Integrado | `src/features/auth/authService.ts` |
| `/auth/refresh` | `POST` | Preparado si backend lo soporta | `src/features/auth/authService.ts` |
| `/auth/logout` | `POST` | Preparado si backend lo soporta | `src/features/auth/authService.ts` |
| `/dashboard/kpis` | `GET` | Integrado en dashboard admin | `src/features/dashboard/api/dashboardApi.ts` |
| `/dashboard/hourly` | `GET` | Pendiente de grafica | `src/shared/api/apiConfig.ts` |
| `/dashboard/pulse` | `GET` | Pendiente de grafica dona | `src/shared/api/apiConfig.ts` |

## Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "dashboard.user@example.com",
  "password": "********"
}
```

Respuesta esperada:

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "refreshToken": "<opcional>"
}
```

El frontend acepta rol desde el JWT o desde la respuesta. Roles validos:

- admin: `ROLE_ADMIN`, `ROLE_ANALYTICS`, `ADMIN`, `ANALYTICS`;
- client: `ROLE_CLIENT`, `ROLE_USER`, `ROLE_MERCHANT`, `CLIENT`, `USER`, `MERCHANT`.

Si backend no devuelve rol valido, el login falla por seguridad.

## Endpoints protegidos

Todo endpoint protegido debe recibir:

```http
Authorization: Bearer <TOKEN>
Accept: application/json
```

`apiClient` agrega el header `Authorization` automaticamente si existe token en memoria.

## Para integrar graficas

Crear el mismo flujo usado por KPIs:

```text
useDashboardHourly -> dashboardDomain -> dashboardApi -> apiClient
useDashboardPulse  -> dashboardDomain -> dashboardApi -> apiClient
```

Despues mapear la respuesta a modelos simples para componentes visuales:

```ts
type ChartPoint = { label: string; value: number };
```
