import { withMockDelay } from "@/lib/mockService";
import { reportsData } from "../data/reportsData";
import type { ReportDataset } from "../types/report";

const NETWORK_DELAY_MS = 820;

export const reportsService = {
  async getReports(): Promise<ReportDataset[]> {
    return withMockDelay(() => reportsData.map((report) => ({ ...report })), NETWORK_DELAY_MS);
  },
};
