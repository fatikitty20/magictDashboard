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

const isDevelopment = Boolean(import.meta.env.DEV);

const API_BASE_URL = isDevelopment ? "/api/v1" : (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

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
    const limitStr = params.limit.toString();
    searchParams.set("limit", limitStr);
    searchParams.set("take", limitStr);
    searchParams.set("pageSize", limitStr);
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
    searchParams.set("sort", params.sortBy);
  }

  if (params.order) {
    const dir = params.order === "asc" ? "ASC" : "DESC";
    searchParams.set("order", params.order);
    searchParams.set("dir", dir);
  }

  return searchParams.toString();
};

export const paymentsService = {
  async getPayments(params: PaymentQueryParams = {}): Promise<PaymentListResponse> {
    const endpoint = buildApiUrl("", params);
    console.log("🔍 [PaymentsService] Fetching with endpoint:", endpoint);
    console.log("📊 [PaymentsService] Params:", params);
    const response = await fetch(endpoint);
    console.log("📨 [PaymentsService] Response status:", response.status);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los pagos");
    }

    const payload = (await response.json()) as PaymentsApiResponse;
    const transactions = resolveTransactions(payload);
    console.log("✅ [PaymentsService] Transactions received:", transactions.length);
    console.log("📄 [PaymentsService] Total pages from backend:", payload.totalPages);

    const payments = mapTransactionsToPayments(transactions);

    // Frontend pagination: slice results to match requested page/limit
    const limit = params.limit ?? 20;
    const page = params.page ?? 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPayments = payments.slice(startIndex, endIndex);

    const totalItems = payload.totalItems ?? payload.total ?? transactions.length;
    const calculatedTotalPages = Math.max(Math.ceil(totalItems / limit), 1);

    return {
      data: paginatedPayments,
      totalPages: payload.totalPages ?? calculatedTotalPages,
      page: page,
      totalItems: totalItems,
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

  async searchById(id: string): Promise<PaymentListResponse> {
    if (!id.trim()) {
      return {
        data: [],
        totalPages: 0,
        page: 1,
        totalItems: 0,
      };
    }

    const searchTerm = id.trim();
    
    // Try multiple endpoint variations
    const endpoints = [
      `${API_BASE_URL}/transaction/id/${encodeURIComponent(searchTerm)}`,
      `${API_BASE_URL}/transactions/id/${encodeURIComponent(searchTerm)}`,
      `${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}`,
    ];

    for (const endpoint of endpoints) {
      try {
        console.log("🔍 [PaymentsService] Trying endpoint:", endpoint);
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const payload = (await response.json()) as PaymentsApiResponse;
          const transactions = resolveTransactions(payload);
          console.log("✅ [PaymentsService] Found transactions by ID:", transactions.length);

          const payments = mapTransactionsToPayments(transactions);

          return {
            data: payments,
            totalPages: 1,
            page: 1,
            totalItems: payments.length,
          };
        }
      } catch (error) {
        console.log("⚠️ [PaymentsService] Endpoint failed, trying next:", error);
      }
    }

    console.log("⚠️ [PaymentsService] No results found for ID:", id);
    return {
      data: [],
      totalPages: 0,
      page: 1,
      totalItems: 0,
    };
  },

  async searchByEmail(email: string): Promise<PaymentListResponse> {
    if (!email.trim()) {
      return {
        data: [],
        totalPages: 0,
        page: 1,
        totalItems: 0,
      };
    }

    const searchTerm = email.trim();
    
    // Try multiple endpoint variations
    const endpoints = [
      `${API_BASE_URL}/transaction/email/${encodeURIComponent(searchTerm)}`,
      `${API_BASE_URL}/transactions/email/${encodeURIComponent(searchTerm)}`,
      `${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}`,
    ];

    for (const endpoint of endpoints) {
      try {
        console.log("🔍 [PaymentsService] Trying email endpoint:", endpoint);
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const payload = (await response.json()) as PaymentsApiResponse;
          const transactions = resolveTransactions(payload);
          console.log("✅ [PaymentsService] Found transactions by email:", transactions.length);

          const payments = mapTransactionsToPayments(transactions);

          return {
            data: payments,
            totalPages: 1,
            page: 1,
            totalItems: payments.length,
          };
        }
      } catch (error) {
        console.log("⚠️ [PaymentsService] Email endpoint failed, trying next:", error);
      }
    }

    console.log("⚠️ [PaymentsService] No results found for email:", email);
    return {
      data: [],
      totalPages: 0,
      page: 1,
      totalItems: 0,
    };
  },
};
