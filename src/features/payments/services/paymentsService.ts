import { mapTransactionsToPayments, type RoxTransaction } from "../mappers/paymentMapper";
import type { Payment, PaymentListResponse, PaymentQueryParams, PaymentSortBy, SortOrder } from "../types/payment";

type PaymentsApiResponse = {
  data?: RoxTransaction[];
  items?: RoxTransaction[];
  rows?: RoxTransaction[];
  payments?: RoxTransaction[];
};

const resolveTransactions = (payload: PaymentsApiResponse): RoxTransaction[] => {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (Array.isArray(payload.rows)) {
    return payload.rows;
  }

  if (Array.isArray(payload.payments)) {
    return payload.payments;
  }

  return [];
};

const API_BASE_URL = import.meta.env.DEV ? "/api/v1" : (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

const normalizeText = (value: unknown): string => String(value ?? "").trim().toLowerCase();

const isWithinDateRange = (createdAt: string | null, from?: string, to?: string): boolean => {
  const paymentDate = createdAt?.slice(0, 10);

  if (!paymentDate || paymentDate.length !== 10) {
    return false;
  }

  if (from && paymentDate < from) {
    return false;
  }

  if (to && paymentDate > to) {
    return false;
  }

  return true;
};

const transactionMatchesSearch = (transaction: RoxTransaction, search?: string): boolean => {
  const normalizedSearch = normalizeText(search);

  if (!normalizedSearch) {
    return true;
  }

  return [
    transaction.id,
    transaction.order_id,
    transaction.customer_email,
    transaction.card_brand,
    transaction.last_four_digits,
  ].some((value) => normalizeText(value).includes(normalizedSearch));
};

const filterTransactions = (transactions: RoxTransaction[], params: PaymentQueryParams): RoxTransaction[] =>
  transactions.filter(
    (transaction) =>
      transactionMatchesSearch(transaction, params.search) &&
      isWithinDateRange(transaction.created_at, params.from, params.to),
  );

const compareValues = (left: string | number, right: string | number, order: SortOrder): number => {
  if (left < right) {
    return order === "asc" ? -1 : 1;
  }

  if (left > right) {
    return order === "asc" ? 1 : -1;
  }

  return 0;
};

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

const sortPayments = (payments: Payment[], sortBy: PaymentSortBy, order: SortOrder): Payment[] =>
  [...payments].sort((left, right) => compareValues(getSortableValue(left, sortBy), getSortableValue(right, sortBy), order));

const paginatePayments = (payments: Payment[], page: number, limit: number): Payment[] => {
  const startIndex = (page - 1) * limit;
  return payments.slice(startIndex, startIndex + limit);
};

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

export const paymentsService = {
  async getPayments(params: PaymentQueryParams = {}): Promise<PaymentListResponse> {
    const response = await fetch(buildApiUrl(""));

    if (!response.ok) {
      throw new Error("Could not load payments");
    }

    const payload = (await response.json()) as PaymentsApiResponse;
    const transactions = resolveTransactions(payload);
    const filteredTransactions = filterTransactions(transactions, params);
    const sortedPayments = sortPayments(
      mapTransactionsToPayments(filteredTransactions),
      params.sortBy ?? "createdAt",
      params.order ?? "desc",
    );

    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const totalItems = sortedPayments.length;
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    return {
      data: paginatePayments(sortedPayments, page, limit),
      totalPages,
      page,
      totalItems,
      stats: getStats(sortedPayments),
    };
  },
};
