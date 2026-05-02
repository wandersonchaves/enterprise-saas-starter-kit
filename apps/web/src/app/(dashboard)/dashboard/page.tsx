"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoaded || !isListLoaded) return;

    try {
      if (orgId && userMemberships.data) {
        // Se já tem uma org selecionada no Clerk, busca o slug dela na lista
        const currentOrg = userMemberships.data.find(m => m.organization.id === orgId);
        if (currentOrg?.organization.slug) {
          router.replace(`/${currentOrg.organization.slug}`);
          return;
        }
      }

      // Se não tem org selecionada ou não achou o slug, tenta a primeira disponível
      if (userMemberships.data && userMemberships.data.length > 0) {
        const firstOrg = userMemberships.data[0].organization;
        if (firstOrg.slug) {
          router.replace(`/${firstOrg.slug}`);
          return;
        }
      }

      // Se chegou aqui e não tem organização, pode ser um usuário novo
      // Redireciona para uma página de onboarding ou landing
      router.replace("/");
    } catch (e) {
      console.error("Redirect logic failed:", e);
      setError("Não conseguimos localizar seu espaço de trabalho.");
    }
  }, [orgId, isAuthLoaded, isListLoaded, userMemberships.data, router]);

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-6 p-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Ops! Algo deu errado</h1>
          <p className="text-muted-foreground max-w-xs">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <div className="text-center space-y-1">
        <p className="text-foreground font-bold">Acessando seu Workspace</p>
        <p className="text-muted-foreground text-sm animate-pulse">Preparando ambiente seguro...</p>
      </div>
    </div>
  );
}
