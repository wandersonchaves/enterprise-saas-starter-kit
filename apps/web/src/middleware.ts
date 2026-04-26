import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs at the Edge
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  const token = request.cookies.get('access_token')?.value;
  const isHomePage = url.pathname === '/';

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/blog'];
  const isPublicRoute = publicRoutes.some(route => url.pathname === route || url.pathname.startsWith('/blog/'));

  // 1. Redirect logged-in users from '/' to '/dashboard'
  if (isHomePage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Redirect unauthenticated users from private routes to '/login'
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', url.pathname); // Save original destination
    return NextResponse.redirect(loginUrl);
  }

  const tenantSlug = request.headers.get('x-tenant-slug') || request.cookies.get('tenant-slug')?.value;

  const response = NextResponse.next();

  if (tenantSlug) {
    // Inject tenant context into headers so downstream RSCs and APIs can use it without re-fetching
    response.headers.set('x-edge-tenant-id', tenantSlug);
    
    // Example: Edge-side A/B testing or Feature Flagging
    // const isPro = getEdgeConfigValue(tenantSlug, 'isPro'); 
    // response.headers.set('x-edge-is-pro', String(isPro));
  }

  // Security Headers at the Edge
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
