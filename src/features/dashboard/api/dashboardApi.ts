import { apiClient } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/apiConfig";
import type { DashboardKpisApiResponse } from "../types/dashboardKpis";

export const fetchDashboardKpis = async (): Promise<DashboardKpisApiResponse> =>
  apiClient<DashboardKpisApiResponse>(API_ENDPOINTS.dashboard.kpis);
