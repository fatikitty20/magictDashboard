import { apiClient } from "@/shared/api/apiClient";
import { API_ENDPOINTS } from "@/shared/api/apiConfig";
import { tokenManager } from "@/shared/api/tokenManager";
import type { RolUsuario } from "./roles";

/*
|--------------------------------------------------------------------------
| Interfaces de autenticación
|--------------------------------------------------------------------------
| Definen la estructura de datos utilizada en login y sesión.
*/

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

/*
|--------------------------------------------------------------------------
| Contrato del adaptador de autenticación
|--------------------------------------------------------------------------
| Define las operaciones principales del sistema auth.
*/

interface AdaptadorAutenticacion {
  iniciarSesion(
    credenciales: CredencialesAutenticacion,
    t: TranslationFunction
  ): Promise<SesionAutenticacion>;

  refrescarToken(): Promise<SesionAutenticacion>;

  cerrarSesion(): Promise<void>;

  obtenerSesion(): Promise<SesionAutenticacion | null>;
}

/*
|--------------------------------------------------------------------------
| Payload esperado del JWT
|--------------------------------------------------------------------------
| Información obtenida desde el token.
*/

type JwtPayload = {
  sub?: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

/*
|--------------------------------------------------------------------------
| Estructura de errores del backend
|--------------------------------------------------------------------------
*/

type ErrorApi = {
  message: string;
  status: number;
};

/*
|--------------------------------------------------------------------------
| Normalización Base64 URL
|--------------------------------------------------------------------------
| Convierte el formato Base64URL del JWT a Base64 estándar
| para poder decodificarlo correctamente.
*/

const normalizarBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");

  const padding = base64.length % 4;

  return padding
    ? `${base64}${"=".repeat(4 - padding)}`
    : base64;
};

/*
|--------------------------------------------------------------------------
| Decodificación del JWT
|--------------------------------------------------------------------------
| Obtiene el payload del token JWT.
*/

const decodificarJwtPayload = (
  token: string
): JwtPayload => {

  const partes = token.split(".");

  // Valida estructura correcta del JWT
  if (partes.length !== 3) {
    throw new Error("Token invalido");
  }

  return JSON.parse(
    atob(normalizarBase64Url(partes[1]))
  ) as JwtPayload;
};

/*
|--------------------------------------------------------------------------
| Extracción de roles y permisos
|--------------------------------------------------------------------------
| Obtiene roles desde diferentes propiedades del JWT.
*/

const extraerRolesDelPayload = (
  payload: JwtPayload
): string[] => [
  ...(payload.roles ?? []),
  ...(payload.authorities ?? []),
  ...(payload.scope?.split(" ") ?? []),
  ...(payload.role ? [payload.role] : []),
];

/*
|--------------------------------------------------------------------------
| Determinar rol del usuario
|--------------------------------------------------------------------------
| Define si el usuario es admin o client.
*/

const extraerRolDelPayload = (
  payload: JwtPayload
): RolUsuario => {

  const roles = extraerRolesDelPayload(payload);

  // Validación de permisos administrativos
  if (
    roles.includes("ROLE_ADMIN") ||
    roles.includes("ROLE_ANALYTICS")
  ) {
    return "admin";
  }

  return "client";
};

/*
|--------------------------------------------------------------------------
| Construcción de sesión desde JWT
|--------------------------------------------------------------------------
| Genera la sesión usando la información del token.
*/

const construirSesionDesdeToken = (
  token: string
): SesionAutenticacion => {

  const payload = decodificarJwtPayload(token);

  const correo = payload.sub ?? "";

  return {
    correo,

    // Fecha de emisión del token
    emitidaEn: (payload.iat ?? 0) * 1000,

    // Fecha de expiración del token
    expiraEn: (payload.exp ?? 0) * 1000,

    token,

    proveedor: "api",

    usuario: {
      correo,

      // Rol obtenido desde JWT
      role: extraerRolDelPayload(payload),
    },
  };
};

/*
|--------------------------------------------------------------------------
| Validación de errores del backend
|--------------------------------------------------------------------------
*/

const esErrorApi = (
  error: unknown
): error is ErrorApi =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  "status" in error &&
  typeof error.message === "string" &&
  typeof error.status === "number";

/*
|--------------------------------------------------------------------------
| Manejo seguro de errores de login
|--------------------------------------------------------------------------
| Se implementa control de errores HTTP alineado
| con buenas prácticas de seguridad.
| Ahora acepta la función de traducción (t) para mensajes i18n.
*/

type TranslationFunction = (key: string, defaultValue?: string) => string;

const manejarErrorLogin = (
  error: unknown,
  t: TranslationFunction
): never => {

  if (esErrorApi(error)) {

    // Detecta si el backend o túnel ngrok están offline
    const backendOffline =
      error.message.includes("ERR_NGROK_3200") ||
      error.message.toLowerCase().includes("offline") ||
      error.message.toLowerCase().includes("failed to fetch");

    if (backendOffline) {
      throw new Error(t("login.errors.backendOffline"));
    }

    // Credenciales inválidas
    if (error.status === 400) {
      throw new Error(t("login.errors.invalidData"));
    }

    // Usuario no autenticado
    if (error.status === 401) {
      throw new Error(t("login.errors.unauthorized"));
    }

    // Usuario sin permisos
    if (error.status === 403) {
      throw new Error(t("login.errors.forbidden"));
    }

    // Demasiados intentos
    if (error.status === 429) {
      throw new Error(t("login.errors.tooManyAttempts"));
    }

    // Error interno del servidor
    if (error.status >= 500) {
      throw new Error(t("login.errors.serverError"));
    }
  }

  // Error de conexión con backend
  if (error instanceof Error) {

    if (
      error.message
        .toLowerCase()
        .includes("failed to fetch")
    ) {
      throw new Error(t("login.errors.connectionFailed"));
    }

    throw new Error(error.message);
  }

  throw new Error(t("login.errors.generic"));
};

/*
|--------------------------------------------------------------------------
| Validación de respuesta del login
|--------------------------------------------------------------------------
| Verifica que el backend haya devuelto accessToken.
*/

const validarRespuestaLogin = (
  respuesta: RespuestaLoginApi,
  t: TranslationFunction
): void => {

  if (!respuesta.accessToken) {
    throw new Error(t("login.errors.missingToken"));
  }
};

/*
|--------------------------------------------------------------------------
| Adaptador principal de autenticación
|--------------------------------------------------------------------------
| Contiene toda la lógica de login, refresh,
| persistencia de sesión y logout.
*/

const adaptadorAutenticacionApi: AdaptadorAutenticacion = {

  /*
  |--------------------------------------------------------------------------
  | Iniciar sesión
  |--------------------------------------------------------------------------
  | Envía credenciales al backend y guarda tokens.
  */

  async iniciarSesion(credenciales, t) {

    try {

      const respuesta =
        await apiClient<RespuestaLoginApi>(
          API_ENDPOINTS.auth.login,
          {
            method: "POST",

            body: JSON.stringify({
              email: credenciales.email.trim(),
              password: credenciales.password,
            }),

            // Login no requiere token previo
            skipAuthHeader: true,
          }
        );

      // Valida respuesta del backend
      validarRespuestaLogin(respuesta, t);

      /*
      |--------------------------------------------------------------------------
      | Persistencia de sesión
      |--------------------------------------------------------------------------
      | Guarda accessToken y refreshToken para mantener
      | autenticado al usuario.
      */

      tokenManager.setTokens(
        respuesta.accessToken,
        respuesta.refreshToken,
        respuesta.expiresIn
      );

      // Construye la sesión desde el JWT
      return construirSesionDesdeToken(
        respuesta.accessToken
      );

    } catch (error) {

      // Manejo seguro de errores
      return manejarErrorLogin(error, t);
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Refrescar token
  |--------------------------------------------------------------------------
  | Renueva automáticamente la sesión usando refreshToken.
  */

  async refrescarToken() {

    // Obtiene refreshToken almacenado
    const refreshToken =
      tokenManager.getRefreshToken();

    // Si no existe refreshToken, no puede renovarse
    if (!refreshToken) {
      throw new Error(
        "No refresh token available"
      );
    }

    try {

      // Solicita nuevo accessToken al backend
      const respuesta =
        await apiClient<RespuestaLoginApi>(
          API_ENDPOINTS.auth.refresh,
          {
            method: "POST",

            body: JSON.stringify({
              refreshToken,
            }),

            skipAuthHeader: true,
          }
        );

      // Valida respuesta
      validarRespuestaLogin(respuesta);

      /*
      |--------------------------------------------------------------------------
      | Actualización de tokens
      |--------------------------------------------------------------------------
      | Reemplaza tokens expirados por nuevos tokens válidos.
      */

      tokenManager.setTokens(
        respuesta.accessToken,
        respuesta.refreshToken ?? refreshToken,
        respuesta.expiresIn
      );

      // Devuelve nueva sesión actualizada
      return construirSesionDesdeToken(
        respuesta.accessToken
      );

    } catch (error) {

      /*
      |--------------------------------------------------------------------------
      | Seguridad
      |--------------------------------------------------------------------------
      | Si el refresh falla, elimina tokens para evitar
      | sesiones inválidas o comprometidas.
      */

      tokenManager.clearTokens();

      throw error;
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  | Cierra sesión y elimina tokens almacenados.
  */

  async cerrarSesion() {

    try {

      await apiClient(
        API_ENDPOINTS.auth.logout,
        {
          method: "POST",
        }
      );

    } catch {

      // El logout local debe completarse
      // aunque el backend falle.
    } finally {

      /*
      |--------------------------------------------------------------------------
      | Limpieza segura de sesión
      |--------------------------------------------------------------------------
      */

      tokenManager.clearTokens();
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Obtener sesión actual
  |--------------------------------------------------------------------------
  | Verifica si el usuario sigue autenticado.
  */

  async obtenerSesion() {

    // Obtiene token almacenado
    const token = tokenManager.getToken();

    // Si no existe token, no hay sesión
    if (!token) {
      return null;
    }

    try {

      /*
      |--------------------------------------------------------------------------
      | Validación de expiración
      |--------------------------------------------------------------------------
      | Si el token expiró, intenta renovarlo automáticamente.
      */

      if (tokenManager.isTokenExpired()) {

        return await this.refrescarToken();
      }

      // Si el token sigue válido, reconstruye sesión
      return construirSesionDesdeToken(token);

    } catch {

      /*
      |--------------------------------------------------------------------------
      | Seguridad de sesión
      |--------------------------------------------------------------------------
      | Si ocurre un error, elimina tokens inválidos.
      */

      tokenManager.clearTokens();

      return null;
    }
  },
};

/*
|--------------------------------------------------------------------------
| Servicio público de autenticación
|--------------------------------------------------------------------------
| Expone métodos reutilizables para toda la app.
*/

export const servicioAutenticacion = {

  iniciarSesion(
    credenciales: CredencialesAutenticacion,
    t: TranslationFunction
  ) {
    return adaptadorAutenticacionApi
      .iniciarSesion(credenciales, t);
  },

  refrescarToken() {
    return adaptadorAutenticacionApi
      .refrescarToken();
  },

  cerrarSesion() {
    return adaptadorAutenticacionApi
      .cerrarSesion();
  },

  obtenerSesion() {
    return adaptadorAutenticacionApi
      .obtenerSesion();
  },

  /*
  |--------------------------------------------------------------------------
  | Validar autenticación
  |--------------------------------------------------------------------------
  | Retorna true si existe sesión válida.
  */

  async estaAutenticado() {

    const sesion =
      await adaptadorAutenticacionApi
        .obtenerSesion();

    return sesion !== null;
  },
};