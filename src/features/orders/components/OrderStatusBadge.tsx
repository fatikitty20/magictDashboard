import { StatusPill } from "@/components/ui/StatusPill";
import type { OrderStatus } from "../types/order";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusLabelMap: Record<OrderStatus, string> = {
  completed: "Completado",
  pending: "Pendiente",
  cancelled: "Cancelado",
};

const statusToneMap: Record<OrderStatus, "success" | "warning" | "destructive"> = {
  completed: "success",
  pending: "warning",
  cancelled: "destructive",
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return <StatusPill tone={statusToneMap[status]}>{statusLabelMap[status]}</StatusPill>;
};
