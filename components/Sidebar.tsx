"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Wrench,
  Activity,
  Settings,
  ChevronDown,
  Plus,
  Zap,
  KanbanSquare,
  CalendarDays,
  FolderKanban,
  BookOpen,
  FileText,
  Users,
  Building2,
  TrendingUp,
  Mail,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { label: "Overview", icon: LayoutDashboard, href: "/" },
  { label: "Task Board", icon: KanbanSquare, href: "/tasks" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar" },
  { label: "Projects", icon: FolderKanban, href: "/projects" },
  { label: "Memory", icon: BookOpen, href: "/memory" },
  { label: "Documents", icon: FileText, href: "/documents" },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Office", icon: Building2, href: "/office" },
  { label: "Trader", icon: TrendingUp, href: "/trader" },
  { label: "Email Agent", icon: Mail, href: "/email" },
  { label: "Usage", icon: BarChart2, href: "/usage" },
  { label: "Tools", icon: Wrench, href: "/tools" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Workspace header */}
      <div
        style={{
          padding: "14px 12px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
          }}
        >
          🦞
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
            Claw Fleet
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Mission Control</div>
        </div>
        <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "6px 0", overflowY: "auto" }}>
        {nav.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 10px",
                borderRadius: 5,
                margin: "1px 5px",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-hover)" : "transparent",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                transition: "all 0.1s",
              }}
            >
              <Icon size={14} style={{ opacity: active ? 1 : 0.65, flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}

        {/* Agents section */}
        <div style={{ marginTop: 14, padding: "4px 8px 6px", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Agents</span>
          <Plus size={11} style={{ cursor: "pointer" }} />
        </div>

        {[
          { name: "Claw", emoji: "🦞", status: "active" },
          { name: "Trader", emoji: "📈", status: "draft" },
          { name: "Email", emoji: "📧", status: "draft" },
          { name: "Observer", emoji: "👁", status: "draft" },
        ].map((agent) => (
          <div
            key={agent.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "4px 10px",
              borderRadius: 5,
              margin: "1px 5px",
              color: "var(--text-secondary)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 13 }}>{agent.emoji}</span>
            <span style={{ flex: 1 }}>{agent.name}</span>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: agent.status === "active" ? "var(--green)" : "var(--border)",
              }}
            />
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          T
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>Boss</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>EST</div>
        </div>
        <Zap size={13} style={{ color: "var(--accent)" }} />
      </div>
    </aside>
  );
}
