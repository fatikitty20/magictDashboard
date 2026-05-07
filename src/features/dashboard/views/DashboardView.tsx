import { useTranslation } from "react-i18next";
import { TarjetaMetrica, type Metrica } from "@/features/dashboard/components/MetricCard";
import { useDashboard } from "@/features/dashboard";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";
import type { DashboardWidget } from "@/features/dashboard/config/dashboardConfig";
import { formatUsdMinorUnits } from "../utils/currencyNormalization";

const formatearFechaDashboard = (fecha: string, locale: string): string => {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return fecha;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatearNumero = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

const formatearPorcentaje = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);

const PanelDashboard = () => {
  const { t, i18n } = useTranslation();
  const dashboardConfig = useDashboard();
  const locale = i18n.resolvedLanguage === "es" ? "es-MX" : "en-US";
  const { data, isLoading, isError, error } = useDashboardKpis(true);

  const sinDato = "-";
  const metricas: Metrica[] = [
    {
      id: "gmv-total",
      etiqueta: t("dashboard.roleContent.admin.metrics.kpis.gmv.title"),
      valor: data?.gmvTotal !== null && data?.gmvTotal !== undefined ? formatUsdMinorUnits(data.gmvTotal) : sinDato,
      ayuda: t("dashboard.roleContent.admin.metrics.kpis.gmv.helper"),
      variante: "invertida",
    },
    {
      id: "total-intentos",
      etiqueta: t("dashboard.roleContent.admin.metrics.kpis.totalIntentos.title"),
      valor: data?.totalIntentos !== null && data?.totalIntentos !== undefined ? formatearNumero(data.totalIntentos, locale) : sinDato,
      ayuda: t("dashboard.roleContent.admin.metrics.kpis.totalIntentos.helper"),
      variante: "suave",
    },
    {
      id: "ventas-exitosas",
      etiqueta: t("dashboard.roleContent.admin.metrics.kpis.ventasExitosas.title"),
      valor: data?.ventasExitosas !== null && data?.ventasExitosas !== undefined ? formatearNumero(data.ventasExitosas, locale) : sinDato,
      ayuda: t("dashboard.roleContent.admin.metrics.kpis.ventasExitosas.helper"),
      variante: "suave",
    },
    {
      id: "conversion-rate",
      etiqueta: t("dashboard.roleContent.admin.metrics.kpis.conversionRate.title"),
      valor: data?.conversionRate !== null && data?.conversionRate !== undefined ? `${formatearPorcentaje(data.conversionRate, locale)}%` : sinDato,
      ayuda: t("dashboard.roleContent.admin.metrics.kpis.conversionRate.helper"),
      variante: "suave",
    },
    {
      id: "ticket-promedio",
      etiqueta: t("dashboard.roleContent.admin.metrics.kpis.ticketPromedio.title"),
      valor: data?.ticketPromedio !== null && data?.ticketPromedio !== undefined ? formatUsdMinorUnits(data.ticketPromedio) : sinDato,
      ayuda: t("dashboard.roleContent.admin.metrics.kpis.ticketPromedio.helper"),
      variante: "suave",
    },
  ];

  const tieneWidget = (widget: DashboardWidget) => dashboardConfig.widgets.includes(widget);
  const mensajeError = error instanceof Error ? error.message : t("dashboard.kpis.error");
  const titulo = dashboardConfig.role === "admin" ? "dashboard.admin.title" : "dashboard.client.title";

  return (
    <div className="space-y-6">
      {tieneWidget("metrics") ? (
        <>
          <div>
            <h1 className="mb-1 text-3xl font-bold text-foreground">{t(titulo)}</h1>
            <p className="text-sm text-muted-foreground">
              {data?.fecha
                ? `${t("dashboard.kpis.dateLabel")}: ${formatearFechaDashboard(data.fecha, locale)}`
                : t("dashboard.kpis.dateUnavailable")}
            </p>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {metricas.map((metrica) => (
              <TarjetaMetrica key={metrica.id} {...metrica} />
            ))}
          </section>

          {isLoading ? <p className="text-xs text-muted-foreground">{t("dashboard.kpis.loading")}</p> : null}

          {isError ? (
            <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{mensajeError}</p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default PanelDashboard;
