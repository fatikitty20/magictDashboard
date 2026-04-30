import { CircleAlert, CircleCheckBig, CircleDashed, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { claseTarjeta, claseTonoSuave } from "../../dashboard/estilosDashboard";

type PaymentsStatsProps = {
  totalRevenue: number;
  paidCount: number;
  pendingCount: number;
  rejectedCount: number;
  currency?: string;
  locale?: string;
};

export const PaymentsStats = ({ totalRevenue, paidCount, pendingCount, rejectedCount, currency, locale }: PaymentsStatsProps) => {
  const { t } = useTranslation();
  const usedLocale = locale ?? (typeof navigator !== "undefined" ? navigator.language ?? "es-MX" : "es-MX");
  const usedCurrency = currency ?? "MXN";

  const currencyFormatter = new Intl.NumberFormat(usedLocale, {
    style: "currency",
    currency: usedCurrency,
    maximumFractionDigits: 0,
  });

  const items = [
    {
      title: t("payments.stats.totalRevenue.title"),
      value: currencyFormatter.format(totalRevenue),
      helper: t("payments.stats.totalRevenue.helper"),
      icon: Wallet,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: t("payments.stats.paid.title"),
      value: paidCount.toString(),
      helper: t("payments.stats.paid.helper"),
      icon: CircleCheckBig,
      toneClass: claseTonoSuave("success", "h-9 w-9"),
    },
    {
      title: t("payments.stats.pending.title"),
      value: pendingCount.toString(),
      helper: t("payments.stats.pending.helper"),
      icon: CircleDashed,
      toneClass:
        "flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
    },
    {
      title: t("payments.stats.rejected.title"),
      value: rejectedCount.toString(),
      helper: t("payments.stats.rejected.helper"),
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
