import { useState } from "react";
import BusinessModelCanvas from "./BusinessModelCanvas.jsx";
import FirstPrincipleReasoning from "./FirstPrincipleReasoning.jsx";

const TEMPLATES = [
  { id: "bmc", label: "Business Model Canvas", icon: "\u{1F4CB}" },
  { id: "fpr", label: "First Principle Reasoning", icon: "\u{1F9E0}" },
];

export default function App() {
  const [template, setTemplate] = useState("bmc");

  return (
    <div style={{
      background: "#0f0f0f",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e8e4df",
    }}>
      <div className="print-hide" style={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        padding: "16px 24px 0",
        borderBottom: "1px solid #1a1a1a",
        marginBottom: 8,
      }}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            style={{
              background: template === t.id ? "#1a1f1c" : "transparent",
              border: `1px solid ${template === t.id ? "#5b8a7244" : "#2a2a2a"}`,
              color: template === t.id ? "#e8e4df" : "#8a8580",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (template !== t.id) {
                e.currentTarget.style.borderColor = "#444";
                e.currentTarget.style.color = "#e8e4df";
              }
            }}
            onMouseLeave={(e) => {
              if (template !== t.id) {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.color = "#8a8580";
              }
            }}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {template === "bmc" ? <BusinessModelCanvas /> : <FirstPrincipleReasoning />}

      <footer className="print-hide" style={{
        textAlign: "center",
        padding: "24px 16px 16px",
        color: "#555",
        fontSize: "0.75rem",
        borderTop: "1px solid #1a1a1a",
        marginTop: "auto",
      }}>
        Maintained by{" "}
        <a
          href="https://github.com/aupeachmo"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#8a8580", textDecoration: "none" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#5b8a72"; e.currentTarget.style.textDecoration = "underline"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#8a8580"; e.currentTarget.style.textDecoration = "none"; }}
        >
          aupeach
        </a>
        {" "}&middot; think with clarity.
      </footer>
    </div>
  );
}
