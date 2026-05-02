import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Configuração de Rotas baseada no comando Staff Engineer
 * Estratégia: Redirecionamento inteligente e performance no Edge
 */
interface RouteConfig {
  path: string;
  isPublic: boolean;
  whenAuthenticated: 'redirect' | 'next';
}

const ROUTES: RouteConfig[] = [
  { path: "/", isPublic: true, whenAuthenticated: 'next' },
  { path: "/pricing", isPublic: true, whenAuthenticated: 'next' },
  { path: "/blog", isPublic: true, whenAuthenticated: 'next' },
  { path: "/login", isPublic: true, whenAuthenticated: 'redirect' },
  { path: "/register", isPublic: true, whenAuthenticated: 'redirect' },
  { path: "/dashboard", isPublic: false, whenAuthenticated: 'next' },
  // Adicione outras rotas privadas conforme necessário
];

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // Encontra a configuração da rota atual
  const route = ROUTES.find(r => pathname === r.path || pathname.startsWith(`${r.path}/`));

  // 1. Rota Privada (não listada ou marcada como não pública)
  const isPrivate = !route || !route.isPublic;

  if (isPrivate && !userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Lógica de Redirecionamento Inteligente para Usuários Autenticados
  if (userId && route?.whenAuthenticated === 'redirect') {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
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
