import { apiClient } from "@/shared/api/apiClient";
import type { RoxTransaction } from "../mappers/paymentMapper";
import type { PaymentQueryParams, PaymentSortBy, PaymentStatus } from "../types/payment";

export type BackendPagination = {
  total_records?: number;
  total_pages?: number;
  current_page?: number;
  limit_per_page?: number;
};

export type PaymentsApiResponse = {
  status?: string;
  data?: RoxTransaction[] | RoxTransaction;
  items?: RoxTransaction[];
  rows?: RoxTransaction[];
  payments?: RoxTransaction[];
  pagination?: BackendPagination;
};

type BackendSortBy = "created_at" | "amount" | "status";
type BackendOrder = "ASC" | "DESC";

export type BackendStatus =
  | "APPROVED"
  | "PENDING"
  | "DECLINED"
  | "REFUNDED"
  | "FAILED"
  | "CANCELLED";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const BACKEND_MAX_LIMIT = 100;
export const MAX_CLIENT_SIDE_PAGES = 80;

const sortFieldMap: Record<PaymentSortBy, BackendSortBy> = {
  createdAt: "created_at",
  total: "amount",
  status: "status",
};

const statusFieldMap: Record<PaymentStatus, BackendStatus[]> = {
  paid: ["APPROVED"],
  pending: ["PENDING"],
  rejected: ["DECLINED", "REFUNDED", "FAILED", "CANCELLED"],
};

export const getBackendStatusesForPaymentStatus = (status?: PaymentStatus): BackendStatus[] =>
  status ? statusFieldMap[status] : [];

export const getSingleBackendStatus = (status?: PaymentStatus): BackendStatus | undefined => {
  const backendStatuses = getBackendStatusesForPaymentStatus(status);
  return backendStatuses.length === 1 ? backendStatuses[0] : undefined;
};

export const resolveTransactions = (payload: PaymentsApiResponse): RoxTransaction[] => {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data) {
    return [payload.data];
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

const buildApiEndpoint = (path = "", searchParams?: URLSearchParams) => {
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const queryString = searchParams?.toString();
  return queryString ? `${normalizedPath}?${queryString}` : normalizedPath || "/";
};

const toStartOfDay = (date: string): string =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00.000Z` : date;

const toEndOfDay = (date: string): string =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T23:59:59.999Z` : date;

const buildPaginatedParams = (
  params: PaymentQueryParams,
  page: number,
  limit: number,
  backendStatus?: BackendStatus,
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  const status = backendStatus ?? getSingleBackendStatus(params.status);

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  searchParams.set("sortBy", sortFieldMap[params.sortBy ?? "createdAt"]);
  searchParams.set("order", (params.order ?? "desc").toUpperCase() as BackendOrder);

  if (status) {
    searchParams.set("status", status);
  }

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.from) {
    searchParams.set("from", toStartOfDay(params.from));
  }

  if (params.to) {
    searchParams.set("to", toEndOfDay(params.to));
  }

  return searchParams;
};

// 🔥 USANDO apiClient (IMPORTANTE)
const getErrorMessage = (error: unknown): string =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof error.message === "string"
    ? error.message
    : "";

export const fetchPaginatedTransactions = async (
  params: PaymentQueryParams,
  page: number,
  limit: number,
  backendStatus?: BackendStatus,
): Promise<PaymentsApiResponse> => {
  const url = buildApiEndpoint("", buildPaginatedParams(params, page, limit, backendStatus));

  try {
    return await apiClient<PaymentsApiResponse>(url);
  } catch (error: unknown) {
    // 🔥 Manejo especial para búsquedas sin resultados
    if (getErrorMessage(error).includes("404")) {
      return { data: [] };
    }

    throw new Error("Could not load payments");
  }
};
