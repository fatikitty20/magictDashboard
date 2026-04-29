import { mapTransactionsToPayments, type RoxTransaction } from "../mappers/paymentMapper";
import type { PaymentListResponse, PaymentQueryParams } from "../types/payment";

type PaymentsApiResponse = {
  data?: RoxTransaction[];
  items?: RoxTransaction[];
  rows?: RoxTransaction[];
  payments?: RoxTransaction[];
  totalPages?: number;
  page?: number;
  totalItems?: number;
  total?: number;
  stats?: {
    totalRevenue: number;
    paidCount: number;
    pendingCount: number;
    rejectedCount: number;
  };
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

const API_BASE_URL = (((import.meta as any).env?.VITE_API_URL) ?? "").replace(/\/$/, "");

const buildApiUrl = (path: string, params: PaymentQueryParams) => {
  const queryString = buildQueryString(params);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const endpointPath = queryString.length > 0 ? `${normalizedPath}?${queryString}` : normalizedPath;

  return API_BASE_URL ? `${API_BASE_URL}${endpointPath}` : endpointPath;
};

const buildQueryString = (params: PaymentQueryParams) => {
  const searchParams = new URLSearchParams();

  if (typeof params.page === "number") {
    searchParams.set("page", params.page.toString());
  }

  if (typeof params.limit === "number") {
    searchParams.set("limit", params.limit.toString());
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.from) {
    searchParams.set("from", params.from);
  }

  if (params.to) {
    searchParams.set("to", params.to);
  }

  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
  }

  if (params.order) {
    searchParams.set("order", params.order);
  }

  return searchParams.toString();
};

export const paymentsService = {
  async getPayments(params: PaymentQueryParams = {}): Promise<PaymentListResponse> {
    const endpoint = buildApiUrl("/payments", params);
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los pagos");
    }

    const payload = (await response.json()) as PaymentsApiResponse;
    const transactions = resolveTransactions(payload);

    const payments = mapTransactionsToPayments(transactions);

    return {
      data: payments,
      totalPages: Math.max(payload.totalPages ?? 1, 1),
      page: payload.page ?? params.page ?? 1,
      totalItems: payload.totalItems ?? payload.total ?? transactions.length,
      stats: payload.stats
        ? {
            totalRevenue: payload.stats.totalRevenue,
            paidCount: payload.stats.paidCount,
            pendingCount: payload.stats.pendingCount,
            rejectedCount: payload.stats.rejectedCount,
          }
        : undefined,
    };
  },
};
