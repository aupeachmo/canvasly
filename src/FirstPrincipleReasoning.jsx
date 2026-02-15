import { useState, useEffect, useRef } from "react";

const DEFAULT_DATA = {
  problemName: "",
  clarification: "",
  probingAssumptions: "",
  probingReasons: "",
  implications: "",
  differentViewpoints: "",
  questioningQuestion: "",
};

const BLOCK_CONFIG = [
  { key: "clarification", label: "Clarification", prompt: "What do you mean by...?", color: "#9b7bc8", icon: "\u{1F4AD}" },
  { key: "probingAssumptions", label: "Probing assumptions", prompt: "What could we assume instead?", color: "#c97b4b", icon: "\u{1F9E0}" },
  { key: "probingReasons", label: "Probing reasons / evidence", prompt: "Why do you think this is true?", color: "#4a7a9b", icon: "\u{1F4DA}" },
  { key: "implications", label: "Implications and consequences", prompt: "What effect would that have?", color: "#5b8a72", icon: "\u{1F4C9}" },
  { key: "differentViewpoints", label: "Different viewpoints", prompt: "What would be an alternative?", color: "#9e8a4e", icon: "\u{1F504}" },
  { key: "questioningQuestion", label: "Questioning the original question", prompt: "What was the point of this question?", color: "#6b8f8a", icon: "\u{1F4AC}" },
];

const EXAMPLE_DATA = {
  problemName: "Should we build feature X?",
  clarification: "By 'feature X' we mean the new dashboard that shows real-time analytics. By 'we' we mean the product team with current bandwidth.",
  probingAssumptions: "We might assume users want more data on one screen; we could instead assume they want fewer, clearer metrics. We might assume our backend can support real-time; we could assume we need to batch updates.",
  probingReasons: "User interviews showed requests for 'more numbers'; support tickets mentioned slow report generation. We haven't validated whether real-time is necessary vs. 'updated hourly'.",
  implications: "If we build it: more engineering time, possible performance issues, and a new surface to maintain. If we don't: we keep focus on reliability and might use a simpler 'daily digest' first.",
  differentViewpoints: "Engineering might prefer an API-first approach; design might want a mobile-first summary; support might prefer better export of existing reports instead of a new dashboard.",
  questioningQuestion: "The point was to decide how to invest the next quarter. The real question might be: 'What's the smallest change that improves decisions?' rather than 'Build feature X or not?'.",
};

const DOCS_KEY = "canvasly-fpr-documents";
const COMPACT_BREAKPOINT = 768;

function newId() {
  return crypto.randomUUID();
}

function loadSavedDocs() {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (raw) {
      const docs = JSON.parse(raw);
      if (Object.keys(docs).length > 0) return docs;
    }
  } catch { /* ignore corrupt data */ }
  return null;
}

function persistDocs(docs) {
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
}

function FprBlock({ config, value, onChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <div
      className="no-break"
      style={{
        background: "#1a1a1a",
        padding: "16px 14px",
        position: "relative",
        overflow: "hidden",
        borderTop: `3px solid ${config.color}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{
        fontSize: "0.6rem",
        fontWeight: 600,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        marginBottom: "6px",
        color: config.color,
        display: "flex",
        alignItems: "center",
        gap: "5px",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "0.8rem" }}>{config.icon}</span>
        {config.label}
      </div>
      <div style={{
        fontSize: "0.7rem",
        color: "#666",
        marginBottom: "8px",
        fontStyle: "italic",
      }}>
        {config.prompt}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        placeholder="Type your answer..."
        rows={3}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#8a8580",
          fontSize: "0.78rem",
          lineHeight: "1.5",
          fontFamily: "'DM Sans', sans-serif",
          width: "100%",
          padding: "2px 0",
          resize: "none",
          overflow: "hidden",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          flex: 1,
          minHeight: 60,
        }}
      />
    </div>
  );
}

function DocDropdown({ documents, activeDocId, onSelect, onNew, onDelete, onDeleteAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const entries = Object.entries(documents).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
  const activeDoc = activeDocId && documents[activeDocId];
  const label = activeDoc ? (activeDoc.data.problemName || "Untitled") : "My Canvases";

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#1a1a1a", border: "1px solid #2a2a2a",
          color: "#8a8580", padding: "8px 16px", borderRadius: 6,
          cursor: "pointer", fontSize: "0.78rem",
          fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
          display: "flex", alignItems: "center", gap: 6,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#e8e4df"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#8a8580"; }}
      >
        {"\u{1F4CB}"} {label} {"\u25BE"}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", border: "1px solid #333", borderRadius: 8,
          minWidth: 260, zIndex: 100, overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {entries.map(([id, doc]) => (
            <div
              key={id}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px", cursor: "pointer",
                background: id === activeDocId ? "#252525" : "transparent",
                borderLeft: id === activeDocId ? "2px solid #5b8a72" : "2px solid transparent",
              }}
              onClick={() => { onSelect(id); setOpen(false); }}
              onMouseEnter={(e) => { if (id !== activeDocId) e.currentTarget.style.background = "#1f1f1f"; }}
              onMouseLeave={(e) => { if (id !== activeDocId) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                <div style={{
                  fontSize: "0.78rem",
                  color: id === activeDocId ? "#e8e4df" : "#8a8580",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {doc.data.problemName || "Untitled"}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                style={{
                  background: "none", border: "none", color: "#444",
                  cursor: "pointer", padding: "2px 4px", fontSize: "0.7rem", flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#b5564e"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#444"; }}
              >{"\u2715"}</button>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #2a2a2a" }}>
            <div
              onClick={() => { onNew(); setOpen(false); }}
              style={{ padding: "8px 14px", cursor: "pointer", color: "#5b8a72", fontSize: "0.78rem" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1f1f1f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >+ New Canvas</div>
            {entries.length > 1 && (
              <div
                onClick={() => { onDeleteAll(); setOpen(false); }}
                style={{ padding: "8px 14px", cursor: "pointer", color: "#b5564e", fontSize: "0.78rem" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1f1f1f"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Delete All</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getInitialState() {
  const saved = loadSavedDocs();
  if (saved && Object.keys(saved).length > 0) {
    const entries = Object.entries(saved).sort((a, b) => b[1].updatedAt - a[1].updatedAt);
    const [latestId, latestDoc] = entries[0];
    return {
      documents: saved,
      activeDocId: latestId,
      data: { ...DEFAULT_DATA, ...latestDoc.data },
      pending: null,
    };
  }
  return {
    documents: {},
    activeDocId: newId(),
    data: DEFAULT_DATA,
    pending: null,
  };
}

export default function FirstPrincipleReasoning() {
  const initialRef = useRef(null);
  if (initialRef.current === null) initialRef.current = getInitialState();

  const [documents, setDocuments] = useState(initialRef.current.documents);
  const [activeDocId, setActiveDocId] = useState(initialRef.current.activeDocId);
  const [data, setData] = useState(initialRef.current.data);
  const [pending, setPending] = useState(initialRef.current.pending);
  const resolved = pending === null;
  const docsRef = useRef({ ...initialRef.current.documents });

  const [compact, setCompact] = useState(() => window.innerWidth < COMPACT_BREAKPOINT);

  useEffect(() => {
    function onResize() {
      setCompact(window.innerWidth < COMPACT_BREAKPOINT);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!resolved || !activeDocId) return;
    const updated = { ...docsRef.current, [activeDocId]: { data, updatedAt: Date.now() } };
    docsRef.current = updated;
    setDocuments(updated);
    persistDocs(updated);
  }, [data, resolved, activeDocId]);

  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const restoreDoc = (id) => {
    if (!pending) return;
    setData({ ...DEFAULT_DATA, ...pending[id].data });
    setActiveDocId(id);
    docsRef.current = pending;
    setDocuments(pending);
    setPending(null);
  };

  const startFresh = () => {
    if (pending) {
      docsRef.current = pending;
      setDocuments(pending);
    }
    setActiveDocId(newId());
    setData(DEFAULT_DATA);
    setPending(null);
  };

  const discardAll = () => {
    localStorage.removeItem(DOCS_KEY);
    docsRef.current = {};
    setDocuments({});
    setActiveDocId(newId());
    setPending(null);
  };

  const selectDoc = (id) => {
    if (id === activeDocId) return;
    const doc = docsRef.current[id];
    if (!doc) return;
    setData({ ...DEFAULT_DATA, ...doc.data });
    setActiveDocId(id);
  };

  const newCanvas = () => {
    setActiveDocId(newId());
    setData(DEFAULT_DATA);
  };

  const deleteDoc = (id) => {
    const next = { ...docsRef.current };
    delete next[id];
    docsRef.current = next;
    setDocuments(next);
    if (Object.keys(next).length > 0) {
      persistDocs(next);
    } else {
      localStorage.removeItem(DOCS_KEY);
    }
    if (id === activeDocId) {
      const keys = Object.keys(next);
      if (keys.length > 0) {
        setData({ ...DEFAULT_DATA, ...next[keys[0]].data });
        setActiveDocId(keys[0]);
      } else {
        setActiveDocId(newId());
        setData(DEFAULT_DATA);
      }
    }
  };

  const deleteAllDocs = () => {
    localStorage.removeItem(DOCS_KEY);
    docsRef.current = {};
    setDocuments({});
    setActiveDocId(newId());
    setData(DEFAULT_DATA);
  };

  const loadExample = () => setData(EXAMPLE_DATA);
  const clearCanvas = () => setData(DEFAULT_DATA);

  const handleExportPDF = () => {
    setCompact(false);
    setTimeout(() => {
      document.querySelectorAll(".print-area textarea").forEach((el) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      });
      const style = document.createElement("style");
      style.textContent = `
        @page { size: A4; margin: 10mm; }
        @media print {
          *, *::before, *::after {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          body { background: #fff !important; }
          body * { visibility: hidden !important; }
          .print-area, .print-area * { visibility: visible !important; }
          .print-area {
            position: fixed !important; top: 0; left: 0;
            width: 100vw; height: 100vh;
            padding: 20px !important;
            background: #fff !important;
          }
          .print-area input, .print-area textarea {
            color: #333 !important;
          }
          .print-area input::placeholder, .print-area textarea::placeholder { color: transparent !important; }
          .no-break { background: #fff !important; }
          .canvas-attribution { color: #999 !important; opacity: 1 !important; }
          .print-hide { display: none !important; }
        }
      `;
      document.head.appendChild(style);
      window.print();
      setTimeout(() => {
        document.head.removeChild(style);
        setCompact(window.innerWidth < COMPACT_BREAKPOINT);
      }, 500);
    }, 100);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "first-principle-reasoning.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        setData({ ...DEFAULT_DATA, ...imported });
      } catch { alert("Invalid JSON file"); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const docCount = Object.keys(documents).length;
  const pendingEntries = pending ? Object.entries(pending).sort((a, b) => b[1].updatedAt - a[1].updatedAt) : [];

  return (
    <div style={{
      background: "#0f0f0f",
      minHeight: "100vh",
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e8e4df",
      backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(201,123,75,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(91,138,114,0.05) 0%, transparent 50%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {pending && (
        <div className="print-hide" style={{
          margin: "0 auto 16px", padding: "16px 20px",
          background: "#1a1f1c", border: "1px solid #5b8a7244",
          borderRadius: 8,
        }}>
          <div style={{ color: "#8a8580", fontSize: "0.82rem", marginBottom: 12 }}>
            You have {pendingEntries.length} saved canvas{pendingEntries.length !== 1 ? "es" : ""}. Pick one to restore or start fresh.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {pendingEntries.map(([id, doc]) => (
              <button
                key={id}
                onClick={() => restoreDoc(id)}
                style={{
                  background: "#252525", border: "1px solid #333", color: "#e8e4df",
                  padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                  fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
                  textAlign: "left", transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#5b8a72"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#333"; }}
              >
                {doc.data.problemName || "Untitled"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={startFresh} style={{
              background: "#5b8a72", border: "none", color: "#fff",
              padding: "6px 14px", borderRadius: 5, cursor: "pointer",
              fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
            }}>Start Fresh</button>
            <button onClick={discardAll} style={{
              background: "transparent", border: "1px solid #444",
              color: "#8a8580", padding: "6px 14px", borderRadius: 5,
              cursor: "pointer", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
            }}>Discard All</button>
          </div>
        </div>
      )}

      <div className="print-area">
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            color: "#8a8580", fontSize: "0.75rem", letterSpacing: "2px",
            textTransform: "uppercase", marginBottom: "4px",
          }}>
            First Principle Reasoning
          </div>
          <input
            value={data.problemName}
            onChange={(e) => update("problemName", e.target.value)}
            placeholder="Problem or question name"
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#e8e4df", fontFamily: "'DM Serif Display', serif",
              fontSize: "1.75rem", textAlign: "center", width: "100%",
              letterSpacing: "-0.5px",
            }}
          />
        </div>

        <div className="canvas-grid" style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "repeat(2, 1fr)",
          gap: "2px",
          margin: "0 auto",
          maxWidth: compact ? "100%" : 900,
          background: "#2a2a2a",
          border: "2px solid #2a2a2a",
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {BLOCK_CONFIG.map((cfg) => (
            <FprBlock
              key={cfg.key}
              config={cfg}
              value={data[cfg.key]}
              onChange={(v) => update(cfg.key, v)}
            />
          ))}
        </div>

        <div className="canvas-attribution" style={{
          textAlign: "center", marginTop: 16, color: "#8a8580",
          fontSize: "0.65rem", letterSpacing: 1, textTransform: "uppercase", opacity: "0.4",
        }}>
          Socratic questioning for first-principle thinking
        </div>
      </div>

      <div className="print-hide" style={{
        display: "flex", justifyContent: "center", gap: 8,
        marginTop: 20, flexWrap: "wrap", alignItems: "center",
      }}>
        {resolved && docCount > 0 && (
          <DocDropdown
            documents={documents}
            activeDocId={activeDocId}
            onSelect={selectDoc}
            onNew={newCanvas}
            onDelete={deleteDoc}
            onDeleteAll={deleteAllDocs}
          />
        )}
        {[
          { label: "\u{1F4C4} Export PDF", action: handleExportPDF },
          { label: "\u{1F4BE} Save JSON", action: handleExportJSON },
          { label: "\u{1F4C2} Load JSON", action: () => document.getElementById("fpr-json-import").click() },
          { label: "\u2615 Load Example", action: loadExample },
          { label: "\u{1F5D1} Clear", action: clearCanvas },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#8a8580",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: "0.78rem",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#e8e4df"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#8a8580"; }}
          >{btn.label}</button>
        ))}
        <input
          id="fpr-json-import"
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          style={{ display: "none" }}
        />
      </div>

      <p className="print-hide" style={{
        textAlign: "center", color: "#555", fontSize: "0.7rem", marginTop: 12,
      }}>
        Type in each block to explore your problem from first principles
      </p>
      {resolved && (
        <p className="print-hide" style={{
          textAlign: "center", color: "#444", fontSize: "0.65rem", marginTop: 6,
        }}>
          Changes are automatically saved to your browser
        </p>
      )}
    </div>
  );
}
