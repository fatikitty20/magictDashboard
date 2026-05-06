import { fetchDashboardKpis } from "../api/dashboardApi";
import { mapDashboardKpis } from "../mappers/dashboardKpisMapper";
import type { DashboardKpis } from "../types/dashboardKpis";

export const getDashboardKpis = async (): Promise<DashboardKpis> => {
  const payload = await fetchDashboardKpis();
  return mapDashboardKpis(payload);
};
