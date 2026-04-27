export type OrderStatus = "completed" | "pending" | "cancelled";

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
}

export interface ShippingAddress {
  recipient: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  reference: string;
}

export interface PaymentSnapshot {
  method: string;
  transactionId: string;
  authorizationCode: string;
  installments: number;
  cardLast4: string;
}

export interface RiskSnapshot {
  score: number;
  level: "low" | "medium" | "high";
  reason: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerDocument: string;
  salesChannel: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  estimatedDeliveryAt: string;
  shippingAddress: ShippingAddress;
  payment: PaymentSnapshot;
  risk: RiskSnapshot;
  internalNote: string;
  items: OrderItem[];
}
