import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

const leaders = [
  { rank: 1, name: "Arjun Mehta", initials: "AM", city: "Mumbai", tier: "Master", tfes: 96, simulations: 83, accuracy: 94.1, earned: "₹3.2L", change: "same" },
  { rank: 2, name: "Sneha Iyer", initials: "SI", city: "Bengaluru", tier: "Master", tfes: 93, simulations: 71, accuracy: 93.4, earned: "₹2.8L", change: "up" },
  { rank: 3, name: "Karan Patel", initials: "KP", city: "Hyderabad", tier: "Master", tfes: 91, simulations: 68, accuracy: 92.8, earned: "₹2.5L", change: "down" },
  { rank: 4, name: "Divya Nair", initials: "DN", city: "Pune", tier: "Expert", tfes: 89, simulations: 62, accuracy: 92.1, earned: "₹2.1L", change: "up" },
  { rank: 5, name: "Rahul Sharma", initials: "RS", city: "Delhi", tier: "Expert", tfes: 87, simulations: 59, accuracy: 91.7, earned: "₹1.9L", change: "up" },
  { rank: 6, name: "Priya Kumar", initials: "PK", city: "Chennai", tier: "Expert", tfes: 84, simulations: 47, accuracy: 91.2, earned: "₹1.24L", change: "up", isMe: true },
  { rank: 7, name: "Ankit Joshi", initials: "AJ", city: "Ahmedabad", tier: "Expert", tfes: 82, simulations: 44, accuracy: 90.5, earned: "₹1.1L", change: "down" },
  { rank: 8, name: "Meera Reddy", initials: "MR", city: "Chennai", tier: "Expert", tfes: 79, simulations: 39, accuracy: 89.9, earned: "₹98K", change: "same" },
  { rank: 9, name: "Vikram Singh", initials: "VS", city: "Jaipur", tier: "Practitioner", tfes: 76, simulations: 35, accuracy: 88.4, earned: "₹82K", change: "up" },
  { rank: 10, name: "Pooja Gupta", initials: "PG", city: "Noida", tier: "Practitioner", tfes: 73, simulations: 31, accuracy: 87.1, earned: "₹71K", change: "down" },
];

const tierColors: Record<string, string> = {
  Master: "bg-[#2D1A00] text-[#F59E0B] border-[#78350F]",
  Expert: "bg-[#1C1038] text-[#C4B5FD] border-[#4C1D95]",
  Practitioner: "bg-[#0C1F2E] text-[#22D3EE] border-[#164E63]",
};

const rankColors = ["text-[#F59E0B]", "text-[#8B949E]", "text-[#C084FC]"];

export default function Leaderboard() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#F59E0B]" />
            Leaderboard
          </h1>
          <p className="text-sm text-[#8B949E]">Global rankings by TFES score · Updated daily</p>
        </div>
        <div className="flex gap-2">
          {["Global", "India", "Expert Tier"].map((f, i) => (
            <button key={f} className={`text-xs px-3 py-1.5 rounded border font-mono transition-colors ${i === 0 ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "bg-[#21262D] border-[#30363D] text-[#8B949E] hover:text-white hover:border-[#7C3AED]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[leaders[1], leaders[0], leaders[2]].map((l, i) => {
          const podiumRank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const heights = ["h-28", "h-36", "h-24"];
          return (
            <div key={l.rank} className={`bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex flex-col items-center justify-end ${heights[i]} ${podiumRank === 1 ? "border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.15)]" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${podiumRank === 1 ? "bg-[#F59E0B] text-black" : podiumRank === 2 ? "bg-[#8B949E] text-black" : "bg-[#C084FC] text-black"}`}>
                {l.initials}
              </div>
              <div className="text-white font-semibold text-sm text-center">{l.name}</div>
              <div className="text-xs text-[#8B949E] mb-1">{l.city}</div>
              <div className={`text-lg font-mono font-bold ${rankColors[podiumRank - 1] ?? "text-white"}`}>#{podiumRank}</div>
              <div className="text-xs font-mono text-[#22D3EE]">TFES {l.tfes}</div>
            </div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_120px_80px_100px_100px_100px] text-xs font-mono uppercase text-[#8B949E] px-4 py-3 border-b border-[#30363D] gap-4">
          <span>#</span>
          <span>Candidate</span>
          <span>Tier</span>
          <span>TFES</span>
          <span>Simulations</span>
          <span>Accuracy</span>
          <span>Earned</span>
        </div>
        {leaders.map((l) => (
          <div
            key={l.rank}
            className={`grid grid-cols-[40px_1fr_120px_80px_100px_100px_100px] px-4 py-3 border-b border-[#30363D] gap-4 items-center transition-colors ${l.isMe ? "bg-[#1C1038] border-l-[3px] border-l-[#7C3AED]" : "hover:bg-[#21262D]"}`}
            data-testid={`row-leader-${l.rank}`}
          >
            <span className={`font-mono font-bold text-sm ${rankColors[l.rank - 1] ?? "text-[#E6EDF3]"}`}>
              {l.rank}
            </span>
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${l.isMe ? "bg-[#7C3AED] text-white" : "bg-[#21262D] text-[#8B949E]"}`}>
                {l.initials}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-white font-medium truncate flex items-center gap-2">
                  {l.name}
                  {l.isMe && <span className="text-[10px] font-mono bg-[#7C3AED] text-white px-1.5 py-[1px] rounded">YOU</span>}
                </div>
                <div className="text-xs text-[#8B949E] truncate">{l.city}</div>
              </div>
            </div>
            <span className={`text-[11px] font-mono uppercase px-2 py-[2px] rounded border w-fit ${tierColors[l.tier] ?? ""}`}>{l.tier}</span>
            <span className="font-mono font-bold text-[#22D3EE] text-sm">{l.tfes}</span>
            <span className="font-mono text-sm text-[#E6EDF3]">{l.simulations}</span>
            <span className="font-mono text-sm text-[#22C55E]">{l.accuracy}%</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-sm text-[#F59E0B]">{l.earned}</span>
              {l.change === "up" && <TrendingUp className="w-3 h-3 text-[#22C55E]" />}
              {l.change === "down" && <TrendingDown className="w-3 h-3 text-[#EF4444]" />}
              {l.change === "same" && <Minus className="w-3 h-3 text-[#8B949E]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
