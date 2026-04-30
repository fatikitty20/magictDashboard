import type { RoxTransaction } from "../mappers/paymentMapper";
import type { PaymentListResponse, PaymentQueryParams } from "../types/payment";
import {
  BACKEND_MAX_LIMIT,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  fetchPaginatedTransactions,
  fetchSpecificSearchTransactions,
  MAX_CLIENT_SIDE_PAGES,
  resolveTransactions,
} from "./paymentsApi";
import { buildClientSideResponse, buildServerSideResponse, shouldUseFullPaginatedDataset } from "./paymentsFilters";

const fetchAllTransactionsThroughPagination = async (params: PaymentQueryParams): Promise<RoxTransaction[]> => {
  const firstPayload = await fetchPaginatedTransactions(params, DEFAULT_PAGE, BACKEND_MAX_LIMIT);
  const firstPageTransactions = resolveTransactions(firstPayload);
  const totalPages = Math.min(firstPayload.pagination?.total_pages ?? DEFAULT_PAGE, MAX_CLIENT_SIDE_PAGES);

  if (totalPages <= 1) {
    return firstPageTransactions;
  }

  // Mientras backend no filtre por fecha/order_id, recorremos su paginacion y filtramos del lado del frontend.
  const restPayloads = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) => fetchPaginatedTransactions(params, index + 2, BACKEND_MAX_LIMIT)),
  );

  return restPayloads.reduce(
    (transactions, payload) => transactions.concat(resolveTransactions(payload)),
    firstPageTransactions,
  );
};

const getPaymentsFromSpecificSearchEndpoint = async (params: PaymentQueryParams): Promise<PaymentListResponse | null> => {
  const search = String(params.search ?? "").trim();

  if (!search) {
    return null;
  }

  // Primero se intentan los endpoints separados de Alejandro: email o id real de rox_transactions.
  const transactions = await fetchSpecificSearchTransactions(search);

  if (transactions.length === 0) {
    return null;
  }

  return buildClientSideResponse(transactions, params);
};

export const paymentsService = {
  async getPayments(params: PaymentQueryParams = {}): Promise<PaymentListResponse> {
    const specificSearchResponse = await getPaymentsFromSpecificSearchEndpoint(params);

    if (specificSearchResponse) {
      return specificSearchResponse;
    }

    if (shouldUseFullPaginatedDataset(params)) {
      const transactions = await fetchAllTransactionsThroughPagination(params);
      return buildClientSideResponse(transactions, params);
    }

    const payload = await fetchPaginatedTransactions(params, params.page ?? DEFAULT_PAGE, params.limit ?? DEFAULT_LIMIT);

    return buildServerSideResponse(payload, params);
  },
};
