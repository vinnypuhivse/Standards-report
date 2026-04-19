// Mock data for the Standards Performance report

window.SP_DATA = (() => {
  const SCHOOLS = [
    "Brooksville K-12 School",
    "Westgate Middle School",
    "Northview High School",
    "Oakridge Elementary",
    "Riverbend Academy",
    "All schools (district)",
  ];

  const GRADE_BANDS = [
    "All Grade bands (TBD)",
    "Elementary (K-5)",
    "Middle School (6-8)",
    "High School (9-12)",
  ];

  const STANDARD_GRADES = [
    "All Standard Grades",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9-10",
    "Grade 11-12",
  ];

  const DATE_RANGES = [
    "Aug to date",
    "Last 30 days",
    "Last 90 days",
    "This semester",
    "This school year",
    "Custom range\u2026",
  ];

  // Topics: 78 of them. Each has { name, gradeBand (optional), pct, questions, newselaAvg }
  const TOPIC_NAMES = [
    "Compare and Contrast", "Cause and Effect", "Cite Textual Evidence",
    "Author's Argument", "Sound Devices", "Evaluating Texts", "Fluent Reading",
    "Main Idea", "Summarizing", "Inference", "Point of View",
    "Text Structure", "Word Choice", "Figurative Language", "Theme",
    "Character Development", "Plot Analysis", "Setting Analysis",
    "Mood and Tone", "Symbolism", "Allusion", "Imagery",
    "Argument Analysis", "Rhetorical Devices", "Logical Fallacies",
    "Claim and Counterclaim", "Evidence Evaluation", "Source Credibility",
    "Synthesizing Sources", "Research Skills", "Annotation",
    "Vocabulary in Context", "Multiple Meaning Words", "Word Roots",
    "Prefixes and Suffixes", "Greek and Latin Roots", "Context Clues",
    "Denotation and Connotation", "Connotative Meaning", "Tone Words",
    "Sentence Structure", "Paragraph Structure", "Transitions",
    "Coherence", "Narrative Pacing", "Dialogue Analysis",
    "Point of View Shifts", "Unreliable Narrator", "Foreshadowing",
    "Flashback", "Irony", "Satire", "Parody",
    "Genre Conventions", "Historical Context", "Cultural Context",
    "Author's Background", "Reader Response", "Critical Lens",
    "Compare Across Texts", "Intertextuality", "Adaptation Analysis",
    "Visual Literacy", "Media Analysis", "Digital Sources",
    "Primary vs Secondary", "Bias Detection", "Fact vs Opinion",
    "Inference from Data", "Graphic Interpretation", "Diagram Reading",
    "Map Reading", "Timeline Analysis", "Cause-Effect Chains",
    "Sequence of Events", "Problem-Solution", "Compare-Contrast Essays",
    "Persuasive Techniques", "Hyperbole",
  ];

  const GRADE_LABELS = ["High School", "Middle School", "Elementary"];

  // Stable pseudo-random based on index
  function seedRand(i) {
    const x = Math.sin(i * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }

  const TOPICS = TOPIC_NAMES.map((name, i) => {
    const r = seedRand(i + 1);
    let pct;
    if (i < 4) pct = 91 - i * 10; // top performers
    else if (i >= 5 && i <= 7) pct = 17 + (i - 5) * 8; // bottom performers
    else pct = Math.round(35 + r * 50);
    const grade = GRADE_LABELS[Math.floor(seedRand(i + 100) * 3)];
    return {
      id: `topic-${i}`,
      name,
      gradeBand: grade,
      pct: Math.max(8, Math.min(99, pct)),
      questions: 60 + Math.floor(seedRand(i + 50) * 220),
      newselaAvg: 70 + Math.floor(seedRand(i + 200) * 18),
    };
  });

  // Standards: 32 reading comprehension standards
  const STANDARDS = [
    "RI.7.1", "RI.7.2", "RI.7.3", "RI.7.4", "RI.7.5", "RI.7.6", "RI.7.8", "RI.7.9",
    "RI.8.1", "RI.8.2", "RI.8.3", "RI.8.4", "RI.8.5", "RI.8.6", "RI.8.8", "RI.8.9",
    "RI.9-10.1", "RI.9-10.2", "RI.9-10.3", "RI.9-10.4", "RI.9-10.5", "RI.9-10.6",
    "RI.9-10.7", "RI.9-10.8", "RI.9-10.9",
    "RI.11-12.1", "RI.11-12.2", "RI.11-12.3", "RI.11-12.4", "RI.11-12.5",
    "RI.11-12.6", "RI.11-12.7",
  ];

  const STANDARD_DESCRIPTIONS = {
    "RI.7.1": "Cite several pieces of textual evidence to support analysis.",
    "RI.7.2": "Determine two or more central ideas in a text.",
    "RI.8.1": "Cite the textual evidence that most strongly supports an analysis.",
    "RI.9-10.1": "Cite strong and thorough textual evidence to support analysis.",
    "RI.9-10.2": "Determine a central idea of a text and analyze its development.",
    "RI.9-10.5": "Analyze in detail how an author's ideas are developed and refined.",
    "RI.9-10.6": "Determine an author's point of view or purpose.",
    "RI.9-10.7": "Analyze various accounts of a subject in different mediums.",
    "RI.9-10.8": "Delineate and evaluate the argument and specific claims.",
    "RI.9-10.9": "Analyze seminal U.S. documents of historical significance.",
  };

  // Teachers: 32 of them
  const TEACHER_NAMES = [
    "Benson, Amy", "Clavicle, Brian", "Denver, Evan", "Faith, Gail",
    "Hill, Ira", "Jacob, Kira", "Lee, Marcus", "Nguyen, Olivia",
    "Patel, Quincy", "Romero, Sasha", "Tanaka, Uma", "Vasquez, Wren",
    "Xu, Yara", "Zimmer, Aiden", "Brooks, Bailey", "Carter, Cameron",
    "Diaz, Devon", "Ellis, Erin", "Foster, Finley", "Garza, Gray",
    "Hayes, Harper", "Ito, Indigo", "Jordan, Justice", "Khan, Kai",
    "Lopez, Lior", "Murphy, Morgan", "Novak, Noor", "Owens, Ocean",
    "Park, Parker", "Quinn, Riley", "Reed, Rowan", "Sato, Sage",
  ];

  // Generate per-(teacher, standard) score
  function teacherScore(ti, si) {
    const r = seedRand(ti * 100 + si + 1);
    if (r < 0.06) return null; // NA
    // Skill level varies per teacher
    const skill = 0.35 + seedRand(ti + 17) * 0.55;
    const variance = (seedRand(ti * 7 + si) - 0.5) * 0.35;
    const pct = Math.max(8, Math.min(99, Math.round((skill + variance) * 100)));
    const questions = 2 + Math.floor(seedRand(ti * 13 + si) * 9);
    return { pct, questions };
  }

  const TEACHERS = TEACHER_NAMES.map((name, ti) => {
    const scores = {};
    STANDARDS.forEach((s, si) => { scores[s] = teacherScore(ti, si); });
    const valid = Object.values(scores).filter(s => s);
    const avg = Math.round(valid.reduce((a, b) => a + b.pct, 0) / valid.length);
    return {
      id: `teacher-${ti}`,
      name,
      scores,
      avg,
      classes: 2 + Math.floor(seedRand(ti + 5) * 4),
      students: 60 + Math.floor(seedRand(ti + 9) * 80),
    };
  });

  // Students per teacher (for drill-down)
  const STUDENT_FIRST = ["Aiden", "Bella", "Carlos", "Diana", "Eli", "Fiona", "Gabriel", "Hana", "Isaac", "Jade", "Kai", "Luna", "Mateo", "Nia", "Omar", "Priya", "Quinn", "Riya", "Sebastian", "Tess"];
  const STUDENT_LAST = ["Adams", "Brown", "Chen", "Davis", "Evans", "Flores", "Garcia", "Hayes", "Ivanov", "Johnson", "Kim", "Lopez", "Martinez", "Nguyen", "O'Brien", "Patel", "Quintero", "Reyes", "Singh", "Taylor"];

  function generateStudents(teacher) {
    const n = 18 + Math.floor(seedRand(teacher.id.length + 3) * 8);
    return Array.from({ length: n }, (_, i) => {
      const f = STUDENT_FIRST[(i * 3 + 1) % STUDENT_FIRST.length];
      const l = STUDENT_LAST[(i * 7 + 2) % STUDENT_LAST.length];
      const scores = {};
      STANDARDS.forEach((s, si) => {
        const r = seedRand(i * 31 + si + teacher.id.length);
        if (r < 0.1) scores[s] = null;
        else {
          const tScore = teacher.scores[s];
          const base = tScore ? tScore.pct : 60;
          const v = (seedRand(i * 11 + si + 3) - 0.5) * 30;
          scores[s] = { pct: Math.max(0, Math.min(100, Math.round(base + v))), questions: 1 + Math.floor(seedRand(i + si) * 8) };
        }
      });
      const valid = Object.values(scores).filter(s => s);
      const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b.pct, 0) / valid.length) : 0;
      return { id: `student-${teacher.id}-${i}`, name: `${l}, ${f}`, scores, avg };
    });
  }

  return {
    SCHOOLS, GRADE_BANDS, STANDARD_GRADES, DATE_RANGES,
    TOPICS, STANDARDS, STANDARD_DESCRIPTIONS, TEACHERS,
    generateStudents,
  };
})();
