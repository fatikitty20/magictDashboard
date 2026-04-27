export type ClientStatus = "active" | "inactive" | "risk";
export type ClientTier = "gold" | "silver" | "new";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: ClientStatus;
  tier: ClientTier;
  totalSpent: number;
  orders: number;
  averageTicket: number;
  growth: number;
  lastOrderAt: string;
  preferredChannel: string;
  tags: string[];
  notes: string;
}
