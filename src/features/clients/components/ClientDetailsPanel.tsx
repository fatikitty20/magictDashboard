import { Mail, MapPin, Phone } from "lucide-react";
import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";
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

const tierLabel: Record<Client["tier"], string> = {
  gold: "Oro",
  silver: "Plata",
  new: "Nuevo",
};

export const ClientDetailsPanel = ({ client }: ClientDetailsPanelProps) => {
  if (!client) {
    return (
      <section className={claseTarjeta("base", "p-6")}>
        <h2 className="mb-2 text-lg font-semibold text-foreground">Detalle del cliente</h2>
        <p className="text-sm text-muted-foreground">Selecciona un cliente para ver su informacion completa.</p>
      </section>
    );
  }

  return (
    <section className={claseTarjeta("base", "space-y-5 p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{client.id}</p>
          <h2 className="text-xl font-bold text-foreground">{client.name}</h2>
          <p className="text-sm text-muted-foreground">Ultima compra: {dateTimeFormatter.format(new Date(client.lastOrderAt))}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ClientStatusBadge status={client.status} />
          <span className={claseTonoSuave("info", "rounded-full px-3 py-1 text-xs font-semibold")}>
            Segmento {tierLabel[client.tier]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mail className="h-4 w-4" /> Email
          </div>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Phone className="h-4 w-4" /> Telefono
          </div>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4" /> Ciudad
          </div>
          <p className="text-sm text-muted-foreground">{client.city}</p>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Valor acumulado</p>
          <p className="mt-1 text-lg font-bold text-foreground">{currencyFormatter.format(client.totalSpent)}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Ordenes</p>
          <p className="mt-1 text-lg font-bold text-foreground">{client.orders}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Ticket promedio</p>
          <p className="mt-1 text-lg font-bold text-foreground">{currencyFormatter.format(client.averageTicket)}</p>
        </article>
        <article className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground">Crecimiento</p>
          <p className={`mt-1 text-lg font-bold ${client.growth >= 0 ? "text-success" : "text-destructive"}`}>
            {client.growth >= 0 ? "+" : ""}
            {client.growth}%
          </p>
        </article>
      </div>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Etiquetas</h3>
        <div className="flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Notas comerciales</h3>
        <p className="text-sm text-muted-foreground">{client.notes}</p>
      </article>
    </section>
  );
};
