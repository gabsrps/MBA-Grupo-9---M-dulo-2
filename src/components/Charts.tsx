import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Data: Churn rate by Contract Period (1 month, 6 months, 12 months)
const contractPeriodData = [
  { name: "Mensal (1 Mês)", churnRate: 59.7, color: "#f87171" }, // high risk
  { name: "Semestral (6 Meses)", churnRate: 25.1, color: "#fbbf24" }, // medium risk
  { name: "Anual (12 Meses)", churnRate: 6.2, color: "#34d399" }, // low risk
];

// Data: Strongest Churn Predictors (Correlation weights)
const correlationData = [
  { name: "Tempo de Casa (Lifetime)", corr: -0.44, impact: "Extremamente Alto" },
  { name: "Frequência no Último Mês", corr: -0.41, impact: "Extremamente Alto" },
  { name: "Idade do Cliente", corr: -0.40, impact: "Alto" },
  { name: "Período do Contrato", corr: -0.39, impact: "Alto" },
  { name: "Frequência Histórica", corr: -0.38, impact: "Alto" },
  { name: "Meses para Fim do Plano", corr: -0.38, impact: "Alto" },
  { name: "Aulas de Grupo", corr: -0.18, impact: "Moderado" },
  { name: "Promoção de Recomendado", corr: -0.16, impact: "Moderado" },
  { name: "Desconto Corporativo", corr: -0.16, impact: "Moderado" },
];

// Data: Churn Risk by Weekly Training Frequency
const frequencyRiskData = [
  { visits: "0x / semana", risk: 85, color: "#ef4444" },
  { visits: "1x / semana", risk: 55, color: "#f59e0b" },
  { visits: "2x / semana", risk: 18, color: "#10b981" },
  { visits: "3x / semana", risk: 4, color: "#059669" },
  { visits: "4x+ / semana", risk: 1, color: "#047857" },
];

export function ContractChurnChart() {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={contractPeriodData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            formatter={(value) => [`${value}% de Churn`, "Taxa de Evasão"]}
          />
          <Bar dataKey="churnRate" radius={[6, 6, 0, 0]} barSize={50}>
            {contractPeriodData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CorrelationChart() {
  // Convert correlation for visual bar length while retaining the native negative value in tooltip
  const processedData = correlationData.map((item) => ({
    ...item,
    val: Math.abs(item.corr) * 100, // percentage for aesthetic UI bar
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={processedData}
          margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" horizontal={false} />
          <XAxis
            type="number"
            stroke="#94a3b8"
            fontSize={11}
            domain={[0, 50]}
            tickFormatter={(v) => `-${(v / 100).toFixed(2)}`}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#e2e8f0"
            fontSize={11}
            width={120}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            formatter={(value: any, name, props) => {
              const corrVal = -parseFloat((Number(value) / 100).toFixed(2));
              return [`${corrVal}`, `Força da Correlação (${props.payload.impact})`];
            }}
          />
          <Bar dataKey="val" radius={[0, 4, 4, 0]} fill="#3b82f6" barSize={12}>
            {processedData.map((entry, index) => {
              // highlight highest correlations in rose / violet
              const col = Math.abs(entry.corr) >= 0.39 ? "#6366f1" : "#3b82f6";
              return <Cell key={`cell-${index}`} fill={col} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FrequencyRetentionChart() {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={frequencyRiskData}
          margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" vertical={false} />
          <XAxis
            dataKey="visits"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            formatter={(value) => [`${value}% de Risco`, "Probabilidade de Evasão"]}
          />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#ec4899"
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 2, fill: "#1e293b" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
