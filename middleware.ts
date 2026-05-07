import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';

const locales = ['en', 'de', 'pl'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
    if (locales.includes(preferredLocale)) return preferredLocale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/backend') ||
    pathname.startsWith('/locales') ||
    pathname.startsWith('/assists') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. Admin Protection (Existing logic, adapted for locale prefix)
  // We check if the path (with or without locale) starts with /admin
  const isAdminPath = pathnameHasLocale 
    ? locales.some(l => pathname.startsWith(`/${l}/admin`))
    : pathname.startsWith('/admin');

  if (isAdminPath) {
    // If it's the login page, allow it
    const isLogin = pathnameHasLocale
      ? locales.some(l => pathname === `/${l}/admin/login` || pathname.startsWith(`/${l}/admin/login/`))
      : pathname === '/admin/login' || pathname.startsWith('/admin/login/');

    if (!isLogin) {
      const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
      if (!accessToken) {
        console.error(`[Middleware] Unauthenticated access attempt to "${pathname}" — redirecting to /not-found`);
        const url = request.nextUrl.clone();
        // Redirect to localized not-found if possible
        const locale = pathnameHasLocale ? pathname.split('/')[1] : getLocale(request);
        url.pathname = `/${locale}/not-found`;
        return NextResponse.redirect(url);
      }
    }
  }

  // 4. Redirect if no locale is present
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

