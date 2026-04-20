"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState } from "react";
import {
  Plus,
  Search,
  Wrench,
  Code2,
  Globe,
  Mail,
  TrendingUp,
  Database,
  MoreHorizontal,
  ChevronRight,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";

type ToolStatus = "active" | "draft" | "building";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ToolStatus;
  agent: string;
  icon: React.ElementType;
  lastRun?: string;
  runs?: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  Trading: TrendingUp,
  Email: Mail,
  Web: Globe,
  Data: Database,
  Custom: Code2,
};

const tools: Tool[] = [
  {
    id: "1",
    name: "Stock Price Fetcher",
    description: "Fetch real-time stock prices and market data via Yahoo Finance API",
    category: "Trading",
    status: "draft",
    agent: "Trader",
    icon: TrendingUp,
  },
  {
    id: "2",
    name: "Email Summarizer",
    description: "Summarize unread emails and extract action items",
    category: "Email",
    status: "draft",
    agent: "Email",
    icon: Mail,
  },
  {
    id: "3",
    name: "Web Scraper",
    description: "Scrape and extract structured data from any URL",
    category: "Web",
    status: "draft",
    agent: "Claw",
    icon: Globe,
  },
];

const statusConfig: Record<ToolStatus, { color: string; bg: string; label: string; Icon: React.ElementType }> = {
  active: { color: "var(--green)", bg: "var(--green-subtle)", label: "Active", Icon: CheckCircle2 },
  draft: { color: "var(--text-muted)", bg: "var(--bg-tertiary)", label: "Draft", Icon: Clock },
  building: { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "Building", Icon: Zap },
};

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [newTool, setNewTool] = useState({ name: "", description: "", category: "Custom", agent: "Claw" });

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1 }}>
        <TopBar title="Tools" subtitle="Build and manage custom agent tools" />
        <div style={{ padding: "24px 32px", maxWidth: 1200 }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "7px 12px",
              }}
            >
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  flex: 1,
                }}
              />
            </div>
            <button
              onClick={() => setShowBuilder(true)}
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
              <Plus size={14} />
              New Tool
            </button>
          </div>

          {/* Categories */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["All", "Trading", "Email", "Web", "Data", "Custom"].map((cat) => (
              <button
                key={cat}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: cat === "All" ? "var(--accent-subtle)" : "var(--bg-secondary)",
                  color: cat === "All" ? "var(--accent)" : "var(--text-secondary)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: cat === "All" ? 500 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tool list */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 10,
              overflow: "hidden",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                padding: "10px 18px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 80px 40px",
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>Tool</span>
              <span>Category</span>
              <span>Agent</span>
              <span>Status</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "48px 18px", textAlign: "center", color: "var(--text-muted)" }}>
                <Wrench size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No tools yet</div>
                <div style={{ fontSize: 13 }}>Click "New Tool" to build your first one</div>
              </div>
            ) : (
              filtered.map((tool) => {
                const { color, bg, label, Icon } = statusConfig[tool.status];
                const CatIcon = categoryIcons[tool.category] || Code2;
                return (
                  <div
                    key={tool.id}
                    style={{
                      padding: "14px 18px",
                      borderBottom: "1px solid var(--border-subtle)",
                      display: "grid",
                      gridTemplateColumns: "1fr 120px 100px 80px 40px",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 7,
                          background: "var(--bg-tertiary)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <tool.icon size={15} style={{ color: "var(--text-secondary)" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{tool.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{tool.description}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                      <CatIcon size={12} />
                      {tool.category}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{tool.agent}</div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        color,
                        background: bg,
                        padding: "3px 8px",
                        borderRadius: 5,
                        width: "fit-content",
                      }}
                    >
                      <Icon size={11} />
                      {label}
                    </div>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Builder modal */}
          {showBuilder && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
              }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowBuilder(false); }}
            >
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  width: 560,
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>New Tool</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
                  Define a custom tool for your agents to use
                </div>

                {[
                  { label: "Tool Name", key: "name", placeholder: "e.g. Stock Price Fetcher" },
                  { label: "Description", key: "description", placeholder: "What does this tool do?" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>
                      {label}
                    </label>
                    <input
                      placeholder={placeholder}
                      value={newTool[key as keyof typeof newTool]}
                      onChange={(e) => setNewTool({ ...newTool, [key]: e.target.value })}
                      style={{
                        width: "100%",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "8px 12px",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>
                      Category
                    </label>
                    <select
                      value={newTool.category}
                      onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                      style={{
                        width: "100%",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "8px 12px",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        outline: "none",
                      }}
                    >
                      {["Trading", "Email", "Web", "Data", "Custom"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>
                      Assign to Agent
                    </label>
                    <select
                      value={newTool.agent}
                      onChange={(e) => setNewTool({ ...newTool, agent: e.target.value })}
                      style={{
                        width: "100%",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "8px 12px",
                        color: "var(--text-primary)",
                        fontSize: 13,
                        outline: "none",
                      }}
                    >
                      {["Claw", "Trader", "Email", "Observer"].map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>
                    Implementation (optional — paste code or describe behavior)
                  </label>
                  <textarea
                    placeholder="// Paste tool code or describe what it should do..."
                    rows={5}
                    style={{
                      width: "100%",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "8px 12px",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "monospace",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setShowBuilder(false)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "none",
                      background: "var(--accent)",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Create Tool <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
