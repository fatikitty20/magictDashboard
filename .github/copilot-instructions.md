# Instrucciones para Copilot - Magict Dashboard

## Descripción General del Proyecto

**Magict Dashboard** es un panel administrativo web diseñado para gestionar una tienda online conectada a un flujo de Payment Service Provider (PSP). El propósito principal es centralizar la información clave del negocio, como métricas de ventas, pedidos, pagos, transacciones, reportes y clientes, en una interfaz moderna, responsiva y fácil de usar.

### Tecnologías Principales
- **Frontend Framework**: React 18 con TypeScript para desarrollo tipado y robusto.
- **Build Tool**: Vite para un desarrollo rápido y eficiente.
- **Styling**: Tailwind CSS con un sistema de diseño personalizado basado en variables CSS para modo claro y oscuro.
- **Routing**: React Router DOM para navegación del lado cliente.
- **State Management**: TanStack Query (React Query) para manejo de estado de servidor y caché de datos.
- **State Management Local**: Zustand para sesión/autenticación persistente.
- **API / Data Fetching**: `fetch` nativo encapsulado en `shared/api/apiClient.ts` + TanStack Query para cache, loading y refetch.
- **UI Components**: Radix UI para componentes accesibles y Lucide React para iconos.
- **Testing**: Vitest con Testing Library para pruebas unitarias.
- **Linting**: ESLint con reglas específicas para React y TypeScript.
- **Otras Dependencias**: Clsx y Tailwind Merge para manejo de clases CSS condicionales.

El proyecto está estructurado como una Single Page Application (SPA) con autenticación mock, rutas protegidas y un diseño modular basado en features.

## Análisis de la Estructura de Carpetas

La estructura del proyecto sigue una organización modular y escalable, separando concerns por features y tipos de archivos:

- **`src/`**: Código fuente principal de la aplicación.
  - **`components/ui/`**: Componentes reutilizables de UI (ej. `tooltip.tsx`, `StatusPill.tsx`).
  - **`shared/`**: Utilidades compartidas de la aplicación.
    - **`api/`**: Cliente HTTP base (`apiClient.ts`).
    - **`layouts/`**: Layouts globales (`DashboardLayout`, `Sidebar`, `Topbar`).
    - **`ui/`**: Helpers visuales compartidos (`estilosDashboard.ts`).
  - **`features/`**: Módulos principales organizados por dominio.
    - **`auth/`**: Autenticación, roles, permisos, Zustand store y rutas protegidas.
    - **`dashboard/`**: Configuración dinámica por rol, data mock, widgets y vista principal.
    - **`payments/`**: Capa API, dominio, mappers, hooks React Query, componentes y vista.
    - **`orders/`**: Gestión de pedidos.
    - **`clients/`**: Gestión de clientes.
    - **`reports/`**: Reportes y análisis.
    - **`transactions/`**: Vista de transacciones para admin.
    - **`theme/`**: Gestión de modo claro/oscuro.
    - **`i18n/`**: Selector de idioma y utilidades de traducción.
  - **`lib/`**: Utilidades compartidas (ej. utils.ts).
  - **`pages/`**: Páginas principales de la aplicación (Dashboard, Login, etc.).
  - **`App.tsx`**: Componente raíz con proveedores y rutas.
  - **`main.tsx`**: Punto de entrada que renderiza la app.
  - **`index.css`**: Estilos globales con variables CSS.
  - **`vite-env.d.ts`**: Tipos para Vite.
  - **`ARCHITECTURE.md`**: Documento con el árbol técnico y el flujo de API.

- **`public/`**: Archivos estáticos (robots.txt).

- **Archivos de Configuración**:
  - **`package.json`**: Dependencias y scripts.
  - **`vite.config.ts`**: Configuración de Vite (servidor, proxy `/api`, alias `@` para `src`).
  - **`tsconfig.json`**: Configuración raíz para resolución de rutas y referencias.
  - **`tailwind.config.ts`**: Configuración de Tailwind con colores personalizados.
  - **`tsconfig.*.json`**: Configuración de TypeScript.
  - **`eslint.config.js`**: Reglas de linting.
  - **`vitest.config.ts`**: Configuración de tests.

## Convenciones de Código

### Nombrado
- **Variables y Funciones**: Uso obligatorio de camelCase (ej. `userName`, `getClientData`).
- **Componentes**: PascalCase (ej. `ClientsTable`).
- **Archivos**: kebab-case para archivos (ej. `clients-service.ts`), PascalCase para componentes (ej. `ClientDetailsPanel.tsx`).
- **Constantes**: UPPER_SNAKE_CASE (ej. `API_BASE_URL`).

### Principios de Clean Code
- **Legibilidad**: Código autoexplicativo, nombres descriptivos, comentarios solo cuando sea necesario.
- **Mantenibilidad**: Funciones pequeñas y enfocadas en una sola responsabilidad.
- **Consistencia**: Seguir patrones establecidos en el proyecto (ej. estructura de features).
- **Separación de Concerns**: Lógica de negocio en services, UI en components, datos en data/.
- **Tipado Estricto**: Usar TypeScript para evitar errores en runtime.
- **Tests**: Escribir pruebas para lógica crítica, especialmente en services.

## Paleta de Colores

El proyecto utiliza un sistema de colores basado en HSL con soporte para modo claro y oscuro. Las variables CSS están definidas en `src/index.css`:

### Modo Claro (:root)
- **Background**: hsl(0 0% 98%) - Blanco suave.
- **Foreground**: hsl(0 0% 7%) - Negro.
- **Primary**: hsl(0 0% 7%) - Negro para texto principal.
- **Secondary**: hsl(0 0% 92%) - Gris claro.
- **Accent**: hsl(214 88% 48%) - Azul.
- **Success**: hsl(145 58% 34%) - Verde.
- **Info**: hsl(214 88% 48%) - Azul (igual a accent).
- **Destructive**: hsl(0 72% 50%) - Rojo.
- **Muted**: hsl(0 0% 94%) - Gris muy claro.
- **Border/Input**: Tonos de gris para bordes e inputs.

### Modo Oscuro (.dark)
- **Background**: hsl(0 0% 5%) - Negro suave.
- **Foreground**: hsl(0 0% 96%) - Blanco.
- **Primary**: hsl(0 0% 96%) - Blanco.
- **Secondary**: hsl(0 0% 15%) - Gris oscuro.
- **Accent**: hsl(214 88% 56%) - Azul más brillante.
- **Success**: hsl(145 62% 42%) - Verde más brillante.
- **Destructive**: hsl(0 70% 56%) - Rojo más brillante.
- **Muted**: hsl(0 0% 13%) - Gris oscuro.

Variables específicas del dashboard: `--dashboard-soft`, `--dashboard-inverted`, etc., para elementos personalizados.

## Variables Globales, Configuraciones y Funciones Importantes

### Configuraciones
- **Vite Config**: Servidor en puerto 8081, alias `@` para `src/`, deduplicación de React.
- **Tailwind Config**: Colores personalizados, modo oscuro por clase.
- **Query Client**: Instancia global de TanStack Query en `main.tsx` para caché de datos y estado remoto.
- **API Client**: `src/shared/api/apiClient.ts` encapsula `fetch` y centraliza errores/headers.

### Variables Globales
- **Theme Context**: `ThemeModeProvider` en `features/theme/` para modo claro/oscuro.
- **Auth Store/Context**: Zustand (`store/authStore.ts`) + `useAuth` para sesión y autenticación.
- **Dashboard Config**: `useDashboard()` para decidir widgets y menu según rol.

### Funciones Importantes
- **Auth Service** (`features/auth/authService.ts`): Funciones para login/logout mock.
- **Payments API** (`features/payments/api/paymentsApi.ts`): Construye URLs, normaliza respuesta y llama a `apiClient`.
- **Payments Domain** (`features/payments/domain/getPayments.ts`): Orquesta mapeo, filtros, paginación y estadisticas.
- **Services por Feature**: Cada módulo mantiene su lógica de negocio separada en `api/`, `domain/`, `mappers/` o `services/` según corresponda.
- **Utils** (`lib/utils.ts`): Funciones auxiliares como `cn` para combinar clases Tailwind.

## Buenas Prácticas para Proyectos con Vite/React

### Organización
- **Feature-Based Structure**: Agrupar código por dominio (auth, dashboard, etc.) en lugar de por tipo.
- **Componentes Reutilizables**: Colocar en `components/ui/` o dentro de features.
- **Separación de Datos**: Usar carpetas `data/`, `services/`, `types/` por feature.

### Routing
- Usar React Router con rutas protegidas (`ProtectedRoute`).
- Las rutas se centralizan en `src/config/routes.tsx`.
- Layouts anidados para secciones autenticadas con `DashboardLayout` en `shared/layouts/`.

### Componentes
- **Functional Components**: Preferir hooks sobre class components.
- **Custom Hooks**: Para lógica reutilizable (ej. `useAuth`, `useThemeMode`).
- **Props Typing**: Usar interfaces de TypeScript para props.

### Estado y Datos
- **TanStack Query**: Para fetching, caching, sincronización y refetch de datos del servidor.
- **Zustand**: Para sesión persistente y estado local de autenticación.
- **Context API**: Para estado global como tema e i18n.

### Estilos
- **Tailwind Utility-First**: Clases en línea, usar `clsx` o `cn` para condicionales.
- **CSS Variables**: Para temas y colores personalizados.

### Testing
- **Unit Tests**: En services y hooks con Vitest.
- **Component Tests**: Con Testing Library.

### Performance
- **Lazy Loading**: Importar componentes dinámicamente si es necesario.
- **Memoización**: Usar `React.memo`, `useMemo`, `useCallback` para optimizaciones.

## Otros Detalles Relevantes

- **Autenticación**: Mock con persistencia en Zustand; rutas protegidas redirigen a `/login`.
- **Internacionalización**: El proyecto está en español; mantener consistencia en textos.
- **Responsividad**: Diseño mobile-first con Tailwind.
- **Accesibilidad**: Usar Radix UI para componentes accesibles.
- **Escalabilidad**: Estructura preparada para conectar APIs reales en lugar de datos mock.
- **API**: No llamar `fetch` directo desde UI; usar `shared/api/apiClient.ts` + hooks de React Query.
- **Commits y Branches**: Seguir convenciones de Git (ej. conventional commits).

Esta documentación ayuda a Copilot a generar código consistente con el estilo y arquitectura del proyecto.