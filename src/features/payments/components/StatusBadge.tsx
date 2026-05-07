import { StatusPill } from "@/components/ui/StatusPill";
import type { PaymentStatus } from "../types/payment";
import { useTranslation } from "react-i18next";
import type { TonoSemantico } from "@/shared/ui/estilosDashboard";

type StatusBadgeProps = {
  status: PaymentStatus;
};

const statusToneMap: Record<PaymentStatus, TonoSemantico> = {
  paid: "success",
  pending: "info",
  rejected: "destructive",
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();

  return (
    <StatusPill tone={statusToneMap[status]}>{t(`payments.status.${status}`)}</StatusPill>
  );
};
