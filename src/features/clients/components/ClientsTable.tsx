import { claseTarjeta } from "@/features/dashboard/estilosDashboard";
import type { Client } from "../types/client";
import { ClientStatusBadge } from "./ClientStatusBadge";

type ClientsTableProps = {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (clientId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const tierLabel: Record<Client["tier"], string> = {
  gold: "Oro",
  silver: "Plata",
  new: "Nuevo",
};

export const ClientsTable = ({ clients, selectedClientId, onSelectClient }: ClientsTableProps) => (
  <section className={claseTarjeta("base", "overflow-hidden")}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Cliente</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Segmento</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Estado</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Canal</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Ordenes</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Valor</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Ultima compra</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className={`cursor-pointer transition hover:bg-muted/30 ${
                selectedClientId === client.id ? "bg-muted/40" : ""
              }`}
            >
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{client.name}</p>
                <p className="text-xs text-muted-foreground">{client.email}</p>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{tierLabel[client.tier]}</td>
              <td className="px-4 py-3">
                <ClientStatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{client.preferredChannel}</td>
              <td className="px-4 py-3 text-right text-muted-foreground">{client.orders}</td>
              <td className="px-4 py-3 text-right font-semibold text-foreground">
                {currencyFormatter.format(client.totalSpent)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{dateFormatter.format(new Date(client.lastOrderAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {clients.length === 0 ? (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        No hay clientes para los filtros seleccionados.
      </div>
    ) : null}
  </section>
);
