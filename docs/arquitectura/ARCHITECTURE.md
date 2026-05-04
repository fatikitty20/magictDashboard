# Architecture - Magict Dashboard

Este archivo resume la estructura real del proyecto, que hace cada carpeta/archivo principal y como se conecta la integracion de API del modulo de Payments.

## Resumen General

Magict Dashboard esta organizado con una arquitectura basada en features. La idea es separar:
- UI reutilizable global
- Features de negocio
- Logica de datos/API
- Rutas y layout de aplicacion
- Estado de autenticacion y permisos

La app usa React + TypeScript + Vite, con React Router, TanStack Query, Zustand, Tailwind y i18n.

## Stack De Consumo De APIs

En este proyecto no consumimos APIs con `fetch` directamente en la UI. El flujo real es:

- `fetch()` vive encapsulado en `src/shared/api/apiClient.ts`
- TanStack Query (React Query) maneja cache, loading, refetch y sincronizacion de datos
- Los hooks de feature, como `usePayments()`, exponen la data consumida por los componentes

Librerias usadas para APIs:
- `fetch` nativo de JavaScript, dentro de un wrapper propio
- `@tanstack/react-query` para estado remoto y cache

Esto significa que:
- la UI no llama `fetch` directamente
- la logica de red se divide en:
  - `shared/api/` → cliente HTTP reutilizable (apiClient)
  - `features/*/api/` → endpoints específicos del dominio

## Arbol de Carpetas

```text
src/
  App.tsx                     # Root de la app: providers + router principal
  main.tsx                    # Punto de entrada de React
  index.css                   # Estilos globales y variables CSS
  i18n.ts                     # Inicializacion de i18n
  i18next.d.ts                # Tipos para traducciones
  vite-env.d.ts              # Tipos de Vite

  components/
    ui/                       # Componentes UI globales reutilizables
      tooltip.tsx             # Wrapper de Radix Tooltip
      StatusPill.tsx          # Badge/pill de estado compartido

  config/
    routes.tsx                # Definicion centralizada de rutas

  features/
    auth/                     # Login, sesion, roles y permisos
      authService.ts          # Servicio mock de autenticacion
      useAuth.ts              # Hook de acceso a la sesion
      store/authStore.ts      # Estado persistente con Zustand
      roles.ts                # Definicion de roles
      permissions.ts          # Mapa de permisos por rol
      usePermissions.ts       # Hook para validar permisos
      ProtectedRoute.tsx      # Guard de rutas por autenticacion/rol
      views/LoginView.tsx     # Vista de login
      index.ts                # Export publico del feature

    dashboard/                # Dashboard principal y su configuracion
      data.ts                 # Datos mock y tipos del dashboard
      config/dashboardConfig.ts # Config dinamica por rol
      hooks/useDashboard.ts    # Hook que expone la config segun rol
      components/             # Widgets visuales del dashboard
      views/DashboardView.tsx  # Vista completa del dashboard
      index.ts                # Export publico del feature

    payments/                 # Modulo de pagos/transacciones
      api/paymentsApi.ts       # Capa de llamadas al backend
      domain/getPayments.ts    # Orquestacion de negocio para listar pagos
      domain/paymentsFilters.ts # Orden/paginacion/estadisticas
      hooks/usePayments.ts     # Hook React Query
      mappers/paymentMapper.ts # Mapeo backend -> modelo UI
      types/payment.ts         # Tipos de dominio
      components/              # Tabla, stats, badges
      views/Payments.tsx       # Pantalla principal de pagos
      index.ts                # Export publico del feature

    orders/                   # Modulo de pedidos
      components/
      types/
      views/Orders.tsx

    clients/                  # Modulo de clientes
      components/
      types/
      views/Clients.tsx

    reports/                  # Modulo de reportes
      components/
      types/
      views/Reports.tsx

    transactions/             # Vista de transacciones admin
      services/
      types/
      views/Transactions.tsx
      index.ts

    theme/                    # Tema claro/oscuro
      components/ThemeToggle.tsx
      ThemeModeProvider.tsx
      useThemeMode.ts
      themeService.ts
      index.ts

    i18n/                     # Utilidades de idioma
      components/SelectorIdioma.tsx

  shared/
    api/apiClient.ts           # Cliente HTTP comun
    layouts/                   # Layouts globales de la app
      DashboardLayout.tsx      # Layout con sidebar + topbar
      Sidebar.tsx              # Navegacion lateral
      Topbar.tsx               # Barra superior
    ui/
      estilosDashboard.ts      # Helpers de clases Tailwind para dashboard

  lib/
    utils.ts                   # Helper cn() y utilidades comunes
    mockService.ts             # Helpers de demora/mock

  locales/
    en/common.json             # Traducciones ingles
    es/common.json             # Traducciones espanol

  pages/
    Index.tsx                  # Redireccion inicial segun sesion
    Login.tsx                  # Entry page de login
    Dashboard.tsx              # Entry page del dashboard
    NotFound.tsx               # 404
```

## Que Hace Cada Capa

### `src/App.tsx`
Orquesta la aplicacion completa. Define providers globales, router, layout protegido y rutas publicas/protegidas.

### `src/main.tsx`
Arranca React en el DOM. Aqui se montan los providers globales de alto nivel.

### `src/config/routes.tsx`
Es la fuente central de rutas. Facilita auditar que ruta existe, que pagina la renderiza y que roles la pueden usar.

### `src/components/ui/`
Componentes globales reutilizables por cualquier feature. No deben contener logica de negocio de un dominio especifico.

### `src/features/auth/`
Gestiona autenticacion, sesion, roles y permisos. Esta carpeta decide quien puede entrar y que puede ver.

### `src/features/dashboard/`
Define la experiencia principal del panel. `useDashboard()` elige que widgets y menu mostrar segun el rol.

### `src/features/payments/`
Contiene toda la logica de pagos/transacciones: fetch, mapeo, filtros, hook, componentes y vista.

### `src/features/orders/`, `clients/`, `reports/`, `transactions/`
Cada feature agrupa su propio dominio. La idea es evitar logica duplicada y mantener el codigo aislado por area funcional.

### `src/shared/layouts/`
Contiene piezas de layout reutilizables que no pertenecen a un feature de negocio concreto, como sidebar y topbar.

### `src/shared/ui/`
Helpers visuales y estilos compartidos para componentes de toda la app.

### `src/lib/`
Funciones base compartidas. Aqui van utilidades puras, no logica de features.

## Integracion De API En Payments

El flujo de Payments esta separado en varias capas para no mezclar UI con acceso a datos:

1. `src/shared/api/apiClient.ts`
   - Cliente HTTP comun.
  - Encapsula `fetch`, agrega headers JSON y maneja errores.

2. `src/features/payments/api/paymentsApi.ts`
   - Construye la URL final de backend.
   - Convierte parametros UI a query params del API.
   - Usa `apiClient<PaymentsApiResponse>(url)` para hacer la llamada.
   - Normaliza estados, paginacion y respuesta flexible del backend.

3. `src/features/payments/mappers/paymentMapper.ts`
   - Convierte la respuesta cruda del backend (`RoxTransaction`) al modelo que consume la UI (`Payment`).

4. `src/features/payments/domain/paymentsFilters.ts`
   - Ordena, pagina y calcula estadisticas cuando el frontend necesita unir varias respuestas.

5. `src/features/payments/domain/getPayments.ts`
   - Es la funcion principal de negocio.
   - Decide si usar paginacion server-side o client-side segun el estado solicitado.
   - Llama a `fetchPaginatedTransactions()` y luego a los filtros/mapper.

6. `src/features/payments/hooks/usePayments.ts`
  - Expone la data al React tree con TanStack Query (`@tanstack/react-query`).
   - Maneja cache, loading y refetch.

7. `src/features/payments/views/Payments.tsx`
   - Consume `usePayments()`.
   - Renderiza filtros, stats, tabla y paginacion.

### Flujo Simplificado

```text
Payments.tsx
  -> usePayments()
    -> getPayments()
      -> fetchPaginatedTransactions()
        -> apiClient()
          -> fetch() al backend
```

### Donde se integra realmente la API

La integracion directa con el backend esta en:
- `src/shared/api/apiClient.ts`
- `src/features/payments/api/paymentsApi.ts`

La logica de orquestacion esta en:
- `src/features/payments/domain/getPayments.ts`

La UI nunca llama `fetch` directamente. Solo consume el hook `usePayments()`.

## Convenciones Importantes

- Los `types/` solo declaran tipos.
- Los `api/` o `services/` hacen acceso a datos.
- Los `domain/` encapsulan logica de negocio.
- Los `hooks/` exponen el estado a React.
- Los `components/` solo renderizan UI.
- Los `views/` componen el feature completo.
- Los `index.ts` son la API publica del feature.

## Nota Practica Sobre Rutas

Si mueves archivos, recuerda actualizar:
- `src/App.tsx`
- `src/config/routes.tsx`
- `src/features/<feature>/index.ts`
- imports internos de layouts, shared ui y helpers

Eso evita que el editor marque rutas falsas y que el runtime rompa al arrancar.
