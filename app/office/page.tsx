"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";

interface AgentInfo {
  name: string;
  emoji: string;
  role: string;
  status: "active" | "draft" | "offline";
  desk: { x: number; y: number };
  color: string;
  doing: string;
}

export default function OfficePage() {
  const [traderRunning, setTraderRunning] = useState(false);
  const [traderDoing, setTraderDoing] = useState("Not yet built");
  const [emailRunning, setEmailRunning] = useState(false);
  const [emailDoing, setEmailDoing] = useState("Not yet built");
  const [hovered, setHovered] = useState<AgentInfo | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const [traderStatus, traderLogs, emailStatus, emailLogs] = await Promise.all([
          fetch("/api/trader?action=status").then(r => r.json()),
          fetch("/api/trader?action=logs").then(r => r.json()),
          fetch("/api/email?action=status").then(r => r.json()),
          fetch("/api/email?action=logs").then(r => r.json()),
        ]);

        setTraderRunning(traderStatus.running);
        if (traderStatus.running && traderLogs.lines?.length) {
          const last = [...traderLogs.lines].reverse().find((l: string) =>
            l.includes("Market") || l.includes("BUY") || l.includes("SELL") || l.includes("Bot started") || l.includes("Buying power")
          );
          if (last) {
            if (last.includes("Market closed")) setTraderDoing("⏳ Waiting for market open");
            else if (last.includes("BUY signal")) setTraderDoing("🟢 Executing BUY order");
            else if (last.includes("SELL signal")) setTraderDoing("🔴 Executing SELL order");
            else if (last.includes("Buying power")) setTraderDoing("👀 Scanning 2000 symbols");
            else if (last.includes("Bot started")) setTraderDoing("🚀 Bot started, watching market");
            else setTraderDoing("Running");
          }
        } else if (!traderStatus.running) {
          setTraderDoing("Stopped — start from Trader page");
        }

        setEmailRunning(emailStatus.running);
        if (emailStatus.running && emailLogs.lines?.length) {
          const last = [...emailLogs.lines].reverse().find((l: string) =>
            l.includes("unread") || l.includes("urgent") || l.includes("Archived") || l.includes("Sleeping") || l.includes("started")
          );
          if (last) {
            if (last.includes("Sleeping")) setEmailDoing("💤 Waiting for next check");
            else if (last.includes("urgent")) setEmailDoing("🚨 Flagging urgent email");
            else if (last.includes("Archived")) setEmailDoing("📦 Archiving newsletters");
            else if (last.includes("unread")) setEmailDoing("📬 Scanning inbox");
            else if (last.includes("started")) setEmailDoing("🚀 Agent started");
            else setEmailDoing("Running");
          }
        } else if (!emailStatus.running) {
          setEmailDoing("Stopped — start from Email Agent page");
        }
      } catch {
        setTraderRunning(false);
        setEmailRunning(false);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const agents: AgentInfo[] = [
    {
      name: "Claw",
      emoji: "🦞",
      role: "Orchestrator",
      status: "active",
      desk: { x: 3, y: 2 },
      color: "#5e6ad2",
      doing: "Monitoring Telegram · Running Mission Control",
    },
    {
      name: "Trader",
      emoji: "📈",
      role: "Trading Agent",
      status: traderRunning ? "active" : "offline",
      desk: { x: 7, y: 2 },
      color: "#f0a429",
      doing: traderDoing,
    },
    {
      name: "Email",
      emoji: "📧",
      role: "Email Agent",
      status: emailRunning ? "active" : "offline",
      desk: { x: 3, y: 6 },
      color: "#4bc880",
      doing: emailDoing,
    },
    {
      name: "Observer",
      emoji: "👁",
      role: "Fleet Observer",
      status: "draft",
      desk: { x: 7, y: 6 },
      color: "#e05252",
      doing: "Not yet built",
    },
  ];

  const COLS = 12;
  const ROWS = 10;
  const CELL = 60;
  const gridW = COLS * CELL;
  const gridH = ROWS * CELL;

  const rooms = [
    { x: 1, y: 1, w: 4, h: 3, label: "Orchestrator", color: "rgba(94,106,210,0.06)", border: "rgba(94,106,210,0.2)" },
    { x: 6, y: 1, w: 4, h: 3, label: "Trading Desk", color: traderRunning ? "rgba(240,164,41,0.1)" : "rgba(240,164,41,0.03)", border: traderRunning ? "rgba(240,164,41,0.4)" : "rgba(240,164,41,0.15)" },
    { x: 1, y: 5, w: 4, h: 3, label: "Email Ops", color: "rgba(75,200,128,0.06)", border: "rgba(75,200,128,0.2)" },
    { x: 6, y: 5, w: 4, h: 3, label: "Observer HQ", color: "rgba(224,82,82,0.06)", border: "rgba(224,82,82,0.2)" },
  ];

  const statusColor = (s: string) => s === "active" ? "#4bc880" : s === "offline" ? "#e05252" : "rgba(255,255,255,0.15)";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Office" subtitle="Live 2D map · updates every 10s" />
        <div style={{ padding: "24px 28px" }}>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            {agents.map((a) => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(a.status) }} />
                <span>{a.emoji} {a.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                  {a.status === "active" ? "● online" : a.status === "offline" ? "● stopped" : "○ not built"}
                </span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)" }} />
              Live · auto-refresh 10s
            </div>
          </div>

          {/* Map */}
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 24, display: "inline-block" }}>
            <svg width={gridW} height={gridH} style={{ display: "block" }}>
              {/* Grid dots */}
              {Array.from({ length: ROWS + 1 }).map((_, row) =>
                Array.from({ length: COLS + 1 }).map((_, col) => (
                  <circle key={`${col}-${row}`} cx={col * CELL} cy={row * CELL} r={1.5} fill="rgba(255,255,255,0.04)" />
                ))
              )}

              {/* Rooms */}
              {rooms.map((room, i) => (
                <g key={i}>
                  <rect x={room.x * CELL} y={room.y * CELL} width={room.w * CELL} height={room.h * CELL} fill={room.color} stroke={room.border} strokeWidth={1.5} rx={8} />
                  <text x={room.x * CELL + (room.w * CELL) / 2} y={room.y * CELL + 14} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.2)" fontWeight={600} letterSpacing={1}>
                    {room.label.toUpperCase()}
                  </text>
                </g>
              ))}

              {/* Agents */}
              {agents.map((agent) => {
                const x = agent.desk.x * CELL;
                const y = agent.desk.y * CELL;
                const isActive = agent.status === "active";
                const isOffline = agent.status === "offline";
                const isHovered = hovered?.name === agent.name;

                return (
                  <g key={agent.name} style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(agent)} onMouseLeave={() => setHovered(null)}>
                    {/* Desk */}
                    <rect x={x - 22} y={y - 10} width={44} height={28} rx={5}
                      fill={isActive ? `${agent.color}22` : "rgba(255,255,255,0.03)"}
                      stroke={isActive ? agent.color : isOffline ? "#e05252" : "rgba(255,255,255,0.08)"}
                      strokeWidth={isHovered ? 2 : 1}
                    />
                    {/* Monitor */}
                    <rect x={x - 10} y={y - 18} width={20} height={12} rx={3}
                      fill={isActive ? `${agent.color}44` : "rgba(255,255,255,0.04)"}
                      stroke={isActive ? agent.color : "rgba(255,255,255,0.08)"}
                      strokeWidth={0.8}
                    />
                    <rect x={x - 2} y={y - 6} width={4} height={3} rx={1}
                      fill={isActive ? agent.color : "rgba(255,255,255,0.08)"}
                    />

                    {/* Glow ring for active */}
                    {isActive && <circle cx={x} cy={y + 22} r={14} fill={`${agent.color}15`} />}

                    {/* Emoji */}
                    <text x={x} y={y + 27} textAnchor="middle" fontSize={isActive ? 18 : 14} style={{ userSelect: "none" }} opacity={isActive ? 1 : isOffline ? 0.4 : 0.2}>
                      {agent.emoji}
                    </text>

                    {/* Status dot */}
                    <circle cx={x + 10} cy={y + 12} r={4}
                      fill={statusColor(agent.status)}
                      stroke="var(--bg-secondary)"
                      strokeWidth={1.5}
                    />

                    {/* Name */}
                    <text x={x} y={y + 46} textAnchor="middle" fontSize={11}
                      fill={isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"}
                      fontWeight={500}
                    >
                      {agent.name}
                    </text>

                    {/* "LIVE" badge for active trader */}
                    {agent.name === "Trader" && isActive && (
                      <g>
                        <rect x={x - 14} y={y + 49} width={28} height={12} rx={3} fill="rgba(240,164,41,0.2)" stroke="rgba(240,164,41,0.5)" strokeWidth={0.8} />
                        <text x={x} y={y + 59} textAnchor="middle" fontSize={9} fill="#f0a429" fontWeight={700} letterSpacing={1}>LIVE</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Floor label */}
              <text x={gridW / 2} y={gridH - 10} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.1)" letterSpacing={2}>
                CLAW FLEET HQ
              </text>
            </svg>
          </div>

          {/* Hover info */}
          {hovered && (
            <div style={{ marginTop: 16, background: "var(--bg-secondary)", border: `1px solid ${hovered.color}44`, borderRadius: 8, padding: "12px 16px", display: "inline-flex", alignItems: "center", gap: 12, fontSize: 13 }}>
              <span style={{ fontSize: 20 }}>{hovered.emoji}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{hovered.name} — {hovered.role}</div>
                <div style={{ color: "var(--text-muted)", marginTop: 2, fontSize: 12 }}>{hovered.doing}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: hovered.status === "active" ? "var(--green)" : hovered.status === "offline" ? "var(--red)" : "var(--border)", marginLeft: 8 }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
