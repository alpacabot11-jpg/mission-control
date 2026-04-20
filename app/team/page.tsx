"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Plus, Settings, ArrowDown } from "lucide-react";

const team = {
  boss: {
    name: "Boss (Tommy)",
    emoji: "👤",
    role: "Fleet Commander",
    description: "Sets direction, approves actions, owns the mission.",
    channel: "Telegram",
  },
  orchestrators: [
    {
      name: "Claw",
      emoji: "🦞",
      role: "Main Orchestrator",
      description: "Primary interface, fleet coordination, task routing.",
      channel: "Telegram",
      status: "active",
      tools: 0,
    },
  ],
  workers: [
    {
      name: "Trader",
      emoji: "📈",
      role: "Stock Trading Agent",
      description: "Market data, trade execution (approval required), portfolio tracking.",
      channel: "—",
      status: "draft",
      tools: 0,
    },
    {
      name: "Email",
      emoji: "📧",
      role: "Email Agent",
      description: "Inbox triage, summarization, draft replies. Never sends without approval.",
      channel: "—",
      status: "draft",
      tools: 0,
    },
  ],
  observer: {
    name: "Observer",
    emoji: "👁",
    role: "Fleet Observer",
    description: "Health monitoring, heartbeat aggregation, alert routing.",
    channel: "—",
    status: "draft",
    tools: 0,
  },
};

const statusStyle: Record<string, { color: string; bg: string }> = {
  active: { color: "var(--green)", bg: "var(--green-subtle)" },
  draft: { color: "var(--text-muted)", bg: "var(--bg-tertiary)" },
};

function AgentCard({ agent }: { agent: typeof team.orchestrators[0] }) {
  const { color, bg } = statusStyle[agent.status];
  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        padding: "16px",
        width: 220,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {agent.emoji}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{agent.name}</div>
          <span style={{ fontSize: 11, color, background: bg, padding: "1px 6px", borderRadius: 3 }}>{agent.status}</span>
        </div>
        <button style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
          <Settings size={13} />
        </button>
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>{agent.role}</div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}>{agent.description}</p>
      <div style={{ display: "flex", gap: 10, fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
        <span>📡 {agent.channel}</span>
        <span>🔧 {agent.tools} tools</span>
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Team" subtitle="Fleet org chart + mission alignment" />
        <div style={{ padding: "24px 28px" }}>

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
              <Plus size={14} /> Add Agent
            </button>
          </div>

          {/* Mission statement */}
          <div
            style={{
              background: "var(--accent-subtle)",
              border: "1px solid rgba(94,106,210,0.2)",
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 36,
              maxWidth: 700,
            }}
          >
            <div style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, marginBottom: 6 }}>
              Fleet Mission
            </div>
            <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>
              Build and operate a multi-agent fleet that works autonomously on Tommy's behalf — each agent owning a specific domain, running independently, and coordinating when tasks overlap. Tommy directs; agents execute.
            </p>
          </div>

          {/* Org chart */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

            {/* Boss */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "2px solid var(--accent)",
                borderRadius: 10,
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 0,
              }}
            >
              <span style={{ fontSize: 22 }}>{team.boss.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{team.boss.name}</div>
                <div style={{ fontSize: 12, color: "var(--accent)" }}>{team.boss.role}</div>
              </div>
            </div>

            {/* Connector */}
            <div style={{ width: 2, height: 28, background: "var(--border)", margin: "0 auto" }} />
            <ArrowDown size={14} style={{ color: "var(--border)", marginTop: -8 }} />
            <div style={{ height: 12 }} />

            {/* Orchestrators */}
            <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
              {team.orchestrators.map((a) => <AgentCard key={a.name} agent={a} />)}
            </div>

            <div style={{ width: 2, height: 28, background: "var(--border)" }} />
            <ArrowDown size={14} style={{ color: "var(--border)", marginTop: -8 }} />
            <div style={{ height: 12 }} />

            {/* Workers + Observer */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {team.workers.map((a) => <AgentCard key={a.name} agent={a} />)}
              <AgentCard agent={team.observer} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
