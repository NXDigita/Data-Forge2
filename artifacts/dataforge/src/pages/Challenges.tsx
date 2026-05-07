import { Link } from "wouter";
import { challenges } from "../data/mockData";
import { Target, Clock, Zap, Award } from "lucide-react";

const domainColors: Record<string, string> = {
  ML: "bg-[#1C1038] text-[#C4B5FD] border-[#4C1D95]",
  NLP: "bg-[#0C1F2E] text-[#22D3EE] border-[#164E63]",
  "Time Series": "bg-[#052E16] text-[#22C55E] border-[#14532D]",
};

const difficultyColors: Record<string, string> = {
  Intermediate: "bg-[#2D1A00] text-[#F59E0B] border-[#78350F]",
  Advanced: "bg-[#2D0A0A] text-[#EF4444] border-[#7F1D1D]",
  Beginner: "bg-[#052E16] text-[#22C55E] border-[#14532D]",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  in_progress: { label: "IN PROGRESS", className: "bg-[#2D1A00] text-[#F59E0B] border border-[#78350F]" },
  not_started: { label: "NOT STARTED", className: "bg-[#21262D] text-[#8B949E] border border-[#30363D]" },
  completed: { label: "COMPLETED", className: "bg-[#052E16] text-[#22C55E] border border-[#14532D]" },
};

const allChallenges = [
  ...challenges,
  { id: "CV-OBJ-001", title: "Object Detection — COCO Dataset", domain: "CV", reward: "₹13,000", xp: 390, status: "not_started", difficulty: "Advanced" },
  { id: "TS-ANOM-004", title: "Anomaly Detection — IoT Sensors", domain: "Time Series", reward: "₹10,500", xp: 320, status: "not_started", difficulty: "Intermediate" },
  { id: "NLP-SUM-012", title: "Abstractive Summarisation — News", domain: "NLP", reward: "₹12,000", xp: 350, status: "not_started", difficulty: "Advanced" },
];

export default function Challenges() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#7C3AED]" />
            Challenges
          </h1>
          <p className="text-sm text-[#8B949E]">{allChallenges.length} challenges available · 1 in progress</p>
        </div>
        <div className="flex gap-2">
          {["All", "ML", "NLP", "Time Series", "CV"].map((f) => (
            <button key={f} className={`text-xs px-3 py-1.5 rounded border font-mono transition-colors ${f === "All" ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "bg-[#21262D] border-[#30363D] text-[#8B949E] hover:text-white hover:border-[#7C3AED]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allChallenges.map((c) => {
          const status = statusConfig[c.status] ?? statusConfig.not_started;
          const domainCls = domainColors[c.domain] ?? "bg-[#21262D] text-[#8B949E] border-[#30363D]";
          const diffCls = difficultyColors[c.difficulty ?? "Intermediate"] ?? difficultyColors.Intermediate;
          return (
            <div key={c.id} className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 hover:border-[#7C3AED] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-[#8B949E]">{c.id}</span>
                    <span className={`text-[11px] font-mono uppercase px-2 py-[2px] rounded border ${domainCls}`}>{c.domain}</span>
                    <span className={`text-[11px] font-mono uppercase px-2 py-[2px] rounded border ${diffCls}`}>{c.difficulty}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{c.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-[#8B949E]">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#F59E0B]" />{c.xp} XP</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3 text-[#7C3AED]" />NFT Badge</span>
                    {c.status === "in_progress" && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#F59E0B]" />Due in 3 days</span>}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-xl font-mono font-bold text-[#22C55E]">{c.reward}</div>
                  <span className={`text-[11px] font-mono uppercase px-2 py-[2px] rounded ${status.className}`}>{status.label}</span>
                  <Link
                    href={`/simulation/${c.id}`}
                    className="text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-3 py-1.5 rounded transition-colors"
                    data-testid={`btn-challenge-${c.id}`}
                  >
                    {c.status === "in_progress" ? "Continue →" : "Start →"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
