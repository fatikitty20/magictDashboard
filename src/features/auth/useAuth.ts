import { useCallback, useEffect, useState } from "react";
import {
  servicioAutenticacion,
  type CredencialesAutenticacion,
  type SesionAutenticacion,
} from "./authService";

export const useAutenticacion = () => {
  const [sesion, setSesion] = useState<SesionAutenticacion | null>(() => servicioAutenticacion.obtenerSesion());

  useEffect(() => {
    const manejarStorage = () => setSesion(servicioAutenticacion.obtenerSesion());

    window.addEventListener("storage", manejarStorage);
    return () => window.removeEventListener("storage", manejarStorage);
  }, []);

  const iniciarSesion = useCallback(async (credenciales: CredencialesAutenticacion) => {
    const siguienteSesion = await servicioAutenticacion.iniciarSesion(credenciales);
    setSesion(siguienteSesion);
    return siguienteSesion;
  }, []);

  const cerrarSesion = useCallback(async () => {
    await servicioAutenticacion.cerrarSesion();
    setSesion(null);
  }, []);

  return { sesion, estaAutenticado: Boolean(sesion), iniciarSesion, cerrarSesion };
};
