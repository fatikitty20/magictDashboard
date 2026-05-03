import { useMemo } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { dashboardAdmin } from "../config/dashboardAdmin";
import { dashboardClient } from "../config/dashboardClient";

export type DashboardRole = "admin" | "client";
export type DashboardWidgetKey = "metrics" | "analytics" | "orders" | "payments" | "projects" | "team" | "progress" | "reminder" | "time" | "adminMetrics" | "adminOverview" | "clientMetrics" | "clientOrders" | "clientPayments";

export type DashboardMenuItem = {
  key: string;
  label: string;
  path: string;
  badge?: string;
};

export type DashboardConfig = {
  role: DashboardRole;
  widgets: DashboardWidgetKey[];
  menuItems: DashboardMenuItem[];
};

const dashboardConfigByRole: Record<DashboardRole, DashboardConfig> = {
  admin: dashboardAdmin,
  client: dashboardClient,
};

export const useDashboard = () => {
  const { user } = useAuth();

  return useMemo(() => {
    const role = user?.role === "admin" ? "admin" : "client";

    return dashboardConfigByRole[role];
  }, [user]);
};