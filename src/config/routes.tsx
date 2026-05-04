/**
 * Configuración centralizada de rutas de la aplicación
 * Mantiene todas las rutas en un único lugar para fácil mantenimiento
 */

import type { ReactNode } from "react";
import { ROLES, type RolUsuario } from "../features/auth/roles";
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
  requiresAuth?: boolean;
  allowedRoles?: RolUsuario[];
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
    element: <Dashboard />,
    requiresAuth: true,
  },
  {
    path: "payments",
    element: <Payments />,
    requiresAuth: true,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "orders",
    element: <Orders />,
    requiresAuth: true,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "reports",
    element: <Reports />,
    requiresAuth: true,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "clients",
    element: <Clients />,
    requiresAuth: true,
    allowedRoles: [ROLES.CLIENT, ROLES.ADMIN],
  },
  {
    path: "transactions",
    element: <Transactions />,
    requiresAuth: true,
    allowedRoles: [ROLES.ADMIN],
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
    element: <DashboardLayout />,
    requiresAuth: true,
    children: protectedRoutes,
  },
  ...errorRoutes,
];
