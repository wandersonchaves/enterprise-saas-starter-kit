"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Rota de transição /dashboard
 * Objetivo: Redirecionar o usuário para sua organização ativa baseada no slug.
 */
export default function DashboardRedirectPage() {
  const { orgId, isLoaded: isAuthLoaded } = useAuth();
  const { userMemberships, isLoaded: isListLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoaded || !isListLoaded) return;

    if (orgId && userMemberships.data) {
      // Se já tem uma org selecionada no Clerk, busca o slug dela na lista
      const currentOrg = userMemberships.data.find(m => m.organization.id === orgId);
      if (currentOrg) {
        router.push(`/${currentOrg.organization.slug}`);
        return;
      }
    }

    // Se não tem org selecionada ou não achou o slug, tenta a primeira disponível
    if (userMemberships.data && userMemberships.data.length > 0) {
      const firstOrg = userMemberships.data[0].organization;
      router.push(`/${firstOrg.slug}`);
    } else {
      // TODO: Redirecionar para tela de "Create Organization" se o usuário não tiver nenhuma
      router.push("/");
    }
  }, [orgId, isAuthLoaded, isListLoaded, userMemberships.data, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Carregando seu espaço de trabalho...</p>
    </div>
  );
}
