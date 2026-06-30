import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Home, MapPin, Bell, Search, Mic, Navigation, Clock, Star,
  ChevronRight, ArrowLeft, X, Check, User, Settings, HelpCircle,
  LogOut, AlertTriangle, Info, Bookmark, Plus, Share2,
  ChevronDown, Users, Award, CheckCircle, RefreshCw,
  Wallet, TrendingUp, Zap, Phone, Heart, Map,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | "splash" | "onboarding" | "login" | "otp" | "location"
  | "home" | "search" | "routeResults" | "routeDetails"
  | "liveTracking" | "boarding" | "journey" | "arrived"
  | "alerts" | "saved" | "profile";

type NavCtx = { navigate: (s: Screen) => void; goBack: () => void };
const Nav = createContext<NavCtx>({ navigate: () => {}, goBack: () => {} });
const useNav = () => useContext(Nav);

// ─── Constants ────────────────────────────────────────────────────────────────

const F = "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',Inter,sans-serif";

const sh = {
  card: "0 2px 16px rgba(26,29,41,0.07)",
  float: "0 8px 32px rgba(26,29,41,0.1)",
  btn: "0 4px 20px rgba(91,108,255,0.35)",
};

// ─── Shared primitives ────────────────────────────────────────────────────────

function StatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  });
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"));
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const c = dark ? "#fff" : "#1A1D29";
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", paddingTop: 14, fontFamily: F }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: c }}>{time}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          {[0,1,2,3].map(i => <rect key={i} x={i*4.5} y={11-(i+1)*2.5} width="3" height={(i+1)*2.5} rx="0.7" fill={c} fillOpacity={0.35+i*0.2} />)}
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <circle cx="7.5" cy="9.5" r="1.3" fill={c} />
          <path d="M4.5 7C5.4 6.1 6.4 5.6 7.5 5.6s3.1 1.4 3 1.4" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
          <path d="M2 4.5C3.6 2.8 5.4 2 7.5 2s5 1.8 5.5 2.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x=".5" y=".5" width="21" height="11" rx="2.5" stroke={c} strokeOpacity=".35"/>
          <rect x="2" y="2" width="14" height="8" rx="1.5" fill={c}/>
          <path d="M23 4v4a2 2 0 000-4z" fill={c} fillOpacity=".4"/>
        </svg>
      </div>
    </div>
  );
}

function BottomNav({ active, onTab }: { active: string; onTab: (t: Screen) => void }) {
  const tabs: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home size={22} /> },
    { id: "liveTracking", label: "Live", icon: <Navigation size={22} /> },
    { id: "alerts", label: "Alerts", icon: <Bell size={22} /> },
    { id: "saved", label: "Saved", icon: <Bookmark size={22} /> },
    { id: "profile", label: "Profile", icon: <User size={22} /> },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "#fff", borderTop: "1px solid #E8ECF5", display: "flex", alignItems: "center", fontFamily: F, paddingBottom: 12 }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "none", background: "none", cursor: "pointer", padding: "8px 0", color: isActive ? "#5B6CFF" : "#5F6678", transition: "color 0.2s" }}>
            <div style={{ position: "relative" }}>
              {t.icon}
              {t.id === "alerts" && (
                <span style={{ position: "absolute", top: -2, right: -4, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: "1.5px solid #fff" }} />
              )}
            </div>
            <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>{t.label}</span>
            {isActive && <span style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, borderRadius: 2, background: "#5B6CFF" }} />}
          </button>
        );
      })}
    </div>
  );
}

function PrimaryBtn({ label, onClick, style }: { label: string; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "17px 24px", borderRadius: 100, border: "none", background: "linear-gradient(135deg,#7385FF,#5B6CFF)", color: "#fff", fontSize: 17, fontWeight: 600, fontFamily: F, cursor: "pointer", boxShadow: sh.btn, letterSpacing: "-0.2px", ...style }}>
      {label}
    </button>
  );
}

function GhostBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: "17px 24px", borderRadius: 100, border: "1.5px solid #E8ECF5", background: "transparent", color: "#5F6678", fontSize: 17, fontWeight: 500, fontFamily: F, cursor: "pointer" }}>
      {label}
    </button>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: sh.card, padding: 16, ...style }}>
      {children}
    </div>
  );
}

function LiveBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#ECFDF5", color: "#16C47F", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 100, fontFamily: F, letterSpacing: "0.3px" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16C47F", display: "inline-block" }} />
      LIVE
    </span>
  );
}

function AiBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#EEF0FF", color: "#5B6CFF", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 100, fontFamily: F }}>
      <Zap size={11} /> AI Pick
    </span>
  );
}

function OccupancyDots({ level }: { level: "low" | "medium" | "high" }) {
  const colors = { low: "#16C47F", medium: "#F4B400", high: "#EF4444" };
  const filled = { low: 1, medium: 2, high: 3 };
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < filled[level] ? colors[level] : "#E8ECF5" }} />
      ))}
    </span>
  );
}

// ─── City Map SVG ─────────────────────────────────────────────────────────────

function MiniMap() {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
      <svg width="100%" viewBox="0 0 361 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="361" height="180" fill="#EBF0FF"/>
        {/* Building blocks */}
        {[[10,10,60,40],[80,10,55,35],[145,8,50,38],[205,12,60,34],[275,10,50,36],[320,8,35,40],
          [10,60,45,35],[65,58,40,38],[115,62,55,32],[180,58,48,36],[238,60,52,34],[300,58,55,36],
          [10,110,52,38],[72,112,45,34],[127,108,58,36],[195,110,50,36],[255,112,48,32],[313,108,40,36],
          [10,158,55,18],[74,160,48,16],[132,156,52,20],[194,158,55,18],[259,162,48,14],[317,158,38,18]
        ].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx={4} fill="#D8E2F8" />)}
        {/* Streets */}
        <line x1="0" y1="55" x2="361" y2="55" stroke="#C8D4EE" strokeWidth="8"/>
        <line x1="0" y1="105" x2="361" y2="105" stroke="#C8D4EE" strokeWidth="8"/>
        <line x1="0" y1="152" x2="361" y2="152" stroke="#C8D4EE" strokeWidth="6"/>
        <line x1="70" y1="0" x2="70" y2="180" stroke="#C8D4EE" strokeWidth="6"/>
        <line x1="170" y1="0" x2="170" y2="180" stroke="#C8D4EE" strokeWidth="6"/>
        <line x1="270" y1="0" x2="270" y2="180" stroke="#C8D4EE" strokeWidth="6"/>
        {/* Route line */}
        <polyline points="30,105 70,105 70,55 170,55 270,55 270,105 361,105" stroke="#5B6CFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="0"/>
        {/* Stops */}
        {[[70,105],[70,55],[170,55],[270,55],[270,105]].map(([x,y],i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={6} fill="#fff" stroke="#5B6CFF" strokeWidth="2"/>
          </g>
        ))}
        {/* Current location */}
        <circle cx={170} cy={55} r={10} fill="#5B6CFF" fillOpacity="0.15">
          <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="fill-opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={170} cy={55} r={6} fill="#5B6CFF"/>
        <circle cx={170} cy={55} r={3} fill="#fff"/>
        {/* Bus marker */}
        <g transform="translate(270,55)">
          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#F4B400"/>
          <text x="0" y="5" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700" fontFamily={F}>507</text>
        </g>
        <g transform="translate(120,105)">
          <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#16C47F"/>
          <text x="0" y="5" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700" fontFamily={F}>310</text>
        </g>
      </svg>
    </div>
  );
}

function FullMap({ showRoute = true, animated = true }: { showRoute?: boolean; animated?: boolean }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 393 380" fill="none">
      <rect width="393" height="380" fill="#E8EEFB"/>
      {/* Building blocks */}
      {[[8,8,70,45],[88,8,60,40],[158,10,65,42],[233,8,70,42],[313,8,72,40],
        [8,68,55,40],[73,70,60,38],[143,66,65,42],[218,68,60,38],[288,68,95,40],
        [8,125,65,45],[83,127,60,42],[153,123,70,45],[233,127,60,40],[303,125,82,42],
        [8,186,60,40],[78,188,65,36],[153,184,72,42],[235,188,60,38],[305,184,80,42],
        [8,244,58,42],[76,246,65,38],[151,242,73,44],[234,246,60,38],[304,242,81,44],
        [8,302,55,40],[73,304,60,38],[143,300,68,42],[221,302,62,40],[293,300,92,42]
      ].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx={5} fill="#C9D6EE"/>)}
      {/* Streets */}
      <line x1="0" y1="62" x2="393" y2="62" stroke="#B8C8E0" strokeWidth="10"/>
      <line x1="0" y1="120" x2="393" y2="120" stroke="#B8C8E0" strokeWidth="10"/>
      <line x1="0" y1="178" x2="393" y2="178" stroke="#B8C8E0" strokeWidth="10"/>
      <line x1="0" y1="236" x2="393" y2="236" stroke="#B8C8E0" strokeWidth="10"/>
      <line x1="0" y1="294" x2="393" y2="294" stroke="#B8C8E0" strokeWidth="10"/>
      <line x1="70" y1="0" x2="70" y2="380" stroke="#B8C8E0" strokeWidth="8"/>
      <line x1="150" y1="0" x2="150" y2="380" stroke="#B8C8E0" strokeWidth="8"/>
      <line x1="230" y1="0" x2="230" y2="380" stroke="#B8C8E0" strokeWidth="8"/>
      <line x1="310" y1="0" x2="310" y2="380" stroke="#B8C8E0" strokeWidth="8"/>
      {/* Route */}
      {showRoute && (
        <polyline
          points="70,294 70,236 150,236 150,178 230,178 230,120 310,120 310,62"
          stroke="#5B6CFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {/* Route stops */}
      {showRoute && [[70,294],[70,236],[150,236],[150,178],[230,178],[230,120],[310,120],[310,62]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={7} fill="#fff" stroke="#5B6CFF" strokeWidth="2.5"/>
        </g>
      ))}
      {/* Origin pin */}
      {showRoute && (
        <g>
          <circle cx={70} cy={294} r={14} fill="#5B6CFF" fillOpacity="0.15">
            {animated && <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite"/>}
          </circle>
          <circle cx={70} cy={294} r={8} fill="#5B6CFF"/>
          <circle cx={70} cy={294} r={3.5} fill="#fff"/>
        </g>
      )}
      {/* Destination pin */}
      {showRoute && (
        <g>
          <circle cx={310} cy={62} r={10} fill="#EF4444" fillOpacity="0.2"/>
          <circle cx={310} cy={62} r={6} fill="#EF4444"/>
          <circle cx={310} cy={62} r={2.5} fill="#fff"/>
        </g>
      )}
      {/* Bus marker animated */}
      {animated && (
        <g>
          <circle cx={230} cy={120} r={16} fill="#5B6CFF" fillOpacity="0.12"/>
          <rect x={216} y={113} width={28} height={14} rx={5} fill="#5B6CFF"/>
          <text x={230} y={124} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700" fontFamily={F}>507</text>
          <circle cx={220} cy={127} r={2.5} fill="#1A1D29"/>
          <circle cx={240} cy={127} r={2.5} fill="#1A1D29"/>
        </g>
      )}
    </svg>
  );
}

// ─── Illustrations ────────────────────────────────────────────────────────────

function IllustrationBusStop() {
  return (
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
      {/* Sky bg */}
      <rect width="240" height="200" fill="#EEF2FF" rx="20"/>
      {/* Ground */}
      <rect y="150" width="240" height="50" fill="#E0E7FF" rx="0"/>
      {/* Bus stop pole */}
      <rect x="55" y="60" width="6" height="90" rx="3" fill="#5B6CFF"/>
      {/* Bus stop sign */}
      <rect x="35" y="50" width="46" height="28" rx="8" fill="#5B6CFF"/>
      <text x="58" y="69" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily={F}>BUS</text>
      {/* Person */}
      <circle cx="100" cy="80" r="14" fill="#FFD1B5"/>
      <rect x="88" y="94" width="24" height="40" rx="8" fill="#7385FF"/>
      <rect x="80" y="98" width="10" height="28" rx="5" fill="#7385FF"/>
      <rect x="112" y="98" width="10" height="28" rx="5" fill="#7385FF"/>
      <rect x="89" y="132" width="10" height="22" rx="5" fill="#1A1D29"/>
      <rect x="101" y="132" width="10" height="22" rx="5" fill="#1A1D29"/>
      {/* Bus approaching */}
      <rect x="145" y="95" width="85" height="48" rx="10" fill="#5B6CFF"/>
      <rect x="150" y="100" width="22" height="16" rx="4" fill="#B8C8FF"/>
      <rect x="177" y="100" width="22" height="16" rx="4" fill="#B8C8FF"/>
      <rect x="204" y="100" width="22" height="16" rx="4" fill="#B8C8FF"/>
      <circle cx="162" cy="148" r="8" fill="#1A1D29"/>
      <circle cx="162" cy="148" r="4" fill="#5F6678"/>
      <circle cx="215" cy="148" r="8" fill="#1A1D29"/>
      <circle cx="215" cy="148" r="4" fill="#5F6678"/>
      {/* Route dots */}
      {[115,125,135].map((x,i) => <circle key={i} cx={x} cy={120} r={4} fill="#5B6CFF" fillOpacity={0.4+i*0.2}/>)}
    </svg>
  );
}

function IllustrationMap() {
  return (
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
      <rect width="240" height="200" fill="#EEF2FF" rx="20"/>
      {/* Map grid */}
      {[40,80,120,160].map(y => <line key={y} x1="20" y1={y} x2="220" y2={y} stroke="#C8D4F0" strokeWidth="2"/>)}
      {[60,100,140,180].map(x => <line key={x} x1={x} y1="20" x2={x} y2="180" stroke="#C8D4F0" strokeWidth="2"/>)}
      {/* Route */}
      <polyline points="30,160 60,160 60,120 100,120 100,80 140,80 140,40 200,40" stroke="#5B6CFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Bus markers */}
      {[[60,120],[140,80]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={12} fill="#5B6CFF"/>
          <text x={x} y={y+4} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700" fontFamily={F}>BUS</text>
        </g>
      ))}
      {/* Current loc */}
      <circle cx={100} cy={120} r={14} fill="#16C47F" fillOpacity="0.2"/>
      <circle cx={100} cy={120} r={8} fill="#16C47F"/>
      <circle cx={100} cy={120} r={3} fill="#fff"/>
    </svg>
  );
}

function IllustrationSuccess() {
  return (
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none">
      <rect width="240" height="200" fill="#EEF2FF" rx="20"/>
      {/* Circle bg */}
      <circle cx="120" cy="100" r="70" fill="#5B6CFF" fillOpacity="0.1"/>
      <circle cx="120" cy="100" r="50" fill="#5B6CFF" fillOpacity="0.15"/>
      {/* Check circle */}
      <circle cx="120" cy="100" r="36" fill="#5B6CFF"/>
      <polyline points="103,100 116,113 140,88" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Stars */}
      {[[40,40],[200,40],[40,160],[200,160],[160,50],[80,160]].map(([x,y],i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={i%2===0?14:10} fill="#F4B400">★</text>
      ))}
    </svg>
  );
}

function IllustrationLocation() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
      <rect width="220" height="200" fill="#EEF2FF" rx="20"/>
      {/* Pulse circles */}
      <circle cx="110" cy="110" r="70" fill="#5B6CFF" fillOpacity="0.06"/>
      <circle cx="110" cy="110" r="50" fill="#5B6CFF" fillOpacity="0.08"/>
      <circle cx="110" cy="110" r="30" fill="#5B6CFF" fillOpacity="0.12"/>
      {/* Pin */}
      <ellipse cx="110" cy="160" rx="20" ry="5" fill="#1A1D29" fillOpacity="0.1"/>
      <path d="M110 155 L110 130" stroke="#5B6CFF" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="110" cy="115" r="22" fill="#5B6CFF"/>
      <circle cx="110" cy="115" r="10" fill="#fff"/>
      <circle cx="110" cy="115" r="5" fill="#5B6CFF"/>
    </svg>
  );
}

function IllustrationCelebration() {
  return (
    <svg width="220" height="180" viewBox="0 0 220 180" fill="none">
      <circle cx="110" cy="90" r="65" fill="#EEF2FF"/>
      <circle cx="110" cy="90" r="44" fill="#5B6CFF" fillOpacity="0.1"/>
      <circle cx="110" cy="90" r="32" fill="#16C47F"/>
      <polyline points="95,90 107,102 130,78" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {["#F4B400","#5B6CFF","#EF4444","#16C47F","#00C2A8","#F4B400"].map((c,i) => {
        const angle = (i/6)*Math.PI*2-Math.PI/2;
        const r=70, x=110+r*Math.cos(angle), y=90+r*Math.sin(angle);
        return <rect key={i} x={x-5} y={y-5} width={10} height={10} rx={3} fill={c} transform={`rotate(${i*30} ${x} ${y})`}/>;
      })}
    </svg>
  );
}

// ─── Screen: Splash ───────────────────────────────────────────────────────────

function SplashScreen() {
  const { navigate } = useNav();
  const [phase, setPhase] = useState<"in" | "fade">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 2600);
    const t2 = setTimeout(() => navigate("onboarding"), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: F, opacity: phase === "fade" ? 0 : 1, transition: "opacity 1s ease-out" }}>
      <style>{`
        @keyframes splashDrawRoute { from{stroke-dashoffset:80}to{stroke-dashoffset:0} }
        @keyframes splashFadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes splashDot { 0%,60%,100%{transform:translateY(0);opacity:.35}28%{transform:translateY(-5px);opacity:.9} }
      `}</style>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}><StatusBar /></div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ animation: "splashFadeUp .45s ease-out .05s both" }}>
          <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style={{ borderRadius: 22, boxShadow: "0 16px 48px rgba(26,29,41,0.2)" }}>
            <rect width="88" height="88" rx="22" fill="#1A1D29"/>
            {[38,52,66].map(y => <line key={y} x1="0" y1={y} x2="88" y2={y} stroke="#fff" strokeOpacity=".04" strokeWidth="1"/>)}
            {[18,44,70].map(x => <line key={x} x1={x} y1="0" x2={x} y2="88" stroke="#fff" strokeOpacity=".04" strokeWidth="1"/>)}
            <path id="sp" d="M18 66 L18 38 L70 38" stroke="#5B6CFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="80" strokeDashoffset="80" style={{ animation: "splashDrawRoute 1.5s linear .3s forwards" }}/>
            {[[18,66,.3],[18,38,1.0],[70,38,1.6]].map(([cx,cy,d],i) => (
              <circle key={i} cx={cx} cy={cy} r={3.5} fill="none" stroke="#5B6CFF" strokeWidth="2" opacity={0} style={{ animation: `splashFadeUp .28s ease-out ${d}s forwards`, transformBox:"fill-box" as never, transformOrigin:"center" }}/>
            ))}
            <g>
              <animateMotion dur="1.5s" begin="0.3s" fill="freeze" calcMode="linear" rotate="auto"><mpath href="#sp"/></animateMotion>
              <rect x="-7.5" y="-4.5" width="15" height="9" rx="2.5" fill="white"/>
              <rect x="5" y="-3" width="2.5" height="6" rx="1.2" fill="#5B6CFF"/>
            </g>
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.5px", lineHeight: 1, animation: "splashFadeUp .45s ease-out .2s both" }}>Raah</span>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#5F6678", animation: "splashFadeUp .45s ease-out .3s both" }}>Moving Cities Smarter</span>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 7, animation: "splashFadeUp .5s ease-out .5s both" }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#1A1D29", display: "block", animation: `splashDot 1.3s ease-in-out ${i*.18}s infinite` }}/>)}
      </div>
    </div>
  );
}

// ─── Screen: Onboarding ───────────────────────────────────────────────────────

const onboardingSlides = [
  { headline: "Know exactly when your bus arrives.", sub: "Real-time ETAs so you never wait in the dark.", Illus: IllustrationBusStop },
  { headline: "Track buses live with intelligent predictions.", sub: "AI-powered estimates that adapt to traffic in real time.", Illus: IllustrationMap },
  { headline: "Travel smarter with AI recommendations.", sub: "Personalised routes that save time and money every day.", Illus: IllustrationSuccess },
];

function OnboardingScreen() {
  const { navigate } = useNav();
  const [step, setStep] = useState(0);
  const slide = onboardingSlides[step];
  const Illus = slide.Illus;
  const isLast = step === 2;

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 24px 0" }}>
        <button onClick={() => navigate("login")} style={{ background: "none", border: "none", color: "#5F6678", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Skip</button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", gap: 36 }}>
        <div style={{ width: 240, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Illus />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#1A1D29", lineHeight: 1.25, letterSpacing: "-0.4px", margin: "0 0 12px" }}>{slide.headline}</p>
          <p style={{ fontSize: 16, color: "#5F6678", lineHeight: 1.55, margin: 0 }}>{slide.sub}</p>
        </div>
      </div>

      <div style={{ padding: "0 24px 48px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ height: 6, borderRadius: 3, background: i === step ? "#5B6CFF" : "#E8ECF5", width: i === step ? 24 : 8, transition: "all .3s" }}/>
          ))}
        </div>
        {isLast ? (
          <PrimaryBtn label="Get Started" onClick={() => navigate("login")} />
        ) : (
          <PrimaryBtn label="Next" onClick={() => setStep(s => s + 1)} />
        )}
      </div>
    </div>
  );
}

// ─── Screen: Login ────────────────────────────────────────────────────────────

function LoginScreen() {
  const { navigate } = useNav();
  const [phone, setPhone] = useState("");

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ flex: 1, padding: "32px 24px 48px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#5B6CFF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9,22 9,12 15,12 15,22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1A1D29", margin: "0 0 8px", letterSpacing: "-0.4px" }}>Welcome to Raah</h1>
          <p style={{ fontSize: 16, color: "#5F6678", margin: 0, lineHeight: 1.5 }}>Enter your phone number to get started.</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#5F6678", letterSpacing: "0.3px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Phone Number</label>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 72, height: 56, borderRadius: 14, background: "#fff", border: "1.5px solid #E8ECF5", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <span style={{ fontSize: 18 }}>🇮🇳</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1D29" }}>+91</span>
            </div>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="98765 43210"
              type="tel"
              style={{ flex: 1, height: 56, borderRadius: 14, border: "1.5px solid #E8ECF5", background: "#fff", padding: "0 16px", fontSize: 17, fontFamily: F, color: "#1A1D29", outline: "none" }}
            />
          </div>
        </div>

        <PrimaryBtn label="Continue" onClick={() => navigate("otp")} style={{ marginBottom: 20 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#E8ECF5" }} />
          <span style={{ fontSize: 13, color: "#5F6678" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#E8ECF5" }} />
        </div>

        <button style={{ width: "100%", height: 56, borderRadius: 100, border: "1.5px solid #E8ECF5", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 20 20"><path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.4a4.61 4.61 0 01-2 3.02v2.5h3.22c1.89-1.74 2.98-4.3 2.98-7.31z" fill="#4285F4"/><path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.22-2.5c-.9.6-2.04.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H1.07v2.58A10 10 0 0010 20z" fill="#34A853"/><path d="M4.4 11.92A5.96 5.96 0 014.1 10c0-.67.12-1.32.3-1.92V5.5H1.07A10 10 0 000 10c0 1.61.38 3.14 1.07 4.5l3.33-2.58z" fill="#FBBC05"/><path d="M10 3.96a5.41 5.41 0 013.82 1.5l2.86-2.86A9.58 9.58 0 0010 0 10 10 0 001.07 5.5L4.4 8.08C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335"/></svg>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#1A1D29", fontFamily: F }}>Sign in with Google</span>
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#5F6678", marginTop: "auto", lineHeight: 1.6 }}>
          By continuing you agree to our{" "}
          <span style={{ color: "#5B6CFF", fontWeight: 500 }}>Terms of Service</span> and{" "}
          <span style={{ color: "#5B6CFF", fontWeight: 500 }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

// ─── Screen: OTP ──────────────────────────────────────────────────────────────

function OTPScreen() {
  const { navigate, goBack } = useNav();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(28);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown === 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleInput = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ flex: 1, padding: "16px 24px 48px", display: "flex", flexDirection: "column" }}>
        <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#1A1D29", fontSize: 16, fontWeight: 500, marginBottom: 32 }}>
          <ArrowLeft size={20} /> Back
        </button>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1A1D29", margin: "0 0 8px", letterSpacing: "-0.4px" }}>Verify your number</h1>
          <p style={{ fontSize: 15, color: "#5F6678", margin: 0 }}>We sent a 6-digit OTP to <strong style={{ color: "#1A1D29" }}>+91 98765 43210</strong></p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          {otp.map((v, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              value={v}
              onChange={e => handleInput(i, e.target.value)}
              maxLength={1}
              type="tel"
              style={{ flex: 1, height: 62, textAlign: "center", fontSize: 24, fontWeight: 700, fontFamily: F, color: "#1A1D29", borderRadius: 14, border: v ? "2px solid #5B6CFF" : "1.5px solid #E8ECF5", background: "#fff", outline: "none" }}
            />
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "#5F6678", marginBottom: 28 }}>
          {countdown > 0 ? (
            <>Resend in <strong style={{ color: "#1A1D29" }}>0:{String(countdown).padStart(2, "0")}</strong></>
          ) : (
            <button onClick={() => setCountdown(30)} style={{ background: "none", border: "none", color: "#5B6CFF", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Resend OTP</button>
          )}
        </p>

        <PrimaryBtn label="Verify" onClick={() => navigate("location")} />
      </div>
    </div>
  );
}

// ─── Screen: Location Permission ──────────────────────────────────────────────

function LocationScreen() {
  const { navigate } = useNav();
  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px 48px", gap: 28, textAlign: "center" }}>
        <IllustrationLocation />
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1A1D29", margin: "0 0 10px", letterSpacing: "-0.4px" }}>Allow location access</h1>
          <p style={{ fontSize: 16, color: "#5F6678", margin: 0, lineHeight: 1.55 }}>
            Raah uses your location to show nearby buses, real-time ETAs, and personalised route suggestions.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, width: "100%", flexDirection: "column" }}>
          {[["📍 Nearby buses & stops"], ["🎯 Live route tracking"], ["🤖 AI-powered suggestions"]].map(([t], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "#EEF0FF", borderRadius: 12, padding: "10px 14px" }}>
              <span style={{ fontSize: 14, color: "#5B6CFF" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 24px 48px", display: "flex", flexDirection: "column", gap: 12 }}>
        <PrimaryBtn label="Allow Location" onClick={() => navigate("home")} />
        <GhostBtn label="Maybe Later" onClick={() => navigate("home")} />
      </div>
    </div>
  );
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────

const nearbyBuses = [
  { num: "507", dest: "Andheri Stn (W)", eta: 3, occ: "low" as const, fare: "₹12", status: "On time" },
  { num: "310", dest: "Churchgate", eta: 7, occ: "medium" as const, fare: "₹18", status: "On time" },
  { num: "AC71", dest: "BKC", eta: 11, occ: "high" as const, fare: "₹35", status: "Delayed 4m" },
  { num: "221", dest: "Dadar (W)", eta: 14, occ: "low" as const, fare: "₹15", status: "On time" },
];

function HomeScreen() {
  const { navigate } = useNav();
  const [tab, setTab] = useState<Screen>("home");

  const handleTab = (t: Screen) => {
    if (t !== "home") navigate(t);
    setTab(t);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "#fff", paddingBottom: 12 }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#5F6678" }}>Good morning ☀️</p>
            <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.3px" }}>Arjun Sharma</h2>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F3FA", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <Bell size={20} color="#1A1D29" />
              <span style={{ position: "absolute", top: 8, right: 9, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff" }} />
            </button>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#7385FF,#5B6CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>AS</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "8px 20px 0", display: "flex", alignItems: "center", gap: 6 }}>
          <MapPin size={14} color="#5B6CFF" />
          <span style={{ fontSize: 13, color: "#5F6678" }}>Bandra West, Mumbai</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {/* Search */}
        <div style={{ padding: "16px 20px 0" }}>
          <button onClick={() => navigate("search")} style={{ width: "100%", height: 54, borderRadius: 16, background: "#fff", border: "1.5px solid #E8ECF5", display: "flex", alignItems: "center", gap: 12, padding: "0 16px", cursor: "pointer", boxShadow: sh.card }}>
            <Search size={20} color="#5F6678" />
            <span style={{ flex: 1, textAlign: "left", fontSize: 16, color: "#5F6678", fontFamily: F }}>Where to?</span>
            <Mic size={18} color="#5B6CFF" />
          </button>
        </div>

        {/* Quick destinations */}
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {[{ icon: "🏠", label: "Home", sub: "Bandra" }, { icon: "💼", label: "Work", sub: "BKC" }, { icon: "🎓", label: "College", sub: "Andheri" }, { icon: "⭐", label: "Saved", sub: "Places" }].map(({ icon, label, sub }) => (
              <button key={label} onClick={() => navigate("routeResults")} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #E8ECF5", borderRadius: 14, padding: "10px 14px", cursor: "pointer", boxShadow: sh.card }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1A1D29" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mini map */}
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: sh.card, position: "relative" }}>
            <MiniMap />
            <button onClick={() => navigate("liveTracking")} style={{ position: "absolute", bottom: 12, right: 12, background: "#5B6CFF", border: "none", borderRadius: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: sh.btn }}>
              <Map size={14} color="#fff" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: F }}>Full Map</span>
            </button>
            <div style={{ position: "absolute", top: 12, left: 12 }}>
              <LiveBadge />
            </div>
          </div>
        </div>

        {/* Nearby stops */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.2px" }}>Nearby Stops</h3>
            <button style={{ background: "none", border: "none", color: "#5B6CFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all</button>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {[{ name: "Bandra Station", dist: "80m", lines: 8 }, { name: "Turner Road", dist: "200m", lines: 5 }, { name: "Linking Road", dist: "350m", lines: 12 }].map(({ name, dist, lines }) => (
              <div key={name} style={{ flexShrink: 0, background: "#fff", borderRadius: 16, padding: "12px 14px", boxShadow: sh.card, minWidth: 130 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "#EEF0FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <MapPin size={16} color="#5B6CFF" />
                </div>
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#1A1D29" }}>{name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>{dist} · {lines} routes</p>
              </div>
            ))}
          </div>
        </div>

        {/* Route cards */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.2px" }}>Nearby Buses</h3>
            <button style={{ background: "none", border: "none", color: "#5B6CFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>See all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {nearbyBuses.map(bus => (
              <button key={bus.num} onClick={() => navigate("routeDetails")} style={{ background: "#fff", borderRadius: 20, padding: "14px 16px", boxShadow: sh.card, border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#7385FF,#5B6CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", fontFamily: F }}>{bus.num}</span>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 600, color: "#1A1D29" }}>{bus.dest}</p>
                      <p style={{ margin: 0, fontSize: 12, color: bus.status.startsWith("Delayed") ? "#EF4444" : "#16C47F", fontWeight: 500 }}>{bus.status}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 2px", fontSize: 20, fontWeight: 700, color: "#5B6CFF" }}>{bus.eta}<span style={{ fontSize: 12, fontWeight: 500, color: "#5F6678" }}> min</span></p>
                    <LiveBadge />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #F0F3FA" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ fontSize: 13, color: "#5F6678" }}>🎫 {bus.fare}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#5F6678" }}>
                      <Users size={13} /> <OccupancyDots level={bus.occ} />
                    </span>
                  </div>
                  <ChevronRight size={16} color="#5F6678" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" onTab={handleTab} />
    </div>
  );
}

// ─── Screen: Search ───────────────────────────────────────────────────────────

const popular = [
  { name: "Chhatrapati Shivaji Terminus", sub: "CST, Mumbai", icon: "🏛️" },
  { name: "BKC Business Park", sub: "Bandra Kurla Complex", icon: "💼" },
  { name: "Andheri Metro Station", sub: "Andheri East", icon: "🚇" },
  { name: "Juhu Beach", sub: "Juhu, Mumbai", icon: "🏖️" },
];

function SearchScreen() {
  const { navigate, goBack } = useNav();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ padding: "8px 20px 12px", background: "#fff", display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={goBack} style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: "#F0F3FA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={20} color="#1A1D29" />
        </button>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} color="#5F6678" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search destination..."
            style={{ width: "100%", height: 48, borderRadius: 14, border: "1.5px solid #E8ECF5", background: "#F0F3FA", paddingLeft: 42, paddingRight: 44, fontSize: 16, fontFamily: F, color: "#1A1D29", outline: "none", boxSizing: "border-box" }}
          />
          <Mic size={18} color="#5B6CFF" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {/* Recent */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Recent</h3>
            <button style={{ background: "none", border: "none", fontSize: 13, color: "#5B6CFF", fontWeight: 600, cursor: "pointer" }}>Clear</button>
          </div>
          {[
            { name: "BKC Office", sub: "Bandra Kurla Complex", icon: "🕐" },
            { name: "Santacruz Station", sub: "Santacruz West", icon: "🕐" },
          ].map(({ name, sub, icon }) => (
            <button key={name} onClick={() => navigate("routeResults")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #F0F3FA", cursor: "pointer", fontFamily: F, textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F3FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 600, color: "#1A1D29" }}>{name}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#5F6678" }}>{sub}</p>
              </div>
              <ChevronRight size={16} color="#5F6678" />
            </button>
          ))}
        </div>

        {/* AI suggestions */}
        <div style={{ background: "linear-gradient(135deg,#EEF0FF,#F5F0FF)", borderRadius: 16, padding: "14px 16px", marginBottom: 24, border: "1px solid #E0E4FF" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <Zap size={14} color="#5B6CFF" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#5B6CFF" }}>AI Suggestion</span>
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "#1A1D29", lineHeight: 1.4 }}>Heads up — heavy traffic on SV Road right now. Route 310 via Western Express Highway is 18 min faster.</p>
          <button onClick={() => navigate("routeResults")} style={{ background: "#5B6CFF", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: F }}>See Route</button>
        </div>

        {/* Popular */}
        <div>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Popular Places</h3>
          {popular.map(({ name, sub, icon }) => (
            <button key={name} onClick={() => navigate("routeResults")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #F0F3FA", cursor: "pointer", fontFamily: F, textAlign: "left" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F0F3FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 600, color: "#1A1D29" }}>{name}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#5F6678" }}>{sub}</p>
              </div>
              <ChevronRight size={16} color="#5F6678" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Route Results ────────────────────────────────────────────────────

const routes = [
  { num: "507", time: 32, fare: "₹18", transfers: 0, occ: "low" as const, eta: "9:42 AM", ai: true },
  { num: "310", time: 41, fare: "₹18", transfers: 0, occ: "medium" as const, eta: "9:51 AM", ai: false },
  { num: "221+AC71", time: 28, fare: "₹47", transfers: 1, occ: "low" as const, eta: "9:38 AM", ai: false },
  { num: "AC81", time: 35, fare: "₹40", transfers: 0, occ: "high" as const, eta: "9:45 AM", ai: false },
];

function RouteResultsScreen() {
  const { navigate, goBack } = useNav();

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <div style={{ background: "#fff" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 12px", display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={goBack} style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: "#F0F3FA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={20} color="#1A1D29" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#5B6CFF" }} />
              <span style={{ fontSize: 14, color: "#5F6678" }}>Bandra Station</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: "2px solid #EF4444" }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1D29" }}>BKC Office</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 20px 12px", display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#EEF0FF", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer" }}>
            <Clock size={13} color="#5B6CFF" /><span style={{ fontSize: 13, fontWeight: 600, color: "#5B6CFF", fontFamily: F }}>Now</span>
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0F3FA", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer" }}>
            <span style={{ fontSize: 13, color: "#5F6678", fontFamily: F }}>Least Fare</span>
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0F3FA", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer" }}>
            <span style={{ fontSize: 13, color: "#5F6678", fontFamily: F }}>Fastest</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {routes.map((r, i) => (
            <button key={i} onClick={() => navigate("routeDetails")} style={{ background: "#fff", borderRadius: 20, padding: "16px", boxShadow: sh.card, border: r.ai ? "1.5px solid #C8CEFF" : "none", cursor: "pointer", textAlign: "left", width: "100%", position: "relative" }}>
              {r.ai && <div style={{ position: "absolute", top: 14, right: 14 }}><AiBadge /></div>}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: r.ai ? "linear-gradient(135deg,#7385FF,#5B6CFF)" : "#F0F3FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: r.ai ? "#fff" : "#1A1D29", fontFamily: F }}>{r.num.includes("+") ? "🔄" : r.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {r.num.includes("+") && <p style={{ margin: "0 0 2px", fontSize: 11, color: "#5F6678" }}>Change at Santacruz</p>}
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.5px" }}>{r.time}</span>
                    <span style={{ fontSize: 14, color: "#5F6678" }}>min</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F0F3FA" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13, color: "#5F6678" }}>🎫 {r.fare}</span>
                  <span style={{ fontSize: 13, color: "#5F6678" }}>🔁 {r.transfers === 0 ? "Direct" : `${r.transfers} change`}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#5F6678" }}>
                    <OccupancyDots level={r.occ} />
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#5B6CFF" }}>Arrives {r.eta}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Route Details ────────────────────────────────────────────────────

const stopTimeline = [
  { name: "Bandra Station (W)", time: "9:08 AM", status: "origin" },
  { name: "Turner Road", time: "9:12 AM", status: "stop" },
  { name: "Linking Road Junction", time: "9:15 AM", status: "stop" },
  { name: "Santacruz Station", time: "9:22 AM", status: "current" },
  { name: "Vile Parle (W)", time: "9:28 AM", status: "stop" },
  { name: "Andheri Station", time: "9:36 AM", status: "stop" },
  { name: "BKC Office", time: "9:40 AM", status: "destination" },
];

function RouteDetailsScreen() {
  const { navigate, goBack } = useNav();

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F, overflow: "hidden" }}>
      {/* Map section */}
      <div style={{ height: 280, position: "relative", background: "#E8EEFB" }}>
        <FullMap showRoute animated />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}>
            <StatusBar />
            <div style={{ padding: "4px 16px 12px", display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={goBack} style={{ width: 38, height: 38, borderRadius: 12, border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: sh.card }}>
                <ArrowLeft size={18} color="#1A1D29" />
              </button>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#1A1D29" }}>Route 507</span>
              <LiveBadge />
            </div>
          </div>
        </div>
        {/* Map controls */}
        <div style={{ position: "absolute", right: 16, bottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: sh.card }}>
            <Navigation size={18} color="#5B6CFF" />
          </button>
        </div>
      </div>

      {/* Details sheet */}
      <div style={{ flex: 1, background: "#fff", borderRadius: "24px 24px 0 0", marginTop: -16, padding: "20px 20px 0", overflowY: "auto", paddingBottom: 100 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E8ECF5", margin: "0 auto 20px" }} />

        {/* Bus info */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
              <div style={{ background: "linear-gradient(135deg,#7385FF,#5B6CFF)", borderRadius: 10, padding: "4px 12px" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>507</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#1A1D29" }}>Andheri Station</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#16C47F", fontWeight: 500 }}>On time · 3 min away</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#5B6CFF" }}>₹18</p>
            <p style={{ margin: 0, fontSize: 12, color: "#5F6678" }}>32 min</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {[{ icon: "🚏", label: "7 stops" }, { icon: "♿", label: "Accessible" }, { label: "Low crowd", icon: "👥" }].map(({ icon, label }) => (
            <div key={label} style={{ flex: 1, background: "#F0F3FA", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <p style={{ margin: "0 0 3px", fontSize: 16 }}>{icon}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#5F6678", fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Route Timeline</h4>
        {stopTimeline.map((stop, i) => {
          const isOrigin = stop.status === "origin";
          const isDest = stop.status === "destination";
          const isCurrent = stop.status === "current";
          return (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: i === stopTimeline.length - 1 ? 0 : 0, position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: isOrigin || isDest ? "#5B6CFF" : isCurrent ? "#16C47F" : "#E8ECF5", border: `2px solid ${isOrigin || isDest ? "#5B6CFF" : isCurrent ? "#16C47F" : "#C8D4EE"}`, flexShrink: 0, zIndex: 1 }} />
                {i < stopTimeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 32, background: i < 3 ? "#5B6CFF" : "#E8ECF5" }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: isCurrent || isOrigin || isDest ? 600 : 400, color: isCurrent ? "#16C47F" : isDest ? "#EF4444" : "#1A1D29" }}>
                    {stop.name}
                    {isCurrent && <span style={{ marginLeft: 6, fontSize: 11, background: "#ECFDF5", color: "#16C47F", padding: "2px 7px", borderRadius: 100, fontWeight: 600 }}>Bus here</span>}
                  </span>
                  <span style={{ fontSize: 12, color: "#5F6678" }}>{stop.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px 32px", background: "linear-gradient(to top,#fff 80%,transparent)", paddingTop: 24 }}>
        <PrimaryBtn label="Board Bus 507" onClick={() => navigate("boarding")} />
      </div>
    </div>
  );
}

// ─── Screen: Live Tracking ────────────────────────────────────────────────────

function LiveTrackingScreen() {
  const { navigate, goBack } = useNav();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", background: "#E8EEFB", display: "flex", flexDirection: "column", fontFamily: F, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", margin: 12, borderRadius: 20, boxShadow: sh.float }}>
          <StatusBar />
          <div style={{ padding: "4px 14px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={goBack} style={{ width: 36, height: 36, borderRadius: 11, border: "none", background: "#F0F3FA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={17} color="#1A1D29" />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#5F6678" }}>Tracking Bus</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1D29" }}>507 → Andheri Station</p>
            </div>
            <LiveBadge />
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <FullMap showRoute animated />
      </div>

      {/* Floating controls */}
      <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8 }}>
        {[{ icon: <Navigation size={18} />, label: "Re-center" }, { icon: <Share2 size={18} />, label: "Share" }, { icon: <Phone size={18} />, label: "Emergency" }].map(({ icon, label }) => (
          <button key={label} style={{ width: 46, height: 46, borderRadius: 14, background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: sh.float, color: "#1A1D29" }} title={label}>
            {icon}
          </button>
        ))}
      </div>

      {/* Bottom sheet */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "24px 24px 0 0", boxShadow: "0 -4px 40px rgba(26,29,41,0.12)", padding: "0 20px 36px" }}>
        <button onClick={() => setSheetOpen(!sheetOpen)} style={{ display: "block", margin: "12px auto", width: 40, height: 4, borderRadius: 2, background: "#E8ECF5", border: "none", cursor: "pointer" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 13, color: "#5F6678" }}>Next Stop</p>
            <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.3px" }}>Santacruz Station</p>
            <p style={{ margin: 0, fontSize: 14, color: "#16C47F", fontWeight: 600 }}>Arriving in 3 min</p>
          </div>
          <div style={{ background: "#EEF0FF", borderRadius: 14, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 700, color: "#5B6CFF" }}>9:40</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>ETA</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginBottom: sheetOpen ? 16 : 0 }}>
          {[{ label: "Speed", val: "42 km/h" }, { label: "Stops left", val: "4" }, { label: "Delay", val: "None" }].map(({ label, val }) => (
            <div key={label} style={{ flex: 1, background: "#F0F3FA", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>{val}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>{label}</p>
            </div>
          ))}
        </div>

        {sheetOpen && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => navigate("journey")} style={{ flex: 1, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#7385FF,#5B6CFF)", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Start Journey</button>
              <button style={{ width: 48, height: 48, borderRadius: 14, background: "#FFF0F0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={18} color="#EF4444" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: Boarding Confirmation ────────────────────────────────────────────

function BoardingScreen() {
  const { navigate } = useNav();

  useEffect(() => {
    const t = setTimeout(() => navigate("journey"), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <CheckCircle size={48} color="#16C47F" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1A1D29", textAlign: "center", margin: "0 0 10px", letterSpacing: "-0.4px" }}>Journey Started!</h1>
        <p style={{ fontSize: 16, color: "#5F6678", textAlign: "center", margin: "0 0 32px", lineHeight: 1.5 }}>You're on Bus 507 heading to Andheri Station.</p>
        <Card style={{ width: "100%", padding: "20px" }}>
          {[{ label: "Bus", val: "507 — AC Express" }, { label: "From", val: "Bandra Station (W)" }, { label: "To", val: "Andheri Station" }, { label: "Stops remaining", val: "7 stops" }, { label: "ETA", val: "9:40 AM" }].map(({ label, val }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #F0F3FA" }}>
              <span style={{ fontSize: 14, color: "#5F6678" }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1D29" }}>{val}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Screen: Journey Progress ─────────────────────────────────────────────────

const journeyStops = [
  { name: "Bandra Station (W)", done: true },
  { name: "Turner Road", done: true },
  { name: "Linking Road Junction", done: true },
  { name: "Santacruz Station", done: false, current: true },
  { name: "Vile Parle (W)", done: false },
  { name: "Andheri Station", done: false },
];

function JourneyScreen() {
  const { navigate, goBack } = useNav();

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F, overflow: "hidden" }}>
      <div style={{ height: 240, position: "relative" }}>
        <FullMap showRoute animated />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)" }}>
          <StatusBar />
          <div style={{ padding: "4px 16px 10px", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={goBack} style={{ width: 36, height: 36, borderRadius: 11, border: "none", background: "#F0F3FA", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeft size={17} color="#1A1D29" />
            </button>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#1A1D29" }}>On Journey</span>
            <LiveBadge />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, background: "#fff", borderRadius: "24px 24px 0 0", marginTop: -16, padding: "20px 20px 100px", overflowY: "auto" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#E8ECF5", margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 14, color: "#5F6678" }}>Arriving at</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1A1D29" }}>Andheri Station</p>
          </div>
          <div style={{ textAlign: "right", background: "#EEF0FF", borderRadius: 12, padding: "10px 14px" }}>
            <p style={{ margin: "0 0 1px", fontSize: 20, fontWeight: 700, color: "#5B6CFF" }}>9:40</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>ETA</p>
          </div>
        </div>

        <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#1A1D29" }}>Stop Progress</h4>
        {journeyStops.map((stop, i) => (
          <div key={i} style={{ display: "flex", gap: 12, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 18 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: stop.done ? "#16C47F" : stop.current ? "#5B6CFF" : "#E8ECF5", border: `2px solid ${stop.done ? "#16C47F" : stop.current ? "#5B6CFF" : "#C8D4EE"}`, zIndex: 1, flexShrink: 0 }} />
              {i < journeyStops.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 28, background: stop.done ? "#16C47F" : "#E8ECF5" }} />}
            </div>
            <div style={{ flex: 1, paddingBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: stop.current ? 700 : stop.done ? 500 : 400, color: stop.current ? "#5B6CFF" : stop.done ? "#5F6678" : "#1A1D29", textDecoration: stop.done ? "line-through" : "none" }}>
                {stop.name}
                {stop.current && <span style={{ marginLeft: 8, fontSize: 11, background: "#EEF0FF", color: "#5B6CFF", padding: "2px 7px", borderRadius: 100, fontWeight: 700 }}>Next</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px 32px", background: "linear-gradient(to top,#fff 80%,transparent)", paddingTop: 24 }}>
        <button onClick={() => navigate("arrived")} style={{ width: "100%", padding: "16px", borderRadius: 100, border: "1.5px solid #E8ECF5", background: "#fff", color: "#EF4444", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: F }}>Exit Journey</button>
      </div>
    </div>
  );
}

// ─── Screen: Arrived ──────────────────────────────────────────────────────────

function ArrivedScreen() {
  const { navigate } = useNav();
  const [rating, setRating] = useState(0);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <IllustrationCelebration />

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1A1D29", textAlign: "center", margin: "20px 0 6px", letterSpacing: "-0.4px" }}>You've arrived! 🎉</h1>
        <p style={{ fontSize: 15, color: "#5F6678", textAlign: "center", margin: "0 0 28px" }}>Great journey on Bus 507.</p>

        <div style={{ display: "flex", gap: 10, width: "100%", marginBottom: 24 }}>
          {[{ icon: "⏱️", label: "Duration", val: "32 min" }, { icon: "📏", label: "Distance", val: "8.4 km" }, { icon: "🌿", label: "CO₂ saved", val: "1.2 kg" }].map(({ icon, label, val }) => (
            <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 8px", textAlign: "center", boxShadow: sh.card }}>
              <p style={{ margin: "0 0 4px", fontSize: 20 }}>{icon}</p>
              <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>{val}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>{label}</p>
            </div>
          ))}
        </div>

        <Card style={{ width: "100%", padding: "20px", marginBottom: 16 }}>
          <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Rate your journey</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} style={{ flex: 1, fontSize: 24, background: "none", border: "none", cursor: "pointer", opacity: n <= rating ? 1 : 0.3 }}>⭐</button>
            ))}
          </div>
          <textarea placeholder="Write a review (optional)..." style={{ width: "100%", height: 72, borderRadius: 12, border: "1.5px solid #E8ECF5", padding: "10px 12px", fontSize: 14, fontFamily: F, color: "#1A1D29", outline: "none", resize: "none", background: "#F0F3FA", boxSizing: "border-box" }}/>
        </Card>

        <div style={{ width: "100%", display: "flex", gap: 10 }}>
          <PrimaryBtn label="Submit & Done" onClick={() => navigate("home")} />
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Alerts ───────────────────────────────────────────────────────────

const alertItems = [
  { type: "warning", icon: "⚠️", title: "Route Diversion — Bus 507", body: "507 is diverted via Linking Road due to waterlogging near Turner Road. Expect +8 min delay.", time: "2 min ago", color: "#F4B400", bg: "#FFFBEB" },
  { type: "error", icon: "🚨", title: "Bus 310 Delayed — 22 min", body: "Breakdown reported at Santacruz. Service will resume at 10:45 AM.", time: "15 min ago", color: "#EF4444", bg: "#FFF5F5" },
  { type: "info", icon: "🌧️", title: "Heavy Rain Alert", body: "IMD predicts heavy rainfall in Mumbai for the next 4 hours. Plan travel accordingly.", time: "30 min ago", color: "#3B82F6", bg: "#EFF6FF" },
  { type: "success", icon: "✅", title: "AC71 Now Running on Time", body: "Earlier delay resolved. AC71 to BKC is back on schedule.", time: "1 hr ago", color: "#16C47F", bg: "#ECFDF5" },
  { type: "info", icon: "🛠️", title: "Platform Maintenance — Bandra Stn", body: "Platform 2 under maintenance until 6 PM. Use Platform 1 or 3 for boarding.", time: "2 hr ago", color: "#3B82F6", bg: "#EFF6FF" },
];

function AlertsScreen() {
  const { navigate } = useNav();

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <div style={{ background: "#fff" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.3px" }}>Alerts</h1>
          <button style={{ background: "none", border: "none", color: "#5B6CFF", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Mark all read</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px", paddingBottom: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {alertItems.map((a, i) => (
            <div key={i} style={{ background: a.bg, borderRadius: 18, padding: "14px 16px", borderLeft: `4px solid ${a.color}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1D29" }}>{a.title}</span>
                    <span style={{ fontSize: 11, color: "#5F6678", flexShrink: 0, marginLeft: 8 }}>{a.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#5F6678", lineHeight: 1.45 }}>{a.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="alerts" onTab={navigate} />
    </div>
  );
}

// ─── Screen: Saved Routes ─────────────────────────────────────────────────────

const savedPlaces = [
  { icon: "🏠", label: "Home", addr: "202 Turner Road, Bandra West", routes: ["507", "310"] },
  { icon: "💼", label: "Work", addr: "G Block, BKC, Mumbai", routes: ["AC71", "221"] },
  { icon: "🎓", label: "College", addr: "Vile Parle (W), Mumbai", routes: ["507"] },
];

const recentTrips = [
  { from: "Bandra Stn", to: "BKC Office", time: "Yesterday, 9:40 AM", bus: "507", dur: "32 min", fare: "₹18" },
  { from: "BKC Office", to: "Bandra Stn", time: "Yesterday, 6:12 PM", bus: "AC71", dur: "28 min", fare: "₹35" },
  { from: "Bandra Stn", to: "Andheri Stn", time: "Mon, 8:55 AM", bus: "507", dur: "36 min", fare: "₹18" },
];

function SavedScreen() {
  const { navigate } = useNav();

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <div style={{ background: "#fff" }}>
        <StatusBar />
        <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.3px" }}>Saved</h1>
          <button style={{ width: 36, height: 36, borderRadius: 11, background: "#EEF0FF", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={18} color="#5B6CFF" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", paddingBottom: 80 }}>
        {/* Saved places */}
        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Your Places</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {savedPlaces.map(({ icon, label, addr, routes: r }) => (
            <button key={label} onClick={() => navigate("routeResults")} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 18, padding: "14px 16px", boxShadow: sh.card, border: "none", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: "#EEF0FF", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 600, color: "#1A1D29" }}>{label}</p>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#5F6678" }}>{addr}</p>
                <div style={{ display: "flex", gap: 5 }}>
                  {r.map(route => (
                    <span key={route} style={{ fontSize: 11, fontWeight: 700, color: "#5B6CFF", background: "#EEF0FF", padding: "2px 7px", borderRadius: 100 }}>{route}</span>
                  ))}
                </div>
              </div>
              <ChevronRight size={16} color="#5F6678" />
            </button>
          ))}
          <button style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", borderRadius: 18, padding: "14px 16px", border: "1.5px dashed #E8ECF5", cursor: "pointer", textAlign: "left", width: "100%" }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "#F0F3FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={20} color="#5F6678" />
            </div>
            <span style={{ fontSize: 15, color: "#5F6678", fontFamily: F }}>Add new place</span>
          </button>
        </div>

        {/* Recent trips */}
        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Recent Trips</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recentTrips.map((trip, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "14px 16px", boxShadow: sh.card }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7385FF,#5B6CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: F }}>{trip.bus}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1D29" }}>{trip.from} → {trip.to}</span>
                </div>
                <span style={{ fontSize: 12, color: "#5F6678" }}>{trip.dur}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#5F6678" }}>{trip.time}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#5B6CFF" }}>{trip.fare}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="saved" onTab={navigate} />
    </div>
  );
}

// ─── Screen: Profile ──────────────────────────────────────────────────────────

function ProfileScreen() {
  const { navigate } = useNav();
  const achievements = [
    { icon: "🏅", label: "100 Trips", earned: true },
    { icon: "🌿", label: "Eco Rider", earned: true },
    { icon: "⚡", label: "Early Bird", earned: true },
    { icon: "💰", label: "Smart Saver", earned: false },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#F8FAFD", display: "flex", flexDirection: "column", fontFamily: F }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        {/* Profile header */}
        <div style={{ padding: "16px 20px 0" }}>
          <Card style={{ padding: "20px 20px 16px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#7385FF,#5B6CFF)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>AS</span>
            </div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#1A1D29", letterSpacing: "-0.3px" }}>Arjun Sharma</h2>
            <p style={{ margin: "0 0 14px", fontSize: 14, color: "#5F6678" }}>+91 98765 43210 · Mumbai</p>
            <button style={{ background: "#EEF0FF", border: "none", borderRadius: 20, padding: "8px 20px", fontSize: 14, fontWeight: 600, color: "#5B6CFF", cursor: "pointer", fontFamily: F }}>Edit Profile</button>
          </Card>
        </div>

        {/* Stats */}
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ icon: "🚌", label: "Trips", val: "142" }, { icon: "🌿", label: "CO₂ Saved", val: "68 kg" }, { icon: "💰", label: "Money Saved", val: "₹2,840" }].map(({ icon, label, val }) => (
              <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 8px", textAlign: "center", boxShadow: sh.card }}>
                <p style={{ margin: "0 0 4px", fontSize: 22 }}>{icon}</p>
                <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 700, color: "#1A1D29" }}>{val}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#5F6678" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div style={{ padding: "16px 20px 0" }}>
          <Card>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#1A1D29" }}>Achievements</h3>
            <div style={{ display: "flex", gap: 12 }}>
              {achievements.map(({ icon, label, earned }) => (
                <div key={label} style={{ flex: 1, textAlign: "center", opacity: earned ? 1 : 0.35 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: earned ? "#EEF0FF" : "#F0F3FA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", fontSize: 22 }}>{icon}</div>
                  <p style={{ margin: 0, fontSize: 11, color: earned ? "#5B6CFF" : "#5F6678", fontWeight: earned ? 600 : 400 }}>{label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Settings list */}
        <div style={{ padding: "16px 20px 0" }}>
          <Card style={{ padding: "4px 0" }}>
            {[
              { icon: <Bell size={18} />, label: "Notifications", color: "#F4B400" },
              { icon: <MapPin size={18} />, label: "Location Services", color: "#5B6CFF" },
              { icon: <Heart size={18} />, label: "Preferences", color: "#EF4444" },
              { icon: <Settings size={18} />, label: "Settings", color: "#5F6678" },
              { icon: <HelpCircle size={18} />, label: "Help & Support", color: "#00C2A8" },
            ].map(({ icon, label, color }) => (
              <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "none", border: "none", borderBottom: "1px solid #F0F3FA", cursor: "pointer" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
                <span style={{ flex: 1, textAlign: "left", fontSize: 15, fontWeight: 500, color: "#1A1D29", fontFamily: F }}>{label}</span>
                <ChevronRight size={16} color="#5F6678" />
              </button>
            ))}
            <button onClick={() => navigate("onboarding")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogOut size={18} color="#EF4444" />
              </div>
              <span style={{ flex: 1, textAlign: "left", fontSize: 15, fontWeight: 500, color: "#EF4444", fontFamily: F }}>Log Out</span>
            </button>
          </Card>
        </div>
      </div>

      <BottomNav active="profile" onTab={navigate} />
    </div>
  );
}

// ─── Navigator ────────────────────────────────────────────────────────────────

function Navigator() {
  const [stack, setStack] = useState<Screen[]>(["splash"]);
  const current = stack[stack.length - 1];

  const navigate = (s: Screen) => setStack(prev => [...prev, s]);
  const goBack = () => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);

  const screens: Record<Screen, React.ReactNode> = {
    splash: <SplashScreen />,
    onboarding: <OnboardingScreen />,
    login: <LoginScreen />,
    otp: <OTPScreen />,
    location: <LocationScreen />,
    home: <HomeScreen />,
    search: <SearchScreen />,
    routeResults: <RouteResultsScreen />,
    routeDetails: <RouteDetailsScreen />,
    liveTracking: <LiveTrackingScreen />,
    boarding: <BoardingScreen />,
    journey: <JourneyScreen />,
    arrived: <ArrivedScreen />,
    alerts: <AlertsScreen />,
    saved: <SavedScreen />,
    profile: <ProfileScreen />,
  };

  return (
    <Nav.Provider value={{ navigate, goBack }}>
      <div key={current} style={{ width: "100%", height: "100%", position: "relative", animation: "screenIn 0.28s ease-out" }}>
        {screens[current]}
      </div>
    </Nav.Provider>
  );
}

// ─── Phone Frame ─────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg,#0D0F1A 0%,#1A1D35 50%,#0D0F1A 100%)", overflow: "hidden" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        {/* Phone body */}
        <div style={{ width: 393, height: 852, borderRadius: 52, background: "#1A1D29", padding: 8, boxShadow: "0 48px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.12)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: "#F8FAFD", position: "relative" }}>
            {/* Dynamic Island */}
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 120, height: 34, background: "#000", borderRadius: 20, zIndex: 999, pointerEvents: "none" }} />
            <div style={{ width: "100%", height: "100%", overflowY: "hidden" }}>
              {children}
            </div>
          </div>
        </div>
        {/* Side buttons */}
        <div style={{ position: "absolute", right: -4, top: 140, width: 4, height: 36, background: "#2A2D3A", borderRadius: "0 4px 4px 0" }} />
        <div style={{ position: "absolute", left: -4, top: 120, width: 4, height: 28, background: "#2A2D3A", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", left: -4, top: 162, width: 4, height: 52, background: "#2A2D3A", borderRadius: "4px 0 0 4px" }} />
        <div style={{ position: "absolute", left: -4, top: 224, width: 4, height: 52, background: "#2A2D3A", borderRadius: "4px 0 0 4px" }} />
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <style>{`
        @keyframes screenIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        input::placeholder { color: #9AA3B8; }
        textarea::placeholder { color: #9AA3B8; }
      `}</style>
      <PhoneFrame>
        <Navigator />
      </PhoneFrame>
    </>
  );
}
