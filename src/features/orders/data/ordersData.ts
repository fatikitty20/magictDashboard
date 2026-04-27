import type { Order } from "../types/order";

export const ordersData: Order[] = [
  {
    id: "ORD-101",
    customerName: "Jose Mendez",
    salesChannel: "Web",
    status: "completed",
    total: 132000,
    createdAt: "2026-04-27T08:20:00.000Z",
    items: [
      { sku: "SKU-CAFE-01", name: "Cafe tostado 1kg", quantity: 12 },
      { sku: "SKU-AZU-05", name: "Azucar 5kg", quantity: 8 },
      { sku: "SKU-TE-50", name: "Te en hebras 500g", quantity: 5 },
    ],
  },
  {
    id: "ORD-102",
    customerName: "Lucia Herrera",
    salesChannel: "App",
    status: "pending",
    total: 45600,
    createdAt: "2026-04-27T09:55:00.000Z",
    items: [
      { sku: "SKU-YERBA-1", name: "Yerba mate 1kg", quantity: 10 },
      { sku: "SKU-ENDUL-250", name: "Endulzante 250ml", quantity: 24 },
    ],
  },
  {
    id: "ORD-103",
    customerName: "Matias Rojas",
    salesChannel: "Marketplace",
    status: "cancelled",
    total: 89900,
    createdAt: "2026-04-27T11:12:00.000Z",
    items: [
      { sku: "SKU-GALLE-12", name: "Galletas surtidas x12", quantity: 18 },
      { sku: "SKU-BARRA-30", name: "Barra cereal x30", quantity: 12 },
    ],
  },
  {
    id: "ORD-104",
    customerName: "Paula Vega",
    salesChannel: "Web",
    status: "completed",
    total: 210500,
    createdAt: "2026-04-27T12:44:00.000Z",
    items: [
      { sku: "SKU-ARROZ-10", name: "Arroz largo fino 10kg", quantity: 9 },
      { sku: "SKU-ACEITE-5", name: "Aceite girasol 5L", quantity: 14 },
      { sku: "SKU-FIDEO-500", name: "Fideos secos 500g", quantity: 30 },
    ],
  },
  {
    id: "ORD-105",
    customerName: "Diego Arias",
    salesChannel: "App",
    status: "pending",
    total: 75900,
    createdAt: "2026-04-27T13:30:00.000Z",
    items: [
      { sku: "SKU-LATUN-170", name: "Atun en lata 170g", quantity: 40 },
      { sku: "SKU-MAYO-1", name: "Mayonesa 1L", quantity: 10 },
    ],
  },
  {
    id: "ORD-106",
    customerName: "Noelia Castro",
    salesChannel: "Web",
    status: "completed",
    total: 64200,
    createdAt: "2026-04-27T14:58:00.000Z",
    items: [
      { sku: "SKU-LECHE-12", name: "Leche larga vida x12", quantity: 15 },
      { sku: "SKU-AVENA-1", name: "Avena instantanea 1kg", quantity: 10 },
    ],
  },
  {
    id: "ORD-107",
    customerName: "Franco Diaz",
    salesChannel: "Marketplace",
    status: "completed",
    total: 174300,
    createdAt: "2026-04-27T16:05:00.000Z",
    items: [
      { sku: "SKU-DET-5", name: "Detergente 5L", quantity: 16 },
      { sku: "SKU-LIMPIA-2", name: "Limpiador multiuso 2L", quantity: 22 },
      { sku: "SKU-BLANQ-1", name: "Lavandina 1L", quantity: 30 },
    ],
  },
  {
    id: "ORD-108",
    customerName: "Micaela Perez",
    salesChannel: "App",
    status: "cancelled",
    total: 38900,
    createdAt: "2026-04-27T17:49:00.000Z",
    items: [
      { sku: "SKU-SNACK-24", name: "Snacks surtidos x24", quantity: 9 },
      { sku: "SKU-BEBIDA-6", name: "Bebida energetica x6", quantity: 12 },
    ],
  },
];
