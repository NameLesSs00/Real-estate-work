'use client';

import { useEffect } from 'react';
import { getRefreshToken, saveTokens } from '@/lib/auth/tokens';
import { refreshToken } from '@/lib/api/auth';
import { handleLogout } from '@/lib/auth/logout';

// Refresh every 45 minutes (to be safe before the 1-hour expiration)
const REFRESH_INTERVAL_MS = 45 * 60 * 1000; 

export default function TokenRefresher() {
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const currentRefreshToken = getRefreshToken();
      
      // If we don't have a refresh token, we can't refresh
      if (!currentRefreshToken) {
        return;
      }

      try {
        const newTokens = await refreshToken({ refreshToken: currentRefreshToken });
        
        // Save the new tokens to cookies
        saveTokens(newTokens.accessToken, newTokens.refreshToken);
        console.log('[TokenRefresher] Successfully refreshed session tokens.');
      } catch (error) {
        console.error('[TokenRefresher] Failed to refresh token, logging out:', error);
        // If refresh fails (e.g. refresh token is also expired), force logout
        handleLogout();
      }
    }, REFRESH_INTERVAL_MS);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // This is a headless component, it renders nothing
  return null;
}
