import { paymentsData } from "../data/paymentsData";
import type { Payment } from "../types/payment";

const NETWORK_DELAY_MS = 950;

export const paymentsService = {
  async getPayments(): Promise<Payment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...paymentsData]);
      }, NETWORK_DELAY_MS);
    });
  },
};
