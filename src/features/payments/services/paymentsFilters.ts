import { mapTransactionsToPayments, type RoxTransaction } from "../mappers/paymentMapper";
import type { Payment, PaymentListResponse, PaymentQueryParams, PaymentSortBy, SortOrder } from "../types/payment";
import { DEFAULT_LIMIT, DEFAULT_PAGE, type PaymentsApiResponse, resolveTransactions } from "./paymentsApi";

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
      (!params.from && !params.to ? true : isWithinDateRange(transaction.created_at, params.from, params.to)),
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

export const buildClientSideResponse = (transactions: RoxTransaction[], params: PaymentQueryParams): PaymentListResponse => {
  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const filteredTransactions = filterTransactions(transactions, params);
  const filteredPayments = mapTransactionsToPayments(filteredTransactions).filter((payment) =>
    params.status ? payment.status === params.status : true,
  );
  const sortedPayments = sortPayments(filteredPayments, params.sortBy ?? "createdAt", params.order ?? "desc");
  const totalItems = sortedPayments.length;

  return {
    data: paginatePayments(sortedPayments, page, limit),
    totalPages: Math.max(Math.ceil(totalItems / limit), 1),
    page,
    totalItems,
    stats: getStats(sortedPayments),
  };
};

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

export const shouldUseFullPaginatedDataset = (params: PaymentQueryParams): boolean =>
  Boolean(params.search || params.from || params.to || params.status);
