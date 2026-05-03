/**
 * Exports públicos del feature de Payments
 * Esta es la interfaz para consumidores externos
 */

export * from "./types/payment";
export { paymentsService } from "./services/paymentsService";
export { PaymentsTable } from "./components/PaymentsTable";
export { PaymentsStats } from "./components/PaymentsStats";
export { StatusBadge } from "./components/StatusBadge";
