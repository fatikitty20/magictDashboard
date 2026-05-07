import { ROLES, type RolUsuario } from "@/features/auth/roles";

export type DashboardWidget = "metrics";

export type DashboardMenuLabel =
  | "sidebar.menu.dashboard"
  | "sidebar.menu.orders"
  | "sidebar.menu.payments"
  | "sidebar.menu.reports"
  | "sidebar.menu.clients"
  | "sidebar.menu.transactions";

export interface DashboardMenuItem {
  key: string;
  label: DashboardMenuLabel;
  path: string;
  badge?: string;
  visibleInSidebar?: boolean;
}

export interface DashboardConfig {
  role: RolUsuario;
  widgets: DashboardWidget[];
  menuItems: DashboardMenuItem[];
}

const widgetsBase: DashboardWidget[] = ["metrics"];

const menuCliente: DashboardMenuItem[] = [
  { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
  { key: "orders", label: "sidebar.menu.orders", path: "/orders", visibleInSidebar: false },
  { key: "payments", label: "sidebar.menu.payments", path: "/payments", badge: "10", visibleInSidebar: false },
  { key: "reports", label: "sidebar.menu.reports", path: "/reports", visibleInSidebar: false },
  { key: "clients", label: "sidebar.menu.clients", path: "/clients", visibleInSidebar: false },
];

const menuAdmin: DashboardMenuItem[] = [
  { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
  { key: "transactions", label: "sidebar.menu.transactions", path: "/transactions", visibleInSidebar: false },
  { key: "payments", label: "sidebar.menu.payments", path: "/payments", visibleInSidebar: false },
  { key: "orders", label: "sidebar.menu.orders", path: "/orders", visibleInSidebar: false },
  { key: "clients", label: "sidebar.menu.clients", path: "/clients", visibleInSidebar: false },
  { key: "reports", label: "sidebar.menu.reports", path: "/reports", visibleInSidebar: false },
];

const dashboardPorRol: Record<RolUsuario, DashboardConfig> = {
  [ROLES.ADMIN]: { role: ROLES.ADMIN, widgets: widgetsBase, menuItems: menuAdmin },
  [ROLES.CLIENT]: { role: ROLES.CLIENT, widgets: widgetsBase, menuItems: menuCliente },
};

export const obtenerConfigDashboard = (role: RolUsuario): DashboardConfig => dashboardPorRol[role];
