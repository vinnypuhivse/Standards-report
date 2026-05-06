// Teacher table: sticky header, sortable columns, pagination, drill-down

function ScoreCell({ score, mode }) {
  if (!score) {
    return (
      <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: "Circular, sans-serif", fontSize: 16, color: SP_TEXT }}>
          NA
        </div>
        <div style={{ height: 8, borderRadius: 4, border: `1px dashed ${SP_TEXT}`, background: "white" }} />
        <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED }}>0 questions</div>
      </div>
    );
  }
  const c = scoreColor(score.pct);
  if (mode === "circle") {
    return (
      <div style={{ width: 140, display: "flex", alignItems: "center", gap: 10 }}>
        <PercentCircle pct={score.pct} size={44} stroke={5} />
        <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED }}>
          {score.questions} q
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: 140, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontFamily: "Circular, sans-serif", fontSize: 16, color: SP_TEXT }}>
        {score.pct}%
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "white", border: `1px solid ${SP_CYAN}`, overflow: "hidden" }}>
        <div style={{ width: `${score.pct}%`, height: "100%", background: SP_CYAN, borderRadius: 4 }} />
      </div>
      <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED }}>
        {score.questions} questions
      </div>
    </div>
  );
}

function SortableHeader({ label, active, dir, onClick, sticky, width }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
      padding: 0, cursor: "pointer", height: 24,
      fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 16, color: SP_TEXT,
      ...(width ? { width } : {}),
    }}>
      <span>{label}</span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, opacity: active ? 1 : 0.45 }}>
        <Icons.ChevronUp size={8} stroke={active && dir === "asc" ? SP_LINK : SP_TEXT} strokeWidth={3} />
        <Icons.ChevronDown size={8} stroke={active && dir === "desc" ? SP_LINK : SP_TEXT} strokeWidth={3} />
      </span>
    </button>
  );
}

function TeacherTable({ teachers, standards, mode, sortKey, sortDir, onSort, onRowClick, page, pageSize, onPageChange, totalRows, selectedTeacherId }) {
  const start = page * pageSize;
  const visible = teachers.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  return (
    <div style={{
      background: "white", border: `1px solid ${SP_BORDER}`, borderRadius: 8,
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div style={{ overflowX: "auto", maxHeight: 560, position: "relative" }}>
        <table style={{ borderCollapse: "collapse", width: "max-content", minWidth: "100%" }}>
          <thead>
            <tr>
              <th style={{
                position: "sticky", top: 0, left: 0, zIndex: 3, background: "white",
                padding: "16px 20px", textAlign: "left", borderBottom: `1px solid ${SP_BORDER_LT}`,
                minWidth: 200, boxShadow: "2px 0 0 0 rgba(0,0,0,0.04)",
              }}>
                <SortableHeader label="Teacher" active={sortKey === "name"} dir={sortDir}
                  onClick={() => onSort("name")} />
              </th>
              {standards.map(s => (
                <th key={s} style={{
                  position: "sticky", top: 0, zIndex: 2, background: "white",
                  padding: "16px 20px", textAlign: "left", borderBottom: `1px solid ${SP_BORDER_LT}`,
                  minWidth: 160,
                }}>
                  <SortableHeader label={s} active={sortKey === s} dir={sortDir} onClick={() => onSort(s)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((t, i) => {
              const sel = t.id === selectedTeacherId;
              return (
                <tr key={t.id}
                  onClick={() => onRowClick(t)}
                  style={{
                    cursor: "pointer",
                    background: sel ? "rgb(231,241,255)" : (i % 2 === 0 ? "rgb(248,248,248)" : "white"),
                  }}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = "rgb(240,247,255)"; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = i % 2 === 0 ? "rgb(248,248,248)" : "white"; }}
                >
                  <td style={{
                    position: "sticky", left: 0, zIndex: 1, background: "inherit",
                    padding: "12px 20px", borderBottom: `1px solid ${SP_BORDER_LT}`,
                    boxShadow: "2px 0 0 0 rgba(0,0,0,0.04)",
                  }}>
                    <span style={{
                      fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_TEXT,
                    }}>{t.name}</span>
                    <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED, marginTop: 2 }}>
                      {t.classes} classes · {t.students} students
                    </div>
                  </td>
                  {standards.map(s => (
                    <td key={s} style={{ padding: "12px 20px", borderBottom: `1px solid ${SP_BORDER_LT}` }}>
                      <ScoreCell score={t.scores[s]} mode={mode} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 20px", borderTop: `1px solid ${SP_BORDER_LT}`, background: "white",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_TEXT }}>Show student rows</span>
          <select value={pageSize} onChange={e => onPageChange(0, +e.target.value)} style={{
            border: `1px solid ${SP_BORDER}`, borderRadius: 4, padding: "4px 8px",
            fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_TEXT,
          }}>
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_TEXT }}>
            {start + 1} – {Math.min(start + pageSize, totalRows)} of {totalRows}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button disabled={page === 0} onClick={() => onPageChange(0, pageSize)}
              style={pgBtn(page === 0)}><Icons.ChevronDoubleLeft size={14} /></button>
            <button disabled={page === 0} onClick={() => onPageChange(page - 1, pageSize)}
              style={pgBtn(page === 0)}><Icons.ChevronLeft size={14} /></button>
            <button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1, pageSize)}
              style={pgBtn(page >= totalPages - 1)}><Icons.ChevronRight size={14} /></button>
            <button disabled={page >= totalPages - 1} onClick={() => onPageChange(totalPages - 1, pageSize)}
              style={pgBtn(page >= totalPages - 1)}><Icons.ChevronDoubleRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

const pgBtn = (disabled) => ({
  width: 28, height: 28, border: "none", background: "transparent",
  borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center",
});

Object.assign(window, { TeacherTable, ScoreCell });
