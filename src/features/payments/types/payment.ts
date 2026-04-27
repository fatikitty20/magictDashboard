export type PaymentStatus = "paid" | "pending" | "rejected";

export interface Payment {
  id: string;
  customerName: string;
  paymentMethod: string;
  status: PaymentStatus;
  total: number;
  createdAt: string;
}
