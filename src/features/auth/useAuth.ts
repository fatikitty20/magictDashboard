import { useCallback, useState } from "react";
import {
  servicioAutenticacion,
  type CredencialesAutenticacion,
  type SesionAutenticacion,
} from "./authService";

export const useAutenticacion = () => {
  const [sesion, setSesion] = useState<SesionAutenticacion | null>(() => servicioAutenticacion.obtenerSesion());

  const iniciarSesion = useCallback(async (credenciales: CredencialesAutenticacion) => {
    const siguienteSesion = await servicioAutenticacion.iniciarSesion(credenciales);
    setSesion(siguienteSesion);
    return siguienteSesion;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await servicioAutenticacion.cerrarSesion();
    setSesion(null);
  }, []);

  return {
    sesion,
    user: sesion?.usuario ?? null,
    estaAutenticado: Boolean(sesion),
    iniciarSesion,
    cerrarSesion,
  };
};

export const useAuth = () => {
  const { user, estaAutenticado, iniciarSesion, cerrarSesion } = useAutenticacion();

  return {
    user,
    isAuthenticated: estaAutenticado,
    signIn: iniciarSesion,
    signOut: cerrarSesion,
  };
};
