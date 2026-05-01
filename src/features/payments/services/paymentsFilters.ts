import { mapTransactionsToPayments, type RoxTransaction } from "../mappers/paymentMapper";
import type { Payment, PaymentListResponse, PaymentQueryParams, PaymentSortBy, SortOrder } from "../types/payment";
import { DEFAULT_LIMIT, DEFAULT_PAGE, type PaymentsApiResponse, resolveTransactions } from "./paymentsApi";

// Comparador generico para ordenar texto o numeros en ascendente/descendente.
const compareValues = (left: string | number, right: string | number, order: SortOrder): number => {
  if (left < right) {
    return order === "asc" ? -1 : 1;
  }

  if (left > right) {
    return order === "asc" ? 1 : -1;
  }

  return 0;
};

// Extrae el valor real que se usara al ordenar una fila de la tabla.
const getSortableValue = (payment: Payment, sortBy: PaymentSortBy): string | number => {
  if (sortBy === "createdAt") {
    const timestamp = new Date(payment.createdAt).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  if (sortBy === "total") {
    return payment.total;
  }

  return payment.status;
};

// Crea una copia ordenada para no mutar el arreglo original.
const sortPayments = (payments: Payment[], sortBy: PaymentSortBy, order: SortOrder): Payment[] =>
  [...payments].sort((left, right) => compareValues(getSortableValue(left, sortBy), getSortableValue(right, sortBy), order));

// Paginacion local usada solo cuando frontend une varias respuestas del backend.
const paginatePayments = (payments: Payment[], page: number, limit: number): Payment[] => {
  const startIndex = (page - 1) * limit;
  return payments.slice(startIndex, startIndex + limit);
};

// Calcula las tarjetas superiores de resumen usando la misma lista que se muestra.
const getStats = (payments: Payment[]): PaymentListResponse["stats"] =>
  payments.reduce(
    (stats, payment) => {
      stats.totalRevenue += payment.total;

      if (payment.status === "paid") {
        stats.paidCount += 1;
      } else if (payment.status === "pending") {
        stats.pendingCount += 1;
      } else if (payment.status === "rejected") {
        stats.rejectedCount += 1;
      }

      return stats;
    },
    {
      totalRevenue: 0,
      paidCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
    },
  );

// Se usa cuando frontend une varias respuestas del backend y debe paginar el resultado final.
export const buildClientSideResponse = (transactions: RoxTransaction[], params: PaymentQueryParams): PaymentListResponse => {
  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const payments = mapTransactionsToPayments(transactions);
  const sortedPayments = sortPayments(payments, params.sortBy ?? "createdAt", params.order ?? "desc");
  const totalItems = sortedPayments.length;

  return {
    data: paginatePayments(sortedPayments, page, limit),
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
    page,
    totalItems,
    stats: getStats(sortedPayments),
  };
};

// Se usa para respuestas que ya vienen paginadas directamente desde el backend.
export const buildServerSideResponse = (payload: PaymentsApiResponse, params: PaymentQueryParams): PaymentListResponse => {
  const page = payload.pagination?.current_page ?? params.page ?? DEFAULT_PAGE;
  const payments = sortPayments(
    mapTransactionsToPayments(resolveTransactions(payload)),
    params.sortBy ?? "createdAt",
    params.order ?? "desc",
  );

  return {
    data: payments,
    totalPages: Math.max(payload.pagination?.total_pages ?? 1, 1),
    page,
    totalItems: payload.pagination?.total_records ?? payments.length,
    stats: getStats(payments),
  };
};
