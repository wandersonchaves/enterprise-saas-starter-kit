"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center p-6 bg-card border-2 border-dashed rounded-3xl animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-red-600 w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black mb-2 text-center">Ops! Algo deu errado.</h2>
      <p className="text-muted-foreground text-center max-w-sm mb-8">
        Não conseguimos carregar as informações deste painel no momento.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
      >
        <RotateCcw size={18} />
        Tentar novamente
      </button>
    </div>
  );
}
