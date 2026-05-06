import {
  BarChart3,
  BookOpen,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  type LucideIcon,
  Settings,
  ShoppingBag,
  Smartphone,
  Store,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useDashboard } from "../../features/dashboard/hooks/useDashboard";
import type { DashboardMenuItem } from "../../features/dashboard/config/dashboardConfig";
import { claseBotonPrimario, claseTarjetaInvertida } from "@/shared/ui/estilosDashboard";

type MenuItem = DashboardMenuItem & {
  icon?: LucideIcon;
};

type GeneralItem = {
  icon: LucideIcon;
  key: string;
  label: string;
};

type BarraLateralProps = {
  mode: "desktop" | "mobile";
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: () => void;
  menuItems?: MenuItem[];
  generalItems?: GeneralItem[];
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
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dashboardConfig = useDashboard();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const elementosMenu: MenuItem[] = menuItems ?? dashboardConfig.menuItems;

  const elementosGenerales: GeneralItem[] = generalItems ?? [
    { key: "settings", icon: Settings, label: t("sidebar.general.settings") },
    { key: "help", icon: HelpCircle, label: t("sidebar.general.helpCenter") },
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
    await signOut();
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

  const toggleHelpCenter = () => {
    setIsHelpOpen((current) => !current);
  };

  const contenidoSidebar = (
    <>
      <div className="mb-8 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Store className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Magictronic PSP</span>
        </div>
        {mode === "mobile" && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t("sidebar.actions.close")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="mb-3 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {t("sidebar.menuLabel")}
      </p>

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
            <span className="flex h-4 w-4 items-center justify-center">
              {(() => {
                const Icon = elemento.icon ?? iconByKey[elemento.key] ?? LayoutDashboard;
                return <Icon className="h-4 w-4" />;
              })()}
            </span>
            <span className="flex-1 text-left">{t(elemento.label)}</span>
            {elemento.badge && (
              <span className="rounded bg-info/10 px-1.5 py-0.5 text-[10px] text-info">
                {elemento.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <p className="mb-3 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {t("sidebar.generalLabel")}
      </p>

      <nav className="flex-1 space-y-1">
        {elementosGenerales.map((elemento) => (
          <button
            key={elemento.key}
            type="button"
            onClick={elemento.key === "help" ? toggleHelpCenter : undefined}
            aria-expanded={elemento.key === "help" ? isHelpOpen : undefined}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
          >
            <elemento.icon className="h-4 w-4" />
            <span>{elemento.label}</span>
          </button>
        ))}

        {isHelpOpen && (
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t("sidebar.helpCenter.title")}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t("sidebar.helpCenter.description")}
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="rounded-lg bg-muted/70 p-3">
                <p className="font-medium text-foreground">{t("sidebar.helpCenter.support.title")}</p>
                <p className="mt-1 leading-5">{t("sidebar.helpCenter.support.description")}</p>
              </div>

              <div className="grid gap-2">
                <a
                  href="mailto:support@magictronic.com"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-foreground transition hover:bg-muted"
                >
                  <Mail className="h-4 w-4" />
                  <span>{t("sidebar.helpCenter.actions.email")}</span>
                </a>
                <a
                  href="https://magictronic.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-foreground transition hover:bg-muted"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{t("sidebar.helpCenter.actions.docs")}</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/70 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("sidebar.helpCenter.meta.hoursLabel")}
                  </p>
                  <p className="mt-1 text-foreground">{t("sidebar.helpCenter.meta.hours")}</p>
                </div>
                <div className="rounded-lg bg-muted/70 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t("sidebar.helpCenter.meta.responseLabel")}
                  </p>
                  <p className="mt-1 text-foreground">{t("sidebar.helpCenter.meta.responseTime")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTÓN LOGOUT */}
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
        <p className="mb-1 text-sm font-semibold text-dashboard-inverted-foreground">
          {t("sidebar.mobileCard.title")}
        </p>
        <p className="mb-3 text-[10px] text-dashboard-inverted-foreground/60">
          {t("sidebar.mobileCard.description")}
        </p>
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
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        className={`relative flex h-full w-72 flex-col bg-sidebar p-5 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {contenidoSidebar}
      </aside>
    </div>
  );
};
