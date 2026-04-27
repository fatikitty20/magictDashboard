import { claseTonoSuave } from "@/features/dashboard/estilosDashboard";
import type { ClientStatus } from "../types/client";

type ClientStatusBadgeProps = {
  status: ClientStatus;
};

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
  active: {
    label: "Activo",
    className: claseTonoSuave("success", "rounded-full px-3 py-1 text-xs font-semibold"),
  },
  inactive: {
    label: "Inactivo",
    className: claseTonoSuave("muted", "rounded-full px-3 py-1 text-xs font-semibold"),
  },
  risk: {
    label: "Riesgo",
    className: claseTonoSuave("destructive", "rounded-full px-3 py-1 text-xs font-semibold"),
  },
};

export const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  const config = statusConfig[status];

  return <span className={config.className}>{config.label}</span>;
};
