'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getRefreshToken, saveTokens } from '@/lib/auth/tokens';
import { refreshToken } from '@/lib/api/auth';
import { handleLogout } from '@/lib/auth/logout';

/**
 * Proactively refreshes the access token before it expires.
 * Runs in the background at regular intervals.
 */
const REFRESH_INTERVAL_MS = 45 * 60 * 1000; // 45 minutes

export default function TokenRefresher() {
  const pathname = usePathname();

  useEffect(() => {
    // DO NOT run refresh logic on the login page
    if (pathname?.includes('/login')) {
      return;
    }

    const refreshTokenFn = async () => {
      const currentRefreshToken = getRefreshToken();
      
      // If no refresh token, user is likely logged out or on a public page
      if (!currentRefreshToken) return;

      try {
        const newTokens = await refreshToken({ refreshToken: currentRefreshToken });
        
        // Success: Update cookies with fresh tokens
        saveTokens(newTokens.accessToken, newTokens.refreshToken);
        console.log('[TokenRefresher] Session tokens refreshed successfully.');
      } catch (error) {
        // If refresh fails on an active session (e.g. token revoked), force logout
        console.error('[TokenRefresher] Session refresh failed, logging out:', error);
        handleLogout();
      }
    };

    // Set up the proactive refresh interval
    // Note: We don't call it immediately on mount to avoid race conditions with login
    const intervalId = setInterval(refreshTokenFn, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [pathname]);

  return null;
}
