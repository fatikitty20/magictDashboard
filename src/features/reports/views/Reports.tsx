import { Download, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/dashboard";
import { claseBotonPrimario } from "@/shared/ui/estilosDashboard";
import { ChannelBreakdown } from "../components/ChannelBreakdown";
import { ReportsChart } from "../components/ReportsChart";
import { ReportsStats } from "../components/ReportsStats";
import { TopProductsTable } from "../components/TopProductsTable";
import { reportsService } from "../services/reportsService";
import type { ReportDataset, ReportMetricKey, ReportRange } from "../types/report";

const CLIENT_REPORT_SCALE = 0.32;
const scaleAmount = (value: number) => Math.max(1, Math.round(value * CLIENT_REPORT_SCALE));

// Los reportes demo se escalan para mostrar el negocio del cliente sin cambiar el diseno.
const toClientReport = (report: ReportDataset): ReportDataset => {
  const revenue = scaleAmount(report.summary.revenue);
  const orders = scaleAmount(report.summary.orders);

  return {
    ...report,
    summary: {
      ...report.summary,
      revenue,
      orders,
      visitors: scaleAmount(report.summary.visitors),
      refunds: Math.round(report.summary.refunds * CLIENT_REPORT_SCALE),
      averageTicket: Math.round(revenue / Math.max(orders, 1)),
    },
    daily: report.daily.map((day) => ({
      ...day,
      revenue: scaleAmount(day.revenue),
      orders: scaleAmount(day.orders),
      visitors: scaleAmount(day.visitors),
      refunds: Math.round(day.refunds * CLIENT_REPORT_SCALE),
    })),
    channels: report.channels.map((channel) => ({
      ...channel,
      revenue: scaleAmount(channel.revenue),
      orders: scaleAmount(channel.orders),
    })),
    products: report.products.map((product) => ({
      ...product,
      unitsSold: scaleAmount(product.unitsSold),
      revenue: scaleAmount(product.revenue),
    })),
  };
};

const Reports = () => {
  const { t } = useTranslation();
  const { role } = useDashboard();
  const isAdmin = role === "admin";
  const [reports, setReports] = useState<ReportDataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<ReportRange>("30d");
  const [metric, setMetric] = useState<ReportMetricKey>("revenue");
  const [selectedChannel, setSelectedChannel] = useState("all");

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    const nextReports = await reportsService.getReports();
    setReports(nextReports);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  useEffect(() => {
    setSelectedChannel("all");
  }, [range]);

  const roleReports = useMemo(() => (isAdmin ? reports : reports.map(toClientReport)), [isAdmin, reports]);

  const selectedReport = useMemo(
    () => roleReports.find((report) => report.id === range) ?? roleReports[0] ?? null,
    [roleReports, range],
  );

  const filteredProducts = useMemo(() => {
    if (!selectedReport) {
      return [];
    }

    return selectedReport.products.filter((product) =>
      selectedChannel === "all" ? true : product.channel === selectedChannel,
    );
  }, [selectedReport, selectedChannel]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">
            {t(isAdmin ? "reports.roleContent.admin.title" : "reports.roleContent.client.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(isAdmin ? "reports.roleContent.admin.description" : "reports.roleContent.client.description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadReports}
            className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
          >
            <RefreshCcw className="h-4 w-4" /> {t("common.actions.refresh")}
          </button>
          <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
            <Download className="h-4 w-4" /> {t("reports.actions.export")}
          </button>
        </div>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-foreground">{t("reports.range.label")}</p>
          <p className="text-xs text-muted-foreground">{t("reports.range.helper")}</p>
        </div>

        <select
          value={range}
          onChange={(event) => setRange(event.target.value as ReportRange)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
        >
          {roleReports.map((report) => (
            <option key={report.id} value={report.id}>
              {report.label}
            </option>
          ))}
        </select>
      </section>

      {isLoading || !selectedReport ? (
        <section className="rounded-lg border border-border bg-card p-8">
          <div className="space-y-4">
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="h-11 animate-pulse rounded bg-muted" />
            <div className="h-11 animate-pulse rounded bg-muted" />
            <div className="h-11 animate-pulse rounded bg-muted" />
          </div>
        </section>
      ) : (
        <>
          <ReportsStats role={role} summary={selectedReport.summary} />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <ReportsChart role={role} daily={selectedReport.daily} metric={metric} onMetricChange={setMetric} />
            <ChannelBreakdown
              role={role}
              channels={selectedReport.channels}
              selectedChannel={selectedChannel}
              onSelectChannel={setSelectedChannel}
            />
          </section>

          <TopProductsTable role={role} products={filteredProducts} />
        </>
      )}
    </>
  );
};

export default Reports;
