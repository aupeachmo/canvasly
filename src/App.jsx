import { useState, useEffect, useRef } from "react";

const DEFAULT_DATA = {
  title: "Business Model Canvas",
  subtitle: "",
  partners: [""],
  activities: [""],
  resources: [""],
  value: [""],
  relations: [""],
  channels: [""],
  segments: [""],
  costs: [""],
  revenue: [""],
};

const BLOCK_CONFIG = [
  { key: "partners", label: "Key Partners", icon: "\u{1F91D}", color: "#9b7bc8", gridArea: "1 / 1 / 3 / 3" },
  { key: "activities", label: "Key Activities", icon: "\u26A1", color: "#c97b4b", gridArea: "1 / 3 / 2 / 5" },
  { key: "resources", label: "Key Resources", icon: "\u{1F511}", color: "#4a7a9b", gridArea: "2 / 3 / 3 / 5" },
  { key: "value", label: "Value Propositions", icon: "\u{1F48E}", color: "#5b8a72", gridArea: "1 / 5 / 3 / 7", highlight: true },
  { key: "relations", label: "Customer Relationships", icon: "\u2764\uFE0F", color: "#9e8a4e", gridArea: "1 / 7 / 2 / 9" },
  { key: "channels", label: "Channels", icon: "\u{1F4E1}", color: "#6b8f8a", gridArea: "2 / 7 / 3 / 9" },
  { key: "segments", label: "Customer Segments", icon: "\u{1F465}", color: "#a0706b", gridArea: "1 / 9 / 3 / 11" },
  { key: "costs", label: "Cost Structure", icon: "\u{1F4B0}", color: "#b5564e", gridArea: "3 / 1 / 4 / 6" },
  { key: "revenue", label: "Revenue Streams", icon: "\u{1F4B5}", color: "#7a9465", gridArea: "3 / 6 / 4 / 11" },
];

const EXAMPLE_DATA = {
  title: "Business Model Canvas",
  subtitle: "Specialty Coffee Shop",
  partners: ["Local coffee bean roasters", "Bakery & pastry vendors", "Delivery platforms", "Equipment maintenance providers"],
  activities: ["Brewing specialty coffee", "Training baristas", "Curating in-store experience", "Sourcing ethical beans"],
  resources: ["Skilled barista team", "Premium coffee beans", "Prime retail location", "Espresso equipment"],
  value: ["Ethically sourced specialty coffee", "Cozy, inviting atmosphere", "Fast & friendly service", "Community gathering space"],
  relations: ["Loyalty rewards program", "Personalized recommendations", "Community events", "Social media engagement"],
  channels: ["Physical storefront", "Mobile ordering app", "Social media", "Delivery platforms"],
  segments: ["Young professionals", "Remote workers", "Local residents", "Coffee enthusiasts"],
  costs: ["Rent & utilities", "Staff wages", "Coffee beans & supplies", "Equipment", "Marketing"],
  revenue: ["Beverage sales", "Pastry & food sales", "Merchandise", "Catering", "Subscriptions"],
};

const DOCS_KEY = "canvasly-documents";
const OLD_KEY = "canvasly-data";
const COMPACT_BREAKPOINT = 768;

function newId() {
  return crypto.randomUUID();
}

function loadSavedDocs() {
  try {
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const data = JSON.parse(old);
      const id = newId();
      const docs = { [id]: { data, updatedAt: Date.now() } };
      localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
      localStorage.removeItem(OLD_KEY);
      return docs;
    }
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

function EditableBlock({ config, items, onChange, compact }) {
  const isBottom = !compact && (config.key === "costs" || config.key === "revenue");

  const updateItem = (index, value) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addItem = () => onChange([...items, ""]);

  const removeItem = (index) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
      setTimeout(() => {
        const inputs = e.target.closest(".block-items")?.querySelectorAll("input");
        inputs?.[inputs.length - 1]?.focus();
      }, 50);
    }
    if (e.key === "Backspace" && items[index] === "" && items.length > 1) {
      e.preventDefault();
      removeItem(index);
    }
  };

  return (
    <div
      className="no-break"
      style={{
        gridArea: compact ? "auto" : config.gridArea,
        background: config.highlight ? "#1a1f1c" : "#1a1a1a",
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
        marginBottom: "10px",
        color: config.color,
        display: "flex",
        alignItems: "center",
        gap: "5px",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "0.8rem" }}>{config.icon}</span>
        {config.label}
      </div>
      <div className="block-items" style={{
        display: "flex",
        flexDirection: isBottom ? "row" : "column",
        flexWrap: isBottom ? "wrap" : "nowrap",
        gap: isBottom ? "4px 10px" : "4px",
        flex: 1,
        overflowY: "auto",
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            position: "relative",
            minWidth: isBottom ? "auto" : undefined,
          }}>
            <span style={{
              width: 4, height: 4, borderRadius: "50%",
              background: config.color, flexShrink: 0, opacity: "0.7",
            }} />
            <input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              placeholder="Type here..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#8a8580",
                fontSize: "0.78rem",
                lineHeight: "1.5",
                fontFamily: "'DM Sans', sans-serif",
                width: isBottom ? `${Math.max(80, item.length * 75 / 10 + 20)}px` : "100%",
                padding: "2px 0",
              }}
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="remove-btn"
                style={{
                  background: "none", border: "none", color: "#444",
                  cursor: "pointer", fontSize: "0.7rem", padding: "0 2px",
                  flexShrink: 0, opacity: 0, transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => e.target.style.opacity = 1}
                onMouseLeave={(e) => e.target.style.opacity = 0}
              >{"\u2715"}</button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="print-hide"
        style={{
          background: "none", border: `1px dashed ${config.color}33`,
          color: `${config.color}88`, cursor: "pointer",
          fontSize: "0.65rem", padding: "3px 8px", borderRadius: 4,
          marginTop: 6, alignSelf: "flex-start", transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.target.style.borderColor = config.color; e.target.style.color = config.color; }}
        onMouseLeave={(e) => { e.target.style.borderColor = `${config.color}33`; e.target.style.color = `${config.color}88`; }}
      >+ Add</button>
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
  const label = activeDoc ? (activeDoc.data.title || "Untitled") : "My Canvases";

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
                  {doc.data.title || "Untitled"}
                </div>
                {doc.data.subtitle && (
                  <div style={{
                    fontSize: "0.65rem", color: "#555",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {doc.data.subtitle}
                  </div>
                )}
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

const INITIAL_SAVED = loadSavedDocs();

export default function BusinessModelCanvas() {
  const [documents, setDocuments] = useState({});
  const [activeDocId, setActiveDocId] = useState(() => INITIAL_SAVED ? null : newId());
  const [data, setData] = useState(DEFAULT_DATA);
  const [pending, setPending] = useState(INITIAL_SAVED);
  const resolved = pending === null;
  const docsRef = useRef({});

  const [compact, setCompact] = useState(() => window.innerWidth < COMPACT_BREAKPOINT);

  // Responsive breakpoint
  useEffect(() => {
    function onResize() {
      setCompact(window.innerWidth < COMPACT_BREAKPOINT);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-save current document
  useEffect(() => {
    if (!resolved || !activeDocId) return;
    const updated = { ...docsRef.current, [activeDocId]: { data, updatedAt: Date.now() } };
    docsRef.current = updated;
    setDocuments(updated);
    persistDocs(updated);
  }, [data, resolved, activeDocId]);

  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  // Banner actions
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

  // Document management
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
    const style = document.createElement("style");
    style.textContent = `
      @page { size: landscape; margin: 10mm; }
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
        .print-area input {
          color: #333 !important;
        }
        .print-area input::placeholder { color: transparent !important; }
        .canvas-grid {
          background: #ddd !important;
          border-color: #ddd !important;
        }
        .no-break {
          background: #fff !important;
        }
        .canvas-attribution {
          color: #999 !important;
          opacity: 1 !important;
        }
        .print-hide { display: none !important; }
        .remove-btn { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 500);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-model-canvas.json";
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

        {/* Restore banner */}
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
                  <div>{doc.data.title || "Untitled"}</div>
                  {doc.data.subtitle && (
                    <div style={{ fontSize: "0.65rem", color: "#666", marginTop: 2 }}>{doc.data.subtitle}</div>
                  )}
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
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <input
              value={data.title}
              onChange={(e) => update("title", e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#e8e4df", fontFamily: "'DM Serif Display', serif",
                fontSize: "2rem", textAlign: "center", width: "100%",
                letterSpacing: "-0.5px",
              }}
            />
            <input
              value={data.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Your Company Name"
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#8a8580", fontSize: "0.85rem", textAlign: "center",
                width: "100%", letterSpacing: "2px", textTransform: "uppercase",
                fontWeight: 500,
              }}
            />
          </div>

          {/* Canvas Grid */}
          <div className="canvas-grid" style={{
            display: "grid",
            gridTemplateColumns: compact ? "1fr" : "repeat(10, 1fr)",
            gridTemplateRows: compact ? undefined : "minmax(180px, 1fr) minmax(180px, 1fr) minmax(100px, auto)",
            gap: "2px",
            margin: "0 auto",
            background: "#2a2a2a",
            border: "2px solid #2a2a2a",
            borderRadius: 12,
            overflow: "hidden",
          }}>
            {BLOCK_CONFIG.map((cfg) => (
              <EditableBlock
                key={cfg.key}
                config={cfg}
                items={data[cfg.key]}
                onChange={(v) => update(cfg.key, v)}
                compact={compact}
              />
            ))}
          </div>

          <div className="canvas-attribution" style={{
            textAlign: "center", marginTop: 16, color: "#8a8580",
            fontSize: "0.65rem", letterSpacing: 1, textTransform: "uppercase", opacity: "0.4",
          }}>
            Business Model Canvas Framework {"\u2014"} Osterwalder &amp; Pigneur
          </div>
        </div>

        {/* Toolbar */}
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
            { label: "\u{1F4C2} Load JSON", action: () => document.getElementById("json-import").click() },
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
            id="json-import"
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            style={{ display: "none" }}
          />
        </div>

        <p className="print-hide" style={{
          textAlign: "center", color: "#555", fontSize: "0.7rem", marginTop: 12,
        }}>
          Click any field to edit {"\u00B7"} Press Enter to add items
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
