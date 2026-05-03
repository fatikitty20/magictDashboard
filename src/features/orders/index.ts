/**
 * Exports públicos del feature de Orders
 * Esta es la interfaz para consumidores externos
 */

export * from "./types/order";
export { ordersService } from "./services/ordersService";
export { ordersData } from "./data/ordersData";
export { OrdersTable } from "./components/OrdersTable";
export { OrdersStats } from "./components/OrdersStats";
export { OrderStatusBadge } from "./components/OrderStatusBadge";
