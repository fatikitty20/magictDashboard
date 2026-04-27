import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";
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

const riskToneClass: Record<Order["risk"]["level"], string> = {
  low: "success",
  medium: "info",
  high: "destructive",
};

const riskLabel: Record<Order["risk"]["level"], string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export const OrderDetailsPanel = ({ order }: OrderDetailsPanelProps) => {
  if (!order) {
    return (
      <section className={claseTarjeta("base", "p-6")}>
        <h2 className="mb-2 text-lg font-semibold text-foreground">Detalle del pedido</h2>
        <p className="text-sm text-muted-foreground">Selecciona una orden para ver su informacion completa.</p>
      </section>
    );
  }

  return (
    <section className={claseTarjeta("base", "space-y-5 p-6")}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Detalle administrativo</p>
          <h2 className="text-xl font-bold text-foreground">Pedido {order.id}</h2>
          <p className="text-sm text-muted-foreground">Creado: {dateTimeFormatter.format(new Date(order.createdAt))}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <span className={claseTonoSuave(riskToneClass[order.risk.level], "rounded-full px-3 py-1 text-xs font-semibold")}>
            Riesgo {riskLabel[order.risk.level]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Cliente</h3>
          <p className="text-sm text-foreground">{order.customerName}</p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          <p className="text-sm text-muted-foreground">{order.customerDocument}</p>
        </article>

        <article className="rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Pago</h3>
          <p className="text-sm text-muted-foreground">Metodo: {order.payment.method}</p>
          <p className="text-sm text-muted-foreground">Transaccion: {order.payment.transactionId}</p>
          <p className="text-sm text-muted-foreground">Autorizacion: {order.payment.authorizationCode}</p>
          <p className="text-sm text-muted-foreground">Cuotas: {order.payment.installments}</p>
          <p className="text-sm text-muted-foreground">Tarjeta: **** {order.payment.cardLast4}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">Total: {currencyFormatter.format(order.total)}</p>
        </article>
      </div>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Direccion de envio</h3>
        <p className="text-sm text-foreground">{order.shippingAddress.recipient}</p>
        <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
        <p className="text-sm text-muted-foreground">
          {order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.state}
        </p>
        <p className="text-sm text-muted-foreground">CP: {order.shippingAddress.zipCode}</p>
        <p className="text-sm text-muted-foreground">Telefono: {order.shippingAddress.phone}</p>
        <p className="text-sm text-muted-foreground">Referencia: {order.shippingAddress.reference}</p>
        <p className="mt-2 text-sm text-foreground">
          Entrega estimada: {dateTimeFormatter.format(new Date(order.estimatedDeliveryAt))}
        </p>
      </article>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Productos del pedido</h3>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.sku}`} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
              <span className="text-foreground">{item.name}</span>
              <span className="text-muted-foreground">SKU: {item.sku} | Cantidad: {item.quantity}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-border p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Notas internas y auditoria</h3>
        <p className="text-sm text-muted-foreground">{order.internalNote}</p>
        <p className="mt-2 text-sm text-muted-foreground">Motivo de riesgo: {order.risk.reason}</p>
      </article>
    </section>
  );
};
