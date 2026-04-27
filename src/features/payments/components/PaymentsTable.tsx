import type { Payment } from "../types/payment";
import { claseTarjeta } from "@/features/dashboard/estilosDashboard";
import { StatusBadge } from "./StatusBadge";

type PaymentsTableProps = {
  payments: Payment[];
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

export const PaymentsTable = ({ payments }: PaymentsTableProps) => (
  <section className={claseTarjeta("base", "overflow-hidden")}> 
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">ID de Orden</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Cliente</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Metodo de Pago</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Estado del Pago</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Fecha</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map((payment) => (
            <tr key={payment.id} className="transition hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-foreground">{payment.id}</td>
              <td className="px-4 py-3 text-muted-foreground">{payment.customerName}</td>
              <td className="px-4 py-3 text-muted-foreground">{payment.paymentMethod}</td>
              <td className="px-4 py-3">
                <StatusBadge status={payment.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{dateFormatter.format(new Date(payment.createdAt))}</td>
              <td className="px-4 py-3 text-right font-semibold text-foreground">
                {currencyFormatter.format(payment.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {payments.length === 0 ? (
      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
        No hay pagos para el filtro seleccionado.
      </div>
    ) : null}
  </section>
);
