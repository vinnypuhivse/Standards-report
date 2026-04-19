// Main app — Standards Performance prototype

const { useMemo, useState: useS, useEffect: useE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "scoreCellMode": "bar",
  "fontFamily": "Nunito"
}/*EDITMODE-END*/;

function readTweaks() {
  try {
    const raw = localStorage.getItem("sp_tweaks");
    return raw ? { ...TWEAK_DEFAULTS, ...JSON.parse(raw) } : { ...TWEAK_DEFAULTS };
  } catch { return { ...TWEAK_DEFAULTS }; }
}

function App() {
  const D = window.SP_DATA;
  const [school, setSchool] = useS(D.SCHOOLS[0]);
  const [gradeBand, setGradeBand] = useS(D.GRADE_BANDS[0]);
  const [stdGrade, setStdGrade] = useS(D.STANDARD_GRADES[0]);
  const [dateRange, setDateRange] = useS(D.DATE_RANGES[0]);

  const [openSections, setOpenSections] = useS({ high: true, low: true, all: false });
  const [selectedTeacher, setSelectedTeacher] = useS(null);
  const [topicGroup, setTopicGroup] = useS("Highest performing topics");
  const [sortKey, setSortKey] = useS("name");
  const [sortDir, setSortDir] = useS("asc");
  const [page, setPage] = useS(0);
  const [pageSize, setPageSize] = useS(25);
  const [tweaks, setTweaks] = useS(readTweaks);
  const [tweaksOpen, setTweaksOpen] = useS(false);

  // Apply font tweak to root
  useE(() => {
    document.documentElement.style.setProperty("--sp-font", `"${tweaks.fontFamily}"`);
  }, [tweaks.fontFamily]);

  // Tweak mode wiring
  useE(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  function updateTweak(k, v) {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    try { localStorage.setItem("sp_tweaks", JSON.stringify(next)); } catch {}
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  }

  // Filtering: use school/grade-band as a deterministic pseudo-filter on data
  const seedKey = `${school}|${gradeBand}|${stdGrade}|${dateRange}`;
  const seed = useMemo(() => {
    let h = 0; for (let i = 0; i < seedKey.length; i++) h = (h * 31 + seedKey.charCodeAt(i)) | 0;
    return Math.abs(h);
  }, [seedKey]);

  const adjustedTopics = useMemo(() => {
    return D.TOPICS.map((t, i) => {
      const r = ((seed + i * 17) % 1000) / 1000;
      const delta = Math.round((r - 0.5) * 14);
      return { ...t, pct: Math.max(8, Math.min(99, t.pct + delta)) };
    });
  }, [seed]);

  const adjustedTeachers = useMemo(() => {
    return D.TEACHERS.map((t, i) => {
      const r = ((seed + i * 11) % 1000) / 1000;
      const delta = Math.round((r - 0.5) * 12);
      const newScores = {};
      Object.entries(t.scores).forEach(([k, v]) => {
        if (v) newScores[k] = { ...v, pct: Math.max(8, Math.min(99, v.pct + delta)) };
        else newScores[k] = v;
      });
      const valid = Object.values(newScores).filter(s => s);
      const avg = Math.round(valid.reduce((a, b) => a + b.pct, 0) / valid.length);
      return { ...t, scores: newScores, avg };
    });
  }, [seed]);

  const sortedByPct = [...adjustedTopics].sort((a, b) => b.pct - a.pct);

  // Filter topics by grade band selection
  const gradeBandFilter = useMemo(() => {
    if (gradeBand.startsWith("All")) return null;
    if (gradeBand.startsWith("Elementary")) return "Elementary";
    if (gradeBand.startsWith("Middle")) return "Middle School";
    if (gradeBand.startsWith("High")) return "High School";
    return null;
  }, [gradeBand]);

  const filteredTopics = useMemo(() => {
    if (!gradeBandFilter) return sortedByPct;
    return sortedByPct.filter(t => t.gradeBand === gradeBandFilter);
  }, [sortedByPct, gradeBandFilter]);

  // Highest / Lowest pulled from filtered set
  const highest = filteredTopics.slice(0, 4);
  const lowest = filteredTopics.slice(-4).reverse();

  const sortedTeachers = useMemo(() => {
    const arr = [...adjustedTeachers];
    arr.sort((a, b) => {
      let av, bv;
      if (sortKey === "name") { av = a.name; bv = b.name; }
      else if (sortKey === "avg") { av = a.avg; bv = b.avg; }
      else { av = a.scores[sortKey]?.pct ?? -1; bv = b.scores[sortKey]?.pct ?? -1; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [adjustedTeachers, sortKey, sortDir]);

  function handleSort(k) {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir(k === "name" ? "asc" : "desc"); }
    setPage(0);
  }

  // table standards: based on group selection
  const tableStandards = useMemo(() => {
    const all = D.STANDARDS;
    if (topicGroup === "Highest performing topics") return all.slice(16, 25);
    if (topicGroup === "Lowest performing topics") return all.slice(0, 9);
    return all.slice(0, 12);
  }, [topicGroup]);

  return (
    <div style={{ minHeight: "100vh", background: "white", display: "flex", flexDirection: "column" }}>
      <TopNav />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "24px 40px 80px 40px", minWidth: 0 }}>
          <Breadcrumb />

          <h1 style={{
            fontFamily: "'Noto Serif', serif", fontWeight: 700, fontSize: 32,
            color: SP_TEXT, margin: "0 0 24px 0",
          }}>Standards performance</h1>

          {/* Filters */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 2fr) 1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
            <ComboBox label="Select School" value={school} options={D.SCHOOLS} onChange={setSchool} />
            <ComboBox label="Grade Bands" value={gradeBand} options={D.GRADE_BANDS} onChange={setGradeBand} />
            <ComboBox label="Standard Grade Level" value={stdGrade} options={D.STANDARD_GRADES} onChange={setStdGrade} />
            <ComboBox label="Date Range" value={dateRange} options={D.DATE_RANGES} onChange={setDateRange} />
          </div>

          {/* Section: topics */}
          <section style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <h2 style={h2}>Reading Comprehension Performance by Topic</h2>
              <button style={dlBtn}><Icons.Download size={16} stroke={SP_LINK} /> Download as .csv</button>
            </div>
            <p style={pSt}>
              See school performance by broader standards topics. Topics group related standards to give you
              a clear view of overall coverage and mastery. Percentages show the average quiz score on
              standards within the topic, so you can quickly spot strengths and learning gaps.
            </p>
          </section>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <CollapsiblePanel title="Highest Performing Topics" controlled isOpen={openSections.high}
              onToggle={() => setOpenSections(s => ({ ...s, high: !s.high }))}>
              <TopicGrid topics={highest} />
            </CollapsiblePanel>
            <CollapsiblePanel title="Lowest Performing Topics" controlled isOpen={openSections.low}
              onToggle={() => setOpenSections(s => ({ ...s, low: !s.low }))}>
              <TopicGrid topics={lowest} />
            </CollapsiblePanel>
            <CollapsiblePanel title={`Performance on all ${filteredTopics.length} Topics`} controlled isOpen={openSections.all}
              onToggle={() => setOpenSections(s => ({ ...s, all: !s.all }))}>
              <AllTopicsList topics={filteredTopics} />
            </CollapsiblePanel>
          </div>

          {/* Section: teachers */}
          <section style={{ marginBottom: 16 }}>
            <h2 style={h2}>Reading Comprehension Standards by Teacher</h2>
            <p style={pSt}>
              Explore how each teacher is performing on specific standards. Use this section to pinpoint
              which standards students have mastered and where they may need additional support.
            </p>
          </section>

          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <select value={topicGroup} onChange={e => { setTopicGroup(e.target.value); setPage(0); }}
                style={{
                  appearance: "none", padding: "12px 40px 12px 16px",
                  border: `1px solid ${SP_BORDER}`, borderRadius: 4, background: "white",
                  fontFamily: "Circular, sans-serif", fontSize: 14, fontWeight: 700, color: SP_TEXT,
                  cursor: "pointer", minWidth: 270,
                }}>
                <option>Highest performing topics</option>
                <option>Lowest performing topics</option>
                <option>All standards</option>
              </select>
              <Icons.ChevronDown size={16} stroke={SP_TEXT}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
            <span style={{ fontFamily: "Circular, sans-serif", fontSize: 13, color: SP_MUTED }}>
              Click any teacher row to see student detail
            </span>
          </div>

          <TeacherTable
            teachers={sortedTeachers}
            standards={tableStandards}
            mode={tweaks.scoreCellMode}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onRowClick={t => setSelectedTeacher(t)}
            page={page}
            pageSize={pageSize}
            onPageChange={(p, s) => { setPage(p); setPageSize(s); }}
            totalRows={sortedTeachers.length}
            selectedTeacherId={selectedTeacher?.id}
          />
        </main>
      </div>

      <TeacherPanel teacher={selectedTeacher} standards={D.STANDARDS}
        onClose={() => setSelectedTeacher(null)} mode={tweaks.scoreCellMode} />

      {tweaksOpen && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, width: 280, background: "white",
          borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.18)", border: `1px solid ${SP_BORDER}`,
          padding: 16, zIndex: 200,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 16, color: SP_TEXT }}>Tweaks</span>
            <button onClick={() => setTweaksOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Icons.Close size={16} stroke={SP_TEXT} />
            </button>
          </div>
          <div style={{ fontFamily: "inherit", fontSize: 12, color: SP_MUTED, marginBottom: 6 }}>
            Score cell style
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["bar", "circle"].map(m => (
              <button key={m} onClick={() => updateTweak("scoreCellMode", m)}
                style={{
                  flex: 1, padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${tweaks.scoreCellMode === m ? SP_LINK : SP_BORDER}`,
                  background: tweaks.scoreCellMode === m ? "rgb(231,241,255)" : "white",
                  fontFamily: "inherit", fontSize: 13, fontWeight: 700, color: SP_TEXT,
                  textTransform: "capitalize",
                }}>{m === "bar" ? "Bar chart" : "Percent circle"}</button>
            ))}
          </div>
          <div style={{ fontFamily: "inherit", fontSize: 12, color: SP_MUTED, marginTop: 14, marginBottom: 6 }}>
            Font (Circular substitute)
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Nunito", "Mulish", "Inter"].map(f => (
              <button key={f} onClick={() => updateTweak("fontFamily", f)}
                style={{
                  flex: 1, padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${tweaks.fontFamily === f ? SP_LINK : SP_BORDER}`,
                  background: tweaks.fontFamily === f ? "rgb(231,241,255)" : "white",
                  fontFamily: `"${f}", sans-serif`, fontSize: 13, fontWeight: 700, color: SP_TEXT,
                }}>{f}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const h2 = {
  fontFamily: "Circular, sans-serif", fontWeight: 700, fontSize: 24,
  color: SP_TEXT, margin: "0 0 8px 0",
};
const pSt = {
  fontFamily: "Circular, sans-serif", fontSize: 16, lineHeight: 1.6,
  color: "rgb(66,65,71)", margin: "0 0 24px 0", maxWidth: 1100,
};
const dlBtn = {
  display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
  cursor: "pointer", color: SP_LINK, fontFamily: "Circular, sans-serif", fontSize: 14, fontWeight: 700,
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
