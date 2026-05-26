import { useState, useEffect, useRef } from "react";

const C = {
  blue: "#3B82F6", blueDark: "#2563EB", blueLight: "#EFF6FF",
  green: "#16A34A", greenLight: "#F0FDF4",
  red: "#EF4444", redLight: "#FEF2F2",
  amber: "#D97706", amberLight: "#FFFBEB",
  purple: "#7C3AED", purpleLight: "#F5F3FF",
  teal: "#0D9488", tealLight: "#F0FDFA",
  pink: "#DB2777", pinkLight: "#FDF2F8",
  orange: "#EA580C", orangeLight: "#FFF7ED",
  bg: "#F0F4F8", white: "#FFFFFF",
  g100: "#F3F4F6", g200: "#E5E7EB", g300: "#D1D5DB",
  g400: "#9CA3AF", g500: "#6B7280", g700: "#374151", g900: "#111827",
};

// ── shared primitives ─────────────────────────────────────────────────────────
const Pill = ({ label, color, bg, border }) => (
  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
    color, background: bg, border: `1px solid ${border}`, whiteSpace: "nowrap" }}>
    {label}
  </span>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 18, padding: 16,
    boxShadow: "0 1px 6px rgba(0,0,0,.07)", cursor: onClick ? "pointer" : "default", ...style }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 700, color: C.g700 }}>{label}</p>
    {children}
  </div>
);

const TextInput = ({ placeholder, value, onChange, type = "text", style = {} }) => (
  <input placeholder={placeholder} value={value} onChange={onChange} type={type}
    style={{ border: `1.5px solid ${C.g200}`, borderRadius: 12, padding: "11px 14px",
      fontSize: 14, color: C.g900, background: C.white, outline: "none",
      fontFamily: "inherit", width: "100%", boxSizing: "border-box", ...style }} />
);

const Textarea = ({ placeholder, value, onChange, rows = 3, style = {} }) => (
  <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows}
    style={{ border: `1.5px solid ${C.g200}`, borderRadius: 12, padding: "11px 14px",
      fontSize: 14, color: C.g900, background: C.white, outline: "none",
      fontFamily: "inherit", width: "100%", boxSizing: "border-box",
      resize: "vertical", lineHeight: 1.6, ...style }} />
);

const Btn = ({ children, onClick, color = C.blue, outline = false, style = {} }) => (
  <button onClick={onClick} style={{
    background: outline ? C.white : color,
    color: outline ? color : "#fff",
    border: outline ? `1.5px solid ${color}` : "none",
    borderRadius: 13, padding: "12px 18px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", ...style }}>
    {children}
  </button>
);

const Modal = ({ onClose, title, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200,
    display: "flex", alignItems: "flex-end", justifyContent: "center" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: C.white, borderRadius: "22px 22px 0 0", padding: "24px 20px 40px",
      width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 14,
      maxHeight: "90vh", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.g900 }}>{title}</h3>
        <button onClick={onClose} style={{ background: C.g100, border: "none", borderRadius: "50%",
          width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── domain constants ──────────────────────────────────────────────────────────
const CAT_EV = {
  pickup:   { label: "Pick-up",       color: C.green,  bg: C.greenLight,  border: "#BBF7D0" },
  medical:  { label: "Medical",       color: C.red,    bg: C.redLight,    border: "#FECACA" },
  school:   { label: "School",        color: C.blue,   bg: C.blueLight,   border: "#BFDBFE" },
  activity: { label: "Activity",      color: C.amber,  bg: C.amberLight,  border: "#FDE68A" },
  payment:  { label: "Payment",       color: C.purple, bg: C.purpleLight, border: "#DDD6FE" },
  custody:  { label: "Custody",       color: C.teal,   bg: C.tealLight,   border: "#99F6E4" },
  holiday:  { label: "School Holiday",color: "#D97706",bg: "#FFFBEB",     border: "#FDE68A" },
};

const SHOP_CATS = [
  { id: "all",     label: "All",     emoji: "🛍️" },
  { id: "clothes", label: "Clothes", emoji: "👕" },
  { id: "school",  label: "School",  emoji: "🎒" },
  { id: "sports",  label: "Sports",  emoji: "⚽" },
  { id: "health",  label: "Health",  emoji: "💊" },
  { id: "other",   label: "Other",   emoji: "📦" },
];

const CAT_COLORS = {
  clothes: { color: C.pink,   bg: C.pinkLight,   border: "#FBCFE8" },
  school:  { color: C.blue,   bg: C.blueLight,   border: "#BFDBFE" },
  sports:  { color: C.green,  bg: C.greenLight,  border: "#BBF7D0" },
  health:  { color: C.red,    bg: C.redLight,    border: "#FECACA" },
  other:   { color: C.orange, bg: C.orangeLight, border: "#FED7AA" },
};

const PRI = {
  urgent: { label: "Urgent", color: C.red,   bg: C.redLight,   border: "#FECACA" },
  soon:   { label: "Soon",   color: C.amber, bg: C.amberLight, border: "#FDE68A" },
  later:  { label: "Later",  color: C.g500,  bg: C.g100,       border: C.g200   },
};

const WHO = {
  both: { label: "Both parents", color: C.teal,   bg: C.tealLight,   border: "#99F6E4" },
  mom:  { label: "Mom",          color: C.pink,   bg: C.pinkLight,   border: "#FBCFE8" },
  dad:  { label: "Dad",          color: C.blue,   bg: C.blueLight,   border: "#BFDBFE" },
  me:   { label: "Just me",      color: C.g500,   bg: C.g100,        border: C.g200   },
};

// ── date helpers (used by HomeScreen + CalendarScreen) ───────────────────────
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CAT_ICONS   = { pickup:"🚗", medical:"💊", school:"✏️", activity:"⚽", payment:"💳", custody:"🤝" };

function toISO(y,m,d){ return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function parseISO(s){ const [y,m,d]=s.split("-").map(Number); return {y,m:m-1,d}; }
function daysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }
function startWd(y,m){ return new Date(y,m,1).getDay(); }
function todayISO(){
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}
function fmtDate(iso){
  if(!iso) return "";
  const {y,m,d}=parseISO(iso);
  return `${DAY_NAMES[new Date(y,m,d).getDay()]} ${d} ${MONTH_NAMES[m]} ${y}`;
}

// ── seed data ─────────────────────────────────────────────────────────────────
const INIT_ITEMS = [
  { id: 1, name: "School shoes (size 2)", category: "clothes", priority: "urgent",
    shop: "Woolworths", notes: "Black, closed toe for uniform",
    budget: 450, actualCost: null, sharedWith: "both", done: false },
  { id: 2, name: "Winter jacket", category: "clothes", priority: "soon",
    shop: "H&M Kids", notes: "Size 7–8, navy or grey",
    budget: 380, actualCost: null, sharedWith: "both", done: false },
  { id: 3, name: "Pencil case + stationery", category: "school", priority: "urgent",
    shop: "Stationery Warehouse", notes: "New pencils, ruler, eraser, sharpener",
    budget: 120, actualCost: null, sharedWith: "me", done: false },
  { id: 4, name: "A4 display book (40 pg)", category: "school", priority: "soon",
    shop: "", notes: "For Maths portfolio",
    budget: 45, actualCost: 38, sharedWith: "me", done: true },
  { id: 5, name: "Soccer shin guards", category: "sports", priority: "urgent",
    shop: "Sport Zone", notes: "Small size, before Thursday practice",
    budget: 200, actualCost: null, sharedWith: "dad", done: false },
  { id: 6, name: "Vitamin D drops", category: "health", priority: "later",
    shop: "Clicks Pharmacy", notes: "Dr Nkosi recommended",
    budget: 95, actualCost: null, sharedWith: "mom", done: false },
];

const INIT_SHOPS = [
  { id: 1, name: "Woolworths",          emoji: "🏬", address: "Gateway Mall, Umhlanga" },
  { id: 2, name: "Clicks Pharmacy",     emoji: "💊", address: "Pavilion Centre" },
  { id: 3, name: "Dis-Chem",            emoji: "💊", address: "Various branches" },
  { id: 4, name: "Sport Zone",          emoji: "🏃", address: "Musgrave Centre" },
  { id: 5, name: "Stationery Warehouse",emoji: "📝", address: "Online / Florida Rd" },
  { id: 6, name: "H&M Kids",            emoji: "👗", address: "Gateway Mall" },
  { id: 7, name: "Other",               emoji: "🏪", address: "" },
];

// Events use ISO date strings "YYYY-MM-DD" + time "HH:MM"
// Dates are relative to today so they always show up correctly
function mkDate(offsetDays) {
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
const INIT_EVENTS = [
  { id: 1, date: mkDate(0),  time: "07:45", title: "School Drop-off",    subtitle: "Sunshine Primary — Main Gate", location: "Main Gate, Sunshine Primary", category: "pickup",   icon: "🚗", done: false, recurring: false },
  { id: 2, date: mkDate(0),  time: "09:00", title: "Ritalin Dose",       subtitle: "10mg · School nurse",          location: "Sick Bay",                     category: "medical",  icon: "💊", done: false, recurring: false },
  { id: 3, date: mkDate(0),  time: "13:30", title: "Maths Assessment",   subtitle: "Grade 2 · Number patterns",    location: "Classroom 2B",                 category: "school",   icon: "✏️", done: false, recurring: false },
  { id: 4, date: mkDate(0),  time: "14:30", title: "Soccer Practice",    subtitle: "Riverside Park · Coach Sipho", location: "Riverside Park, Field B",       category: "activity", icon: "⚽", done: false, recurring: false },
  { id: 5, date: mkDate(0),  time: "16:15", title: "After-care Pick-up", subtitle: "Collect before 16:30",         location: "After-care Centre",             category: "pickup",   icon: "🚗", done: false, recurring: false },
  { id: 6, date: mkDate(2),  time: "09:00", title: "Custody Handover",   subtitle: "David collects Amara",         location: "Home",                          category: "custody",  icon: "🤝", done: false, recurring: false },
  { id: 7, date: mkDate(4),  time: "08:30", title: "Soccer Tournament",  subtitle: "U8 League — Both parents",     location: "Riverside Park",                category: "activity", icon: "⚽", done: false, recurring: false },
  { id: 8, date: mkDate(7),  time: "10:00", title: "Dentist Appointment",subtitle: "Dr Pillay — check-up",         location: "Pavilion Dental Centre",        category: "medical",  icon: "🦷", done: false, recurring: false },
  { id: 9, date: mkDate(9),  time: "17:00", title: "School Fees Due",    subtitle: "May instalment — R2,450",      location: "Online EFT",                    category: "payment",  icon: "💳", done: false, recurring: false },
];

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [show,  setShow]  = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* floating logo cluster */}
      <div style={{ position: "relative", width: 140, height: 110, marginBottom: 10 }}>

        {/* back-left bubble: dino */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 48, height: 48, borderRadius: 14,
          background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
          boxShadow: "0 4px 12px rgba(16,185,129,.2)" }}>🦕</div>

        {/* back-right bubble: sparkle */}
        <div style={{ position: "absolute", top: 4, right: 0, width: 40, height: 40, borderRadius: 12,
          background: "linear-gradient(135deg,#FEF9C3,#FDE68A)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          boxShadow: "0 4px 10px rgba(251,191,36,.25)" }}>✨</div>

        {/* centre main logo — custom illustrated SVG */}
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
          width: 72, height: 72, borderRadius: 22,
          background: "linear-gradient(135deg, #6EE7F7 0%, #3B82F6 50%, #8B5CF6 100%)",
          boxShadow: "0 8px 28px rgba(99,102,241,.45)", zIndex: 2,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* big parent heart-body */}
            <ellipse cx="23" cy="32" rx="14" ry="10" fill="white" fillOpacity="0.25"/>
            {/* mama figure */}
            <circle cx="17" cy="21" r="5" fill="white" fillOpacity="0.9"/>
            <path d="M10 35 Q17 27 24 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
            {/* papa figure */}
            <circle cx="29" cy="21" r="5" fill="white" fillOpacity="0.9"/>
            <path d="M22 35 Q29 27 36 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9"/>
            {/* little kid in middle, slightly raised */}
            <circle cx="23" cy="17" r="4" fill="#FDE68A"/>
            {/* kid smile */}
            <path d="M21 18.5 Q23 20 25 18.5" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            {/* kid eyes */}
            <circle cx="21.5" cy="16.5" r="0.8" fill="#92400E"/>
            <circle cx="24.5" cy="16.5" r="0.8" fill="#92400E"/>
            {/* heart above kid */}
            <path d="M23 12 C23 12 20 9 20 7.5 C20 6.1 21.1 5 22.5 5 C23 5 23.5 5.2 23 6 C22.5 5.2 23 5 23.5 5 C24.9 5 26 6.1 26 7.5 C26 9 23 12 23 12Z" fill="#F87171"/>
          </svg>
        </div>

        {/* bottom-left bubble: music note / fun */}
        <div style={{ position: "absolute", bottom: 0, left: 6, width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#FDE8FF,#E9D5FF)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          boxShadow: "0 4px 10px rgba(139,92,246,.2)" }}>🎈</div>

        {/* bottom-right bubble: heart */}
        <div style={{ position: "absolute", bottom: 2, right: 2, width: 32, height: 32, borderRadius: 10,
          background: "linear-gradient(135deg,#FFE4E6,#FECDD3)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          boxShadow: "0 3px 8px rgba(244,63,94,.2)" }}>💛</div>
      </div>

      <h1 style={{ fontSize: 34, fontWeight: 900, color: C.g900, margin: "0 0 4px", letterSpacing: -1 }}>KidSync</h1>
      <p style={{ color: C.g500, marginBottom: 36, fontSize: 15 }}>Welcome back — your child awaits</p>

      <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.white, borderRadius: 14, border: `1.5px solid ${C.g200}`,
          display: "flex", alignItems: "center", padding: "14px 16px", gap: 10 }}>
          <span style={{ fontSize: 18 }}>✉️</span>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 15, color: C.g900, background: "transparent", fontFamily: "inherit" }} />
        </div>
        <div style={{ background: C.white, borderRadius: 14, border: `1.5px solid ${C.g200}`,
          display: "flex", alignItems: "center", padding: "14px 16px", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <input value={pass} onChange={e => setPass(e.target.value)} type={show ? "text" : "password"} placeholder="Password"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 15, color: C.g900, background: "transparent", fontFamily: "inherit" }} />
          <span onClick={() => setShow(!show)} style={{ cursor: "pointer", fontSize: 16, color: C.g400 }}>👁️</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ color: C.blue, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Forgot Password?</span>
        </div>
        <Btn onClick={onLogin} style={{ width: "100%", padding: "14px", boxShadow: "0 4px 16px rgba(59,130,246,.4)" }}>Sign In</Btn>
        <p style={{ textAlign: "center", color: C.g500, fontSize: 14, margin: 0 }}>
          Don't have an account? <span style={{ color: C.blue, fontWeight: 700, cursor: "pointer" }}>Sign Up</span>
        </p>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ onNavigate, profile = {}, events = [] }) {
  const me    = profile.me    || {};
  const child = profile.child || {};
  const hour  = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = me.name ? me.name.split(" ")[0] : "there";
  const todayStr  = todayISO();
  const nowDate   = new Date();
  const DAY_NAMES_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTH_NAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateLabel = `${DAY_NAMES_FULL[nowDate.getDay()]}, ${nowDate.getDate()} ${MONTH_NAMES_SHORT[nowDate.getMonth()]} ${nowDate.getFullYear()}`;

  const todayEvts = events.filter(e => e.date === todayStr).sort((a,b) => a.time.localeCompare(b.time));
  const upcomingEvts = events.filter(e => e.date > todayStr).sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  // ── Notifications derived from events ──
  const notifications = [
    ...todayEvts.filter(e => !e.done).map(e => ({
      id: `today-${e.id}`, type: "event", icon: e.icon || "📅",
      title: e.title, body: `Today at ${e.time}${e.location ? " · " + e.location : ""}`,
      color: (CAT_EV[e.category]||{}).color || C.blue,
      bg:    (CAT_EV[e.category]||{}).bg    || C.blueLight,
      time: "Today",
    })),
    ...upcomingEvts.slice(0,3).map(e => ({
      id: `up-${e.id}`, type: "upcoming", icon: e.icon || "📅",
      title: e.title, body: `${fmtDate(e.date)} at ${e.time}`,
      color: (CAT_EV[e.category]||{}).color || C.blue,
      bg:    (CAT_EV[e.category]||{}).bg    || C.blueLight,
      time:  fmtDate(e.date),
    })),
    { id:"req-1", type:"request", icon:"🔄", title:"Swap request from David",
      body:"He wants to swap Saturday 24 May", color:C.purple, bg:C.purpleLight, time:"2h ago" },
    { id:"shop-1", type:"shopping", icon:"🛍️", title:"Shopping reminder",
      body:`${child.name||"Your child"} needs school shoes — urgent`, color:C.amber, bg:C.amberLight, time:"Yesterday" },
  ];
  const unreadCount = notifications.length;

  const [showNotifs, setShowNotifs] = useState(false);
  const [readIds,    setReadIds]    = useState([]);
  const unreadNotifs = notifications.filter(n => !readIds.includes(n.id));

  const openNotifs = () => { setShowNotifs(true); setReadIds(notifications.map(n=>n.id)); };

  // ── AI Summary ──
  const [aiSummary,  setAiSummary]  = useState(null);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiError,    setAiError]    = useState(false);
  const [aiTags,     setAiTags]     = useState([]);
  const [lastFetch,  setLastFetch]  = useState(null);

  const buildAiPrompt = () => {
    const childName  = child.name  || "the child";
    const coName     = profile.coParent?.name || "the co-parent";
    const today      = dateLabel;
    const evtLines   = events.slice(0,20).map(e =>
      `- ${fmtDate(e.date)} ${e.time}: ${e.title}${e.subtitle ? " ("+e.subtitle+")" : ""}${e.location ? " @ "+e.location : ""} [${e.category}]${e.recurType && e.recurType!=="none" ? " recurring:"+e.recurType : ""}`
    ).join("\n");
    return `You are a helpful co-parenting assistant inside the KidSync app.

Today is ${today}. The child's name is ${childName}. The admin parent's name is ${me.name||"Mom"}. The co-parent is ${coName}.

Here are the upcoming calendar events:
${evtLines || "No events added yet."}

Write a SHORT, warm, practical 2-3 sentence summary of what's happening this week for ${childName}. 
Mention the most important upcoming events, any that need action (transport, payments, medical), and note custody handovers if any.
Then list up to 3 short action tags (4 words max each, plain text, no emoji in the tag text itself).
Respond ONLY in this JSON format with no markdown:
{"summary":"...","tags":[{"label":"...","type":"warning|info|action"}]}`;
  };

  const fetchAiSummary = async () => {
    if (aiLoading) return;
    setAiLoading(true); setAiError(false);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{ role: "user", content: buildAiPrompt() }],
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      const raw  = (data.content || []).map(b => b.text || "").join("").trim();

      // Try JSON parse first, fall back to using raw text as summary
      try {
        const clean  = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setAiSummary(parsed.summary || raw);
        setAiTags(Array.isArray(parsed.tags) ? parsed.tags : []);
      } catch {
        // Model returned plain text — use it directly
        setAiSummary(raw);
        setAiTags([]);
      }

      setLastFetch(new Date());
    } catch (err) {
      console.error("AI summary error:", err);
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  // Auto-fetch on mount and whenever events change (debounced 800ms)
  const eventsKey = events.map(e => e.id + e.title + e.date).join("|");
  const fetchTimer = useRef(null);
  useEffect(() => {
    clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => fetchAiSummary(), 800);
    return () => clearTimeout(fetchTimer.current);
  }, [eventsKey]); // eslint-disable-line

  const TAG_COLORS = {
    warning: { color: C.amber,  bg: C.amberLight,  border: "#FDE68A" },
    action:  { color: C.red,    bg: C.redLight,     border: "#FECACA" },
    info:    { color: C.blue,   bg: C.blueLight,    border: "#BFDBFE" },
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg, paddingBottom: 90 }}>

      {/* ── NOTIFICATION PANEL ── */}
      {showNotifs && (
        <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", flexDirection:"column" }}
          onClick={e => e.target===e.currentTarget && setShowNotifs(false)}>
          {/* backdrop */}
          <div style={{ flex:1, background:"rgba(0,0,0,.35)" }} onClick={()=>setShowNotifs(false)} />
          {/* panel slides up */}
          <div style={{ background:C.white, borderRadius:"22px 22px 0 0", maxHeight:"75vh",
            overflowY:"auto", paddingBottom:32, maxWidth:480, width:"100%", margin:"0 auto" }}>
            <div style={{ padding:"20px 20px 14px", display:"flex", alignItems:"center", justifyContent:"space-between",
              borderBottom:`1px solid ${C.g200}`, position:"sticky", top:0, background:C.white, zIndex:1 }}>
              <div>
                <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:C.g900 }}>🔔 Notifications</h3>
                <p style={{ margin:"2px 0 0", fontSize:12, color:C.g500 }}>{notifications.length} total</p>
              </div>
              <button onClick={()=>setShowNotifs(false)} style={{ background:C.g100, border:"none",
                borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16 }}>✕</button>
            </div>

            {notifications.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:C.g400 }}>
                <div style={{ fontSize:40, marginBottom:8 }}>🎉</div>
                <p style={{ margin:0, fontWeight:700 }}>All caught up!</p>
              </div>
            ) : (
              <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                {notifications.map(n => (
                  <div key={n.id} onClick={() => { setShowNotifs(false); onNavigate(n.type==="request"?"requests":n.type==="shopping"?"shopping":"calendar"); }}
                    style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"12px 14px",
                      background:n.bg, borderRadius:14, cursor:"pointer",
                      border:`1px solid ${n.color}22` }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:C.white,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
                      boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>{n.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:"0 0 2px", fontWeight:800, fontSize:14, color:C.g900 }}>{n.title}</p>
                      <p style={{ margin:0, fontSize:13, color:C.g600||C.g500, lineHeight:1.4 }}>{n.body}</p>
                    </div>
                    <span style={{ fontSize:11, color:C.g400, flexShrink:0, paddingTop:2 }}>{n.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ padding:"22px 20px 10px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ margin:0, fontSize:24, fontWeight:900, color:C.g900, letterSpacing:-0.5 }}>{greeting}, {firstName} 👋</h2>
          <p style={{ margin:"4px 0 0", color:C.g500, fontSize:14 }}>{dateLabel}</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {/* BELL */}
          <div onClick={openNotifs} style={{ position:"relative", cursor:"pointer",
            width:40, height:40, borderRadius:"50%", background:C.white,
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 1px 6px rgba(0,0,0,.1)" }}>
            <span style={{ fontSize:20 }}>🔔</span>
            {unreadNotifs.length > 0 && (
              <div style={{ position:"absolute", top:2, right:2, background:C.red, color:"#fff",
                borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:900,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:"2px solid "+C.bg }}>
                {unreadNotifs.length > 9 ? "9+" : unreadNotifs.length}
              </div>
            )}
          </div>
          {/* AVATAR */}
          <div style={{ width:40, height:40, borderRadius:"50%", background:C.blue,
            display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>
            {me.emoji || "👤"}
          </div>
        </div>
      </div>

      <div style={{ padding:"0 16px", display:"flex", flexDirection:"column", gap:14 }}>

        {/* child card */}
        <Card style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px" }}>
          <div style={{ width:50, height:50, borderRadius:"50%", background:"#D1FAE5",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{child.emoji||"🧒"}</div>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontWeight:800, fontSize:16, color:C.g900 }}>{child.name||"Your child"}</p>
            <p style={{ margin:"2px 0 0", fontSize:13, color:C.g500 }}>{[child.grade,child.school].filter(Boolean).join(" · ")||"Add details in Profile"}</p>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:C.red, background:"#FEE2E2", padding:"4px 10px", borderRadius:20 }}>● {me.role==="dad"?"Dad's":"Mom's"} Day</span>
        </Card>

        {/* ── LIVE AI SUMMARY ── */}
        <div style={{ background:"#EFF6FF", borderRadius:18, padding:16, border:"1px solid #BFDBFE" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>🤖</span>
              <span style={{ fontWeight:800, color:C.blue, fontSize:15 }}>KidSync AI</span>
              <span style={{ background:C.blue, color:"#fff", fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20 }}>Live</span>
            </div>
            <button onClick={fetchAiSummary} disabled={aiLoading}
              style={{ background:"none", border:`1px solid ${C.blue}44`, borderRadius:10,
                padding:"5px 10px", fontSize:12, fontWeight:700, color:C.blue,
                cursor:aiLoading?"not-allowed":"pointer", fontFamily:"inherit",
                opacity:aiLoading?0.6:1 }}>
              {aiLoading ? "..." : "↻ Refresh"}
            </button>
          </div>

          {aiLoading && (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[100,80,90].map((w,i) => (
                <div key={i} style={{ height:14, borderRadius:8, background:"#BFDBFE",
                  width:w+"%", animation:"pulse 1.5s infinite" }} />
              ))}
              <p style={{ margin:"4px 0 0", fontSize:12, color:C.blue, fontWeight:600 }}>
                Analysing {child.name||"your child"}'s schedule…
              </p>
            </div>
          )}

          {!aiLoading && aiError && (
            <div style={{ background:"#FEF2F2", borderRadius:12, padding:12, border:"1px solid #FECACA" }}>
              <p style={{ margin:"0 0 8px", fontSize:13, color:C.red, fontWeight:700 }}>
                ⚠️ Couldn't connect to AI
              </p>
              <p style={{ margin:"0 0 10px", fontSize:13, color:C.g700, lineHeight:1.5 }}>
                This feature needs an active internet connection and may not be available in all environments.
              </p>
              <button onClick={fetchAiSummary} style={{ background:C.blue, color:"#fff", border:"none",
                borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit" }}>Try again ↻</button>
            </div>
          )}

          {!aiLoading && !aiError && aiSummary && (
            <>
              <p style={{ margin:"0 0 10px", fontSize:14, color:C.g700, lineHeight:1.65 }}>{aiSummary}</p>
              {aiTags.length > 0 && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {aiTags.map((t,i) => {
                    const tm = TAG_COLORS[t.type] || TAG_COLORS.info;
                    return <Pill key={i} label={t.label} color={tm.color} bg={tm.bg} border={tm.border} />;
                  })}
                </div>
              )}
              {lastFetch && (
                <p style={{ margin:"8px 0 0", fontSize:11, color:C.g400 }}>
                  Updated {lastFetch.toLocaleTimeString("en-ZA",{hour:"2-digit",minute:"2-digit"})}
                </p>
              )}
            </>
          )}

          {!aiLoading && !aiError && !aiSummary && (
            <div style={{ textAlign:"center", padding:"8px 0" }}>
              <button onClick={fetchAiSummary} style={{ background:C.blue, color:"#fff", border:"none",
                borderRadius:12, padding:"10px 20px", fontSize:14, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit" }}>✨ Generate Summary</button>
            </div>
          )}
        </div>

        {/* stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Card>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:13, color:C.g500 }}>Today's Events</span>
              <span style={{ fontSize:18 }}>📅</span>
            </div>
            <p style={{ margin:0, fontSize:32, fontWeight:900, color:C.g900 }}>{todayEvts.length}</p>
            <p style={{ margin:"4px 0 0", fontSize:12, color:todayEvts.length>0?C.green:C.g400, fontWeight:700 }}>
              {todayEvts.length>0 ? `${todayEvts.filter(e=>!e.done).length} remaining` : "Nothing today"}
            </p>
          </Card>
          <Card>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:13, color:C.g500 }}>Upcoming</span>
              <span style={{ fontSize:18 }}>📊</span>
            </div>
            <p style={{ margin:0, fontSize:32, fontWeight:900, color:C.g900 }}>{upcomingEvts.length}</p>
            <p style={{ margin:"4px 0 0", fontSize:12, color:C.blue, fontWeight:700 }}>next events</p>
          </Card>
        </div>

        {/* today's schedule */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:C.g900 }}>Today's Schedule</h3>
            <span style={{ color:C.blue, fontWeight:700, fontSize:14, cursor:"pointer" }}
              onClick={()=>onNavigate("calendar")}>View All</span>
          </div>
          {todayEvts.length===0 && (
            <div style={{ textAlign:"center", padding:"24px 0", color:C.g400 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
              <p style={{ margin:0, fontWeight:700, fontSize:14 }}>No events today</p>
              <p style={{ margin:"4px 0 0", fontSize:13 }}>Add one in the Calendar</p>
            </div>
          )}
          {todayEvts.slice(0,4).map(ev => {
            const m = CAT_EV[ev.category]||{};
            return (
              <Card key={ev.id} onClick={()=>onNavigate("calendar")}
                style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px",
                  marginBottom:10, opacity:ev.done?0.6:1, cursor:"pointer" }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.g400, minWidth:36 }}>{ev.time}</span>
                <div style={{ width:36, height:36, borderRadius:10, background:m.bg||C.g100,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{ev.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontWeight:700, fontSize:14, color:C.g900,
                    textDecoration:ev.done?"line-through":"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</p>
                  <p style={{ margin:"2px 0 0", fontSize:12, color:C.g500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.subtitle}</p>
                </div>
                {m.label&&<Pill {...m}/>}
              </Card>
            );
          })}
          {todayEvts.length>4 && (
            <p onClick={()=>onNavigate("calendar")} style={{ textAlign:"center", fontSize:13,
              color:C.blue, fontWeight:700, cursor:"pointer", margin:"4px 0 0" }}>
              +{todayEvts.length-4} more today →
            </p>
          )}
        </div>

        {/* quick actions */}
        <div>
          <h3 style={{ margin:"0 0 12px", fontSize:18, fontWeight:800, color:C.g900 }}>Quick Actions</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { icon:"📅", label:"Add Event",  sub:"Calendar",       nav:"calendar" },
              { icon:"💬", label:"Message",    sub:"Co-parent",       nav:"chat"     },
              { icon:"🔄", label:"Swap Day",   sub:"Request",         nav:"requests" },
              { icon:"🛍️", label:"Shopping",  sub:"Amara's needs",   nav:"shopping" },
            ].map(a=>(
              <Card key={a.label} onClick={()=>onNavigate(a.nav)} style={{ padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:26 }}>{a.icon}</span>
                  <div>
                    <p style={{ margin:0, fontWeight:800, fontSize:14, color:C.g900 }}>{a.label}</p>
                    <p style={{ margin:"2px 0 0", fontSize:12, color:C.g500 }}>{a.sub}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Recurring event engine ────────────────────────────────────────────────────
function eventOccursOnDate(ev, isoDate) {
  if (!ev.date) return false;
  if (ev.recurEnd && isoDate > ev.recurEnd) return false;
  const type = ev.recurType || "none";
  if (type === "none") return ev.date === isoDate;
  if (isoDate < ev.date) return false;

  const start  = parseISO(ev.date);
  const target = parseISO(isoDate);
  const startD  = new Date(start.y,  start.m,  start.d);
  const targetD = new Date(target.y, target.m, target.d);
  const diffDays = Math.round((targetD - startD) / 86400000);
  const targetDOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][targetD.getDay()];

  switch (type) {
    case "daily":     return true;
    case "weekdays":  return ![0,6].includes(targetD.getDay()); // Mon-Fri
    case "weekends":  return [0,6].includes(targetD.getDay()); // Sat-Sun
    case "weekly":    return diffDays % 7 === 0;
    case "biweekly":  return diffDays % 14 === 0;
    case "twiceweek": return (ev.recurDays||[]).includes(targetDOW);
    case "monthly":   return target.d === start.d;
    default:          return ev.date === isoDate;
  }
}

// CALENDAR — fully functional real-date calendar
// ══════════════════════════════════════════════════════════════════════════════


function CalendarScreen({ isAdmin = true, profile = {}, events = [], setEvents }) {
  const child   = profile.child || {};
  const today   = todayISO();
  const tp      = parseISO(today);
  const [viewMode,   setViewMode]   = useState("month");
  const [selDate,    setSelDate]    = useState(today);
  const [calYear,    setCalYear]    = useState(tp.y);
  const [calMonth,   setCalMonth]   = useState(tp.m);
  const [filter,     setFilter]     = useState("All");
  const [modal,      setModal]      = useState(null);
  const [selId,      setSelId]      = useState(null);

  const [fTitle,     setFTitle]     = useState("");
  const [fSubtitle,  setFSubtitle]  = useState("");
  const [fLocation,  setFLocation]  = useState("");
  const [fDate,      setFDate]      = useState(today);
  const [fTime,      setFTime]      = useState("09:00");
  const [fCat,       setFCat]       = useState("school");
  // recurring
  const [fRecurType, setFRecurType] = useState("none");
  const [fRecurDays, setFRecurDays] = useState([]);
  const [fRecurEnd,  setFRecurEnd]  = useState("");
  // holiday-specific
  const [fHolEnd,       setFHolEnd]       = useState("");  // end date for holiday period
  const [fCustodyMode,  setFCustodyMode]  = useState("none"); // none | split | momonly | dadonly | alternate
  const [fCustodyNotes, setFCustodyNotes] = useState("");

  const selEv = events.find(e => e.id === selId);

  const dayEvents = events
    .filter(e => eventOccursOnDate(e, selDate) && (filter === "All" || e.category === filter.toLowerCase()))
    .sort((a,b) => a.time.localeCompare(b.time));

  // For month view: a day has a dot if any event occurs on it
  const dateHasEvent = isoDate => events.some(e => eventOccursOnDate(e, isoDate));

  const monthEvents = events.filter(e => {
    // show in month view if: starts this month OR is recurring and not ended before month start
    const {y,m} = parseISO(e.date);
    if (y === calYear && m === calMonth) return true;
    if ((e.recurType||"none") !== "none") {
      if (e.recurEnd) {
        const monthStart = `${calYear}-${String(calMonth+1).padStart(2,"0")}-01`;
        return e.recurEnd >= monthStart && e.date <= `${calYear}-${String(calMonth+1).padStart(2,"0")}-31`;
      }
      return e.date <= `${calYear}-${String(calMonth+1).padStart(2,"0")}-31`;
    }
    return false;
  });

  const prevMonth = () => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); };
  const nextMonth = () => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); };

  const selectDay = iso => { setSelDate(iso); setViewMode("day"); };

  const openAdd = () => {
    setFTitle(""); setFSubtitle(""); setFLocation("");
    setFDate(selDate); setFTime("09:00"); setFCat("school");
    setFRecurType("none"); setFRecurDays([]); setFRecurEnd("");
    setFHolEnd(""); setFCustodyMode("none"); setFCustodyNotes("");
    setModal("add");
  };
  const openEdit = ev => {
    setSelId(ev.id);
    setFTitle(ev.title); setFSubtitle(ev.subtitle||"");
    setFLocation(ev.location||""); setFDate(ev.date);
    setFTime(ev.time); setFCat(ev.category);
    setFRecurType(ev.recurType||"none");
    setFRecurDays(ev.recurDays||[]);
    setFRecurEnd(ev.recurEnd||"");
    setFHolEnd(ev.holEnd||"");
    setFCustodyMode(ev.custodyMode||"none");
    setFCustodyNotes(ev.custodyNotes||"");
    setModal("edit");
  };
  const saveAdd = () => {
    if(!fTitle.trim()) return;
    setEvents(p => [...p, {
      id: Date.now(), date: fDate, time: fTime,
      title: fTitle.trim(), subtitle: fSubtitle, location: fLocation,
      category: fCat, icon: CAT_ICONS[fCat]||"📌",
      done: false,
      recurType: fRecurType, recurDays: fRecurDays, recurEnd: fRecurEnd,
      recurring: fRecurType !== "none",
      holEnd: fCat==="holiday" ? fHolEnd : "",
      custodyMode: fCat==="holiday" ? fCustodyMode : "none",
      custodyNotes: fCat==="holiday" ? fCustodyNotes : "",
      addedBy: isAdmin?"admin":"coparent",
    }]);
    setSelDate(fDate); setViewMode("day"); setModal(null);
  };
  const saveEdit = () => {
    setEvents(p => p.map(e => e.id===selId
      ? {...e, title:fTitle, subtitle:fSubtitle, location:fLocation,
          date:fDate, time:fTime, category:fCat,
          icon:CAT_ICONS[fCat]||e.icon,
          recurType:fRecurType, recurDays:fRecurDays, recurEnd:fRecurEnd,
          recurring: fRecurType !== "none",
          holEnd: fCat==="holiday" ? fHolEnd : "",
          custodyMode: fCat==="holiday" ? fCustodyMode : "none",
          custodyNotes: fCat==="holiday" ? fCustodyNotes : ""}
      : e));
    setSelDate(fDate); setModal(null);
  };
  const confirmDelete = () => { setEvents(p=>p.filter(e=>e.id!==selId)); setModal(null); };
  const toggleDone = id => setEvents(p=>p.map(e=>e.id===id?{...e,done:!e.done}:e));

  const totalDays = daysInMonth(calYear,calMonth);
  const sw        = startWd(calYear,calMonth);
  const gridCells = [];
  for(let i=0;i<sw;i++) gridCells.push(null);
  for(let d=1;d<=totalDays;d++) gridCells.push(d);
  while(gridCells.length%7!==0) gridCells.push(null);
  const eventDates = new Set(monthEvents.map(e=>e.date));

  const RECUR_OPTIONS = [
    { id:"none",      label:"Does not repeat",  icon:"🚫" },
    { id:"daily",     label:"Daily",             icon:"☀️" },
    { id:"weekdays",  label:"Weekdays (Mon–Fri)",icon:"🏫" },
    { id:"weekends",  label:"Weekends only",     icon:"🌴" },
    { id:"weekly",    label:"Weekly",            icon:"📅" },
    { id:"biweekly",  label:"Every 2 weeks",     icon:"🗓️" },
    { id:"twiceweek", label:"Twice a week",      icon:"🔄" },
    { id:"monthly",   label:"Monthly",           icon:"📆" },
  ];
  const WEEK_DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const CUSTODY_MODES = [
    { id:"none",      label:"Not specified",           icon:"—",  color:C.g500,  bg:C.g100,       border:C.g200   },
    { id:"momonly",   label:"All days with Mom",        icon:"👩", color:C.pink,  bg:C.pinkLight,  border:"#FBCFE8"},
    { id:"dadonly",   label:"All days with Dad",        icon:"👨", color:C.blue,  bg:C.blueLight,  border:"#BFDBFE"},
    { id:"split",     label:"Split — first half Mom, second half Dad", icon:"✂️", color:C.teal, bg:C.tealLight, border:"#99F6E4"},
    { id:"alternate", label:"Alternate days",           icon:"🔁", color:C.purple,bg:C.purpleLight,border:"#DDD6FE"},
    { id:"custom",    label:"Custom (add details below)",icon:"📝",color:C.amber, bg:C.amberLight, border:"#FDE68A"},
  ];

  const custodyLabel = mode => CUSTODY_MODES.find(m=>m.id===mode)?.label || "";

  const recurLabel = ev => {
    if(!ev.recurType || ev.recurType==="none") return null;
    const opt = RECUR_OPTIONS.find(o=>o.id===ev.recurType);
    if(ev.recurType==="twiceweek" && ev.recurDays?.length)
      return `🔁 ${ev.recurDays.join(" & ")}`;
    return opt ? `🔁 ${opt.label}` : null;
  };

  const SwToggle = ({on,onT}) => (
    <div onClick={onT} style={{width:44,height:24,borderRadius:12,
      background:on?C.blue:C.g300,cursor:"pointer",position:"relative",transition:"background .2s"}}>
      <div style={{width:18,height:18,borderRadius:"50%",background:C.white,
        position:"absolute",top:3,left:on?23:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
    </div>
  );

  return (
    <div style={{flex:1,overflowY:"auto",background:C.bg,paddingBottom:90}}>

      {/* header */}
      <div style={{background:C.white,padding:"18px 20px 14px",borderBottom:`1px solid ${C.g200}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <h2 style={{margin:0,fontSize:20,fontWeight:900,color:C.g900}}>📅 Calendar</h2>
            <p style={{margin:"3px 0 0",fontSize:13,color:C.g500}}>
              {child.name?`${child.name}'s schedule`:"Family schedule"}
            </p>
          </div>
          <div style={{display:"flex",background:C.g100,borderRadius:10,padding:3,gap:2}}>
            {[["month","Month"],["day","Day"]].map(([v,l])=>(
              <button key={v} onClick={()=>setViewMode(v)} style={{
                padding:"6px 14px",borderRadius:8,border:"none",fontFamily:"inherit",
                fontSize:13,fontWeight:700,cursor:"pointer",
                background:viewMode===v?C.white:"transparent",
                color:viewMode===v?C.g900:C.g500,
                boxShadow:viewMode===v?"0 1px 4px rgba(0,0,0,.1)":"none"}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={prevMonth} style={{background:C.g100,border:"none",borderRadius:10,
            width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
          <span style={{fontWeight:800,fontSize:17,color:C.g900}}>{MONTH_NAMES[calMonth]} {calYear}</span>
          <button onClick={nextMonth} style={{background:C.g100,border:"none",borderRadius:10,
            width:36,height:36,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
        </div>
      </div>

      {/* ═══ MONTH VIEW ═══ */}
      {viewMode==="month" && (
        <div style={{padding:"12px 12px 0"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6}}>
            {DAY_NAMES.map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:11,fontWeight:800,color:C.g400,padding:"4px 0"}}>{d}</div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {gridCells.map((day,i)=>{
              if(!day) return <div key={`e${i}`}/>;
              const iso=toISO(calYear,calMonth,day);
              const isTod=iso===today, isSel=iso===selDate;
              const evCount = events.filter(e => eventOccursOnDate(e, iso)).length;
              // Check if this date falls within any holiday period
              const holiday = events.find(e =>
                e.category==="holiday" && e.holEnd &&
                iso >= e.date && iso <= e.holEnd
              );
              const holCustody = holiday?.custodyMode;
              const holBg = holCustody==="momonly" ? "#FDF2F8"
                : holCustody==="dadonly" ? "#EFF6FF"
                : holCustody==="split"||holCustody==="alternate" ? "#F0FDFA"
                : holiday ? "#FFFBEB" : null;
              return (
                <div key={iso} onClick={()=>selectDay(iso)} style={{
                  aspectRatio:"1",borderRadius:12,cursor:"pointer",padding:4,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  background:isSel?C.blue:isTod?C.blueLight: holBg || C.white,
                  border:isTod&&!isSel?`2px solid ${C.blue}`:holiday&&!isSel?"2px solid #FDE68A":"2px solid transparent",
                  boxShadow:isSel?"0 3px 10px rgba(59,130,246,.35)":"0 1px 3px rgba(0,0,0,.06)"}}>
                  <span style={{fontSize:15,fontWeight:800,color:isSel?"#fff":isTod?C.blue:C.g900}}>{day}</span>
                  {holiday&&!isSel&&(
                    <span style={{fontSize:8,marginTop:1}}>
                      {holCustody==="momonly"?"👩":holCustody==="dadonly"?"👨":holCustody==="split"||holCustody==="alternate"?"👨‍👩‍👧":"🏖️"}
                    </span>
                  )}
                  {evCount>0&&(
                    <div style={{display:"flex",gap:2,marginTop:holiday?0:2}}>
                      {Array.from({length:Math.min(evCount,3)}).map((_,j)=>(
                        <div key={j} style={{width:5,height:5,borderRadius:"50%",background:isSel?"rgba(255,255,255,.7)":C.blue}}/>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* upcoming list */}
          <div style={{marginTop:16}}>
            <p style={{margin:"0 0 10px 4px",fontWeight:800,fontSize:15,color:C.g900}}>This month</p>
            {monthEvents.length===0?(
              <div style={{textAlign:"center",padding:"24px 0",color:C.g400}}>
                <div style={{fontSize:32,marginBottom:8}}>📭</div>
                <p style={{margin:0}}>No events this month</p>
              </div>
            ):monthEvents.sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).map(ev=>{
              const m=CAT_EV[ev.category]||{};
              return (
                <div key={ev.id} onClick={()=>selectDay(ev.date)}
                  style={{display:"flex",gap:12,alignItems:"center",background:C.white,
                    borderRadius:14,padding:"12px 14px",marginBottom:8,cursor:"pointer",
                    boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:m.bg||C.g100,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                    {ev.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:0,fontWeight:800,fontSize:14,color:C.g900,
                      textDecoration:ev.done?"line-through":"none"}}>{ev.title}</p>
                    <p style={{margin:"2px 0 0",fontSize:12,color:C.g500}}>{fmtDate(ev.date)} · {ev.time}</p>
                  </div>
                  {m.label&&<Pill {...m}/>}
                </div>
              );
            })}
          </div>
          {/* Holiday colour legend — only shown when holidays exist */}
          {events.some(e=>e.category==="holiday"&&e.holEnd)&&(
            <div style={{padding:"0 4px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
              {[
                {bg:"#FDF2F8",border:"#FBCFE8",icon:"👩",label:"Mom's days"},
                {bg:"#EFF6FF",border:"#BFDBFE",icon:"👨",label:"Dad's days"},
                {bg:"#F0FDFA",border:"#99F6E4",icon:"👨‍👩‍👧",label:"Split"},
                {bg:"#FFFBEB",border:"#FDE68A",icon:"🏖️",label:"Holiday"},
              ].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:5,
                  background:l.bg,borderRadius:10,padding:"4px 8px",border:`1px solid ${l.border}`}}>
                  <span style={{fontSize:12}}>{l.icon}</span>
                  <span style={{fontSize:11,fontWeight:700,color:C.g700}}>{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ DAY VIEW ═══ */}
      {viewMode==="day" && (
        <div>
          {/* Holiday + custody banner for selected date */}
          {(()=>{
            const hol = events.find(e =>
              e.category==="holiday" && e.holEnd &&
              selDate >= e.date && selDate <= e.holEnd
            );
            if(!hol) return null;
            const cm = CUSTODY_MODES.find(m=>m.id===(hol.custodyMode||"none")) || CUSTODY_MODES[0];
            return (
              <div style={{margin:"0 16px 10px",background:"#FFFBEB",borderRadius:14,
                padding:"12px 14px",border:"1px solid #FDE68A",display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:24,flexShrink:0}}>🏖️</span>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontWeight:800,fontSize:14,color:"#92400E"}}>{hol.title}</p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:"#D97706"}}>Holiday until {fmtDate(hol.holEnd)}</p>
                  {hol.custodyMode&&hol.custodyMode!=="none"&&(
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:6,
                      background:cm.bg,borderRadius:20,padding:"3px 10px",border:`1px solid ${cm.border}`}}>
                      <span style={{fontSize:14}}>{cm.icon}</span>
                      <span style={{fontSize:12,fontWeight:700,color:cm.color}}>{cm.label}</span>
                    </div>
                  )}
                  {hol.custodyNotes&&(
                    <p style={{margin:"6px 0 0",fontSize:12,color:"#92400E",lineHeight:1.5,whiteSpace:"pre-line"}}>{hol.custodyNotes}</p>
                  )}
                </div>
              </div>
            );
          })()}
          <div style={{background:C.white,borderBottom:`1px solid ${C.g200}`,padding:"10px 16px"}}>
            <p style={{margin:"0 0 10px",fontSize:15,fontWeight:800,color:C.g900}}>
              {fmtDate(selDate)}
              {selDate===today&&<span style={{marginLeft:8,fontSize:12,color:C.blue,fontWeight:700,background:C.blueLight,padding:"2px 8px",borderRadius:10}}>Today</span>}
            </p>
            {(()=>{
              const {y,m,d}=parseISO(selDate);
              const base=new Date(y,m,d);
              const strip=[];
              for(let i=-3;i<=3;i++){
                const dt=new Date(base); dt.setDate(base.getDate()+i);
                strip.push({iso:toISO(dt.getFullYear(),dt.getMonth(),dt.getDate()),day:dt.getDate(),wd:DAY_NAMES[dt.getDay()]});
              }
              return (
                <div style={{display:"flex",gap:6,overflowX:"auto"}}>
                  {strip.map(s=>{
                    const isSel=s.iso===selDate, isTod=s.iso===today;
                    const hasDot=events.some(e=>eventOccursOnDate(e, s.iso));
                    return (
                      <div key={s.iso} onClick={()=>setSelDate(s.iso)}
                        style={{flexShrink:0,width:42,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
                        <span style={{fontSize:10,fontWeight:700,color:isSel?C.blue:C.g400}}>{s.wd}</span>
                        <div style={{width:36,height:36,borderRadius:"50%",
                          background:isSel?C.blue:isTod?C.blueLight:"transparent",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          color:isSel?"#fff":isTod?C.blue:C.g700,fontWeight:800,fontSize:15,
                          border:isTod&&!isSel?`2px solid ${C.blue}`:"none"}}>{s.day}</div>
                        {hasDot&&<div style={{width:5,height:5,borderRadius:"50%",background:isSel?C.blue:C.g400}}/>}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* filter */}
          <div style={{display:"flex",gap:8,padding:"12px 16px 8px",overflowX:"auto"}}>
            {["All","School","Medical","Custody","Activity","Payment","Pickup"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                flexShrink:0,padding:"6px 13px",borderRadius:20,fontSize:12,fontWeight:700,
                cursor:"pointer",fontFamily:"inherit",
                border:"1.5px solid "+(filter===f?C.blue:C.g200),
                background:filter===f?C.blue:C.white,color:filter===f?"#fff":C.g700}}>{f}</button>
            ))}
          </div>

          <div style={{padding:"4px 16px",display:"flex",flexDirection:"column",gap:10}}>
            {dayEvents.length===0&&(
              <div style={{textAlign:"center",padding:"40px 0",color:C.g400}}>
                <div style={{fontSize:40,marginBottom:10}}>📭</div>
                <p style={{margin:"0 0 4px",fontWeight:700}}>No events for this day</p>
                <p style={{margin:0,fontSize:13}}>Tap + to add one</p>
              </div>
            )}
            {dayEvents.map(ev=>{
              const m=CAT_EV[ev.category]||{};
              return (
                <div key={ev.id} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:4,minWidth:46,flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.g500}}>{ev.time}</span>
                    <div onClick={()=>toggleDone(ev.id)}
                      style={{width:14,height:14,borderRadius:"50%",margin:"4px 0",cursor:"pointer",
                        background:ev.done?m.color:C.white,border:`2px solid ${m.color||C.g300}`}}/>
                    <div style={{width:2,height:40,background:C.g200,borderRadius:2}}/>
                  </div>
                  <Card style={{flex:1,padding:"12px 14px",opacity:ev.done?0.65:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:40,height:40,borderRadius:12,background:m.bg||C.g100,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{ev.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:3}}>
                          <p style={{margin:0,fontWeight:800,fontSize:14,color:C.g900,
                            textDecoration:ev.done?"line-through":"none"}}>{ev.title}</p>
                          {m.label&&<Pill {...m}/>}
                          {ev.addedBy==="coparent"&&<Pill label="Co-parent" color={C.purple} bg={C.purpleLight} border="#DDD6FE"/>}
                        </div>
                        {ev.subtitle&&<p style={{margin:0,fontSize:12,color:C.g500}}>{ev.subtitle}</p>}
                        {ev.location&&<p style={{margin:"3px 0 0",fontSize:12,color:C.g400}}>📍 {ev.location}</p>}
                        {recurLabel(ev)&&<p style={{margin:"3px 0 0",fontSize:11,color:C.blue,fontWeight:700}}>{recurLabel(ev)}</p>}
                        {ev.category==="holiday"&&ev.holEnd&&(
                          <p style={{margin:"3px 0 0",fontSize:11,color:"#D97706",fontWeight:700}}>
                            🏖️ Until {fmtDate(ev.holEnd)}
                          </p>
                        )}
                        {ev.category==="holiday"&&ev.custodyMode&&ev.custodyMode!=="none"&&(
                          <p style={{margin:"3px 0 0",fontSize:11,fontWeight:700,color:C.teal}}>
                            👨‍👩‍👧 {custodyLabel(ev.custodyMode)}
                          </p>
                        )}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
                        <button onClick={()=>openEdit(ev)} style={{background:C.blueLight,border:"none",
                          borderRadius:8,padding:"5px 9px",fontSize:12,cursor:"pointer",
                          fontFamily:"inherit",color:C.blue,fontWeight:700}}>Edit</button>
                        {isAdmin&&(
                          <button onClick={()=>{setSelId(ev.id);setModal("delete");}}
                            style={{background:C.redLight,border:"none",borderRadius:8,
                              padding:"5px 9px",fontSize:12,cursor:"pointer",
                              fontFamily:"inherit",color:C.red,fontWeight:700}}>Del</button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB */}
      <div style={{position:"fixed",bottom:88,right:20}}>
        <button onClick={openAdd} style={{background:C.blue,color:"#fff",border:"none",borderRadius:16,
          padding:"14px 20px",fontSize:15,fontWeight:800,cursor:"pointer",
          display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",
          boxShadow:"0 4px 18px rgba(59,130,246,.5)"}}>+ Add Event</button>
      </div>

      {/* ADD / EDIT modal */}
      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add Event":"Edit Event"} onClose={()=>setModal(null)}>
          <Field label="Event title *">
            <TextInput placeholder="e.g. Soccer Practice" value={fTitle} onChange={e=>setFTitle(e.target.value)}/>
          </Field>
          <Field label="Date *">
            <TextInput type="date" value={fDate} onChange={e=>setFDate(e.target.value)}/>
          </Field>
          <Field label="Time *">
            <TextInput type="time" value={fTime} onChange={e=>setFTime(e.target.value)}/>
          </Field>
          <Field label="Details">
            <Textarea placeholder={"e.g. Coach Sipho · Riverside Park\nBring shin guards and water bottle"} value={fSubtitle} onChange={e=>setFSubtitle(e.target.value)} rows={3}/>
          </Field>
          <Field label="Location">
            <TextInput placeholder="e.g. Sunshine Primary" value={fLocation} onChange={e=>setFLocation(e.target.value)}/>
          </Field>
          <Field label="Category">
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {Object.entries(CAT_EV).map(([k,v])=>(
                <button key={k} onClick={()=>setFCat(k)} style={{
                  padding:"7px 12px",borderRadius:20,fontSize:13,fontWeight:700,
                  cursor:"pointer",fontFamily:"inherit",
                  border:"1.5px solid "+(fCat===k?v.color:C.g200),
                  background:fCat===k?v.bg:C.white,color:fCat===k?v.color:C.g700,
                }}>{CAT_ICONS[k]||"📌"} {v.label}</button>
              ))}
            </div>
          </Field>

          {/* ── SCHOOL HOLIDAY PANEL ── */}
          {fCat==="holiday"&&(
            <div style={{background:"#FFFBEB",borderRadius:16,padding:16,border:"1px solid #FDE68A",display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:22}}>🏖️</span>
                <div>
                  <p style={{margin:0,fontWeight:800,fontSize:15,color:C.g900}}>School Holiday Period</p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:C.g500}}>Set the full holiday period and who has the child when</p>
                </div>
              </div>

              <Field label="Holiday start date">
                <TextInput type="date" value={fDate} onChange={e=>setFDate(e.target.value)}/>
              </Field>
              <Field label="Holiday end date *">
                <TextInput type="date" value={fHolEnd} onChange={e=>setFHolEnd(e.target.value)}/>
                {fHolEnd&&fDate&&fHolEnd>fDate&&(
                  <p style={{margin:"5px 0 0",fontSize:12,color:C.teal,fontWeight:700}}>
                    📅 {Math.round((new Date(fHolEnd)-new Date(fDate))/86400000)+1} days
                  </p>
                )}
              </Field>

              <Field label="Custody during holidays">
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {CUSTODY_MODES.map(cm=>(
                    <button key={cm.id} onClick={()=>setFCustodyMode(cm.id)} style={{
                      display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                      borderRadius:12,border:"1.5px solid "+(fCustodyMode===cm.id?cm.color:C.g200),
                      background:fCustodyMode===cm.id?cm.bg:C.white,
                      cursor:"pointer",fontFamily:"inherit",textAlign:"left",width:"100%",
                    }}>
                      <span style={{fontSize:18}}>{cm.icon}</span>
                      <span style={{fontSize:13,fontWeight:700,color:fCustodyMode===cm.id?cm.color:C.g700,flex:1,lineHeight:1.3}}>{cm.label}</span>
                      {fCustodyMode===cm.id&&<span style={{color:cm.color,fontSize:15}}>✓</span>}
                    </button>
                  ))}
                </div>
              </Field>

              {(fCustodyMode==="custom"||fCustodyMode==="split"||fCustodyMode==="alternate")&&(
                <Field label="Custody details / notes">
                  <Textarea
                    placeholder={"e.g. First week with Mom (Dec 1–7)\nSecond week with Dad (Dec 8–14)\nHandover at 10am at Grandma's"}
                    value={fCustodyNotes}
                    onChange={e=>setFCustodyNotes(e.target.value)}
                    rows={4}
                  />
                </Field>
              )}
            </div>
          )}
          <Field label="Repeat">
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {RECUR_OPTIONS.map(opt=>(
                <button key={opt.id} onClick={()=>setFRecurType(opt.id)} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                  borderRadius:12,border:"1.5px solid "+(fRecurType===opt.id?C.blue:C.g200),
                  background:fRecurType===opt.id?C.blueLight:C.white,
                  cursor:"pointer",fontFamily:"inherit",textAlign:"left",width:"100%",
                }}>
                  <span style={{fontSize:18}}>{opt.icon}</span>
                  <span style={{fontSize:14,fontWeight:700,color:fRecurType===opt.id?C.blue:C.g700}}>{opt.label}</span>
                  {fRecurType===opt.id&&<span style={{marginLeft:"auto",color:C.blue,fontSize:16}}>✓</span>}
                </button>
              ))}
            </div>
          </Field>

          {fRecurType==="twiceweek"&&(
            <Field label="Which days?">
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {WEEK_DAYS_SHORT.map(d=>{
                  const on=fRecurDays.includes(d);
                  return (
                    <button key={d} onClick={()=>setFRecurDays(p=>on?p.filter(x=>x!==d):[...p,d].slice(0,2))} style={{
                      width:46,height:40,borderRadius:12,fontSize:13,fontWeight:800,
                      cursor:"pointer",fontFamily:"inherit",border:"1.5px solid "+(on?C.blue:C.g200),
                      background:on?C.blue:C.white,color:on?"#fff":C.g700,
                    }}>{d}</button>
                  );
                })}
              </div>
              <p style={{margin:"6px 0 0",fontSize:12,color:C.g400}}>Pick exactly 2 days</p>
            </Field>
          )}

          {fRecurType!=="none"&&(
            <Field label="End date (optional)">
              <TextInput type="date" value={fRecurEnd} onChange={e=>setFRecurEnd(e.target.value)}
                placeholder="Leave blank to repeat forever"/>
              {fRecurEnd&&(
                <button onClick={()=>setFRecurEnd("")} style={{marginTop:6,background:"none",border:"none",
                  color:C.g400,fontSize:12,cursor:"pointer",fontFamily:"inherit",padding:0}}>
                  ✕ Clear end date
                </button>
              )}
            </Field>
          )}
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>setModal(null)} outline color={C.g400} style={{flex:1,color:C.g700}}>Cancel</Btn>
            <Btn onClick={modal==="add"?saveAdd:saveEdit} style={{flex:2}}>
              {modal==="add"?"Add Event":"Save Changes"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* DELETE confirm */}
      {modal==="delete"&&selEv&&(
        <Modal title="Delete Event?" onClose={()=>setModal(null)}>
          <div style={{background:C.redLight,borderRadius:14,padding:16,border:`1px solid #FECACA`}}>
            <p style={{margin:"0 0 4px",fontWeight:800,fontSize:15,color:C.g900}}>{selEv.title}</p>
            <p style={{margin:0,fontSize:13,color:C.g500}}>{fmtDate(selEv.date)} · {selEv.time}</p>
          </div>
          <p style={{margin:0,fontSize:14,color:C.g700,textAlign:"center"}}>
            This will permanently remove this event. Only you (admin) can delete events.
          </p>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>setModal(null)} outline color={C.g400} style={{flex:1,color:C.g700}}>Cancel</Btn>
            <Btn onClick={confirmDelete} color={C.red} style={{flex:1}}>Delete</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SHOPPING — with budget tracker + co-parent sharing
// ══════════════════════════════════════════════════════════════════════════════
function ShoppingScreen() {
  const [items, setItems]         = useState(INIT_ITEMS);
  const [shops, setShops]         = useState(INIT_SHOPS);
  const [activeCat, setActiveCat] = useState("all");
  const [showDone, setShowDone]   = useState(false);
  const [tab, setTab]             = useState("items");   // items | shops | budget
  const [modal, setModal]         = useState(null);      // null | item | shop | markBought | share

  // selected item for sub-modals
  const [selId, setSelId]         = useState(null);

  // new item form
  const [nName,   setNName]   = useState("");
  const [nCat,    setNCat]    = useState("clothes");
  const [nPri,    setNPri]    = useState("soon");
  const [nShop,   setNShop]   = useState("");
  const [nNotes,  setNNotes]  = useState("");
  const [nBudget, setNBudget] = useState("");
  const [nWho,    setNWho]    = useState("me");

  // new shop form
  const [sName,  setSName]  = useState("");
  const [sEmoji, setSEmoji] = useState("🏬");
  const [sAddr,  setSAddr]  = useState("");

  // mark bought form
  const [bCost, setBCost] = useState("");

  // share notification state
  const [shareNote, setShareNote] = useState("");
  const [shareSent, setShareSent] = useState(false);

  const selItem = items.find(i => i.id === selId);

  // ── derived numbers ──
  const pending      = items.filter(i => !i.done);
  const bought       = items.filter(i => i.done);
  const totalBudget  = items.reduce((s, i) => s + (i.budget || 0), 0);
  const totalSpent   = bought.reduce((s, i) => s + (i.actualCost ?? i.budget ?? 0), 0);
  const totalPending = pending.reduce((s, i) => s + (i.budget || 0), 0);
  const sharedItems  = items.filter(i => i.sharedWith !== "me");

  const visible = items.filter(i =>
    (activeCat === "all" || i.category === activeCat) &&
    (showDone ? i.done : !i.done)
  );

  // ── actions ──
  const toggleDone = id => setItems(p => p.map(i => i.id === id ? { ...i, done: !i.done } : i));
  const deleteItem = id => setItems(p => p.filter(i => i.id !== id));

  const openMarkBought = id => { setSelId(id); setBCost(""); setModal("markBought"); };
  const openShare      = id => { setSelId(id); setShareNote(""); setShareSent(false); setModal("share"); };

  const confirmBought = () => {
    const cost = parseFloat(bCost);
    setItems(p => p.map(i => i.id === selId
      ? { ...i, done: true, actualCost: isNaN(cost) ? i.budget : cost }
      : i));
    setModal(null);
  };

  const sendShare = () => {
    setShareSent(true);
    setTimeout(() => setModal(null), 1800);
  };

  const updateSharing = (id, who) =>
    setItems(p => p.map(i => i.id === id ? { ...i, sharedWith: who } : i));

  const addItem = () => {
    if (!nName.trim()) return;
    setItems(p => [...p, {
      id: Date.now(), name: nName.trim(), category: nCat, priority: nPri,
      shop: nShop, notes: nNotes,
      budget: parseFloat(nBudget) || null, actualCost: null,
      sharedWith: nWho, done: false,
    }]);
    setNName(""); setNNotes(""); setNShop(""); setNBudget("");
    setNCat("clothes"); setNPri("soon"); setNWho("me");
    setModal(null);
  };

  const addShop = () => {
    if (!sName.trim()) return;
    setShops(p => [...p, { id: Date.now(), name: sName.trim(), emoji: sEmoji, address: sAddr }]);
    setSName(""); setSAddr(""); setSEmoji("🏬");
    setModal(null);
  };

  const catMeta = c => CAT_COLORS[c] || { color: C.g500, bg: C.g100, border: C.g200 };
  const priMeta = p => PRI[p] || PRI.later;
  const whoMeta = w => WHO[w] || WHO.me;

  const fmt = n => `R${(n || 0).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;

  // budget bar pct
  const pct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const barColor = pct > 90 ? C.red : pct > 65 ? C.amber : C.green;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg, paddingBottom: 90 }}>
      {/* ── header ── */}
      <div style={{ padding: "22px 20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.g900, letterSpacing: -0.5 }}>🛍️ Shopping List</h2>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: C.g500 }}>Things Amara needs</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.blue,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>S</div>
        </div>
      </div>

      {/* ── summary strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 16px 16px" }}>
        {[
          { label: "To Buy",   val: pending.length,                   color: C.blue  },
          { label: "Urgent",   val: pending.filter(i => i.priority === "urgent").length, color: C.red },
          { label: "Bought",   val: bought.length,                    color: C.green },
        ].map(s => (
          <div key={s.label} style={{ background: C.white, borderRadius: 14, padding: "12px 10px",
            textAlign: "center", boxShadow: "0 1px 5px rgba(0,0,0,.06)" }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: s.color }}>{s.val}</p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: C.g500, fontWeight: 600 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── tabs ── */}
      <div style={{ display: "flex", margin: "0 16px 14px", background: C.g100, borderRadius: 14, padding: 4 }}>
        {[["items","🧾 Items"],["shops","🏬 Shops"],["budget","💰 Budget"]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "9px 0", borderRadius: 11, border: "none", fontFamily: "inherit",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            background: tab === t ? C.white : "transparent",
            color: tab === t ? C.g900 : C.g500,
            boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,.1)" : "none",
          }}>{l}</button>
        ))}
      </div>

      {/* ════════ ITEMS TAB ════════ */}
      {tab === "items" && (<>
        <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto" }}>
          {SHOP_CATS.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              flexShrink: 0, padding: "7px 13px", borderRadius: 20, fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              border: "1.5px solid " + (activeCat === c.id ? C.blue : C.g200),
              background: activeCat === c.id ? C.blue : C.white,
              color: activeCat === c.id ? "#fff" : C.g700,
            }}>{c.emoji} {c.label}</button>
          ))}
        </div>

        <div style={{ padding: "0 16px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setShowDone(!showDone)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", border: "1.5px solid " + C.g200,
            background: showDone ? C.g700 : C.white, color: showDone ? "#fff" : C.g700,
          }}>{showDone ? "✅ Showing bought" : "Show bought"}</button>
          <span style={{ fontSize: 13, color: C.g400 }}>{visible.length} item{visible.length !== 1 ? "s" : ""}</span>
        </div>

        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.g400 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <p style={{ margin: 0, fontWeight: 700 }}>{showDone ? "Nothing bought yet" : "All clear!"}</p>
            </div>
          )}

          {visible.map(item => {
            const cm  = catMeta(item.category);
            const pm  = priMeta(item.priority);
            const wm  = whoMeta(item.sharedWith);
            const shopObj = shops.find(s => s.name === item.shop);
            const overBudget = item.done && item.actualCost != null && item.actualCost > (item.budget || 0);

            return (
              <Card key={item.id} style={{ padding: "14px 14px", opacity: item.done ? 0.7 : 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {/* checkbox */}
                  <div onClick={() => item.done ? toggleDone(item.id) : openMarkBought(item.id)}
                    style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, marginTop: 2, cursor: "pointer",
                      background: item.done ? C.green : C.white, border: `2px solid ${item.done ? C.green : C.g300}`,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.done && <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* name + badges */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.g900,
                        textDecoration: item.done ? "line-through" : "none" }}>{item.name}</p>
                      <Pill label={SHOP_CATS.find(c => c.id === item.category)?.emoji + " " + item.category}
                        color={cm.color} bg={cm.bg} border={cm.border} />
                      <Pill {...pm} />
                    </div>

                    {item.notes && <p style={{ margin: "0 0 6px", fontSize: 13, color: C.g500 }}>{item.notes}</p>}

                    {/* budget row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      {item.budget && (
                        <span style={{ fontSize: 13, fontWeight: 700,
                          color: overBudget ? C.red : C.g700 }}>
                          💰 {item.done && item.actualCost != null
                            ? <>{fmt(item.actualCost)} <span style={{ fontWeight: 400, color: C.g400 }}>/ {fmt(item.budget)}</span></>
                            : <span style={{ color: C.g500 }}>Budget: {fmt(item.budget)}</span>}
                          {overBudget && <span style={{ color: C.red, fontSize: 11 }}> ⚠️ Over</span>}
                        </span>
                      )}
                    </div>

                    {/* shop + sharing row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      {item.shop && (
                        <span style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>
                          {shopObj?.emoji || "🏬"} {item.shop}
                        </span>
                      )}
                      <Pill label={wm.label} color={wm.color} bg={wm.bg} border={wm.border} />
                    </div>
                  </div>

                  {/* action menu */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    {!item.done && (
                      <button onClick={() => openShare(item.id)} style={{
                        background: C.tealLight, border: "none", borderRadius: 8, padding: "5px 8px",
                        fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: C.teal, fontWeight: 700 }}>
                        Share
                      </button>
                    )}
                    <button onClick={() => deleteItem(item.id)} style={{
                      background: "none", border: "none", cursor: "pointer", fontSize: 16,
                      color: C.g400, padding: 0 }}>🗑️</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </>)}

      {/* ════════ SHOPS TAB ════════ */}
      {tab === "shops" && (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {shops.map(s => {
            const shopItems = items.filter(i => i.shop === s.name && !i.done);
            const shopBudget = shopItems.reduce((sum, i) => sum + (i.budget || 0), 0);
            return (
              <Card key={s.id} style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: C.blueLight,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{s.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.g900 }}>{s.name}</p>
                    {s.address && <p style={{ margin: "2px 0 0", fontSize: 13, color: C.g400 }}>📍 {s.address}</p>}
                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      {shopItems.length > 0 && (
                        <span style={{ fontSize: 12, color: C.blue, fontWeight: 700 }}>
                          {shopItems.length} item{shopItems.length !== 1 ? "s" : ""} to buy
                        </span>
                      )}
                      {shopBudget > 0 && (
                        <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>≈ {fmt(shopBudget)}</span>
                      )}
                    </div>
                  </div>
                </div>
                {shopItems.length > 0 && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.g100}` }}>
                    {shopItems.map(i => (
                      <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: priMeta(i.priority).color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: C.g700, flex: 1 }}>{i.name}</span>
                        {i.budget && <span style={{ fontSize: 12, color: C.g500 }}>{fmt(i.budget)}</span>}
                        <Pill {...priMeta(i.priority)} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ════════ BUDGET TAB ════════ */}
      {tab === "budget" && (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* overview card */}
          <Card>
            <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 16, color: C.g900 }}>💰 Budget Overview</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Total Budget",  val: fmt(totalBudget),  color: C.g900 },
                { label: "Spent so far",  val: fmt(totalSpent),   color: C.red  },
                { label: "Still needed",  val: fmt(totalPending), color: C.amber },
                { label: "Saved vs budget", val: fmt(Math.max(0, totalBudget - totalSpent)), color: C.green },
              ].map(s => (
                <div key={s.label} style={{ background: C.bg, borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: C.g500, fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* spend bar */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.g700 }}>Spent</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: barColor }}>{Math.round(pct)}%</span>
              </div>
              <div style={{ height: 10, background: C.g100, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: barColor,
                  borderRadius: 10, transition: "width .4s ease" }} />
              </div>
            </div>
          </Card>

          {/* shared cost summary */}
          <Card>
            <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 16, color: C.g900 }}>🤝 Shared with David</p>
            {sharedItems.length === 0
              ? <p style={{ color: C.g400, fontSize: 14, margin: 0 }}>No items shared with co-parent yet.</p>
              : sharedItems.map(i => {
                  const wm = whoMeta(i.sharedWith);
                  return (
                    <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 10,
                      marginBottom: 10, borderBottom: `1px solid ${C.g100}` }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.g900,
                          textDecoration: i.done ? "line-through" : "none" }}>{i.name}</p>
                        <Pill label={wm.label} color={wm.color} bg={wm.bg} border={wm.border} />
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 14,
                          color: i.done ? C.green : C.g700 }}>
                          {i.done && i.actualCost != null ? fmt(i.actualCost) : fmt(i.budget)}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: C.g400 }}>{i.done ? "spent" : "budget"}</p>
                      </div>
                    </div>
                  );
                })
            }
          </Card>

          {/* per-category breakdown */}
          <Card>
            <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 16, color: C.g900 }}>📊 By Category</p>
            {SHOP_CATS.filter(c => c.id !== "all").map(c => {
              const catItems  = items.filter(i => i.category === c.id);
              const catBudget = catItems.reduce((s, i) => s + (i.budget || 0), 0);
              const catSpent  = catItems.filter(i => i.done).reduce((s, i) => s + (i.actualCost ?? i.budget ?? 0), 0);
              if (catItems.length === 0) return null;
              const cm = catMeta(c.id);
              const cp = catBudget > 0 ? Math.min(100, (catSpent / catBudget) * 100) : 0;
              return (
                <div key={c.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.g700 }}>{c.emoji} {c.label}</span>
                    <span style={{ fontSize: 13, color: C.g500 }}>{fmt(catSpent)} / {fmt(catBudget)}</span>
                  </div>
                  <div style={{ height: 7, background: C.g100, borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: cp + "%", background: cm.color, borderRadius: 10 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* ── FAB ── */}
      {tab !== "budget" && (
        <div style={{ position: "fixed", bottom: 88, right: 20 }}>
          <button onClick={() => setModal(tab === "items" ? "item" : "shop")}
            style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 16,
              padding: "14px 20px", fontSize: 15, fontWeight: 800, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit",
              boxShadow: "0 4px 18px rgba(59,130,246,.5)" }}>
            + {tab === "items" ? "Add Item" : "Add Shop"}
          </button>
        </div>
      )}

      {/* ════ MODAL: ADD ITEM ════ */}
      {modal === "item" && (
        <Modal title="Add Item" onClose={() => setModal(null)}>
          <Field label="Item name">
            <TextInput placeholder="e.g. Winter jacket" value={nName} onChange={e => setNName(e.target.value)} />
          </Field>

          <Field label="Category">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SHOP_CATS.filter(c => c.id !== "all").map(c => (
                <button key={c.id} onClick={() => setNCat(c.id)} style={{
                  padding: "7px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (nCat === c.id ? C.blue : C.g200),
                  background: nCat === c.id ? C.blue : C.white,
                  color: nCat === c.id ? "#fff" : C.g700,
                }}>{c.emoji} {c.label}</button>
              ))}
            </div>
          </Field>

          <Field label="Priority">
            <div style={{ display: "flex", gap: 8 }}>
              {Object.entries(PRI).map(([k, v]) => (
                <button key={k} onClick={() => setNPri(k)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (nPri === k ? v.color : C.g200),
                  background: nPri === k ? v.bg : C.white, color: nPri === k ? v.color : C.g500,
                }}>{v.label}</button>
              ))}
            </div>
          </Field>

          <Field label="Budget (R)">
            <TextInput placeholder="e.g. 450" value={nBudget} onChange={e => setNBudget(e.target.value)} type="number" />
          </Field>

          <Field label="Who's responsible?">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(WHO).map(([k, v]) => (
                <button key={k} onClick={() => setNWho(k)} style={{
                  padding: "7px 13px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (nWho === k ? v.color : C.g200),
                  background: nWho === k ? v.bg : C.white, color: nWho === k ? v.color : C.g500,
                }}>{v.label}</button>
              ))}
            </div>
          </Field>

          <Field label="Shop (optional)">
            <select value={nShop} onChange={e => setNShop(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14,
                border: `1.5px solid ${C.g200}`, color: C.g900, background: C.white,
                fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}>
              <option value="">— No shop —</option>
              {shops.map(s => <option key={s.id} value={s.name}>{s.emoji} {s.name}</option>)}
            </select>
          </Field>

          <Field label="Notes">
            <Textarea placeholder={"Size, colour, brand…\nAny extra details here"} value={nNotes} onChange={e => setNNotes(e.target.value)} rows={3} />
          </Field>

          <Btn onClick={addItem} style={{ width: "100%" }}>Add to List</Btn>
        </Modal>
      )}

      {/* ════ MODAL: ADD SHOP ════ */}
      {modal === "shop" && (
        <Modal title="Add Shop" onClose={() => setModal(null)}>
          <Field label="Icon">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["🏬","🛒","💊","👗","🏃","📝","🧸","🎨","👟","🏥"].map(e => (
                <button key={e} onClick={() => setSEmoji(e)} style={{
                  width: 40, height: 40, borderRadius: 10, fontSize: 20, cursor: "pointer",
                  border: "1.5px solid " + (sEmoji === e ? C.blue : C.g200),
                  background: sEmoji === e ? C.blueLight : C.white,
                }}>{e}</button>
              ))}
            </div>
          </Field>
          <Field label="Shop name"><TextInput placeholder="e.g. Woolworths" value={sName} onChange={e => setSName(e.target.value)} /></Field>
          <Field label="Address / location"><TextInput placeholder="e.g. Gateway Mall" value={sAddr} onChange={e => setSAddr(e.target.value)} /></Field>
          <Btn onClick={addShop} style={{ width: "100%" }}>Save Shop</Btn>
        </Modal>
      )}

      {/* ════ MODAL: MARK BOUGHT ════ */}
      {modal === "markBought" && selItem && (
        <Modal title="Mark as Bought" onClose={() => setModal(null)}>
          <div style={{ background: C.bg, borderRadius: 14, padding: 14 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.g900 }}>{selItem.name}</p>
            {selItem.budget && <p style={{ margin: "4px 0 0", fontSize: 13, color: C.g500 }}>Budget: {fmt(selItem.budget)}</p>}
          </div>

          <Field label="Actual cost paid (R)">
            <TextInput placeholder={selItem.budget ? `Budget was ${fmt(selItem.budget)}` : "Enter amount"} value={bCost} onChange={e => setBCost(e.target.value)} type="number" />
          </Field>

          {bCost && parseFloat(bCost) > (selItem.budget || Infinity) && (
            <div style={{ background: C.redLight, borderRadius: 12, padding: 12, border: `1px solid #FECACA` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.red, fontWeight: 700 }}>
                ⚠️ {fmt(parseFloat(bCost) - selItem.budget)} over budget
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setModal(null)} color={C.g200} outline style={{ flex: 1, color: C.g700 }}>Cancel</Btn>
            <Btn onClick={confirmBought} style={{ flex: 1 }}>✓ Mark Bought</Btn>
          </div>
        </Modal>
      )}

      {/* ════ MODAL: SHARE ════ */}
      {modal === "share" && selItem && (
        <Modal title="Share with David" onClose={() => setModal(null)}>
          {shareSent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: C.g900 }}>Sent to David!</p>
              <p style={{ margin: "6px 0 0", color: C.g500, fontSize: 14 }}>He'll get a notification</p>
            </div>
          ) : (<>
            <div style={{ background: C.bg, borderRadius: 14, padding: 14 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.g900 }}>{selItem.name}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {selItem.budget && <Pill label={"Budget: " + fmt(selItem.budget)} color={C.g700} bg={C.g100} border={C.g200} />}
                {selItem.shop && <Pill label={"@ " + selItem.shop} color={C.blue} bg={C.blueLight} border="#BFDBFE" />}
              </div>
            </div>

            <Field label="Who should handle this?">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries(WHO).map(([k, v]) => (
                  <button key={k} onClick={() => updateSharing(selItem.id, k)} style={{
                    padding: "7px 13px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    border: "1.5px solid " + (selItem.sharedWith === k ? v.color : C.g200),
                    background: selItem.sharedWith === k ? v.bg : C.white,
                    color: selItem.sharedWith === k ? v.color : C.g500,
                  }}>{v.label}</button>
                ))}
              </div>
            </Field>

            <Field label="Add a note for David (optional)">
              <TextInput placeholder='e.g. "Please get size 2, black only"'
                value={shareNote} onChange={e => setShareNote(e.target.value)} />
            </Field>

            <div style={{ background: C.tealLight, borderRadius: 12, padding: 12, border: `1px solid #99F6E4` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.teal, fontWeight: 700 }}>
                📲 David will receive a push notification with item details, budget, and your note.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setModal(null)} outline color={C.g400} style={{ flex: 1, color: C.g700 }}>Cancel</Btn>
              <Btn onClick={sendShare} color={C.teal} style={{ flex: 1 }}>Send to David</Btn>
            </div>
          </>)}
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHAT
// ══════════════════════════════════════════════════════════════════════════════
const INIT_MSGS = [
  { id: 1, from: "david", text: "Hey, can you confirm Amara's soccer time on Thursday?", time: "08:12", read: true },
  { id: 2, from: "me",    text: "It's at 14:30 at Riverside Park. Coach Sipho confirmed.", time: "08:45", read: true },
  { id: 3, from: "david", text: "Perfect. I can do pick-up after practice if you want?", time: "08:47", read: true },
  { id: 4, from: "me",    text: "That would be great, thank you! Collect by 16:30 or they charge a late fee.", time: "09:02", read: true },
  { id: 5, from: "david", text: "Got it. Also — did you get her winter jacket yet? She mentioned she was cold.", time: "11:30", read: true },
  { id: 6, from: "me",    text: "Not yet, it's on the shopping list. H&M Kids at Gateway. Budget R380.", time: "11:34", read: false },
];

function ChatScreen({ profile = {} }) {
  const coParent = profile.coParent || {};
  const coName   = coParent.name  || "Co-parent";
  const coEmoji  = coParent.emoji || "👨";
  const coInitial= coName[0] || "C";
  const [msgs, setMsgs]   = useState(INIT_MSGS);
  const [text, setText]   = useState("");
  const [typing, setTyping] = useState(false);

  const DAVID_REPLIES = [
    "Got it, thanks for letting me know! 👍",
    "Sounds good. I'll sort it out.",
    "Ok will do. Is there anything else Amara needs this week?",
    "Thanks Sarah. She's lucky to have such an organised mom 😊",
    "Noted! I'll check my calendar and confirm.",
  ];

  const send = () => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), from: "me", text: text.trim(), time: new Date().toLocaleTimeString("en-ZA",{hour:"2-digit",minute:"2-digit"}), read: true };
    setMsgs(p => [...p, newMsg]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, {
        id: Date.now() + 1, from: "david",
        text: DAVID_REPLIES[Math.floor(Math.random() * DAVID_REPLIES.length)],
        time: new Date().toLocaleTimeString("en-ZA",{hour:"2-digit",minute:"2-digit"}),
        read: false,
      }]);
    }, 1800);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden" }}>
      {/* header */}
      <div style={{ background: C.white, padding: "18px 20px 14px", borderBottom: `1px solid ${C.g200}`,
        display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18 }}>D</div>
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%",
            background: C.green, border: "2px solid " + C.white }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: C.g900 }}>{coName}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: C.green, fontWeight: 700 }}>● Online · Co-parent</p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontSize: 20, cursor: "pointer" }}>📞</span>
          <span style={{ fontSize: 20, cursor: "pointer" }}>⋮</span>
        </div>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 80 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: C.g400, background: C.g100, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>Today · Thu 14 May</span>
        </div>

        {msgs.map(m => {
          const isMe = m.from === "me";
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
              {!isMe && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12, flexShrink: 0 }}>D</div>
              )}
              <div style={{ maxWidth: "72%" }}>
                <div style={{ background: isMe ? C.blue : C.white, color: isMe ? "#fff" : C.g900,
                  borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px", fontSize: 14, lineHeight: 1.5, fontWeight: 500,
                  boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
                  {m.text}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4,
                  justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: 11, color: C.g400 }}>{m.time}</span>
                  {isMe && <span style={{ fontSize: 11, color: m.read ? C.blue : C.g400 }}>✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>D</div>
            <div style={{ background: C.white, borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,.08)", display: "flex", gap: 4, alignItems: "center" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.g400,
                  animation: `bounce 1s ${i*0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* input bar */}
      <div style={{ position: "fixed", bottom: 64, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: C.white, borderTop: `1px solid ${C.g200}`, padding: "10px 14px",
        display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, background: C.bg, borderRadius: 24, padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 8 }}>
          <input value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Message ${coName}…`}
            style={{ border: "none", background: "transparent", outline: "none", flex: 1,
              fontSize: 14, color: C.g900, fontFamily: "inherit" }} />
          <span style={{ fontSize: 18, cursor: "pointer" }}>📎</span>
        </div>
        <button onClick={send} style={{ width: 44, height: 44, borderRadius: "50%", background: C.blue,
          border: "none", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", boxShadow: "0 3px 10px rgba(59,130,246,.4)", flexShrink: 0 }}>
          <span style={{ fontSize: 18 }}>➤</span>
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REQUESTS
// ══════════════════════════════════════════════════════════════════════════════
const INIT_REQUESTS = [
  { id: 1, type: "swap", title: "Swap Weekend — 24 May", from: "david", desc: "David wants to swap his Sat 24 May for your Sun 1 June.", date: "Sat 24 May ↔ Sun 1 Jun", status: "pending", urgent: true },
  { id: 2, type: "permission", title: "School Camp Permission", from: "school", desc: "Sunshine Primary: Grade 2 overnight camp 6–7 June. Both parents must approve.", date: "6–7 Jun 2026", status: "pending", urgent: false },
  { id: 3, type: "expense", title: "Soccer Tournament Fee", from: "david", desc: "David paid R350 entry fee for U8 tournament. Requesting 50% split (R175).", date: "Due Fri 16 May", status: "pending", urgent: true },
  { id: 4, type: "swap", title: "Swap — 10 May", from: "me", desc: "You requested to swap Mon 10 May. David approved.", date: "Mon 10 May", status: "approved", urgent: false },
  { id: 5, type: "medical", title: "Dentist Consent", from: "me", desc: "Dr Pillay needs both parents to sign off on Amara's filling procedure.", date: "Wed 21 May", status: "approved", urgent: false },
];

const REQ_META = {
  swap:       { icon: "🔄", color: C.blue,   bg: C.blueLight,   border: "#BFDBFE", label: "Swap" },
  permission: { icon: "✍️",  color: C.purple, bg: C.purpleLight, border: "#DDD6FE", label: "Permission" },
  expense:    { icon: "💸",  color: C.amber,  bg: C.amberLight,  border: "#FDE68A", label: "Expense" },
  medical:    { icon: "🏥",  color: C.red,    bg: C.redLight,    border: "#FECACA", label: "Medical" },
};

function RequestsScreen() {
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [filter, setFilter]     = useState("pending");
  const [modal, setModal]       = useState(null);
  const [selId, setSelId]       = useState(null);

  // new request form
  const [nType,  setNType]  = useState("swap");
  const [nTitle, setNTitle] = useState("");
  const [nDesc,  setNDesc]  = useState("");
  const [nDate,  setNDate]  = useState("");

  const visible = requests.filter(r => filter === "all" || r.status === filter);
  const pendingCount = requests.filter(r => r.status === "pending").length;

  const respond = (id, status) =>
    setRequests(p => p.map(r => r.id === id ? { ...r, status } : r));

  const addRequest = () => {
    if (!nTitle.trim()) return;
    setRequests(p => [...p, {
      id: Date.now(), type: nType, title: nTitle.trim(),
      from: "me", desc: nDesc, date: nDate, status: "pending", urgent: false,
    }]);
    setNType("swap"); setNTitle(""); setNDesc(""); setNDate("");
    setModal(null);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg, paddingBottom: 90 }}>
      {/* header */}
      <div style={{ padding: "22px 20px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.g900, letterSpacing: -0.5 }}>📋 Requests</h2>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: C.g500 }}>
            {pendingCount > 0 ? `${pendingCount} need${pendingCount === 1 ? "s" : ""} your attention` : "All caught up!"}
          </p>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.blue,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>S</div>
      </div>

      {/* filter tabs */}
      <div style={{ display: "flex", margin: "0 16px 14px", background: C.g100, borderRadius: 14, padding: 4 }}>
        {[["pending","⏳ Pending"],["approved","✅ Approved"],["all","All"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            flex: 1, padding: "9px 0", borderRadius: 11, border: "none", fontFamily: "inherit",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            background: filter === v ? C.white : "transparent",
            color: filter === v ? C.g900 : C.g500,
            boxShadow: filter === v ? "0 1px 4px rgba(0,0,0,.1)" : "none",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {visible.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.g400 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
            <p style={{ margin: 0, fontWeight: 700 }}>Nothing here</p>
          </div>
        )}

        {visible.map(req => {
          const m = REQ_META[req.type] || REQ_META.swap;
          const isPending = req.status === "pending";
          const isIncoming = req.from !== "me";
          return (
            <Card key={req.id} style={{ padding: "16px" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: m.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {m.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.g900 }}>{req.title}</p>
                    <Pill label={m.label} color={m.color} bg={m.bg} border={m.border} />
                    {req.urgent && <Pill label="Urgent" color={C.red} bg={C.redLight} border="#FECACA" />}
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: C.g500, lineHeight: 1.5 }}>{req.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: C.g400 }}>📅 {req.date}</span>
                    <span style={{ fontSize: 12, color: req.from === "me" ? C.blue : C.purple, fontWeight: 700 }}>
                      {req.from === "me" ? "Sent by you" : "From David"}
                    </span>
                  </div>
                </div>
              </div>

              {/* status / actions */}
              {isPending && isIncoming ? (
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  <button onClick={() => respond(req.id, "declined")} style={{
                    flex: 1, padding: "10px", borderRadius: 12, border: `1.5px solid ${C.g200}`,
                    background: C.white, color: C.g700, fontWeight: 700, fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit" }}>Decline</button>
                  <button onClick={() => respond(req.id, "approved")} style={{
                    flex: 1, padding: "10px", borderRadius: 12, border: "none",
                    background: C.green, color: "#fff", fontWeight: 700, fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit" }}>✓ Approve</button>
                </div>
              ) : (
                <div style={{ marginTop: 10 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                    color: req.status === "approved" ? C.green : req.status === "declined" ? C.red : C.amber,
                    background: req.status === "approved" ? C.greenLight : req.status === "declined" ? C.redLight : C.amberLight,
                  }}>
                    {req.status === "approved" ? "✓ Approved" : req.status === "declined" ? "✗ Declined" : "⏳ Awaiting response"}
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: 88, right: 20 }}>
        <button onClick={() => setModal("new")} style={{ background: C.blue, color: "#fff", border: "none",
          borderRadius: 16, padding: "14px 20px", fontSize: 15, fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit",
          boxShadow: "0 4px 18px rgba(59,130,246,.5)" }}>+ New Request</button>
      </div>

      {modal === "new" && (
        <Modal title="New Request" onClose={() => setModal(null)}>
          <Field label="Request type">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(REQ_META).map(([k, v]) => (
                <button key={k} onClick={() => setNType(k)} style={{
                  padding: "7px 13px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (nType === k ? v.color : C.g200),
                  background: nType === k ? v.bg : C.white, color: nType === k ? v.color : C.g700,
                }}>{v.icon} {v.label}</button>
              ))}
            </div>
          </Field>
          <Field label="Title"><TextInput placeholder="e.g. Swap weekend 31 May" value={nTitle} onChange={e => setNTitle(e.target.value)} /></Field>
          <Field label="Details"><Textarea placeholder={"Explain what you need…\nAdd any extra context here"} value={nDesc} onChange={e => setNDesc(e.target.value)} rows={3} /></Field>
          <Field label="Date / deadline"><TextInput placeholder="e.g. Sat 31 May" value={nDate} onChange={e => setNDate(e.target.value)} /></Field>
          <Btn onClick={addRequest} style={{ width: "100%" }}>Send to David</Btn>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING WIZARD
// ══════════════════════════════════════════════════════════════════════════════
const CHILD_EMOJIS = ["👦","👧","🧒","👶"];
const PARENT_EMOJIS = ["👩","👨","🧑","👩‍🦱","👨‍🦱","👩‍🦰","👨‍🦰"];

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);

  // Step 0: Your details
  const [myName,  setMyName]  = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myEmoji, setMyEmoji] = useState("👩");
  const [myRole,  setMyRole]  = useState("mom");

  // Step 1: Child details
  const [childName,    setChildName]    = useState("");
  const [childDOB,     setChildDOB]     = useState("");
  const [childGrade,   setChildGrade]   = useState("");
  const [childSchool,  setChildSchool]  = useState("");
  const [childGender,  setChildGender]  = useState("girl");
  const [childEmoji,   setChildEmoji]   = useState("👧");
  const [childMedical, setChildMedical] = useState("");
  const [childAllergy, setChildAllergy] = useState("");

  // Step 2: Co-parent details
  const [coName,  setCoName]  = useState("");
  const [coEmail, setCoEmail] = useState("");
  const [coEmoji, setCoEmoji] = useState("👨");
  const [coRole,  setCoRole]  = useState("dad");
  const [coPerm,  setCoPerm]  = useState({ calendar: true, shopping: true, requests: true, payments: false });

  const steps = ["Your Profile", "Child's Details", "Co-parent", "All Set!"];
  const pct = ((step) / (steps.length - 1)) * 100;

  const canNext = [
    myName.trim() && myEmail.trim(),
    childName.trim() && childDOB,
    true, // co-parent optional
    true,
  ];

  const finish = () => onComplete({
    me: { name: myName, email: myEmail, emoji: myEmoji, role: myRole },
    child: { name: childName, dob: childDOB, grade: childGrade, school: childSchool, gender: childGender, emoji: childEmoji, medical: childMedical, allergy: childAllergy },
    coParent: { name: coName, email: coEmail, emoji: coEmoji, role: coRole, permissions: coPerm },
  });

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12,
      background: on ? C.blue : C.g300, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white,
        position: "absolute", top: 3, left: on ? 23 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* progress bar */}
      <div style={{ background: C.white, padding: "20px 20px 16px", borderBottom: `1px solid ${C.g200}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.g400, textTransform: "uppercase", letterSpacing: 1 }}>Step {step + 1} of {steps.length}</p>
            <p style={{ margin: "3px 0 0", fontSize: 18, fontWeight: 900, color: C.g900 }}>{steps[step]}</p>
          </div>
          <div style={{ fontSize: 32 }}>
            {step === 0 ? myEmoji : step === 1 ? childEmoji : step === 2 ? coEmoji : "🎉"}
          </div>
        </div>
        <div style={{ height: 6, background: C.g100, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg,#3B82F6,#8B5CF6)", borderRadius: 10, transition: "width .3s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {steps.map((s, i) => (
            <span key={s} style={{ fontSize: 10, fontWeight: 700, color: i <= step ? C.blue : C.g400 }}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── STEP 0: YOUR PROFILE ── */}
        {step === 0 && (<>
          <Field label="Choose your emoji">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {PARENT_EMOJIS.map(e => (
                <button key={e} onClick={() => setMyEmoji(e)} style={{
                  width: 48, height: 48, borderRadius: 14, fontSize: 26, cursor: "pointer",
                  border: "2px solid " + (myEmoji === e ? C.blue : C.g200),
                  background: myEmoji === e ? C.blueLight : C.white }}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Your full name *"><TextInput placeholder="e.g. Sarah Dlamini" value={myName} onChange={e => setMyName(e.target.value)} /></Field>
          <Field label="Your email *"><TextInput placeholder="e.g. sarah@email.com" value={myEmail} onChange={e => setMyEmail(e.target.value)} type="email" /></Field>
          <Field label="Your role">
            <div style={{ display: "flex", gap: 8 }}>
              {[["mom","Mom 👩"],["dad","Dad 👨"],["guardian","Guardian 🧑"]].map(([v,l]) => (
                <button key={v} onClick={() => setMyRole(v)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (myRole === v ? C.blue : C.g200),
                  background: myRole === v ? C.blueLight : C.white,
                  color: myRole === v ? C.blue : C.g700 }}>{l}</button>
              ))}
            </div>
          </Field>
        </>)}

        {/* ── STEP 1: CHILD DETAILS ── */}
        {step === 1 && (<>
          <Field label="Choose an emoji for your child">
            <div style={{ display: "flex", gap: 10 }}>
              {CHILD_EMOJIS.map(e => (
                <button key={e} onClick={() => setChildEmoji(e)} style={{
                  width: 52, height: 52, borderRadius: 14, fontSize: 28, cursor: "pointer",
                  border: "2px solid " + (childEmoji === e ? C.blue : C.g200),
                  background: childEmoji === e ? C.blueLight : C.white }}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Child's full name *"><TextInput placeholder="e.g. Ethan Dlamini" value={childName} onChange={e => setChildName(e.target.value)} /></Field>
          <Field label="Gender">
            <div style={{ display: "flex", gap: 8 }}>
              {[["boy","Boy"],["girl","Girl"],["other","Other"]].map(([v,l]) => (
                <button key={v} onClick={() => setChildGender(v)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (childGender === v ? C.blue : C.g200),
                  background: childGender === v ? C.blueLight : C.white,
                  color: childGender === v ? C.blue : C.g700 }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="Date of birth *"><TextInput placeholder="e.g. 12 March 2018" value={childDOB} onChange={e => setChildDOB(e.target.value)} /></Field>
          <Field label="Grade / Year"><TextInput placeholder="e.g. Grade 2" value={childGrade} onChange={e => setChildGrade(e.target.value)} /></Field>
          <Field label="School"><TextInput placeholder="e.g. Sunshine Primary" value={childSchool} onChange={e => setChildSchool(e.target.value)} /></Field>
          <Field label="Medical conditions (optional)"><TextInput placeholder="e.g. ADHD — Ritalin 10mg" value={childMedical} onChange={e => setChildMedical(e.target.value)} /></Field>
          <Field label="Allergies (optional)"><TextInput placeholder="e.g. Penicillin, peanuts" value={childAllergy} onChange={e => setChildAllergy(e.target.value)} /></Field>
        </>)}

        {/* ── STEP 2: CO-PARENT ── */}
        {step === 2 && (<>
          <div style={{ background: C.blueLight, borderRadius: 14, padding: 14, border: "1px solid #BFDBFE" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.blue, fontWeight: 700 }}>
              💡 You can skip this now and invite your co-parent later from the Profile screen.
            </p>
          </div>
          <Field label="Co-parent emoji">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {PARENT_EMOJIS.map(e => (
                <button key={e} onClick={() => setCoEmoji(e)} style={{
                  width: 48, height: 48, borderRadius: 14, fontSize: 26, cursor: "pointer",
                  border: "2px solid " + (coEmoji === e ? C.blue : C.g200),
                  background: coEmoji === e ? C.blueLight : C.white }}>
                  {e}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Co-parent's full name"><TextInput placeholder="e.g. David Dlamini" value={coName} onChange={e => setCoName(e.target.value)} /></Field>
          <Field label="Co-parent's email"><TextInput placeholder="e.g. david@email.com" value={coEmail} onChange={e => setCoEmail(e.target.value)} type="email" /></Field>
          <Field label="Their role">
            <div style={{ display: "flex", gap: 8 }}>
              {[["dad","Dad 👨"],["mom","Mom 👩"],["guardian","Guardian 🧑"]].map(([v,l]) => (
                <button key={v} onClick={() => setCoRole(v)} style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: "1.5px solid " + (coRole === v ? C.blue : C.g200),
                  background: coRole === v ? C.blueLight : C.white,
                  color: coRole === v ? C.blue : C.g700 }}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="What can they do?">
            {[["calendar","View & edit calendar"],["shopping","Shopping list"],["requests","Send & approve requests"],["payments","Manage payments"]].map(([k,l]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${C.g100}` }}>
                <span style={{ fontSize: 14, color: C.g900, fontWeight: 600 }}>{l}</span>
                <Toggle on={coPerm[k]} onToggle={() => setCoPerm(p => ({ ...p, [k]: !p[k] }))} />
              </div>
            ))}
          </Field>
        </>)}

        {/* ── STEP 3: ALL SET ── */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900, color: C.g900 }}>You're all set!</h2>
            <p style={{ margin: "0 0 24px", fontSize: 15, color: C.g500, lineHeight: 1.6 }}>
              KidSync is ready for you and {childName || "your child"}. Everything you set up can be edited anytime in your Profile.
            </p>
            <div style={{ background: C.white, borderRadius: 18, padding: 20, textAlign: "left", marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,.07)" }}>
              <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 15, color: C.g900 }}>Summary</p>
              {[
                ["You", `${myEmoji} ${myName}`],
                ["Child", `${childEmoji} ${childName}`],
                ["DOB", childDOB],
                ["School", childSchool || "—"],
                ["Co-parent", coName ? `${coEmoji} ${coName}` : "—  (invite later)"],
              ].map(([l,v]) => v && (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${C.g100}` }}>
                  <span style={{ fontSize: 13, color: C.g500, fontWeight: 600 }}>{l}</span>
                  <span style={{ fontSize: 13, color: C.g900, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* bottom nav buttons */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: C.white, borderTop: `1px solid ${C.g200}`, padding: "14px 16px",
        display: "flex", gap: 12 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "14px", borderRadius: 14,
            border: `1.5px solid ${C.g200}`, background: C.white, fontFamily: "inherit",
            fontSize: 15, fontWeight: 700, color: C.g700, cursor: "pointer" }}>← Back</button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none",
              background: canNext[step] ? C.blue : C.g200, color: canNext[step] ? "#fff" : C.g400,
              fontFamily: "inherit", fontSize: 15, fontWeight: 700,
              cursor: canNext[step] ? "pointer" : "not-allowed",
              boxShadow: canNext[step] ? "0 4px 14px rgba(59,130,246,.4)" : "none" }}>
            {step === 2 ? (coName ? "Next →" : "Skip →") : "Next →"}
          </button>
        ) : (
          <button onClick={finish} style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none",
            background: C.blue, color: "#fff", fontFamily: "inherit", fontSize: 15, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(59,130,246,.4)" }}>
            Let's go! 🚀
          </button>
        )}
      </div>
    </div>
  );
}

// ── InviteCard — proper component so hooks work correctly ─────────────────────
function InviteCard({ profile = {}, coParent = {} }) {
  const [copied,    setCopied]    = useState(false);
  const [linkShown, setLinkShown] = useState(false);

  const generateLink = () => {
    const shareData = {
      childName:   profile.child?.name   || "",
      childEmoji:  profile.child?.emoji  || "🧒",
      childGrade:  profile.child?.grade  || "",
      childSchool: profile.child?.school || "",
      invitedBy:   profile.me?.name      || "",
      role: "viewer",
      ts:   Date.now(),
    };
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
      return `${window.location.href.split("?")[0]}?invite=${encoded}`;
    } catch { return window.location.href; }
  };

  const link = generateLink();

  const copyLink = () => {
    navigator.clipboard.writeText(link)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
      .catch(() => setLinkShown(true));
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join KidSync",
        text: `${profile.me?.name || "Someone"} has invited you to view ${profile.child?.name || "their child"}'s schedule on KidSync.`,
        url: link,
      });
    } else { copyLink(); }
  };

  return (
    <Card style={{ background: "linear-gradient(135deg,#EFF6FF,#F5F3FF)", border: "1px solid #BFDBFE" }}>
      <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 15, color: C.g900 }}>📲 Share KidSync</p>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: C.g500 }}>
        Send this link to {coParent.name || "your co-parent"}, a grandparent, nanny or guardian.
        They'll open the app with your child's details already loaded.
      </p>
      <div style={{ display:"flex", gap:10, marginBottom:10 }}>
        <button onClick={copyLink} style={{
          flex:1, background: copied ? C.green : C.blue, color:"#fff", border:"none",
          borderRadius:12, padding:"12px 16px", fontSize:14, fontWeight:700,
          cursor:"pointer", fontFamily:"inherit", transition:"all .2s",
          boxShadow: copied ? "0 4px 14px rgba(22,163,74,.4)" : "0 4px 14px rgba(59,130,246,.4)",
        }}>
          {copied ? "✓ Copied!" : "📋 Copy Link"}
        </button>
        <button onClick={shareNative} style={{
          background: C.purpleLight, color: C.purple, border:`1.5px solid #DDD6FE`,
          borderRadius:12, padding:"12px 16px", fontSize:14, fontWeight:700,
          cursor:"pointer", fontFamily:"inherit",
        }}>↗ Share</button>
      </div>

      {linkShown && (
        <div style={{ background:C.g100, borderRadius:10, padding:12, marginBottom:10 }}>
          <p style={{ margin:"0 0 6px", fontSize:11, color:C.g500, fontWeight:700 }}>Copy this link manually:</p>
          <p style={{ margin:0, fontSize:11, color:C.g700, wordBreak:"break-all",
            fontFamily:"monospace", lineHeight:1.6 }}>{link}</p>
        </div>
      )}

      <div style={{ background:"rgba(255,255,255,.8)", borderRadius:10, padding:"10px 12px" }}>
        <p style={{ margin:0, fontSize:12, color:C.g700, lineHeight:1.5 }}>
          🔒 <strong>View only.</strong> They can see {profile.child?.name || "your child"}'s schedule
          but can't make changes unless you add them as a co-parent.
        </p>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE (fully editable, uses real setup data)
// ══════════════════════════════════════════════════════════════════════════════
function ProfileScreen({ profile, onUpdateProfile, onLogout, onDeleteAccount }) {
  const { me, child, coParent } = profile;

  const [editSection, setEditSection] = useState(null); // null | "me" | "child" | "coparent"
  const [notif, setNotif] = useState({ events: true, chat: true, requests: true, shopping: false });

  // edit buffers
  const [myName,  setMyName]  = useState(me.name);
  const [myEmail, setMyEmail] = useState(me.email);
  const [myEmoji, setMyEmoji] = useState(me.emoji);
  const [myRole,  setMyRole]  = useState(me.role);

  const [cName,    setCName]    = useState(child.name);
  const [cDOB,     setCDOB]     = useState(child.dob);
  const [cGrade,   setCGrade]   = useState(child.grade);
  const [cSchool,  setCSchool]  = useState(child.school);
  const [cEmoji,   setCEmoji]   = useState(child.emoji);
  const [cMedical, setCMedical] = useState(child.medical);
  const [cAllergy, setCAllergy] = useState(child.allergy);

  const [coName,  setCoName]  = useState(coParent.name);
  const [coEmail, setCoEmail] = useState(coParent.email);
  const [coEmoji, setCoEmoji] = useState(coParent.emoji);
  const [coRole,  setCoRole]  = useState(coParent.role);
  const [coPerm,  setCoPerm]  = useState(coParent.permissions);

  const saveMe = () => { onUpdateProfile({ ...profile, me: { name: myName, email: myEmail, emoji: myEmoji, role: myRole } }); setEditSection(null); };
  const saveChild = () => { onUpdateProfile({ ...profile, child: { ...child, name: cName, dob: cDOB, grade: cGrade, school: cSchool, emoji: cEmoji, medical: cMedical, allergy: cAllergy } }); setEditSection(null); };
  const saveCoParent = () => { onUpdateProfile({ ...profile, coParent: { name: coName, email: coEmail, emoji: coEmoji, role: coRole, permissions: coPerm } }); setEditSection(null); };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12,
      background: on ? C.blue : C.g300, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.white,
        position: "absolute", top: 3, left: on ? 23 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );

  const SectionHeader = ({ title, section }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: C.g900 }}>{title}</p>
      <div style={{ display: "flex", gap: 8 }}>
        {editSection === section && (
          <button onClick={() => setEditSection(null)} style={{ background: C.g100, color: C.g500, border: "none",
            borderRadius: 10, padding: "6px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        )}
        <button onClick={() => editSection === section
            ? (section === "me" ? saveMe() : section === "child" ? saveChild() : saveCoParent())
            : setEditSection(section)}
          style={{ background: editSection === section ? C.green : C.blueLight,
            color: editSection === section ? "#fff" : C.blue, border: "none",
            borderRadius: 10, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {editSection === section ? "✓ Save" : "Edit"}
        </button>
      </div>
    </div>
  );

  const Row = ({ l, v }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      paddingBottom: 9, marginBottom: 9, borderBottom: `1px solid ${C.g100}` }}>
      <span style={{ fontSize: 13, color: C.g500, fontWeight: 600 }}>{l}</span>
      <span style={{ fontSize: 13, color: v ? C.g900 : C.g300, fontWeight: 700 }}>{v || "Not set"}</span>
    </div>
  );

  // compute age from DOB
  const calcAge = dob => {
    if (!dob) return null;
    const parts = dob.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (!parts) return null;
    const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    const m = months.indexOf(parts[2].toLowerCase());
    if (m < 0) return null;
    const birth = new Date(parseInt(parts[3]), m, parseInt(parts[1]));
    const now = new Date(2026, 4, 23);
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
    return age;
  };
  const childAge = calcAge(child.dob);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: C.bg, paddingBottom: 90 }}>
      {/* hero banner */}
      <div style={{ background: "linear-gradient(135deg,#3B82F6 0%,#8B5CF6 100%)",
        padding: "36px 20px 28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42, marginBottom: 10, border: "3px solid rgba(255,255,255,.4)" }}>{me.emoji}</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff" }}>{me.name || "Your Name"}</h2>
        <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,.7)", fontSize: 14 }}>{me.email}</p>
        <span style={{ marginTop: 10, background: "rgba(255,255,255,.2)", color: "#fff",
          fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, textTransform: "capitalize" }}>
          {me.role} · Admin
        </span>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── MY DETAILS ── */}
        <Card>
          <SectionHeader title="👤 My Details" section="me" />
          {editSection === "me" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Emoji">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PARENT_EMOJIS.map(e => (
                    <button key={e} onClick={() => setMyEmoji(e)} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 24,
                      cursor: "pointer", border: "2px solid " + (myEmoji === e ? C.blue : C.g200),
                      background: myEmoji === e ? C.blueLight : C.white }}>{e}</button>
                  ))}
                </div>
              </Field>
              <Field label="Full name"><TextInput value={myName} onChange={e => setMyName(e.target.value)} placeholder="Your full name" /></Field>
              <Field label="Email"><TextInput value={myEmail} onChange={e => setMyEmail(e.target.value)} placeholder="Your email" type="email" /></Field>
              <Field label="Role">
                <div style={{ display: "flex", gap: 8 }}>
                  {[["mom","Mom"],["dad","Dad"],["guardian","Guardian"]].map(([v,l]) => (
                    <button key={v} onClick={() => setMyRole(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 11,
                      border: "1.5px solid " + (myRole === v ? C.blue : C.g200),
                      background: myRole === v ? C.blueLight : C.white, color: myRole === v ? C.blue : C.g700,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
                  ))}
                </div>
              </Field>
            </div>
          ) : (
            <>
              <Row l="Name"  v={me.name} />
              <Row l="Email" v={me.email} />
              <Row l="Role"  v={me.role.charAt(0).toUpperCase() + me.role.slice(1)} />
            </>
          )}
        </Card>

        {/* ── CHILD DETAILS ── */}
        <Card>
          <SectionHeader title={`${child.emoji || "🧒"} ${child.name || "Child"}'s Details`} section="child" />
          {editSection === "child" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Emoji">
                <div style={{ display: "flex", gap: 8 }}>
                  {CHILD_EMOJIS.map(e => (
                    <button key={e} onClick={() => setCEmoji(e)} style={{ width: 48, height: 48, borderRadius: 13, fontSize: 26,
                      cursor: "pointer", border: "2px solid " + (cEmoji === e ? C.blue : C.g200),
                      background: cEmoji === e ? C.blueLight : C.white }}>{e}</button>
                  ))}
                </div>
              </Field>
              <Field label="Full name"><TextInput value={cName} onChange={e => setCName(e.target.value)} placeholder="Child's full name" /></Field>
              <Field label="Date of birth"><TextInput value={cDOB} onChange={e => setCDOB(e.target.value)} placeholder="e.g. 15 June 2018" /></Field>
              <Field label="Grade"><TextInput value={cGrade} onChange={e => setCGrade(e.target.value)} placeholder="e.g. Grade 2" /></Field>
              <Field label="School"><TextInput value={cSchool} onChange={e => setCSchool(e.target.value)} placeholder="e.g. Sunshine Primary" /></Field>
              <Field label="Medical conditions"><Textarea value={cMedical} onChange={e => setCMedical(e.target.value)} placeholder={"e.g. ADHD — Ritalin 10mg daily\nAsthma — Ventolin as needed"} rows={3} /></Field>
              <Field label="Allergies"><Textarea value={cAllergy} onChange={e => setCAllergy(e.target.value)} placeholder={"e.g. Penicillin\nPeanuts"} rows={2} /></Field>
            </div>
          ) : (
            <>
              <Row l="Name"    v={child.name} />
              <Row l="DOB"     v={child.dob} />
              <Row l="Age"     v={childAge !== null ? `${childAge} years old` : child.dob ? child.dob : null} />
              <Row l="Grade"   v={child.grade} />
              <Row l="School"  v={child.school} />
              <Row l="Medical" v={child.medical} />
              <Row l="Allergies" v={child.allergy} />
            </>
          )}
        </Card>

        {/* ── CO-PARENT ── */}
        <Card>
          <SectionHeader title="🤝 Co-parent" section="coparent" />
          {editSection === "coparent" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Emoji">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PARENT_EMOJIS.map(e => (
                    <button key={e} onClick={() => setCoEmoji(e)} style={{ width: 44, height: 44, borderRadius: 12, fontSize: 24,
                      cursor: "pointer", border: "2px solid " + (coEmoji === e ? C.blue : C.g200),
                      background: coEmoji === e ? C.blueLight : C.white }}>{e}</button>
                  ))}
                </div>
              </Field>
              <Field label="Full name"><TextInput value={coName} onChange={e => setCoName(e.target.value)} placeholder="Co-parent's full name" /></Field>
              <Field label="Email"><TextInput value={coEmail} onChange={e => setCoEmail(e.target.value)} placeholder="Co-parent's email" type="email" /></Field>
              <Field label="Role">
                <div style={{ display: "flex", gap: 8 }}>
                  {[["dad","Dad"],["mom","Mom"],["guardian","Guardian"]].map(([v,l]) => (
                    <button key={v} onClick={() => setCoRole(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 11,
                      border: "1.5px solid " + (coRole === v ? C.blue : C.g200),
                      background: coRole === v ? C.blueLight : C.white, color: coRole === v ? C.blue : C.g700,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
                  ))}
                </div>
              </Field>
              <Field label="Permissions">
                {[["calendar","Calendar"],["shopping","Shopping list"],["requests","Requests"],["payments","Payments"]].map(([k,l]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingBottom: 10, marginBottom: 10, borderBottom: `1px solid ${C.g100}` }}>
                    <span style={{ fontSize: 14, color: C.g900, fontWeight: 600 }}>{l}</span>
                    <Toggle on={coPerm[k]} onToggle={() => setCoPerm(p => ({ ...p, [k]: !p[k] }))} />
                  </div>
                ))}
              </Field>
            </div>
          ) : coParent.name ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{coParent.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: C.g900 }}>{coParent.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: C.g500 }}>{coParent.email}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12, color: C.green, fontWeight: 700 }}>● Active</p>
                </div>
              </div>
              <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: C.g700 }}>Permissions</p>
              {[["calendar","Calendar"],["shopping","Shopping"],["requests","Requests"],["payments","Payments"]].map(([k,l]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${C.g100}` }}>
                  <span style={{ fontSize: 13, color: C.g700 }}>{l}</span>
                  <span>{coParent.permissions?.[k] ? "✅" : "❌"}</span>
                </div>
              ))}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: C.g500 }}>No co-parent added yet.</p>
              <button onClick={() => setEditSection("coparent")} style={{ background: C.blue, color: "#fff", border: "none",
                borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                + Add Co-parent
              </button>
            </div>
          )}
        </Card>

        {/* ── NOTIFICATIONS ── */}
        <Card>
          <p style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 16, color: C.g900 }}>🔔 Notifications</p>
          {[["events","Calendar events"],["chat","Chat messages"],["requests","Requests & approvals"],["shopping","Shopping updates"]].map(([k,l]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${C.g100}` }}>
              <span style={{ fontSize: 14, color: C.g900, fontWeight: 600 }}>{l}</span>
              <Toggle on={notif[k]} onToggle={() => setNotif(p => ({ ...p, [k]: !p[k] }))} />
            </div>
          ))}
        </Card>

        {/* ── INVITE ── */}
        <InviteCard profile={profile} coParent={coParent} />

        <button onClick={onLogout} style={{ background: C.redLight, color: C.red, border: `1.5px solid #FECACA`,
          borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Sign Out
        </button>

        <button onClick={() => { if (window.confirm("This will clear all your saved data and reset the app. Are you sure?")) onDeleteAccount(); }}
          style={{ background: "none", color: C.g400, border: `1px solid ${C.g200}`,
            borderRadius: 14, padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Reset & delete account data
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INVITE WELCOME SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function InviteWelcomeScreen({ data = {}, onAccept }) {
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#3B82F6 0%,#8B5CF6 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:28, textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:24, background:"rgba(255,255,255,.2)",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:42,
        marginBottom:20, border:"3px solid rgba(255,255,255,.3)" }}>
        {data.childEmoji || "🧒"}
      </div>
      <h1 style={{ margin:"0 0 8px", fontSize:28, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>You're invited!</h1>
      <p style={{ margin:"0 0 6px", fontSize:16, color:"rgba(255,255,255,.85)" }}>{data.invitedBy || "Someone"} has shared</p>
      <p style={{ margin:"0 0 28px", fontSize:22, fontWeight:800, color:"#fff" }}>{data.childName || "their child"}'s schedule</p>
      <div style={{ background:"rgba(255,255,255,.15)", borderRadius:18, padding:"16px 20px",
        width:"100%", maxWidth:320, marginBottom:28 }}>
        {[
          data.childGrade  && ["📚 Grade",  data.childGrade],
          data.childSchool && ["🏫 School", data.childSchool],
          ["👤 Invited by", data.invitedBy || "—"],
        ].filter(Boolean).map(([l,v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between",
            paddingBottom:10, marginBottom:10, borderBottom:"1px solid rgba(255,255,255,.15)" }}>
            <span style={{ fontSize:13, color:"rgba(255,255,255,.7)", fontWeight:600 }}>{l}</span>
            <span style={{ fontSize:13, color:"#fff", fontWeight:800 }}>{v}</span>
          </div>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:8, paddingTop:4 }}>
          <span style={{ fontSize:20 }}>🔒</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,.8)", lineHeight:1.5 }}>View-only access. Your data is always safe.</span>
        </div>
      </div>
      <button onClick={onAccept} style={{ width:"100%", maxWidth:320, padding:"16px",
        borderRadius:16, border:"none", background:"#fff", color:C.blue, fontSize:16,
        fontWeight:900, cursor:"pointer", fontFamily:"inherit",
        boxShadow:"0 8px 24px rgba(0,0,0,.2)", marginBottom:14 }}>
        Open KidSync 🚀
      </button>
      <p style={{ margin:0, fontSize:13, color:"rgba(255,255,255,.6)" }}>You'll be asked to create your own account</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAV BAR
// ══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id: "home",     icon: "🏠", label: "Home" },
  { id: "calendar", icon: "📅", label: "Calendar" },
  { id: "chat",     icon: "💬", label: "Chat" },
  { id: "requests", icon: "📋", label: "Requests" },
  { id: "profile",  icon: "👤", label: "Profile" },
];

function NavBar({ active, onNavigate, unread }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
      background: C.white, borderTop: `1px solid ${C.g200}`, display: "flex", zIndex: 50 }}>
      {NAV.map(n => (
        <button key={n.id} onClick={() => onNavigate(n.id)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "10px 0", border: "none",
          background: "transparent", cursor: "pointer", gap: 3, fontFamily: "inherit" }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            {unread[n.id] > 0 && (
              <div style={{ position: "absolute", top: -4, right: -6, background: C.red, color: "#fff",
                borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + C.white }}>
                {unread[n.id]}
              </div>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: active === n.id ? C.blue : C.g400 }}>{n.label}</span>
          {active === n.id && <div style={{ width: 20, height: 3, borderRadius: 2, background: C.blue, marginTop: 1 }} />}
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT — with localStorage persistence
// ══════════════════════════════════════════════════════════════════════════════
const EMPTY_PROFILE = {
  me:       { name: "", email: "", emoji: "👩", role: "mom" },
  child:    { name: "", dob: "", grade: "", school: "", gender: "girl", emoji: "👧", medical: "", allergy: "" },
  coParent: { name: "", email: "", emoji: "👨", role: "dad", permissions: { calendar: true, shopping: true, requests: true, payments: false } },
};

const STORAGE_KEY = "kidsync_profile_v1";

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToStorage(profile) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); } catch {}
}

export default function App() {
  const saved = loadSaved();

  // Check for invite link param
  const urlParams = new URLSearchParams(window.location.search);
  const inviteParam = urlParams.get("invite");
  let inviteData = null;
  if (inviteParam) {
    try { inviteData = JSON.parse(decodeURIComponent(escape(atob(inviteParam)))); } catch {}
  }

  // if saved profile exists skip onboarding, go straight to app
  const [stage,   setStage]   = useState(inviteData ? "invited" : saved ? "app" : "login");
  const [screen,  setScreen]  = useState("home");
  const [profile, setProfile] = useState(saved || EMPTY_PROFILE);

  const handleLogin   = () => setStage("onboarding");
  const handleOnboard = (data) => {
    saveToStorage(data);
    setProfile(data);
    setStage("app");
    setScreen("home");
  };
  const handleLogout = () => {
    // keeps profile saved — just returns to login
    setStage("login");
    setScreen("home");
  };
  const handleUpdateProfile = (updated) => {
    saveToStorage(updated);
    setProfile(updated);
  };
  const handleDeleteAccount = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setProfile(EMPTY_PROFILE);
    setStage("login");
    setScreen("home");
  };

  const isAdmin = true; // current user is always the admin in this session
  const [events, setEvents] = useState(INIT_EVENTS);
  const unread  = { home: 0, calendar: 0, chat: 2, requests: 3, profile: 0 };

  const wrap = (child) => (
    <div style={{ fontFamily: "'Nunito', sans-serif", display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden", maxWidth: 480, margin: "0 auto",
      background: C.white, boxShadow: "0 0 40px rgba(0,0,0,.12)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      {child}
    </div>
  );

  if (stage === "login")      return wrap(<LoginScreen onLogin={handleLogin} />);
  if (stage === "onboarding") return wrap(<OnboardingScreen onComplete={handleOnboard} />);
  if (stage === "invited")    return wrap(<InviteWelcomeScreen data={inviteData} onAccept={()=>setStage("login")} />);

  const screens = {
    home:     <HomeScreen     onNavigate={setScreen} profile={profile} events={events} />,
    calendar: <CalendarScreen isAdmin={isAdmin} profile={profile} events={events} setEvents={setEvents} />,
    shopping: <ShoppingScreen />,
    chat:     <ChatScreen     profile={profile} />,
    requests: <RequestsScreen />,
    profile:  <ProfileScreen  profile={profile} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />,
  };

  return wrap(<>
    {screens[screen] || screens.home}
    <NavBar active={screen} onNavigate={setScreen} unread={unread} />
  </>);
}
