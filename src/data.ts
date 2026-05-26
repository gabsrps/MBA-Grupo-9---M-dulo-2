import { Slide, FeatureMetadata } from "./types";

export const slides: Slide[] = [
  {
    id: 1,
    category: "01 // O PROBLEMA",
    title: "Vazamento no Balde: Churn de 26.5% no Negócio",
    subtitle: "Quase 1 a cada 4 alunos da academia desiste do treino. Como estancar essa sangria?",
    description: "Análise realizada em uma base histórica robusta de para diagnosticar o comportamento de saída e traçar estratégias financeiras de mitigação.",
    keyInsights: [
      "Taxa de evasão (Churn) média de 26,52%, representando centenas de milhares em faturamento perdido.",
      
      "O custo de adquirir um novo aluno é até 5x superior a reter aqueles que já estão matriculados."
    ],
    visualType: "general"
  },
  {
    id: 2,
    category: "02 // INDICADORES CENTRAIS",
    title: "Atividade vs Evasão: A Frequência como Termômetro",
    subtitle: "A queda nas frequências semanais é a principal 'Red Flag' de que o aluno vai desistir.",
    description: "Ao correlacionar a frequência média histórica com as visitas semanais do último mês, descobrimos que os alunos inativos no último mês estão a um passo do Churn definitivo.",
    keyInsights: [
      "Média Geral de Visitas: 1,88 vezes por semana desde a matrícula.",
      "No último mês, a média de visitas dos alunos que deram churn desabou para apenas 1,05 visitas semanais.",
      "Manter o aluno vindo à academia mais de 2 vezes por semana garante taxa de evasão virtualmente nula."
    ],
    visualType: "demographic"
  },
  {
    id: 3,
    category: "03 // MAPA DE CORRELAÇÃO",
    title: "Quem e por que evade? As Três Grandes Alavancas",
    subtitle: "O heatmap matricial revela os três escudos matemáticos contra a perda de alunos.",
    description: "Análise quantitativa através de Matriz de Correlação Seaborn identificando o grau de dependência linear entre cada atributo e o status de evasão do cliente.",
    keyInsights: [
      "Lifetime (-0.44): Quanto mais tempo de casa (acima de 3 meses), menor o risco de debandar.",
      "Frequência Recente (-0.41): Menor frequência no mês corrente antecipa o abandono de forma confiável.",
      "Contratos Longos (-0.39) e Idade (-0.40): Clientes maduros ou com planos anuais fixados são extraordinariamente mais fiéis."
    ],
    visualType: "correlation"
  },
  {
    id: 4,
    category: "04 // ANÁLISE DOS PLANOS",
    title: "O Efeito Contrato: 1 Mês vs 12 Meses",
    subtitle: "Contratos mensais sofrem uma taxa devastadora de ~60% de churn. Plano anual reduz a zero.",
    description: "Visualização direta dos dados originais do Colab demonstra que a longevidade contratual impõe barreiras naturais contra a desistência psicológica de treino dos alunos.",
    keyInsights: [
      "Contrato Mensal (1 mês): Churn de mais de 60%. O aluno experimenta, desengaja e cancela rapidamente.",
      "Contrato Semestral (6 meses): Churn moderado de cerca de 25%.",
      "Contrato Anual (12 meses): Churn baixíssimo de 5% a 6%, blindando o fluxo de caixa fixo da academia."
    ],
    visualType: "contracts"
  },
  {
    id: 5,
    category: "05 // PLANO E ESTRATÉGIA",
    title: "Prescrição Baseada em Dados: Retenção Ativa",
    subtitle: "Transformando dados estatísticos em ações financeiras práticas para alavancar a receita.",
    description: "Estatísticas mostram que canais sociais (indicações de amigos) e incentivos corporativos criam círculos sociais de convivência na academia, derrubando o churn pela metade.",
    keyInsights: [
      "Acionar Campanhas Sociais: Programa 'Promo Amigos' reduz churn atual em mais de 16% agregados.",
      "Alerta de Churn Automatizado: Intervir proativamente via WhatsApp se a frequência semanal cair abaixo de 1.5.",
      "Campanha de Up-Selling: Oferecer incentivo financeiro para conversão rápida de contratos de 1 mês para 12 meses."
    ],
    visualType: "actions"
  }
];

export const featuresMetadata: FeatureMetadata[] = [
  {
    key: "gender",
    label: "Gênero do Aluno",
    mean: "0,51 (Masc.)",
    std: "0,50",
    correlation: 0.00,
    description: "Indicador binário de gênero do cliente. Não demonstra correlação ou impacto estatístico direto sobre a retenção ou evasão.",
    type: "binary"
  },
  {
    key: "Near_Location",
    label: "Proximidade de Localização",
    mean: "84,5%",
    std: "0,36",
    correlation: -0.13,
    description: "Se o aluno reside ou trabalha nas proximidades da unidade. Distâncias menores se traduzem em maior comodidade de frequência física.",
    type: "binary"
  },
  {
    key: "Partner",
    label: "Convênio Corporativo",
    mean: "48,7%",
    std: "0,50",
    correlation: -0.16,
    description: "Indica se o cliente faz parte de uma empresa parceira com descontos corporativos subsidiados. Reduz probabilidade de churn.",
    type: "binary"
  },
  {
    key: "Promo_friends",
    label: "Traga Amigo (Promo)",
    mean: "30,8%",
    std: "0,46",
    correlation: -0.16,
    description: "Se o cadastro utilizou códigos promocionais de indicação de amigos. Alunos que treinam acompanhados criam vínculos de grupo.",
    type: "binary"
  },
  {
    key: "Phone",
    label: "Telefone Cadastrado",
    mean: "90,3%",
    std: "0,29",
    correlation: 0.00,
    description: "Se o cadastro possui um número móvel válido registrado para contato ativo e disparos promocionais/alertas.",
    type: "binary"
  },
  {
    key: "Contract_period",
    label: "Período do Contrato (Meses)",
    mean: "4,68 meses",
    std: "4,55",
    correlation: -0.39,
    description: "Ciclo de faturamento acordado (1, 6 ou 12 meses). É um dos pilares de sustentabilidade e barreira direta contra Churn.",
    type: "numerical"
  },
  {
    key: "Group_visits",
    label: "Visita em Grupo",
    mean: "41,2%",
    std: "0,49",
    correlation: -0.18,
    description: "Representa a participação recorrente em aulas coletivas (Crossfit, Spinning, Ritmos). Promove engajamento psicossocial.",
    type: "binary"
  },
  {
    key: "Age",
    label: "Idade do Cliente",
    mean: "29,18 anos",
    std: "3,25",
    correlation: -0.40,
    description: "Idade cronológica do aluno (18 a 41). Alunos na faixa acima de 30 anos demonstram consistência e disciplina muito superior de treino.",
    type: "numerical"
  },
  {
    key: "Avg_additional_charges_total",
    label: "Gasto em Serviços Extras",
    mean: "$146,94",
    std: "$96,35",
    correlation: -0.20,
    description: "Despesas extras do aluno realizadas no ecossistema da academia (bebidas, lanchonete, produtos, massagens, vestuário).",
    type: "numerical"
  },
  {
    key: "Month_to_end_contract",
    label: "Meses para Fim Contrato",
    mean: "4,32 meses",
    std: "4,19",
    correlation: -0.38,
    description: "Tempo em meses restante para expirar o plano de contrato atual.",
    type: "numerical"
  },
  {
    key: "Lifetime",
    label: "Lifetime (Meses de Casa)",
    mean: "3,72 meses",
    std: "3,75",
    correlation: -0.44,
    description: "Tempo acumulado desde a primeira matrícula do cliente. Quem passa dos primeiros 3-4 meses consolida o hábito e estagna o churn.",
    type: "numerical"
  },
  {
    key: "Avg_class_frequency_total",
    label: "Freq. Semanal Histórica",
    mean: "1,88 aulas",
    std: "0,97",
    correlation: -0.38,
    description: "Frequência média de treinos semanais calculada desde o primeiro dia do cadastro do aluno na base de dados.",
    type: "numerical"
  },
  {
    key: "Avg_class_frequency_current_month",
    label: "Freq. Semanal Recente",
    mean: "1,76 aulas",
    std: "1,05",
    correlation: -0.41,
    description: "Frequência média semanal apenas no último mês operado. Reduções bruscas indicam perda iminente de motivação (Sinal de Risco).",
    type: "numerical"
  }
];
