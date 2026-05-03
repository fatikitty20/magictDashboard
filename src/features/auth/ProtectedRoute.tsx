import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { RolUsuario } from "./roles";
import { useAutenticacion } from "./useAuth";

interface RutaProtegidaProps {
  children: ReactNode;
  allowedRoles?: RolUsuario[];
}

export const RutaProtegida = ({ children, allowedRoles }: RutaProtegidaProps) => {
  const ubicacion = useLocation();
  const { estaAutenticado, user } = useAutenticacion();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ from: ubicacion.pathname }} />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
