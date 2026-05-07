# Arquitectura - Magictronic PSP

El proyecto usa React + TypeScript + Vite. Aunque algunas instrucciones mencionen Next.js, esta app actualmente es SPA con Vite y React Router.

## Flujo general

```text
App.tsx
  -> config/routes.tsx
    -> RutaProtegida
      -> DashboardLayout
        -> Sidebar / Topbar
        -> vista del feature
```

## Patron por feature

```text
features/<feature>/
  views/       pantalla completa
  components/  piezas visuales
  hooks/       conexion React con datos
  domain/      reglas de negocio
  api/         llamadas HTTP reales
  mappers/     backend DTO -> modelo UI
  types/       contratos TypeScript
```

La vista no debe construir URLs ni llamar `fetch`. El camino recomendado es:

```text
View -> hook -> domain -> api -> apiClient -> backend
```

## Autenticacion

```text
LoginView.tsx
  -> useAuth.signIn()
    -> authService.iniciarSesion()
      -> apiClient(POST /auth/login)
        -> tokenManager.setTokens()
          -> authStore.setSesion()
```

El rol no se inventa por correo. Se lee desde el JWT o desde campos de la respuesta del backend. Si no llega un rol valido, la sesion no se crea.

## Dashboard

El dashboard consume `GET /dashboard/kpis` para pintar sus cards. No usa datos locales de ejemplo.

```text
DashboardView.tsx
  -> useDashboardKpis()
    -> dashboardDomain.getDashboardKpis()
      -> dashboardApi.fetchDashboardKpis()
        -> apiClient()
      -> dashboardKpisMapper.mapDashboardKpis()
```

Los endpoints `dashboard/hourly` y `dashboard/pulse` existen en configuracion, pero sus graficas aun no estan integradas visualmente.

Pedidos, clientes, reportes y transacciones conservan su carpeta por arquitectura, pero sus vistas no muestran informacion hasta recibir endpoints reales.

## Rutas y sidebar

Las rutas viven en `src/config/routes.tsx`. El sidebar usa `src/features/dashboard/config/dashboardConfig.ts`.

Ocultar una opcion del sidebar no elimina la ruta ni la seguridad. La seguridad real esta en:

- `RutaProtegida`;
- `allowedRoles` en rutas;
- validacion del backend en cada endpoint.

## Build

- `src/`: codigo fuente editable.
- `public/`: archivos estaticos copiados tal cual.
- `dist/`: salida generada por `npm run build`; no se edita a mano.
