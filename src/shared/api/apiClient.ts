import { tokenManager } from "./tokenManager";

type ApiError = {
  message: string;
  status: number;
};

type ApiClientOptions = RequestInit & {
  skipAuthHeader?: boolean;
};

const esAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const apiClient = async <T>(
  url: string,
  options?: ApiClientOptions,
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    // En desarrollo: /api/v1/* → proxy de Vite → backend real
    // En producción: usar VITE_API_URL (definida en .env)
    const urlBase = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL || "/api/v1"
      : "/api/v1";
    
    const urlCompleta = `${urlBase}${url}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      "User-Agent": "Magictronic-Dashboard",
      ...(options?.headers as Record<string, string> || {}),
    };

    // Agregar token en Authorization si no es login/refresh
    if (!options?.skipAuthHeader) {
      const token = tokenManager.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(urlCompleta, {
      headers,
      credentials: "include",
      signal: controller.signal,
      ...options,
    });

    if (response.status === 401) {
      console.warn("Unauthorized - session expired");
    }

    if (!response.ok) {
      let errorMessage = "API Error";

      try {
        const data = await response.json();
        // Si el backend devuelve error en JSON, extrae el mensaje
        errorMessage = data.message || data.error || JSON.stringify(data);
      } catch {
        // Si no es JSON, intenta como texto
        try {
          errorMessage = await response.text() || errorMessage;
        } catch {
          // Si nada funciona, usa el genérico
        }
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };

      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: unknown) {
    if (esAbortError(error)) {
      throw {
        message: "Request timeout",
        status: 408,
      };
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
