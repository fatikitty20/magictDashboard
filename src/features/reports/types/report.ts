export type ReportRange = "7d" | "30d" | "90d";

export type ReportMetricKey = "revenue" | "orders" | "visitors";

export interface ReportSummary {
  revenue: number;
  orders: number;
  visitors: number;
  refunds: number;
  averageTicket: number;
  conversionRate: number;
  growth: number;
}

export interface DailyReportMetric {
  label: string;
  revenue: number;
  orders: number;
  visitors: number;
  refunds: number;
}

export interface ChannelReport {
  channel: string;
  revenue: number;
  orders: number;
  conversionRate: number;
  share: number;
}

export interface ProductReport {
  sku: string;
  name: string;
  channel: string;
  unitsSold: number;
  revenue: number;
  refundRate: number;
}

export interface ReportDataset {
  id: ReportRange;
  label: string;
  summary: ReportSummary;
  daily: DailyReportMetric[];
  channels: ChannelReport[];
  products: ProductReport[];
}
