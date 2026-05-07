import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { challenges, terminalLines } from "../data/mockData";
import { usePlayground } from "../context/PlaygroundContext";
import { useGame } from "../context/GameContext";
import { FlaskConical, X, Trophy, Zap, TrendingUp, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Legend, BarChart, Bar, Cell } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const rocData = [
  { fpr: 0, xgb: 0, rf: 0, random: 0 },
  { fpr: 0.05, xgb: 0.6, rf: 0.55, random: 0.05 },
  { fpr: 0.1, xgb: 0.78, rf: 0.73, random: 0.1 },
  { fpr: 0.2, xgb: 0.88, rf: 0.85, random: 0.2 },
  { fpr: 0.4, xgb: 0.95, rf: 0.93, random: 0.4 },
  { fpr: 0.6, xgb: 0.97, rf: 0.95, random: 0.6 },
  { fpr: 0.8, xgb: 0.98, rf: 0.97, random: 0.8 },
  { fpr: 1, xgb: 1, rf: 1, random: 1 },
];

const featureImportance = [
  { name: "tenure", value: 0.28 },
  { name: "MonthlyCharges", value: 0.21 },
  { name: "TotalCharges", value: 0.18 },
  { name: "Contract", value: 0.12 },
  { name: "OnlineSecurity", value: 0.09 },
  { name: "TechSupport", value: 0.07 },
];
const barColors = ["#7C3AED", "#8B50EF", "#9A65F0", "#A97AF2", "#B88EF4", "#C7A3F6"];

const SCORE = 88;
const XP_EARNED = 290;

export default function SimulationLab() {
  const [, setLocation] = useLocation();
  const { config, applied, clearApplied } = usePlayground();
  const { isSubmitted, submitChallenge, userRank } = useGame();
  const c = challenges[0];

  const [stages, setStages] = useState<string[]>(Array(6).fill("idle"));
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleLines, setVisibleLines] = useState(2);
  const terminalRef = useRef<HTMLDivElement>(null);

  /* submit state */
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "done">("idle");
  const alreadySubmitted = isSubmitted(c.id);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const runSimulation = () => {
    if (isRunning || isComplete) return;
    setIsRunning(true);

    let currentStage = 0;
    const stageInterval = setInterval(() => {
      setStages((prev) => {
        const next = [...prev];
        if (currentStage > 0) next[currentStage - 1] = "complete";
        if (currentStage < 6) next[currentStage] = "running";
        return next;
      });
      currentStage++;
      if (currentStage > 6) {
        clearInterval(stageInterval);
        setIsRunning(false);
        setIsComplete(true);
      }
    }, 800);

    let currentLine = 2;
    const lineInterval = setInterval(() => {
      setVisibleLines((l) => {
        if (l >= terminalLines.length) { clearInterval(lineInterval); return l; }
        return l + 1;
      });
    }, 120);
  };

  const handleSubmit = () => {
    if (submitState !== "idle" || alreadySubmitted) return;
    setSubmitState("submitting");
    setTimeout(() => {
      submitChallenge(c.id, SCORE, XP_EARNED);
      setSubmitState("done");
    }, 1800);
  };

  const stageNames = ["Data Load", "EDA", "Features", "Training", "Evaluate", "Certify"];

  const getLineColor = (type: string) => {
    switch (type) {
      case "ls": return "text-[#22C55E]";
      case "li": return "text-[#484F58]";
      case "lv": return "text-[#7DD3FC]";
      case "lw": return "text-[#F59E0B]";
      case "lt": return "text-[#C4B5FD] font-bold";
      default: return "text-[#8B949E]";
    }
  };

  const p = config.params;
  const modelLabel = config.selectedModel;

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">

      {/* Submit success overlay */}
      <AnimatePresence>
        {submitState === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setSubmitState("idle")}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#161B22] border border-[#7C3AED] rounded-2xl p-8 w-[480px] text-center shadow-[0_0_60px_rgba(124,58,237,0.3)]"
            >
              {/* Trophy icon with glow */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-[#1C1038] border border-[#4C1D95] flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                  <Trophy className="w-10 h-10 text-[#F59E0B]" />
                </div>
              </div>

              <div className="text-xs font-mono uppercase text-[#8B949E] tracking-widest mb-1">Challenge Submitted</div>
              <h2 className="text-2xl font-bold text-white mb-1">{c.title}</h2>
              <div className="text-sm text-[#8B949E] mb-6">{c.id}</div>

              {/* Score */}
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 mb-5">
                <div className="text-xs text-[#8B949E] uppercase tracking-wider mb-2">Final Score</div>
                <div className="text-6xl font-mono font-bold text-[#C4B5FD] mb-1">
                  {SCORE}<span className="text-2xl text-[#8B949E]">/100</span>
                </div>
                <div className="text-sm text-[#22C55E] font-mono font-bold">✓ PASSED — All criteria met</div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#052E16] border border-[#14532D] rounded-lg p-3">
                  <Zap className="w-4 h-4 text-[#22C55E] mx-auto mb-1" />
                  <div className="text-lg font-mono font-bold text-[#22C55E]">+{XP_EARNED}</div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide">XP Earned</div>
                </div>
                <div className="bg-[#2D1A00] border border-[#78350F] rounded-lg p-3">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-mono font-bold text-[#F59E0B]">NFT Badge</div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide">Minted</div>
                </div>
                <div className="bg-[#1C1038] border border-[#4C1D95] rounded-lg p-3">
                  <TrendingUp className="w-4 h-4 text-[#C4B5FD] mx-auto mb-1" />
                  <div className="text-lg font-mono font-bold text-[#C4B5FD]">#{userRank}</div>
                  <div className="text-[10px] text-[#8B949E] uppercase tracking-wide">New Rank</div>
                </div>
              </div>

              {/* Reward */}
              <div className="text-2xl font-mono font-bold text-[#22C55E] mb-6">{c.reward} earned</div>

              <div className="flex gap-3">
                <button
                  onClick={() => setLocation("/leaderboard")}
                  className="flex-1 flex items-center justify-center gap-2 text-sm bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2.5 rounded-lg transition-colors"
                >
                  <Trophy className="w-4 h-4" /> View Leaderboard
                </button>
                <button
                  onClick={() => setSubmitState("idle")}
                  className="flex-1 text-sm border border-[#30363D] bg-[#21262D] text-[#8B949E] hover:text-white py-2.5 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submitting overlay */}
      <AnimatePresence>
        {submitState === "submitting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
              <div className="text-white font-mono text-sm">Submitting to challenge board...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playground config banner */}
      <AnimatePresence>
        {applied && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-center justify-between bg-[#1C1038] border border-[#4C1D95] rounded-lg px-4 py-2.5"
          >
            <div className="flex items-center gap-3">
              <FlaskConical className="w-4 h-4 text-[#C4B5FD]" />
              <span className="text-sm text-white font-medium">Playground config active</span>
              <span className="text-xs font-mono text-[#C4B5FD] bg-[#0D1117] px-2 py-0.5 rounded border border-[#4C1D95]">
                {modelLabel} · {config.activeFeatures.length} features · {config.params.smote ? "SMOTE on" : "SMOTE off"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/playground")} className="text-xs text-[#C4B5FD] hover:text-white underline transition-colors">
                Back to Playground
              </button>
              <button onClick={clearApplied} className="text-[#8B949E] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 mb-4 flex justify-between">
        <div>
          <div className="text-xs text-[#8B949E] font-mono mb-1">{c.id} · {c.difficulty}</div>
          <h2 className="text-xl font-bold text-white mb-1">{c.title} — Telecom Dataset</h2>
          <p className="text-sm text-[#8B949E] mb-3">Binary classification · 7,043 rows · 21 features · Imbalanced dataset (26.5% positive churn rate)</p>
          <div className="flex gap-2">
            {c.models.concat(["SMOTE"]).map((m) => (
              <span key={m} className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">{m}</span>
            ))}
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-2xl text-[#22C55E] font-mono font-bold mb-1">{c.reward}</div>
          <div className="text-sm text-[#8B949E] mb-2">+ {c.xp} XP · NFT Badge</div>
          <div className="text-sm text-[#F59E0B] flex items-center gap-1"><span>⏰</span> Due in 3 days</div>
        </div>
      </div>

      {/* Stages */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 mb-4 flex flex-col items-center">
        <div className="flex w-full justify-between items-center max-w-4xl relative mb-6">
          <div className="absolute top-4 left-4 right-4 h-px bg-[#30363D] -z-10" />
          {stages.map((st, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                st === "idle" ? "bg-[#21262D] border border-[#30363D] text-[#484F58]"
                : st === "running" ? "bg-[#7C3AED] border border-[#7C3AED] text-white animate-pulse"
                : "bg-[#052E16] border border-[#14532D] text-[#22C55E]"
              }`}>
                {st === "complete" ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${st === "idle" ? "text-[#484F58]" : st === "running" ? "text-[#C4B5FD]" : "text-[#22C55E]"}`}>{stageNames[i]}</span>
            </div>
          ))}
        </div>
        <button
          onClick={runSimulation}
          disabled={isRunning || isComplete}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:hover:bg-[#7C3AED] text-white font-bold py-2 px-6 rounded-md transition-all shadow-[0_0_15px_rgba(124,58,237,0.2)]"
        >
          {isComplete ? "Simulation Complete ✓" : isRunning ? "Running Simulation..." : "▶ Run Full Simulation"}
        </button>
      </div>

      {/* Workspace */}
      <div className="flex gap-4 mb-4">
        {/* Left Col */}
        <div className="w-48 shrink-0 flex flex-col gap-4">
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
            <h4 className="text-xs font-bold text-white uppercase mb-2 tracking-wider">Dataset</h4>
            <div className="text-sm text-[#22D3EE] font-mono break-all mb-1">{c.dataset.file}</div>
            <div className="text-xs text-[#8B949E]">{c.dataset.rows.toLocaleString()} rows × {c.dataset.features} features</div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3">
            <h4 className="text-xs font-bold text-white uppercase mb-2 tracking-wider">Acceptance Criteria</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className={isComplete ? "text-[#22C55E]" : "text-[#8B949E]"}>✓ AUC-ROC ≥ 0.88</li>
              <li className={isComplete ? "text-[#22C55E]" : "text-[#8B949E]"}>✓ F1 Score ≥ 0.80</li>
              <li className={isComplete ? "text-[#22C55E]" : "text-[#8B949E]"}>✓ Handle class imbalance (SMOTE)</li>
              <li className={isComplete ? "text-[#22C55E]" : "text-[#8B949E]"}>✓ Feature importance report</li>
              <li className="text-[#8B949E]">✓ SHAP values (bonus +10 pts)</li>
            </ul>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-3 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-white uppercase mb-1 tracking-wider">Models</h4>
            {c.models.map((m) => (
              <span key={m} className="text-[11px] font-mono uppercase px-2 py-1 rounded bg-[#1C1038] text-[#C4B5FD] border border-[#4C1D95] text-center">{m}</span>
            ))}
          </div>
        </div>

        {/* Center Col */}
        <div className="flex-1 flex flex-col">
          <div
            ref={terminalRef}
            className="h-64 overflow-y-auto bg-[#020409] border-l-[3px] border-[#7C3AED] rounded-r-lg p-3 font-mono text-xs leading-relaxed"
          >
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={getLineColor(line.type)}>{line.text}</div>
            ))}
          </div>

          <div className="mt-4 bg-[#020409] border border-[#30363D] p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto">
            {modelLabel === "XGBoost" && (<>
              <div><span className="text-[#484F58]"># {applied ? "Playground config" : "XGBoost — Best Model (auto-selected)"}</span></div>
              <div><span className="text-[#C084FC]">from</span> xgboost <span className="text-[#C084FC]">import</span> XGBClassifier</div>
              {p.smote && <div><span className="text-[#C084FC]">from</span> imblearn.over_sampling <span className="text-[#C084FC]">import</span> SMOTE</div>}
              <div><span className="text-[#C084FC]">from</span> sklearn.model_selection <span className="text-[#C084FC]">import</span> train_test_split</div>
              <br />
              {p.smote && <div>X_res, y_res = SMOTE(random_state=<span className="text-[#F59E0B]">42</span>).fit_resample(X, y)</div>}
              <div>X_train, X_test, y_train, y_test = train_test_split(</div>
              <div className="pl-4">{p.smote ? "X_res, y_res" : "X, y"}, test_size=<span className="text-[#F59E0B]">{p.testSize.toFixed(2)}</span>, stratify=y_res, random_state=<span className="text-[#F59E0B]">42</span>)</div>
              <br />
              <div>model = XGBClassifier(</div>
              <div className="pl-4">n_estimators=<span className="text-[#F59E0B]">{p.nEstimators}</span>, max_depth=<span className="text-[#F59E0B]">{p.maxDepth}</span>, learning_rate=<span className="text-[#F59E0B]">{p.learningRate.toFixed(2)}</span>,</div>
              <div className="pl-4">subsample=<span className="text-[#F59E0B]">{p.subsample.toFixed(2)}</span>, colsample_bytree=<span className="text-[#F59E0B]">0.8</span>, random_state=<span className="text-[#F59E0B]">42</span>)</div>
              <div>model.fit(X_train, y_train)</div>
            </>)}
            {modelLabel === "Random Forest" && (<>
              <div><span className="text-[#484F58]"># {applied ? "Playground config" : "Random Forest"}</span></div>
              <div><span className="text-[#C084FC]">from</span> sklearn.ensemble <span className="text-[#C084FC]">import</span> RandomForestClassifier</div>
              {p.smote && <div><span className="text-[#C084FC]">from</span> imblearn.over_sampling <span className="text-[#C084FC]">import</span> SMOTE</div>}
              <div><span className="text-[#C084FC]">from</span> sklearn.model_selection <span className="text-[#C084FC]">import</span> train_test_split</div>
              <br />
              {p.smote && <div>X_res, y_res = SMOTE(random_state=<span className="text-[#F59E0B]">42</span>).fit_resample(X, y)</div>}
              <div>X_train, X_test, y_train, y_test = train_test_split(</div>
              <div className="pl-4">{p.smote ? "X_res, y_res" : "X, y"}, test_size=<span className="text-[#F59E0B]">{p.testSize.toFixed(2)}</span>, random_state=<span className="text-[#F59E0B]">42</span>)</div>
              <br />
              <div>model = RandomForestClassifier(</div>
              <div className="pl-4">n_estimators=<span className="text-[#F59E0B]">{p.nEstimators}</span>, max_depth=<span className="text-[#F59E0B]">{p.maxDepth}</span>,</div>
              <div className="pl-4">max_features=<span className="text-[#86EFAC]">'sqrt'</span>, random_state=<span className="text-[#F59E0B]">42</span>)</div>
              <div>model.fit(X_train, y_train)</div>
            </>)}
            {modelLabel === "Logistic Regression" && (<>
              <div><span className="text-[#484F58]"># {applied ? "Playground config" : "Logistic Regression"}</span></div>
              <div><span className="text-[#C084FC]">from</span> sklearn.linear_model <span className="text-[#C084FC]">import</span> LogisticRegression</div>
              {p.smote && <div><span className="text-[#C084FC]">from</span> imblearn.over_sampling <span className="text-[#C084FC]">import</span> SMOTE</div>}
              <br />
              {p.smote && <div>X_res, y_res = SMOTE(random_state=<span className="text-[#F59E0B]">42</span>).fit_resample(X, y)</div>}
              <div>X_train, X_test, y_train, y_test = train_test_split(</div>
              <div className="pl-4">{p.smote ? "X_res, y_res" : "X, y"}, test_size=<span className="text-[#F59E0B]">{p.testSize.toFixed(2)}</span>, random_state=<span className="text-[#F59E0B]">42</span>)</div>
              <br />
              <div>model = LogisticRegression(</div>
              <div className="pl-4">C=<span className="text-[#F59E0B]">{p.cParam.toFixed(2)}</span>, max_iter=<span className="text-[#F59E0B]">{p.maxIter}</span>, random_state=<span className="text-[#F59E0B]">42</span>)</div>
              <div>model.fit(X_train, y_train)</div>
            </>)}
          </div>
        </div>

        {/* Right Col */}
        <div className="w-48 shrink-0 flex flex-col gap-2">
          <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-lg">
            <div className="text-xs uppercase text-[#8B949E] tracking-wider mb-1">AUC-ROC</div>
            <div className="text-3xl text-[#C4B5FD] font-mono font-bold">{isComplete ? "0.921" : "—"}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#161B22] border border-[#30363D] p-3 rounded-lg text-center">
              <div className="text-[10px] uppercase text-[#8B949E] tracking-wider mb-1">F1</div>
              <div className="text-lg text-[#22D3EE] font-mono">{isComplete ? "0.861" : "—"}</div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] p-3 rounded-lg text-center">
              <div className="text-[10px] uppercase text-[#8B949E] tracking-wider mb-1">Accuracy</div>
              <div className="text-lg text-[#22C55E] font-mono">{isComplete ? "88.2%" : "—"}</div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] p-3 rounded-lg text-center">
              <div className="text-[10px] uppercase text-[#8B949E] tracking-wider mb-1">Precision</div>
              <div className="text-lg text-[#F59E0B] font-mono">{isComplete ? "0.874" : "—"}</div>
            </div>
            <div className="bg-[#161B22] border border-[#30363D] p-3 rounded-lg text-center">
              <div className="text-[10px] uppercase text-[#8B949E] tracking-wider mb-1">Recall</div>
              <div className="text-lg text-[#22D3EE] font-mono">{isComplete ? "0.849" : "—"}</div>
            </div>
          </div>

          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-[#1C1038] border border-[#4C1D95] p-4 rounded-lg flex flex-col items-center text-center shadow-[0_0_20px_rgba(124,58,237,0.15)]"
              >
                <div className="text-xs uppercase text-[#C4B5FD] tracking-wider mb-1">Simulation Score</div>
                <div className="text-4xl text-[#C4B5FD] font-mono font-bold mb-1">
                  {SCORE}<span className="text-sm text-[#22C55E] font-sans ml-1">/100 · PASSED ✓</span>
                </div>
                <div className="flex gap-2 mt-2 mb-4">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#052E16] text-[#22C55E] border border-[#14532D]">+{XP_EARNED} XP</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#052E16] text-[#22C55E] border border-[#14532D]">NFT Minted</span>
                </div>

                {/* Submit button */}
                {alreadySubmitted ? (
                  <div className="w-full flex items-center justify-center gap-2 text-xs font-mono text-[#22C55E] py-2 bg-[#052E16] border border-[#14532D] rounded-lg">
                    ✓ Submitted to Challenge Board
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] py-2.5 rounded-lg transition-colors shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                    data-testid="btn-submit-challenge"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit to Challenge Board
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Charts */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-2 gap-4 mt-4"
          >
            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-4">ROC Curve — Model Comparison</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rocData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                    <XAxis dataKey="fpr" tick={{ fill: "#484F58", fontSize: 11 }} label={{ value: "False Positive Rate", position: "insideBottom", offset: -10, fill: "#8B949E", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#484F58", fontSize: 11 }} label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fill: "#8B949E", fontSize: 11 }} />
                    <ReferenceLine y="x" stroke="#484F58" strokeDasharray="2 2" />
                    <Line type="monotone" dataKey="xgb" name="XGBoost" stroke="#7C3AED" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="rf" name="Random Forest" stroke="#22D3EE" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="random" name="Random" stroke="#484F58" strokeWidth={1} strokeDasharray="2 2" dot={false} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#E6EDF3" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-4">Feature Importance (XGBoost)</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262D" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 0.35]} tick={{ fill: "#484F58", fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: "#E6EDF3", fontSize: 11 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {featureImportance.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
