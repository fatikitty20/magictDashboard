import { ArrowUpRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Metrica } from "../data";
import { claseTarjeta } from "@/shared/ui/estilosDashboard";

export const TarjetaMetrica = ({ etiquetaKey, valor, ayudaKey, variante }: Metrica) => {
  const { t } = useTranslation();
  const esInvertida = variante === "invertida";
  const etiqueta = t(etiquetaKey);
  const ayuda = t(ayudaKey);

  return (
    <div className={claseTarjeta(variante, "relative p-5 h-full")}>
      <div className="mb-6 flex items-center justify-between">
        <p className={`text-xs sm:text-sm font-medium ${esInvertida ? "text-dashboard-inverted-foreground" : "text-foreground"}`}>
          {etiqueta}
        </p>
        <button
          type="button"
          aria-label={t("dashboard.metrics.viewMetric", { label: etiqueta })}
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
            esInvertida ? "bg-success text-success-foreground" : "bg-foreground text-background"
          }`}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p
        className={`mb-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
          esInvertida ? "text-dashboard-inverted-foreground" : "text-foreground"
        }`}
      >
        {valor}
      </p>
      <div
        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[11px] ${
          esInvertida ? "bg-dashboard-inverted-foreground/10 text-dashboard-inverted-foreground/80" : "bg-secondary text-muted-foreground"
        }`}
      >
        <TrendingUp className="h-3 w-3" />
        {ayuda}
      </div>
    </div>
  );
};
