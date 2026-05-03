import { CalendarDays, ChevronLeft, ChevronRight, Filter, RefreshCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/dashboard";
import { claseBotonPrimario } from "../../dashboard/estilosDashboard";
import { PaymentsStats } from "../components/PaymentsStats";
import { PaymentsTable } from "../components/PaymentsTable";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { usePayments } from "../hooks/usePayments";
import type { PaymentSortBy, PaymentStatus, SortOrder } from "../types/payment";

const PAGE_SIZE = 20;
const DEFAULT_SORT_BY: PaymentSortBy = "createdAt";
const DEFAULT_SORT_ORDER: SortOrder = "desc";
type StatusFilter = "all" | PaymentStatus;

const Payments = () => {
  const { t } = useTranslation();
  const { role } = useDashboard();
  const isAdmin = role === "admin";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState<PaymentSortBy>(DEFAULT_SORT_BY);
  const [order, setOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);

  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isLoading, error, refetch } = usePayments({
    page,
    limit: PAGE_SIZE,
    params: {
      search: debouncedSearch,
      status: statusFilter === "all" ? undefined : statusFilter,
      from: fromDate || undefined,
      to: toDate || undefined,
      sortBy,
      order,
    },
  });

  const payments = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const stats = data?.stats ?? null;

  const displayStats = useMemo(
    () =>
      stats ?? {
        totalRevenue: 0,
        paidCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      },
    [stats],
  );

  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: t("payments.filters.all") },
    { value: "paid", label: t("payments.status.paid") },
    { value: "pending", label: t("payments.status.pending") },
    { value: "rejected", label: t("payments.status.rejected") },
  ];

  const handleSortChange = (nextSortBy: PaymentSortBy) => {
    if (sortBy === nextSortBy) {
      setOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setOrder("asc");
  };

  const handleRefresh = () => {
    refetch();
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setSortBy(DEFAULT_SORT_BY);
    setOrder(DEFAULT_SORT_ORDER);
    setPage(1);
  };

  const locale = typeof navigator !== "undefined" ? navigator.language ?? "es-MX" : "es-MX";

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">
            {t(isAdmin ? "payments.roleContent.admin.title" : "payments.roleContent.client.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(isAdmin ? "payments.roleContent.admin.description" : "payments.roleContent.client.description")}
          </p>
        </div>

        <button onClick={handleRefresh} className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> {t("common.actions.refresh")}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {(error as Error)?.message ?? t("payments.errors.load")}
        </div>
      ) : null}

      <PaymentsStats
        role={role}
        totalRevenue={displayStats.totalRevenue}
        paidCount={displayStats.paidCount}
        pendingCount={displayStats.pendingCount}
        rejectedCount={displayStats.rejectedCount}
        currency={payments[0]?.currency}
        locale={locale}
      />

      <section className="grid gap-4 rounded-lg border border-border bg-card p-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(11rem,0.7fr)_repeat(2,minmax(0,1fr))_auto]">
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Search className="h-4 w-4" /> {t("common.actions.search")}
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder={t("payments.search.placeholder")}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
          />
          <span className="text-xs text-muted-foreground">{t("payments.search.helper")}</span>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" /> {t("payments.filters.status")}
          </span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {t("common.actions.from")}
          </span>
          <input
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            type="date"
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> {t("common.actions.to")}
          </span>
          <input
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            type="date"
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring/30"
          />
        </label>

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            {t("common.actions.clear")}
          </button>
        </div>
      </section>

      <PaymentsTable
        payments={payments}
        isLoading={isLoading}
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        locale={locale}
      />

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        <div>{t("payments.pagination.page", { page, totalPages })}</div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
            disabled={isLoading || page <= 1}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> {t("common.actions.previous")}
          </button>

          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
            disabled={isLoading || page >= totalPages}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("common.actions.next")} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );
};

export default Payments;