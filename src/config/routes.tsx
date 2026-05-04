/**
 * Configuración centralizada de rutas de la aplicación
 * Mantiene todas las rutas en un único lugar para fácil mantenimiento
 */

import type { ReactNode } from "react";
import { ROLES } from "../features/auth/roles";
import { RutaProtegida } from "../features/auth";
import { DashboardLayout } from "../shared/layouts/DashboardLayout";
import { Transactions } from "../features/transactions";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Payments from "../features/payments/views/Payments";
import Orders from "../features/orders/views/Orders";
import Reports from "../features/reports/views/Reports";
import Clients from "../features/clients/views/Clients";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  allowedRoles?: typeof ROLES[keyof typeof ROLES][];
}

/**
 * Rutas públicas (sin autenticación requerida)
 */
export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

/**
 * Rutas protegidas (requieren autenticación + roles)
 */
export const protectedRoutes: RouteConfig[] = [
  {
    path: "dashboard",
    element: (
      <RutaProtegida>
        <Dashboard />
      </RutaProtegida>
    ),
  },
  {
    path: "payments",
    element: (
      <RutaProtegida allowedRoles={[ROLES.CLIENT, ROLES.ADMIN]}>
        <Payments />
      </RutaProtegida>
    ),
  },
  {
    path: "orders",
    element: (
      <RutaProtegida allowedRoles={[ROLES.CLIENT, ROLES.ADMIN]}>
        <Orders />
      </RutaProtegida>
    ),
  },
  {
    path: "reports",
    element: (
      <RutaProtegida allowedRoles={[ROLES.CLIENT, ROLES.ADMIN]}>
        <Reports />
      </RutaProtegida>
    ),
  },
  {
    path: "clients",
    element: (
      <RutaProtegida allowedRoles={[ROLES.CLIENT, ROLES.ADMIN]}>
        <Clients />
      </RutaProtegida>
    ),
  },
  {
    path: "transactions",
    element: (
      <RutaProtegida allowedRoles={[ROLES.ADMIN]}>
        <Transactions />
      </RutaProtegida>
    ),
  },
];

/**
 * Rutas de error (fallback)
 */
export const errorRoutes: RouteConfig[] = [
  {
    path: "*",
    element: <NotFound />,
  },
];

/**
 * Configuración completa de rutas
 */
export const appRoutes: RouteConfig[] = [
  ...publicRoutes,
  {
    path: "/",
    element: (
      <RutaProtegida>
        <DashboardLayout />
      </RutaProtegida>
    ),
    children: protectedRoutes,
  },
  ...errorRoutes,
];