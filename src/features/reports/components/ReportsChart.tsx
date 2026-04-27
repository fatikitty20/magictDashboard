import { BarChart3 } from "lucide-react";
import { claseTarjeta } from "@/features/dashboard/estilosDashboard";
import type { DailyReportMetric, ReportMetricKey } from "../types/report";

type ReportsChartProps = {
  daily: DailyReportMetric[];
  metric: ReportMetricKey;
  onMetricChange: (metric: ReportMetricKey) => void;
};

const metricOptions: Array<{ value: ReportMetricKey; label: string }> = [
  { value: "revenue", label: "Ingresos" },
  { value: "orders", label: "Ordenes" },
  { value: "visitors", label: "Visitas" },
];

const metricLabel: Record<ReportMetricKey, string> = {
  revenue: "Ingresos por periodo",
  orders: "Ordenes por periodo",
  visitors: "Visitas por periodo",
};

const metricFormatter: Record<ReportMetricKey, (value: number) => string> = {
  revenue: (value) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(value),
  orders: (value) => value.toLocaleString("es-AR"),
  visitors: (value) => value.toLocaleString("es-AR"),
};

export const ReportsChart = ({ daily, metric, onMetricChange }: ReportsChartProps) => {
  const maxValue = Math.max(...daily.map((item) => item[metric]), 1);

  return (
    <section className={claseTarjeta("base", "p-5")}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
            <BarChart3 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Rendimiento</h2>
            <p className="text-xs text-muted-foreground">{metricLabel[metric]}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {metricOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onMetricChange(option.value)}
              className={`h-9 rounded-lg px-3 text-xs font-medium transition ${
                metric === option.value
                  ? "bg-dashboard-inverted text-dashboard-inverted-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-72 items-end gap-3">
        {daily.map((item) => {
          const value = item[metric];
          const height = `${Math.max(8, (value / maxValue) * 100)}%`;

          return (
            <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div className="flex min-h-8 items-end justify-center text-[11px] font-medium text-muted-foreground">
                {metricFormatter[metric](value)}
              </div>
              <div className="flex h-52 items-end rounded-lg bg-muted/50 px-2 py-2">
                <div
                  className="w-full rounded-md bg-success transition-all duration-500"
                  style={{ height }}
                  aria-label={`${item.label}: ${metricFormatter[metric](value)}`}
                />
              </div>
              <p className="text-center text-xs font-medium text-muted-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
