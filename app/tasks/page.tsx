"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useState, useEffect } from "react";
import { Plus, Circle, CheckCircle2, Zap, MoreHorizontal, Trash2, X } from "lucide-react";

type Status = "todo" | "in-progress" | "done";
type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  agent: string;
  priority: Priority;
  status: Status;
  tag?: string;
}

const columns: { key: Status; label: string; icon: React.ElementType; color: string }[] = [
  { key: "todo", label: "To Do", icon: Circle, color: "var(--text-muted)" },
  { key: "in-progress", label: "In Progress", icon: Zap, color: "var(--yellow)" },
  { key: "done", label: "Done", icon: CheckCircle2, color: "var(--green)" },
];

const priorityColors: Record<Priority, string> = {
  high: "var(--red)",
  medium: "var(--yellow)",
  low: "var(--text-muted)",
};

const agentEmojis: Record<string, string> = { Claw: "🦞", Trader: "📈", Email: "📧", Observer: "👁" };

const tagColors: Record<string, { bg: string; color: string }> = {
  Fleet: { bg: "rgba(94,106,210,0.12)", color: "var(--accent)" },
  Comms: { bg: "rgba(75,200,128,0.1)", color: "var(--green)" },
  Trading: { bg: "rgba(240,164,41,0.1)", color: "var(--yellow)" },
  Dev: { bg: "rgba(94,106,210,0.12)", color: "var(--accent)" },
  Setup: { bg: "rgba(75,200,128,0.1)", color: "var(--green)" },
  Custom: { bg: "rgba(255,255,255,0.05)", color: "var(--text-muted)" },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskCol, setNewTaskCol] = useState<Status | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAgent, setNewTaskAgent] = useState("Claw");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");
  const [newTaskTag, setNewTaskTag] = useState("");
  const [contextMenu, setContextMenu] = useState<{ task: Task; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/api/tasks").then((r) => r.json()).then((data) => { setTasks(data); setLoading(false); });
  }, []);

  const tasksByStatus = (status: Status) => tasks.filter((t) => t.status === status);

  const addTask = async () => {
    if (!newTaskTitle.trim() || !newTaskCol) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle, agent: newTaskAgent, priority: newTaskPriority, status: newTaskCol, tag: newTaskTag || undefined }),
    });
    const task = await res.json();
    setTasks((prev) => [...prev, task]);
    setNewTaskTitle("");
    setNewTaskCol(null);
  };

  const moveTask = async (id: string, status: Status) => {
    await fetch("/api/tasks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setContextMenu(null);
  };

  const deleteTask = async (id: string) => {
    await fetch("/api/tasks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setContextMenu(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }} onClick={() => setContextMenu(null)}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Task Board" subtitle="Assign work to agents · they pick it up on heartbeat" />
        <div style={{ padding: "24px 28px" }}>

          {/* Live strip */}
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-secondary)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
            <span style={{ color: "var(--green)", fontWeight: 500 }}>Live</span>
            <span>Claw active · {tasks.filter(t => t.status === "in-progress").length} in progress · {tasks.filter(t => t.status === "todo").length} queued</span>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>Loading tasks...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
              {columns.map(({ key, label, icon: Icon, color }) => (
                <div key={key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px", marginBottom: 10 }}>
                    <Icon size={13} style={{ color }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 10, padding: "1px 7px", color: "var(--text-muted)" }}>
                      {tasksByStatus(key).length}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tasksByStatus(key).map((task) => (
                      <div
                        key={task.id}
                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "12px 14px", cursor: "pointer", opacity: task.status === "done" ? 0.6 : 1 }}
                        onContextMenu={(e) => { e.preventDefault(); setContextMenu({ task, x: e.clientX, y: e.clientY }); }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${priorityColors[task.priority]}`, flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 13, color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)", lineHeight: 1.4, textDecoration: task.status === "done" ? "line-through" : "none", flex: 1 }}>
                            {task.title}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 13 }}>{agentEmojis[task.agent] || "🤖"}</span>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{task.agent}</span>
                          {task.tag && (
                            <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 7px", borderRadius: 4, background: tagColors[task.tag]?.bg || "var(--bg-tertiary)", color: tagColors[task.tag]?.color || "var(--text-muted)" }}>
                              {task.tag}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {newTaskCol === key ? (
                      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--accent)", borderRadius: 8, padding: "12px 14px" }}>
                        <input
                          autoFocus
                          placeholder="Task title..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") addTask(); if (e.key === "Escape") setNewTaskCol(null); }}
                          style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, marginBottom: 8 }}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                          <select value={newTaskAgent} onChange={(e) => setNewTaskAgent(e.target.value)} style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", color: "var(--text-primary)", fontSize: 11, outline: "none" }}>
                            {["Claw", "Trader", "Email", "Observer"].map(a => <option key={a}>{a}</option>)}
                          </select>
                          <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as Priority)} style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", color: "var(--text-primary)", fontSize: 11, outline: "none" }}>
                            {["high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
                          </select>
                          <input placeholder="Tag" value={newTaskTag} onChange={(e) => setNewTaskTag(e.target.value)} style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", color: "var(--text-primary)", fontSize: 11, outline: "none" }} />
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={addTask} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 5, border: "none", background: "var(--accent)", color: "white", cursor: "pointer" }}>Add</button>
                          <button onClick={() => setNewTaskCol(null)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setNewTaskCol(key)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px dashed var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", width: "100%" }}>
                        <Plus size={12} /> Add task
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Context menu */}
          {contextMenu && (
            <div
              style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x, background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px", zIndex: 200, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 12, color: "var(--text-muted)", padding: "4px 8px 6px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
                Move to
              </div>
              {(["todo", "in-progress", "done"] as Status[]).filter(s => s !== contextMenu.task.status).map((s) => (
                <button key={s} onClick={() => moveTask(contextMenu.task.id, s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 8px", background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", borderRadius: 5 }}>
                  {s === "todo" ? "📋 To Do" : s === "in-progress" ? "⚡ In Progress" : "✅ Done"}
                </button>
              ))}
              <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 4, paddingTop: 4 }}>
                <button onClick={() => deleteTask(contextMenu.task.id)} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", textAlign: "left", padding: "6px 8px", background: "transparent", border: "none", color: "var(--red)", fontSize: 13, cursor: "pointer", borderRadius: 5 }}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
