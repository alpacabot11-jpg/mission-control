"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

const sections = [
  {
    title: "Identity",
    fields: [
      { label: "Agent Name", value: "Claw", type: "text" },
      { label: "Emoji", value: "🦞", type: "text" },
      { label: "Role", value: "Orchestrator / Main", type: "text" },
    ],
  },
  {
    title: "User",
    fields: [
      { label: "Name", value: "Tommy Cedrone", type: "text" },
      { label: "Preferred name", value: "Boss", type: "text" },
      { label: "Timezone", value: "America/New_York", type: "text" },
      { label: "Primary channel", value: "Telegram", type: "text" },
    ],
  },
  {
    title: "Fleet",
    fields: [
      { label: "Active agents", value: "1", type: "readonly" },
      { label: "Planned agents", value: "3", type: "readonly" },
      { label: "Architecture", value: "@adspendan 20-agent blueprint", type: "readonly" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1 }}>
        <TopBar title="Settings" subtitle="Configure your fleet" />
        <div style={{ padding: "24px 32px", maxWidth: 720 }}>
          {sections.map((section) => (
            <div
              key={section.title}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border-subtle)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {section.title}
              </div>
              <div style={{ padding: "4px 0" }}>
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    style={{
                      padding: "12px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <label
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        width: 160,
                        flexShrink: 0,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      defaultValue={field.value}
                      readOnly={field.type === "readonly"}
                      style={{
                        flex: 1,
                        background: field.type === "readonly" ? "transparent" : "var(--bg-tertiary)",
                        border: field.type === "readonly" ? "none" : "1px solid var(--border)",
                        borderRadius: 6,
                        padding: field.type === "readonly" ? "0" : "7px 10px",
                        color: field.type === "readonly" ? "var(--text-muted)" : "var(--text-primary)",
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
            <button
              style={{
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
