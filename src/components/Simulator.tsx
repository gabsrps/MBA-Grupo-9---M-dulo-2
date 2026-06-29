import React, { useState, useEffect } from "react";
import { GymProfile, SimulationResult } from "../types";
import { Sliders, RefreshCw, AlertTriangle, ShieldCheck, DollarSign, Users, Database, HelpCircle, BarChart3, Scale, Brain } from "lucide-react";

export default function Simulator() {
  const [profile, setProfile] = useState<GymProfile>({
    contractPeriod: 1,
    avgFrequencyCurrent: 1.2,
    age: 25,
    groupVisits: false,
    promoFriends: false,
    lifetime: 1
  });

  const [result, setResult] = useState<SimulationResult>({
    churnProbability: 68.2,
    estimatedUserLoss: 682,
    financialCost: 134313.08
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"comparison" | "metrics" | "differences">("comparison");

  // Function to run fast local simulation calculations for instant UX + API fallback sync
  const calculateChurn = async (currentProfile: GymProfile) => {
    try {
      setLoading(true);
      const res = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProfile)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Fallback calculation directly in frontend if backend is offline
        runOfflineFallback(currentProfile);
      }
    } catch (e) {
      runOfflineFallback(currentProfile);
    } finally {
      setLoading(false);
    }
  };

  const runOfflineFallback = (p: GymProfile) => {
    let logit = 1.8;
    if (p.contractPeriod === 1) logit += 1.2;
    else if (p.contractPeriod === 6) logit -= 0.5;
    else if (p.contractPeriod === 12) logit -= 2.0;

    const freqDiff = p.avgFrequencyCurrent - 1.76;
    logit -= freqDiff * 1.5;

    const ageDiff = p.age - 29.18;
    logit -= ageDiff * 0.22;

    const lifetimeDiff = p.lifetime - 3.72;
    logit -= lifetimeDiff * 0.45;

    if (p.groupVisits) logit -= 0.6;
    if (p.promoFriends) logit -= 0.5;

    const prob = 1 / (1 + Math.exp(-logit));
    const cappedProb = Math.max(0.01, Math.min(0.99, prob));
    const loss = Math.round(1000 * cappedProb);
    const finance = loss * 196.94;

    setResult({
      churnProbability: parseFloat((cappedProb * 100).toFixed(1)),
      estimatedUserLoss: loss,
      financialCost: parseFloat(finance.toFixed(2))
    });
  };

  useEffect(() => {
    calculateChurn(profile);
  }, [profile]);

  const resetProfile = () => {
    setProfile({
      contractPeriod: 12,
      avgFrequencyCurrent: 2.5,
      age: 31,
      groupVisits: true,
      promoFriends: true,
      lifetime: 6
    });
  };

  // Determine status color and copy
  let statusColor = "text-red-400 border-red-500/20 bg-red-500/5";
  let bgProgressBar = "bg-red-500";
  let desc = "Risco Crítico. Características associadas a alunos novos de planos de curtíssimo prazo e baixíssimo engajamento.";

  if (result.churnProbability < 20) {
    statusColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    bgProgressBar = "bg-emerald-500";
    desc = "Perfil Seguro e Retido! Aluno altamente leal com excelente vínculo social e financeiro com a academia.";
  } else if (result.churnProbability < 45) {
    statusColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
    bgProgressBar = "bg-amber-400";
    desc = "Atenção Moderada. Apresenta alguns freios de evasão ativos, mas corre risco se a assiduidade semanal diminuir.";
  }

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-8">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 font-sans">
              <Sliders size={20} className="text-emerald-400" />
              Simulador de Churn Executivo Vitaliza
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Modele perfis hipotéticos de alunos (baseado na regressão estatística de 4.000 perfis) para prever o risco e as perdas.
            </p>
          </div>
          <button
            onClick={resetProfile}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3.5 rounded-lg border border-slate-700 transition-all cursor-pointer font-sans"
          >
            <RefreshCw size={13} />
            Resetar Ideal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Inputs */}
          <div className="space-y-5">
            {/* Contract Period */}
            <div>
              <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-2 font-sans">
                Período de Contrato do Aluno
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 6, 12].map((period) => (
                  <button
                    key={period}
                    onClick={() => setProfile((prev) => ({ ...prev, contractPeriod: period as 1 | 6 | 12 }))}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      profile.contractPeriod === period
                        ? "bg-indigo-600/20 text-indigo-300 border-indigo-500"
                        : "bg-slate-800/50 text-slate-400 border-slate-700/60 hover:bg-slate-800"
                    }`}
                  >
                    {period === 1 ? "1 Mês (Mensal)" : period === 6 ? "6 Meses" : "12 Meses (Anual)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Average Weekly visits current month */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-sans font-semibold mb-1">
                <span className="uppercase tracking-wider">Frequência Semanal Recente (Último Mês)</span>
                <span className="text-indigo-400 font-mono text-sm">{profile.avgFrequencyCurrent.toFixed(1)} treinos / sem</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="6.0"
                step="0.1"
                value={profile.avgFrequencyCurrent}
                onChange={(e) => setProfile((prev) => ({ ...prev, avgFrequencyCurrent: parseFloat(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 (Sedentário absoluto)</span>
                <span>1.8 (Média Geral)</span>
                <span>5.0+ (Atleta Diário)</span>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-sans font-semibold mb-1">
                <span className="uppercase tracking-wider">Idade do Aluno</span>
                <span className="text-indigo-400 font-mono text-sm">{profile.age} anos</span>
              </div>
              <input
                type="range"
                min="18"
                max="42"
                value={profile.age}
                onChange={(e) => setProfile((prev) => ({ ...prev, age: parseInt(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Jovem: 18 anos</span>
                <span>Média: 29 anos</span>
                <span>Maduro: 42 anos</span>
              </div>
            </div>

            {/* Lifetime Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-sans font-semibold mb-1">
                <span className="uppercase tracking-wider">Tempo de Relacionamento (Lifetime)</span>
                <span className="text-indigo-400 font-mono text-sm">{profile.lifetime} meses de casa</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={profile.lifetime}
                onChange={(e) => setProfile((prev) => ({ ...prev, lifetime: parseInt(e.target.value) }))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Novo: 0 meses</span>
                <span>Período Crítico: 1-3 meses</span>
                <span>Fidelizado: 6+ meses</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setProfile((prev) => ({ ...prev, groupVisits: !prev.groupVisits }))}
                className={`p-3 rounded-xl border text-xs font-semibold font-sans text-left flex flex-col transition-all cursor-pointer ${
                  profile.groupVisits
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                    : "bg-slate-800/30 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="opacity-65 text-[10px] uppercase font-mono mb-0.5">Visitas Grupo</span>
                <span>{profile.groupVisits ? "● Sim, Participa" : "○ Não Participa"}</span>
              </button>

              <button
                onClick={() => setProfile((prev) => ({ ...prev, promoFriends: !prev.promoFriends }))}
                className={`p-3 rounded-xl border text-xs font-semibold font-sans text-left flex flex-col transition-all cursor-pointer ${
                  profile.promoFriends
                    ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                    : "bg-slate-800/30 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <span className="opacity-65 text-[10px] uppercase font-mono mb-0.5">Promo Amigos</span>
                <span>{profile.promoFriends ? "● Sim, Indicado" : "○ Sem Promoção"}</span>
              </button>
            </div>
          </div>

          {/* Right Outputs */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Projected Churn Risk Meter */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">
                  PROBABILIDADE DE EVASÃO (CHURN PREDICTED)
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-extrabold text-slate-100 font-mono">
                    {result.churnProbability}%
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${statusColor}`}>
                    {result.churnProbability >= 45 ? "Alta" : result.churnProbability >= 20 ? "Média" : "Baixa"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full mt-3.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${bgProgressBar}`}
                    style={{ width: `${result.churnProbability}%` }}
                  />
                </div>
              </div>

              {/* Status explanation */}
              <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-700 pl-3 font-sans">
                {desc}
              </p>

              {/* Simulated financial damage */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1 font-sans">
                    <Users size={12} className="text-slate-500" />
                    Perda Mensal Estimada
                  </div>
                  <p className="text-lg font-bold text-slate-200 font-mono">
                    {result.estimatedUserLoss} <span className="text-xs text-slate-500 font-normal">/ 1000 alunos</span>
                  </p>
                </div>

                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1 font-sans">
                    <DollarSign size={12} className="text-emerald-500" />
                    Prejuízo Projetado
                  </div>
                  <p className="text-lg font-bold text-emerald-400 font-mono">
                    R$ {result.financialCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-4 mt-6 flex items-center gap-2 font-mono">
              {result.churnProbability >= 45 ? (
                <AlertTriangle size={12} className="text-red-500 animate-pulse" />
              ) : (
                <ShieldCheck size={12} className="text-emerald-500" />
              )}
              <span>
                {result.churnProbability >= 45 
                  ? "Dica: Tente mudar o plano para 12 meses e veja o risco despencar." 
                  : "Excelente! Esse perfil maximiza a saúde financeira da unidade."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW METRICAS / METODOLOGIA ACCORDION / TABS */}
      <div className="bg-slate-950/50 rounded-2xl border border-slate-800/80 p-5 mt-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[9px] text-indigo-400 font-mono uppercase font-bold tracking-widest block">
              VALIDAÇÃO E ENGENHARIA CIENTÍFICA
            </span>
            <h4 className="text-sm font-bold text-slate-200 mt-0.5 font-sans">
              Como funciona o modelo preditivo deste simulador?
            </h4>
          </div>
          <div className="flex gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("comparison")}
              className={`text-[10px] font-semibold font-sans px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeTab === "comparison"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Algoritmos
            </button>
            <button
              onClick={() => setActiveTab("metrics")}
              className={`text-[10px] font-semibold font-sans px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeTab === "metrics"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Métricas e Balanço
            </button>
            <button
              onClick={() => setActiveTab("differences")}
              className={`text-[10px] font-semibold font-sans px-2.5 py-1 rounded transition-all cursor-pointer ${
                activeTab === "differences"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Heurística vs IA
            </button>
          </div>
        </div>

        {/* Tab 1: Algorithm Comparison */}
        {activeTab === "comparison" && (
          <div className="space-y-3.5 animate-fadeIn">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              O simulador executa uma predição supervisionada baseada na probabilidade conjunta de um modelo de <strong>Regressão Logística</strong>, treinado em base histórica e validado para produção. Comparamos o comportamento de dois algoritmos concorrentes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="bg-slate-900/40 p-3.5 rounded-xl border border-indigo-500/20 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <Brain size={14} className="text-indigo-400" />
                    Regressão Logística (Produção)
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/10">Estável</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Opera calculando a distância sigmoidal multivariada. 
                  Fórmula de probabilidade aplicada:
                  <code className="block bg-slate-950/70 p-1.5 rounded text-[10px] font-mono text-indigo-300 my-1 overflow-x-auto">
                    P(Churn) = 1 / (1 + e^-(Intercepto + Coeficientes * Variáveis))
                  </code>
                  Evita o sobreajuste com alta explicabilidade matemática dos pesos de cada ação do aluno.
                </p>
              </div>

              <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <Brain size={14} className="text-slate-500" />
                    Random Forest (Alternativo)
                  </span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/10">Alto Overfitting</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Embora as árvores de decisão capturem correlações não lineares e ofereçam excelente ROC-AUC de laboratório, sem limites rígidos de profundidade há um sobreajuste crítico de treino (99%) vs validação (92%), limitando a estabilidade de predições reais.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Metrics and Imbalance */}
        {activeTab === "metrics" && (
          <div className="space-y-3.5 animate-fadeIn">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              O desbalanceamento de classes de Churn na base original (<strong>26,5% de evasão</strong> versus <strong>73,5% de retenção</strong>) é um fator de risco clássico em Ciência de Dados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Desbalanceamento</span>
                <span className="text-lg font-bold text-amber-400 font-mono mt-1 block">26,5% / 73,5%</span>
                <span className="text-[9px] text-slate-400 font-sans block mt-1 leading-normal">
                  Se o modelo ignorasse a classe menor, teria acurácia cega de 73%. Usamos pesos contrários na perda para corrigir o viés.
                </span>
              </div>
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">F1-Score (Classe Evasão)</span>
                <span className="text-lg font-bold text-indigo-400 font-mono mt-1 block">0.77 (Logística)</span>
                <span className="text-[9px] text-slate-400 font-sans block mt-1 leading-normal">
                  Média harmônica ideal entre precisão e revocação na classe de risco de saída, garantindo que falsos negativos sejam mitigados.
                </span>
              </div>
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">ROC-AUC Validação</span>
                <span className="text-lg font-bold text-emerald-400 font-mono mt-1 block">0.96 / 1.0</span>
                <span className="text-[9px] text-slate-400 font-sans block mt-1 leading-normal">
                  Capacidade quase perfeita de distinguir entre alunos leais e evasores em qualquer limiar, garantindo a solidez do simulador.
                </span>
              </div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 leading-relaxed font-sans">
              <strong>Como o Overfitting foi controlado?</strong> O modelo de Regressão Logística foi submetido a regularização L2 (Ridge) e validação cruzada k-fold. Isso garantiu que as acurácias obtidas na base de treinamento (~89.7%) fossem idênticas ao conjunto de validação cego (~89.5%), provando que o simulador não está decorando dados (overfitting).
            </div>
          </div>
        )}

        {/* Tab 3: Differences breakdown */}
        {activeTab === "differences" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              O simulador da Vitaliza diferencia-se de lógicas amadoras por substituir intuições comerciais brutas por estatística multivariada robusta. Entenda a diferença científica:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-slate-300 font-sans border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase font-mono text-[9px]">
                    <th className="py-2 pr-4 font-bold">Abordagem</th>
                    <th className="py-2 pr-4 font-bold">Como funciona</th>
                    <th className="py-2 pr-4 font-bold">Limitações e Riscos</th>
                    <th className="py-2 font-bold">Acurácia Teórica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr>
                    <td className="py-2 pr-4 font-bold text-amber-400">Análise Exploratória</td>
                    <td className="py-2 pr-4 text-slate-400">Revela correlações isoladas do passado (ex: &quot;alunos mais velhos saem menos&quot;).</td>
                    <td className="py-2 pr-4 text-slate-400">Isola as variáveis de forma univariada, ignorando interações dinâmicas conjuntas.</td>
                    <td className="py-2 font-mono text-slate-500">N/A (Informativo)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold text-orange-400">Regra Heurística</td>
                    <td className="py-2 pr-4 text-slate-400">Decisões fixas e baseadas na intuição operacional (ex: &quot;se faltar 12 dias consecutivos, ligue&quot;).</td>
                    <td className="py-2 pr-4 text-slate-400">Gera um volume alto de falsos positivos, agindo tarde demais (quando o churn já é iminente).</td>
                    <td className="py-2 font-mono text-slate-400">~60% - 65%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold text-emerald-400">Predição Supervisionada</td>
                    <td className="py-2 pr-4 text-slate-400">Modelo probabilístico treinado pesando todos os atributos conjuntamente e prevendo riscos preventivos.</td>
                    <td className="py-2 pr-4 text-slate-400">Exige infraestrutura de dados atualizados e monitoramento periódico de desvio de dados (drift).</td>
                    <td className="py-2 font-mono text-emerald-400 font-semibold">89.5% (Logística)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
