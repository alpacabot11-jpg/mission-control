"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";
import { Plus, ChevronRight, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  emoji: string;
  status: string;
  progress: number;
  tasks_total: number;
  tasks_done: number;
  milestone: string;
  tags: string[];
  agents: string[];
}

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "var(--green)", bg: "var(--green-subtle)", label: "Active" },
  planned: { color: "var(--text-muted)", bg: "var(--bg-tertiary)", label: "Planned" },
  paused: { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "Paused" },
};

const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", emoji: "📁", status: "planned", milestone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(data => { setProjects(data); setLoading(false); });
  }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tags: [], agents: ["Claw"] }) });
    const p = await res.json();
    setProjects(prev => [...prev, p]);
    setForm({ name: "", description: "", emoji: "📁", status: "planned", milestone: "" });
    setShowNew(false);
    setSaving(false);
  };

  const del = async (id: string) => {
    await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Projects" subtitle="Major ongoing work" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={14} /> New Project
            </button>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>Loading...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {projects.map((project) => {
                const { color, bg, label } = statusStyle[project.status] || statusStyle.planned;
                return (
                  <div key={project.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {project.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{project.name}</span>
                          <span style={{ fontSize: 11, color, background: bg, padding: "2px 7px", borderRadius: 4 }}>{label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>🎯 {project.milestone}</div>
                      </div>
                      <button onClick={() => del(project.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 14 }}>{project.description}</p>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Progress</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{project.tasks_done}/{project.tasks_total} tasks</span>
                      </div>
                      <div style={{ height: 4, background: "var(--bg-tertiary)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${project.progress}%`, background: "var(--accent)", borderRadius: 2 }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {(project.agents || []).map((a: string) => <span key={a} style={{ fontSize: 15 }}>{agentEmojis[a] || "🤖"}</span>)}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {(project.tags || []).map((tag: string) => (
                          <span key={tag} style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--bg-tertiary)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 4 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showNew && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, width: 480, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>New Project</div>
                {[
                  { label: "Name", key: "name", placeholder: "Project name" },
                  { label: "Description", key: "description", placeholder: "What is this project?" },
                  { label: "Emoji", key: "emoji", placeholder: "📁" },
                  { label: "Milestone", key: "milestone", placeholder: "What does done look like?" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                    <input placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
                    {["planned", "active", "paused"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={create} disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{saving ? "Creating..." : "Create"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
