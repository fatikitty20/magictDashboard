import { useQuery } from "@tanstack/react-query";
import { getDashboardKpis } from "../domain/dashboardDomain";

export const useDashboardKpis = (enabled: boolean) =>
  useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: getDashboardKpis,
    enabled,
    retry: 1,
  });
