import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { RolUsuario } from "./roles";
import { useAuth } from "./useAuth";

interface RutaProtegidaProps {
  children: ReactNode;
  allowedRoles?: RolUsuario[];
}

export const RutaProtegida = ({ children, allowedRoles }: RutaProtegidaProps) => {
  const ubicacion = useLocation();
  const { isAuthenticated, user, isHydrated } = useAuth();

  // 🔥 CLAVE: esperar hydration
  if (!isHydrated) {
    return null; // o loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: ubicacion.pathname }} />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
