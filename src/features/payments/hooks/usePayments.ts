import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../domain/getPayments";
import type { PaymentListResponse, PaymentQueryParams } from "../types/payment";

type UsePaymentsParams = {
  page: number;
  limit: number;
  params: PaymentQueryParams;
};

export const usePayments = ({ page, limit, params }: UsePaymentsParams) => {
  return useQuery<PaymentListResponse>({
    queryKey: ["payments", page, limit, params],
    queryFn: () =>
      getPayments({
        page,
        limit,
        ...params,
      }),
  });
};