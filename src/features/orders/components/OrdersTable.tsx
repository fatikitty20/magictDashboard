import { claseTarjeta } from "@/shared/ui/estilosDashboard";
import { useTranslation } from "react-i18next";
import type { Order } from "../types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrdersTableProps = {
  orders: Order[];
  selectedOrderId?: string;
  onSelectOrder: (orderId: string) => void;
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

export const OrdersTable = ({ orders, selectedOrderId, onSelectOrder }: OrdersTableProps) => {
  const { t } = useTranslation();

  return (
  <section className={claseTarjeta("base", "overflow-hidden")}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t("orders.table.headers.orderId")}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t("orders.table.headers.customer")}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t("orders.table.headers.order")}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t("orders.table.headers.salesChannel")}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t("orders.table.headers.status")}</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">{t("orders.table.headers.date")}</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">{t("orders.table.headers.total")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr
              key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className={`cursor-pointer transition hover:bg-muted/30 ${
                selectedOrderId === order.id ? "bg-muted/40" : ""
              }`}
            >
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
        {t("orders.table.emptyState")}
      </div>
    ) : null}
  </section>
  );
};
