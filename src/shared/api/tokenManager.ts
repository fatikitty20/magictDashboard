/**
 * Token Manager - Maneja JWT y Refresh Token de forma centralizada
 * Almacenamiento: Solo en memoria (NO en localStorage) para seguridad
 */

interface TokenPair {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

let tokens: TokenPair = {
  accessToken: null as any,
  refreshToken: null as any,
  expiresIn: 0,
};

export const tokenManager = {
  setTokens(accessToken: string, refreshToken?: string, expiresIn?: number): void {
    tokens = {
      accessToken,
      refreshToken,
      expiresIn: expiresIn ? Date.now() + expiresIn * 1000 : undefined,
    };
  },

  getToken(): string | null {
    return tokens.accessToken || null;
  },

  getRefreshToken(): string | null {
    return tokens.refreshToken || null;
  },

  isTokenExpired(): boolean {
    if (!tokens.expiresIn) return false;
    return Date.now() > tokens.expiresIn;
  },

  clearTokens(): void {
    tokens = {
      accessToken: null as any,
      refreshToken: null as any,
      expiresIn: 0,
    };
  },
};

