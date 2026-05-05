/**
 * lib/auth/tokens.ts
 *
 * Helpers for reading and writing auth tokens stored in cookies.
 * Cookies are used so that the Next.js middleware (which runs on the Edge)
 * can read the token and protect routes without needing client-side JS.
 *
 * Cookie names are intentionally non-descriptive to avoid fingerprinting.
 */

export const ACCESS_TOKEN_KEY = 'rg_at';
export const REFRESH_TOKEN_KEY = 'rg_rt';

// Max ages (in seconds)
const ACCESS_TOKEN_MAX_AGE = 60 * 60;           // 1 hour
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Client-side helpers (browser only) ──────────────────────────────────────

/**
 * Saves both tokens to cookies. Call this after a successful login.
 */
export function saveTokens(accessToken: string, refreshTokenValue: string): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  // Use SameSite=Lax for better compatibility with redirects and different subdomains
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${ACCESS_TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshTokenValue)}; Path=/; Max-Age=${REFRESH_TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * Clears both auth cookies. Call this on logout.
 */
export function clearTokens(): void {
  document.cookie = `${ACCESS_TOKEN_KEY}=; Path=/; Max-Age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; Path=/; Max-Age=0`;
}

/**
 * Reads a specific cookie value by name (client-side only).
 */
export function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Returns the current access token from cookies (client-side only).
 */
export function getAccessToken(): string | null {
  return getCookieValue(ACCESS_TOKEN_KEY);
}

/**
 * Returns the current refresh token from cookies (client-side only).
 */
export function getRefreshToken(): string | null {
  return getCookieValue(REFRESH_TOKEN_KEY);
}
