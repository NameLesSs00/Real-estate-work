/**
 * middleware.ts
 *
 * Next.js Edge Middleware — protects all /admin routes.
 *
 * Rules:
 *  - /admin/login  → always accessible (the auth entry point)
 *  - /admin/*      → requires a valid access token cookie
 *                    → if missing, redirect to /not-found
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_KEY } from '@/lib/auth/tokens';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files (images, css, etc.)
  // If the path has a file extension, we don't need to authenticate it
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow the login page AND its static images through
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // Protect every other /admin/* route
  if (pathname.startsWith('/admin')) {
    const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

    if (!accessToken) {
      console.error(
        `[Middleware] Unauthenticated access attempt to "${pathname}" — redirecting to /not-found`
      );
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = '/not-found';
      return NextResponse.redirect(notFoundUrl);
    }
  }

  return NextResponse.next();
}

// Only run on /admin paths — skip static files and API routes
export const config = {
  matcher: ['/admin/:path*'],
};
