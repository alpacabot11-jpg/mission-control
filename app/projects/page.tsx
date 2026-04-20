"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Plus, TrendingUp, Bot, Mail, Eye, Zap, ChevronRight } from "lucide-react";

const projects = [
  {
    id: "1",
    name: "Fleet Build-Out",
    description: "Spin up and configure all planned agents: Trader, Email, Observer. Each gets its own workspace, Mission.md, and Playbook.",
    emoji: "🚀",
    status: "active",
    progress: 20,
    tasks: { total: 8, done: 2 },
    agents: ["Claw"],
    tags: ["Infrastructure", "High Priority"],
    milestone: "All 4 agents online",
  },
  {
    id: "2",
    name: "Trading System",
    description: "Build a stock trading agent with real-time data feeds, watchlist management, strategy execution, and strict approval guardrails.",
    emoji: "📈",
    status: "planned",
    progress: 0,
    tasks: { total: 12, done: 0 },
    agents: ["Trader"],
    tags: ["Trading", "Finance"],
    milestone: "First approved trade executed",
  },
  {
    id: "3",
    name: "Email Ops",
    description: "Automate email triage, summarization, draft replies, and routing. Zero sends without approval.",
    emoji: "📧",
    status: "planned",
    progress: 0,
    tasks: { total: 6, done: 0 },
    agents: ["Email"],
    tags: ["Comms"],
    milestone: "Inbox at zero every morning",
  },
  {
    id: "4",
    name: "Mission Control",
    description: "Build and iterate on the dashboard — task board, calendar, memory viewer, team org chart, office map.",
    emoji: "🖥",
    status: "active",
    progress: 60,
    tasks: { total: 10, done: 6 },
    agents: ["Claw"],
    tags: ["Dev", "UI"],
    milestone: "Fully interactive dashboard",
  },
];

const statusStyle: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "var(--green)", bg: "var(--green-subtle)", label: "Active" },
  planned: { color: "var(--text-muted)", bg: "var(--bg-tertiary)", label: "Planned" },
  paused: { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "Paused" },
};

const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

export default function ProjectsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Projects" subtitle="Major ongoing work" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
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
              <Plus size={14} /> New Project
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {projects.map((project) => {
              const { color, bg, label } = statusStyle[project.status];
              return (
                <div
                  key={project.id}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 10,
                    padding: "20px",
                    cursor: "pointer",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {project.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{project.name}</span>
                        <span style={{ fontSize: 11, color, background: bg, padding: "2px 7px", borderRadius: 4 }}>
                          {label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        🎯 {project.milestone}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 14 }}>
                    {project.description}
                  </p>

                  {/* Progress */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Progress</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{project.tasks.done}/{project.tasks.total} tasks</span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "var(--bg-tertiary)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${project.progress}%`,
                          background: project.progress > 0 ? "var(--accent)" : "transparent",
                          borderRadius: 2,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {project.agents.map((a) => (
                        <span key={a} style={{ fontSize: 15 }} title={a}>{agentEmojis[a]}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border)",
                            padding: "2px 7px",
                            borderRadius: 4,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ChevronRight size={13} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
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
