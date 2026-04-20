"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Plus, Bot, Settings, ArrowRight } from "lucide-react";

const agents = [
  {
    name: "Claw",
    emoji: "🦞",
    role: "Orchestrator / Main",
    description: "Direct comms, fleet coordination, primary interface with Boss.",
    status: "active",
    channel: "Telegram",
    tools: 0,
    tasks: 0,
  },
  {
    name: "Trader",
    emoji: "📈",
    role: "Stock Trading",
    description: "Monitors markets, executes trades with explicit approval, tracks portfolio.",
    status: "draft",
    channel: "—",
    tools: 0,
    tasks: 0,
  },
  {
    name: "Email",
    emoji: "📧",
    role: "Email Management",
    description: "Reads, summarizes, drafts replies. Never sends without approval.",
    status: "draft",
    channel: "—",
    tools: 0,
    tasks: 0,
  },
  {
    name: "Observer",
    emoji: "👁",
    role: "Health + Alerts",
    description: "Monitors fleet health, aggregates heartbeats, alerts on failures.",
    status: "draft",
    channel: "—",
    tools: 0,
    tasks: 0,
  },
];

export default function AgentsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1 }}>
        <TopBar title="Agents" subtitle="Manage your fleet" />
        <div style={{ padding: "24px 32px", maxWidth: 1200 }}>

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
              <Plus size={14} />
              New Agent
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {agents.map((agent) => (
              <div
                key={agent.name}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 10,
                  padding: "20px",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {agent.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{agent.name}</span>
                      <span
                        style={{
                          fontSize: 11,
                          color: agent.status === "active" ? "var(--green)" : "var(--text-muted)",
                          background: agent.status === "active" ? "var(--green-subtle)" : "var(--bg-tertiary)",
                          padding: "2px 7px",
                          borderRadius: 4,
                          textTransform: "capitalize",
                        }}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{agent.role}</div>
                  </div>
                  <button
                    style={{
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "5px 8px",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Settings size={13} />
                  </button>
                </div>

                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
                  {agent.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    paddingTop: 14,
                    borderTop: "1px solid var(--border-subtle)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{agent.tools}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tools</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{agent.tasks}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Tasks run</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{agent.channel}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Channel</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        padding: "5px 10px",
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      Configure <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
