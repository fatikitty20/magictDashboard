import type { Payment, PaymentStatus } from "../types/payment";

export type RoxTransactionStatus = "success" | "failed" | "pending" | string;

// Forma cruda de una transaccion tal como llega desde la API de Alejandro.
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

type StatusKeywordRule = {
  status: PaymentStatus;
  keywords: string[];
};

// Traduce estados tecnicos del backend/gateway a los tres estados que ve el usuario.
// El orden importa: "rejected" va primero para evitar confundir refunds/cancelaciones con pagos.
const statusKeywordRules: StatusKeywordRule[] = [
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
    ],
  },
  {
    status: "pending",
    keywords: ["pending", "progress", "process", "review", "hold", "pendient", "proceso", "revision"],
  },
  {
    status: "paid",
    keywords: ["success", "succeed", "approv", "captur", "settle", "complete", "paid", "aprob", "pagad"],
  },
];

const normalizeStatus = (status: RoxTransactionStatus | null): string =>
  String(status ?? "pending")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

// Convierte cualquier estado tecnico a un estado visual estable para la interfaz.
const mapPaymentStatus = (status: RoxTransactionStatus | null): PaymentStatus => {
  const normalizedStatus = normalizeStatus(status);
  const statusRule = statusKeywordRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedStatus.includes(keyword)),
  );

  return statusRule?.status ?? "pending";
};

// Adaptador principal: transforma la transaccion del backend al modelo que consume la tabla.
export const mapTransactionToPayment = (transaction: RoxTransaction): Payment => ({
  // order_id es el identificador que el usuario reconoce en pantalla; id queda como respaldo.
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
