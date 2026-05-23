import { Link } from "wouter";
import { Hexagon, Bell, Zap, Play, ChevronRight, Database, Brain, Shield, TrendingUp, Award, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-[#0D1117]/90 backdrop-blur border-b border-[#21262D] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Hexagon className="fill-[#7C3AED] text-[#7C3AED] w-7 h-7" />
          <span className="font-bold text-white text-base">DataForge</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#7C3AED] text-white ml-1">DATA LAB</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "SimLab", href: "/simulation/ML-CHURN-003" },
            { label: "DataEdge", href: "/playground" },
            { label: "Challenges", href: "/challenges" },
            { label: "Leaderboard", href: "/leaderboard" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="text-sm text-[#8B949E] hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative text-[#8B949E] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7C3AED] text-white text-[9px] flex items-center justify-center font-bold">3</span>
          </button>
          <button className="text-sm text-[#8B949E] hover:text-white transition-colors px-3 py-1.5">
            Sign In
          </button>
          <Link href="/dashboard">
            <button className="text-sm font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded transition-colors">
              Start Simulation
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-[60px]">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glowing orb behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Tag line */}
          <div className="flex items-center justify-center gap-1.5 mb-8 text-[#A78BFA] text-[11px] font-semibold tracking-[0.18em] uppercase">
            <ChevronRight className="w-3 h-3" />
            <span>ML · NLP · CV · STATISTICS — DATA ENGINE v2.0</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-white">Your Models.</span>{" "}
            <span className="text-[#7C3AED]">AI-Scored.</span>
            <br />
            <span className="text-[#7C3AED]">Blockchain-Verified.</span>
          </h1>

          {/* Subheading */}
          <p className="text-[#8B949E] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Run ML, NLP, and statistical simulations on your datasets. Get an AI-graded score, earn blockchain-verified credentials, and build a portfolio employers can trust.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-base px-7 py-3.5 rounded transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#7C3AED]/30">
                <Zap className="w-4 h-4" />
                Start Simulating — Free
              </button>
            </Link>
            <Link href="/simulation/ML-CHURN-003">
              <button className="flex items-center gap-2 bg-transparent hover:bg-[#21262D] text-white font-semibold text-base px-7 py-3.5 rounded border border-[#30363D] transition-all hover:border-[#8B949E]">
                <Play className="w-4 h-4 fill-white" />
                Watch a Live ML Run
              </button>
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto w-full">
          {[
            { value: "12,400+", label: "Simulations Run" },
            { value: "98.2%", label: "Avg. AUC-ROC" },
            { value: "3,800+", label: "Verified Credentials" },
            { value: "Top 1%", label: "Global Leaderboard" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white font-mono">{value}</div>
              <div className="text-xs text-[#8B949E] mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#A78BFA] text-xs font-semibold uppercase tracking-[0.2em] mb-3">What You Get</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Everything You Need to Prove Your Skills</h2>
          <p className="text-[#8B949E] mt-4 max-w-xl mx-auto">From raw data to a verified credential — the full pipeline in one platform.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              color: "#7C3AED",
              bg: "#1C1038",
              border: "#4C1D95",
              title: "AI-Graded Simulations",
              desc: "Run XGBoost, Random Forest, and NLP pipelines. Get instant feedback with an AI-generated TFES score based on your results.",
            },
            {
              icon: Shield,
              color: "#22D3EE",
              bg: "#0C2A3A",
              border: "#164E63",
              title: "Blockchain Credentials",
              desc: "Every passing simulation mints a tamper-proof credential on Polygon PoS. Share a verifiable link with any employer.",
            },
            {
              icon: TrendingUp,
              color: "#22C55E",
              bg: "#0A2818",
              border: "#14532D",
              title: "Live Performance Metrics",
              desc: "Track AUC-ROC, F1 Score, precision, recall, and more in real time. Compare runs and iterate on your models instantly.",
            },
            {
              icon: Database,
              color: "#F59E0B",
              bg: "#2A1B07",
              border: "#78350F",
              title: "Data Playground",
              desc: "Upload your own CSV or PDF datasets and experiment freely. Tune hyperparameters before committing to an official run.",
            },
            {
              icon: Award,
              color: "#A78BFA",
              bg: "#1C1038",
              border: "#4C1D95",
              title: "NFT Badge Wall",
              desc: "Complete challenges to earn domain-specific badges (Fraud Detection, NLP Master, etc.) that appear on your portfolio.",
            },
            {
              icon: Users,
              color: "#C4B5FD",
              bg: "#1C1038",
              border: "#4C1D95",
              title: "Global Leaderboard",
              desc: "See where you rank among thousands of candidates. Climb tiers from Analyst to Legend and get noticed by top companies.",
            },
          ].map(({ icon: Icon, color, bg, border, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${color}22` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{title}</h3>
              <p className="text-[#8B949E] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center rounded-2xl border border-[#30363D] bg-[#161B22] p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/15 via-transparent to-[#4C1D95]/15 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[#A78BFA] text-xs font-semibold uppercase tracking-[0.2em] mb-3">Ready to compete?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your portfolio won't build itself.
            </h2>
            <p className="text-[#8B949E] mb-8 max-w-md mx-auto">
              Join thousands of data scientists who've already earned verified credentials and landed top roles.
            </p>
            <Link href="/dashboard">
              <button className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-base px-8 py-4 rounded transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#7C3AED]/30">
                <Zap className="w-4 h-4" />
                Get Started — It's Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#21262D] py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Hexagon className="fill-[#7C3AED] text-[#7C3AED] w-5 h-5" />
          <span className="font-bold text-white text-sm">DataForge</span>
          <span className="text-[#8B949E] text-xs">by Talent Forge</span>
        </div>
        <p className="text-[#8B949E] text-xs">© 2026 Talent Forge. All rights reserved.</p>
      </footer>
    </div>
  );
}
