import type { RoxTransaction } from "../mappers/paymentMapper";
import type { PaymentQueryParams, PaymentSortBy, PaymentStatus } from "../types/payment";

export type BackendPagination = {
  total_records?: number;
  total_pages?: number;
  current_page?: number;
  limit_per_page?: number;
};

// Respuesta flexible porque algunos endpoints pueden devolver data, items, rows o payments.
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

// Valores por defecto compartidos por la tabla y las llamadas al backend.
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const BACKEND_MAX_LIMIT = 100;
export const MAX_CLIENT_SIDE_PAGES = 80;

const API_BASE_URL = import.meta.env.DEV ? "/api/v1" : (import.meta.env.VITE_API_URL ?? "/api/v1").replace(/\/$/, "");

// Traduce nombres internos del frontend a nombres de columnas aceptados por backend.
const sortFieldMap: Record<PaymentSortBy, BackendSortBy> = {
  createdAt: "created_at",
  total: "amount",
  status: "status",
};

// Un estado visual puede equivaler a uno o varios estados reales de la base de datos.
const statusFieldMap: Record<PaymentStatus, BackendStatus[]> = {
  paid: ["APPROVED"],
  pending: ["PENDING"],
  rejected: ["DECLINED", "REFUNDED", "FAILED", "CANCELLED"],
};

export const getBackendStatusesForPaymentStatus = (status?: PaymentStatus): BackendStatus[] =>
  status ? statusFieldMap[status] : [];

// Si el estado visual equivale a un solo estado real, se puede mandar directo en la misma peticion.
export const getSingleBackendStatus = (status?: PaymentStatus): BackendStatus | undefined => {
  const backendStatuses = getBackendStatusesForPaymentStatus(status);

  return backendStatuses.length === 1 ? backendStatuses[0] : undefined;
};

// La API puede devolver un objeto, un array o nombres distintos segun el endpoint.
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
  // Mantiene una sola forma de construir URLs para desarrollo y produccion.
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const queryString = searchParams?.toString();
  const url = `${API_BASE_URL}${normalizedPath}`;

  return queryString ? `${url}?${queryString}` : url;
};

const fetchPaymentsPayload = async (url: string, emptyOnNotFound = false): Promise<PaymentsApiResponse> => {
  const response = await fetch(url);

  // Algunos endpoints de busqueda responden 404 cuando no hay datos; eso no debe romper la tabla.
  if (emptyOnNotFound && response.status === 404) {
    return { data: [] };
  }

  if (!response.ok) {
    throw new Error("Could not load payments");
  }

  return (await response.json()) as PaymentsApiResponse;
};

// Los inputs date llegan como YYYY-MM-DD; se envian al backend como dia completo.
const toStartOfDay = (date: string): string => (/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00.000Z` : date);

const toEndOfDay = (date: string): string => (/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T23:59:59.999Z` : date);

const buildPaginatedParams = (
  params: PaymentQueryParams,
  page: number,
  limit: number,
  backendStatus?: BackendStatus,
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  const status = backendStatus ?? getSingleBackendStatus(params.status);

  // Endpoint principal de Alejandro: pagina, filtra, busca y ordena transacciones desde backend.
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));
  searchParams.set("sortBy", sortFieldMap[params.sortBy ?? "createdAt"]);
  searchParams.set("order", (params.order ?? "desc").toUpperCase() as BackendOrder);

  if (status) {
    searchParams.set("status", status);
  }

  if (params.search?.trim()) {
    // search busca por id, order_id o customer_email desde backend.
    searchParams.set("search", params.search.trim());
  }

  if (params.from) {
    // from arranca desde el primer segundo del dia elegido.
    searchParams.set("from", toStartOfDay(params.from));
  }

  if (params.to) {
    // to incluye todo el dia elegido para no perder pagos de la tarde/noche.
    searchParams.set("to", toEndOfDay(params.to));
  }

  return searchParams;
};

export const fetchPaginatedTransactions = async (
  params: PaymentQueryParams,
  page: number,
  limit: number,
  backendStatus?: BackendStatus,
): Promise<PaymentsApiResponse> =>
  fetchPaymentsPayload(buildApiUrl("", buildPaginatedParams(params, page, limit, backendStatus)));
