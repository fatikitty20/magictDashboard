import type { RoxTransaction } from "../mappers/paymentMapper";
import type { PaymentListResponse, PaymentQueryParams } from "../types/payment";
import {
  BACKEND_MAX_LIMIT,
  type BackendStatus,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  fetchPaginatedTransactions,
  getBackendStatusesForPaymentStatus,
  MAX_CLIENT_SIDE_PAGES,
  resolveTransactions,
} from "../api/paymentsApi";
import { buildClientSideResponse, buildServerSideResponse } from "./paymentsFilters";

// 🔹 Trae todas las páginas de un status específico
const fetchAllTransactionsThroughPagination = async (
  params: PaymentQueryParams,
  backendStatus?: BackendStatus,
): Promise<RoxTransaction[]> => {
  const firstPayload = await fetchPaginatedTransactions(params, DEFAULT_PAGE, BACKEND_MAX_LIMIT, backendStatus);
  const firstPageTransactions = resolveTransactions(firstPayload);

  const totalPages = Math.min(firstPayload.pagination?.total_pages ?? DEFAULT_PAGE, MAX_CLIENT_SIDE_PAGES);

  if (totalPages <= 1) {
    return firstPageTransactions;
  }

  const restPayloads = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchPaginatedTransactions(params, index + 2, BACKEND_MAX_LIMIT, backendStatus),
    ),
  );

  return [...firstPageTransactions, ...restPayloads.flatMap(resolveTransactions)];
};

// 🔹 Une múltiples estados (ej: rejected)
const fetchMergedStatusTransactions = async (
  params: PaymentQueryParams,
  backendStatuses: BackendStatus[],
): Promise<RoxTransaction[]> => {
  const transactionsByStatus = await Promise.all(
    backendStatuses.map((backendStatus) => fetchAllTransactionsThroughPagination(params, backendStatus)),
  );

  return transactionsByStatus.flat();
};

// FUNCIÓN PRINCIPAL DE DOMINIO
export const getPayments = async (params: PaymentQueryParams = {}): Promise<PaymentListResponse> => {
  const backendStatuses = getBackendStatusesForPaymentStatus(params.status);

  if (backendStatuses.length > 1) {
    const transactions = await fetchMergedStatusTransactions(params, backendStatuses);
    return buildClientSideResponse(transactions, params);
  }

  const payload = await fetchPaginatedTransactions(
    params,
    params.page ?? DEFAULT_PAGE,
    params.limit ?? DEFAULT_LIMIT,
  );

  return buildServerSideResponse(payload, params);
};