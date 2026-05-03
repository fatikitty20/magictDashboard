import { withMockDelay } from "@/lib/mockService";
import type { Transaction } from "../types/transaction";

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    merchant: "Tienda A",
    merchantId: "m1",
    amount: 1200,
    currency: "MXN",
    status: "approved",
    method: "VISA",
    createdAt: "2026-05-01",
  },
];

export const transactionsService = {
  async getTransactions(): Promise<Transaction[]> {
    return withMockDelay(() => mockTransactions, 500);
  },
};