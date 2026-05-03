import {
  BarChart3,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Settings,
  ShoppingBag,
  Smartphone,
  Store,
  X,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAutenticacion } from "@/features/auth";
import { useDashboard } from "../hooks/useDashboard";
import type { DashboardMenuItem } from "../config/dashboardConfig";
import { claseBotonPrimario, claseTarjetaInvertida } from "../estilosDashboard";

type MenuItem = {
  icon?: LucideIcon;
  key: string;
  label: string;
  path?: string;
  badge?: string;
};

type BarraLateralProps = {
  mode: "desktop" | "mobile";
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
  menuItems?: MenuItem[];
  generalItems?: MenuItem[];
};

const iconByKey: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  payments: CreditCard,
  orders: ShoppingBag,
  reports: BarChart3,
  clients: Users,
};

export const BarraLateral = ({
  mode,
  isOpen = false,
  onClose,
  onNavigate,
  menuItems,
  generalItems,
}: BarraLateralProps) => {
  const { cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dashboardConfig = useDashboard();

  const elementosMenu: MenuItem[] = menuItems ?? dashboardConfig.menuItems;

  const elementosGenerales: MenuItem[] = generalItems ?? [
    { icon: Settings, label: t("sidebar.general.settings") },
    { icon: HelpCircle, label: t("sidebar.general.help") },
  ];

  useEffect(() => {
    if (mode !== "mobile" || !isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, mode, onClose]);

  const manejarCierreSesion = async () => {
    await cerrarSesion();
    navigate("/login", { replace: true });
    onClose?.();
  };

  const manejarNavegacion = (path?: string) => {
    if (!path) {
      return;
    }

    navigate(path);
    onNavigate?.();
  };

  const contenidoSidebar = (
    <>
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">PSP</span>
      </div>

      <p className="mb-3 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">{t("sidebar.menuLabel")}</p>
      <nav className="mb-6 space-y-1">
        {elementosMenu.map((elemento) => (
          <button
            key={elemento.key}
            type="button"
            onClick={() => manejarNavegacion(elemento.path)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              elemento.path && location.pathname.startsWith(elemento.path)
                ? "border-l-2 border-primary bg-secondary font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {(elemento.icon ?? iconByKey[elemento.key] ?? LayoutDashboard) && (
              <span className="flex h-4 w-4 items-center justify-center">
                {(() => {
                  const Icon = elemento.icon ?? iconByKey[elemento.key] ?? LayoutDashboard;
                  return <Icon className="h-4 w-4" />;
                })()}
              </span>
            )}
            <span className="flex-1 text-left">{t(elemento.label)}</span>
            {elemento.badge ? (
              <span className="rounded bg-info/10 px-1.5 py-0.5 text-[10px] text-info">{elemento.badge}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <p className="mb-3 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">{t("sidebar.generalLabel")}</p>
      <nav className="flex-1 space-y-1">
        {elementosGenerales.map((elemento) => (
          <button
            key={elemento.key}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
          >
            {elemento.icon ? <elemento.icon className="h-4 w-4" /> : null}
            <span>{elemento.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={manejarCierreSesion}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("sidebar.logout")}</span>
        </button>
      </nav>

      <div className={claseTarjetaInvertida("relative mt-4 overflow-hidden p-4")}>
        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-success/20" />
        <Smartphone className="mb-2 h-6 w-6 text-success" />
        <p className="mb-1 text-sm font-semibold text-dashboard-inverted-foreground">{t("sidebar.mobileCard.title")}</p>
        <p className="mb-3 text-[10px] text-dashboard-inverted-foreground/60">{t("sidebar.mobileCard.description")}</p>
        <button
          type="button"
          className={claseBotonPrimario("h-8 w-full rounded-md text-xs hover:brightness-95")}
        >
          {t("sidebar.mobileCard.download")}
        </button>
      </div>
    </>
  );

  if (mode === "desktop") {
    return (
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        {contenidoSidebar}
      </aside>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <button
        type="button"
        aria-label={t("sidebar.actions.close")}
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        id="dashboard-sidebar-mobile"
        role="dialog"
        aria-modal="true"
        aria-label={t("sidebar.menuLabel")}
        className={`relative flex h-full w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar p-5 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">PSP</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("sidebar.actions.close")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {contenidoSidebar}
      </aside>
    </div>
  );
};
