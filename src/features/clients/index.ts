/**
 * Exports públicos del feature de Clients
 * Esta es la interfaz para consumidores externos
 */

export * from "./types/client";
export { clientsService } from "./services/clientsService";
export { ClientsTable } from "./components/ClientsTable";
export { ClientsStats } from "./components/ClientsStats";
export { ClientStatusBadge } from "./components/ClientStatusBadge";
