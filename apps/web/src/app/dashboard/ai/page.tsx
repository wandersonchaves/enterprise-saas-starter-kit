"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { toast } from "sonner";

export default function AiAssistantPage() {
  const [messages, setMembers] = useState<{role: 'bot' | 'user', content: string}[]>([
    { role: 'bot', content: 'Olá! Sou seu assistente enterprise. Como posso ajudar com sua organização hoje?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetcher } = useApi();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMembers(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Endpoint simulado, mas pronto para integração real
      const response = await fetcher<{ text: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ prompt: userMessage }),
      });
      
      setMembers(prev => [...prev, { role: 'bot', content: response.text || "Desculpe, tive um problema ao processar sua solicitação." }]);
    } catch (error) {
      toast.error("Erro ao conectar com o motor de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col page-transition">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">IA Assistant</h1>
        <p className="text-muted-foreground">Utilize nossa inteligência artificial para automatizar tarefas e analisar dados.</p>
      </div>

      <div className="flex-1 bg-card border rounded-3xl overflow-hidden flex flex-col shadow-xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-muted/50 border p-4 rounded-3xl flex items-center gap-3">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium">IA está pensando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-muted/20 border-t flex gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta para a IA..."
            className="flex-1 bg-background border rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
