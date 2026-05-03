import { ShieldAlert, Sparkles, UserCheck, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RolUsuario } from "@/features/auth/roles";
import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";

type ClientsStatsProps = {
  role: RolUsuario;
  totalClients: number;
  activeClients: number;
  riskClients: number;
  lifetimeValue: number;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const ClientsStats = ({ role, totalClients, activeClients, riskClients, lifetimeValue }: ClientsStatsProps) => {
  const { t } = useTranslation();
  const isAdmin = role === "admin";
  const items = [
    {
      title: t(isAdmin ? "clients.roleContent.admin.stats.total.title" : "clients.roleContent.client.stats.total.title"),
      value: totalClients.toString(),
      helper: t(isAdmin ? "clients.roleContent.admin.stats.total.helper" : "clients.roleContent.client.stats.total.helper"),
      icon: Sparkles,
      toneClass: claseTonoSuave("info", "h-9 w-9"),
    },
    {
      title: t(isAdmin ? "clients.roleContent.admin.stats.active.title" : "clients.roleContent.client.stats.active.title"),
      value: activeClients.toString(),
      helper: t(isAdmin ? "clients.roleContent.admin.stats.active.helper" : "clients.roleContent.client.stats.active.helper"),
      icon: UserCheck,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: t(isAdmin ? "clients.roleContent.admin.stats.risk.title" : "clients.roleContent.client.stats.risk.title"),
      value: riskClients.toString(),
      helper: t(isAdmin ? "clients.roleContent.admin.stats.risk.helper" : "clients.roleContent.client.stats.risk.helper"),
      icon: ShieldAlert,
      toneClass: claseTonoSuave("destructive", "h-9 w-9"),
    },
    {
      title: t(isAdmin ? "clients.roleContent.admin.stats.value.title" : "clients.roleContent.client.stats.value.title"),
      value: currencyFormatter.format(lifetimeValue),
      helper: t(isAdmin ? "clients.roleContent.admin.stats.value.helper" : "clients.roleContent.client.stats.value.helper"),
      icon: Wallet,
      toneClass: claseTonoSuave("muted", "h-9 w-9"),
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className={claseTarjeta("base", "p-5")}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <span className={item.toneClass}>
              <item.icon className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
        </article>
      ))}
    </section>
  );
};
