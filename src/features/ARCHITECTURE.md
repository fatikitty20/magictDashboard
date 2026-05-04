# Arquitectura Escalable - Magict Dashboard

## Visión General

Este proyecto utiliza una **arquitectura basada en features** con **separación clara de responsabilidades** y **control de acceso centralizado (RBAC)**.

---

## 📁 Estructura de Directorios

### Estructura Estándar de cada Feature

```
src/features/<feature>/
├── types/
│   └── <feature>.ts              # Modelos TypeScript SOLO
├── services/
│   └── <feature>Service.ts       # API calls y acceso a datos SOLO
├── hooks/
│   └── use<Feature>.ts           # Lógica de negocio reutilizable SOLO
├── components/
│   ├── <Feature>Stats.tsx        # Componentes específicos del feature
│   └── <Feature>Table.tsx        # Componentes específicos del feature
├── views/
│   └── <Feature>View.tsx         # Página completa (composición)
├── data/ (opcional)
│   └── <feature>Data.ts          # Datos mock (temporal)
├── mappers/ (opcional)
│   └── <feature>Mapper.ts        # Transformación de datos
└── index.ts                      # 🌟 Exports públicos (API limpia)
```

### Estructura Global del Proyecto

```
src/
├── components/ui/                # Componentes reutilizables globales
│   ├── tooltip.tsx
│   └── StatusPill.tsx
├── config/
│   └── routes.tsx                # 🌟 Rutas centralizadas
├── features/
│   ├── auth/                     # Autenticación y RBAC
│   │   ├── roles.ts              # Definición de roles
│   │   ├── permissions.ts        # Sistema de permisos
│   │   ├── usePermissions.ts     # Hook para verificar permisos
│   │   ├── ProtectedRoute.tsx    # Ruta protegida con roles
│   │   └── index.ts
│   ├── dashboard/                # Dashboard (composición)
│   │   ├── config/
│   │   │   └── dashboardConfig.ts # 🌟 Configuración dinámica por rol
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   ├── payments/                 # Feature: Pagos
│   │   ├── types/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── views/
│   │   └── index.ts
│   ├── orders/                   # Feature: Pedidos
│   ├── clients/                  # Feature: Clientes
│   ├── reports/                  # Feature: Reportes
│   ├── theme/                    # Feature: Tema (claro/oscuro)
│   └── ARCHITECTURE.md           # Este archivo
├── lib/
│   ├── utils.ts                  # Funciones auxiliares globales
│   └── mockService.ts            # Servicios mock compartidos
├── locales/                      # Internacionalización
│   ├── en/common.json
│   └── es/common.json
├── pages/                        # Páginas (orquestación solamente)
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Index.tsx
├── App.tsx                       # Configuración de la app
├── main.tsx                      # Punto de entrada
└── index.css                     # Estilos globales
```

---

## Separación de Responsabilidades

### `types/` - Modelos TypeScript

**Responsabilidad**: Definir estructuras de datos

```typescript
// src/features/payments/types/payment.ts
export interface Payment {
  id: string;
  amount: number;
  status: "paid" | "pending" | "rejected";
  createdAt: Date;
}

export type PaymentStatus = Payment["status"];
```

**Qué va aquí**:
- Interfaces
- Types
- Enums
- Constantes de tipos

**Qué NO va aquí**:
- Lógica
- Función con cuerpo
- Llamadas a APIs

---

### 🔌 `services/` - Acceso a Datos

**Responsabilidad**: Llamadas a APIs y lógica de datos

```typescript
// src/features/payments/services/paymentsService.ts
import type { Payment } from "../types/payment";

class PaymentsService {
  async getPayments(): Promise<Payment[]> {
    // Lógica de API call aquí
    const response = await fetch("/api/payments");
    return response.json();
  }

  async getPayment(id: string): Promise<Payment> {
    // ...
  }
}

export const paymentsService = new PaymentsService();
```

**Qué va aquí**:
- Llamadas a APIs
- Transformación de datos
- Lógica de persistencia
- Cachés locales

**Qué NO va aquí**:
- Componentes React
- Estados con `useState`
- Lógica de UI

---

### `hooks/` - Lógica de Negocio

**Responsabilidad**: Lógica reutilizable, estado, efectos

```typescript
// src/features/payments/hooks/usePayments.ts
import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "../services/paymentsService";

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentsService.getPayments(),
  });
};
```

**Qué va aquí**:
- Custom hooks
- `useQuery`, `useMutation`
- Lógica de estado
- Transformaciones de datos
- Efectos (`useEffect`)

**Qué NO va aquí**:
- Componentes React
- Estilos
- JSX

---

### `components/` - Componentes UI

**Responsabilidad**: UI pura, importan hooks y types

```typescript
// src/features/payments/components/PaymentsTable.tsx
import { usePayments } from "../hooks/usePayments";
import type { Payment } from "../types/payment";

export const PaymentsTable = () => {
  const { data, isLoading } = usePayments();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <table>
      <tbody>
        {data?.map((payment) => (
          <tr key={payment.id}>
            <td>{payment.id}</td>
            <td>${payment.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

**Qué va aquí**:
- Componentes React
- JSX
- Estilos Tailwind
- Imports de hooks
- Imports de types

**Qué NO va aquí**:
- Llamadas a APIs directas
- Lógica compleja de negocio
- Estados globales sin hook

---

### `views/` - Páginas (Composición)

**Responsabilidad**: Orquestación de componentes

```typescript
// src/features/payments/views/PaymentsView.tsx
import { usePermissions } from "@/features/auth";
import { PaymentsTable } from "../components/PaymentsTable";
import { PaymentsStats } from "../components/PaymentsStats";

export const PaymentsView = () => {
  const { tienePermiso } = usePermissions();

  if (!tienePermiso("ver_payments")) {
    return <div>Sin permisos para ver pagos</div>;
  }

  return (
    <div className="space-y-6">
      <h1>Pagos</h1>
      <PaymentsStats />
      <PaymentsTable />
    </div>
  );
};
```

**Qué va aquí**:
- Composición de componentes
- Verificación de permisos
- Layouts
- Rutas específicas

**Qué NO va aquí**:
- Componentes reutilizables
- Lógica de negocio compleja

---

### `index.ts` - API Pública del Feature

**Responsabilidad**: Exportar SOLO lo que necesitan otros features

```typescript
// src/features/payments/index.ts
export * from "./types/payment";
export { paymentsService } from "./services/paymentsService";
export { PaymentsTable } from "./components/PaymentsTable";
export { PaymentsStats } from "./components/PaymentsStats";
export { usePayments } from "./hooks/usePayments";
```

**Ventajas**:
- Punto único de entrada
- Control de qué está público
- Cambios internos no rompen código externo
- Fácil de documentar

---

## Sistema RBAC (Control de Acceso)

### Definición de Roles

```typescript
// src/features/auth/roles.ts
export type RolUsuario = "admin" | "client";

export const ROLES = {
  ADMIN: "admin" as const,
  CLIENT: "client" as const,
};
```

### Sistema de Permisos

```typescript
// src/features/auth/permissions.ts
export type Permiso =
  | "ver_dashboard_admin"
  | "ver_payments"
  | "ver_orders"
  | "ver_reports"
  | "ver_clients"
  | "gestionar_usuarios"
  | "exportar_datos";

export const PERMISOS_POR_ROL: Record<RolUsuario, Permiso[]> = {
  admin: [
    "ver_dashboard_admin",
    "ver_payments",
    "ver_orders",
    "ver_reports",
    "ver_clients",
    "gestionar_usuarios",
    "exportar_datos",
  ],
  client: [
    "ver_payments",
    "ver_orders",
    "ver_reports",
    "ver_clients",
    "exportar_datos",
  ],
};
```

### Verificar Permisos en Componentes

```typescript
// Dentro de cualquier componente
import { usePermissions } from "@/features/auth";

export const MiComponente = () => {
  const { tienePermiso, tienePermisos } = usePermissions();

  if (!tienePermiso("ver_reports")) {
    return <div>Sin acceso a reportes</div>;
  }

  return <ReportsView />;
};
```

---

## Rutas Centralizadas

### Definición de Rutas

```typescript
// src/config/routes.tsx
export const publicRoutes: RouteConfig[] = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
];

export const protectedRoutes: RouteConfig[] = [
  { path: "dashboard", element: <Dashboard />, requiresAuth: true },
  { path: "payments", element: <Payments />, requiresAuth: true, allowedRoles: [ROLES.CLIENT, ROLES.ADMIN] },
  { path: "orders", element: <Orders />, requiresAuth: true, allowedRoles: [ROLES.CLIENT, ROLES.ADMIN] },
  { path: "reports", element: <Reports />, requiresAuth: true, allowedRoles: [ROLES.CLIENT, ROLES.ADMIN] },
  { path: "clients", element: <Clients />, requiresAuth: true, allowedRoles: [ROLES.CLIENT, ROLES.ADMIN] },
  { path: "transactions", element: <Transactions />, requiresAuth: true, allowedRoles: [ROLES.ADMIN] },
];

export const appRoutes: RouteConfig[] = [
  ...publicRoutes,
  {
    path: "/",
    element: <DashboardLayout />,
    requiresAuth: true,
    children: protectedRoutes,
  },
];
```

### Protección por Roles

```typescript
// src/features/auth/ProtectedRoute.tsx
import type { RolUsuario } from "./roles";

interface RutaProtegidaProps {
  children: ReactNode;
  allowedRoles?: RolUsuario[];
}

export const RutaProtegida = ({ children, allowedRoles }: RutaProtegidaProps) => {
  const { estaAutenticado, user } = useAutenticacion();

  if (!estaAutenticado) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
```

### Renderizado En App

`src/App.tsx` recorre `appRoutes` y envuelve cada ruta protegida con `RutaProtegida` de forma dinámica. Eso deja la definición de acceso junto a la ruta y evita duplicar JSX del router en el entrypoint.

---

## Importaciones (Patrón Recomendado)

### CORRECTO - Importar desde index.ts

```typescript
// Limpio y escalable
import { 
  paymentsService, 
  PaymentsTable, 
  usePayments,
  type Payment 
} from "@/features/payments";

import { RutaProtegida, usePermissions } from "@/features/auth";
```

### INCORRECTO - Importar directamente

```typescript
// Específico y acoplado
import PaymentsService from "@/features/payments/services/paymentsService";
import PaymentsTable from "@/features/payments/components/PaymentsTable";
import usePayments from "@/features/payments/hooks/usePayments";
```

---

## Cómo Crear un Nuevo Feature

### Paso 1: Crear estructura de carpetas

```bash
mkdir -p src/features/myfeature/{types,services,hooks,components,views}
```

### Paso 2: Crear types

```typescript
// src/features/myfeature/types/myfeature.ts
export interface MyData {
  id: string;
  name: string;
}
```

### Paso 3: Crear service

```typescript
// src/features/myfeature/services/myfeatureService.ts
class MyFeatureService {
  async getAll() { /* ... */ }
}
export const myfeatureService = new MyFeatureService();
```

### Paso 4: Crear hook

```typescript
// src/features/myfeature/hooks/useMyFeature.ts
export const useMyFeature = () => { /* ... */ };
```

### Paso 5: Crear componentes

```typescript
// src/features/myfeature/components/MyFeatureTable.tsx
export const MyFeatureTable = () => { /* ... */ };
```

### Paso 6: Crear vista

```typescript
// src/features/myfeature/views/MyFeatureView.tsx
export const MyFeatureView = () => { /* ... */ };
```

### Paso 7: Crear index.ts

```typescript
// src/features/myfeature/index.ts
export * from "./types/myfeature";
export { myfeatureService } from "./services/myfeatureService";
export { MyFeatureTable } from "./components/MyFeatureTable";
export { useMyFeature } from "./hooks/useMyFeature";
```

### Paso 8: Usar en otros módulos

```typescript
import { MyFeatureTable } from "@/features/myfeature";
```

---

## Reglas Importantes

### 1️⃣ Separación de Responsabilidades

| Carpeta | Responsabilidad | Ejemplo |
|---------|-----------------|---------|
| `types/` | Modelos | `Interface Payment`, `Type Status` |
| `services/` | APIs y datos | `paymentsService.getPayments()` |
| `hooks/` | Lógica de negocio | `usePayments()`, `useFilter()` |
| `components/` | UI | `<PaymentsTable />` |
| `views/` | Composición | `<PaymentsView />` |

### 2️⃣ No Mezclar Responsabilidades

```typescript
// ❌ MAL - Todo en un componente
const PaymentsPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/api/payments").then(r => setData(r));
  }, []);
  
  const filtered = data.filter(d => d.status === "paid");
  
  return <table>{/* ... */}</table>;
};

// ✅ BIEN - Separado correctamente
const PaymentsPage = () => {
  const { data } = usePayments();
  return <PaymentsTable payments={data} />;
};
```

### 3️⃣ Dashboard Dinámico por Rol

```typescript
import { useDashboard } from "@/features/dashboard";

const Dashboard = () => {
  const config = useDashboard(); // Automático según user.role
  
  return (
    <>
      {config.widgets.map(widget => renderWidget(widget))}
    </>
  );
};
```

### 4️⃣ Verificar Permisos en Componentes

```typescript
import { usePermissions } from "@/features/auth";

export const ReportsSection = () => {
  const { tienePermiso } = usePermissions();
  
  if (!tienePermiso("ver_reports")) return null;
  
  return <ReportsView />;
};
```

---

## 📊 Resumen de Dependencias

```
types/
  ↓ (usan)
services/ ← hooks/ ← components/ ← views/
  ↓         ↓        ↓            ↓
types/    types/   hooks/       components/
          services/ types/       hooks/
```

**Regla de oro**: Las dependencias siempre van "hacia abajo", nunca hacia arriba.

---

## 🔧 Stack Técnico

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS + CSS Variables
- **i18n**: react-i18next
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

---

## 📖 Documentación Complementaria

- `REFACTORING_COMPLETE.md` - Visión general de la refactorización
- `GUIA_MIGRACION.md` - Guía para developers
- `EJEMPLOS_USO.tsx` - Código de ejemplo funcional

---

**Última actualización**: 3 de Mayo de 2026
**Estado**: Producción ✅
