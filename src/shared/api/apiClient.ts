type ApiError = {
  message: string;
  status: number;
};

const esAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const apiClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // ⏱️ timeout 10s

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include", // 🔥 listo para cookies httpOnly
      signal: controller.signal,
      ...options,
    });

    // 🔐 Manejo futuro de auth
    if (response.status === 401) {
      console.warn("Unauthorized - session expired");

      // 👉 futuro:
      // clearSesion();
      // window.location.href = "/login";
    }

    if (!response.ok) {
      let errorMessage = "API Error";

      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch {
        // ignore parsing error
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };

      throw error;
    }

    // ⚠️ evita error si no hay body (ej: 204)
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: unknown) {
    // ⏱️ Timeout error
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
