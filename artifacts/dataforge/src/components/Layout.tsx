import { Link, useLocation } from "wouter";
import { Hexagon, LayoutDashboard, FlaskConical, Globe, Target, Trophy, User, Settings } from "lucide-react";
import { candidate } from "../data/mockData";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navLinks = [
    { label: "Command Center", href: "/" },
    { label: "Simulation Lab", href: "/simulation/ML-CHURN-003" },
    { label: "Portfolio", href: "/portfolio" },
  ];

  const sidebarLinks = [
    { icon: LayoutDashboard, label: "Command Center", href: "/" },
    { icon: FlaskConical, label: "Simulation Lab", href: "/simulation/ML-CHURN-003" },
    { icon: Globe, label: "Portfolio Builder", href: "/portfolio" },
    { icon: Target, label: "Challenges", href: "#" },
    { icon: Trophy, label: "Leaderboard", href: "#" },
    { icon: User, label: "Profile", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] font-sans">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-[#161B22] border-b border-[#30363D] flex items-center justify-between px-4">
        <div className="flex items-center">
          <Hexagon className="fill-[#7C3AED] text-[#7C3AED] w-7 h-7" />
          <span className="font-bold text-white text-base ml-2">DataForge</span>
          <span className="text-[11px] text-[#8B949E] ml-1 mt-1">by Talent Forge</span>
        </div>

        <nav className="flex gap-4">
          {navLinks.map((link) => {
            const isActive = location === link.href || (location.startsWith("/simulation") && link.href.startsWith("/simulation"));
            return (
              <Link key={link.href} href={link.href} className={`px-3 py-1 rounded text-sm transition-colors ${isActive ? "bg-[#7C3AED] text-white" : "text-[#8B949E] hover:text-white"}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col items-end">
            <span className="text-sm text-white font-medium">{candidate.name}</span>
            <span className="text-[11px] text-[#8B949E]">{candidate.tier} Tier</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">
            {candidate.initials}
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-[56px] bottom-0 w-[220px] bg-[#161B22] border-r border-[#30363D] overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-[#30363D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold shrink-0">
              {candidate.initials}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{candidate.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-mono uppercase px-1.5 py-[2px] rounded bg-[#1C1038] text-[#C4B5FD] border border-[#4C1D95]">{candidate.tier} Tier</span>
                <span className="text-[11px] font-mono text-[#22D3EE] bg-[#21262D] px-1.5 py-[2px] rounded border border-[#30363D]">TFES {candidate.tfes}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1">
          {sidebarLinks.map((link, idx) => {
            const isActive = location === link.href || (location.startsWith("/simulation") && link.href.startsWith("/simulation"));
            const Icon = link.icon;
            
            return (
              <div key={idx}>
                {idx === 3 && <div className="h-px bg-[#30363D] my-2 mx-4" />}
                <Link href={link.href} className={`h-10 px-4 flex items-center gap-3 cursor-pointer transition-colors ${isActive ? "border-l-[3px] border-[#7C3AED] bg-[#1C1038] text-white" : "border-l-[3px] border-transparent text-[#8B949E] hover:bg-[#21262D] hover:text-white"}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{link.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-[#30363D] bg-[#161B22]">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-[#8B949E] uppercase tracking-wider font-semibold">Expert → Master</span>
          </div>
          <div className="text-sm text-white mb-2">XP Progress</div>
          <div className="h-2 w-full bg-[#21262D] rounded overflow-hidden">
            <div className="h-full bg-[#7C3AED] rounded" style={{ width: `${(candidate.xp / candidate.xpTarget) * 100}%` }} />
          </div>
          <div className="mt-2 text-xs font-mono text-[#8B949E] text-right">
            {candidate.xp.toLocaleString()} / {candidate.xpTarget.toLocaleString()} XP
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[220px] pt-[56px] p-6 min-h-screen bg-[#0D1117]">
        {children}
      </main>
    </div>
  );
}