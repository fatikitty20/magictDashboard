import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAutenticacion } from "./useAuth";

export const RutaProtegida = ({ children }: { children: ReactNode }) => {
  const ubicacion = useLocation();
  const { estaAutenticado } = useAutenticacion();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ from: ubicacion.pathname }} />;
  }

  return <>{children}</>;
};
