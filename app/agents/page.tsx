"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";
import { Plus, Settings, ArrowRight } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  emoji: string;
  role: string;
  description: string;
  status: string;
  channel: string;
  tools_count: number;
  tasks_count: number;
}

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "var(--green)", bg: "var(--green-subtle)" },
  draft: { color: "var(--text-muted)", bg: "var(--bg-tertiary)" },
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", emoji: "🤖", role: "", description: "", channel: "—" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(data => { setAgents(data); setLoading(false); });
  }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const agent = await res.json();
    setAgents(prev => [...prev, agent]);
    setForm({ name: "", emoji: "🤖", role: "", description: "", channel: "—" });
    setShowNew(false);
    setSaving(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Agents" subtitle="Manage your fleet" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={14} /> New Agent
            </button>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>Loading...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {agents.map((agent) => {
                const { color, bg } = statusStyle[agent.status] || statusStyle.draft;
                return (
                  <div key={agent.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {agent.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 15, fontWeight: 600 }}>{agent.name}</span>
                          <span style={{ fontSize: 11, color, background: bg, padding: "2px 7px", borderRadius: 4, textTransform: "capitalize" }}>{agent.status}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{agent.role}</div>
                      </div>
                      <button style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "var(--text-muted)" }}>
                        <Settings size={13} />
                      </button>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>{agent.description}</p>
                    <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid var(--border-subtle)" }}>
                      <div><div style={{ fontSize: 18, fontWeight: 700 }}>{agent.tools_count}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tools</div></div>
                      <div><div style={{ fontSize: 18, fontWeight: 700 }}>{agent.tasks_count}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tasks run</div></div>
                      <div><div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{agent.channel}</div><div style={{ fontSize: 11, color: "var(--text-muted)" }}>Channel</div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showNew && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, width: 480, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>New Agent</div>
                {[
                  { label: "Name", key: "name", placeholder: "e.g. Research Agent" },
                  { label: "Emoji", key: "emoji", placeholder: "🤖" },
                  { label: "Role", key: "role", placeholder: "e.g. Research & Summarization" },
                  { label: "Description", key: "description", placeholder: "What does this agent do?" },
                  { label: "Channel", key: "channel", placeholder: "e.g. Telegram, Discord" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                    <input placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={create} disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{saving ? "Creating..." : "Create Agent"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
