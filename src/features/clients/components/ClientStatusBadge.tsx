import { StatusPill } from "@/components/ui/StatusPill";
import type { TonoSemantico } from "@/features/dashboard/data";
import type { ClientStatus } from "../types/client";

type ClientStatusBadgeProps = {
  status: ClientStatus;
};

const statusConfig: Record<ClientStatus, { label: string; tone: TonoSemantico }> = {
  active: {
    label: "Activo",
    tone: "success",
  },
  inactive: {
    label: "Inactivo",
    tone: "muted",
  },
  risk: {
    label: "Riesgo",
    tone: "destructive",
  },
};

export const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <StatusPill tone={config.tone} className="px-3">
      {config.label}
    </StatusPill>
  );
};
