export const usuarioDashboard = {
  nombre: "Marina Silva",
  email: "marina@magictronic.com",
};

export type VarianteMetrica = "invertida" | "suave";
export type TonoSemantico = "info" | "success" | "destructive" | "muted";
export type TonoBarraAnalitica = "rayado" | "success" | "invertida" | "suave";

export interface Metrica {
  id: string;
  etiquetaKey: string;
  valor: string;
  ayudaKey: string;
  variante: VarianteMetrica;
}

export interface BarraAnalitica {
  dia: string;
  valor: number;
  tono: TonoBarraAnalitica;
  activa: boolean;
}

export interface Proyecto {
  id: string;
  nombreKey: string;
  vencimiento: string;
  tono: TonoSemantico;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  tareaKey: string;
  estadoKey: string;
  tono: TonoSemantico;
}

export const metricasProyecto: Metrica[] = [
  { id: "sales", etiquetaKey: "dashboard.metrics.sales.title", valor: "$248K", ayudaKey: "dashboard.metrics.sales.helper", variante: "invertida" },
  { id: "orders", etiquetaKey: "dashboard.metrics.orders.title", valor: "1,284", ayudaKey: "dashboard.metrics.orders.helper", variante: "suave" },
  { id: "active", etiquetaKey: "dashboard.metrics.active.title", valor: "86", ayudaKey: "dashboard.metrics.active.helper", variante: "suave" },
  { id: "pending", etiquetaKey: "dashboard.metrics.pending.title", valor: "9", ayudaKey: "dashboard.metrics.pending.helper", variante: "suave" },
];

export const barrasAnaliticas: BarraAnalitica[] = [
  { dia: "L", valor: 56, tono: "rayado", activa: false },
  { dia: "M", valor: 74, tono: "success", activa: false },
  { dia: "X", valor: 88, tono: "success", activa: true },
  { dia: "J", valor: 82, tono: "invertida", activa: false },
  { dia: "V", valor: 68, tono: "rayado", activa: false },
  { dia: "S", valor: 52, tono: "rayado", activa: false },
  { dia: "D", valor: 66, tono: "rayado", activa: false },
];

export const proyectos: Proyecto[] = [
  { id: "mercado-pago", nombreKey: "dashboard.projects.mercadoPago", vencimiento: "2026-04-29", tono: "info" },
  { id: "onboarding", nombreKey: "dashboard.projects.onboarding", vencimiento: "2026-05-02", tono: "success" },
  { id: "checkout", nombreKey: "dashboard.projects.checkout", vencimiento: "2026-05-06", tono: "info" },
  { id: "hot-sale", nombreKey: "dashboard.projects.hotSale", vencimiento: "2026-05-10", tono: "muted" },
  { id: "antifraude", nombreKey: "dashboard.projects.antifraude", vencimiento: "2026-05-14", tono: "destructive" },
];

export const miembrosEquipo: MiembroEquipo[] = [
  { id: "alexandra", nombre: "Alexandra Deff", tareaKey: "dashboard.team.tasks.paymentGateway", estadoKey: "dashboard.team.status.completed", tono: "success" },
  { id: "edwin", nombre: "Edwin Adenike", tareaKey: "dashboard.team.tasks.checkoutPro", estadoKey: "dashboard.team.status.inProgress", tono: "info" },
  { id: "isaac", nombre: "Isaac Oluwatemilorun", tareaKey: "dashboard.team.tasks.antifraud", estadoKey: "dashboard.team.status.pending", tono: "destructive" },
  { id: "david", nombre: "David Oshodi", tareaKey: "dashboard.team.tasks.mobileCheckout", estadoKey: "dashboard.team.status.inProgress", tono: "info" },
];

export const recordatorio = {
  tituloKey: "dashboard.reminder.title",
  horario: "14:00 - 16:00",
};

export const progresoPagos = 41;
export const tiempoSesion = "01:24:08";
