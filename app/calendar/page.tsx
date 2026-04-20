"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";
import { Plus, Clock, Repeat, Zap, AlertCircle, Trash2 } from "lucide-react";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  description: string;
  agent: string;
  status: string;
  type: string;
  next_run: string;
}

const typeConfig: Record<string, { color: string; bg: string; label: string; icon: React.ElementType }> = {
  heartbeat: { color: "var(--green)", bg: "var(--green-subtle)", label: "Heartbeat", icon: Zap },
  cron: { color: "var(--accent)", bg: "var(--accent-subtle)", label: "Cron", icon: Repeat },
  "one-shot": { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "One-shot", icon: Clock },
};

const statusDot: Record<string, string> = { active: "var(--green)", paused: "var(--red)", scheduled: "var(--text-muted)" };
const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

export default function CalendarPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", schedule: "", description: "", agent: "Claw", type: "cron", next_run: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/cron-jobs").then(r => r.json()).then(data => { setJobs(data); setLoading(false); });
  }, []);

  const create = async () => {
    if (!form.name.trim() || !form.schedule.trim()) return;
    setSaving(true);
    const res = await fetch("/api/cron-jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const job = await res.json();
    setJobs(prev => [...prev, job]);
    setForm({ name: "", schedule: "", description: "", agent: "Claw", type: "cron", next_run: "" });
    setShowNew(false);
    setSaving(false);
  };

  const del = async (id: string) => {
    await fetch("/api/cron-jobs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Calendar" subtitle="Scheduled tasks and cron jobs" />
        <div style={{ padding: "24px 28px", maxWidth: 900 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button onClick={() => setShowNew(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={14} /> New Schedule
            </button>
          </div>

          <div style={{ background: "var(--accent-subtle)", border: "1px solid rgba(94,106,210,0.2)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-secondary)" }}>
            <AlertCircle size={14} style={{ color: "var(--accent)" }} />
            <span>Trader, Email, and Observer agents aren't built yet — scheduled tasks activate when agents go live.</span>
          </div>

          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "1fr 130px 100px 110px 80px 40px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Job</span><span>Schedule</span><span>Agent</span><span>Next Run</span><span>Type</span><span></span>
            </div>

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
            ) : jobs.map((job, i) => {
              const t = typeConfig[job.type] || typeConfig.cron;
              return (
                <div key={job.id} style={{ padding: "14px 18px", borderBottom: i < jobs.length - 1 ? "1px solid var(--border-subtle)" : "none", display: "grid", gridTemplateColumns: "1fr 130px 100px 110px 80px 40px", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusDot[job.status] || "var(--text-muted)" }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{job.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 15 }}>{job.description}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{job.schedule}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                    <span>{agentEmojis[job.agent] || "🤖"}</span>{job.agent}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{job.next_run}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: t.color, background: t.bg, padding: "3px 8px", borderRadius: 5, width: "fit-content" }}>
                    <t.icon size={11} />{t.label}
                  </div>
                  <button onClick={() => del(job.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {showNew && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, width: 480, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>New Schedule</div>
                {[
                  { label: "Name", key: "name", placeholder: "e.g. Daily Briefing" },
                  { label: "Schedule", key: "schedule", placeholder: "e.g. Daily 9:00 AM EST" },
                  { label: "Description", key: "description", placeholder: "What does this job do?" },
                  { label: "Next Run", key: "next_run", placeholder: "e.g. Tomorrow 9:00 AM" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                    <input placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[{ label: "Agent", key: "agent", options: ["Claw", "Trader", "Email", "Observer"] }, { label: "Type", key: "type", options: ["cron", "heartbeat", "one-shot"] }].map(({ label, key, options }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                      <select value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
                        {options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={create} disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{saving ? "Saving..." : "Create"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
