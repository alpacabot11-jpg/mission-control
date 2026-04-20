"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";
import { Search, BookOpen, Tag, Calendar, Plus, Trash2 } from "lucide-react";

interface MemoryEntry {
  id: string;
  date: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
}

const typeConfig: Record<string, { color: string; bg: string; label: string }> = {
  identity: { color: "var(--accent)", bg: "var(--accent-subtle)", label: "Identity" },
  user: { color: "var(--green)", bg: "var(--green-subtle)", label: "User" },
  decision: { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "Decision" },
  lesson: { color: "var(--red)", bg: "var(--red-subtle)", label: "Lesson" },
  build: { color: "var(--text-secondary)", bg: "var(--bg-tertiary)", label: "Build" },
  notes: { color: "var(--text-muted)", bg: "var(--bg-tertiary)", label: "Notes" },
};

export default function MemoryPage() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "notes", tags: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/memory").then(r => r.json()).then(data => { setEntries(data); setLoading(false); });
  }, []);

  const grouped = entries.reduce((acc: Record<string, MemoryEntry[]>, e) => {
    const date = e.date?.split("T")[0] || "Unknown";
    if (!acc[date]) acc[date] = [];
    acc[date].push(e);
    return acc;
  }, {});

  const filtered = Object.entries(grouped).map(([date, items]) => ({
    date,
    entries: items.filter(e =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.content || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter(d => d.entries.length > 0);

  const create = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const res = await fetch("/api/memory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: today, type: form.type, title: form.title, content: form.content, tags }) });
    const entry = await res.json();
    setEntries(prev => [entry, ...prev]);
    setForm({ title: "", content: "", type: "notes", tags: "" });
    setShowNew(false);
    setSaving(false);
  };

  const del = async (id: string) => {
    await fetch("/api/memory", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Memory" subtitle="Searchable long-term memory journal" />
        <div style={{ padding: "24px 28px", maxWidth: 860 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 7, padding: "9px 14px" }}>
              <Search size={14} style={{ color: "var(--text-muted)" }} />
              <input placeholder="Search memories..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text-primary)" }} />
            </div>
            <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={14} /> Add Memory
            </button>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <BookOpen size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No memories match</div>
            </div>
          ) : filtered.map(({ date, entries: dayEntries }) => (
            <div key={date} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, color: "var(--text-muted)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                <Calendar size={12} />
                {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {dayEntries.map((entry) => {
                  const { color, bg, label } = typeConfig[entry.type] || typeConfig.notes;
                  return (
                    <div key={entry.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 9, padding: "14px 18px", borderLeft: `3px solid ${color}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color, background: bg, padding: "2px 7px", borderRadius: 4 }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{entry.title}</span>
                        <button onClick={() => del(entry.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 10 }}>{entry.content}</p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {(entry.tags || []).map((tag: string) => (
                          <span key={tag} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-muted)", background: "var(--bg-tertiary)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 4 }}>
                            <Tag size={9} />{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {showNew && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, width: 500, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Add Memory</div>
                {[{ label: "Title", key: "title", placeholder: "What happened?" }, { label: "Tags (comma separated)", key: "tags", placeholder: "e.g. Fleet, Decision" }].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                    <input placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
                    {["notes", "decision", "lesson", "build", "identity", "user"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Content</label>
                  <textarea placeholder="Details..." rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none", resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={create} disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{saving ? "Saving..." : "Add"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
