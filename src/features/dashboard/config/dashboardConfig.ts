/**
 * Configuración dinámica del dashboard basada en roles
 * Esta es la fuente única de verdad para qué ve cada rol en el dashboard
 */

import type { RolUsuario } from "@/features/auth/roles";
import { ROLES } from "@/features/auth/roles";

export type DashboardWidget =
  | "adminMetrics"
  | "clientMetrics"
  | "clientOrders"
  | "clientPayments"
  | "payments"
  | "orders"
  | "reports";

export interface DashboardMenuItem {
  key: string;
  label: string;
  path: string;
  badge?: string;
}

export interface DashboardConfig {
  role: RolUsuario;
  widgets: DashboardWidget[];
  menuItems: DashboardMenuItem[];
}

/**
 * Definición de qué widgets ve cada rol
 */
const dashboardPorRol: Record<RolUsuario, DashboardConfig> = {
  [ROLES.ADMIN]: {
    role: "admin",
    widgets: ["adminMetrics"],
    menuItems: [
      { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
    ],
  },
  [ROLES.CLIENT]: {
    role: "client",
    widgets: ["clientMetrics", "clientOrders", "clientPayments"],
    menuItems: [
      { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
      { key: "orders", label: "sidebar.menu.orders", path: "/orders" },
      { key: "payments", label: "sidebar.menu.payments", path: "/payments", badge: "10" },
      { key: "reports", label: "sidebar.menu.reports", path: "/reports" },
      { key: "clients", label: "sidebar.menu.clients", path: "/clients" },
    ],
  },
};

export const obtenerConfigDashboard = (role: RolUsuario): DashboardConfig => {
  return dashboardPorRol[role];
};
