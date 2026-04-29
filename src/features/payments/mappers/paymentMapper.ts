import type { Payment, PaymentStatus } from "../types/payment";

export type RoxTransactionStatus = "success" | "failed" | "pending" | string;

export type RoxTransaction = {
  id: string | number;
  order_id: string | number | null;
  customer_email: string | null;
  amount: string | number | null;
  currency?: string | null;
  status: RoxTransactionStatus | null;
  transaction_type?: string | null;
  card_brand: string | null;
  created_at: string | null;
};

const statusMap: Record<"success" | "failed" | "pending", PaymentStatus> = {
  success: "paid",
  failed: "rejected",
  pending: "pending",
};

const mapPaymentStatus = (status: RoxTransactionStatus | null): PaymentStatus => {
  if (status === "success" || status === "failed" || status === "pending") {
    return statusMap[status];
  }

  return "pending";
};

export const mapTransactionToPayment = (transaction: RoxTransaction): Payment => ({
  id: String(transaction.order_id ?? transaction.id),
  customerName: transaction.customer_email ?? "-",
  paymentMethod: transaction.card_brand ?? "-",
  status: mapPaymentStatus(transaction.status),
  total: Number(transaction.amount ?? 0),
  currency: transaction.currency ?? "MXN",
  createdAt: transaction.created_at ?? new Date(0).toISOString(),
});

export const mapTransactionsToPayments = (transactions: RoxTransaction[]): Payment[] =>
  transactions.map(mapTransactionToPayment);