/**
 * Configuración centralizada de rutas de la aplicación
 * Mantiene todas las rutas en un único lugar para fácil mantenimiento
 */

import type { ReactNode } from "react";
import { ROLES } from "@/features/auth/roles";
import { RutaProtegida } from "@/features/auth";
import { DashboardLayout } from "@/features/dashboard";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Payments from "@/features/payments/views/Payments";
import Orders from "@/features/orders/views/Orders";
import Reports from "@/features/reports/views/Reports";
import Clients from "@/features/clients/views/Clients";

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
 * Rutas protegidas (requieren autenticación)
 * El wrapper RutaProtegida se aplica a todo este árbol
 */
export const protectedRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/payments",
    element: <Payments />,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "/orders",
    element: <Orders />,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "/reports",
    element: <Reports />,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "/clients",
    element: <Clients />,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
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
export const appRoutes = [
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
