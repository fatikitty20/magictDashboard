/**
 * Configuracion dinamica del dashboard basada en roles.
 * Esta es la fuente unica de verdad para el menu y los widgets del panel.
 */

import type { RolUsuario } from "@/features/auth/roles";
import { ROLES } from "@/features/auth/roles";

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
  | "sidebar.menu.clients";

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

const widgetsDashboardAnterior: DashboardWidget[] = [
  "metrics",
  "analytics",
  "projects",
  "team",
  "progress",
  "reminder",
  "time",
];

const menuPrincipal: DashboardMenuItem[] = [
  { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
  { key: "orders", label: "sidebar.menu.orders", path: "/orders" },
  { key: "payments", label: "sidebar.menu.payments", path: "/payments", badge: "10" },
  { key: "reports", label: "sidebar.menu.reports", path: "/reports" },
  { key: "clients", label: "sidebar.menu.clients", path: "/clients" },
];

/**
 * El panel conserva los componentes originales del dashboard para ambos roles.
 * Si despues se agregan permisos distintos, solo se ajusta menuItems por rol.
 */
const dashboardPorRol: Record<RolUsuario, DashboardConfig> = {
  [ROLES.ADMIN]: {
    role: "admin",
    widgets: widgetsDashboardAnterior,
    menuItems: menuPrincipal,
  },
  [ROLES.CLIENT]: {
    role: "client",
    widgets: widgetsDashboardAnterior,
    menuItems: menuPrincipal,
  },
};

export const obtenerConfigDashboard = (role: RolUsuario): DashboardConfig => dashboardPorRol[role];
