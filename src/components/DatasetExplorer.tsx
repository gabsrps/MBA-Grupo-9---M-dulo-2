import React, { useState } from "react";
import { featuresMetadata } from "../data";
import { FeatureMetadata } from "../types";
import { Database, Search, ArrowUpRight, ArrowDownRight, Minus, HelpCircle } from "lucide-react";

export default function DatasetExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<FeatureMetadata | null>(featuresMetadata[5]); // default to Contract_period

  const filteredFeatures = featuresMetadata.filter((f) =>
    f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 font-sans">
            <Database size={20} className="text-indigo-400" />
            Dicionário de Atributos do Google Colab
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Explore as 13 variáveis estatísticas extraídas de <span className="text-indigo-300 font-mono">gym_churn_us.csv</span> e veja sua relação direta com o Churn.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 focus:border-slate-700 text-xs text-slate-300 rounded-xl pl-9 pr-4 py-2 focus:outline-none"
            placeholder="Filtrar variáveis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredFeatures.map((f) => {
            const isSelected = selectedFeature?.key === f.key;
            // Determine correlation color
            const corrVal = Math.abs(f.correlation);
            let indicatorColor = "bg-slate-500";
            if (f.correlation < -0.3) indicatorColor = "bg-rose-500";
            else if (f.correlation < -0.1) indicatorColor = "bg-amber-500";
            else if (f.correlation === 0) indicatorColor = "bg-blue-500";

            return (
              <button
                key={f.key}
                onClick={() => setSelectedFeature(f)}
                className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 border-indigo-500 text-slate-100"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:bg-slate-950/80 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${indicatorColor}`} />
                  <div>
                    <p className="font-semibold text-slate-200">{f.label}</p>
                    <p className="font-mono text-[10px] text-slate-500">df.{f.key}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="opacity-60">corr:</span>
                  <span className={f.correlation < 0 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {f.correlation === 0 ? "0.00" : f.correlation.toFixed(2)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Details Card */}
        <div className="lg:col-span-7 bg-slate-950/55 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {selectedFeature ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
                    {selectedFeature.type.toUpperCase()}
                  </span>
                  <h4 className="text-sm font-bold text-slate-200 mt-1 font-sans">{selectedFeature.label}</h4>
                  <p className="text-[11px] text-indigo-400 font-mono">dataframe['{selectedFeature.key}']</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block font-sans">CORRELAÇÃO CHURN</span>
                  <span className={`text-base font-bold font-mono ${selectedFeature.correlation < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    {selectedFeature.correlation === 0 ? "0.00" : selectedFeature.correlation.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block font-mono">Média Amostral (Mean)</span>
                  <span className="text-sm font-bold text-slate-300 font-mono">{selectedFeature.mean}</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block font-mono">Desvio Padrão (std)</span>
                  <span className="text-sm font-bold text-slate-300 font-mono">{selectedFeature.std}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase block font-mono">Significado Analítico do Campo</span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{selectedFeature.description}</p>
              </div>

              {/* Impact Callout */}
              <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-850 flex items-start gap-2.5 font-sans">
                {selectedFeature.correlation < 0 ? (
                  <>
                    <ArrowDownRight className="text-rose-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-slate-400 leading-normal">
                      Esta variável possui correlação **negativa** direta com o Churn. Ou seja, quanto **MAIOR** faturamento/valor neste campo, **MENOR** é a tendência desse aluno desistir.
                    </p>
                  </>
                ) : selectedFeature.correlation > 0 ? (
                  <>
                    <ArrowUpRight className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-slate-400 leading-normal">
                      Esta variável possui correlação **positiva** com o Churn. Ou seja, valores altos estão teoricamente ligados à maior probabilidade de evasão.
                    </p>
                  </>
                ) : (
                  <>
                    <Minus className="text-blue-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-slate-400 leading-normal">
                      Correlação nula ou residual. Não há dependências matemáticas perceptíveis que relacionem esta variável diretamente com o status de evasão de forma simples.
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 font-sans">
              <HelpCircle size={32} className="text-slate-600 mb-2 stroke-1" />
              <span>Selecione uma variável para inspecionar os detalhes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
