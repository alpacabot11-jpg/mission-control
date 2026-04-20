"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import {
  Bot,
  Wrench,
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  KanbanSquare,
  CalendarDays,
  BookOpen,
  Users,
  Building2,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Active Agents", value: "1", sub: "3 planned", icon: Bot, color: "var(--accent)" },
  { label: "Tools Built", value: "0", sub: "Start building", icon: Wrench, color: "var(--green)" },
  { label: "Tasks Queued", value: "5", sub: "1 in progress", icon: KanbanSquare, color: "var(--yellow)" },
  { label: "Fleet Health", value: "100%", sub: "All systems go", icon: TrendingUp, color: "var(--green)" },
];

const quickNav = [
  { label: "Task Board", icon: KanbanSquare, href: "/tasks", desc: "Kanban · assign work to agents" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar", desc: "Cron jobs · scheduled tasks" },
  { label: "Memory", icon: BookOpen, href: "/memory", desc: "Searchable journal" },
  { label: "Team", icon: Users, href: "/team", desc: "Org chart · fleet alignment" },
  { label: "Office", icon: Building2, href: "/office", desc: "2D map · live agent positions" },
  { label: "Tools", icon: Wrench, href: "/tools", desc: "Build custom agent tools" },
];

const recentActivity = [
  { icon: CheckCircle2, color: "var(--green)", text: "Core setup complete", time: "Tonight" },
  { icon: Bot, color: "var(--accent)", text: "Claw came online", time: "Tonight" },
  { icon: Wrench, color: "var(--text-muted)", text: "Mission Control built", time: "Tonight" },
  { icon: Clock, color: "var(--yellow)", text: "Trader agent scoped", time: "Pending" },
  { icon: Clock, color: "var(--yellow)", text: "Email agent scoped", time: "Pending" },
];

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>
        <TopBar title="Overview" subtitle="Claw Fleet · Mission Control" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>

          {/* Banner */}
          <div
            style={{
              background: "var(--accent-subtle)",
              border: "1px solid rgba(94,106,210,0.25)",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Zap size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Foundation is live. Fleet is ready to grow.</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2 }}>
                Build the Trader or Email agent next. Tell Claw which one to start.
              </div>
            </div>
            <Link href="/tasks">
              <button
                style={{
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                View tasks <ArrowRight size={12} />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22 }}>
            {stats.map(({ label, value, sub, icon: Icon, color }) => (
              <div
                key={label}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 9,
                  padding: "14px 16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: `${color}1a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Quick nav + activity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14 }}>

            {/* Quick Nav */}
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontWeight: 600 }}>
                Quick Access
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {quickNav.map(({ label, icon: Icon, href, desc }) => (
                  <Link key={href} href={href} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 9,
                        padding: "14px",
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                      }}
                    >
                      <Icon size={18} style={{ color: "var(--accent)", marginBottom: 8 }} />
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, fontWeight: 600 }}>
                Recent Activity
              </div>
              <div
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 9,
                  overflow: "hidden",
                }}
              >
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "11px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderBottom: i < recentActivity.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <item.icon size={14} style={{ color: item.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, color: "var(--text-primary)" }}>{item.text}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
