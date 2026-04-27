import { claseTonoSuave } from "@/features/dashboard/estilosDashboard";
import type { OrderStatus } from "../types/order";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusLabelMap: Record<OrderStatus, string> = {
  completed: "Completado",
  pending: "Pendiente",
  cancelled: "Cancelado",
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  if (status === "pending") {
    return (
      <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300">
        {statusLabelMap[status]}
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className={claseTonoSuave("destructive", "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold")}>{statusLabelMap[status]}</span>
    );
  }

  return (
    <span className={claseTonoSuave("success", "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold")}>{statusLabelMap[status]}</span>
  );
};
