import type { DashboardConfig } from "../hooks/useDashboard";

export const dashboardAdmin: DashboardConfig = {
  role: "admin",
  widgets: ["adminMetrics"],
  menuItems: [
    { key: "dashboard", label: "sidebar.menu.dashboard", path: "/dashboard" },
  ],
};