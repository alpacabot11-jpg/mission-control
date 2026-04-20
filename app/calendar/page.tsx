"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Plus, Clock, Repeat, Zap, AlertCircle } from "lucide-react";
import { useState } from "react";

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  description: string;
  agent: string;
  status: "active" | "paused" | "scheduled";
  lastRun?: string;
  nextRun: string;
  type: "heartbeat" | "cron" | "one-shot";
}

const jobs: CronJob[] = [
  {
    id: "1",
    name: "Heartbeat Poll",
    schedule: "Every 30 min",
    description: "Check inbox, calendar, notifications. Batch all periodic checks.",
    agent: "Claw",
    status: "active",
    lastRun: "2 min ago",
    nextRun: "~28 min",
    type: "heartbeat",
  },
  {
    id: "2",
    name: "Market Open Brief",
    schedule: "Mon–Fri 9:30 AM EST",
    description: "Fetch pre-market movers, watchlist updates, economic calendar.",
    agent: "Trader",
    status: "scheduled",
    nextRun: "Tomorrow 9:30 AM",
    type: "cron",
  },
  {
    id: "3",
    name: "Email Summary",
    schedule: "Daily 8:00 AM EST",
    description: "Summarize unread emails, flag urgent items, draft replies.",
    agent: "Email",
    status: "scheduled",
    nextRun: "Tomorrow 8:00 AM",
    type: "cron",
  },
  {
    id: "4",
    name: "Fleet Health Check",
    schedule: "Every 6 hours",
    description: "Ping all agents, verify uptime, report anomalies.",
    agent: "Observer",
    status: "scheduled",
    nextRun: "~6 hours",
    type: "cron",
  },
  {
    id: "5",
    name: "Memory Consolidation",
    schedule: "Sunday 11:00 PM EST",
    description: "Review weekly daily notes, update MEMORY.md with distilled insights.",
    agent: "Claw",
    status: "scheduled",
    nextRun: "Next Sunday",
    type: "cron",
  },
];

const typeConfig = {
  heartbeat: { color: "var(--green)", bg: "var(--green-subtle)", label: "Heartbeat", icon: Zap },
  cron: { color: "var(--accent)", bg: "var(--accent-subtle)", label: "Cron", icon: Repeat },
  "one-shot": { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "One-shot", icon: Clock },
};

const statusDot = { active: "var(--green)", paused: "var(--red)", scheduled: "var(--text-muted)" };
const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

export default function CalendarPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Calendar" subtitle="Scheduled tasks and cron jobs" />
        <div style={{ padding: "24px 28px", maxWidth: 900 }}>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button
              onClick={() => setShowNew(true)}
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
              <Plus size={14} /> New Schedule
            </button>
          </div>

          {/* Info strip */}
          <div
            style={{
              background: "var(--accent-subtle)",
              border: "1px solid rgba(94,106,210,0.2)",
              borderRadius: 8,
              padding: "10px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <AlertCircle size={14} style={{ color: "var(--accent)" }} />
            <span>Trader, Email, and Observer agents aren&apos;t built yet — scheduled tasks will activate when agents go live.</span>
          </div>

          {/* Job list */}
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
                gridTemplateColumns: "1fr 130px 100px 110px 80px",
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>Job</span>
              <span>Schedule</span>
              <span>Agent</span>
              <span>Next Run</span>
              <span>Type</span>
            </div>

            {jobs.map((job, i) => {
              const { color, bg, label, icon: TypeIcon } = typeConfig[job.type];
              return (
                <div
                  key={job.id}
                  style={{
                    padding: "14px 18px",
                    borderBottom: i < jobs.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    display: "grid",
                    gridTemplateColumns: "1fr 130px 100px 110px 80px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: statusDot[job.status],
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{job.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 15 }}>{job.description}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{job.schedule}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-secondary)" }}>
                    <span>{agentEmojis[job.agent]}</span>
                    {job.agent}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{job.nextRun}</div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      color,
                      background: bg,
                      padding: "3px 8px",
                      borderRadius: 5,
                      width: "fit-content",
                    }}
                  >
                    <TypeIcon size={11} />
                    {label}
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
