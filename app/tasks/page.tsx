"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState } from "react";
import { Plus, Circle, Clock, CheckCircle2, Zap, MoreHorizontal } from "lucide-react";

type Status = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  title: string;
  agent: string;
  priority: "high" | "medium" | "low";
  status: Status;
  tag?: string;
}

const initialTasks: Record<Status, Task[]> = {
  todo: [
    { id: "1", title: "Build Trader agent", agent: "Claw", priority: "high", status: "todo", tag: "Fleet" },
    { id: "2", title: "Build Email agent", agent: "Claw", priority: "high", status: "todo", tag: "Fleet" },
    { id: "3", title: "Set up Observer agent", agent: "Claw", priority: "medium", status: "todo", tag: "Fleet" },
    { id: "4", title: "Configure Discord comms layer", agent: "Claw", priority: "medium", status: "todo", tag: "Comms" },
    { id: "5", title: "Define trading strategy guardrails", agent: "Trader", priority: "low", status: "todo", tag: "Trading" },
  ],
  "in-progress": [
    { id: "6", title: "Mission Control dashboard", agent: "Claw", priority: "high", status: "in-progress", tag: "Dev" },
  ],
  done: [
    { id: "7", title: "Core setup (IDENTITY, USER, SOUL, MEMORY)", agent: "Claw", priority: "high", status: "done", tag: "Setup" },
    { id: "8", title: "Mission, Playbook, Boundaries, Fleet, Comms", agent: "Claw", priority: "high", status: "done", tag: "Setup" },
  ],
};

const columns: { key: Status; label: string; icon: React.ElementType; color: string }[] = [
  { key: "todo", label: "To Do", icon: Circle, color: "var(--text-muted)" },
  { key: "in-progress", label: "In Progress", icon: Zap, color: "var(--yellow)" },
  { key: "done", label: "Done", icon: CheckCircle2, color: "var(--green)" },
];

const priorityColors = { high: "var(--red)", medium: "var(--yellow)", low: "var(--text-muted)" };
const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

const tagColors: Record<string, { bg: string; color: string }> = {
  Fleet: { bg: "rgba(94,106,210,0.12)", color: "var(--accent)" },
  Comms: { bg: "rgba(75,200,128,0.1)", color: "var(--green)" },
  Trading: { bg: "rgba(240,164,41,0.1)", color: "var(--yellow)" },
  Dev: { bg: "rgba(94,106,210,0.12)", color: "var(--accent)" },
  Setup: { bg: "rgba(75,200,128,0.1)", color: "var(--green)" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskCol, setNewTaskCol] = useState<Status | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = (status: Status) => {
    if (!newTaskTitle.trim()) { setNewTaskCol(null); return; }
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      agent: "Claw",
      priority: "medium",
      status,
      tag: "Custom",
    };
    setTasks((prev) => ({ ...prev, [status]: [...prev[status], task] }));
    setNewTaskTitle("");
    setNewTaskCol(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Task Board" subtitle="Assign work to agents · they pick it up on heartbeat" />
        <div style={{ padding: "24px 28px" }}>

          {/* Live activity strip */}
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 8,
              padding: "10px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
            <span style={{ color: "var(--green)", fontWeight: 500 }}>Live</span>
            <span>Claw last active: just now · Next heartbeat: ~30 min · 1 task in progress</span>
          </div>

          {/* Kanban */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
            {columns.map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0 4px",
                    marginBottom: 10,
                  }}
                >
                  <Icon size={13} style={{ color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {label}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "1px 7px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {tasks[key].length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {tasks[key].map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        cursor: "pointer",
                        opacity: task.status === "done" ? 0.6 : 1,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            border: `2px solid ${priorityColors[task.priority]}`,
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)",
                            lineHeight: 1.4,
                            textDecoration: task.status === "done" ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </span>
                        <MoreHorizontal size={13} style={{ color: "var(--text-muted)", marginLeft: "auto", flexShrink: 0 }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13 }}>{agentEmojis[task.agent] || "🤖"}</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{task.agent}</span>
                        {task.tag && (
                          <span
                            style={{
                              marginLeft: "auto",
                              fontSize: 11,
                              padding: "2px 7px",
                              borderRadius: 4,
                              background: tagColors[task.tag]?.bg || "var(--bg-tertiary)",
                              color: tagColors[task.tag]?.color || "var(--text-muted)",
                            }}
                          >
                            {task.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add task */}
                  {newTaskCol === key ? (
                    <div
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--accent)",
                        borderRadius: 8,
                        padding: "10px 12px",
                      }}
                    >
                      <input
                        autoFocus
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") addTask(key); if (e.key === "Escape") setNewTaskCol(null); }}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <button
                          onClick={() => addTask(key)}
                          style={{ fontSize: 12, padding: "3px 10px", borderRadius: 5, border: "none", background: "var(--accent)", color: "white", cursor: "pointer" }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setNewTaskCol(null)}
                          style={{ fontSize: 12, padding: "3px 10px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setNewTaskCol(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px dashed var(--border)",
                        background: "transparent",
                        color: "var(--text-muted)",
                        fontSize: 12,
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <Plus size={12} /> Add task
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
