import { Plus, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GraficoAnaliticas } from "@/features/dashboard/components/AnalyticsChart";
import { ColaboracionEquipo } from "@/features/dashboard/components/TeamCollaboration";
import { ControlTiempo } from "@/features/dashboard/components/TimeTracker";
import { ListaProyectos } from "@/features/dashboard/components/ProjectsList";
import { ProgresoPagos } from "@/features/dashboard/components/ProjectProgress";
import { TarjetaMetrica } from "@/features/dashboard/components/MetricCard";
import { TarjetaRecordatorio } from "@/features/dashboard/components/ReminderCard";
import { useDashboard } from "@/features/dashboard";
import { metricasProyecto } from "@/features/dashboard/data";
import { claseBotonPrimario } from "@/features/dashboard/estilosDashboard";
import { OrdersStats, OrdersTable, ordersData, ordersService, type Order } from "@/features/orders";
import { PaymentsStats, PaymentsTable, paymentsService, type Payment, type PaymentListResponse, type PaymentSortBy, type SortOrder } from "@/features/payments";

const PAYMENT_PAGE_SIZE = 5;
const DEFAULT_PAYMENT_SORT_BY: PaymentSortBy = "createdAt";
const DEFAULT_PAYMENT_SORT_ORDER: SortOrder = "desc";

const buildOrdersStats = (orders: Order[]) => ({
  totalOrders: orders.length,
  completedCount: orders.filter((order) => order.status === "completed").length,
  pendingCount: orders.filter((order) => order.status === "pending").length,
  cancelledCount: orders.filter((order) => order.status === "cancelled").length,
});

const PanelDashboard = () => {
  const { t } = useTranslation();
  const dashboardConfig = useDashboard();
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(ordersData[0]?.id ?? "");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsStats, setPaymentsStats] = useState<PaymentListResponse["stats"] | null>(null);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentSortBy, setPaymentSortBy] = useState<PaymentSortBy>(DEFAULT_PAYMENT_SORT_BY);
  const [paymentSortOrder, setPaymentSortOrder] = useState<SortOrder>(DEFAULT_PAYMENT_SORT_ORDER);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      const nextOrders = await ordersService.getOrders();

      if (!active) {
        return;
      }

      setOrders(nextOrders);
      setSelectedOrderId((currentOrderId) => currentOrderId || nextOrders[0]?.id || "");
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadPayments = async () => {
      setPaymentsLoading(true);

      try {
        const response = await paymentsService.getPayments({
          page: 1,
          limit: PAYMENT_PAGE_SIZE,
          sortBy: paymentSortBy,
          order: paymentSortOrder,
        });

        if (!active) {
          return;
        }

        setPayments(response.data);
        setPaymentsStats(response.stats ?? null);
      } finally {
        if (active) {
          setPaymentsLoading(false);
        }
      }
    };

    void loadPayments();

    return () => {
      active = false;
    };
  }, [paymentSortBy, paymentSortOrder]);

  const orderStats = useMemo(() => buildOrdersStats(orders), [orders]);
  const paymentDisplayStats = useMemo(
    () =>
      paymentsStats ?? {
        totalRevenue: 0,
        paidCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      },
    [paymentsStats],
  );

  const handlePaymentSortChange = (nextSortBy: PaymentSortBy) => {
    if (paymentSortBy === nextSortBy) {
      setPaymentSortOrder((currentOrder) => (currentOrder === "asc" ? "desc" : "asc"));
      return;
    }

    setPaymentSortBy(nextSortBy);
    setPaymentSortOrder("asc");
  };

  const renderWidget = (widget: (typeof dashboardConfig.widgets)[number]) => {
    switch (widget) {
      case "adminMetrics":
        return (
          <section className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-1 text-3xl font-bold text-foreground">{t("dashboard.admin.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("dashboard.admin.description")}</p>
              </div>
            </div>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricasProyecto.map((metrica) => (
                <TarjetaMetrica key={metrica.id} {...metrica} />
              ))}
            </section>
          </section>
        );
      case "adminOverview":
        return (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PaymentsStats
              totalRevenue={paymentDisplayStats.totalRevenue}
              paidCount={paymentDisplayStats.paidCount}
              pendingCount={paymentDisplayStats.pendingCount}
              rejectedCount={paymentDisplayStats.rejectedCount}
              currency={payments[0]?.currency}
            />
          </section>
        );
      case "clientMetrics":
        return (
          <section className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-1 text-3xl font-bold text-foreground">{t("dashboard.client.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("dashboard.client.description")}</p>
              </div>
            </div>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metricasProyecto.slice(1, 4).map((metrica) => (
                <TarjetaMetrica key={metrica.id} {...metrica} />
              ))}
            </section>
          </section>
        );
      case "clientOrders":
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{t("sidebar.menu.orders")}</h2>
            <OrdersStats {...orderStats} />
            <OrdersTable orders={orders} selectedOrderId={selectedOrderId || undefined} onSelectOrder={setSelectedOrderId} />
          </section>
        );
      case "clientPayments":
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{t("sidebar.menu.payments")}</h2>
            <PaymentsStats
              totalRevenue={paymentDisplayStats.totalRevenue}
              paidCount={paymentDisplayStats.paidCount}
              pendingCount={paymentDisplayStats.pendingCount}
              rejectedCount={paymentDisplayStats.rejectedCount}
              currency={payments[0]?.currency}
            />
            <PaymentsTable
              payments={payments}
              isLoading={paymentsLoading}
              sortBy={paymentSortBy}
              order={paymentSortOrder}
              onSortChange={handlePaymentSortChange}
            />
          </section>
        );
      case "metrics":
        return (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-1 text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("dashboard.description")}</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className={claseBotonPrimario("h-10 gap-2 px-5 text-sm")}>
                  <Plus className="h-4 w-4" /> {t("dashboard.actions.newCharge")}
                </button>
                <button
                  type="button"
                  className="flex h-10 items-center gap-2 rounded-full border border-foreground px-5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
                >
                  <Upload className="h-4 w-4" /> {t("dashboard.actions.export")}
                </button>
              </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricasProyecto.map((metrica) => (
                <TarjetaMetrica key={metrica.id} {...metrica} />
              ))}
            </section>
          </>
        );
      case "analytics":
        return (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <GraficoAnaliticas />
          </section>
        );
      case "orders":
        return (
          <section className="space-y-4">
            <OrdersStats {...orderStats} />
            <OrdersTable orders={orders.slice(0, 5)} selectedOrderId={selectedOrderId || undefined} onSelectOrder={setSelectedOrderId} />
          </section>
        );
      case "payments":
        return (
          <section className="space-y-4">
            <PaymentsStats
              totalRevenue={paymentDisplayStats.totalRevenue}
              paidCount={paymentDisplayStats.paidCount}
              pendingCount={paymentDisplayStats.pendingCount}
              rejectedCount={paymentDisplayStats.rejectedCount}
              currency={payments[0]?.currency}
            />
            <PaymentsTable
              payments={payments}
              isLoading={paymentsLoading}
              sortBy={paymentSortBy}
              order={paymentSortOrder}
              onSortChange={handlePaymentSortChange}
            />
          </section>
        );
      case "projects":
        return <ListaProyectos />;
      case "team":
        return <ColaboracionEquipo />;
      case "progress":
        return <ProgresoPagos />;
      case "reminder":
        return <TarjetaRecordatorio />;
      case "time":
        return <ControlTiempo />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {dashboardConfig.widgets.map((widget) => (
        <section key={widget} className="rounded-lg border border-border bg-card p-6">
          {renderWidget(widget)}
        </section>
      ))}
    </div>
  );
};

export default PanelDashboard;
