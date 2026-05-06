import { API_BASE_URL, DEFAULT_API_HEADERS } from "./apiConfig";
import { tokenManager } from "./tokenManager";

export type ApiError = {
  message: string;
  status: number;
};

type ApiClientOptions = RequestInit & {
  skipAuthHeader?: boolean;
};

const esAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

const construirUrl = (url: string): string => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith("/api/")) {
    return url;
  }

  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

const leerMensajeError = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data?.error === "string") {
      return data.error;
    }

    return JSON.stringify(data);
  } catch {
    try {
      return (await response.text()) || "API Error";
    } catch {
      return "API Error";
    }
  }
};

export const apiClient = async <T>(
  url: string,
  options?: ApiClientOptions,
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const { skipAuthHeader, headers: optionHeaders, ...fetchOptions } = options ?? {};

  try {
    const headers: Record<string, string> = {
      ...DEFAULT_API_HEADERS,
      ...((optionHeaders as Record<string, string> | undefined) ?? {}),
    };

    if (!skipAuthHeader) {
      const token = tokenManager.getToken();

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(construirUrl(url), {
      ...fetchOptions,
      headers,
      credentials: fetchOptions.credentials ?? "omit",
      signal: controller.signal,
    });

    if (!response.ok) {
      const error: ApiError = {
        message: await leerMensajeError(response),
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
      } satisfies ApiError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
