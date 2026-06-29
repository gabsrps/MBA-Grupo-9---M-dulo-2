import React, { useState } from "react";
import { slides } from "./data";
import { Slide } from "./types";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  BarChart3,
  Lightbulb,
  ShieldCheck,
  Bot,
  Database,
  Sliders,
  DollarSign,
  Activity,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  AwardIcon,
  HelpCircle,
} from "lucide-react";

// Components
import { ContractChurnChart, CorrelationChart, FrequencyRetentionChart } from "./components/Charts";
import AIPanel from "./components/AIPanel";
import Simulator from "./components/Simulator";
import DatasetExplorer from "./components/DatasetExplorer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"deck" | "simulator" | "dataset" | "helper">("deck");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentSlideIndex];

  // Render the proper chart dynamically inside the slide deck depending on visualType
  const renderSlideChart = (type: string) => {
    switch (type) {
      case "correlation":
        return (
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs text-slate-400 uppercase tracking-widest font-mono font-semibold mb-4">
                FORÇA DO IMPACTO DIRETO NO CHURN (CORRELAÇÃO)
              </h4>
              <CorrelationChart />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">
              *Valores negativos significam que maiores índices do campo mitigam a evasão (Seaborn Heatmap, n=4000).
            </p>
          </div>
        );
      case "contracts":
        return (
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs text-slate-400 uppercase tracking-widest font-mono font-semibold mb-6 text-center">
              TAXA DE CHURN POR PERÍODO DE CONTRATO (MÉDIA %)
            </h4>
            <ContractChurnChart />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-mono ">
              <div className="p-2 bg-red-550/10 border border-red-500/10 rounded-lg">
                <p className="text-red-400 font-bold">~60% Churn</p>
                <p className="text-slate-500">Planos Mensais</p>
              </div>
              <div className="p-2 bg-amber-550/10 border border-amber-500/10 rounded-lg">
                <p className="text-amber-400 font-bold">~25% Churn</p>
                <p className="text-slate-500">Planos Semestrais</p>
              </div>
              <div className="p-2 bg-emerald-555/10 border border-emerald-500/10 rounded-lg">
                <p className="text-emerald-400 font-bold">~6% Churn</p>
                <p className="text-slate-500">Planos Anuais</p>
              </div>
            </div>
          </div>
        );
      case "demographic":
        return (
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs text-slate-400 uppercase tracking-widest font-mono font-semibold mb-4">
              A RELAÇÃO CRÍTICA ENTRE ASSIDUIDADE E CHURN
            </h4>
            <FrequencyRetentionChart />
            <p className="text-[10px] text-slate-500 font-mono mt-3">
              *A queda drástica das visitas semanais indica desinteresse iminente. Quem treina ≥3x/sem raramente cancela.
            </p>
          </div>
        );
      case "modeling":
        return (
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs text-indigo-400 uppercase tracking-widest font-mono font-semibold">
              MÉTRICAS COMPARATIVAS DE MODELAGEM
            </h4>
            
            <div className="space-y-3">
              {/* Logistic Regression Card */}
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-200">Regressão Logística</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/10">Sem Overfitting (Estável)</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-slate-950/30 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">ROC-AUC</span>
                    <span className="text-xs font-bold font-mono text-slate-300">0.96</span>
                  </div>
                  <div className="bg-slate-950/30 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">F1-Score (C1)</span>
                    <span className="text-xs font-bold font-mono text-slate-300 font-semibold text-indigo-300">0.77</span>
                  </div>
                  <div className="bg-slate-950/30 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">Acurácia (Val)</span>
                    <span className="text-xs font-bold font-mono text-slate-300">89.5%</span>
                  </div>
                </div>
              </div>

              {/* Random Forest Card */}
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-200">Random Forest</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/10">Risco de Sobreajuste</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-slate-950/30 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">ROC-AUC</span>
                    <span className="text-xs font-bold font-mono text-slate-300">0.97</span>
                  </div>
                  <div className="bg-slate-950/30 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">F1-Score (C1)</span>
                    <span className="text-xs font-bold font-mono text-indigo-300 font-semibold">0.79</span>
                  </div>
                  <div className="bg-slate-950/30 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 uppercase block font-mono">Acurácia (Treino)</span>
                    <span className="text-xs font-bold font-mono text-amber-400 font-semibold">99.2% *</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/10 text-[10px] text-slate-400 font-sans leading-relaxed">
              * A disparidade de acurácia de 99% no treino vs 92% na validação indica tendência ao <strong>sobreajuste</strong> do Random Forest, requerendo hiperparâmetros restritos para produção.
            </div>
          </div>
        );
      case "leakage":
        return (
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-3.5">
            <h4 className="text-xs text-rose-400 uppercase tracking-widest font-mono font-semibold">
              DIAGNÓSTICO: VAZAMENTO E DADOS FUTUROS
            </h4>

            <div className="space-y-2.5">
              <div className="bg-rose-950/10 border border-rose-500/10 p-3 rounded-lg">
                <span className="text-[10px] text-rose-400 font-mono uppercase font-bold block mb-1">🔴 ALERTA DE TARGET LEAKAGE</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong>Lifetime</strong> e <strong>Month_to_end_contract</strong> carregam o relógio do Churn de forma retroativa. Se medidos no momento zero, eles geram falsos acertos de laboratório.
                </p>
              </div>

              <div className="bg-amber-950/10 border border-amber-500/10 p-3 rounded-lg">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block mb-1">⚠️ EXIGÊNCIA DE INFORMAÇÕES FUTURAS</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong>Avg_class_frequency_current_month</strong> exige que o mês já tenha sido encerrado. No dia a dia operacional, tentar prever com essa variável pressupõe ter dados que só existirão no futuro.
                </p>
              </div>

              <div className="bg-emerald-950/15 border border-emerald-500/10 p-3 rounded-lg">
                <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block mb-1">✅ SOLUÇÃO PROPAGADA EM PRODUÇÃO</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Mapear comportamentos em janelas deslizantes (rolling statistics) de 14 dias em vez de médias mensais absolutas e remover variáveis associadas ao fim programado.
                </p>
              </div>
            </div>
          </div>
        );
      case "mitigation":
        return (
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs text-emerald-400 uppercase tracking-widest font-mono font-semibold">
              BLINDAGEM CONTRA DISTORÇÕES TEMPORAIS
            </h4>

            <div className="space-y-3">
              {/* Feature 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-red-950/10 border border-rose-500/10 p-2.5 rounded-lg">
                  <span className="text-[9px] text-red-400 font-mono uppercase font-bold block mb-0.5">Vulnerabilidade (Leakage)</span>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight">
                    <strong>Lifetime total</strong> e contadores de fim de contrato revelam retroativamente a data exata do cancelamento da matrícula.
                  </p>
                </div>
                <div className="bg-emerald-950/15 border border-emerald-500/10 p-2.5 rounded-lg">
                  <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold block mb-0.5">Engenharia Anti-Vazamento</span>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    Substituído por <strong>janelas históricas truncadas</strong> e faixas de criticidade que analisam somente o comportamento retroativo consolidado.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-red-950/10 border border-rose-500/10 p-2.5 rounded-lg">
                  <span className="text-[9px] text-red-400 font-mono uppercase font-bold block mb-0.5">Dependência Futura</span>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight">
                    <strong>Frequência do mês corrente</strong> assume o fechamento de um período que ainda não terminou na data de consulta operacional.
                  </p>
                </div>
                <div className="bg-emerald-950/15 border border-emerald-500/10 p-2.5 rounded-lg">
                  <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold block mb-0.5">Engenharia Anti-Vazamento</span>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">
                    Substituído por <strong>médias deslizantes (rolling statistics)</strong> baseadas nos acessos reais de catraca nos últimos 14 dias de treino.
                  </p>
                </div>
              </div>

              <div className="bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-500/10 text-[10px] text-slate-400 font-sans leading-relaxed text-center">
                🛡️ Com essas salvaguardas, as predições de Churn do simulador são <strong>operáveis em tempo real</strong> a qualquer dia, sem risco de viés retrospectivo.
              </div>
            </div>
          </div>
        );
      case "general":
      case "actions":
      default:
        // Qualitative slide: render KPI metric cards
        return (
          <div className="grid grid-cols-2 gap-4 h-full align-middle my-auto py-4">
            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">AMOSTRA INVESTIGADA</span>
                <span className="text-2xl font-extrabold text-slate-100 font-mono">4.000</span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-sans mt-2">Prontuários eletrônicos completos e históricos de catracas.</p>
            </div>

            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-rose-500 uppercase block">CHURN GLOBAL</span>
                <span className="text-2xl font-extrabold text-rose-400 font-mono">26,52%</span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-sans mt-2">Vazamento expressivo de alunos ativos no ciclo faturado.</p>
            </div>

            <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between col-span-2">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase block">VALOR ECONÔMICO SECUNDÁRIO</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">R$ 146,94 / aluno</span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Faturamento extra médio recorrente (café, suplementos, massagem) que se perde integralmente na saída do cliente.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-350 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/60 bg-slate-900/45 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-slate-100 font-mono font-black border border-indigo-500 shadow-md">
              FM
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 tracking-tight font-sans">
                Academia FitMetrics™
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Análise Preditiva de Churn & Retenção
              </p>
            </div>
          </div>

          {/* Quick Metrics (KPIs) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-xs text-slate-400 font-mono">
                Churn Global: <strong>26.5%</strong>
              </span>
            </div>
            <div className="bg-slate-850 h-6 w-px"></div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              <span className="text-xs text-slate-400 font-mono">
                N Amostra: <strong>4.000 clientes</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Welcome / Presentation Title */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-850/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full font-mono font-semibold border border-indigo-500/15">
              ESTUDO DE COMUNICABILIDADE DOS DADOS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight mt-3 font-sans">
              História Analítica de Churn
            </h2>
          </div>

          {/* View Mode Controllers */}
          <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab("deck")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === "deck"
                  ? "bg-indigo-600 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BarChart3 size={13} />
              Pitch Deck (8 Slides)
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-indigo-600 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders size={13} />
              Simulador What-If
            </button>

            <button
              onClick={() => setActiveTab("dataset")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === "dataset"
                  ? "bg-indigo-600 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database size={13} />
              Dicionário
            </button>

            <button
              onClick={() => setActiveTab("helper")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                activeTab === "helper"
                  ? "bg-indigo-600 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot size={13} />
              Chat Analista IA
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "deck" && (
          <div className="space-y-8">
            {/* Interactive Pitch Deck Slide */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0f172a] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Background gradient flare */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Slide Meta and Content Panel */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md font-mono font-semibold px-2.5 py-1">
                      {currentSlide.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      SLIDE {currentSlide.id} de {slides.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold font-sans text-slate-100 tracking-tight leading-tight">
                      {currentSlide.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-400 font-sans leading-relaxed">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                    {currentSlide.description}
                  </p>

                  {/* Bullet Bullet point Insights */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest font-mono">
                      Pontos Analíticos Críticos:
                    </h4>
                    <ul className="space-y-2">
                      {currentSlide.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs text-slate-400 font-sans">
                          <span className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-semibold shrink-0">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Controls of Slide */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-900/70">
                  <div className="flex gap-1">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlideIndex(i)}
                        className={`transition-all rounded-full ${
                          currentSlideIndex === i 
                            ? "w-8 h-2.5 bg-indigo-500" 
                            : "w-2.5 h-2.5 bg-slate-800 hover:bg-slate-700"
                        } cursor-pointer`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={prevSlide}
                      className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 rounded-xl transition cursor-pointer"
                      title="Slide Anterior"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:border-indigo-400 text-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                    >
                      Próximo
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Slide Graphic Panel */}
              <div className="lg:col-span-5 flex flex-col justify-center min-h-[300px]">
                {renderSlideChart(currentSlide.visualType)}
              </div>
            </div>

            {/* Sub banner providing quick links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab("simulator")}
                className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-400">
                    <Sliders size={20} />
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mt-4 font-sans">Simule Riscos de Treino</h4>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  Ajuste tempo de casa e frequência de treinos semanais para ver a mudança imediata no churn.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("dataset")}
                className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-indigo-400">
                    <Database size={20} />
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mt-4 font-sans">Dicionário do Dataset</h4>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  Inspecione médias, desvios e coeficientes de correlação de cada atributo do arquivo.
                </p>
              </div>

              <div
                onClick={() => setActiveTab("helper")}
                className="bg-slate-900/40 hover:bg-slate-900/70 border border-slate-850 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-blue-400">
                    <Bot size={20} />
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mt-4 font-sans">Pergunte para a IA Analista</h4>
                <p className="text-xs text-slate-500 font-sans mt-1">
                  Tire dúvidas em tempo real utilizando o Gemini com inteligência dedicada do Colab.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "simulator" && <Simulator />}

        {activeTab === "dataset" && <DatasetExplorer />}

        {activeTab === "helper" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AIPanel />
            </div>

            {/* Informational Guideline alongside AI Chat */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-6">
              <div>
                <h4 className="text-xs text-indigo-300 font-bold uppercase tracking-wider block font-mono">Conceito Analítico</h4>
                <h3 className="text-sm font-bold text-slate-200 mt-1 font-sans">Sobre a Engenharia de Resolução</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mt-2">
                  No notebook Python, o grupo estruturou a matriz de correlação demonstrando que reter o cliente não depende de seu gênero ou telefone, mas sim do investimento afetivo/social e duração do plano financeiro contratado.
                </p>
              </div>

              <div className="border-t border-slate-850 pt-4 space-y-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Bibliotecas Usadas no Colab:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-200 font-bold block">pandas as pd</span>
                    Carga e limpeza
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-200 font-bold block">numpy as np</span>
                    Suporte algorítmico
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-200 font-bold block">matplotlib as plt</span>
                    Geração de canvas
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-850">
                    <span className="text-slate-200 font-bold block">seaborn as sns</span>
                    Heatmaps elegantes
                  </div>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 p-4 rounded-xl leading-relaxed font-sans">
                <strong>💡 Recomendação de Negócio:</strong>
                <p className="mt-1">
                  Seu faturamento de serviços auxiliares ($146,94 adicionais por aluno) age como um super multiplicador. Quanto maior o tempo de retenção do aluno na unidade, maior é a margem de lucro por metro quadrado alugado.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono">
          <div>
            <p>© 2026 FitMetrics™. Cópia de Dev MBA Grupo9. Todos os direitos reservados.</p>
            <p className="mt-0.5 text-[10px] text-slate-600">Desenvolvido com IA em conformidade com as conclusões científicas do estudo.</p>
          </div>

          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              22 de Maio de 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              04:18 UTC
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
