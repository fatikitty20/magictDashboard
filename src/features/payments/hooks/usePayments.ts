import { useQuery } from "@tanstack/react-query";
import { getPayments } from "../domain/getPayments";
import type { PaymentQueryParams } from "../types/payment";

type UsePaymentsParams = {
  page: number;
  limit: number;
  params: PaymentQueryParams;
};

export const usePayments = ({ page, limit, params }: UsePaymentsParams) => {
  return useQuery({
    queryKey: ["payments", page, limit, params],
    queryFn: () =>
  getPayments({
        page,
        limit,
        ...params,
      }),
    keepPreviousData: true,
  });
};