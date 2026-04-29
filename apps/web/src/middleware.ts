import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/login(.*)", 
  "/register(.*)", 
  "/blog(.*)",
  "/api/webhooks(.*)"
]);

const isAuthRoute = createRouteMatcher([
  "/login(.*)", 
  "/register(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const url = request.nextUrl;

  // Se o usuário está logado e tenta acessar rotas de auth (login/register) ou a landing page
  if (userId && (url.pathname === "/" || isAuthRoute(request))) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Protege rotas privadas
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
