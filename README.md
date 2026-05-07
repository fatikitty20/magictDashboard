# Magictronic PSP Dashboard

Dashboard PSP construido con React, TypeScript, Vite y TailwindCSS. La app consume autenticacion real con JWT, protege rutas por rol y muestra cards del dashboard desde endpoints reales.

## Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- TailwindCSS
- Vitest + ESLint

## Funcionalidad actual

- Login real contra `POST /api/v1/auth/login`.
- Token JWT guardado solo en memoria.
- Rol obtenido desde JWT o respuesta del backend; no se infiere por email.
- Rutas privadas con `RutaProtegida`.
- Dashboard conectado a `GET /api/v1/dashboard/kpis`.
- Pagos conserva su flujo de API real.
- Pedidos, clientes, reportes y transacciones conservan carpeta y ruta, pero no muestran datos hasta tener endpoint oficial.
- Sidebar con opciones ocultables sin eliminar rutas.

## Arquitectura

```text
src/
  config/routes.tsx
  features/
    auth/
    dashboard/
    payments/
    orders/
    clients/
    reports/
    transactions/
  shared/
    api/
    layouts/
    ui/
```

Regla principal:

```text
View -> hook -> domain -> api -> apiClient -> backend
```

La documentacion tecnica vive en [docs/README.md](docs/README.md).

## Uso

```bash
npm install
npm run dev
```

Validar el proyecto:

```bash
npm run check
```

## Seguridad

El frontend no debe inventar permisos. Si backend no entrega rol valido en el token o respuesta de login, la sesion se rechaza.

Pendientes importantes:

- confirmar contrato real de `/auth/refresh` y `/auth/logout`;
- manejar 401 global con cierre de sesion;
- conectar graficas `dashboard/hourly` y `dashboard/pulse`;
- validar respuestas API con schemas runtime;
- asegurar en backend el alcance por usuario, rol y merchant/company.
