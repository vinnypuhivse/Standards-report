// Shared atoms — icons, helpers

const SP_BLUE = "rgb(8,44,136)";       // dark navy/primary
const SP_LINK = "rgb(16,111,243)";     // newsela blue
const SP_TEXT = "rgb(29,29,29)";
const SP_TEXT2 = "rgb(51,51,51)";
const SP_MUTED = "rgb(91,90,97)";
const SP_GREY = "rgb(118,118,118)";
const SP_BG = "rgb(248,248,248)";
const SP_PANEL = "rgb(240,241,242)";
const SP_BORDER = "rgb(221,221,221)";
const SP_BORDER_LT = "rgb(225,227,229)";
const SP_CYAN = "rgb(100,212,243)";
const SP_NAV_TEXT = "rgb(84,84,84)";

const Icon = ({ d, size = 16, stroke = "currentColor", strokeWidth = 1.5, fill = "none", style = {}, viewBox = "0 0 24 24" }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, ...style }}>
    <path d={d} />
  </svg>
);

const Icons = {
  ChevronDown: (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  ChevronUp: (p) => <Icon {...p} d="M6 15l6-6 6 6" />,
  ChevronRight: (p) => <Icon {...p} d="M9 6l6 6-6 6" />,
  ChevronLeft: (p) => <Icon {...p} d="M15 6l-9 6 9 6" />,
  ChevronDoubleRight: (p) => <Icon {...p} d="M7 6l6 6-6 6 M13 6l6 6-6 6" />,
  ChevronDoubleLeft: (p) => <Icon {...p} d="M11 6l-6 6 6 6 M17 6l-6 6 6 6" />,
  Search: (p) => <Icon {...p} d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5" />,
  Slash: (p) => <Icon {...p} d="M16 4l-8 16" />,
  Download: (p) => <Icon {...p} d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />,
  Close: (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />,
  Info: (p) => <Icon {...p} d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 5v.01M12 11v6" />,
  Sort: (p) => <Icon {...p} d="M7 4l3 4H4l3-4zm0 16l-3-4h6l-3 4z" fill="currentColor" stroke="none" />,
  External: (p) => <Icon {...p} d="M14 4h6v6M20 4l-8 8M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-3" />,
  User: (p) => <Icon {...p} d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />,
  Sliders: (p) => <Icon {...p} d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M18 18h2M14 4v4M8 10v4M16 16v4" />,
};

// Color helpers — match Figma exactly.
// Bars: black stroke + black fill for normal scores; navy (rgb(8,44,136)) only when score >= 90
// (matches the Figma "93%" top-performer treatment).
function scoreColor(pct) {
  if (pct == null) return SP_TEXT;
  if (pct >= 90) return SP_BLUE;
  return SP_TEXT;
}

// Donut percent ring — cyan ring on light-grey track, matching Figma.
function PercentCircle({ pct, size = 68, stroke = 8, color }) {
  const c = color || SP_CYAN;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const dash = pct == null ? 0 : (pct / 100) * C;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: "block", transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={SP_BORDER_LT} strokeWidth={stroke} />
        {pct != null && (
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={`${dash} ${C - dash}`} />
        )}
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: size > 50 ? 20 : 14, color: SP_TEXT,
      }}>
        {pct == null ? "—" : `${pct}%`}
      </div>
    </div>
  );
}

// Newsela logo block
function NewselaLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={28} height={28} viewBox="0 0 32 32" style={{ display: "block" }}>
        <rect width="32" height="32" fill={SP_LINK} />
        <path fill="white" fillRule="evenodd" d="M 15.145 26.95 L 5.023 26.95 L 5.023 5.023 L 15.145 5.023 L 15.145 26.95 Z M 26.976 26.974 L 16.83 26.974 L 16.83 5.047 L 21.928 5.047 C 24.708 5.047 26.976 7.315 26.976 10.096 L 26.976 26.974 Z" />
      </svg>
      <span style={{ fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 20, color: SP_LINK, letterSpacing: -0.2 }}>
        newsela
      </span>
    </div>
  );
}

Object.assign(window, {
  SP_BLUE, SP_LINK, SP_TEXT, SP_TEXT2, SP_MUTED, SP_GREY,
  SP_BG, SP_PANEL, SP_BORDER, SP_BORDER_LT, SP_CYAN, SP_NAV_TEXT,
  Icon, Icons, scoreColor, PercentCircle, NewselaLogo,
});
