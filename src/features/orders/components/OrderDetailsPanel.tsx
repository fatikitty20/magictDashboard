import type { TonoSemantico } from "@/features/dashboard/data";
import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";
import { useTranslation } from "react-i18next";
import type { Order } from "../types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrderDetailsPanelProps = {
  order: Order | null;
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

const riskToneClass: Record<Order["risk"]["level"], TonoSemantico> = {
  low: "success",
  medium: "info",
  high: "destructive",
};

export const OrderDetailsPanel = ({ order }: OrderDetailsPanelProps) => {
  const { t } = useTranslation();

  if (!order) {
    return (
      <section className={claseTarjeta("base", "p-6")}>
        <h2 className="mb-2 text-lg font-semibold text-foreground">{t("orders.details.empty.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("orders.details.empty.description")}</p>
      </section>
    );
  }

  const riskLabel: Record<Order["risk"]["level"], string> = {
    low: t("orders.risk.low"),
    medium: t("orders.risk.medium"),
    high: t("orders.risk.high"),
  };

  return (
    <section className={claseTarjeta("base", "space-y-5 p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("orders.details.metaLabel")}</p>
          <h2 className="text-xl font-bold text-foreground">{t("orders.details.title", { id: order.id })}</h2>
          <p className="text-sm text-muted-foreground">{t("orders.details.createdAt", { date: dateTimeFormatter.format(new Date(order.createdAt)) })}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <span className={claseTonoSuave(riskToneClass[order.risk.level], "rounded-full px-3 py-1 text-xs font-semibold")}>
            {t("orders.details.risk", { risk: riskLabel[order.risk.level] })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t("orders.details.sections.customer")}</h3>
          <p className="text-sm text-foreground">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          <p className="text-sm text-muted-foreground">{order.customerDocument}</p>
        </article>

        <article className="rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">{t("orders.details.sections.payment")}</h3>
          <p className="text-sm text-muted-foreground">{t("orders.details.payment.method", { method: order.payment.method })}</p>
          <p className="text-sm text-muted-foreground">{t("orders.details.payment.transaction", { id: order.payment.transactionId })}</p>
          <p className="text-sm text-muted-foreground">{t("orders.details.payment.authorization", { code: order.payment.authorizationCode })}</p>
          <p className="text-sm text-muted-foreground">{t("orders.details.payment.installments", { count: order.payment.installments })}</p>
          <p className="text-sm text-muted-foreground">{t("orders.details.payment.card", { last4: order.payment.cardLast4 })}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{t("orders.details.payment.total", { total: currencyFormatter.format(order.total) })}</p>
        </article>
      </div>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t("orders.details.sections.shipping")}</h3>
        <p className="text-sm text-foreground">{order.shippingAddress.recipient}</p>
        <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
        <p className="text-sm text-muted-foreground">
          {order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.state}
        </p>
        <p className="text-sm text-muted-foreground">{t("orders.details.shipping.zipCode", { zipCode: order.shippingAddress.zipCode })}</p>
        <p className="text-sm text-muted-foreground">{t("orders.details.shipping.phone", { phone: order.shippingAddress.phone })}</p>
        <p className="text-sm text-muted-foreground">{t("orders.details.shipping.reference", { reference: order.shippingAddress.reference })}</p>
        <p className="mt-2 text-sm text-foreground">{t("orders.details.shipping.estimatedDelivery", { date: dateTimeFormatter.format(new Date(order.estimatedDeliveryAt)) })}</p>
      </article>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">{t("orders.details.sections.items")}</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.sku}`} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
              <span className="text-foreground">{item.name}</span>
              <span className="text-muted-foreground">{t("orders.details.itemMeta", { sku: item.sku, quantity: item.quantity })}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">{t("orders.details.sections.notes")}</h3>
        <p className="text-sm text-muted-foreground">{order.internalNote}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("orders.details.riskReason", { reason: order.risk.reason })}</p>
      </article>
    </section>
  );
};
