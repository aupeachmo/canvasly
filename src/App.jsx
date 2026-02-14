import { useState, useEffect } from "react";

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
  { key: "partners", label: "Key Partners", icon: "🤝", color: "#9b7bc8", gridArea: "1 / 1 / 3 / 3" },
  { key: "activities", label: "Key Activities", icon: "⚡", color: "#c97b4b", gridArea: "1 / 3 / 2 / 5" },
  { key: "resources", label: "Key Resources", icon: "🔑", color: "#4a7a9b", gridArea: "2 / 3 / 3 / 5" },
  { key: "value", label: "Value Propositions", icon: "💎", color: "#5b8a72", gridArea: "1 / 5 / 3 / 7", highlight: true },
  { key: "relations", label: "Customer Relationships", icon: "❤️", color: "#9e8a4e", gridArea: "1 / 7 / 2 / 9" },
  { key: "channels", label: "Channels", icon: "📡", color: "#6b8f8a", gridArea: "2 / 7 / 3 / 9" },
  { key: "segments", label: "Customer Segments", icon: "👥", color: "#a0706b", gridArea: "1 / 9 / 3 / 11" },
  { key: "costs", label: "Cost Structure", icon: "💰", color: "#b5564e", gridArea: "3 / 1 / 4 / 6" },
  { key: "revenue", label: "Revenue Streams", icon: "💵", color: "#7a9465", gridArea: "3 / 6 / 4 / 11" },
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

function EditableBlock({ config, items, onChange }) {
  const isBottom = config.key === "costs" || config.key === "revenue";

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
        gridArea: config.gridArea,
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
              >✕</button>
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

const STORAGE_KEY = "canvasly-data";

function getSavedData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_DATA, ...JSON.parse(stored) };
  } catch { /* ignore corrupt data */ }
  return null;
}

// null = no saved data (or already resolved), object = awaiting user decision
const INITIAL_SAVED = getSavedData();

export default function BusinessModelCanvas() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [pendingRestore, setPendingRestore] = useState(INITIAL_SAVED);
  const resolved = pendingRestore === null;

  useEffect(() => {
    if (!resolved) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, resolved]);

  const handleRestore = () => {
    if (pendingRestore) setData(pendingRestore);
    setPendingRestore(null);
  };

  const handleDiscard = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPendingRestore(null);
  };

  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const handleExportPDF = () => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        .print-area, .print-area * { visibility: visible !important; }
        .print-area { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; padding: 20px !important; }
        .print-hide { display: none !important; }
        .remove-btn { display: none !important; }
        input { border-bottom: none !important; }
        input::placeholder { color: transparent !important; }
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

  const loadExample = () => setData(EXAMPLE_DATA);
  const clearAll = () => setData(DEFAULT_DATA);

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
      {pendingRestore && (
        <div className="print-hide" style={{
          maxWidth: 1280, margin: "0 auto 16px", padding: "12px 16px",
          background: "#1a1f1c", border: "1px solid #5b8a7244",
          borderRadius: 8, display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{ color: "#8a8580", fontSize: "0.82rem" }}>
            You have a previous canvas saved locally. Would you like to restore it?
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleRestore} style={{
              background: "#5b8a72", border: "none", color: "#fff",
              padding: "6px 14px", borderRadius: 5, cursor: "pointer",
              fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
            }}>Restore</button>
            <button onClick={handleDiscard} style={{
              background: "transparent", border: "1px solid #444",
              color: "#8a8580", padding: "6px 14px", borderRadius: 5,
              cursor: "pointer", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif",
            }}>Discard</button>
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
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gridTemplateRows: "minmax(180px, 1fr) minmax(180px, 1fr) minmax(100px, auto)",
          gap: "2px",
          maxWidth: 1280,
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
            />
          ))}
        </div>

        <div style={{
          textAlign: "center", marginTop: 16, color: "#8a8580",
          fontSize: "0.65rem", letterSpacing: 1, textTransform: "uppercase", opacity: "0.4",
        }}>
          Business Model Canvas Framework — Osterwalder &amp; Pigneur
        </div>
      </div>

      {/* Toolbar */}
      <div className="print-hide" style={{
        display: "flex", justifyContent: "center", gap: 8,
        marginTop: 20, flexWrap: "wrap",
      }}>
        {[
          { label: "📄 Export PDF", action: handleExportPDF },
          { label: "💾 Save JSON", action: handleExportJSON },
          { label: "📂 Load JSON", action: () => document.getElementById("json-import").click() },
          { label: "☕ Load Example", action: loadExample },
          { label: "🗑 Clear All", action: clearAll },
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
            onMouseEnter={(e) => { e.target.style.borderColor = "#555"; e.target.style.color = "#e8e4df"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "#2a2a2a"; e.target.style.color = "#8a8580"; }}
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
        Click any field to edit · Press Enter to add items · Export PDF opens your browser's print dialog (choose "Save as PDF")
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
