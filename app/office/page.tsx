"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState } from "react";

interface Agent {
  name: string;
  emoji: string;
  role: string;
  status: "active" | "draft";
  desk: { x: number; y: number };
  color: string;
  doing: string;
}

const agents: Agent[] = [
  {
    name: "Claw",
    emoji: "🦞",
    role: "Orchestrator",
    status: "active",
    desk: { x: 3, y: 2 },
    color: "#5e6ad2",
    doing: "Monitoring Telegram · Building Mission Control",
  },
  {
    name: "Trader",
    emoji: "📈",
    role: "Trading Agent",
    status: "draft",
    desk: { x: 7, y: 2 },
    color: "#f0a429",
    doing: "Not yet built",
  },
  {
    name: "Email",
    emoji: "📧",
    role: "Email Agent",
    status: "draft",
    desk: { x: 3, y: 6 },
    color: "#4bc880",
    doing: "Not yet built",
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

// Room layout: walls, desks, decorations
const rooms = [
  { x: 1, y: 1, w: 4, h: 3, label: "Orchestrator", color: "rgba(94,106,210,0.06)", border: "rgba(94,106,210,0.2)" },
  { x: 6, y: 1, w: 4, h: 3, label: "Trading Desk", color: "rgba(240,164,41,0.06)", border: "rgba(240,164,41,0.2)" },
  { x: 1, y: 5, w: 4, h: 3, label: "Email Ops", color: "rgba(75,200,128,0.06)", border: "rgba(75,200,128,0.2)" },
  { x: 6, y: 5, w: 4, h: 3, label: "Observer HQ", color: "rgba(224,82,82,0.06)", border: "rgba(224,82,82,0.2)" },
];

export default function OfficePage() {
  const [hovered, setHovered] = useState<Agent | null>(null);

  const gridW = COLS * CELL;
  const gridH = ROWS * CELL;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Office" subtitle="Live 2D map of your fleet" />
        <div style={{ padding: "24px 28px" }}>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {agents.map((a) => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "active" ? a.color : "var(--border)" }} />
                <span>{a.emoji} {a.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>— {a.role}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 12,
              padding: 24,
              display: "inline-block",
              position: "relative",
            }}
          >
            <svg
              width={gridW}
              height={gridH}
              style={{ display: "block", fontFamily: "monospace" }}
            >
              {/* Grid dots */}
              {Array.from({ length: ROWS + 1 }).map((_, row) =>
                Array.from({ length: COLS + 1 }).map((_, col) => (
                  <circle
                    key={`${col}-${row}`}
                    cx={col * CELL}
                    cy={row * CELL}
                    r={1.5}
                    fill="rgba(255,255,255,0.04)"
                  />
                ))
              )}

              {/* Rooms */}
              {rooms.map((room, i) => (
                <g key={i}>
                  <rect
                    x={room.x * CELL}
                    y={room.y * CELL}
                    width={room.w * CELL}
                    height={room.h * CELL}
                    fill={room.color}
                    stroke={room.border}
                    strokeWidth={1.5}
                    rx={8}
                  />
                  <text
                    x={room.x * CELL + (room.w * CELL) / 2}
                    y={room.y * CELL + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill="rgba(255,255,255,0.2)"
                    fontWeight={600}
                    letterSpacing={1}
                  >
                    {room.label.toUpperCase()}
                  </text>
                </g>
              ))}

              {/* Desks */}
              {agents.map((agent) => {
                const x = agent.desk.x * CELL;
                const y = agent.desk.y * CELL;
                const isActive = agent.status === "active";
                const isHovered = hovered?.name === agent.name;

                return (
                  <g
                    key={agent.name}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(agent)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Desk */}
                    <rect
                      x={x - 22}
                      y={y - 10}
                      width={44}
                      height={28}
                      rx={5}
                      fill={isActive ? `${agent.color}22` : "rgba(255,255,255,0.04)"}
                      stroke={isActive ? agent.color : "rgba(255,255,255,0.1)"}
                      strokeWidth={isHovered ? 2 : 1}
                    />

                    {/* Monitor */}
                    <rect x={x - 10} y={y - 18} width={20} height={12} rx={3}
                      fill={isActive ? `${agent.color}44` : "rgba(255,255,255,0.06)"}
                      stroke={isActive ? agent.color : "rgba(255,255,255,0.1)"}
                      strokeWidth={0.8}
                    />
                    <rect x={x - 2} y={y - 6} width={4} height={3} rx={1}
                      fill={isActive ? agent.color : "rgba(255,255,255,0.1)"}
                    />

                    {/* Agent emoji + pulse */}
                    {isActive && (
                      <circle cx={x} cy={y + 22} r={14} fill={`${agent.color}18`} />
                    )}
                    <text
                      x={x}
                      y={y + 27}
                      textAnchor="middle"
                      fontSize={isActive ? 18 : 14}
                      style={{ userSelect: "none" }}
                      opacity={isActive ? 1 : 0.35}
                    >
                      {agent.emoji}
                    </text>

                    {/* Status dot */}
                    {isActive && (
                      <circle cx={x + 10} cy={y + 12} r={4} fill="#4bc880" stroke="var(--bg-secondary)" strokeWidth={1.5} />
                    )}

                    {/* Name label */}
                    <text
                      x={x}
                      y={y + 46}
                      textAnchor="middle"
                      fontSize={11}
                      fill={isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}
                      fontWeight={500}
                    >
                      {agent.name}
                    </text>
                  </g>
                );
              })}

              {/* Corridors / paths */}
              <line x1={5 * CELL} y1={1.5 * CELL} x2={6 * CELL} y2={1.5 * CELL} stroke="rgba(255,255,255,0.04)" strokeWidth={CELL * 0.8} />
              <line x1={3 * CELL} y1={4 * CELL} x2={3 * CELL} y2={5 * CELL} stroke="rgba(255,255,255,0.04)" strokeWidth={CELL * 0.8} />
              <line x1={8 * CELL} y1={4 * CELL} x2={8 * CELL} y2={5 * CELL} stroke="rgba(255,255,255,0.04)" strokeWidth={CELL * 0.8} />

              {/* Entrance label */}
              <text x={gridW / 2} y={gridH - 10} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.15)" letterSpacing={2}>
                CLAW FLEET HQ
              </text>
            </svg>
          </div>

          {/* Hover tooltip */}
          {hovered && (
            <div
              style={{
                marginTop: 16,
                background: "var(--bg-secondary)",
                border: `1px solid ${hovered.color}44`,
                borderRadius: 8,
                padding: "12px 16px",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontSize: 13,
              }}
            >
              <span style={{ fontSize: 20 }}>{hovered.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{hovered.name} — {hovered.role}</div>
                <div style={{ color: "var(--text-muted)", marginTop: 2 }}>{hovered.doing}</div>
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: hovered.status === "active" ? "var(--green)" : "var(--border)",
                  marginLeft: 8,
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
