"use client";

import React, { useState } from "react";
import { CreditCard, Check, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/use-api";
import { useSearchParams } from "next/navigation";

const plans = [
  { id: "free", name: "Starter", price: "0", features: ["Até 5 membros", "10GB Storage", "Suporte Email"], current: true },
  { id: "pro", name: "Pro", price: "199", features: ["Membros ilimitados", "100GB Storage", "Suporte 24/7", "IA Assistant"], popular: true },
  { id: "enterprise", name: "Enterprise", price: "999", features: ["SSO / SAML", "SLA Dedicado", "Infra privada", "White-label Full"] },
];

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { fetcher } = useApi();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;
    
    setIsLoading(planId);
    try {
      const response = await fetcher<{ url: string }>("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan: planId }),
      });
      
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Billing error:", error);
      alert("Ocorreu um erro ao iniciar o checkout. Verifique se as chaves do Stripe estão configuradas.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8 page-transition">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assinatura e Faturamento</h1>
        <p className="text-muted-foreground">Gerencie seu plano e visualize o histórico de cobranças.</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <ShieldCheck size={20} />
          <span className="font-medium text-sm">Assinatura atualizada com sucesso! Bem-vindo ao plano Pro.</span>
        </div>
      )}

      {canceled && (
        <div className="bg-amber-100 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium text-sm">O checkout foi cancelado. Nenhuma cobrança foi realizada.</span>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className={cn(
            "p-8 rounded-3xl border bg-card flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-primary/5",
            plan.popular && "ring-2 ring-primary relative scale-105 z-10"
          )}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Mais Recomendado
              </span>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-xl tracking-tight">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black">R$ {plan.price}</span>
                  <span className="text-muted-foreground text-sm font-medium">/mês</span>
                </div>
              </div>
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-primary font-bold" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              disabled={plan.current || !!isLoading}
              onClick={() => handleUpgrade(plan.id)}
              className={cn(
                "w-full mt-8 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2",
                plan.current 
                  ? "bg-muted text-muted-foreground cursor-default" 
                  : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              )}
            >
              {isLoading === plan.id ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : plan.current ? (
                "Seu Plano Atual"
              ) : (
                <>
                  <Zap size={16} /> Fazer Upgrade
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-muted/30 border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center border shadow-sm">
            <CreditCard className="text-muted-foreground" size={24} />
          </div>
          <div>
            <h4 className="font-bold">Método de Pagamento</h4>
            <p className="text-sm text-muted-foreground">Nenhum cartão cadastrado.</p>
          </div>
        </div>
        <button className="text-sm font-bold px-6 py-3 border bg-card rounded-xl hover:bg-muted transition-colors">
          Adicionar Cartão
        </button>
      </div>
    </div>
  );
}
