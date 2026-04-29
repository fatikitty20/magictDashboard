export const usuarioDashboard = {
  nombre: "Marina Silva",
  email: "marina@tiendanube.com",
};

export type VarianteMetrica = "invertida" | "suave";
export type TonoSemantico = "info" | "success" | "destructive" | "muted";
export type TonoBarraAnalitica = "rayado" | "success" | "invertida" | "suave";

export interface Metrica {
  id: string;
  etiqueta: string;
  valor: string;
  ayuda: string;
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
  nombre: string;
  vencimiento: string;
  tono: TonoSemantico;
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  tarea: string;
  estado: string;
  tono: TonoSemantico;
}

export const metricasProyecto: Metrica[] = [
  { id: "sales", etiqueta: "Ventas totales", valor: "$248K", ayuda: "+18% vs mes anterior", variante: "invertida" },
  { id: "orders", etiqueta: "Pedidos completados", valor: "1,284", ayuda: "+12% vs mes anterior", variante: "suave" },
  { id: "active", etiqueta: "Pedidos en curso", valor: "86", ayuda: "Procesando ahora", variante: "suave" },
  { id: "pending", etiqueta: "Pagos pendientes", valor: "9", ayuda: "Requieren atencion", variante: "suave" },
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
  { id: "mercado-pago", nombre: "Integrar Mercado Pago", vencimiento: "29 Abr, 2026", tono: "info" },
  { id: "onboarding", nombre: "Onboarding nuevos vendedores", vencimiento: "2 May, 2026", tono: "success" },
  { id: "checkout", nombre: "Checkout mobile optimizado", vencimiento: "6 May, 2026", tono: "info" },
  { id: "hot-sale", nombre: "Campana Hot Sale", vencimiento: "10 May, 2026", tono: "muted" },
  { id: "antifraude", nombre: "Pruebas antifraude PSP", vencimiento: "14 May, 2026", tono: "destructive" },
];

export const miembrosEquipo: MiembroEquipo[] = [
  { id: "alexandra", nombre: "Alexandra Deff", tarea: "Configuracion pasarela de pagos", estado: "Completado", tono: "success" },
  { id: "edwin", nombre: "Edwin Adenike", tarea: "Integracion Mercado Pago Checkout Pro", estado: "En progreso", tono: "info" },
  { id: "isaac", nombre: "Isaac Oluwatemilorun", tarea: "Reglas antifraude y validacion 3DS", estado: "Pendiente", tono: "destructive" },
  { id: "david", nombre: "David Oshodi", tarea: "Diseno checkout mobile-first", estado: "En progreso", tono: "info" },
];

export const recordatorio = {
  titulo: "Revision con equipo de pagos",
  horario: "02:00 pm - 04:00 pm",
};

export const progresoPagos = 41;
export const tiempoSesion = "01:24:08";
