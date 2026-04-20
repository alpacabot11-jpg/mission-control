"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { FileText, Search, Download, ExternalLink, Plus } from "lucide-react";
import { useState } from "react";

interface Doc {
  id: string;
  name: string;
  type: "plan" | "playbook" | "config" | "brief" | "notes";
  agent: string;
  created: string;
  size: string;
  path: string;
}

const docs: Doc[] = [
  { id: "1", name: "Mission.md", type: "plan", agent: "Claw", created: "Apr 19", size: "1.0 KB", path: "~/workspace/Mission.md" },
  { id: "2", name: "Playbook.md", type: "playbook", agent: "Claw", created: "Apr 19", size: "1.6 KB", path: "~/workspace/Playbook.md" },
  { id: "3", name: "Boundaries.md", type: "config", agent: "Claw", created: "Apr 19", size: "1.3 KB", path: "~/workspace/Boundaries.md" },
  { id: "4", name: "Fleet.md", type: "plan", agent: "Claw", created: "Apr 19", size: "1.0 KB", path: "~/workspace/Fleet.md" },
  { id: "5", name: "Comms.md", type: "config", agent: "Claw", created: "Apr 19", size: "1.4 KB", path: "~/workspace/Comms.md" },
  { id: "6", name: "MEMORY.md", type: "notes", agent: "Claw", created: "Apr 19", size: "1.1 KB", path: "~/workspace/MEMORY.md" },
  { id: "7", name: "SOUL.md", type: "config", agent: "Claw", created: "Apr 19", size: "1.4 KB", path: "~/workspace/SOUL.md" },
  { id: "8", name: "AGENTS.md", type: "config", agent: "Claw", created: "Apr 19", size: "7.2 KB", path: "~/workspace/AGENTS.md" },
];

const typeStyle: Record<string, { color: string; bg: string }> = {
  plan: { color: "var(--accent)", bg: "var(--accent-subtle)" },
  playbook: { color: "var(--green)", bg: "var(--green-subtle)" },
  config: { color: "var(--yellow)", bg: "var(--yellow-subtle)" },
  brief: { color: "var(--text-secondary)", bg: "var(--bg-tertiary)" },
  notes: { color: "var(--text-muted)", bg: "var(--bg-tertiary)" },
};

const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const filtered = docs.filter(
    (d) =>
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.type.includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Documents" subtitle="All files created by your agents" />
        <div style={{ padding: "24px 28px", maxWidth: 1000 }}>

          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "8px 12px",
              }}
            >
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13 }}
              />
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Plus size={14} /> New Doc
            </button>
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
            {["All", "Plan", "Playbook", "Config", "Notes", "Brief"].map((t) => (
              <button
                key={t}
                style={{
                  padding: "4px 11px",
                  borderRadius: 5,
                  border: "1px solid var(--border)",
                  background: t === "All" ? "var(--accent-subtle)" : "var(--bg-secondary)",
                  color: t === "All" ? "var(--accent)" : "var(--text-muted)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 18px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "1fr 90px 80px 70px 60px 60px",
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>Name</span>
              <span>Type</span>
              <span>Agent</span>
              <span>Created</span>
              <span>Size</span>
              <span></span>
            </div>

            {filtered.map((doc, i) => {
              const { color, bg } = typeStyle[doc.type];
              return (
                <div
                  key={doc.id}
                  style={{
                    padding: "12px 18px",
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    display: "grid",
                    gridTemplateColumns: "1fr 90px 80px 70px 60px 60px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileText size={13} style={{ color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{doc.path}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color, background: bg, padding: "2px 7px", borderRadius: 4, width: "fit-content", textTransform: "capitalize" }}>
                    {doc.type}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                    {agentEmojis[doc.agent]} {doc.agent}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{doc.created}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{doc.size}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      <ExternalLink size={13} />
                    </button>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      <Download size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
