import { useTranslation } from "react-i18next";
import currency from "currency.js";

import { TarjetaMetrica } from "@/features/dashboard/components/MetricCard";

import { useDashboard } from "@/features/dashboard";
import { useDashboardKpis } from "@/features/dashboard/hooks/useDashboardKpis";

import {
  obtenerDatosDashboard,
  type LlaveTraduccion,
  type Metrica,
} from "@/features/dashboard/data";

import type { DashboardWidget } from "@/features/dashboard/config/dashboardConfig";

const formatearFechaDashboard = (
  fecha: string,
  locale: string,
): string => {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return fecha;
  }

  const incluyeHora = fecha.includes("T") || fecha.includes(":");

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...(incluyeHora
      ? {
          hour: "2-digit" as const,
          minute: "2-digit" as const,
        }
      : {}),
    timeZone: "UTC",
  }).format(date);
};

const formatearMoneda = (
  amount: number,
  currencyCode: string,
): string => {
  const monedaNormalizada = currencyCode.toUpperCase();
  const montoNormalizado = currency(amount).divide(100).value;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: monedaNormalizada,
      maximumFractionDigits: 2,
    }).format(montoNormalizado);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(montoNormalizado);
  }
};

const formatearNumero = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

const formatearPorcentaje = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

const PanelDashboard = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === "es" ? "es-MX" : "en-US";

  const dashboardConfig = useDashboard();

  const datosDashboard = obtenerDatosDashboard(
    dashboardConfig.role
  );

  const esAdmin = dashboardConfig.role === "admin";

  const titleKey: LlaveTraduccion = esAdmin
    ? "dashboard.admin.title"
    : "dashboard.client.title";

  const {
    data: kpisDashboard,
    isLoading: cargandoKpis,
    isError: errorKpis,
    error: errorDashboard,
  } = useDashboardKpis(esAdmin);

  // ======================================================
  // MÉTRICAS DASHBOARD
  // ======================================================

  const metricasDashboard =
    esAdmin
      ? []
      : datosDashboard.metricas;

  const metricasBackend: Metrica[] = esAdmin && kpisDashboard
    ? [
        {
          id: "gmv-total",
          etiquetaKey: "dashboard.roleContent.admin.metrics.kpis.gmv.title",
          valor:
            kpisDashboard.gmvTotal !== null && kpisDashboard.currency
              ? formatearMoneda(kpisDashboard.gmvTotal, kpisDashboard.currency)
              : "—",
          ayudaKey: "dashboard.roleContent.admin.metrics.kpis.gmv.helper",
          variante: "invertida",
        },
        {
          id: "total-intentos",
          etiquetaKey: "dashboard.roleContent.admin.metrics.kpis.totalIntentos.title",
          valor:
            kpisDashboard.totalIntentos !== null
              ? formatearNumero(kpisDashboard.totalIntentos, locale)
              : "—",
          ayudaKey: "dashboard.roleContent.admin.metrics.kpis.totalIntentos.helper",
          variante: "suave",
        },
        {
          id: "ventas-exitosas",
          etiquetaKey: "dashboard.roleContent.admin.metrics.kpis.ventasExitosas.title",
          valor:
            kpisDashboard.ventasExitosas !== null
              ? formatearNumero(kpisDashboard.ventasExitosas, locale)
              : "—",
          ayudaKey: "dashboard.roleContent.admin.metrics.kpis.ventasExitosas.helper",
          variante: "suave",
        },
        {
          id: "conversion-rate",
          etiquetaKey: "dashboard.roleContent.admin.metrics.kpis.conversionRate.title",
          valor:
            kpisDashboard.conversionRate !== null
              ? `${formatearPorcentaje(kpisDashboard.conversionRate, locale)}%`
              : "—",
          ayudaKey: "dashboard.roleContent.admin.metrics.kpis.conversionRate.helper",
          variante: "suave",
        },
        {
          id: "ticket-promedio",
          etiquetaKey: "dashboard.roleContent.admin.metrics.kpis.ticketPromedio.title",
          valor:
            kpisDashboard.ticketPromedio !== null && kpisDashboard.currency
              ? formatearMoneda(kpisDashboard.ticketPromedio, kpisDashboard.currency)
              : "—",
          ayudaKey: "dashboard.roleContent.admin.metrics.kpis.ticketPromedio.helper",
          variante: "suave",
        },
      ]
    : [];

  const metricasFinales =
    esAdmin
      ? metricasBackend
      : metricasDashboard;

  const tieneWidget = (widget: DashboardWidget) =>
    dashboardConfig.widgets.includes(widget);

  const mensajeErrorKpis =
    errorDashboard instanceof Error
      ? errorDashboard.message
      : t("dashboard.kpis.error");

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER + MÉTRICAS
      ====================================================== */}

      {tieneWidget("metrics") && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">

            {/* TITULOS */}
            <div>

              {/* Título dashboard */}
              <h1 className="mb-1 text-3xl font-bold text-foreground">
                {t(titleKey)}
              </h1>

              {/* Fecha backend */}
              <p className="text-sm text-muted-foreground">
                {kpisDashboard?.fecha
                  ? `${t("dashboard.kpis.dateLabel")}: ${formatearFechaDashboard(kpisDashboard.fecha, locale)}`
                  : t("dashboard.kpis.dateUnavailable")}
              </p>

            </div>
          </div>

          {/* ======================================================
              GRID MÉTRICAS KPI
          ====================================================== */}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            {/* Tarjetas métricas */}
            {metricasFinales.map((metrica) => (
              <TarjetaMetrica
                key={metrica.id}
                {...metrica}
              />
            ))}

            {/* Skeleton loading */}
            {esAdmin &&
            cargandoKpis &&
            metricasFinales.length === 0
              ? Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={`kpi-loading-${index}`}
                    className="h-40 animate-pulse rounded-lg border border-border bg-dashboard-soft"
                  />
                ))
              : null}
          </section>

          {/* Loading KPIs */}
          {cargandoKpis ? (
            <p className="text-xs text-muted-foreground">
              {t("dashboard.kpis.loading")}
            </p>
          ) : null}

          {/* Error backend */}
          {errorKpis ? (
            <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">
                {mensajeErrorKpis}
              </p>
            </div>
          ) : null}

        </>
      )}

    </div>
  );
};

export default PanelDashboard;