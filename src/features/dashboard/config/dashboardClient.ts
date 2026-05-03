import type { DashboardConfig } from "../hooks/useDashboard";

export const dashboardClient: DashboardConfig = {
  role: "client",
  widgets: ["clientMetrics", "clientPayments", "clientOrders"],
  menuItems: [
    { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
    { key: "orders", label: "sidebar.menu.orders", path: "/orders" },
    { key: "payments", label: "sidebar.menu.payments", path: "/payments", badge: "10" },
    { key: "reports", label: "sidebar.menu.reports", path: "/reports" },
    { key: "clients", label: "sidebar.menu.clients", path: "/clients" },
  ],
};