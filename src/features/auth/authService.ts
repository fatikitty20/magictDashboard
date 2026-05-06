import { apiClient } from "@/shared/api/apiClient";
import { tokenManager } from "@/shared/api/tokenManager";

export interface CredencialesAutenticacion {
  email: string;
  password: string;
}

export type RolUsuario = "admin" | "client" | "ROLE_ANALYTICS" | "ROLE_USER";

export interface UsuarioAutenticado {
  correo: string;
  role: RolUsuario;
}

// Respuesta del backend
export interface RespuestaLoginApi {
  accessToken: string;
  refreshToken?: string;
  tokenType: "Bearer";
  expiresIn: number;
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

// ================= UTILIDADES PARA JWT =================

const extraerRolDelToken = (token: string): RolUsuario => {
  try {
    const partes = token.split(".");
    if (partes.length !== 3) throw new Error("Token inválido");
    
    const payload = JSON.parse(atob(partes[1]));
    const roles = payload.roles as string[];
    
    // Mapear roles del JWT a roles del sistema
    if (roles?.includes("ROLE_ADMIN")) return "admin";
    if (roles?.includes("ROLE_ANALYTICS")) return "admin"; // ANALYTICS acceso admin
    if (roles?.includes("ROLE_USER")) return "client";
    return "client"; // Por defecto
  } catch {
    return "client";
  }
};

const extraerEmailDelToken = (token: string): string => {
  try {
    const partes = token.split(".");
    if (partes.length !== 3) throw new Error("Token inválido");
    const payload = JSON.parse(atob(partes[1]));
    return payload.sub || "";
  } catch {
    return "";
  }
};

const construirSesionDesdeToken = (token: string): SesionAutenticacion => {
  const email = extraerEmailDelToken(token);
  const rol = extraerRolDelToken(token);
  const partes = token.split(".");
  const payload = JSON.parse(atob(partes[1]));
  
  return {
    correo: email,
    emitidaEn: (payload.iat || 0) * 1000,
    expiraEn: (payload.exp || 0) * 1000,
    token,
    proveedor: "api",
    usuario: {
      correo: email,
      role: rol,
    },
  };
};

const manejarErrorLogin = (error: unknown): never => {
  console.error("[Auth Error]", error);
  
  if (error instanceof Object && "message" in error && "status" in error) {
    const err = error as { message: string; status: number };
    
    // OWASP: No revelar si el usuario existe
    if (err.status === 401) {
      throw new Error("Email o contraseña inválidos");
    }
    if (err.status === 429) {
      throw new Error("Demasiados intentos. Intenta en unos minutos.");
    }
    if (err.status === 400) {
      throw new Error("Datos inválidos. Verifica email y contraseña.");
    }
    if (err.status >= 500) {
      throw new Error("Error del servidor. Intenta más tarde.");
    }
  }
  
  // Si es un Error normal, propagar su mensaje
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  
  throw new Error("Error al iniciar sesión. Intenta de nuevo.");
};

// ================= ADAPTADOR API REAL =================

const adaptadorAutenticacionApi: AdaptadorAutenticacion = {
  async iniciarSesion(credenciales) {
    try {
      const respuesta = await apiClient<RespuestaLoginApi>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credenciales),
        skipAuthHeader: true,
      });

      // Guardar tokens en token manager
      tokenManager.setTokens(
        respuesta.accessToken,
        respuesta.refreshToken,
        respuesta.expiresIn
      );

      return construirSesionDesdeToken(respuesta.accessToken);
    } catch (error) {
      manejarErrorLogin(error);
    }
  },

  async refrescarToken() {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const respuesta = await apiClient<RespuestaLoginApi>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        skipAuthHeader: true,
      });

      // Guardar nuevo access token
      tokenManager.setTokens(
        respuesta.accessToken,
        respuesta.refreshToken || refreshToken,
        respuesta.expiresIn
      );

      return construirSesionDesdeToken(respuesta.accessToken);
    } catch (error) {
      tokenManager.clearTokens();
      throw error;
    }
  },

  async cerrarSesion() {
    try {
      await apiClient("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignorar errores al cerrar sesión
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
      // Verificar si token expiró
      if (tokenManager.isTokenExpired()) {
        // Intentar refresh
        return await this.refrescarToken();
      }

      return construirSesionDesdeToken(token);
    } catch {
      tokenManager.clearTokens();
      return null;
    }
  },
};

// ================= API PUBLICA =================

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


