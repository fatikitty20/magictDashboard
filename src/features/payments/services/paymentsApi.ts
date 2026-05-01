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
export type BackendStatus = "APPROVED" | "PENDING" | "DECLINED" | "REFUNDED" | "FAILED" | "CANCELLED";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const BACKEND_MAX_LIMIT = 100;
export const MAX_CLIENT_SIDE_PAGES = 80;

const API_BASE_URL = import.meta.env.DEV ? "/api/v1" : (import.meta.env.VITE_API_URL ?? "/api/v1").replace(/\/$/, "");

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

const buildApiUrl = (path = "", searchParams?: URLSearchParams) => {
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const queryString = searchParams?.toString();
  const url = `${API_BASE_URL}${normalizedPath}`;

  return queryString ? `${url}?${queryString}` : url;
};

const fetchPaymentsPayload = async (url: string, emptyOnNotFound = false): Promise<PaymentsApiResponse> => {
  const response = await fetch(url);

  if (emptyOnNotFound && response.status === 404) {
    return { data: [] };
  }

  if (!response.ok) {
    throw new Error("Could not load payments");
  }

  return (await response.json()) as PaymentsApiResponse;
};

const buildPaginatedParams = (
  params: PaymentQueryParams,
  page: number,
  limit: number,
  backendStatus?: BackendStatus,
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  // Parametros del endpoint paginado de Alejandro: /api/v1?page=&limit=&status=&sortBy=&order=.
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  searchParams.set("sortBy", sortFieldMap[params.sortBy ?? "createdAt"]);
  searchParams.set("order", (params.order ?? "desc").toUpperCase() as BackendOrder);

  if (backendStatus) {
    searchParams.set("status", backendStatus);
  }

  return searchParams;
};

const isEmailSearch = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const fetchPaginatedTransactions = async (
  params: PaymentQueryParams,
  page: number,
  limit: number,
  backendStatus?: BackendStatus,
): Promise<PaymentsApiResponse> =>
  fetchPaymentsPayload(buildApiUrl("", buildPaginatedParams(params, page, limit, backendStatus)));

export const fetchSpecificSearchTransactions = async (search: string): Promise<RoxTransaction[]> => {
  const encodedSearch = encodeURIComponent(search.trim());
  const searchPaths = isEmailSearch(search)
    ? [`/transaction/email/${encodedSearch}`]
    : [`/transaction/order/${encodedSearch}`, `/transaction/id/${encodedSearch}`];

  for (const searchPath of searchPaths) {
    const payload = await fetchPaymentsPayload(buildApiUrl(searchPath), true);
    const transactions = resolveTransactions(payload);

    if (transactions.length > 0) {
      return transactions;
    }
  }

  return [];
};
