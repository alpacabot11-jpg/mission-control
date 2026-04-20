"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";
import { Plus, Search, Wrench, Globe, Mail, TrendingUp, Database, Code2, MoreHorizontal, CheckCircle2, Clock, Zap, Trash2 } from "lucide-react";

type ToolStatus = "active" | "draft" | "building";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ToolStatus;
  agent: string;
  implementation?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  Trading: TrendingUp, Email: Mail, Web: Globe, Data: Database, Custom: Code2,
};

const statusConfig: Record<ToolStatus, { color: string; bg: string; label: string; Icon: React.ElementType }> = {
  active: { color: "var(--green)", bg: "var(--green-subtle)", label: "Active", Icon: CheckCircle2 },
  draft: { color: "var(--text-muted)", bg: "var(--bg-tertiary)", label: "Draft", Icon: Clock },
  building: { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "Building", Icon: Zap },
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [newTool, setNewTool] = useState({ name: "", description: "", category: "Custom", agent: "Claw", implementation: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/tools").then(r => r.json()).then(data => { setTools(data); setLoading(false); });
  }, []);

  const filtered = tools.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const createTool = async () => {
    if (!newTool.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newTool) });
    const tool = await res.json();
    setTools(prev => [tool, ...prev]);
    setNewTool({ name: "", description: "", category: "Custom", agent: "Claw", implementation: "" });
    setShowBuilder(false);
    setSaving(false);
  };

  const deleteTool = async (id: string) => {
    await fetch("/api/tools", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTools(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Tools" subtitle="Build and manage custom agent tools" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 12px" }}>
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, flex: 1 }} />
            </div>
            <button onClick={() => setShowBuilder(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={14} /> New Tool
            </button>
          </div>

          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 120px 100px 80px 40px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Tool</span><span>Category</span><span>Agent</span><span>Status</span><span></span>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "48px 18px", textAlign: "center", color: "var(--text-muted)" }}>
                <Wrench size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No tools yet</div>
                <div style={{ fontSize: 13 }}>Click "New Tool" to build your first one</div>
              </div>
            ) : filtered.map((tool) => {
              const s = statusConfig[tool.status] || statusConfig.draft;
              const CatIcon = categoryIcons[tool.category] || Code2;
              return (
                <div key={tool.id} style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 120px 100px 80px 40px", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Wrench size={14} style={{ color: "var(--text-secondary)" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{tool.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{tool.description}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}><CatIcon size={12} />{tool.category}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{tool.agent}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: s.color, background: s.bg, padding: "3px 8px", borderRadius: 5, width: "fit-content" }}>
                    <s.Icon size={11} />{s.label}
                  </div>
                  <button onClick={() => deleteTool(tool.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {showBuilder && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) setShowBuilder(false); }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, width: 560, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>New Tool</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>Define a custom tool for your agents</div>

                {[{ label: "Tool Name", key: "name", placeholder: "e.g. Stock Price Fetcher" }, { label: "Description", key: "description", placeholder: "What does this tool do?" }].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                    <input placeholder={placeholder} value={newTool[key as keyof typeof newTool]} onChange={e => setNewTool({ ...newTool, [key]: e.target.value })}
                      style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                  </div>
                ))}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {[{ label: "Category", key: "category", options: ["Trading", "Email", "Web", "Data", "Custom"] }, { label: "Agent", key: "agent", options: ["Claw", "Trader", "Email", "Observer"] }].map(({ label, key, options }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                      <select value={newTool[key as keyof typeof newTool]} onChange={e => setNewTool({ ...newTool, [key]: e.target.value })}
                        style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Implementation (optional)</label>
                  <textarea placeholder="// Paste tool code or describe what it should do..." rows={5} value={newTool.implementation} onChange={e => setNewTool({ ...newTool, implementation: e.target.value })}
                    style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "monospace" }} />
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowBuilder(false)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={createTool} disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Creating..." : "Create Tool"}
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
