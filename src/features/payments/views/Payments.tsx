import { Filter, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BarraLateral } from "@/features/dashboard/components/Sidebar";
import { BarraSuperior } from "@/features/dashboard/components/Topbar";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";
import { PaymentsStats } from "../components/PaymentsStats";
import { PaymentsTable } from "../components/PaymentsTable";
import { paymentsService } from "../services/paymentsService";
import type { Payment, PaymentStatus } from "../types/payment";

type StatusFilter = "all" | PaymentStatus;

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "paid", label: "Pagado" },
  { value: "pending", label: "Pendiente" },
  { value: "rejected", label: "Rechazado" },
];

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    let active = true;

    const loadPayments = async () => {
      setIsLoading(true);
      const nextPayments = await paymentsService.getPayments();

      if (!active) {
        return;
      }

      setPayments(nextPayments);
      setIsLoading(false);
    };

    loadPayments();

    return () => {
      active = false;
    };
  }, []);

  const filteredPayments = useMemo(
    () => payments.filter((payment) => (statusFilter === "all" ? true : payment.status === statusFilter)),
    [payments, statusFilter],
  );

  const stats = useMemo(() => {
    const paidCount = payments.filter((payment) => payment.status === "paid").length;
    const pendingCount = payments.filter((payment) => payment.status === "pending").length;
    const rejectedCount = payments.filter((payment) => payment.status === "rejected").length;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.total, 0);

    return { paidCount, pendingCount, rejectedCount, totalRevenue };
  }, [payments]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <BarraLateral />

      <div className="flex min-w-0 flex-1 flex-col">
        <BarraSuperior />

        <main className="flex-1 space-y-6 p-4 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="mb-1 text-3xl font-bold text-foreground">Pagos</h1>
              <p className="text-sm text-muted-foreground">
                Monitorea transacciones, conciliacion y estados de cobro de tu tienda.
              </p>
            </div>

            <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
              <RefreshCcw className="h-4 w-4" /> Actualizar
            </button>
          </div>

          <PaymentsStats
            totalRevenue={stats.totalRevenue}
            paidCount={stats.paidCount}
            pendingCount={stats.pendingCount}
            rejectedCount={stats.rejectedCount}
          />

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filtrar por estado</span>
            </div>

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
            <PaymentsTable payments={filteredPayments} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Payments;
