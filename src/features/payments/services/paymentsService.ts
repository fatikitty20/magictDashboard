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
} from "./paymentsApi";
import { buildClientSideResponse, buildServerSideResponse } from "./paymentsFilters";

// Trae todas las paginas de un status especifico. Se usa solo para unir estados.
const fetchAllTransactionsThroughPagination = async (
  params: PaymentQueryParams,
  backendStatus?: BackendStatus,
): Promise<RoxTransaction[]> => {
  const firstPayload = await fetchPaginatedTransactions(params, DEFAULT_PAGE, BACKEND_MAX_LIMIT, backendStatus);
  const firstPageTransactions = resolveTransactions(firstPayload);

  // Limite de seguridad para no disparar demasiadas peticiones si backend crece mucho.
  const totalPages = Math.min(firstPayload.pagination?.total_pages ?? DEFAULT_PAGE, MAX_CLIENT_SIDE_PAGES);

  if (totalPages <= 1) {
    return firstPageTransactions;
  }

  // Recorremos todas las paginas solo cuando frontend debe unir varios estados de backend.
  const restPayloads = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchPaginatedTransactions(params, index + 2, BACKEND_MAX_LIMIT, backendStatus),
    ),
  );

  return [...firstPageTransactions, ...restPayloads.flatMap(resolveTransactions)];
};

// Junta varias consultas en una sola lista cuando un filtro visual equivale a varios status reales.
const fetchMergedStatusTransactions = async (
  params: PaymentQueryParams,
  backendStatuses: BackendStatus[],
): Promise<RoxTransaction[]> => {
  // Backend acepta un solo status por peticion; por eso juntamos varios cuando el usuario elige "Rechazado".
  const transactionsByStatus = await Promise.all(
    backendStatuses.map((backendStatus) => fetchAllTransactionsThroughPagination(params, backendStatus)),
  );

  return transactionsByStatus.flat();
};

export const paymentsService = {
  async getPayments(params: PaymentQueryParams = {}): Promise<PaymentListResponse> {
    const backendStatuses = getBackendStatusesForPaymentStatus(params.status);

    // "Rechazado" agrupa varios estados reales del backend: DECLINED, REFUNDED, FAILED y CANCELLED.
    if (backendStatuses.length > 1) {
      const transactions = await fetchMergedStatusTransactions(params, backendStatuses);
      return buildClientSideResponse(transactions, params);
    }

    // Camino normal: backend ya pagina, busca, filtra por fechas y ordena.
    const payload = await fetchPaginatedTransactions(params, params.page ?? DEFAULT_PAGE, params.limit ?? DEFAULT_LIMIT);

    return buildServerSideResponse(payload, params);
  },
};
