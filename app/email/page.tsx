"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useEffect, useState, useRef } from "react";
import { Play, Square, RotateCcw, Mail, AlertCircle, Archive, FileText, RefreshCw } from "lucide-react";

interface Draft {
  filename: string;
  content: string;
}

export default function EmailPage() {
  const [status, setStatus] = useState<any>({ running: false });
  const [logs, setLogs] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchAll = async () => {
    const [statusRes, logRes, draftRes] = await Promise.all([
      fetch("/api/email?action=status"),
      fetch("/api/email?action=logs"),
      fetch("/api/email?action=drafts"),
    ]);
    const s = await statusRes.json();
    const l = await logRes.json();
    const d = await draftRes.json();
    setStatus(s);
    setLogs(l.lines || []);
    setDrafts(d.drafts || []);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 50);
  };

  useEffect(() => {
    fetchAll().then(() => setLoading(false));
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const control = async (action: string) => {
    setActing(true);
    await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    await new Promise(r => setTimeout(r, 1500));
    await fetchAll();
    setActing(false);
  };

  const getLogColor = (line: string) => {
    if (line.includes("urgent") || line.includes("Urgent") || line.includes("URGENT")) return "#f87171";
    if (line.includes("Archived") || line.includes("archived")) return "var(--yellow)";
    if (line.includes("Draft") || line.includes("draft")) return "var(--accent)";
    if (line.includes("ERROR") || line.includes("error")) return "var(--red)";
    if (line.includes("started") || line.includes("watching")) return "var(--green)";
    return "var(--text-secondary)";
  };

  const urgentCount = logs.filter(l => l.includes("urgent") || l.includes("Urgent")).length;
  const archivedCount = logs.filter(l => l.includes("Archived") || l.includes("archived")).length;
  const draftCount = drafts.length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Email Agent" subtitle="📧 Gmail · urgent flagging · auto-archive · draft replies" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>

          {/* Stats + controls */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 20, alignItems: "start" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { label: "Status", value: loading ? "..." : status.running ? "Running" : "Stopped", sub: status.pid ? `PID ${status.pid}` : "Not active", icon: Mail, color: status.running ? "var(--green)" : "var(--text-muted)" },
                { label: "Urgent Flagged", value: urgentCount.toString(), sub: "This session", icon: AlertCircle, color: "#f87171" },
                { label: "Auto-Archived", value: archivedCount.toString(), sub: "Newsletters", icon: Archive, color: "var(--yellow)" },
                { label: "Drafts Saved", value: draftCount.toString(), sub: "Awaiting review", icon: FileText, color: "var(--accent)" },
              ].map(({ label, value, sub, icon: Icon, color }) => (
                <div key={label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 9, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {!status.running ? (
                <button onClick={() => control("start")} disabled={acting} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--green)", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: acting ? 0.7 : 1, whiteSpace: "nowrap" }}>
                  <Play size={15} /> Start Agent
                </button>
              ) : (
                <button onClick={() => control("stop")} disabled={acting} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--red)", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: acting ? 0.7 : 1, whiteSpace: "nowrap" }}>
                  <Square size={15} /> Stop Agent
                </button>
              )}
              <button onClick={() => control("restart")} disabled={acting} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                <RotateCcw size={14} /> Restart
              </button>
              <button onClick={fetchAll} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {/* Config */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Account", value: "alpacabot11@gmail.com" },
              { label: "Poll interval", value: "Every 2 min" },
              { label: "Urgent keywords", value: "20 patterns" },
              { label: "Auto-archive", value: "Newsletters + promos" },
              { label: "Draft replies", value: "Saved for review" },
              { label: "Telegram alerts", value: "On urgent emails" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Live log */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: status.running ? "var(--green)" : "var(--border)" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Live Log</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>Refreshes every 15s</span>
              </div>
              <div ref={logRef} style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, height: 300, overflowY: "auto", background: "#0d0d0f" }}>
                {logs.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: 13, padding: "20px 0" }}>
                    {status.running ? "Waiting for log output..." : "Agent stopped. Click Start Agent."}
                  </div>
                ) : logs.map((line, i) => (
                  <div key={i} style={{ color: getLogColor(line), marginBottom: 1 }}>{line}</div>
                ))}
              </div>
            </div>

            {/* Draft replies */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Draft Replies</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>Review before sending</span>
              </div>
              <div style={{ height: 300, overflowY: "auto" }}>
                {drafts.length === 0 ? (
                  <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    No drafts yet — urgent emails will generate drafts automatically
                  </div>
                ) : drafts.map((draft) => (
                  <div
                    key={draft.filename}
                    onClick={() => setSelectedDraft(selectedDraft?.filename === draft.filename ? null : draft)}
                    style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", cursor: "pointer", background: selectedDraft?.filename === draft.filename ? "var(--bg-hover)" : "transparent" }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>
                      {draft.filename.replace("draft_", "").replace(".txt", "")}
                    </div>
                    {selectedDraft?.filename === draft.filename && (
                      <pre style={{ fontSize: 11, color: "var(--text-secondary)", whiteSpace: "pre-wrap", marginTop: 8, lineHeight: 1.6 }}>
                        {draft.content}
                      </pre>
                    )}
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
