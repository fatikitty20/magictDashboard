import { Bell, Mail, Menu, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BotonTema } from "@/features/theme/components/ThemeToggle";
import { SelectorIdioma } from "@/features/i18n/components/SelectorIdioma";
import { useAuth } from "@/features/auth/useAuth";
import { claseBotonIcono } from "../estilosDashboard";

type BarraSuperiorProps = {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
};

export const BarraSuperior = ({ isSidebarOpen, onMenuClick }: BarraSuperiorProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const userName = user?.correo?.split("@")[0] ?? "User";
  const displayName = isAdmin ? `${userName} (Admin)` : userName;

  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-border bg-background px-4 py-5 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-controls="dashboard-sidebar-mobile"
        aria-expanded={isSidebarOpen}
        aria-label={isSidebarOpen ? t("topbar.actions.closeSidebar") : t("topbar.actions.openSidebar")}
        className={claseBotonIcono("h-10 w-10 bg-muted lg:hidden")}
      >
        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <div className="relative min-w-64 flex-1 lg:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("topbar.searchPlaceholder")}
          className="h-10 w-full rounded-lg bg-muted pl-9 pr-16 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
          Ctrl K
        </kbd>
      </div>

      <SelectorIdioma />
      <BotonTema />

      <button
        type="button"
        aria-label={t("topbar.actions.messages")}
        className={claseBotonIcono("h-10 w-10 bg-muted")}
      >
        <Mail className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={t("topbar.actions.notifications")}
        className={claseBotonIcono("h-10 w-10 bg-muted")}
      >
        <Bell className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 border-l border-border pl-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
          isAdmin ? "bg-destructive text-destructive-foreground" : "bg-info text-info-foreground"
        }`}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{displayName}</p>
          <p className="text-[11px] text-muted-foreground">{isAdmin ? t("topbar.admin.role") : t("topbar.client.role")}</p>
        </div>
      </div>
    </header>
  );
};
