import type { ReportDataset } from "../types/report";

export const reportsData: ReportDataset[] = [
  {
    id: "7d",
    label: "Ultimos 7 dias",
    summary: {
      revenue: 1284300,
      orders: 324,
      visitors: 8420,
      refunds: 18,
      averageTicket: 3964,
      conversionRate: 3.85,
      growth: 12.4,
    },
    daily: [
      { label: "Lun", revenue: 142000, orders: 38, visitors: 1040, refunds: 2 },
      { label: "Mar", revenue: 168500, orders: 42, visitors: 1120, refunds: 1 },
      { label: "Mie", revenue: 191200, orders: 51, visitors: 1260, refunds: 4 },
      { label: "Jue", revenue: 176400, orders: 45, visitors: 1180, refunds: 2 },
      { label: "Vie", revenue: 230800, orders: 62, visitors: 1510, refunds: 3 },
      { label: "Sab", revenue: 219500, orders: 56, visitors: 1330, refunds: 5 },
      { label: "Dom", revenue: 155900, orders: 30, visitors: 980, refunds: 1 },
    ],
    channels: [
      { channel: "Web", revenue: 553200, orders: 132, conversionRate: 4.1, share: 43 },
      { channel: "App", revenue: 412700, orders: 109, conversionRate: 3.9, share: 32 },
      { channel: "Marketplace", revenue: 318400, orders: 83, conversionRate: 3.4, share: 25 },
    ],
    products: [
      { sku: "SKU-ARROZ-10", name: "Arroz largo fino 10kg", channel: "Web", unitsSold: 86, revenue: 245100, refundRate: 1.2 },
      { sku: "SKU-ACEITE-5", name: "Aceite girasol 5L", channel: "App", unitsSold: 74, revenue: 198400, refundRate: 0.8 },
      { sku: "SKU-GALLE-12", name: "Galletas surtidas x12", channel: "Marketplace", unitsSold: 69, revenue: 152900, refundRate: 2.1 },
      { sku: "SKU-CAFE-01", name: "Cafe tostado 1kg", channel: "Web", unitsSold: 52, revenue: 132000, refundRate: 0.6 },
      { sku: "SKU-LATUN-170", name: "Atun en lata 170g", channel: "App", unitsSold: 46, revenue: 109500, refundRate: 1.5 },
    ],
  },
  {
    id: "30d",
    label: "Ultimos 30 dias",
    summary: {
      revenue: 4829000,
      orders: 1284,
      visitors: 31240,
      refunds: 74,
      averageTicket: 3761,
      conversionRate: 4.11,
      growth: 18.2,
    },
    daily: [
      { label: "Sem 1", revenue: 956000, orders: 246, visitors: 6540, refunds: 13 },
      { label: "Sem 2", revenue: 1124500, orders: 292, visitors: 7180, refunds: 18 },
      { label: "Sem 3", revenue: 1297300, orders: 341, visitors: 8010, refunds: 21 },
      { label: "Sem 4", revenue: 1451200, orders: 405, visitors: 9510, refunds: 22 },
    ],
    channels: [
      { channel: "Web", revenue: 2173000, orders: 536, conversionRate: 4.5, share: 45 },
      { channel: "App", revenue: 1547000, orders: 428, conversionRate: 4.2, share: 32 },
      { channel: "Marketplace", revenue: 1109000, orders: 320, conversionRate: 3.5, share: 23 },
    ],
    products: [
      { sku: "SKU-ARROZ-10", name: "Arroz largo fino 10kg", channel: "Web", unitsSold: 348, revenue: 921000, refundRate: 1.4 },
      { sku: "SKU-ACEITE-5", name: "Aceite girasol 5L", channel: "App", unitsSold: 304, revenue: 805000, refundRate: 0.9 },
      { sku: "SKU-DET-5", name: "Detergente 5L", channel: "Marketplace", unitsSold: 266, revenue: 625500, refundRate: 1.8 },
      { sku: "SKU-CAFE-01", name: "Cafe tostado 1kg", channel: "Web", unitsSold: 238, revenue: 594000, refundRate: 0.7 },
      { sku: "SKU-BEBIDA-6", name: "Bebida energetica x6", channel: "App", unitsSold: 205, revenue: 463500, refundRate: 2.3 },
    ],
  },
  {
    id: "90d",
    label: "Ultimos 90 dias",
    summary: {
      revenue: 13964200,
      orders: 3726,
      visitors: 96480,
      refunds: 219,
      averageTicket: 3748,
      conversionRate: 3.86,
      growth: 24.7,
    },
    daily: [
      { label: "Ene", revenue: 3920200, orders: 1042, visitors: 28500, refunds: 63 },
      { label: "Feb", revenue: 4516000, orders: 1198, visitors: 31540, refunds: 72 },
      { label: "Mar", revenue: 5528000, orders: 1486, visitors: 36440, refunds: 84 },
    ],
    channels: [
      { channel: "Web", revenue: 6429000, orders: 1662, conversionRate: 4.2, share: 46 },
      { channel: "App", revenue: 4338800, orders: 1211, conversionRate: 3.9, share: 31 },
      { channel: "Marketplace", revenue: 3196400, orders: 853, conversionRate: 3.1, share: 23 },
    ],
    products: [
      { sku: "SKU-ARROZ-10", name: "Arroz largo fino 10kg", channel: "Web", unitsSold: 976, revenue: 2664000, refundRate: 1.5 },
      { sku: "SKU-ACEITE-5", name: "Aceite girasol 5L", channel: "App", unitsSold: 821, revenue: 2142000, refundRate: 1.1 },
      { sku: "SKU-DET-5", name: "Detergente 5L", channel: "Marketplace", unitsSold: 728, revenue: 1768500, refundRate: 1.9 },
      { sku: "SKU-FIDEO-500", name: "Fideos secos 500g", channel: "Web", unitsSold: 694, revenue: 1423300, refundRate: 0.8 },
      { sku: "SKU-GALLE-12", name: "Galletas surtidas x12", channel: "Marketplace", unitsSold: 641, revenue: 1219800, refundRate: 2.4 },
    ],
  },
];
