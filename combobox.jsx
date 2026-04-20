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

function MultiSelectDropdown({ placeholder, options, applied, onApply, overrideLabel, width }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState([...applied]);
  const ref = useRef(null);

  useEffect(() => { setPending([...applied]); }, [applied.join(",")]);
  useClickOutside(ref, () => { setPending([...applied]); setOpen(false); });

  const toggle = (opt) => setPending(p =>
    p.includes(opt) ? p.filter(x => x !== opt) : [...p, opt]
  );

  const isOverridden = overrideLabel != null;
  const displayLabel = isOverridden ? overrideLabel :
    applied.length === 0 ? placeholder :
    applied.length === 1 ? applied[0] :
    `${applied.length} selections`;

  return (
    <div style={{ position: "relative", width: width || "auto" }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{
        height: 48, width: "100%", background: "white",
        border: `1px solid ${open ? SP_LINK : SP_BORDER}`, borderRadius: 4,
        padding: "0 12px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        cursor: "pointer", fontFamily: "Circular, sans-serif", fontSize: 14, textAlign: "left", outline: "none",
        fontWeight: applied.length > 0 && !isOverridden ? 700 : 400,
        color: isOverridden ? SP_MUTED : SP_TEXT,
        boxShadow: open ? `0 0 0 2px rgba(16,111,243,0.18)` : "none",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayLabel}</span>
        <Icons.ChevronDown size={18} stroke={SP_TEXT}
          style={{ flexShrink: 0, transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", left: 0, top: "calc(100% + 4px)", zIndex: 40,
          background: "white", border: `1px solid ${SP_BORDER}`, borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "100%", width: "max-content",
        }}>
          <div style={{ maxHeight: 280, overflowY: "auto", padding: "4px 0" }}>
            {options.map(opt => {
              const checked = pending.includes(opt);
              return (
                <label key={opt} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                  cursor: "pointer", background: checked ? SP_BG : "transparent", userSelect: "none",
                }}
                  onMouseEnter={e => { if (!checked) e.currentTarget.style.background = SP_BG; }}
                  onMouseLeave={e => { if (!checked) e.currentTarget.style.background = "transparent"; }}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggle(opt)}
                    style={{ width: 16, height: 16, accentColor: SP_BLUE, flexShrink: 0, cursor: "pointer" }} />
                  <span style={{ fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_TEXT }}>{opt}</span>
                </label>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: `1px solid ${SP_BORDER_LT}` }}>
            <button onClick={() => setPending([])} style={{
              padding: "10px 20px", border: `1.5px solid ${SP_BLUE}`, borderRadius: 4,
              background: "white", color: SP_BLUE, fontFamily: "Circular, sans-serif",
              fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}>Clear</button>
            <button onClick={() => { onApply(pending); setOpen(false); }} style={{
              flex: 1, padding: "10px 20px", border: "none", borderRadius: 4,
              background: SP_BLUE, color: "white", fontFamily: "Circular, sans-serif",
              fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              {pending.length > 0 ? `Apply ${pending.length} filter${pending.length > 1 ? "s" : ""}` : "Apply filters"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ComboBox, useClickOutside, MultiSelectDropdown });
