import { apiClient } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/apiConfig";
import { tokenManager } from "@/shared/api/tokenManager";
import type { RolUsuario } from "./roles";

export interface CredencialesAutenticacion {
  email: string;
  password: string;
}

export interface UsuarioAutenticado {
  correo: string;
  role: RolUsuario;
}

export interface RespuestaLoginApi {
  accessToken: string;
  refreshToken?: string;
  tokenType?: "Bearer" | string;
  expiresIn?: number;
}

export interface SesionAutenticacion {
  correo: string;
  emitidaEn: number;
  expiraEn: number;
  token: string;
  proveedor: "api";
  usuario: UsuarioAutenticado;
}

interface AdaptadorAutenticacion {
  iniciarSesion(credenciales: CredencialesAutenticacion): Promise<SesionAutenticacion>;
  refrescarToken(): Promise<SesionAutenticacion>;
  cerrarSesion(): Promise<void>;
  obtenerSesion(): Promise<SesionAutenticacion | null>;
}

type JwtPayload = {
  sub?: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

type ErrorApi = {
  message: string;
  status: number;
};

const normalizarBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = base64.length % 4;
  return padding ? `${base64}${"=".repeat(4 - padding)}` : base64;
};

const decodificarJwtPayload = (token: string): JwtPayload => {
  const partes = token.split(".");

  if (partes.length !== 3) {
    throw new Error("Token invalido");
  }

  return JSON.parse(atob(normalizarBase64Url(partes[1]))) as JwtPayload;
};

const extraerRolesDelPayload = (payload: JwtPayload): string[] => [
  ...(payload.roles ?? []),
  ...(payload.authorities ?? []),
  ...(payload.scope?.split(" ") ?? []),
  ...(payload.role ? [payload.role] : []),
];

const extraerRolDelPayload = (payload: JwtPayload): RolUsuario => {
  const roles = extraerRolesDelPayload(payload);

  if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_ANALYTICS")) {
    return "admin";
  }

  return "client";
};

const construirSesionDesdeToken = (token: string): SesionAutenticacion => {
  const payload = decodificarJwtPayload(token);
  const correo = payload.sub ?? "";

  return {
    correo,
    emitidaEn: (payload.iat ?? 0) * 1000,
    expiraEn: (payload.exp ?? 0) * 1000,
    token,
    proveedor: "api",
    usuario: {
      correo,
      role: extraerRolDelPayload(payload),
    },
  };
};

const esErrorApi = (error: unknown): error is ErrorApi =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  "status" in error &&
  typeof error.message === "string" &&
  typeof error.status === "number";

const manejarErrorLogin = (error: unknown): never => {
  if (esErrorApi(error)) {
    if (error.status === 400) {
      throw new Error("Datos invalidos. Verifica email y contrasena.");
    }

    if (error.status === 401) {
      throw new Error("Email o contrasena invalidos.");
    }

    if (error.status === 403) {
      throw new Error("No tienes permiso para iniciar sesion con estas credenciales.");
    }

    if (error.status === 429) {
      throw new Error("Demasiados intentos. Intenta en unos minutos.");
    }

    if (error.status >= 500) {
      throw new Error("Error del servidor. Intenta mas tarde.");
    }
  }

  if (error instanceof Error) {
    throw new Error(error.message);
  }

  throw new Error("Error al iniciar sesion. Intenta de nuevo.");
};

const validarRespuestaLogin = (respuesta: RespuestaLoginApi): void => {
  if (!respuesta.accessToken) {
    throw new Error("El backend no devolvio accessToken.");
  }
};

const adaptadorAutenticacionApi: AdaptadorAutenticacion = {
  async iniciarSesion(credenciales) {
    try {
      const respuesta = await apiClient<RespuestaLoginApi>(API_ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify({
          email: credenciales.email.trim(),
          password: credenciales.password,
        }),
        skipAuthHeader: true,
      });

      validarRespuestaLogin(respuesta);
      tokenManager.setTokens(respuesta.accessToken, respuesta.refreshToken, respuesta.expiresIn);

      return construirSesionDesdeToken(respuesta.accessToken);
    } catch (error) {
      return manejarErrorLogin(error);
    }
  },

  async refrescarToken() {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const respuesta = await apiClient<RespuestaLoginApi>(API_ENDPOINTS.auth.refresh, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        skipAuthHeader: true,
      });

      validarRespuestaLogin(respuesta);
      tokenManager.setTokens(respuesta.accessToken, respuesta.refreshToken ?? refreshToken, respuesta.expiresIn);

      return construirSesionDesdeToken(respuesta.accessToken);
    } catch (error) {
      tokenManager.clearTokens();
      throw error;
    }
  },

  async cerrarSesion() {
    try {
      await apiClient(API_ENDPOINTS.auth.logout, {
        method: "POST",
      });
    } catch {
      // El cierre de sesion local debe completarse aunque backend no responda.
    } finally {
      tokenManager.clearTokens();
    }
  },

  async obtenerSesion() {
    const token = tokenManager.getToken();

    if (!token) {
      return null;
    }

    try {
      if (tokenManager.isTokenExpired()) {
        return await this.refrescarToken();
      }

      return construirSesionDesdeToken(token);
    } catch {
      tokenManager.clearTokens();
      return null;
    }
  },
};

export const servicioAutenticacion = {
  iniciarSesion(credenciales: CredencialesAutenticacion) {
    return adaptadorAutenticacionApi.iniciarSesion(credenciales);
  },

  refrescarToken() {
    return adaptadorAutenticacionApi.refrescarToken();
  },

  cerrarSesion() {
    return adaptadorAutenticacionApi.cerrarSesion();
  },

  obtenerSesion() {
    return adaptadorAutenticacionApi.obtenerSesion();
  },

  async estaAutenticado() {
    const sesion = await adaptadorAutenticacionApi.obtenerSesion();
    return sesion !== null;
  },
};
