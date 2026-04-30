import type { PaymentStatus } from "../types/payment";
import { useTranslation } from "react-i18next";
import { claseTonoSuave } from "@/features/dashboard/estilosDashboard";

type StatusBadgeProps = {
  status: PaymentStatus;
};

const statusToneMap: Record<PaymentStatus, "success" | "info" | "destructive"> = {
  paid: "success",
  pending: "info",
  rejected: "destructive",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();

  return (
    <span className={claseTonoSuave(statusToneMap[status], "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold")}>
      {t(`payments.status.${status}`)}
    </span>
  );
};
