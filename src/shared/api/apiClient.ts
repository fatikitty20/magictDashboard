type ApiError = {
  message: string;
  status: number;
};

const esAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const apiClient = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
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
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch {
        // Ignore body parsing errors and keep the generic API message.
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
