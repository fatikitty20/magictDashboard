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
  permisos?: string[];
}

type BackendUser = {
  email?: string;
  correo?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  permisos?: string[];
};

export interface RespuestaLoginApi {
  accessToken: string;
  refreshToken?: string;
  tokenType?: "Bearer" | string;
  expiresIn?: number;
  role?: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  permissions?: string[];
  permisos?: string[];
  user?: BackendUser;
  usuario?: BackendUser;
}

export interface SesionAutenticacion {
  correo: string;
  emitidaEn: number;
  expiraEn: number;
  token: string;
  proveedor: "api";
  usuario: UsuarioAutenticado;
}

type JwtPayload = {
  sub?: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  role?: string;
  permissions?: string[];
  permisos?: string[];
  iat?: number;
  exp?: number;
};

type ErrorApi = {
  message: string;
  status: number;
};

type LoginErrorKey =
  | "login.errors.backendOffline"
  | "login.errors.invalidData"
  | "login.errors.unauthorized"
  | "login.errors.forbidden"
  | "login.errors.tooManyAttempts"
  | "login.errors.serverError"
  | "login.errors.connectionFailed"
  | "login.errors.generic"
  | "login.errors.missingToken";

type TranslationFunction = (key: LoginErrorKey) => string;

const ROLES_ADMIN = new Set(["ADMIN", "ANALYTICS", "ROLE_ADMIN", "ROLE_ANALYTICS"]);
const ROLES_CLIENTE = new Set(["CLIENT", "USER", "MERCHANT", "ROLE_CLIENT", "ROLE_USER", "ROLE_MERCHANT"]);

const mensajesLogin: Record<LoginErrorKey, string> = {
  "login.errors.backendOffline": "El backend de autenticacion esta offline. Revisa que el tunel de ngrok este activo.",
  "login.errors.invalidData": "Datos invalidos. Verifica email y contrasena.",
  "login.errors.unauthorized": "Email o contrasena invalidos.",
  "login.errors.forbidden": "No tienes permiso para iniciar sesion con estas credenciales.",
  "login.errors.tooManyAttempts": "Demasiados intentos. Intenta en unos minutos.",
  "login.errors.serverError": "Error del servidor. Intenta mas tarde.",
  "login.errors.connectionFailed": "No pudimos conectar con el backend de autenticacion. Revisa que el tunel de ngrok este activo.",
  "login.errors.generic": "Error al iniciar sesion. Intenta de nuevo.",
  "login.errors.missingToken": "El backend no devolvio accessToken.",
};

const tFallback: TranslationFunction = (key) => mensajesLogin[key];

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

const normalizarRol = (role: string): string => role.trim().toUpperCase();
const dividirScope = (scope?: string): string[] => scope?.split(" ").filter(Boolean) ?? [];

const rolesDesdeJwt = (payload: JwtPayload): string[] => [
  ...(payload.roles ?? []),
  ...(payload.authorities ?? []),
  ...dividirScope(payload.scope),
  ...(payload.role ? [payload.role] : []),
];

const rolesDesdeRespuesta = (respuesta?: RespuestaLoginApi): string[] => [
  ...(respuesta?.roles ?? []),
  ...(respuesta?.authorities ?? []),
  ...dividirScope(respuesta?.scope),
  ...(respuesta?.role ? [respuesta.role] : []),
  ...(respuesta?.user?.roles ?? []),
  ...(respuesta?.usuario?.roles ?? []),
  ...(respuesta?.user?.role ? [respuesta.user.role] : []),
  ...(respuesta?.usuario?.role ? [respuesta.usuario.role] : []),
];

const permisosDesde = (payload: JwtPayload, respuesta?: RespuestaLoginApi): string[] => [
  ...(payload.permissions ?? []),
  ...(payload.permisos ?? []),
  ...(respuesta?.permissions ?? []),
  ...(respuesta?.permisos ?? []),
  ...(respuesta?.user?.permissions ?? []),
  ...(respuesta?.user?.permisos ?? []),
  ...(respuesta?.usuario?.permissions ?? []),
  ...(respuesta?.usuario?.permisos ?? []),
];

const resolverRol = (roles: string[]): RolUsuario => {
  const rolesNormalizados = roles.map(normalizarRol);

  if (rolesNormalizados.some((role) => ROLES_ADMIN.has(role))) {
    return "admin";
  }

  if (rolesNormalizados.some((role) => ROLES_CLIENTE.has(role))) {
    return "client";
  }

  throw new Error("El backend no devolvio un rol valido en el token o la respuesta de login.");
};

const resolverCorreo = (payload: JwtPayload, respuesta?: RespuestaLoginApi): string =>
  respuesta?.user?.email ??
  respuesta?.user?.correo ??
  respuesta?.usuario?.email ??
  respuesta?.usuario?.correo ??
  payload.sub ??
  "";

const construirSesionDesdeToken = (token: string, respuesta?: RespuestaLoginApi): SesionAutenticacion => {
  const payload = decodificarJwtPayload(token);
  const correo = resolverCorreo(payload, respuesta);

  return {
    correo,
    emitidaEn: (payload.iat ?? 0) * 1000,
    expiraEn: (payload.exp ?? 0) * 1000,
    token,
    proveedor: "api",
    usuario: {
      correo,
      role: resolverRol([...rolesDesdeJwt(payload), ...rolesDesdeRespuesta(respuesta)]),
      permisos: permisosDesde(payload, respuesta),
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

const manejarErrorLogin = (error: unknown, t: TranslationFunction = tFallback): never => {
  if (esErrorApi(error)) {
    const mensaje = error.message.toLowerCase();

    if (mensaje.includes("err_ngrok_3200") || mensaje.includes("offline") || mensaje.includes("failed to fetch")) {
      throw new Error(t("login.errors.backendOffline"));
    }

    if (error.status === 400) {
      throw new Error(t("login.errors.invalidData"));
    }

    if (error.status === 401) {
      throw new Error(t("login.errors.unauthorized"));
    }

    if (error.status === 403) {
      throw new Error(t("login.errors.forbidden"));
    }

    if (error.status === 429) {
      throw new Error(t("login.errors.tooManyAttempts"));
    }

    if (error.status >= 500) {
      throw new Error(t("login.errors.serverError"));
    }
  }

  if (error instanceof Error) {
    throw new Error(error.message.toLowerCase().includes("failed to fetch") ? t("login.errors.connectionFailed") : error.message);
  }

  throw new Error(t("login.errors.generic"));
};

const validarRespuestaLogin = (respuesta: RespuestaLoginApi, t: TranslationFunction = tFallback): void => {
  if (!respuesta.accessToken) {
    throw new Error(t("login.errors.missingToken"));
  }
};

export const servicioAutenticacion = {
  async iniciarSesion(
    credenciales: CredencialesAutenticacion,
    t: TranslationFunction = tFallback,
  ): Promise<SesionAutenticacion> {
    try {
      const respuesta = await apiClient<RespuestaLoginApi>(API_ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify({
          email: credenciales.email.trim(),
          password: credenciales.password,
        }),
        skipAuthHeader: true,
      });

      validarRespuestaLogin(respuesta, t);
      tokenManager.setTokens(respuesta.accessToken, respuesta.refreshToken, respuesta.expiresIn);
      return construirSesionDesdeToken(respuesta.accessToken, respuesta);
    } catch (error) {
      return manejarErrorLogin(error, t);
    }
  },

  async refrescarToken(): Promise<SesionAutenticacion> {
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
      return construirSesionDesdeToken(respuesta.accessToken, respuesta);
    } catch (error) {
      tokenManager.clearTokens();
      throw error;
    }
  },

  async cerrarSesion(): Promise<void> {
    try {
      await apiClient(API_ENDPOINTS.auth.logout, { method: "POST" });
    } catch {
      // El cierre local debe completarse aunque backend no responda.
    } finally {
      tokenManager.clearTokens();
    }
  },

  async obtenerSesion(): Promise<SesionAutenticacion | null> {
    const token = tokenManager.getToken();

    if (!token) {
      return null;
    }

    try {
      return tokenManager.isTokenExpired()
        ? await this.refrescarToken()
        : construirSesionDesdeToken(token);
    } catch {
      tokenManager.clearTokens();
      return null;
    }
  },

  async estaAutenticado(): Promise<boolean> {
    return (await this.obtenerSesion()) !== null;
  },
};
