import { Filter, RefreshCcw, Search, UserPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BarraLateral } from "@/features/dashboard/components/Sidebar";
import { BarraSuperior } from "@/features/dashboard/components/Topbar";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";
import { ClientDetailsPanel } from "../components/ClientDetailsPanel";
import { ClientsStats } from "../components/ClientsStats";
import { ClientsTable } from "../components/ClientsTable";
import { clientsService } from "../services/clientsService";
import type { Client, ClientStatus, ClientTier } from "../types/client";

type StatusFilter = "all" | ClientStatus;
type TierFilter = "all" | ClientTier;

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
  { value: "risk", label: "Riesgo" },
];

const tierOptions: Array<{ value: TierFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "gold", label: "Oro" },
  { value: "silver", label: "Plata" },
  { value: "new", label: "Nuevos" },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    setIsLoading(true);
    const nextClients = await clientsService.getClients();
    setClients(nextClients);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesStatus = statusFilter === "all" ? true : client.status === statusFilter;
      const matchesTier = tierFilter === "all" ? true : client.tier === tierFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        client.name.toLowerCase().includes(normalizedSearch) ||
        client.email.toLowerCase().includes(normalizedSearch) ||
        client.city.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesTier && matchesSearch;
    });
  }, [clients, searchTerm, statusFilter, tierFilter]);

  useEffect(() => {
    if (filteredClients.length === 0) {
      setSelectedClientId(null);
      return;
    }

    const hasSelectedClient = filteredClients.some((client) => client.id === selectedClientId);

    if (!hasSelectedClient) {
      setSelectedClientId(filteredClients[0].id);
    }
  }, [filteredClients, selectedClientId]);

  const selectedClient = useMemo(
    () => filteredClients.find((client) => client.id === selectedClientId) ?? null,
    [filteredClients, selectedClientId],
  );

  const stats = useMemo(() => {
    const activeClients = clients.filter((client) => client.status === "active").length;
    const riskClients = clients.filter((client) => client.status === "risk").length;
    const lifetimeValue = clients.reduce((sum, client) => sum + client.totalSpent, 0);

    return {
      totalClients: clients.length,
      activeClients,
      riskClients,
      lifetimeValue,
    };
  }, [clients]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <BarraLateral />

      <div className="flex min-w-0 flex-1 flex-col">
        <BarraSuperior />

        <main className="flex-1 space-y-6 p-4 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-foreground">Clientes</h1>
              <p className="text-sm text-muted-foreground">
                Explora segmentos, historial y oportunidades comerciales de cada cliente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={loadClients}
                className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
              >
                <RefreshCcw className="h-4 w-4" /> Actualizar
              </button>
              <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
                <UserPlus className="h-4 w-4" /> Nuevo cliente
              </button>
            </div>
          </div>

          <ClientsStats
            totalClients={stats.totalClients}
            activeClients={stats.activeClients}
            riskClients={stats.riskClients}
            lifetimeValue={stats.lifetimeValue}
          />

          <section className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 xl:grid-cols-[minmax(260px,1fr)_190px_190px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, email o ciudad"
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={tierFilter}
              onChange={(event) => setTierFilter(event.target.value as TierFilter)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
            >
              {tierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Segmento: {option.label}
                </option>
              ))}
            </select>
          </section>

          {isLoading ? (
            <section className="rounded-lg border border-border bg-card p-8">
              <div className="space-y-4">
                <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                <div className="h-11 animate-pulse rounded bg-muted" />
                <div className="h-11 animate-pulse rounded bg-muted" />
                <div className="h-11 animate-pulse rounded bg-muted" />
              </div>
            </section>
          ) : (
            <>
              <ClientsTable
                clients={filteredClients}
                selectedClientId={selectedClientId ?? undefined}
                onSelectClient={setSelectedClientId}
              />
              <ClientDetailsPanel client={selectedClient} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Clients;
