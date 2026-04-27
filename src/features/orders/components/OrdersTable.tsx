import { claseTarjeta } from "@/features/dashboard/estilosDashboard";
import type { Order } from "../types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrdersTableProps = {
  orders: Order[];
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

export const OrdersTable = ({ orders }: OrdersTableProps) => (
  <section className={claseTarjeta("base", "overflow-hidden")}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">ID de Orden</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Cliente</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Que pidieron</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Canal de Venta</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Estado del Pedido</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Fecha</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id} className="transition hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-foreground">{order.id}</td>
              <td className="px-4 py-3 text-muted-foreground">{order.customerName}</td>
              <td className="px-4 py-3 text-muted-foreground">
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <p key={`${order.id}-${item.sku}`} className="text-xs">
                      {item.name} x{item.quantity}
                    </p>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{order.salesChannel}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{dateFormatter.format(new Date(order.createdAt))}</td>
              <td className="px-4 py-3 text-right font-semibold text-foreground">{currencyFormatter.format(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {orders.length === 0 ? (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        No hay pedidos para el filtro seleccionado.
      </div>
    ) : null}
  </section>
);
