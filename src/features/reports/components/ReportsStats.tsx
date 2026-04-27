import { BarChart3, Percent, ShoppingBag, TrendingUp } from "lucide-react";
import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";
import type { ReportSummary } from "../types/report";

type ReportsStatsProps = {
  summary: ReportSummary;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const ReportsStats = ({ summary }: ReportsStatsProps) => {
  const items = [
    {
      title: "Ingresos",
      value: currencyFormatter.format(summary.revenue),
      helper: `+${summary.growth}% vs periodo anterior`,
      icon: TrendingUp,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: "Ordenes",
      value: summary.orders.toLocaleString("es-AR"),
      helper: "Pedidos capturados",
      icon: ShoppingBag,
      toneClass: claseTonoSuave("info", "h-9 w-9"),
    },
    {
      title: "Ticket promedio",
      value: currencyFormatter.format(summary.averageTicket),
      helper: "Valor medio por orden",
      icon: BarChart3,
      toneClass: claseTonoSuave("muted", "h-9 w-9"),
    },
    {
      title: "Conversion",
      value: `${summary.conversionRate}%`,
      helper: `${summary.refunds} devoluciones registradas`,
      icon: Percent,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className={claseTarjeta("base", "p-5")}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <span className={item.toneClass}>
              <item.icon className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
        </article>
      ))}
    </section>
  );
};
