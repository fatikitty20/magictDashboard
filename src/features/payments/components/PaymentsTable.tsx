import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Payment, PaymentSortBy, SortOrder } from "../types/payment";
import { claseTarjeta } from "../../dashboard/estilosDashboard";
import { StatusBadge } from "./StatusBadge";

type PaymentsTableProps = {
  payments: Payment[];
  isLoading?: boolean;
  sortBy: PaymentSortBy;
  order: SortOrder;
  onSortChange: (sortBy: PaymentSortBy) => void;
  locale?: string;
};


const sortableLabels: Record<PaymentSortBy, string> = {
  createdAt: "Fecha",
  total: "Total",
  status: "Estado del Pago",
};

const renderSortIcon = (isActive: boolean, order: SortOrder) => {
  if (!isActive) {
    return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />;
  }

  return order === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
};

export const PaymentsTable = ({ payments, isLoading = false, sortBy, order, onSortChange, locale }: PaymentsTableProps) => {
  const headerButtonClass =
    "inline-flex items-center gap-1.5 font-semibold text-foreground transition hover:text-foreground/80";

  const usedLocale = locale ?? (typeof navigator !== "undefined" ? navigator.language ?? "es-MX" : "es-MX");

  return (
    <section className={claseTarjeta("base", "overflow-hidden")}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">ID de Orden</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Cliente</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Método de Pago</th>
              <th
                className="px-4 py-3 text-left font-semibold text-foreground"
                aria-sort={sortBy === "status" ? (order === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => onSortChange("status")}
                  className={headerButtonClass}
                >
                  {sortableLabels.status}
                  {renderSortIcon(sortBy === "status", order)}
                </button>
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-foreground"
                aria-sort={sortBy === "createdAt" ? (order === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => onSortChange("createdAt")}
                  className={headerButtonClass}
                >
                  {sortableLabels.createdAt}
                  {renderSortIcon(sortBy === "createdAt", order)}
                </button>
              </th>
              <th
                className="px-4 py-3 text-right font-semibold text-foreground"
                aria-sort={sortBy === "total" ? (order === "asc" ? "ascending" : "descending") : "none"}
              >
                <button
                  type="button"
                  onClick={() => onSortChange("total")}
                  className={`${headerButtonClass} ml-auto justify-end`}
                >
                  {sortableLabels.total}
                  {renderSortIcon(sortBy === "total", order)}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={`payment-skeleton-${index}`} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-muted" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-36 rounded bg-muted" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-muted" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-6 w-24 rounded-full bg-muted" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 rounded bg-muted" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="ml-auto h-4 w-20 rounded bg-muted" />
                  </td>
                </tr>
              ))
            ) : payments.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={6}>
                  No hay pagos para mostrar con los filtros actuales.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="transition hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{payment.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{payment.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{payment.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Intl.DateTimeFormat(usedLocale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(payment.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {new Intl.NumberFormat(usedLocale, {
                      style: "currency",
                      currency: payment.currency ?? "MXN",
                      maximumFractionDigits: 0,
                    }).format(payment.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
