export type OrderStatus = "completed" | "pending" | "cancelled";

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  salesChannel: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
}
