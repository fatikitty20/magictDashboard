import { ShieldAlert, Sparkles, UserCheck, Wallet } from "lucide-react";
import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";

type ClientsStatsProps = {
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

export const ClientsStats = ({ totalClients, activeClients, riskClients, lifetimeValue }: ClientsStatsProps) => {
  const items = [
    {
      title: "Clientes totales",
      value: totalClients.toString(),
      helper: "Base comercial",
      icon: Sparkles,
      toneClass: claseTonoSuave("info", "h-9 w-9"),
    },
    {
      title: "Clientes activos",
      value: activeClients.toString(),
      helper: "Con compra reciente",
      icon: UserCheck,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: "Clientes en riesgo",
      value: riskClients.toString(),
      helper: "Requieren revision",
      icon: ShieldAlert,
      toneClass: claseTonoSuave("destructive", "h-9 w-9"),
    },
    {
      title: "Valor acumulado",
      value: currencyFormatter.format(lifetimeValue),
      helper: "Ingresos historicos",
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
