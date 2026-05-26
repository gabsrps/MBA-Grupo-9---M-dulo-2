import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on server level
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System Instruction detailing the Gym Churn analysis for 4,000 members
const systemInstruction = `
Você é o Analista Recomendador IA Especialista de Dados..

Dados Gerais sobre o Dataset Analisado:
- Tamanho da Amostra: 4.000 clientes da academia.
- Churn Médio Global: 26,52% (um gargalo significativo para o negócio!).
- Variáveis Demográficas e Perfil:
  - Gênero (gender): distribuído de forma equilibrada (~51% masculino/1, ~49% feminino/0). Não possui correlação significativa com churn (-0,00).
  - Proximidade da Localização (Near_Location): 84,52% moram ou trabalham perto da academia. Tem correlação negativa leve com o Churn (-0,13).
  - Parcerias Corporativas (Partner): 48,67% são funcionários de empresas parceiras. Reduz o Churn (-0,16).
  - Promoção Traga um Amigo (Promo_friends): 30,85% cadastros via indicação direta de amigos. Reduz o Churn (-0,16).
  - Telefone cadastrado (Phone): 90,35% registraram o celular.
  - Período do Contrato (Contract_period): Média de 4,68 meses. Alunos possuem contratos de 1, 6 ou 12 meses. É um dos maiores fatores de retenção (-0,39).
  - Participação em Aulas de Grupo (Group_visits): 41,22% participam. Reduz o Churn (-0,18).
  - Idade (Age): Média de 29,18 anos (de 18 a 41 anos). Alunos mais velhos são mais estáveis e têm muito menor churn (-0,40).
  - Gasto Adicional Médio (Avg_additional_charges_total): $146,94 em média por cliente (gastos em massagem, café, suplementos, etc). Quem gasta mais no ecossistema tende a evadir menos (-0,20).
  - Meses para o Fim do Contrato (Month_to_end_contract): Média de 4,32 meses.
  - Tempo de Relacionamento (Lifetime): Média de 3,72 meses contratados (0 a 31 meses). Extremamente correlacionado negativamente com o Churn (-0,44).
  - Frequência Total de Aulas (Avg_class_frequency_total): Média de 1,88 visitas semanais.
  - Frequência Recente no Último Mês (Avg_class_frequency_current_month): Média de 1,76 visitas semanais. Uma queda expressiva é o principal sinal vermelho (red flag) de churn (-0,41).

Correlações Fortes contra o Churn (Mitigadores de Evasão):
1. Lifetime (-0,44): Alunos que passam dos primeiros 3 meses possuem risco de churn drasticamente menor.
2. Frequência Frequente Recente (-0,41): Alunos que treinaram menos vezes na semana no último mês correm altíssimo risco de evasão.
3. Idade (-0,40): Clientes abaixo de 26-28 anos têm maior probabilidade de desistência.
4. Tipo do Contrato (-0,39): Contratos curtos (mensal) têm taxa de churn absurda de ~60%, enquanto contratos de 12 meses têm taxa menor que 10%.

Plano de Ação Estratégico Recomendado:
- Alerta Vermelho de Frequência: Automatizar avisos/ofertas quando a frequência de treino de um aluno cair no último mês.
- Incentivo de Contratos Longos: Oferecer descontos agressivos para migração de planos de 1 mês para 6 ou 12 meses.
- Programas de Indicação corporativa e de amigos: Fortalecer parcerias e recompensar quem treina em grupo ou traz amigos, criando laço social que fixa o aluno.
- Melhorar integração de jovens (onboarding dedicado para o público de menor idade).

Instruções para Resposta:
- Sempre responda em Português brasileiro (PT-BR), com tom profissional, executivo, focado em negócios, insights de dados e finanças da rede de academias.
- Use tabelas, emoticons discretos, marcadores detalhados e referências ao estudo analítico original com as exatas porcentagens e dados mostrados no Colab para dar credibilidade absoluta ao usuário.
- Destaque o impacto financeiro de reter clientes de $146 adicionais contra a perda sistemática (gargalo de 26,5% de churn).
- Se questionado sobre os dados e códigos, mencione as bibliotecas Python usadas no notebook (Pandas, Numpy, Seaborn e Matplotlib para visualizações).
`;

// API route for chat with the AI analyst
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Mensagens inválidas no corpo da requisição." });
    }

    if (!ai) {
      return res.status(200).json({
        response: "Olá! O serviço de IA da FitMetrics está operando de forma simulada no momento porque a chave de API GEMINI_API_KEY não foi configurada nos segredos ou no ambiente. No entanto, posso responder suas dúvidas utilizando minha base analítica integrada offline! Pergunte-me qualquer detalhe científico sobre o projeto de Churn.",
        isMock: true
      });
    }

    // Prepare content format for @google/genai
    // Transform messages to the target schema matching GoogleGenAI
    // The format is: contents: string or { parts: [{text: ...}] }
    // Let's formulate a unified prompt combining conversation history
    let promptHistory = "Histórico de Conversação:\n";
    messages.forEach((m: any) => {
      const speaker = m.role === "user" ? "Usuário" : "Analista IA";
      promptHistory += `${speaker}: ${m.content}\n`;
    });
    promptHistory += "\nResponda ao último questionamento do Usuário sob a luz das diretrizes.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const aiText = response.text || "Sem resposta gerada.";
    return res.json({ response: aiText, isMock: false });
  } catch (err: any) {
    console.error("Erro na rota do Gemini:", err);
    return res.status(500).json({ error: "Erro interno ao processar a requisição com o Gemini API.", details: err.message });
  }
});

// Endpoint for the simulation baseline calculations
// Simple analytical formula derived from the dataset stats to estimate Churn of a custom gym member profile
app.post("/api/simulator", (req, res) => {
  const {
    contractPeriod,      // 1, 6 or 12
    avgFrequencyCurrent, // float weekly visits (0.0 to 7.0)
    age,                 // integer (18 to 41)
    groupVisits,         // boolean / binary (0 or 1)
    promoFriends,        // boolean / binary (0 or 1)
    lifetime             // months stayed (0 to 12)
  } = req.body;

  // Let's compute a mock churn probability utilizing a logistic regression proxy approximating the correlation matrix
  // baseline logit intercept
  let logit = 1.8;

  // impact of Contract Period (strong negative)
  // 1 month is bad, 6 months medium, 12 months is great
  if (contractPeriod === 1) logit += 1.2;
  else if (contractPeriod === 6) logit -= 0.5;
  else if (contractPeriod === 12) logit -= 2.0;

  // impact of Average Frequency in current month (strong negative)
  // baseline is 1.76 visits/week.
  const freqDiff = avgFrequencyCurrent - 1.76;
  logit -= freqDiff * 1.5;

  // impact of Age (negative, average in analysis is 29.18)
  const ageDiff = age - 29.18;
  logit -= ageDiff * 0.22;

  // impact of Loyalty / Lifetime (strong negative, average is 3.72)
  const lifetimeDiff = lifetime - 3.72;
  logit -= lifetimeDiff * 0.45;

  // impact of Group Visits
  if (groupVisits === 1 || groupVisits === true) {
    logit -= 0.6;
  }

  // impact of Promo friends
  if (promoFriends === 1 || promoFriends === true) {
    logit -= 0.5;
  }

  // logistic link function
  const churnProbability = 1 / (1 + Math.exp(-logit));

  // Cap them reasonably
  const finalProbability = Math.max(0.01, Math.min(0.99, churnProbability));

  // Calculate retention & financial impact
  // If baseline gym size = 1000 users, and each retained user brings $146.94 spent, and membership is say $50.
  // We can calculate dynamic financial retention potential
  const estimatedUserLoss = Math.round(1000 * finalProbability);
  const financialCost = estimatedUserLoss * 196.94; // membership fee + extra charges

  return res.json({
    churnProbability: parseFloat((finalProbability * 100).toFixed(1)),
    estimatedUserLoss,
    financialCost: parseFloat(financialCost.toFixed(2))
  });
});

// Vite middleware flow
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Import Vite on-the-fly to be dev-safe
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serving built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FitMetrics Server] rodando na porta ${PORT} como ${process.env.NODE_ENV || "development"}`);
  });
};

startServer().catch((err) => {
  console.error("Falha ao iniciar o servidor express:", err);
});
