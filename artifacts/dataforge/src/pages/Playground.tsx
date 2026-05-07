import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Play, Send, RotateCcw, Info, ChevronRight,
  Upload, FileText, FileSpreadsheet, X, CheckCircle2, AlertCircle,
} from "lucide-react";
import Papa from "papaparse";
import { usePlayground, ModelType, HyperParams, defaultParams } from "../context/PlaygroundContext";

/* ─── Built-in feature list (Churn dataset) ─────────────────────────── */
const ALL_FEATURES = [
  { name: "tenure", importance: 0.28, dtype: "int64" },
  { name: "MonthlyCharges", importance: 0.21, dtype: "float64" },
  { name: "TotalCharges", importance: 0.18, dtype: "float64" },
  { name: "Contract", importance: 0.12, dtype: "object" },
  { name: "InternetService", importance: 0.10, dtype: "object" },
  { name: "OnlineSecurity", importance: 0.09, dtype: "object" },
  { name: "TechSupport", importance: 0.07, dtype: "object" },
  { name: "StreamingTV", importance: 0.06, dtype: "object" },
  { name: "StreamingMovies", importance: 0.05, dtype: "object" },
  { name: "DeviceProtection", importance: 0.05, dtype: "object" },
  { name: "OnlineBackup", importance: 0.04, dtype: "object" },
  { name: "PhoneService", importance: 0.03, dtype: "object" },
  { name: "MultipleLines", importance: 0.03, dtype: "object" },
  { name: "PaperlessBilling", importance: 0.02, dtype: "object" },
  { name: "PaymentMethod", importance: 0.02, dtype: "object" },
  { name: "gender", importance: 0.01, dtype: "object" },
  { name: "SeniorCitizen", importance: 0.01, dtype: "int64" },
  { name: "Partner", importance: 0.01, dtype: "object" },
  { name: "Dependents", importance: 0.01, dtype: "object" },
];

const BUILTIN_DATASETS = [
  { id: "ML-CHURN-003", label: "Customer Churn", file: "telecom_churn.csv", rows: 7043, features: 19, target: "Churn", posRate: 26.5, domain: "ML" },
  { id: "NLP-SENT-007", label: "Twitter Sentiment", file: "twitter_sentiment.csv", rows: 14891, features: 12, target: "Sentiment", posRate: 42.1, domain: "NLP" },
  { id: "ML-FRAUD-005", label: "Credit Fraud", file: "credit_fraud.csv", rows: 284807, features: 30, target: "Fraud", posRate: 0.17, domain: "ML" },
];

const MODELS: ModelType[] = ["XGBoost", "Random Forest", "Logistic Regression"];

/* ─── Types ──────────────────────────────────────────────────────────── */
interface ParsedFeature { name: string; importance: number; dtype: string; }
interface UploadedDataset {
  id: string;
  fileName: string;
  fileType: "csv" | "pdf";
  rows: number;
  features: ParsedFeature[];
  target: string;
  posRate: number;
  preview: string[][];
}
type UploadState = "idle" | "parsing" | "done" | "error";

/* ─── Helpers ────────────────────────────────────────────────────────── */
function inferDtype(values: string[]): string {
  const sample = values.slice(0, 20).filter(Boolean);
  if (sample.every((v) => !isNaN(Number(v)))) {
    return sample.some((v) => v.includes(".")) ? "float64" : "int64";
  }
  return "object";
}

function estimateImportance(idx: number, total: number): number {
  return +(0.3 * Math.exp(-idx / (total * 0.4))).toFixed(3);
}

function estimateMetrics(model: ModelType, params: HyperParams, numFeatures: number) {
  const base = model === "XGBoost"
    ? { auc: 0.921, f1: 0.861, acc: 0.882, prec: 0.874, rec: 0.849 }
    : model === "Random Forest"
    ? { auc: 0.898, f1: 0.842, acc: 0.869, prec: 0.856, rec: 0.828 }
    : { auc: 0.843, f1: 0.792, acc: 0.814, prec: 0.801, rec: 0.783 };

  const composite =
    (Math.min(params.maxDepth / 6, 1.05) - 0.025) *
    (model !== "Logistic Regression" ? Math.min(params.nEstimators / 300, 1.02) - 0.01 : 1) *
    (numFeatures >= 10 ? 1 : 0.97 + (numFeatures / 10) * 0.03) *
    (params.smote ? 1 : 0.96) *
    (model === "XGBoost" ? (params.learningRate <= 0.1 ? 1 : 0.98) : 1);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const auc = clamp(+(base.auc * composite).toFixed(3), 0.6, 0.99);
  const f1 = clamp(+(base.f1 * composite).toFixed(3), 0.5, 0.97);
  const accuracy = clamp(+(base.acc * composite).toFixed(3), 0.5, 0.97);
  const precision = clamp(+(base.prec * composite).toFixed(3), 0.5, 0.97);
  const recall = clamp(+(base.rec * composite).toFixed(3), 0.5, 0.97);
  const score = Math.round((auc * 40 + f1 * 40 + accuracy * 20) * 100);
  return { auc, f1, accuracy, precision, recall, score };
}

/* ─── Sub-components ─────────────────────────────────────────────────── */
function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#8B949E]">{label}</span>
        <span className="font-mono text-[#22D3EE]">{format ? format(value) : value}</span>
      </div>
      <div className="relative h-2 bg-[#21262D] rounded-full">
        <div className="absolute h-full bg-[#7C3AED] rounded-full" style={{ width: `${pct}%` }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          data-testid={`slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#484F58] font-mono mt-1">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function Playground() {
  const { config, setConfig, results, setResults, applyToLab } = usePlayground();
  const [, setLocation] = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [search, setSearch] = useState("");

  /* upload state */
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState("");
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* resolve active dataset */
  const builtinDs = BUILTIN_DATASETS.find((d) => d.id === config.datasetId);
  const uploadedDs = uploadedDatasets.find((d) => d.id === config.datasetId);

  const activeFeatureList: ParsedFeature[] = uploadedDs
    ? uploadedDs.features
    : builtinDs
    ? (builtinDs.id === "ML-CHURN-003" ? ALL_FEATURES : ALL_FEATURES.slice(0, builtinDs.features))
    : ALL_FEATURES;

  const dsRows = uploadedDs?.rows ?? builtinDs?.rows ?? 0;
  const dsFeatureCount = activeFeatureList.length;
  const dsTarget = uploadedDs?.target ?? builtinDs?.target ?? "—";
  const dsPosRate = uploadedDs?.posRate ?? builtinDs?.posRate ?? 50;
  const dsFileName = uploadedDs?.fileName ?? builtinDs?.file ?? "";
  const dsPreview = uploadedDs?.preview ?? [];

  /* ── CSV parser ─────────────────────────────────────────────────── */
  const parseCSV = useCallback((file: File) => {
    setUploadState("parsing");
    setUploadError("");

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      preview: 2000,
      complete(results) {
        const fields = results.meta.fields ?? [];
        if (fields.length < 2) {
          setUploadError("CSV must have at least 2 columns.");
          setUploadState("error");
          return;
        }

        const rows = results.data;
        const rowCount = rows.length;

        /* pick target as last column, rest as features */
        const targetCol = fields[fields.length - 1];
        const featureCols = fields.slice(0, -1);

        const features: ParsedFeature[] = featureCols.map((col, i) => ({
          name: col,
          importance: estimateImportance(i, featureCols.length),
          dtype: inferDtype(rows.map((r) => r[col] ?? "")),
        }));

        /* estimate class balance from target column */
        const targetVals = rows.map((r) => r[targetCol] ?? "");
        const unique = [...new Set(targetVals)];
        const posVal = unique[0];
        const posRate = +((targetVals.filter((v) => v === posVal).length / rowCount) * 100).toFixed(1);

        /* build 5-row preview */
        const previewRows = rows.slice(0, 5).map((r) => fields.map((f) => r[f] ?? ""));

        const ds: UploadedDataset = {
          id: `upload-${Date.now()}`,
          fileName: file.name,
          fileType: "csv",
          rows: rowCount,
          features,
          target: targetCol,
          posRate,
          preview: [fields, ...previewRows],
        };

        setUploadedDatasets((prev) => [...prev, ds]);
        setConfig({
          ...config,
          datasetId: ds.id,
          activeFeatures: features.map((f) => f.name),
        });
        setResults(null);
        setHasRun(false);
        setUploadState("done");
      },
      error(err) {
        setUploadError(err.message);
        setUploadState("error");
      },
    });
  }, [config, setConfig, setResults]);

  /* ── PDF simulator ──────────────────────────────────────────────── */
  const simulatePDF = useCallback((file: File) => {
    setUploadState("parsing");
    setUploadError("");

    /* Simulate table extraction from PDF (no backend available) */
    setTimeout(() => {
      const syntheticFeatures: ParsedFeature[] = [
        { name: "feature_1", importance: 0.25, dtype: "float64" },
        { name: "feature_2", importance: 0.18, dtype: "float64" },
        { name: "feature_3", importance: 0.14, dtype: "int64" },
        { name: "feature_4", importance: 0.11, dtype: "object" },
        { name: "feature_5", importance: 0.09, dtype: "float64" },
        { name: "feature_6", importance: 0.08, dtype: "object" },
        { name: "feature_7", importance: 0.07, dtype: "int64" },
        { name: "feature_8", importance: 0.05, dtype: "object" },
        { name: "feature_9", importance: 0.03, dtype: "float64" },
      ];

      const ds: UploadedDataset = {
        id: `upload-${Date.now()}`,
        fileName: file.name,
        fileType: "pdf",
        rows: Math.floor(Math.random() * 8000) + 2000,
        features: syntheticFeatures,
        target: "target",
        posRate: 31.4,
        preview: [],
      };

      setUploadedDatasets((prev) => [...prev, ds]);
      setConfig({
        ...config,
        datasetId: ds.id,
        activeFeatures: syntheticFeatures.map((f) => f.name),
      });
      setResults(null);
      setHasRun(false);
      setUploadState("done");
    }, 2200);
  }, [config, setConfig, setResults]);

  /* ── File handler ───────────────────────────────────────────────── */
  const handleFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv") { parseCSV(file); return; }
    if (ext === "pdf") { simulatePDF(file); return; }
    setUploadError("Unsupported format. Please upload a .csv or .pdf file.");
    setUploadState("error");
  }, [parseCSV, simulatePDF]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const removeUploaded = (id: string) => {
    setUploadedDatasets((prev) => prev.filter((d) => d.id !== id));
    if (config.datasetId === id) {
      setConfig({ ...config, datasetId: "ML-CHURN-003", activeFeatures: ALL_FEATURES.map((f) => f.name) });
      setResults(null);
      setHasRun(false);
    }
  };

  /* ── Config helpers ─────────────────────────────────────────────── */
  const updateParam = (key: keyof HyperParams, value: number | boolean) => {
    setConfig({ ...config, params: { ...config.params, [key]: value } });
    setHasRun(false);
    setResults(null);
  };

  const toggleFeature = (name: string) => {
    const active = config.activeFeatures.includes(name)
      ? config.activeFeatures.filter((f) => f !== name)
      : [...config.activeFeatures, name];
    if (active.length === 0) return;
    setConfig({ ...config, activeFeatures: active });
    setHasRun(false);
    setResults(null);
  };

  const runQuickTest = () => {
    setIsRunning(true);
    setResults(null);
    setTimeout(() => {
      setResults(estimateMetrics(config.selectedModel, config.params, config.activeFeatures.length));
      setIsRunning(false);
      setHasRun(true);
    }, 1400);
  };

  const resetToDefaults = () => {
    setConfig({ ...config, selectedModel: "XGBoost", activeFeatures: ALL_FEATURES.map((f) => f.name), params: defaultParams });
    setResults(null);
    setHasRun(false);
  };

  const handleApplyToLab = () => { applyToLab(); setLocation(`/simulation/${config.datasetId}`); };

  const visibleFeatures = activeFeatureList.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const passAUC = results ? results.auc >= 0.88 : false;
  const passF1 = results ? results.f1 >= 0.80 : false;

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-[#7C3AED]" />
            Data Playground
          </h1>
          <p className="text-sm text-[#8B949E]">Upload your own dataset or pick a built-in one, tune hyperparameters, and preview results</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetToDefaults} className="flex items-center gap-1 text-xs border border-[#30363D] bg-[#21262D] text-[#8B949E] hover:text-white px-3 py-2 rounded transition-colors">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={handleApplyToLab}
            disabled={!hasRun}
            className="flex items-center gap-2 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded transition-colors"
            data-testid="btn-apply-to-lab"
          >
            <Send className="w-3 h-3" /> Apply to Simulation Lab <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr_260px] gap-4">

        {/* ── COL 1: Upload + Dataset picker ─────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Upload zone */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-[#7C3AED]" /> Upload Dataset
            </h3>

            {/* Drop target */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg cursor-pointer transition-all py-5 px-3 text-center ${
                isDragOver
                  ? "border-[#7C3AED] bg-[#1C1038]"
                  : "border-[#30363D] hover:border-[#7C3AED] hover:bg-[#1C1038]/50"
              }`}
              data-testid="upload-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.pdf"
                className="hidden"
                onChange={onInputChange}
                data-testid="upload-input"
              />
              <Upload className="w-6 h-6 text-[#484F58]" />
              <span className="text-xs text-[#8B949E]">Drop file or <span className="text-[#7C3AED] font-medium">click to browse</span></span>
              <div className="flex gap-2 mt-1">
                <span className="text-[10px] font-mono bg-[#21262D] border border-[#30363D] text-[#8B949E] px-2 py-[2px] rounded">CSV</span>
                <span className="text-[10px] font-mono bg-[#21262D] border border-[#30363D] text-[#8B949E] px-2 py-[2px] rounded">PDF</span>
              </div>
            </div>

            {/* Upload progress / status */}
            <AnimatePresence>
              {uploadState === "parsing" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-xs text-[#8B949E]">
                  <div className="w-3.5 h-3.5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin shrink-0" />
                  Parsing file...
                </motion.div>
              )}
              {uploadState === "error" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 flex items-start gap-2 text-xs text-[#EF4444]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {uploadError || "Upload failed."}
                </motion.div>
              )}
              {uploadState === "done" && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-xs text-[#22C55E]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Dataset loaded successfully
                </motion.div>
              )}
            </AnimatePresence>

            {/* Uploaded dataset pills */}
            {uploadedDatasets.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5">
                {uploadedDatasets.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => { setConfig({ ...config, datasetId: d.id, activeFeatures: d.features.map((f) => f.name) }); setResults(null); setHasRun(false); }}
                    className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer transition-all ${config.datasetId === d.id ? "border-[#7C3AED] bg-[#1C1038]" : "border-[#30363D] bg-[#21262D] hover:border-[#7C3AED]"}`}
                    data-testid={`uploaded-dataset-${d.id}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {d.fileType === "csv"
                        ? <FileSpreadsheet className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                        : <FileText className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />}
                      <div className="min-w-0">
                        <div className="font-mono text-[#E6EDF3] truncate" style={{ maxWidth: 110 }}>{d.fileName}</div>
                        <div className="text-[#8B949E] text-[10px]">{d.rows.toLocaleString()} rows · {d.features.length} cols</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeUploaded(d.id); }}
                      className="text-[#484F58] hover:text-[#EF4444] transition-colors shrink-0 ml-1"
                      data-testid={`remove-dataset-${d.id}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Built-in datasets */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Built-in Datasets</h3>
            <div className="flex flex-col gap-2">
              {BUILTIN_DATASETS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setConfig({ ...config, datasetId: d.id, activeFeatures: ALL_FEATURES.slice(0, d.features).map((f) => f.name) }); setResults(null); setHasRun(false); }}
                  className={`text-left p-2.5 rounded border text-xs transition-all ${config.datasetId === d.id ? "border-[#7C3AED] bg-[#1C1038]" : "border-[#30363D] bg-[#21262D] hover:border-[#7C3AED]"}`}
                  data-testid={`dataset-${d.id}`}
                >
                  <div className="font-mono text-[#22D3EE] mb-0.5">{d.file}</div>
                  <div className="text-[#8B949E]">{d.rows.toLocaleString()} rows · {d.features} features</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dataset stats */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Dataset Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[#8B949E]">File</span><span className="font-mono text-[#22D3EE] truncate ml-2" style={{ maxWidth: 120 }}>{dsFileName}</span></div>
              <div className="flex justify-between"><span className="text-[#8B949E]">Rows</span><span className="font-mono text-[#E6EDF3]">{dsRows.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#8B949E]">Features</span><span className="font-mono text-[#E6EDF3]">{dsFeatureCount}</span></div>
              <div className="flex justify-between"><span className="text-[#8B949E]">Active</span><span className="font-mono text-[#22D3EE]">{config.activeFeatures.length}</span></div>
              <div className="flex justify-between"><span className="text-[#8B949E]">Target</span><span className="font-mono text-[#C4B5FD]">{dsTarget}</span></div>
              <div className="mt-3">
                <div className="text-[#8B949E] mb-1">Class Balance</div>
                <div className="h-3 w-full rounded overflow-hidden flex">
                  <div className="bg-[#EF4444] h-full" style={{ width: `${Math.min(dsPosRate, 100)}%` }} />
                  <div className="bg-[#22C55E] h-full flex-1" />
                </div>
                <div className="flex justify-between text-[10px] mt-1 font-mono">
                  <span className="text-[#EF4444]">+{dsPosRate}%</span>
                  <span className="text-[#22C55E]">−{(100 - dsPosRate).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── COL 2: Feature Explorer + CSV Preview ──────────────── */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Feature Explorer</h3>
              <span className="text-[11px] font-mono text-[#22D3EE] bg-[#0C1F2E] border border-[#164E63] px-2 py-[2px] rounded">
                {config.activeFeatures.length} / {activeFeatureList.length} active
              </span>
            </div>
            <input
              type="text"
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-1.5 text-xs text-[#E6EDF3] placeholder-[#484F58] font-mono mb-3 focus:outline-none focus:border-[#7C3AED]"
            />
            <div className="flex-1 overflow-y-auto space-y-1 pr-1" style={{ maxHeight: 380 }}>
              <div className="grid grid-cols-[1fr_80px_70px_36px] text-[10px] font-mono uppercase text-[#484F58] px-2 pb-1 border-b border-[#21262D]">
                <span>Feature</span><span>Type</span><span>Importance</span><span className="text-right">On</span>
              </div>
              {visibleFeatures.map((f) => {
                const isActive = config.activeFeatures.includes(f.name);
                const maxImp = activeFeatureList[0]?.importance ?? 0.28;
                const barW = Math.round((f.importance / maxImp) * 100);
                return (
                  <div
                    key={f.name}
                    onClick={() => toggleFeature(f.name)}
                    className={`grid grid-cols-[1fr_80px_70px_36px] items-center px-2 py-1.5 rounded cursor-pointer transition-colors ${isActive ? "bg-[#1C1038] hover:bg-[#251650]" : "bg-[#21262D] opacity-50 hover:opacity-70"}`}
                    data-testid={`feature-toggle-${f.name}`}
                  >
                    <span className={`text-xs font-mono truncate ${isActive ? "text-[#E6EDF3]" : "text-[#484F58]"}`}>{f.name}</span>
                    <span className="text-[10px] font-mono text-[#8B949E]">{f.dtype}</span>
                    <div className="h-1.5 w-full bg-[#21262D] rounded-full overflow-hidden">
                      <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${barW}%` }} />
                    </div>
                    <div className="flex justify-end">
                      <div className={`w-8 h-4 rounded-full transition-colors relative ${isActive ? "bg-[#7C3AED]" : "bg-[#30363D]"}`}>
                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isActive ? "right-0.5" : "left-0.5"}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-[#30363D] flex justify-between text-xs text-[#8B949E]">
              <button onClick={() => setConfig({ ...config, activeFeatures: activeFeatureList.map((f) => f.name) })} className="hover:text-white transition-colors">Select all</button>
              <button onClick={() => setConfig({ ...config, activeFeatures: activeFeatureList.slice(0, 5).map((f) => f.name) })} className="hover:text-white transition-colors">Top 5 only</button>
              <button onClick={() => setConfig({ ...config, activeFeatures: [activeFeatureList[0]?.name ?? ""] })} className="hover:text-white transition-colors">Clear all</button>
            </div>
          </div>

          {/* CSV data preview table */}
          <AnimatePresence>
            {dsPreview.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Data Preview (first 5 rows)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] font-mono border-collapse">
                    <thead>
                      <tr>
                        {dsPreview[0].map((col) => (
                          <th key={col} className="text-left text-[#8B949E] px-2 py-1 border-b border-[#30363D] whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dsPreview.slice(1).map((row, ri) => (
                        <tr key={ri} className="border-b border-[#21262D] hover:bg-[#1C1038] transition-colors">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-2 py-1 text-[#E6EDF3] whitespace-nowrap max-w-[120px] truncate" title={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── COL 3: Model + Params + Results ────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Model</h3>
            <div className="flex flex-col gap-2">
              {MODELS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setConfig({ ...config, selectedModel: m }); setResults(null); setHasRun(false); }}
                  className={`text-left px-3 py-2 rounded border text-xs font-mono transition-all ${config.selectedModel === m ? "border-[#7C3AED] bg-[#1C1038] text-[#C4B5FD]" : "border-[#30363D] bg-[#21262D] text-[#8B949E] hover:border-[#7C3AED]"}`}
                  data-testid={`model-${m.replace(/\s+/g, "-")}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Hyperparameters</h3>
            {config.selectedModel !== "Logistic Regression" ? (
              <>
                <Slider label="n_estimators" value={config.params.nEstimators} min={50} max={500} step={50} onChange={(v) => updateParam("nEstimators", v)} />
                <Slider label="max_depth" value={config.params.maxDepth} min={2} max={12} step={1} onChange={(v) => updateParam("maxDepth", v)} />
                {config.selectedModel === "XGBoost" && (
                  <Slider label="learning_rate" value={config.params.learningRate} min={0.01} max={0.3} step={0.01} onChange={(v) => updateParam("learningRate", v)} format={(v) => v.toFixed(2)} />
                )}
                <Slider label="subsample" value={config.params.subsample} min={0.5} max={1.0} step={0.05} onChange={(v) => updateParam("subsample", v)} format={(v) => v.toFixed(2)} />
              </>
            ) : (
              <>
                <Slider label="C (regularisation)" value={config.params.cParam} min={0.01} max={10} step={0.1} onChange={(v) => updateParam("cParam", v)} format={(v) => v.toFixed(2)} />
                <Slider label="max_iter" value={config.params.maxIter} min={100} max={2000} step={100} onChange={(v) => updateParam("maxIter", v)} />
              </>
            )}
            <Slider label="test_size" value={config.params.testSize} min={0.1} max={0.4} step={0.05} onChange={(v) => updateParam("testSize", v)} format={(v) => v.toFixed(2)} />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-[#8B949E]">SMOTE oversampling</span>
              <button
                onClick={() => updateParam("smote", !config.params.smote)}
                className={`w-10 h-5 rounded-full transition-colors relative ${config.params.smote ? "bg-[#7C3AED]" : "bg-[#30363D]"}`}
                data-testid="toggle-smote"
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.params.smote ? "right-1" : "left-1"}`} />
              </button>
            </div>
          </div>

          <button
            onClick={runQuickTest}
            disabled={isRunning}
            className="flex items-center justify-center gap-2 w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-bold py-2.5 rounded transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]"
            data-testid="btn-quick-run"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Estimating..." : "Quick Preview Run"}
          </button>

          <AnimatePresence>
            {isRunning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[#8B949E] font-mono">Running {config.selectedModel}...</span>
              </motion.div>
            )}
            {results && !isRunning && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Estimated Results</h4>
                  <span className={`text-[10px] font-mono uppercase px-2 py-[2px] rounded border ${passAUC && passF1 ? "bg-[#052E16] text-[#22C55E] border-[#14532D]" : "bg-[#2D1A00] text-[#F59E0B] border-[#78350F]"}`}>
                    {passAUC && passF1 ? "PASS" : "WARN"}
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "AUC-ROC", value: results.auc, pass: passAUC, threshold: "≥ 0.88", color: "#C4B5FD" },
                    { label: "F1 Score", value: results.f1, pass: passF1, threshold: "≥ 0.80", color: "#22D3EE" },
                    { label: "Accuracy", value: results.accuracy, pass: true, threshold: "", color: "#22C55E" },
                    { label: "Precision", value: results.precision, pass: true, threshold: "", color: "#F59E0B" },
                    { label: "Recall", value: results.recall, pass: true, threshold: "", color: "#22D3EE" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-xs text-[#8B949E]">{m.label}</span>
                      <div className="flex items-center gap-2">
                        {m.threshold && <span className={`text-[10px] font-mono ${m.pass ? "text-[#22C55E]" : "text-[#F59E0B]"}`}>{m.threshold}</span>}
                        <span className="font-mono text-sm font-bold" style={{ color: m.color }}>{m.value.toFixed(3)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[#30363D]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#8B949E]">Estimated Score</span>
                    <span className="font-mono font-bold text-lg text-[#C4B5FD]">{results.score}<span className="text-xs text-[#8B949E]">/100</span></span>
                  </div>
                  <div className="text-[10px] text-[#8B949E] flex items-center gap-1">
                    <Info className="w-3 h-3" /> Quick estimate — full score in Simulation Lab
                  </div>
                </div>
                <button
                  onClick={handleApplyToLab}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-xs bg-[#052E16] hover:bg-[#0a3d20] border border-[#14532D] text-[#22C55E] font-bold py-2 rounded transition-colors"
                  data-testid="btn-send-to-lab"
                >
                  <Send className="w-3 h-3" /> Send to Simulation Lab
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
