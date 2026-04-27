import { Download, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";
import { ChannelBreakdown } from "../components/ChannelBreakdown";
import { ReportsChart } from "../components/ReportsChart";
import { ReportsStats } from "../components/ReportsStats";
import { TopProductsTable } from "../components/TopProductsTable";
import { reportsService } from "../services/reportsService";
import type { ReportDataset, ReportMetricKey, ReportRange } from "../types/report";

const Reports = () => {
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

  const selectedReport = useMemo(
    () => reports.find((report) => report.id === range) ?? reports[0] ?? null,
    [reports, range],
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
          <h1 className="mb-1 text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Analiza ventas, canales y productos con filtros dinamicos por periodo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadReports}
            className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
          >
            <RefreshCcw className="h-4 w-4" /> Actualizar
          </button>
          <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
            <Download className="h-4 w-4" /> Exportar
          </button>
        </div>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-foreground">Periodo del reporte</p>
          <p className="text-xs text-muted-foreground">Cambia el rango para recalcular la vista</p>
        </div>

        <select
          value={range}
          onChange={(event) => setRange(event.target.value as ReportRange)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
        >
          {reports.map((report) => (
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
          <ReportsStats summary={selectedReport.summary} />

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <ReportsChart daily={selectedReport.daily} metric={metric} onMetricChange={setMetric} />
            <ChannelBreakdown
              channels={selectedReport.channels}
              selectedChannel={selectedChannel}
              onSelectChannel={setSelectedChannel}
            />
          </section>

          <TopProductsTable products={filteredProducts} />
        </>
      )}
    </>
  );
};

export default Reports;
