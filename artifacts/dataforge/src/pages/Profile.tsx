import { candidate, skills, badgeData } from "../data/mockData";
import { MapPin, Mail, Github, Linkedin, Edit3, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const tierProgressMap: Record<string, { next: string; pct: number }> = {
  Apprentice: { next: "Practitioner", pct: 35 },
  Practitioner: { next: "Expert", pct: 60 },
  Expert: { next: "Master", pct: 72 },
  Master: { next: "Legend", pct: 90 },
};

const skillBarColor = (score: number) =>
  score >= 85 ? "#22C55E" : score >= 70 ? "#7C3AED" : "#F59E0B";

export default function Profile() {
  const progress = tierProgressMap[candidate.tier] ?? { next: "Master", pct: 72 };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl">
      {/* Profile header */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 mb-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {candidate.initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{candidate.name}</h1>
              <p className="text-sm text-[#C4B5FD] mb-2">Data Scientist</p>
              <div className="flex items-center gap-4 text-xs text-[#8B949E] mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.city}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />priya.kumar@dataforge.io</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase px-2 py-[2px] rounded bg-[#1C1038] text-[#C4B5FD] border border-[#4C1D95]">{candidate.tier} Tier</span>
                <span className="text-[11px] font-mono px-2 py-[2px] rounded bg-[#21262D] text-[#22D3EE] border border-[#30363D]">TFES {candidate.tfes}</span>
                <span className="text-[11px] font-mono px-2 py-[2px] rounded bg-[#052E16] text-[#22C55E] border border-[#14532D]">{candidate.badges} NFT Badges</span>
                <span className="text-[11px] font-mono px-2 py-[2px] rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">{candidate.simulations} Simulations</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button className="flex items-center gap-2 text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-4 py-2 rounded transition-colors" data-testid="btn-edit-profile">
              <Edit3 className="w-3 h-3" /> Edit Profile
            </button>
            <button className="flex items-center gap-2 text-xs bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white px-4 py-2 rounded border border-[#30363D] transition-colors">
              <Github className="w-3 h-3" /> GitHub
            </button>
            <button className="flex items-center gap-2 text-xs bg-[#21262D] hover:bg-[#30363D] text-[#8B949E] hover:text-white px-4 py-2 rounded border border-[#30363D] transition-colors">
              <Linkedin className="w-3 h-3" /> LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          { label: "Simulations Run", value: candidate.simulations, color: "#C4B5FD" },
          { label: "Avg Accuracy", value: `${candidate.accuracy}%`, color: "#22D3EE" },
          { label: "Total Earned", value: candidate.earned, color: "#F59E0B" },
          { label: "NFT Badges", value: candidate.badges, color: "#22C55E" },
        ].map((s) => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
            <div className="text-2xl font-mono font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#8B949E]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tier progress */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#7C3AED]" />
              Tier Progression
            </h2>
            <p className="text-xs text-[#8B949E] mt-1">{candidate.tier} → {progress.next}</p>
          </div>
          <span className="font-mono text-sm text-[#22D3EE]">{candidate.xp.toLocaleString()} / {candidate.xpTarget.toLocaleString()} XP</span>
        </div>
        <div className="h-3 w-full bg-[#21262D] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#7C3AED] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#8B949E] font-mono">
          <span>{candidate.tier}</span>
          <span>{progress.pct}%</span>
          <span>{progress.next}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-white mb-4">Competency Breakdown</h2>
        <div className="flex flex-col gap-3">
          {skills.map((s, i) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#E6EDF3]">{s.name}</span>
                <span className="font-mono" style={{ color: skillBarColor(s.score) }}>{s.score}%</span>
              </div>
              <div className="h-2 w-full bg-[#21262D] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: skillBarColor(s.score) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.score}%` }}
                  transition={{ duration: 1, delay: i * 0.08, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Badges */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#22C55E]" />
          <h2 className="text-sm font-semibold text-white">NFT Credentials</h2>
          <span className="text-[11px] font-mono bg-[#052E16] text-[#22C55E] border border-[#14532D] px-2 py-[2px] rounded">
            {badgeData.length} Verified
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badgeData.map((b) => (
            <div key={b.name} className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 text-center hover:border-[#7C3AED] transition-colors">
              <div className="text-3xl mb-2">{b.emoji}</div>
              <div className="text-xs font-semibold text-white mb-1">{b.name}</div>
              <div className="text-xs font-mono text-[#8B949E] mb-1">{b.score}/100 · {b.level}</div>
              <div className="text-[10px] font-mono text-[#22D3EE] truncate mb-2">{b.hash}</div>
              <span className="text-[10px] font-mono bg-[#052E16] text-[#22C55E] border border-[#14532D] px-1.5 py-[2px] rounded">Verified</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
