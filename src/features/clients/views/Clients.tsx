import { Filter, RefreshCcw, Search, UserPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/dashboard";
import { claseBotonPrimario } from "@/shared/ui/estilosDashboard";
import { ClientDetailsPanel } from "../components/ClientDetailsPanel";
import { ClientsStats } from "../components/ClientsStats";
import { ClientsTable } from "../components/ClientsTable";
import { clientsService } from "../services/clientsService";
import type { Client, ClientStatus, ClientTier } from "../types/client";

type StatusFilter = "all" | ClientStatus;
type TierFilter = "all" | ClientTier;
// Simula el alcance del cliente: admin ve toda la base, cliente solo su cartera.
const CLIENT_VISIBLE_CLIENT_IDS = new Set(["CLI-001", "CLI-002", "CLI-004", "CLI-006"]);

const Clients = () => {
  const { t } = useTranslation();
  const { role } = useDashboard();
  const isAdmin = role === "admin";
  const [clients, setClients] = useState<Client[]>([]);
  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: t("clients.filters.all") },
    { value: "active", label: t("clients.filters.active") },
    { value: "inactive", label: t("clients.filters.inactive") },
    { value: "risk", label: t("clients.filters.risk") },
  ];

  const tierOptions: Array<{ value: TierFilter; label: string }> = [
    { value: "all", label: t("clients.filters.all") },
    { value: "gold", label: t("clients.filters.gold") },
    { value: "silver", label: t("clients.filters.silver") },
    { value: "new", label: t("clients.filters.new") },
  ];

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

  const roleClients = useMemo(
    () => (isAdmin ? clients : clients.filter((client) => CLIENT_VISIBLE_CLIENT_IDS.has(client.id))),
    [clients, isAdmin],
  );

  const filteredClients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return roleClients.filter((client) => {
      const matchesStatus = statusFilter === "all" ? true : client.status === statusFilter;
      const matchesTier = tierFilter === "all" ? true : client.tier === tierFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        client.name.toLowerCase().includes(normalizedSearch) ||
        client.email.toLowerCase().includes(normalizedSearch) ||
        client.city.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesTier && matchesSearch;
    });
  }, [roleClients, searchTerm, statusFilter, tierFilter]);

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
    const activeClients = roleClients.filter((client) => client.status === "active").length;
    const riskClients = roleClients.filter((client) => client.status === "risk").length;
    const lifetimeValue = roleClients.reduce((sum, client) => sum + client.totalSpent, 0);

    return {
      totalClients: roleClients.length,
      activeClients,
      riskClients,
      lifetimeValue,
    };
  }, [roleClients]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">
            {t(isAdmin ? "clients.roleContent.admin.title" : "clients.roleContent.client.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(isAdmin ? "clients.roleContent.admin.description" : "clients.roleContent.client.description")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadClients}
            className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
          >
            <RefreshCcw className="h-4 w-4" /> {t("common.actions.refresh")}
          </button>
          <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
            <UserPlus className="h-4 w-4" /> {t(isAdmin ? "clients.roleContent.admin.action" : "clients.roleContent.client.action")}
          </button>
        </div>
      </div>

      <ClientsStats
        role={role}
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
            placeholder={t("clients.search.placeholder")}
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
                {t("clients.filters.segmentPrefix", { segment: option.label })}
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
    </>
  );
};

export default Clients;
