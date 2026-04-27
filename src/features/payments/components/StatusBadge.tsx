import type { PaymentStatus } from "../types/payment";
import { claseTonoSuave } from "@/features/dashboard/estilosDashboard";

type StatusBadgeProps = {
  status: PaymentStatus;
};

const statusLabelMap: Record<PaymentStatus, string> = {
  paid: "Pagado",
  pending: "Pendiente",
  rejected: "Rechazado",
};

const statusToneMap: Record<PaymentStatus, "success" | "info" | "destructive"> = {
  paid: "success",
  pending: "info",
  rejected: "destructive",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={claseTonoSuave(statusToneMap[status], "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold")}>{statusLabelMap[status]}</span>
);
