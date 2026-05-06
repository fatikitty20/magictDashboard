/**
 * Token Manager
 *
 * Guarda JWT y refresh token solo en memoria. Esto evita dejarlos en
 * localStorage, donde cualquier script del navegador podria leerlos.
 */

interface TokenPair {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

let tokens: TokenPair = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

const REFRESH_SKEW_MS = 30_000;

export const tokenManager = {
  setTokens(accessToken: string, refreshToken?: string, expiresIn?: number): void {
    tokens = {
      accessToken,
      refreshToken: refreshToken ?? null,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : null,
    };
  },

  getToken(): string | null {
    return tokens.accessToken;
  },

  getRefreshToken(): string | null {
    return tokens.refreshToken;
  },

  isTokenExpired(): boolean {
    if (!tokens.expiresAt) {
      return false;
    }

    return Date.now() >= tokens.expiresAt - REFRESH_SKEW_MS;
  },

  clearTokens(): void {
    tokens = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };
  },
};
