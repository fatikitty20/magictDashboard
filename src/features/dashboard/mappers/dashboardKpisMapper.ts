import type {
  DashboardKpis,
  DashboardKpisApiResponse,
} from "../types/dashboardKpis";

type KpisSource = {
  fecha?: string;
  totalIntentos?: number | string;
  ventasExitosas?: number | string;
  conversionRate?: number | string;
  gmvTotal?: number | string;
  ticketPromedio?: number | string;
  currency?: string;
};

const esRegistro = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value);

const extraerPrimerRegistro = (
  value: unknown,
): Record<string, unknown> | null => {
  if (Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];

    if (esRegistro(firstItem)) {
      return firstItem;
    }
  }

  if (esRegistro(value)) {
    return value;
  }

  return null;
};

const extraerData = (
  payload: DashboardKpisApiResponse,
): Record<string, unknown> => {
  if (Array.isArray(payload)) {
    const primerRegistro = extraerPrimerRegistro(payload);

    if (primerRegistro) {
      return primerRegistro;
    }
  }

  const payloadComoRegistro = payload as Record<string, unknown>;

  const posiblesContenedores = [
    payloadComoRegistro.data,
    payloadComoRegistro.kpis,
    payloadComoRegistro.result,
  ];

  for (const contenedor of posiblesContenedores) {
    const primerRegistro = extraerPrimerRegistro(contenedor);

    if (primerRegistro) {
      return primerRegistro;
    }
  }

  return payloadComoRegistro;
};

const obtenerNumero = (
  value: unknown,
): number | null => {

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(
      value.replace(/[$,\s]/g, ""),
    );

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
};

const extraerFecha = (
  data: Record<string, unknown>,
): string | null => {
  const fecha = data.fecha;

  return typeof fecha === "string" && fecha.trim()
    ? fecha.trim()
    : null;
};

const leerCampo = (
  data: Record<string, unknown>,
  key: string,
): unknown => data[key];

const normalizarFuente = (data: Record<string, unknown>): KpisSource => ({
  fecha: extraerFecha(data) ?? undefined,
  totalIntentos: leerCampo(data, "totalIntentos") as number | string | undefined,
  ventasExitosas: leerCampo(data, "ventasExitosas") as number | string | undefined,
  conversionRate: leerCampo(data, "conversionRate") as number | string | undefined,
  gmvTotal: leerCampo(data, "gmvTotal") as number | string | undefined,
  ticketPromedio: leerCampo(data, "ticketPromedio") as number | string | undefined,
  currency: (() => {
    const currencyValue = leerCampo(data, "currency");

    return typeof currencyValue === "string"
      ? currencyValue
      : undefined;
  })(),
});

export const mapDashboardKpis = (
  payload: DashboardKpisApiResponse,
): DashboardKpis => {
  const data = extraerData(payload);

  const fuente = normalizarFuente(data);

  return {
    fecha: fuente.fecha ?? null,
    totalIntentos: obtenerNumero(fuente.totalIntentos),
    ventasExitosas: obtenerNumero(fuente.ventasExitosas),
    conversionRate: obtenerNumero(fuente.conversionRate),
    gmvTotal: obtenerNumero(fuente.gmvTotal),
    ticketPromedio: obtenerNumero(fuente.ticketPromedio),
    currency: typeof fuente.currency === "string" && fuente.currency.trim()
      ? fuente.currency.trim().toUpperCase()
      : null,
  };
};