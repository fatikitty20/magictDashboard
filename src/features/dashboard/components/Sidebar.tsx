import {
  BarChart3,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Smartphone,
  Store,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAutenticacion } from "@/features/auth/useAuth";
import { claseBotonPrimario, claseTarjetaInvertida } from "../estilosDashboard";

const elementosMenu = [
  { icon: LayoutDashboard, label: "Panel", path: "/dashboard" },
  { icon: CreditCard, label: "Pagos", path: "/payments", badge: "10" },
  { icon: ShoppingBag, label: "Pedidos", path: "/orders", badge: "8" },
  { icon: BarChart3, label: "Reportes", path: "/reports" },
  { icon: Users, label: "Clientes", path: "/clients" },
];

const elementosGenerales = [
  { icon: Settings, label: "Configuracion" },
  { icon: HelpCircle, label: "Ayuda" },
];

export const BarraLateral = () => {
  const { cerrarSesion } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();

  const manejarCierreSesion = async () => {
    await cerrarSesion();
    navigate("/login", { replace: true });
  };

  const manejarNavegacion = (path?: string) => {
    if (!path) {
      return;
    }

    navigate(path);
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">Tiendanube</span>
      </div>

      <p className="mb-3 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">Menu</p>
      <nav className="mb-6 space-y-1">
        {elementosMenu.map((elemento) => (
          <button
            key={elemento.label}
            type="button"
            onClick={() => manejarNavegacion(elemento.path)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              elemento.path && location.pathname.startsWith(elemento.path)
                ? "border-l-2 border-primary bg-secondary font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <elemento.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{elemento.label}</span>
            {elemento.badge ? (
              <span className="rounded bg-info/10 px-1.5 py-0.5 text-[10px] text-info">{elemento.badge}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <p className="mb-3 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">General</p>
      <nav className="flex-1 space-y-1">
        {elementosGenerales.map((elemento) => (
          <button
            key={elemento.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
          >
            <elemento.icon className="h-4 w-4" />
            <span>{elemento.label}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={manejarCierreSesion}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesion</span>
        </button>
      </nav>

      <div className={claseTarjetaInvertida("relative mt-4 overflow-hidden p-4")}>
        <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-success/20" />
        <Smartphone className="mb-2 h-6 w-6 text-success" />
        <p className="mb-1 text-sm font-semibold text-dashboard-inverted-foreground">App Tiendanube movil</p>
        <p className="mb-3 text-[10px] text-dashboard-inverted-foreground/60">Gestiona desde el celular</p>
        <button
          type="button"
          className={claseBotonPrimario("h-8 w-full rounded-md text-xs hover:brightness-95")}
        >
          Descargar
        </button>
      </div>
    </aside>
  );
};
