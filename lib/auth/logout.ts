/**
 * lib/auth/logout.ts
 *
 * Client-side logout helper.
 * Clears local cookies and redirects to the login page.
 */

import { clearTokens } from './tokens';

/**
 * Performs a local logout:
 *  1. Clears local auth cookies
 *  2. Redirects to /admin/login
 */
export function handleLogout(): void {
  // Clear local auth cookies
  clearTokens();
  
  // Hard navigate to the login page
  // This ensures the middleware re-evaluates the authentication state
  window.location.href = '/admin/login';
}
