/**
 * Configuracion dinamica del dashboard basada en roles.
 * Fuente unica de verdad para menu y widgets.
 */

import { ROLES, type RolUsuario } from "@/features/auth/roles";

export type DashboardWidget =
  | "metrics"
  | "analytics"
  | "projects"
  | "team"
  | "progress"
  | "reminder"
  | "time";

export type DashboardMenuLabel =
  | "sidebar.menu.dashboard"
  | "sidebar.menu.orders"
  | "sidebar.menu.payments"
  | "sidebar.menu.reports"
  | "sidebar.menu.clients"
  | "sidebar.menu.transactions"; // 🔥 NUEVO

export interface DashboardMenuItem {
  key: string;
  label: DashboardMenuLabel;
  path: string;
  badge?: string;
}

export interface DashboardConfig {
  role: RolUsuario;
  widgets: DashboardWidget[];
  menuItems: DashboardMenuItem[];
}

/**
 * Widgets base (pueden evolucionar por rol después)
 */
const widgetsBase: DashboardWidget[] = [
  "metrics",
  "analytics",
  "projects",
  "team",
  "progress",
  "reminder",
  "time",
];

/**
 * 🔵 CLIENT → vista "My Business"
 */
const menuCliente: DashboardMenuItem[] = [
  { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
  { key: "orders", label: "sidebar.menu.orders", path: "/orders" },
  { key: "payments", label: "sidebar.menu.payments", path: "/payments", badge: "10" },
  { key: "reports", label: "sidebar.menu.reports", path: "/reports" },
  { key: "clients", label: "sidebar.menu.clients", path: "/clients" },
];

/**
 * 🔴 ADMIN → vista "Platform"
 */
const menuAdmin: DashboardMenuItem[] = [
  { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },

  // 🔥 CORE PSP
  { key: "transactions", label: "sidebar.menu.transactions", path: "/transactions" },

  { key: "payments", label: "sidebar.menu.payments", path: "/payments" },
  { key: "orders", label: "sidebar.menu.orders", path: "/orders" },
  { key: "clients", label: "sidebar.menu.clients", path: "/clients" },
  { key: "reports", label: "sidebar.menu.reports", path: "/reports" },
];

/**
 * Configuracion por rol
 */
const dashboardPorRol: Record<RolUsuario, DashboardConfig> = {
  [ROLES.ADMIN]: {
    role: ROLES.ADMIN,
    widgets: widgetsBase,
    menuItems: menuAdmin,
  },
  [ROLES.CLIENT]: {
    role: ROLES.CLIENT,
    widgets: widgetsBase,
    menuItems: menuCliente,
  },
};

export const obtenerConfigDashboard = (role: RolUsuario): DashboardConfig =>
  dashboardPorRol[role];
