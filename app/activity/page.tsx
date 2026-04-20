"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { CheckCircle2, Bot, Wrench, AlertCircle, Clock } from "lucide-react";

const events = [
  {
    icon: CheckCircle2,
    color: "var(--green)",
    title: "Core setup complete",
    detail: "IDENTITY, USER, MEMORY, Mission, Playbook, Boundaries, Fleet, Comms — all committed",
    agent: "Claw",
    time: "Today, 6:55 PM",
  },
  {
    icon: Bot,
    color: "var(--accent)",
    title: "Claw agent initialized",
    detail: "Main agent online. Connected via Telegram.",
    agent: "Claw",
    time: "Today, 6:55 PM",
  },
  {
    icon: Clock,
    color: "var(--yellow)",
    title: "Trader agent scoped",
    detail: "Role defined. Awaiting build.",
    agent: "System",
    time: "Today, 6:55 PM",
  },
  {
    icon: Clock,
    color: "var(--yellow)",
    title: "Email agent scoped",
    detail: "Role defined. Awaiting build.",
    agent: "System",
    time: "Today, 6:55 PM",
  },
  {
    icon: Wrench,
    color: "var(--text-muted)",
    title: "Mission Control dashboard built",
    detail: "Next.js app running on localhost:3000",
    agent: "Claw",
    time: "Today, 7:00 PM",
  },
];

export default function ActivityPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1 }}>
        <TopBar title="Activity" subtitle="Full fleet event log" />
        <div style={{ padding: "24px 32px", maxWidth: 900 }}>
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
                padding: "12px 20px",
                borderBottom: "1px solid var(--border-subtle)",
                fontSize: 11,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Today — April 19, 2026
            </div>
            {events.map((event, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 20px",
                  borderBottom: i < events.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${event.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <event.icon size={15} style={{ color: event.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 3 }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{event.detail}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{event.time}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      background: "var(--accent-subtle)",
                      padding: "2px 7px",
                      borderRadius: 4,
                    }}
                  >
                    {event.agent}
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
