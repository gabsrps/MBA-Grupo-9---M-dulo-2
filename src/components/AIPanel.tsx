import React, { useState, useRef, useEffect } from "react";
import { Send, HelpCircle, Sparkles, Loader2, Bot } from "lucide-react";
import { ChatMessage } from "../types";

const SUGGESTED_QUESTIONS = [
  "Qual o maior fator causador de churn?",
  "O que os dados dizem sobre treino corporativo?",
  "Qual a diferença operacional entre contratos curto e longo?",
  "Quais planos práticos os dados indicam para reter alunos de menor idade?"
];

export default function AIPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Olá! Sou o seu Analista VitalizIA."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineWarning, setIsOfflineWarning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao comunicar com o servidor.");
      }

      const data = await response.json();
      if (data.isMock) {
        setIsOfflineWarning(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oops! Desculpe, tive um contratempo interno para acessar minha API da IA. Mas lembre-se: o dado central indica que o maior mitigador de churn é o tempo de casa (Lifetime) de 3+ meses associado a contratos anuais!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1e293b]/50 border border-slate-700/60 rounded-2xl flex flex-col h-[540px] shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5 font-sans">
              Analista IA Executivo
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Modelo: gemini-3.5-flash</p>
          </div>
        </div>
        <div className="flex gap-1 items-center bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded-full text-xs font-mono">
          <Sparkles size={11} />
          <span>Fiel ao Colab</span>
        </div>
      </div>

      {/* Warnings */}
      {isOfflineWarning && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300 p-2.5 px-4 font-sans text-center">
          Operando no modo Offline (sem chave api nos segredos do AI Studio). Respostas analíticas estruturadas.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-slate-100 rounded-tr-none font-sans"
                  : "bg-slate-800/90 text-slate-300 border border-slate-700/40 rounded-tl-none font-sans whitespace-pre-line"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-center gap-2 text-slate-400 text-xs font-mono bg-slate-800/40 p-3 rounded-xl border border-slate-800 w-44">
            <Loader2 size={14} className="animate-spin text-indigo-400" />
            <span>Processando dados...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Multi Suggestions */}
      <div className="px-4 py-2 border-t border-slate-850 bg-slate-900/40">
        <p className="text-[10px] text-slate-500 font-semibold mb-2 uppercase tracking-wider font-sans">Perguntas Recomendadas:</p>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1 scrollbar-none">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] bg-slate-800/60 hover:bg-slate-700/60 text-indigo-300 hover:text-indigo-200 py-1 px-2.5 rounded-lg border border-slate-700/40 transition-all text-left truncate max-w-full cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-800/50 border-t border-slate-700/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
            placeholder="Digite sua dúvida ou use as sugestões..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 p-2.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
