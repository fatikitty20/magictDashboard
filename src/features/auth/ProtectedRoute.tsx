import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { RolUsuario } from "./roles";
import { useAuth } from "./useAuth";

interface RutaProtegidaProps {
  children: ReactNode;
  allowedRoles?: RolUsuario[];
}

export const RutaProtegida = ({
  children,
  allowedRoles,
}: RutaProtegidaProps) => {
  const ubicacion = useLocation();
  const { isAuthenticated, user, isHydrated, isCheckingAuth } = useAuth();

  // 🔥 1. Esperar estado global + validación backend
  if (!isHydrated || isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Cargando sesión...
      </div>
    );
  }

  // 🔐 2. No autenticado
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: ubicacion.pathname }}
      />
    );
  }

  // 🔒 3. Sin permisos
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
