import { getAccessToken } from '@/lib/auth/tokens';

export function getHeaders(langOverride?: string, skipLanguage = false): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!skipLanguage) {
    // Use override if provided, otherwise read from cookie (client-side only)
    const lang = langOverride || (typeof document !== 'undefined' ? 
      document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/)?.[1] : 'en') || 'en';
    
    headers['Language'] = lang.toLowerCase(); // en, de, pl
  }

  return headers;
}
