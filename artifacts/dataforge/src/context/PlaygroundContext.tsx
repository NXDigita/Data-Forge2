import { createContext, useContext, useState } from "react";

export type ModelType = "XGBoost" | "Random Forest" | "Logistic Regression";

export interface HyperParams {
  nEstimators: number;
  maxDepth: number;
  learningRate: number;
  subsample: number;
  testSize: number;
  smote: boolean;
  cParam: number;
  maxIter: number;
}

export interface PlaygroundConfig {
  datasetId: string;
  selectedModel: ModelType;
  activeFeatures: string[];
  params: HyperParams;
}

export interface PlaygroundResults {
  auc: number;
  f1: number;
  accuracy: number;
  precision: number;
  recall: number;
  score: number;
}

interface PlaygroundContextValue {
  config: PlaygroundConfig;
  results: PlaygroundResults | null;
  applied: boolean;
  setConfig: (c: PlaygroundConfig) => void;
  setResults: (r: PlaygroundResults | null) => void;
  applyToLab: () => void;
  clearApplied: () => void;
}

const defaultParams: HyperParams = {
  nEstimators: 300,
  maxDepth: 6,
  learningRate: 0.05,
  subsample: 0.8,
  testSize: 0.2,
  smote: true,
  cParam: 1.0,
  maxIter: 1000,
};

const defaultConfig: PlaygroundConfig = {
  datasetId: "ML-CHURN-003",
  selectedModel: "XGBoost",
  activeFeatures: [
    "tenure", "MonthlyCharges", "TotalCharges", "Contract",
    "InternetService", "OnlineSecurity", "TechSupport", "StreamingTV",
    "StreamingMovies", "DeviceProtection", "OnlineBackup", "PhoneService",
    "MultipleLines", "PaperlessBilling", "PaymentMethod",
  ],
  params: defaultParams,
};

const PlaygroundContext = createContext<PlaygroundContextValue | null>(null);

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PlaygroundConfig>(defaultConfig);
  const [results, setResults] = useState<PlaygroundResults | null>(null);
  const [applied, setApplied] = useState(false);

  const applyToLab = () => setApplied(true);
  const clearApplied = () => setApplied(false);

  return (
    <PlaygroundContext.Provider value={{ config, results, applied, setConfig, setResults, applyToLab, clearApplied }}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const ctx = useContext(PlaygroundContext);
  if (!ctx) throw new Error("usePlayground must be used inside PlaygroundProvider");
  return ctx;
}

export { defaultParams };
