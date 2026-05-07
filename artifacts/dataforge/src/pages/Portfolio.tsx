import { candidate, badgeData, simulationRuns, skills } from "../data/mockData";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function Portfolio() {
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Share link card */}
      <div className="bg-[#161B22] border border-[#30363D] p-4 rounded-lg flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-white">Public Portfolio</span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-[2px] rounded bg-[#052E16] text-[#22C55E] border border-[#14532D] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> Live
            </span>
          </div>
          <div className="bg-[#21262D] text-[#22D3EE] font-mono text-sm px-3 py-1.5 rounded inline-block">
            talent-forge.io/verify/priya-kumar-ds
          </div>
          <div className="text-xs text-[#22C55E] mt-2">● 347 employer views · 52 today · Flipkart DS viewed 2h ago</div>
        </div>
        <div className="flex gap-2">
          <button className="text-white hover:bg-[#21262D] border border-[#30363D] text-sm px-4 py-2 rounded transition-colors">Copy Link</button>
          <button className="text-white hover:bg-[#21262D] border border-[#30363D] text-sm px-4 py-2 rounded transition-colors">Generate QR</button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-gradient-to-b from-[#1C1038] to-[#0D1117] border border-[#4C1D95] rounded-xl p-6 mb-4 shadow-[0_0_30px_rgba(124,58,237,0.1)] relative overflow-hidden">
        <div className="absolute top-4 right-4 text-right">
          <div className="text-xs text-[#8B949E] font-mono mb-1">Verified by DataForge CIE Engine v2.0</div>
          <div className="text-xs text-[#22C55E] flex items-center justify-end gap-1">✓ Tamper-proof on Polygon PoS</div>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            {candidate.initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{candidate.name}</h1>
            <p className="text-sm text-[#C4B5FD]">Data Scientist · {candidate.city}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <span className="text-[11px] font-mono uppercase px-2 py-1 rounded bg-[#1C1038] text-[#C4B5FD] border border-[#4C1D95]">Expert Tier</span>
          <span className="text-[11px] font-mono uppercase px-2 py-1 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">84/100 TFES</span>
          <span className="text-[11px] font-mono uppercase px-2 py-1 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">7 NFT Badges</span>
          <span className="text-[11px] font-mono uppercase px-2 py-1 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">23 Projects</span>
        </div>

        <div className="grid grid-cols-4 gap-4 bg-[#0D1117]/50 rounded-lg p-4 border border-[#30363D]/50">
          <div>
            <div className="text-3xl font-mono font-bold text-[#C4B5FD] mb-1">{candidate.simulations}</div>
            <div className="text-xs text-[#8B949E] uppercase tracking-wider">Simulations</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-[#22D3EE] mb-1">{candidate.accuracy}%</div>
            <div className="text-xs text-[#8B949E] uppercase tracking-wider">Avg Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-[#22C55E] mb-1">23</div>
            <div className="text-xs text-[#8B949E] uppercase tracking-wider">Projects</div>
          </div>
          <div>
            <div className="text-3xl font-mono font-bold text-[#F59E0B] mb-1">{candidate.earned}</div>
            <div className="text-xs text-[#8B949E] uppercase tracking-wider">Total Earned</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Radar */}
        <div className="bg-[#161B22] border border-[#30363D] p-5 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">Verified Competencies</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills.map(s => ({ ...s, avg: s.score - 15 }))}>
                <PolarGrid stroke="#30363D" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#8B949E', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={5} tick={{ fill: '#484F58', fontSize: 10 }} axisLine={false} />
                <Radar name="User" dataKey="score" stroke="#7C3AED" strokeWidth={2} fill="rgba(124,58,237,0.2)" fillOpacity={1} />
                <Radar name="Avg" dataKey="avg" stroke="#484F58" strokeWidth={1} strokeDasharray="4 4" fill="rgba(72,79,88,0.1)" fillOpacity={1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', color: '#E6EDF3' }}
                  itemStyle={{ color: '#E6EDF3' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bars */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 flex flex-col justify-center">
          <div className="flex flex-col gap-5">
            {skills.map((s, i) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#E6EDF3] font-medium">{s.name}</span>
                  <span className="font-mono text-[#8B949E]">{s.score}%</span>
                </div>
                <div className="h-2 w-full bg-[#21262D] rounded overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${s.score}%` }} 
                    transition={{ duration: 1, delay: 0.1 * i, ease: "easeOut" }}
                    className={`h-full rounded ${s.score >= 90 ? 'bg-[#22C55E]' : s.score >= 70 ? 'bg-[#7C3AED]' : 'bg-[#F59E0B]'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NFT Wall */}
      <div className="mb-6">
        <h2 className="text-base font-bold text-white mb-3">NFT Credential Wall</h2>
        <div className="grid grid-cols-3 gap-3">
          {badgeData.map((b, i) => {
            const borderColors = {
              purple: "border-[#4C1D95]",
              green: "border-[#14532D]",
              blue: "border-[#1E3A8A]",
              teal: "border-[#134E4A]",
              amber: "border-[#78350F]"
            };
            const bgColors = {
              purple: "bg-[#1C1038]",
              green: "bg-[#052E16]",
              blue: "bg-[#172554]",
              teal: "bg-[#042F2E]",
              amber: "bg-[#2D1A00]"
            };
            
            return (
              <div key={i} className={`${bgColors[b.color as keyof typeof bgColors]} border ${borderColors[b.color as keyof typeof borderColors]} p-4 rounded-xl flex flex-col items-center text-center relative hover:scale-[1.02] transition-transform`}>
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#052E16] text-[#22C55E] border border-[#14532D]">Verified</span>
                </div>
                <div className="text-4xl mb-3 mt-2">{b.emoji}</div>
                <div className="font-bold text-white text-sm mb-1">{b.name}</div>
                <div className="text-xs text-[#8B949E] font-mono mb-3">{b.score}/100 · {b.level}</div>
                <div className="w-full h-px bg-[#30363D]/50 mb-3" />
                <div className="text-[10px] text-[#22D3EE] font-mono mb-1 truncate w-full">{b.hash}</div>
                <div className="text-[10px] text-[#22C55E]">{b.chain} ✓</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Runs */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-[#30363D]">
          <h3 className="text-sm font-medium text-white">Top Simulation Runs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0D1117] text-[#8B949E] text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Domain</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Key Metric</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Chain Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {simulationRuns.map((r, i) => (
                <tr key={i} className="hover:bg-[#21262D] transition-colors">
                  <td className="px-4 py-3 text-[#E6EDF3]">{r.project}</td>
                  <td className="px-4 py-3 text-[#8B949E] text-xs">{r.domain}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#22C55E]">{r.score}</td>
                  <td className="px-4 py-3 font-mono text-[#22D3EE] text-xs">{r.metric}</td>
                  <td className="px-4 py-3 text-[#8B949E] text-xs">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#052E16] text-[#22C55E] border border-[#14532D]">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* Recent Verifications */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg flex flex-col">
          <div className="p-4 border-b border-[#30363D]">
             <h3 className="text-sm font-medium text-white">Recent Verifications</h3>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
              <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              <div className="flex-1 text-sm text-[#E6EDF3]">Google DeepMind viewed ML badge</div>
              <div className="text-xs text-[#8B949E]">2h ago</div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <div className="flex-1 text-sm text-[#E6EDF3]">Razorpay Data Science viewed profile</div>
              <div className="text-xs text-[#8B949E]">6h ago</div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-[#30363D]">
              <div className="w-2 h-2 rounded-full bg-[#22D3EE]" />
              <div className="flex-1 text-sm text-[#E6EDF3]">Flipkart ML Platform verified credentials</div>
              <div className="text-xs text-[#8B949E]">1d ago</div>
            </div>
            <div className="flex items-center gap-3 pb-3">
              <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <div className="flex-1 text-sm text-[#E6EDF3]">PhonePe Analytics browsed profile</div>
              <div className="text-xs text-[#8B949E]">2d ago</div>
            </div>
          </div>
        </div>

        {/* Shield */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg flex flex-col">
           <div className="p-4 border-b border-[#30363D]">
             <h3 className="text-sm font-medium text-white">Credential Shield</h3>
          </div>
          <div className="p-4 flex flex-col justify-center h-full gap-4 text-sm text-[#22C55E] font-medium">
            <div className="flex items-center gap-2"><span>✓</span> 7/7 credentials cryptographically signed</div>
            <div className="flex items-center gap-2"><span>✓</span> All runs auto-graded — no manual overrides</div>
            <div className="flex items-center gap-2"><span>✓</span> On-chain provenance confirmed · Polygon PoS</div>
            <div className="flex items-center gap-2"><span>✓</span> Zero inflated scores detected</div>
          </div>
        </div>
      </div>
    </div>
  );
}