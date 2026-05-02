import { API_BASE_URL } from './config';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/**
 * POST /api/Auth/login
 * Authenticates an admin user and returns access + refresh tokens.
 */
export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[Auth] Login HTTP error:', res.status, errorText);
    throw new Error('Invalid email or password.');
  }

  const json: ApiResponse<AuthTokens> = await res.json();
  
  if (!json.success || !json.data) {
    console.error('[Auth] Login logical error:', json.message, json.errors);
    throw new Error(json.message || 'Login failed.');
  }

  return json.data;
}


/**
 * POST /api/Auth/refresh-token
 * Exchanges a refresh token for a new access token.
 */
export async function refreshToken(payload: RefreshTokenPayload): Promise<AuthTokens> {
  const res = await fetch(`${API_BASE_URL}/api/Auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('[Auth] Token refresh HTTP error:', res.status, errorText);
    throw new Error('Session expired. Please log in again.');
  }

  const json: ApiResponse<AuthTokens> = await res.json();
  
  if (!json.success || !json.data) {
    console.error('[Auth] Token refresh logical error:', json.message, json.errors);
    throw new Error(json.message || 'Token refresh failed.');
  }

  return json.data;
}
