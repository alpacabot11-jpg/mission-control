"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect, useRef } from "react";

interface AgentInfo {
  name: string;
  emoji: string;
  role: string;
  status: "active" | "offline" | "draft";
  color: string;
  glowColor: string;
  doing: string;
  x: number;
  y: number;
}

export default function OfficePage() {
  const [traderRunning, setTraderRunning] = useState(false);
  const [traderDoing, setTraderDoing] = useState("Offline");
  const [emailRunning, setEmailRunning] = useState(false);
  const [emailDoing, setEmailDoing] = useState("Offline");
  const [hovered, setHovered] = useState<AgentInfo | null>(null);
  const [tick, setTick] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const [ts, tl, es, el] = await Promise.all([
          fetch("/api/trader?action=status").then(r => r.json()),
          fetch("/api/trader?action=logs").then(r => r.json()),
          fetch("/api/email?action=status").then(r => r.json()),
          fetch("/api/email?action=logs").then(r => r.json()),
        ]);
        setTraderRunning(ts.running);
        if (ts.running && tl.lines?.length) {
          const last = [...tl.lines].reverse().find((l: string) =>
            l.includes("Market") || l.includes("BUY") || l.includes("SELL") || l.includes("Buying power") || l.includes("Bot started")
          );
          if (last?.includes("Market closed")) setTraderDoing("Waiting for market open");
          else if (last?.includes("BUY signal")) setTraderDoing("Executing BUY order");
          else if (last?.includes("SELL signal")) setTraderDoing("Executing SELL order");
          else if (last?.includes("Buying power")) setTraderDoing("Scanning 2000 symbols");
          else setTraderDoing("Running");
        } else setTraderDoing(ts.running ? "Running" : "Offline");

        setEmailRunning(es.running);
        if (es.running && el.lines?.length) {
          const last = [...el.lines].reverse().find((l: string) =>
            l.includes("Sleeping") || l.includes("urgent") || l.includes("Archived") || l.includes("unread")
          );
          if (last?.includes("Sleeping")) setEmailDoing("Awaiting next scan");
          else if (last?.includes("urgent")) setEmailDoing("Flagging urgent email");
          else if (last?.includes("Archived")) setEmailDoing("Archiving newsletters");
          else if (last?.includes("unread")) setEmailDoing("Scanning inbox");
          else setEmailDoing("Running");
        } else setEmailDoing(es.running ? "Running" : "Offline");
      } catch { }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const agents: AgentInfo[] = [
    { name: "Claw", emoji: "🦞", role: "Orchestrator", status: "active", color: "#5e6ad2", glowColor: "rgba(94,106,210,0.6)", doing: "Monitoring · Mission Control", x: 180, y: 160 },
    { name: "Trader", emoji: "📈", role: "Trading Agent", status: traderRunning ? "active" : "offline", color: "#f0a429", glowColor: "rgba(240,164,41,0.6)", doing: traderDoing, x: 500, y: 160 },
    { name: "Email", emoji: "📧", role: "Email Agent", status: emailRunning ? "active" : "offline", color: "#4bc880", glowColor: "rgba(75,200,128,0.6)", doing: emailDoing, x: 180, y: 360 },
    { name: "Observer", emoji: "👁", role: "Fleet Observer", status: "draft", color: "#e05252", glowColor: "rgba(224,82,82,0.6)", doing: "Not yet built", x: 500, y: 360 },
  ];

  const W = 720;
  const H = 540;
  const t = tick * 0.05;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Office" subtitle="Claw Fleet HQ · Cyberpunk Command Center" />
        <div style={{ padding: "24px 28px" }}>

          {/* Legend */}
          <div style={{ display: "flex", gap: 20, marginBottom: 16, alignItems: "center" }}>
            {agents.map(a => (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "active" ? a.color : a.status === "offline" ? "#555" : "#333", boxShadow: a.status === "active" ? `0 0 6px ${a.color}` : "none" }} />
                <span style={{ color: a.status === "active" ? a.color : "var(--text-muted)" }}>{a.name}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 11 }}>· {a.doing}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>● Live · 10s refresh</div>
          </div>

          {/* Main canvas */}
          <div style={{ position: "relative", background: "#060810", border: "1px solid rgba(94,106,210,0.3)", borderRadius: 12, overflow: "hidden", display: "inline-block", boxShadow: "0 0 40px rgba(94,106,210,0.15), inset 0 0 80px rgba(0,0,0,0.5)" }}>
            <svg width={W} height={H} style={{ display: "block" }}>
              <defs>
                <filter id="glow-blue">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-strong">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="floor-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(94,106,210,0.08)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                <radialGradient id="center-light" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(94,106,210,0.05)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Background */}
              <rect width={W} height={H} fill="#060810" />
              <rect width={W} height={H} fill="url(#floor-grad)" />

              {/* Perspective grid floor */}
              {Array.from({ length: 20 }).map((_, i) => {
                const alpha = 0.03 + (i / 20) * 0.12;
                return (
                  <g key={`h${i}`}>
                    <line x1={0} y1={H * 0.5 + i * 22} x2={W} y2={H * 0.5 + i * 22} stroke={`rgba(94,106,210,${alpha})`} strokeWidth={0.5} />
                  </g>
                );
              })}
              {Array.from({ length: 28 }).map((_, i) => {
                const x = (i / 27) * W;
                const vanishX = W / 2;
                const vanishY = H * 0.5;
                const alpha = 0.03 + Math.abs(i - 13.5) / 27 * 0.08;
                return (
                  <line key={`v${i}`} x1={vanishX} y1={vanishY} x2={x} y2={H} stroke={`rgba(94,106,210,${alpha})`} strokeWidth={0.5} />
                );
              })}

              {/* Scan line animation */}
              <rect x={0} y={(Math.sin(t * 0.3) * 0.5 + 0.5) * H} width={W} height={2} fill="rgba(94,106,210,0.04)" />

              {/* Corner decorations */}
              {[
                [0, 0], [W - 60, 0], [0, H - 60], [W - 60, H - 60]
              ].map(([cx, cy], i) => (
                <g key={`corner${i}`} transform={`translate(${cx},${cy})`}>
                  <rect x={i % 2 === 0 ? 10 : 0} y={i < 2 ? 10 : 0} width={50} height={50}
                    fill="none" stroke="rgba(94,106,210,0.3)" strokeWidth={1}
                    strokeDasharray="8 4"
                    transform={`rotate(${i * 90}, 25, 25)`}
                  />
                  <circle cx={i % 2 === 0 ? 10 : 50} cy={i < 2 ? 10 : 50} r={3} fill="rgba(94,106,210,0.6)" />
                </g>
              ))}

              {/* HQ label */}
              <text x={W / 2} y={30} textAnchor="middle" fontSize={10} fill="rgba(94,106,210,0.5)" letterSpacing={6} fontWeight={700}>
                CLAW FLEET HQ
              </text>
              <line x1={W / 2 - 80} y1={36} x2={W / 2 + 80} y2={36} stroke="rgba(94,106,210,0.2)" strokeWidth={0.5} />

              {/* Connection lines between agents */}
              {agents.filter(a => a.status === "active").map(a =>
                agents.filter(b => b.name !== a.name && b.status === "active").map(b => {
                  const pulse = (Math.sin(t + a.x * 0.01) + 1) / 2;
                  return (
                    <line key={`${a.name}-${b.name}`}
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={`rgba(94,106,210,${0.05 + pulse * 0.08})`}
                      strokeWidth={0.8}
                      strokeDasharray="4 8"
                    />
                  );
                })
              )}

              {/* Data packets traveling along connections */}
              {agents.filter(a => a.status === "active").slice(0, 1).map(a =>
                agents.filter(b => b.name !== a.name && b.status === "active").map((b, i) => {
                  const progress = ((t * 0.3 + i * 0.5) % 1);
                  const px = a.x + (b.x - a.x) * progress;
                  const py = a.y + (b.y - a.y) * progress;
                  return (
                    <circle key={`packet-${a.name}-${b.name}`} cx={px} cy={py} r={2.5}
                      fill={a.color} opacity={0.8}
                      filter="url(#glow-blue)"
                    />
                  );
                })
              )}

              {/* Agent stations */}
              {agents.map((agent) => {
                const isActive = agent.status === "active";
                const isOffline = agent.status === "offline";
                const isDraft = agent.status === "draft";
                const isHov = hovered?.name === agent.name;
                const pulse = isActive ? Math.sin(t + agent.x * 0.01) * 0.3 + 0.7 : 0.3;
                const ringScale = isActive ? 1 + Math.sin(t * 1.5 + agent.x * 0.01) * 0.05 : 1;

                return (
                  <g key={agent.name}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHovered(agent)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Outer glow ring */}
                    {isActive && (
                      <circle cx={agent.x} cy={agent.y} r={55 * ringScale}
                        fill="none"
                        stroke={agent.color}
                        strokeWidth={0.5}
                        opacity={0.15 * pulse}
                      />
                    )}

                    {/* Platform base */}
                    <ellipse cx={agent.x} cy={agent.y + 45} rx={55} ry={12}
                      fill={isActive ? `${agent.color}08` : "rgba(255,255,255,0.02)"}
                      stroke={isActive ? `${agent.color}30` : "rgba(255,255,255,0.05)"}
                      strokeWidth={1}
                    />

                    {/* Holographic panel */}
                    <rect x={agent.x - 50} y={agent.y - 80} width={100} height={60} rx={4}
                      fill={isActive ? `${agent.color}08` : "rgba(255,255,255,0.02)"}
                      stroke={isActive ? `${agent.color}40` : "rgba(255,255,255,0.05)"}
                      strokeWidth={isHov ? 1.5 : 1}
                    />

                    {/* Panel scan lines */}
                    {isActive && Array.from({ length: 5 }).map((_, i) => (
                      <line key={i}
                        x1={agent.x - 44} y1={agent.y - 72 + i * 10}
                        x2={agent.x + 44} y2={agent.y - 72 + i * 10}
                        stroke={agent.color} strokeWidth={0.4} opacity={0.15}
                      />
                    ))}

                    {/* Panel content */}
                    <text x={agent.x} y={agent.y - 58} textAnchor="middle" fontSize={8} fill={isActive ? agent.color : "rgba(255,255,255,0.15)"} letterSpacing={1} fontWeight={700}>
                      {agent.role.toUpperCase()}
                    </text>

                    {/* Status indicator bar */}
                    <rect x={agent.x - 30} y={agent.y - 46} width={60} height={3} rx={1.5}
                      fill="rgba(255,255,255,0.05)"
                    />
                    {isActive && (
                      <rect x={agent.x - 30} y={agent.y - 46}
                        width={60 * pulse} height={3} rx={1.5}
                        fill={agent.color} opacity={0.7}
                      />
                    )}

                    {/* Mini chart lines on panel */}
                    {isActive && Array.from({ length: 8 }).map((_, i) => {
                      const h = 4 + Math.sin(t * 2 + i + agent.x * 0.1) * 4;
                      return (
                        <rect key={i}
                          x={agent.x - 28 + i * 8} y={agent.y - 38 - h}
                          width={5} height={h}
                          fill={agent.color} opacity={0.3}
                          rx={1}
                        />
                      );
                    })}

                    {/* Terminal stand */}
                    <rect x={agent.x - 3} y={agent.y - 18} width={6} height={20} rx={2}
                      fill={isActive ? `${agent.color}30` : "rgba(255,255,255,0.05)"}
                    />

                    {/* Agent body glow */}
                    {isActive && (
                      <circle cx={agent.x} cy={agent.y + 10} r={22}
                        fill={`${agent.color}10`}
                        filter="url(#glow-blue)"
                      />
                    )}

                    {/* Agent emoji */}
                    <text x={agent.x} y={agent.y + 22}
                      textAnchor="middle" fontSize={isDraft ? 20 : isOffline ? 22 : 26}
                      opacity={isDraft ? 0.15 : isOffline ? 0.3 : 1}
                      style={{ userSelect: "none", filter: isActive ? `drop-shadow(0 0 6px ${agent.color})` : "none" }}
                    >
                      {agent.emoji}
                    </text>

                    {/* Status dot */}
                    <circle cx={agent.x + 16} cy={agent.y + 2} r={5}
                      fill={isActive ? agent.color : isOffline ? "#333" : "#222"}
                      stroke={isActive ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.05)"}
                      strokeWidth={1}
                      filter={isActive ? "url(#glow-blue)" : "none"}
                    />
                    {isActive && (
                      <circle cx={agent.x + 16} cy={agent.y + 2} r={3}
                        fill="white" opacity={0.6}
                      />
                    )}

                    {/* Name */}
                    <text x={agent.x} y={agent.y + 44}
                      textAnchor="middle" fontSize={12}
                      fill={isActive ? agent.color : "rgba(255,255,255,0.15)"}
                      fontWeight={700} letterSpacing={2}
                      filter={isActive ? "url(#glow-blue)" : "none"}
                    >
                      {agent.name.toUpperCase()}
                    </text>

                    {/* LIVE badge */}
                    {isActive && (
                      <g>
                        <rect x={agent.x - 16} y={agent.y + 48} width={32} height={12} rx={6}
                          fill={`${agent.color}20`}
                          stroke={agent.color} strokeWidth={0.8}
                          opacity={pulse}
                        />
                        <text x={agent.x} y={agent.y + 57.5} textAnchor="middle" fontSize={7}
                          fill={agent.color} fontWeight={800} letterSpacing={1.5}
                          opacity={pulse}
                        >
                          LIVE
                        </text>
                      </g>
                    )}

                    {/* OFFLINE badge */}
                    {isOffline && (
                      <g>
                        <rect x={agent.x - 22} y={agent.y + 48} width={44} height={12} rx={6}
                          fill="rgba(255,255,255,0.03)"
                          stroke="rgba(255,255,255,0.1)" strokeWidth={0.8}
                        />
                        <text x={agent.x} y={agent.y + 57.5} textAnchor="middle" fontSize={7}
                          fill="rgba(255,255,255,0.2)" fontWeight={600} letterSpacing={1.5}
                        >
                          OFFLINE
                        </text>
                      </g>
                    )}

                    {/* Draft badge */}
                    {isDraft && (
                      <text x={agent.x} y={agent.y + 57} textAnchor="middle" fontSize={8}
                        fill="rgba(255,255,255,0.1)" letterSpacing={1}
                      >
                        NOT BUILT
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Center hub */}
              <circle cx={W / 2} cy={H / 2} r={8}
                fill="rgba(94,106,210,0.3)"
                stroke="rgba(94,106,210,0.6)"
                strokeWidth={1}
                filter="url(#glow-blue)"
              />
              <circle cx={W / 2} cy={H / 2} r={3} fill="rgba(94,106,210,0.8)" />
              <circle cx={W / 2} cy={H / 2}
                r={20 + Math.sin(t) * 5}
                fill="none"
                stroke="rgba(94,106,210,0.1)"
                strokeWidth={1}
              />

              {/* Bottom status bar */}
              <rect x={0} y={H - 28} width={W} height={28} fill="rgba(0,0,0,0.4)" />
              <line x1={0} y1={H - 28} x2={W} y2={H - 28} stroke="rgba(94,106,210,0.3)" strokeWidth={0.5} />
              <text x={16} y={H - 10} fontSize={9} fill="rgba(94,106,210,0.6)" letterSpacing={1}>
                {`SYS: ONLINE  |  AGENTS: ${agents.filter(a => a.status === "active").length}/4 ACTIVE  |  UPTIME: ${Math.floor(t / 60)}m ${Math.floor(t % 60)}s  |  CLAW FLEET v1.0`}
              </text>
              <circle cx={W - 16} cy={H - 14} r={4} fill={`rgba(75,200,128,${0.5 + Math.sin(t * 3) * 0.3})`} />
            </svg>
          </div>

          {/* Hover card */}
          {hovered && (
            <div style={{
              marginTop: 16,
              background: "linear-gradient(135deg, rgba(6,8,16,0.95), rgba(20,24,40,0.95))",
              border: `1px solid ${hovered.color}60`,
              borderRadius: 8,
              padding: "14px 18px",
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              boxShadow: `0 0 20px ${hovered.glowColor}30`,
            }}>
              <span style={{ fontSize: 24, filter: `drop-shadow(0 0 8px ${hovered.color})` }}>{hovered.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: hovered.color, letterSpacing: 1, marginBottom: 3 }}>
                  {hovered.name.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{hovered.role}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{hovered.doing}</div>
              </div>
              <div style={{ marginLeft: 8, width: 10, height: 10, borderRadius: "50%", background: hovered.status === "active" ? hovered.color : "#444", boxShadow: hovered.status === "active" ? `0 0 10px ${hovered.color}` : "none" }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
