// Topic cards section (Highest, Lowest, All-78)

function TopicCard({ topic, showAvg }) {
  return (
    <div style={{
      background: "white", borderRadius: 12, padding: 16,
      display: "flex", flexDirection: "column", gap: 10,
      minHeight: 160, flex: "1 1 0", minWidth: 0,
    }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "Circular, sans-serif", fontSize: 13, color: SP_MUTED, marginBottom: 2 }}>
          {topic.gradeBand || "\u00a0"}
        </div>
        <div style={{
          fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 16, color: SP_TEXT,
          textAlign: "left",
        }}>{topic.name}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "auto" }}>
        <PercentCircle pct={topic.pct} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <div style={{ fontFamily: "Circular, sans-serif", fontSize: 13, color: SP_TEXT }}>
            Based on {topic.questions} Questions
          </div>
          {showAvg && (
            <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED }}>
              Newsela average: {topic.newselaAvg}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollapsiblePanel({ title, count, defaultOpen, children, onToggle, isOpen, controlled }) {
  const [openInternal, setOpenInternal] = useState(defaultOpen);
  const open = controlled ? isOpen : openInternal;
  const toggle = () => { if (controlled) onToggle?.(); else setOpenInternal(o => !o); };
  return (
    <div style={{ background: SP_PANEL, borderRadius: 16, padding: 16 }}>
      <button onClick={toggle} style={{
        width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 20, color: SP_TEXT }}>
            {title}
          </span>
          {count != null && (
            <span style={{ fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_MUTED }}>
              {count}
            </span>
          )}
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {open ? <Icons.ChevronUp size={20} stroke={SP_TEXT} /> : <Icons.ChevronDown size={20} stroke={SP_TEXT} />}
        </div>
      </button>
      {open && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}

function TopicGrid({ topics }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "stretch" }}>
      {topics.map(t => <TopicCard key={t.id} topic={t} showAvg />)}
    </div>
  );
}

function AllTopicsList({ topics }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
      {topics.map(t => (
        <div key={t.id} style={{
          background: "white", borderRadius: 8, padding: "10px 14px",
          display: "flex", alignItems: "stretch", gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{
              fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 14, color: SP_TEXT,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{t.name}</div>
            <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED }}>
              {t.gradeBand ? `${t.gradeBand} · ` : ""}Newsela avg {t.newselaAvg}%
            </div>
          </div>
          <div style={{ flexShrink: 0, width: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", height: 8, background: SP_BORDER_LT, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${t.pct}%`, height: "100%", background: SP_CYAN, borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ fontFamily: "Circular, sans-serif", fontSize: 11, color: SP_MUTED, textAlign: "right" }}>
              Based on {t.questions} questions
            </div>
          </div>
          <div style={{
            fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 14, color: SP_TEXT,
            width: 38, textAlign: "right", display: "flex", alignItems: "center",
          }}>{t.pct}%</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { TopicCard, CollapsiblePanel, TopicGrid, AllTopicsList });
