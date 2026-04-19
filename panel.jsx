// Teacher detail side panel — student drill-down

function TeacherPanel({ teacher, standards, onClose, mode }) {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    if (teacher) setStudents(window.SP_DATA.generateStudents(teacher));
  }, [teacher]);

  if (!teacher) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100,
      }} />
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 720, maxWidth: "92vw",
        background: "white", boxShadow: "-12px 0 32px rgba(0,0,0,0.15)", zIndex: 101,
        display: "flex", flexDirection: "column",
        animation: "spSlide 0.22s ease-out",
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: `1px solid ${SP_BORDER_LT}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_GREY, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
              Teacher detail
            </div>
            <div style={{ fontFamily: "Noto Serif, serif", fontWeight: 700, fontSize: 24, color: SP_TEXT }}>
              {teacher.name}
            </div>
            <div style={{ fontFamily: "Circular, sans-serif", fontSize: 14, color: SP_MUTED, marginTop: 4 }}>
              {teacher.classes} classes · {teacher.students} students · Class avg <b style={{ color: SP_TEXT }}>{teacher.avg}%</b>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 4,
          }}><Icons.Close size={20} stroke={SP_TEXT} /></button>
        </div>

        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${SP_BORDER_LT}` }}>
          <div style={{ fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 14, color: SP_TEXT, marginBottom: 10 }}>
            Performance by standard
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {standards.slice(0, 8).map(s => {
              const sc = teacher.scores[s];
              return (
                <div key={s} style={{
                  padding: "6px 10px", borderRadius: 16, border: `1px solid ${SP_BORDER_LT}`,
                  display: "flex", alignItems: "center", gap: 6, background: SP_BG,
                }}>
                  <span style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_TEXT, fontWeight: 700 }}>{s}</span>
                  <span style={{ fontFamily: "Circular, sans-serif", fontSize: 12, color: SP_MUTED }}>
                    {sc ? `${sc.pct}%` : "NA"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          <div style={{ fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 14, color: SP_TEXT, marginBottom: 12 }}>
            Students ({students.length})
          </div>
          <div style={{
            border: `1px solid ${SP_BORDER_LT}`, borderRadius: 8, overflow: "hidden",
            background: "white",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "max-content", minWidth: "100%" }}>
                <thead>
                  <tr style={{ background: SP_BG }}>
                    <th style={hSt}>Student</th>
                    <th style={hSt}>Avg</th>
                    {standards.slice(0, 6).map(s => <th key={s} style={hSt}>{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, i) => (
                    <tr key={st.id} style={{ background: i % 2 ? "white" : SP_BG }}>
                      <td style={cSt}>
                        <span style={{ fontFamily: "Circular, sans-serif", fontSize: 13, color: SP_LINK, textDecoration: "underline" }}>
                          {st.name}
                        </span>
                      </td>
                      <td style={cSt}>
                        <span style={{ fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 13, color: SP_TEXT }}>{st.avg}%</span>
                      </td>
                      {standards.slice(0, 6).map(s => {
                        const sc = st.scores[s];
                        return (
                          <td key={s} style={cSt}>
                            {sc ? (
                              <span style={{
                                fontFamily: "Circular, sans-serif", fontSize: 13,
                                color: SP_TEXT,
                              }}>{sc.pct}%</span>
                            ) : (
                              <span style={{ fontFamily: "Circular, sans-serif", fontSize: 13, color: SP_MUTED }}>NA</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

const hSt = {
  padding: "10px 14px", textAlign: "left", borderBottom: `1px solid ${SP_BORDER_LT}`,
  fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 12, color: SP_TEXT,
  whiteSpace: "nowrap",
};
const cSt = {
  padding: "10px 14px", borderBottom: `1px solid ${SP_BORDER_LT}`,
  fontFamily: "Circular, sans-serif", fontSize: 13, color: SP_TEXT, whiteSpace: "nowrap",
};

Object.assign(window, { TeacherPanel });
