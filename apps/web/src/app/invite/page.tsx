"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/use-api";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const { fetcher } = useApi();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const acceptInvite = async () => {
      try {
        await fetcher(`/organizations/invites/accept`, {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        setStatus("success");
        toast.success("Convite aceito com sucesso!");
        setTimeout(() => router.push("/dashboard"), 3000);
      } catch (error) {
        console.error("Invite error:", error);
        setStatus("error");
        toast.error("Este convite é inválido ou expirou.");
      }
    };

    acceptInvite();
  }, [token, fetcher, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="max-w-md w-full bg-card border rounded-3xl p-10 text-center shadow-xl">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <h1 className="text-xl font-bold">Validando seu convite...</h1>
            <p className="text-muted-foreground text-sm">Aguarde um momento enquanto processamos seu acesso.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-emerald-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black">Tudo certo!</h1>
            <p className="text-muted-foreground">Você agora faz parte da organização. Redirecionando para o dashboard...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-red-600 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black">Convite Inválido</h1>
            <p className="text-muted-foreground text-sm">O link pode ter expirado ou já foi utilizado. Peça ao administrador um novo convite.</p>
            <Link href="/" className="block text-sm font-bold text-primary hover:underline">
              Voltar para a Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
