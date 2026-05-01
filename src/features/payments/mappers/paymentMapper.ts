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
  last_four_digits?: string | number | null;
  created_at: string | null;
};

const paymentStatusAliases: Record<string, PaymentStatus> = {
  success: "paid",
  succeeded: "paid",
  approved: "paid",
  approve: "paid",
  paid: "paid",
  captured: "paid",
  settled: "paid",
  completed: "paid",
  complete: "paid",
  pagado: "paid",
  pagada: "paid",
  aprobado: "paid",
  aprobada: "paid",
  failed: "rejected",
  failure: "rejected",
  error: "rejected",
  errored: "rejected",
  declined: "rejected",
  denied: "rejected",
  rejected: "rejected",
  cancelled: "rejected",
  canceled: "rejected",
  expired: "rejected",
  void: "rejected",
  voided: "rejected",
  chargeback: "rejected",
  refunded: "rejected",
  reversed: "rejected",
  refund: "rejected",
  reversal: "rejected",
  rechazado: "rejected",
  rechazada: "rejected",
  fallido: "rejected",
  fallida: "rejected",
  denegado: "rejected",
  denegada: "rejected",
  reembolsado: "rejected",
  reembolsada: "rejected",
  devuelto: "rejected",
  devuelta: "rejected",
  cancelado: "rejected",
  cancelada: "rejected",
  pending: "pending",
  in_progress: "pending",
  processing: "pending",
  review: "pending",
  hold: "pending",
  pendiente: "pending",
  proceso: "pending",
  revision: "pending",
};

const statusKeywordGroups: Array<{ status: PaymentStatus; keywords: string[] }> = [
  {
    status: "rejected",
    keywords: [
      "fail",
      "error",
      "declin",
      "deni",
      "reject",
      "cancel",
      "expir",
      "void",
      "chargeback",
      "refund",
      "revers",
      "rechaz",
      "fallid",
      "deneg",
      "reembols",
      "devuelt",
      "cancelad",
    ],
  },
  {
    status: "pending",
    keywords: ["pending", "progress", "process", "review", "hold", "pendient", "proceso", "revision"],
  },
  {
    status: "paid",
    keywords: ["success", "succeed", "approv", "captur", "settle", "complete", "aprob", "pagad"],
  },
];

const normalizeStatus = (status: RoxTransactionStatus | null): string =>
  String(status ?? "pending")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

const mapPaymentStatus = (status: RoxTransactionStatus | null): PaymentStatus => {
  const normalizedStatus = normalizeStatus(status);
  const exactStatus = paymentStatusAliases[normalizedStatus];

  if (exactStatus) {
    return exactStatus;
  }

  const keywordStatus = statusKeywordGroups.find((group) =>
    group.keywords.some((keyword) => normalizedStatus.includes(keyword)),
  );

  return keywordStatus?.status ?? "pending";
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
