import { useState } from 'react';

// ── Subscription tiers ──────────────────────────────────────────────────────
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    color: "#00e5a0",
    features: [
      "5 ZIP searches/month",
      "Business Demand Index",
      "Basic demographics",
      "Community voting (20 votes/mo)",
      "Email support",
    ],
    cta: "Start for $9/mo",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    color: "#00b4d8",
    badge: "Most Popular",
    features: [
      "Unlimited ZIP searches",
      "Full demographics breakdown",
      "Market Opportunity Score",
      "Competitor Gap Analysis",
      "Unlimited voting & requests",
      "Priority support",
    ],
    cta: "Go Pro for $29/mo",
  },
  {
    id: "agency",
    name: "Agency",
    price: 79,
    color: "#a78bfa",
    features: [
      "Everything in Pro",
      "AI-powered market analysis",
      "Up to 10 team members",
      "White-label reports (PDF)",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Get Agency for $79/mo",
  },
];

// ── Sample demand data ───────────────────────────────────────────────────────
const DEMAND_DB = {
  "90210": {
    city: "Beverly Hills, CA",
    population: 34000,
    medianIncome: 142000,
    medianAge: 44,
    growthRate: 1.2,
    opportunityScore: 78,
    demand: [
      { category: "Urgent Care / Medical", score: 94, trend: "up", gap: "High" },
      { category: "Childcare / Daycare", score: 88, trend: "up", gap: "High" },
      { category: "Organic Grocery", score: 81, trend: "up", gap: "Medium" },
      { category: "Pet Services", score: 74, trend: "up", gap: "Medium" },
      { category: "Gym / Fitness", score: 66, trend: "stable", gap: "Low" },
      { category: "Coffee Shop / Cafe", score: 58, trend: "stable", gap: "Low" },
      { category: "Auto Repair", score: 41, trend: "down", gap: "Saturated" },
    ],
  },
  "10001": {
    city: "New York, NY",
    population: 21000,
    medianIncome: 89000,
    medianAge: 36,
    growthRate: 0.4,
    opportunityScore: 85,
    demand: [
      { category: "Childcare / Daycare", score: 97, trend: "up", gap: "High" },
      { category: "Laundromat", score: 91, trend: "stable", gap: "High" },
      { category: "Grocery / Market", score: 84, trend: "up", gap: "Medium" },
      { category: "Restaurant / Food", score: 77, trend: "up", gap: "Medium" },
      { category: "Urgent Care / Medical", score: 69, trend: "up", gap: "Medium" },
      { category: "Pet Services", score: 61, trend: "up", gap: "Low" },
      { category: "Pharmacy", score: 44, trend: "down", gap: "Saturated" },
    ],
  },
  "77001": {
    city: "Houston, TX",
    population: 52000,
    medianIncome: 54000,
    medianAge: 32,
    growthRate: 2.8,
    opportunityScore: 91,
    demand: [
      { category: "Restaurant / Food", score: 96, trend: "up", gap: "High" },
      { category: "Urgent Care / Medical", score: 89, trend: "up", gap: "High" },
      { category: "Gym / Fitness", score: 83, trend: "up", gap: "High" },
      { category: "Bakery / Desserts", score: 75, trend: "up", gap: "Medium" },
      { category: "Tech Repair", score: 67, trend: "stable", gap: "Medium" },
      { category: "Auto Repair", score: 55, trend: "stable", gap: "Low" },
      { category: "Coffee Shop / Cafe", score: 48, trend: "up", gap: "Low" },
    ],
  },
};

const DEFAULT_REPORT = {
  city: "Your Area",
  population: 41000,
  medianIncome: 68000,
  medianAge: 38,
  growthRate: 1.6,
  opportunityScore: 72,
  demand: [
    { category: "Urgent Care / Medical", score: 88, trend: "up", gap: "High" },
    { category: "Childcare / Daycare", score: 79, trend: "up", gap: "High" },
    { category: "Grocery / Market", score: 71, trend: "stable", gap: "Medium" },
    { category: "Coffee Shop / Cafe", score: 63, trend: "up", gap: "Medium" },
    { category: "Gym / Fitness", score: 55, trend: "stable", gap: "Low" },
    { category: "Auto Repair", score: 38, trend: "down", gap: "Saturated" },
  ],
};

const LOADING_STEPS = [
  "Scanning ZIP code data...",
  "Pulling census demographics...",
  "Analyzing business gaps...",
  "Calculating opportunity score...",
  "Generating your report...",
];

const CATEGORIES = [
  "Restaurant / Food","Coffee Shop / Cafe","Grocery / Market","Pharmacy / Health",
  "Gym / Fitness","Salon / Barbershop","Laundromat","Auto Repair","Childcare / Daycare",
  "Urgent Care / Medical","Pet Services","Hardware / Home Improvement",
  "Tutoring / Education","Dry Cleaning","Entertainment / Recreation",
  "Banking / Financial","Tech Repair","Clothing / Boutique","Bakery / Desserts","Other",
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function TrendBadge({ trend }) {
  const map = {
    up: { label: "▲ Rising", color: "#00e5a0", bg: "rgba(0,229,160,0.12)" },
    down: { label: "▼ Fading", color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
    stable: { label: "● Steady", color: "#aaa", bg: "rgba(170,170,170,0.1)" },
  };
  const t = map[trend] || map.stable;
  return (
    <span style={{ color: t.color, fontSize: "11px", fontWeight: 700, background: t.bg, padding: "2px 8px", borderRadius: "20px" }}>
      {t.label}
    </span>
  );
}

function GapBadge({ gap }) {
  const map = {
    High: { color: "#ff9f43", bg: "rgba(255,159,67,0.12)" },
    Medium: { color: "#00b4d8", bg: "rgba(0,180,216,0.12)" },
    Low: { color: "#aaa", bg: "rgba(170,170,170,0.1)" },
    Saturated: { color: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
  };
  const g = map[gap] || map.Low;
  return (
    <span style={{ color: g.color, fontSize: "11px", fontWeight: 700, background: g.bg, padding: "2px 8px", borderRadius: "20px" }}>
      {gap === "Saturated" ? "⚠ Saturated" : `${gap} Gap`}
    </span>
  );
}

function ScoreRing({ score }) {
  const r = 36, c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  const color = score >= 80 ? "#00e5a0" : score >= 60 ? "#00b4d8" : "#ff9f43";
  return (
    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
      <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${filled} ${c}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "20px", fontWeight: 900, color }}>{score}</span>
        <span style={{ fontSize: "9px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>Score</span>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function BizDemand() {
  const [view, setView] = useState("home");
  const [zipInput, setZipInput] = useState("");
  const [report, setReport] = useState(null);
  const [searchedZip, setSearchedZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [plan, setPlan] = useState(null); // null = free
  const [showPlans, setShowPlans] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [requestZip, setRequestZip] = useState("");
  const [requestCategory, setRequestCategory] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [localRequests, setLocalRequests] = useState([]);
  const [votedItems, setVotedItems] = useState({});
  const [authMode, setAuthMode] = useState(null); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const runSearch = async (zip) => {
    if (!zip.trim()) return;
    setLoading(true);
    setLoadStep(0);
    setReport(null);
    setAiAnalysis("");
    setView("explore");

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 520));
      setLoadStep(i + 1);
    }

    const data = DEMAND_DB[zip.trim()] || { ...DEFAULT_REPORT, city: `ZIP ${zip.trim()}` };
    setReport(data);
    setSearchedZip(zip.trim());
    setLoading(false);
  };

  const getAiAnalysis = async () => {
    if (!report || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a business market analyst. Given this ZIP code market data, provide a 3-paragraph strategic analysis for an entrepreneur considering opening a business here. Be specific, actionable, and data-driven.

ZIP: ${searchedZip}
City: ${report.city}
Population: ${report.population.toLocaleString()}
Median Income: $${report.medianIncome.toLocaleString()}
Median Age: ${report.medianAge}
Growth Rate: ${report.growthRate}%/yr
Opportunity Score: ${report.opportunityScore}/100
Top demand gaps: ${report.demand.filter(d => d.gap === "High").map(d => d.category).join(", ")}

Keep it under 200 words, no bullet points, practical and encouraging.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Analysis unavailable.";
      setAiAnalysis(text);
    } catch {
      setAiAnalysis("AI analysis is temporarily unavailable. Please try again shortly.");
    }
    setAiLoading(false);
  };

  const handleVote = (index) => {
    const key = `${searchedZip}-${index}`;
    if (votedItems[key]) return;
    setVotedItems(prev => ({ ...prev, [key]: true }));
    setReport(prev => ({
      ...prev,
      demand: prev.demand.map((d, i) => i === index ? { ...d, score: Math.min(d.score + 2, 100) } : d)
    }));
  };

  const handleRequest = () => {
    if (!requestZip.trim() || !requestCategory) return;
    setLocalRequests(prev => [{ zip: requestZip, category: requestCategory, note: requestNote, votes: 1 }, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setRequestZip(""); setRequestCategory(""); setRequestNote(""); }, 2800);
  };

  const handleAuth = () => {
    if (!email || !password) return;
    setUser({ email, name: email.split("@")[0] });
    setAuthMode(null);
    setEmail(""); setPassword("");
  };

  const handleSubscribe = (tier) => {
    if (!user) { setAuthMode("signup"); setSelectedTier(tier); return; }
    // In production, this opens Stripe Checkout
    alert(`🚀 Redirecting to Stripe Checkout for ${tier.name} plan ($${tier.price}/mo)...\n\nTo go live: add your Stripe publishable key and create price IDs for each plan at stripe.com`);
    setPlan(tier);
    setShowPlans(false);
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    app: { minHeight: "100vh", background: "#080c18", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#f0f0f0" },
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,12,24,0.97)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: "21px", fontWeight: 900, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#00e5a0,#00b4d8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" },
    navBtn: (a) => ({ padding: "7px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, background: a ? "rgba(0,229,160,0.15)" : "transparent", color: a ? "#00e5a0" : "#999" }),
    upgradeBtn: { padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(0,229,160,0.4)", background: "rgba(0,229,160,0.08)", color: "#00e5a0", fontWeight: 700, fontSize: "12px", cursor: "pointer" },
    hero: { textAlign: "center", padding: "80px 24px 50px", background: "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(0,229,160,0.07) 0%,transparent 70%)" },
    eyebrow: { fontSize: "10px", fontWeight: 700, letterSpacing: "3px", color: "#00e5a0", textTransform: "uppercase", marginBottom: "18px" },
    h1: { fontSize: "clamp(34px,6vw,64px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "18px", background: "linear-gradient(160deg,#fff 40%,#777 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
    sub: { fontSize: "17px", color: "#777", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.6 },
    searchBox: { display: "flex", gap: "8px", maxWidth: "420px", margin: "0 auto", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "7px" },
    inp: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px", padding: "8px 10px" },
    primaryBtn: { background: "linear-gradient(135deg,#00e5a0,#00b4d8)", border: "none", borderRadius: "10px", padding: "11px 22px", color: "#080c18", fontWeight: 800, fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap" },
    section: { maxWidth: "700px", margin: "0 auto", padding: "36px 20px" },
    card: (highlight) => ({ background: highlight ? "rgba(0,229,160,0.06)" : "rgba(255,255,255,0.03)", border: highlight ? "1px solid rgba(0,229,160,0.2)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px 18px", marginBottom: "10px" }),
    planCard: (color, selected) => ({ background: selected ? `rgba(${hexToRgb(color)},0.1)` : "rgba(255,255,255,0.03)", border: `1px solid ${selected ? color : "rgba(255,255,255,0.08)"}`, borderRadius: "16px", padding: "24px", flex: 1, minWidth: "200px", transition: "all 0.2s" }),
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
    modal: { background: "#0e1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" },
    formInp: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "11px 14px", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box", marginBottom: "14px" },
    sel: { width: "100%", background: "#0e1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "11px 14px", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box", marginBottom: "14px" },
    lockOverlay: { position: "absolute", inset: 0, background: "rgba(8,12,24,0.85)", backdropFilter: "blur(5px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: "14px", zIndex: 10 },
  };

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  const isPro = plan && (plan.id === "pro" || plan.id === "agency");
  const isAgency = plan && plan.id === "agency";

  return (
    <div style={S.app}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => setView("home")}>BizDemand</div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button style={S.navBtn(view === "home")} onClick={() => setView("home")}>Home</button>
          <button style={S.navBtn(view === "explore")} onClick={() => setView("explore")}>Explore</button>
          <button style={S.navBtn(view === "request")} onClick={() => setView("request")}>Request</button>
          {user
            ? <button style={S.upgradeBtn} onClick={() => setShowPlans(true)}>{plan ? `✓ ${plan.name}` : "⭐ Upgrade"}</button>
            : <button style={S.upgradeBtn} onClick={() => setAuthMode("login")}>Sign In</button>
          }
        </div>
      </nav>

      {/* HOME */}
      {view === "home" && (
        <>
          <div style={S.hero}>
            <div style={S.eyebrow}>Know Before You Go</div>
            <h1 style={S.h1}>What Does Your<br />Community Need?</h1>
            <p style={S.sub}>Search any ZIP code to discover which businesses are in demand — before you invest a single dollar.</p>
            <div style={S.searchBox}>
              <input style={S.inp} placeholder="Enter ZIP code..." value={zipInput}
                onChange={e => setZipInput(e.target.value)} onKeyDown={e => e.key === "Enter" && runSearch(zipInput)} maxLength={5} />
              <button style={S.primaryBtn} onClick={() => runSearch(zipInput)}>Analyze →</button>
            </div>
            <p style={{ color: "#444", fontSize: "12px", marginTop: "16px" }}>Try: 90210 · 10001 · 77001</p>
          </div>

          {/* Who it's for */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px", maxWidth: "720px", margin: "0 auto", padding: "0 20px 60px" }}>
            {[
              { icon: "🏘️", title: "Community Members", desc: "Request & vote on the businesses you want in your neighborhood." },
              { icon: "🚀", title: "Entrepreneurs", desc: "Research real demand before you open. Stop guessing — start knowing." },
              { icon: "📈", title: "Business Owners", desc: "Stay ahead of trends. See if demand is rising or shifting in your area." },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", textAlign: "center" }}>
                <div style={{ fontSize: "30px", marginBottom: "10px" }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>{c.title}</div>
                <div style={{ color: "#666", fontSize: "13px", lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Pricing preview */}
          <div style={{ textAlign: "center", padding: "10px 20px 60px" }}>
            <div style={S.eyebrow}>Pricing</div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.5px" }}>Simple, Transparent Plans</h2>
            <p style={{ color: "#666", marginBottom: "32px", fontSize: "14px" }}>Start free. Upgrade when you're ready to go deeper.</p>
            <div style={{ display: "flex", gap: "14px", maxWidth: "720px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              {TIERS.map(t => (
                <div key={t.id} style={S.planCard(t.color, false)}>
                  {t.badge && <div style={{ fontSize: "10px", fontWeight: 700, color: t.color, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{t.badge}</div>}
                  <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "4px", color: t.color }}>{t.name}</div>
                  <div style={{ fontSize: "28px", fontWeight: 900, marginBottom: "16px" }}>${t.price}<span style={{ fontSize: "13px", color: "#666", fontWeight: 400 }}>/mo</span></div>
                  {t.features.map(f => <div key={f} style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>✓ {f}</div>)}
                  <button style={{ ...S.primaryBtn, marginTop: "16px", width: "100%", background: `linear-gradient(135deg,${t.color},${t.color}cc)` }}
                    onClick={() => handleSubscribe(t)}>{t.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* EXPLORE */}
      {view === "explore" && (
        <div style={S.section}>
          <div style={S.eyebrow}>Market Report</div>
          <div style={{ fontSize: "26px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.5px" }}>
            {report ? report.city : "Enter a ZIP Code"}
          </div>
          <div style={{ color: "#666", fontSize: "13px", marginBottom: "20px" }}>
            {report ? `ZIP ${searchedZip} · Real-time demand analysis` : "Search below to see what your community needs"}
          </div>

          {/* Search bar */}
          <div style={{ ...S.searchBox, margin: "0 0 28px" }}>
            <input style={S.inp} placeholder="Enter ZIP code..." value={zipInput}
              onChange={e => setZipInput(e.target.value)} onKeyDown={e => e.key === "Enter" && runSearch(zipInput)} maxLength={5} />
            <button style={S.primaryBtn} onClick={() => runSearch(zipInput)}>Analyze →</button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              {LOADING_STEPS.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", marginBottom: "12px", opacity: i < loadStep ? 1 : 0.25, transition: "opacity 0.4s" }}>
                  <span style={{ color: i < loadStep ? "#00e5a0" : "#444", fontSize: "16px" }}>{i < loadStep ? "✓" : "○"}</span>
                  <span style={{ fontSize: "14px", color: i < loadStep ? "#ccc" : "#555" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Report */}
          {report && !loading && (
            <>
              {/* Stats row */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
                {[
                  { label: "Population", val: report.population.toLocaleString() },
                  { label: "Median Income", val: `$${(report.medianIncome/1000).toFixed(0)}k` },
                  { label: "Median Age", val: report.medianAge },
                  { label: "Growth/yr", val: `${report.growthRate}%` },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px 16px", flex: 1, minWidth: "80px" }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>{s.val}</div>
                    <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Opportunity Score */}
              <div style={{ ...S.card(true), display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <ScoreRing score={report.opportunityScore} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: "17px", marginBottom: "4px" }}>Market Opportunity Score</div>
                  <div style={{ color: "#777", fontSize: "13px", lineHeight: 1.5 }}>
                    {report.opportunityScore >= 80 ? "🔥 Excellent market conditions — high unmet demand detected." :
                     report.opportunityScore >= 60 ? "✅ Good opportunity with multiple underserved categories." :
                     "⚠️ Competitive market — niche positioning recommended."}
                  </div>
                </div>
              </div>

              {/* Demand list */}
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Business Demand Index</div>
              {report.demand.map((item, i) => (
                <div key={i} style={{ ...S.card(i === 0), display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ fontSize: i === 0 ? "20px" : "13px", fontWeight: 900, color: i === 0 ? "#00e5a0" : "#444", minWidth: "24px", textAlign: "center" }}>
                    {i === 0 ? "🔥" : `#${i+1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      {item.category}
                      <TrendBadge trend={item.trend} />
                      <GapBadge gap={item.gap} />
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "6px", height: "6px", width: "100%", overflow: "hidden", marginTop: "6px" }}>
                      <div style={{ width: `${item.score}%`, height: "100%", borderRadius: "6px", background: "linear-gradient(90deg,#00e5a0,#00b4d8)", transition: "width 1s" }} />
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>Demand score: {item.score}/100</div>
                  </div>
                  <button onClick={() => handleVote(i)}
                    style={{ background: votedItems[`${searchedZip}-${i}`] ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.06)", border: votedItems[`${searchedZip}-${i}`] ? "1px solid rgba(0,229,160,0.4)" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "6px 12px", color: votedItems[`${searchedZip}-${i}`] ? "#00e5a0" : "#888", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {votedItems[`${searchedZip}-${i}`] ? "✓ Voted" : "+ Vote"}
                  </button>
                </div>
              ))}

              {/* Competitor Gap Analysis — locked for free */}
              <div style={{ position: "relative", marginTop: "20px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>🏆 Competitor Gap Analysis</div>
                <div style={{ filter: isPro ? "none" : "blur(5px)", pointerEvents: isPro ? "auto" : "none" }}>
                  {report.demand.filter(d => d.gap === "High").map((item, i) => (
                    <div key={i} style={{ ...S.card(false), marginBottom: "8px" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px" }}>{item.category}</div>
                      <div style={{ color: "#777", fontSize: "12px", marginTop: "4px" }}>
                        High demand, low competition — ideal entry point for a new business in ZIP {searchedZip}.
                      </div>
                    </div>
                  ))}
                </div>
                {!isPro && (
                  <div style={S.lockOverlay}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
                    <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "6px" }}>Pro Feature</div>
                    <div style={{ color: "#777", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>Unlock Competitor Gap Analysis with a Pro or Agency plan</div>
                    <button style={S.primaryBtn} onClick={() => setShowPlans(true)}>Upgrade to Unlock</button>
                  </div>
                )}
              </div>

              {/* AI Analysis — Agency only */}
              <div style={{ position: "relative", marginTop: "20px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>🤖 AI Market Analysis</div>
                {isAgency ? (
                  aiAnalysis ? (
                    <div style={{ ...S.card(false), lineHeight: 1.7, fontSize: "14px", color: "#ccc" }}>{aiAnalysis}</div>
                  ) : (
                    <button style={{ ...S.primaryBtn, width: "100%" }} onClick={getAiAnalysis}>
                      {aiLoading ? "Analyzing..." : "Generate AI Analysis"}
                    </button>
                  )
                ) : (
                  <div style={{ ...S.card(false), display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ fontSize: "24px" }}>🔒</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>Agency Feature</div>
                      <div style={{ color: "#666", fontSize: "13px" }}>Get AI-powered strategic insights powered by Claude — available on Agency plan ($79/mo)</div>
                    </div>
                    <button style={{ ...S.primaryBtn, whiteSpace: "nowrap", fontSize: "12px" }} onClick={() => setShowPlans(true)}>Unlock</button>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <button style={S.primaryBtn} onClick={() => setView("request")}>+ Request a Business Here</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* REQUEST */}
      {view === "request" && (
        <div style={S.section}>
          <div style={S.eyebrow}>Your Voice Matters</div>
          <div style={{ fontSize: "26px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.5px" }}>Request a Business</div>
          <div style={{ color: "#666", fontSize: "13px", marginBottom: "24px" }}>Tell your community what you need. Every request shapes the demand data.</div>

          {submitted && (
            <div style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)", borderRadius: "12px", padding: "14px 18px", color: "#00e5a0", fontWeight: 700, fontSize: "14px", textAlign: "center", marginBottom: "18px" }}>
              ✓ Request submitted! Your community thanks you.
            </div>
          )}

          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Your ZIP Code</label>
            <input style={S.formInp} placeholder="e.g. 30301" value={requestZip} onChange={e => setRequestZip(e.target.value)} maxLength={5} />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Business Type</label>
            <select style={S.sel} value={requestCategory} onChange={e => setRequestCategory(e.target.value)}>
              <option value="">Select a category...</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#777", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>Details (Optional)</label>
            <textarea style={{ ...S.formInp, minHeight: "80px", resize: "vertical", marginBottom: 0 }}
              placeholder="What specifically would you like to see?" value={requestNote} onChange={e => setRequestNote(e.target.value)} />
          </div>
          <button style={{ ...S.primaryBtn, width: "100%", padding: "14px" }} onClick={handleRequest}>Submit Request →</button>

          {localRequests.length > 0 && (
            <div style={{ marginTop: "28px" }}>
              <div style={{ fontWeight: 700, fontSize: "12px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Recent Requests</div>
              {localRequests.map((r, i) => (
                <div key={i} style={{ ...S.card(false), marginBottom: "8px" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{r.category}</div>
                  <div style={{ color: "#666", fontSize: "12px" }}>ZIP {r.zip}{r.note ? ` · "${r.note}"` : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PLANS MODAL */}
      {showPlans && (
        <div style={S.overlay} onClick={() => setShowPlans(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={S.eyebrow}>Upgrade BizDemand</div>
              <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Choose Your Plan</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {TIERS.map(t => (
                <div key={t.id} style={{ border: `1px solid ${t.color}44`, borderRadius: "14px", padding: "18px 20px", background: `rgba(${hexToRgb(t.color)},0.05)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "16px", color: t.color }}>{t.name}</span>
                      {t.badge && <span style={{ marginLeft: "8px", fontSize: "10px", fontWeight: 700, color: t.color, background: `rgba(${hexToRgb(t.color)},0.15)`, padding: "2px 8px", borderRadius: "20px" }}>{t.badge}</span>}
                    </div>
                    <span style={{ fontSize: "22px", fontWeight: 900 }}>${t.price}<span style={{ fontSize: "12px", color: "#666", fontWeight: 400 }}>/mo</span></span>
                  </div>
                  {t.features.map(f => <div key={f} style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>✓ {f}</div>)}
                  <button style={{ ...S.primaryBtn, marginTop: "14px", width: "100%", background: `linear-gradient(135deg,${t.color},${t.color}bb)` }}
                    onClick={() => handleSubscribe(t)}>{t.cta}</button>
                </div>
              ))}
            </div>
            <button style={{ marginTop: "16px", width: "100%", background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "13px" }} onClick={() => setShowPlans(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {authMode && (
        <div style={S.overlay} onClick={() => setAuthMode(null)}>
          <div style={{ ...S.modal, maxWidth: "360px" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={S.logo}>BizDemand</div>
              <div style={{ fontSize: "20px", fontWeight: 800, marginTop: "12px" }}>{authMode === "login" ? "Welcome back" : "Create your account"}</div>
            </div>
            <input style={S.formInp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={S.formInp} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button style={{ ...S.primaryBtn, width: "100%", padding: "14px" }} onClick={handleAuth}>
              {authMode === "login" ? "Sign In" : "Create Account"}
            </button>
            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#555" }}>
              {authMode === "login"
                ? <span>No account? <span style={{ color: "#00e5a0", cursor: "pointer" }} onClick={() => setAuthMode("signup")}>Sign up free</span></span>
                : <span>Already have one? <span style={{ color: "#00e5a0", cursor: "pointer" }} onClick={() => setAuthMode("login")}>Sign in</span></span>}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "36px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "40px" }}>
        <div style={{ ...S.logo, display: "inline-block", marginBottom: "6px" }}>BizDemand</div>
        <div style={{ color: "#333", fontSize: "12px" }}>by NotYourBizness · Know before you go</div>
      </div>
    </div>
  );
}
