"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { Search, BookOpen, Tag, Calendar } from "lucide-react";
import { useState } from "react";

const memoryEntries = [
  {
    date: "2026-04-19",
    entries: [
      {
        id: "1",
        type: "identity",
        title: "Claw came online",
        content: "Name: Claw 🦞. Main agent for Tommy (Boss). Orchestrator role — direct comms + fleet coordination.",
        tags: ["Identity", "Setup"],
      },
      {
        id: "2",
        type: "user",
        title: "About Boss",
        content: "Tommy Cedrone. EST timezone. Primary channel: Telegram. Building a multi-agent fleet. Communication style: direct, no fluff.",
        tags: ["User"],
      },
      {
        id: "3",
        type: "decision",
        title: "Fleet architecture decided",
        content: "Inspired by @adspendan's 20-agent blueprint. Specialized agents per domain (trading, email, etc.) running autonomously, coordinating when needed.",
        tags: ["Fleet", "Architecture"],
      },
      {
        id: "4",
        type: "lesson",
        title: "Communication preference",
        content: "Boss doesn't want hand-holding. Lead with the answer. He thinks in systems — match that energy.",
        tags: ["Comms", "Preference"],
      },
      {
        id: "5",
        type: "build",
        title: "Mission Control built",
        content: "Next.js dashboard built and running on localhost:3000. Linear-inspired design. Pages: Overview, Task Board, Calendar, Projects, Memory, Documents, Team, Office, Tools, Settings.",
        tags: ["Dev", "Dashboard"],
      },
    ],
  },
];

const typeConfig: Record<string, { color: string; bg: string; label: string }> = {
  identity: { color: "var(--accent)", bg: "var(--accent-subtle)", label: "Identity" },
  user: { color: "var(--green)", bg: "var(--green-subtle)", label: "User" },
  decision: { color: "var(--yellow)", bg: "var(--yellow-subtle)", label: "Decision" },
  lesson: { color: "var(--red)", bg: "var(--red-subtle)", label: "Lesson" },
  build: { color: "var(--text-secondary)", bg: "var(--bg-tertiary)", label: "Build" },
};

export default function MemoryPage() {
  const [search, setSearch] = useState("");

  const filtered = memoryEntries.map((day) => ({
    ...day,
    entries: day.entries.filter(
      (e) =>
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((day) => day.entries.length > 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Memory" subtitle="Searchable long-term memory journal" />
        <div style={{ padding: "24px 28px", maxWidth: 860 }}>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 7,
              padding: "9px 14px",
              marginBottom: 24,
            }}
          >
            <Search size={14} style={{ color: "var(--text-muted)" }} />
            <input
              placeholder="Search memories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Memory by day */}
          {filtered.map((day) => (
            <div key={day.date} style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  color: "var(--text-muted)",
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                <Calendar size={12} />
                {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {day.entries.map((entry) => {
                  const { color, bg, label } = typeConfig[entry.type] || typeConfig.build;
                  return (
                    <div
                      key={entry.id}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 9,
                        padding: "14px 18px",
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span
                          style={{
                            fontSize: 11,
                            color,
                            background: bg,
                            padding: "2px 7px",
                            borderRadius: 4,
                          }}
                        >
                          {label}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                          {entry.title}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: 10 }}>
                        {entry.content}
                      </p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 11,
                              color: "var(--text-muted)",
                              background: "var(--bg-tertiary)",
                              border: "1px solid var(--border)",
                              padding: "2px 7px",
                              borderRadius: 4,
                            }}
                          >
                            <Tag size={9} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <BookOpen size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No memories match</div>
              <div style={{ fontSize: 13 }}>Try a different search</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
