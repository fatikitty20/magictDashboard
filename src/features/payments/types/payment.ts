export type PaymentStatus = "paid" | "pending" | "rejected";
export type PaymentSortBy = "createdAt" | "total" | "status";
export type SortOrder = "asc" | "desc";

export interface Payment {
  id: string;
  customerName: string;
  paymentMethod: string;
  status: PaymentStatus;
  total: number;
  currency?: string;
  createdAt: string;
}

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  from?: string;
  to?: string;
  sortBy?: PaymentSortBy;
  order?: SortOrder;
}

export interface PaymentListResponse {
  data: Payment[];
  totalPages: number;
  page: number;
  totalItems: number;
  stats?: {
    totalRevenue: number;
    paidCount: number;
    pendingCount: number;
    rejectedCount: number;
  };
}
