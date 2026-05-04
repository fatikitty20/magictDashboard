import { BarChart3, Percent, ShoppingBag, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RolUsuario } from "@/features/auth/roles";
import { claseTarjeta, claseTonoSuave } from "@/shared/ui/estilosDashboard";
import type { ReportSummary } from "../types/report";

type ReportsStatsProps = {
  role: RolUsuario;
  summary: ReportSummary;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const ReportsStats = ({ role, summary }: ReportsStatsProps) => {
  const { t } = useTranslation();
  const isAdmin = role === "admin";
  const items = [
    {
      title: t(isAdmin ? "reports.roleContent.admin.stats.revenue.title" : "reports.roleContent.client.stats.revenue.title"),
      value: currencyFormatter.format(summary.revenue),
      helper: t(isAdmin ? "reports.roleContent.admin.stats.revenue.helper" : "reports.roleContent.client.stats.revenue.helper", {
        growth: summary.growth,
      }),
      icon: TrendingUp,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: t(isAdmin ? "reports.roleContent.admin.stats.orders.title" : "reports.roleContent.client.stats.orders.title"),
      value: summary.orders.toLocaleString("es-AR"),
      helper: t(isAdmin ? "reports.roleContent.admin.stats.orders.helper" : "reports.roleContent.client.stats.orders.helper"),
      icon: ShoppingBag,
      toneClass: claseTonoSuave("info", "h-9 w-9"),
    },
    {
      title: t(
        isAdmin ? "reports.roleContent.admin.stats.averageTicket.title" : "reports.roleContent.client.stats.averageTicket.title",
      ),
      value: currencyFormatter.format(summary.averageTicket),
      helper: t(
        isAdmin ? "reports.roleContent.admin.stats.averageTicket.helper" : "reports.roleContent.client.stats.averageTicket.helper",
      ),
      icon: BarChart3,
      toneClass: claseTonoSuave("muted", "h-9 w-9"),
    },
    {
      title: t(isAdmin ? "reports.roleContent.admin.stats.conversion.title" : "reports.roleContent.client.stats.conversion.title"),
      value: `${summary.conversionRate}%`,
      helper: t(isAdmin ? "reports.roleContent.admin.stats.conversion.helper" : "reports.roleContent.client.stats.conversion.helper", {
        refunds: summary.refunds,
      }),
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
