import { useCallback } from "react";
import { useAuthStore } from "./store/authStore";
import {
  servicioAutenticacion,
  type CredencialesAutenticacion,
} from "./authService";

export const useAuth = () => {
  const sesion = useAuthStore((s) => s.sesion);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setSesion = useAuthStore((s) => s.setSesion);
  const clearSesion = useAuthStore((s) => s.clearSesion);

  const signIn = useCallback(async (credenciales: CredencialesAutenticacion) => {
    const nuevaSesion = await servicioAutenticacion.iniciarSesion(credenciales);
    setSesion(nuevaSesion);
    return nuevaSesion;
  }, [setSesion]);

  const signOut = useCallback(async () => {
    await servicioAutenticacion.cerrarSesion();
    clearSesion();
  }, [clearSesion]);

  return {
    sesion,
    user: sesion?.usuario ?? null,
    isAuthenticated: Boolean(sesion),
    isHydrated,
    signIn,
    signOut,
  };
};