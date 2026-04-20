"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useEffect, useState, useRef } from "react";
import { Play, Square, RotateCcw, TrendingUp, TrendingDown, Activity, DollarSign, RefreshCw } from "lucide-react";

interface TraderStatus {
  running: boolean;
  pid: string | null;
}

export default function TraderPage() {
  const [status, setStatus] = useState<TraderStatus>({ running: false, pid: null });
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchStatus = async () => {
    const res = await fetch("/api/trader?action=status");
    const data = await res.json();
    setStatus(data);
  };

  const fetchLogs = async () => {
    const res = await fetch("/api/trader?action=logs");
    const data = await res.json();
    setLogs(data.lines || []);
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 50);
  };

  useEffect(() => {
    Promise.all([fetchStatus(), fetchLogs()]).then(() => setLoading(false));
    const interval = setInterval(() => { fetchStatus(); fetchLogs(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  const control = async (action: string) => {
    setActing(true);
    await fetch("/api/trader", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    await new Promise(r => setTimeout(r, 1500));
    await fetchStatus();
    await fetchLogs();
    setActing(false);
  };

  const getLogColor = (line: string) => {
    if (line.includes("BUY signal") || line.includes("BUY ")) return "var(--green)";
    if (line.includes("SELL signal") || line.includes("SELL ")) return "#f87171";
    if (line.includes("ERROR") || line.includes("error")) return "var(--red)";
    if (line.includes("WARNING") || line.includes("SKIP")) return "var(--yellow)";
    if (line.includes("Market closed") || line.includes("Market has closed")) return "var(--text-muted)";
    if (line.includes("Bot started") || line.includes("Account |")) return "var(--accent)";
    return "var(--text-secondary)";
  };

  // Parse quick stats from logs
  const todayBuys = logs.filter(l => l.includes("BUY signal")).length;
  const todaySells = logs.filter(l => l.includes("SELL signal")).length;
  const lastPrice = logs.filter(l => l.match(/\$[\d.]+.*ref/)).slice(-1)[0]?.match(/\$([\d.]+)/)?.[1];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Trader Agent" subtitle="📈 Alpaca paper trading · daily summary email" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>

          {/* Status + controls */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 20, alignItems: "start" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                {
                  label: "Status",
                  value: loading ? "..." : status.running ? "Running" : "Stopped",
                  sub: status.pid ? `PID ${status.pid}` : "Not active",
                  icon: Activity,
                  color: status.running ? "var(--green)" : "var(--text-muted)",
                },
                { label: "Buy Signals", value: todayBuys.toString(), sub: "Today", icon: TrendingUp, color: "var(--green)" },
                { label: "Sell Signals", value: todaySells.toString(), sub: "Today", icon: TrendingDown, color: "#f87171" },
                { label: "Last Price", value: lastPrice ? `$${lastPrice}` : "—", sub: "Most recent tick", icon: DollarSign, color: "var(--accent)" },
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

            {/* Controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {!status.running ? (
                <button
                  onClick={() => control("start")}
                  disabled={acting}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--green)", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: acting ? 0.7 : 1, whiteSpace: "nowrap" }}
                >
                  <Play size={15} /> Start Bot
                </button>
              ) : (
                <button
                  onClick={() => control("stop")}
                  disabled={acting}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--red)", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: acting ? 0.7 : 1, whiteSpace: "nowrap" }}
                >
                  <Square size={15} /> Stop Bot
                </button>
              )}
              <button
                onClick={() => control("restart")}
                disabled={acting}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: acting ? 0.7 : 1, whiteSpace: "nowrap" }}
              >
                <RotateCcw size={14} /> Restart
              </button>
              <button
                onClick={() => { fetchStatus(); fetchLogs(); }}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </div>

          {/* Config info */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Mode", value: "Paper Trading" },
              { label: "Buy trigger", value: "−5% from ref price" },
              { label: "Sell trigger", value: "+5% from ref price" },
              { label: "Poll interval", value: "Every 10 min" },
              { label: "Symbols watched", value: "65 symbols" },
              { label: "Daily summary", value: "alpacabot11@gmail.com" },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Live log */}
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: status.running ? "var(--green)" : "var(--border)" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Live Log</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: "auto" }}>Auto-refreshes every 10s</span>
            </div>
            <div
              ref={logRef}
              style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, height: 380, overflowY: "auto", background: "#0d0d0f" }}
            >
              {logs.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontFamily: "sans-serif", fontSize: 13, padding: "20px 0" }}>
                  {status.running ? "Waiting for log output..." : "Bot is stopped. Click Start Bot to begin."}
                </div>
              ) : (
                logs.map((line, i) => (
                  <div key={i} style={{ color: getLogColor(line), marginBottom: 1 }}>
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
