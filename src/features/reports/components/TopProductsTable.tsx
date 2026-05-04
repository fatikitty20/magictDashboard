import { claseTarjeta } from "@/shared/ui/estilosDashboard";
import type { RolUsuario } from "@/features/auth/roles";
import { useTranslation } from "react-i18next";
import type { ProductReport } from "../types/report";

type TopProductsTableProps = {
  role: RolUsuario;
  products: ProductReport[];
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const TopProductsTable = ({ role, products }: TopProductsTableProps) => {
  const { t } = useTranslation();
  const isAdmin = role === "admin";

  return (
    <section className={claseTarjeta("base", "overflow-hidden")}>
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t(isAdmin ? "reports.roleContent.admin.topProducts.title" : "reports.roleContent.client.topProducts.title")}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t(
            isAdmin
              ? "reports.roleContent.admin.topProducts.description"
              : "reports.roleContent.client.topProducts.description",
          )}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">{t("reports.topProducts.headers.sku")}</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">{t("reports.topProducts.headers.product")}</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">{t("reports.topProducts.headers.channel")}</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">{t("reports.topProducts.headers.units")}</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">{t("reports.topProducts.headers.revenue")}</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">{t("reports.topProducts.headers.refunds")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.sku} className="transition hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{product.sku}</td>
                <td className="px-4 py-3 text-muted-foreground">{product.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{product.channel}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{product.unitsSold}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {currencyFormatter.format(product.revenue)}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">{product.refundRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          {t("reports.topProducts.emptyState")}
        </div>
      ) : null}
    </section>
  );
};
