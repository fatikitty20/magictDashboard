import { withMockDelay } from "@/lib/mockService";
import { ordersData } from "../data/ordersData";
import type { Order } from "../types/order";

const NETWORK_DELAY_MS = 900;

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    return withMockDelay(() => [...ordersData], NETWORK_DELAY_MS);
  },
};
