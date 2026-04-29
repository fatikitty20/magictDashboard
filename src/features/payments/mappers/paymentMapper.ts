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

const paymentStatusAliases: Record<string, PaymentStatus> = {
  success: "paid",
  succeeded: "paid",
  approved: "paid",
  paid: "paid",
  captured: "paid",
  settled: "paid",
  failed: "rejected",
  declined: "rejected",
  rejected: "rejected",
  cancelled: "rejected",
  canceled: "rejected",
  chargeback: "rejected",
  refunded: "rejected",
  pending: "pending",
  in_progress: "pending",
  processing: "pending",
  review: "pending",
};

const mapPaymentStatus = (status: RoxTransactionStatus | null): PaymentStatus => {
  const normalizedStatus = String(status ?? "pending").trim().toLowerCase();

  return paymentStatusAliases[normalizedStatus] ?? "pending";
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