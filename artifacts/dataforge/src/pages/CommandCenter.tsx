import { Link } from "wouter";
import { candidate, heatmapData, challenges, skills } from "../data/mockData";
import { LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

const sparklineData1 = [{ v: 30 }, { v: 33 }, { v: 35 }, { v: 38 }, { v: 40 }, { v: 44 }, { v: 47 }];
const sparklineData2 = [{ v: 88 }, { v: 89 }, { v: 89.5 }, { v: 90 }, { v: 90.8 }, { v: 91 }, { v: 91.2 }];
const sparklineData3 = [{ v: 3 }, { v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }, { v: 6 }, { v: 7 }];
const sparklineData4 = [{ v: 40000 }, { v: 55000 }, { v: 68000 }, { v: 80000 }, { v: 95000 }, { v: 110000 }, { v: 124000 }];

const HeatmapCell = ({ w, d, count }: { w: number; d: number; count: number }) => {
  const colors = ["#21262D", "#0e4429", "#006d32", "#26a641", "#39d353"];
  return (
    <rect x={w * 12} y={d * 12} width={10} height={10} fill={colors[count]} rx={2} className="transition-all hover:stroke-[#7C3AED] hover:stroke-1" data-count={count} />
  );
};

export default function CommandCenter() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Greeting */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-white mb-1">Good morning, {candidate.name.split(" ")[0]} 👋</h1>
          <p className="text-sm text-[#8B949E]">3 simulations active · 2 new project matches · 1 badge pending</p>
        </div>
        <button className="bg-[#7C3AED] hover:bg-[#6D28D9] hover:shadow-[0_0_15px_rgba(124,58,237,0.35)] text-white font-bold py-2 px-4 rounded-md transition-all" data-testid="btn-new-sim">
          + New Simulation
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 hover:border-[#7C3AED] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all relative">
          <div className="text-sm text-[#8B949E] mb-2">Simulations Run</div>
          <div className="text-3xl text-[#C4B5FD] font-mono font-bold">{candidate.simulations}</div>
          <div className="text-xs text-[#22C55E] mt-1">↑8 this month</div>
          <div className="absolute bottom-2 right-2 w-[80px] h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData1}>
                <Line type="monotone" dataKey="v" stroke="#C4B5FD" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 hover:border-[#7C3AED] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all relative">
          <div className="text-sm text-[#8B949E] mb-2">Avg Model Accuracy</div>
          <div className="text-3xl text-[#22D3EE] font-mono font-bold">{candidate.accuracy}%</div>
          <div className="text-xs text-[#8B949E] mt-1">Top 12% globally</div>
          <div className="absolute bottom-2 right-2 w-[80px] h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="v" stroke="#22D3EE" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 hover:border-[#7C3AED] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all relative">
          <div className="text-sm text-[#8B949E] mb-2">NFT Badges</div>
          <div className="text-3xl text-[#22C55E] font-mono font-bold">{candidate.badges}</div>
          <div className="text-xs text-[#8B949E] mt-1">2 minted this month</div>
          <div className="absolute bottom-2 right-2 w-[80px] h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="v" stroke="#22C55E" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 hover:border-[#7C3AED] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all relative">
          <div className="text-sm text-[#8B949E] mb-2">Total Earned</div>
          <div className="text-3xl text-[#F59E0B] font-mono font-bold">{candidate.earned}</div>
          <div className="text-xs text-[#8B949E] mt-1">23 projects</div>
          <div className="absolute bottom-2 right-2 w-[80px] h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData4}>
                <Line type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5 mb-6">
        <h3 className="text-sm font-medium text-white mb-4">Simulation Activity — Last 52 Weeks</h3>
        <div className="w-full overflow-x-auto">
          <svg width={52 * 12} height={7 * 12} className="min-w-max">
            {heatmapData.map((d, i) => (
              <HeatmapCell key={i} w={d.week} d={d.day} count={d.count} />
            ))}
          </svg>
        </div>
        <div className="text-xs text-[#8B949E] mt-3">{candidate.simulations} simulations in the last year</div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-4 mb-6">
        {/* Challenges Table */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#30363D]">
            <h3 className="text-sm font-medium text-white">Active Challenges</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0D1117] text-[#8B949E] text-xs">
                <tr>
                  <th className="px-4 py-3 font-medium">Challenge</th>
                  <th className="px-4 py-3 font-medium">Domain</th>
                  <th className="px-4 py-3 font-medium">Reward</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30363D]">
                {challenges.map((c, i) => (
                  <tr key={c.id} className="hover:bg-[#21262D] transition-colors">
                    <td className="px-4 py-4 text-white font-medium">{c.title}</td>
                    <td className="px-4 py-4">
                      {c.domain === "ML" ? (
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#1C1038] text-[#C4B5FD] border border-[#4C1D95]">ML</span>
                      ) : c.domain === "Time Series" ? (
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#052E16] text-[#22C55E] border border-[#14532D]">TIME SERIES</span>
                      ) : (
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#21262D] text-[#22D3EE] border border-[#30363D]">{c.domain}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[#22C55E] font-mono">{c.reward}</td>
                    <td className="px-4 py-4">
                      {c.status === "in_progress" ? (
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#2D1A00] text-[#F59E0B] border border-[#78350F]">IN PROGRESS</span>
                      ) : (
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">NOT STARTED</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {c.status === "in_progress" ? (
                        <Link href={`/simulation/${c.id}`} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs px-3 py-1.5 rounded font-bold transition-colors">
                          Continue →
                        </Link>
                      ) : (
                        <Link href={`/simulation/${c.id}`} className="text-[#E6EDF3] bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs px-3 py-1.5 rounded font-bold transition-colors">
                          Start →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-2">Skill Radar</h3>
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
      </div>

      {/* Skills breakdown */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-5">
        <h3 className="text-sm font-medium text-white mb-6">Competency Breakdown</h3>
        <div className="flex flex-col gap-4">
          {skills.map((s, i) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#E6EDF3]">{s.name}</span>
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
  );
}