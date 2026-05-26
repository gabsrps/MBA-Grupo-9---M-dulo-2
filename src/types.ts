export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  keyInsights: string[];
  visualType: "general" | "demographic" | "correlation" | "contracts" | "actions";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface GymProfile {
  contractPeriod: 1 | 6 | 12;
  avgFrequencyCurrent: number;
  age: number;
  groupVisits: boolean;
  promoFriends: boolean;
  lifetime: number;
}

export interface SimulationResult {
  churnProbability: number;
  estimatedUserLoss: number;
  financialCost: number;
}

export interface FeatureMetadata {
  key: string;
  label: string;
  mean: string | number;
  std: string | number;
  correlation: number;
  description: string;
  type: "binary" | "numerical";
}
