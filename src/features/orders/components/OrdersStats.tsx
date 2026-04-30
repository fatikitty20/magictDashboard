import { CircleAlert, CircleCheckBig, CircleDashed, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { claseTarjeta, claseTonoSuave } from "@/features/dashboard/estilosDashboard";

type OrdersStatsProps = {
  totalOrders: number;
  completedCount: number;
  pendingCount: number;
  cancelledCount: number;
};

export const OrdersStats = ({ totalOrders, completedCount, pendingCount, cancelledCount }: OrdersStatsProps) => {
  const { t } = useTranslation();
  const items = [
    {
      title: t("orders.stats.total.title"),
      value: totalOrders.toString(),
      helper: t("orders.stats.total.helper"),
      icon: ShoppingBag,
      toneClass: claseTonoSuave("info", "h-9 w-9"),
    },
    {
      title: t("orders.stats.completed.title"),
      value: completedCount.toString(),
      helper: t("orders.stats.completed.helper"),
      icon: CircleCheckBig,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: t("orders.stats.pending.title"),
      value: pendingCount.toString(),
      helper: t("orders.stats.pending.helper"),
      icon: CircleDashed,
      toneClass:
        "flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
    },
    {
      title: t("orders.stats.cancelled.title"),
      value: cancelledCount.toString(),
      helper: t("orders.stats.cancelled.helper"),
      icon: CircleAlert,
      toneClass: claseTonoSuave("destructive", "h-9 w-9"),
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article key={item.title} className={claseTarjeta("base", "p-5")}>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{item.title}</p>
            <span className={item.toneClass}>
              <item.icon className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
        </article>
      ))}
    </section>
  );
};
