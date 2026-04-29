import { CalendarDays, RefreshCcw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";
import { PaymentsStats } from "../components/PaymentsStats";
import { PaymentsTable } from "../components/PaymentsTable";
import { paymentsService } from "../services/paymentsService";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { Payment, PaymentListResponse, PaymentSortBy, SortOrder } from "../types/payment";

const PAGE_SIZE = 10;
const DEFAULT_SORT_BY: PaymentSortBy = "createdAt";
const DEFAULT_SORT_ORDER: SortOrder = "desc";

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState<PaymentSortBy>(DEFAULT_SORT_BY);
  const [order, setOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 350);
  const requestIdRef = useRef(0);
  const didMountRef = useRef(false);

  const loadPayments = useCallback(
    async (nextPage: number) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);

      try {
        const response: PaymentListResponse = await paymentsService.getPayments({
          page: nextPage,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          from: fromDate || undefined,
          to: toDate || undefined,
          sortBy,
          order,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setPayments(response.data);
        setTotalPages(response.totalPages);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setPayments([]);
        setTotalPages(1);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [debouncedSearch, fromDate, order, sortBy, toDate],
  );

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    void loadPayments(1);
  }, [debouncedSearch, fromDate, order, sortBy, toDate, loadPayments]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    void loadPayments(page);
  }, [loadPayments, page]);

  const stats = useMemo(() => {
    const paidCount = payments.filter((payment) => payment.status === "paid").length;
    const pendingCount = payments.filter((payment) => payment.status === "pending").length;
    const rejectedCount = payments.filter((payment) => payment.status === "rejected").length;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.total, 0);

    return { paidCount, pendingCount, rejectedCount, totalRevenue };
  }, [payments]);

  const handleSortChange = (nextSortBy: PaymentSortBy) => {
    if (sortBy === nextSortBy) {
      setOrder((currentOrder) => (currentOrder === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(nextSortBy);
    setOrder("asc");
  };

  const handleRefresh = () => {
    void loadPayments(page);
  };

  const resetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setSortBy(DEFAULT_SORT_BY);
    setOrder(DEFAULT_SORT_ORDER);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">Pagos</h1>
          <p className="text-sm text-muted-foreground">
            Monitorea transacciones, conciliacion y estados de cobro de tu tienda.
          </p>
        </div>

        <button type="button" onClick={handleRefresh} className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </div>

      <PaymentsStats
        totalRevenue={stats.totalRevenue}
        paidCount={stats.paidCount}
        pendingCount={stats.pendingCount}
        rejectedCount={stats.rejectedCount}
      />

      <section className="grid gap-4 rounded-lg border border-border bg-card p-4 lg:grid-cols-[minmax(0,1.7fr)_repeat(2,minmax(0,1fr))_auto]">
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Search className="h-4 w-4" /> Buscar
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="search"
            placeholder="order_id o customer_email"
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
          />
          <span className="text-xs text-muted-foreground">Filtra por ID de orden o correo del cliente.</span>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" /> Desde
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
            <CalendarDays className="h-4 w-4" /> Hasta
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
            Limpiar
          </button>
        </div>
      </section>

      <PaymentsTable payments={payments} isLoading={isLoading} sortBy={sortBy} order={order} onSortChange={handleSortChange} />

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
        <div>
          Página {page} de {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
            disabled={isLoading || page <= 1}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
            disabled={isLoading || page >= totalPages}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );
};

export default Payments;
