import { Filter, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/dashboard";
import { claseBotonPrimario } from "@/shared/ui/estilosDashboard";
import { OrderDetailsPanel } from "../components/OrderDetailsPanel";
import { OrdersStats } from "../components/OrdersStats";
import { OrdersTable } from "../components/OrdersTable";
import { ordersService } from "../services/ordersService";
import type { Order, OrderStatus } from "../types/order";

type StatusFilter = "all" | OrderStatus;
// Simula el alcance del cliente: admin ve todo, cliente solo sus pedidos.
const CLIENT_VISIBLE_ORDER_IDS = new Set(["ORD-101", "ORD-102", "ORD-104", "ORD-106"]);

const Orders = () => {
  const { t } = useTranslation();
  const { role } = useDashboard();
  const isAdmin = role === "admin";
  const [orders, setOrders] = useState<Order[]>([]);
  const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: "all", label: t("orders.filters.all") },
    { value: "completed", label: t("orders.filters.completed") },
    { value: "pending", label: t("orders.filters.pending") },
    { value: "cancelled", label: t("orders.filters.cancelled") },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      setIsLoading(true);
      const nextOrders = await ordersService.getOrders();

      if (!active) {
        return;
      }

      setOrders(nextOrders);
      setIsLoading(false);
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const roleOrders = useMemo(
    () => (isAdmin ? orders : orders.filter((order) => CLIENT_VISIBLE_ORDER_IDS.has(order.id))),
    [isAdmin, orders],
  );

  const filteredOrders = useMemo(
    () => roleOrders.filter((order) => (statusFilter === "all" ? true : order.status === statusFilter)),
    [roleOrders, statusFilter],
  );

  useEffect(() => {
    if (filteredOrders.length === 0) {
      setSelectedOrderId(null);
      return;
    }

    const hasSelectedOrder = filteredOrders.some((order) => order.id === selectedOrderId);

    if (!hasSelectedOrder) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order.id === selectedOrderId) ?? null,
    [filteredOrders, selectedOrderId],
  );

  const stats = useMemo(() => {
    const completedCount = roleOrders.filter((order) => order.status === "completed").length;
    const pendingCount = roleOrders.filter((order) => order.status === "pending").length;
    const cancelledCount = roleOrders.filter((order) => order.status === "cancelled").length;

    return {
      totalOrders: roleOrders.length,
      completedCount,
      pendingCount,
      cancelledCount,
    };
  }, [roleOrders]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-foreground">
            {t(isAdmin ? "orders.roleContent.admin.title" : "orders.roleContent.client.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(isAdmin ? "orders.roleContent.admin.description" : "orders.roleContent.client.description")}
          </p>
        </div>

        <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
          <RefreshCcw className="h-4 w-4" /> {t("common.actions.refresh")}
        </button>
      </div>

      <OrdersStats
        role={role}
        totalOrders={stats.totalOrders}
        completedCount={stats.completedCount}
        pendingCount={stats.pendingCount}
        cancelledCount={stats.cancelledCount}
      />

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{t("orders.filters.label")}</span>
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
        <>
          <OrdersTable
            orders={filteredOrders}
            selectedOrderId={selectedOrderId ?? undefined}
            onSelectOrder={setSelectedOrderId}
          />
          <OrderDetailsPanel order={selectedOrder} role={role} />
        </>
      )}
    </>
  );
};

export default Orders;
