import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { claseTarjeta, claseTonoSuave } from "@/shared/ui/estilosDashboard";
import type { Client } from "../types/client";
import { ClientStatusBadge } from "./ClientStatusBadge";

type ClientDetailsPanelProps = {
  client: Client | null;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const ClientDetailsPanel = ({ client }: ClientDetailsPanelProps) => {
  const { t } = useTranslation();

  if (!client) {
    return (
      <section className={claseTarjeta("base", "p-6")}>
        <h2 className="mb-2 text-lg font-semibold text-foreground">{t("clients.details.empty.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("clients.details.empty.description")}</p>
      </section>
    );
  }

  const tierLabel: Record<Client["tier"], string> = {
    gold: t("clients.tiers.gold"),
    silver: t("clients.tiers.silver"),
    new: t("clients.tiers.new"),
  };

  return (
    <section className={claseTarjeta("base", "space-y-5 p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{client.id}</p>
          <h2 className="text-xl font-bold text-foreground">{client.name}</h2>
          <p className="text-sm text-muted-foreground">
            {t("clients.details.lastPurchase", { date: dateTimeFormatter.format(new Date(client.lastOrderAt)) })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ClientStatusBadge status={client.status} />
          <span className={claseTonoSuave("info", "rounded-full px-3 py-1 text-xs font-semibold")}>
            {t("clients.details.segment", { tier: tierLabel[client.tier] })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mail className="h-4 w-4" /> {t("clients.details.labels.email")}
          </div>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Phone className="h-4 w-4" /> {t("clients.details.labels.phone")}
          </div>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4" /> {t("clients.details.labels.city")}
          </div>
          <p className="text-sm text-muted-foreground">{client.city}</p>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">{t("clients.details.metrics.value")}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{currencyFormatter.format(client.totalSpent)}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">{t("clients.details.metrics.orders")}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{client.orders}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">{t("clients.details.metrics.averageTicket")}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{currencyFormatter.format(client.averageTicket)}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">{t("clients.details.metrics.growth")}</p>
          <p className={`mt-1 text-lg font-bold ${client.growth >= 0 ? "text-success" : "text-destructive"}`}>
            {client.growth >= 0 ? "+" : ""}
            {client.growth}%
          </p>
        </article>
      </div>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t("clients.details.tags.title")}</h3>
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">{t("clients.details.notes.title")}</h3>
        <p className="text-sm text-muted-foreground">{client.notes}</p>
      </article>
    </section>
  );
};
