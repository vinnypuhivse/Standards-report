// Filter combo-box dropdown (working)
const { useState, useRef, useEffect } = React;

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, onClose]);
}

function ComboBox({ label, value, options, onChange, width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div style={{ width: width || "100%", position: "relative" }} ref={ref}>
      <div style={{
        fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_TEXT, marginBottom: 6, fontWeight: 500,
      }}>{label}</div>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", height: 48, background: "white", border: `1px solid ${open ? SP_LINK : SP_BORDER}`,
        borderRadius: 4, padding: "0 12px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", fontFamily: "Circular, sans-serif", fontSize: 16, color: SP_TEXT, textAlign: "left",
        outline: "none", boxShadow: open ? `0 0 0 2px rgba(16,111,243,0.18)` : "none",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
        <Icons.ChevronDown size={20} stroke={SP_TEXT} style={{ transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, background: "white",
          border: `1px solid ${SP_BORDER}`, borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 30, maxHeight: 320, overflowY: "auto", padding: "4px 0",
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{
              padding: "10px 16px", fontFamily: "Circular, sans-serif", fontSize: 14,
              color: SP_TEXT, cursor: "pointer", background: opt === value ? "rgb(231,241,255)" : "transparent",
              fontWeight: opt === value ? 700 : 400,
            }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = SP_BG; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = "transparent"; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ComboBox, useClickOutside });
