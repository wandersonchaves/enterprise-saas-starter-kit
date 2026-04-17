import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs at the Edge
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract tenant slug from subdomain or path (e.g., tenant.saas.com or saas.com/tenant)
  // For this starter kit, we'll look for an 'x-tenant-slug' header or cookie as a fallback
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
