const quitarSlashFinal = (value: string): string => value.replace(/\/$/, "");

// En desarrollo usamos el proxy de Vite: /api/v1 -> backend/ngrok.
// En produccion se toma VITE_API_URL para no dejar URLs productivas hardcodeadas.
export const API_BASE_URL = import.meta.env.DEV
  ? "/api/v1"
  : quitarSlashFinal(import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "/api/v1");

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  dashboard: {
    kpis: "/dashboard/kpis",
    hourly: "/dashboard/hourly",
    pulse: "/dashboard/pulse",
  },
} as const;

export const DEFAULT_API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "ngrok-skip-browser-warning": "true",
} as const;
