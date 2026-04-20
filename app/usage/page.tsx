"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useEffect, useState } from "react";
import { DollarSign, Zap, MessageSquare, TrendingUp, Plus, ExternalLink } from "lucide-react";

// Anthropic pricing (per 1M tokens)
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3.0, output: 15.0 },
  "claude-opus-4-7": { input: 15.0, output: 75.0 },
  "claude-haiku": { input: 0.25, output: 1.25 },
};

export default function UsagePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showManual, setShowManual] = useState(false);
  const [form, setForm] = useState({ model: "claude-sonnet-4-6", input_tokens: "", output_tokens: "", session_label: "" });
  const [saving, setSaving] = useState(false);

  const fetchUsage = async () => {
    const res = await fetch("/api/usage");
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { fetchUsage(); }, []);

  const calcCost = (model: string, input: number, output: number) => {
    const price = PRICING[model] || { input: 3.0, output: 15.0 };
    return (input / 1_000_000) * price.input + (output / 1_000_000) * price.output;
  };

  const submitManual = async () => {
    if (!form.input_tokens) return;
    setSaving(true);
    const input = parseInt(form.input_tokens);
    const output = parseInt(form.output_tokens || "0");
    const cost = calcCost(form.model, input, output);
    await fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, input_tokens: input, output_tokens: output, cost_usd: cost }),
    });
    await fetchUsage();
    setForm({ model: "claude-sonnet-4-6", input_tokens: "", output_tokens: "", session_label: "" });
    setShowManual(false);
    setSaving(false);
  };

  const totals = data?.totals || {};
  const byDay = data?.byDay || [];
  const byModel = data?.byModel || [];

  const totalCost = parseFloat(totals.total_cost || 0);
  const totalInput = parseInt(totals.total_input || 0);
  const totalOutput = parseInt(totals.total_output || 0);
  const totalSessions = parseInt(totals.total_sessions || 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Usage" subtitle="Anthropic API · current month" />
        <div style={{ padding: "24px 28px", maxWidth: 1000 }}>

          {/* Header actions */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 20 }}>
            <a href="https://console.anthropic.com/settings/usage" target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, textDecoration: "none", cursor: "pointer" }}>
              <ExternalLink size={13} /> Anthropic Console
            </a>
            <button onClick={() => setShowManual(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent)", color: "white", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <Plus size={14} /> Log Usage
            </button>
          </div>

          {/* Notice */}
          <div style={{ background: "var(--accent-subtle)", border: "1px solid rgba(94,106,210,0.2)", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
            Anthropic doesn't expose a public usage API. Log sessions manually or check the console for official figures. Costs are estimated using current pricing.
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Total Cost", value: `$${totalCost.toFixed(4)}`, sub: "This month (est.)", icon: DollarSign, color: "var(--green)" },
              { label: "Input Tokens", value: totalInput.toLocaleString(), sub: "Prompt tokens", icon: MessageSquare, color: "var(--accent)" },
              { label: "Output Tokens", value: totalOutput.toLocaleString(), sub: "Completion tokens", icon: TrendingUp, color: "var(--yellow)" },
              { label: "Sessions", value: totalSessions.toString(), sub: "Logged", icon: Zap, color: "var(--text-secondary)" },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 9, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                  <Icon size={13} style={{ color }} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color }}>{loading ? "—" : value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* By day */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: 13, fontWeight: 600 }}>Daily Breakdown</div>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
              ) : byDay.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                  No usage logged yet.<br />Click "Log Usage" to add a session.
                </div>
              ) : (
                <div>
                  <div style={{ padding: "8px 16px", display: "grid", gridTemplateColumns: "100px 1fr 1fr 80px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <span>Date</span><span>Input</span><span>Output</span><span>Cost</span>
                  </div>
                  {byDay.map((day: any) => (
                    <div key={day.date} style={{ padding: "10px 16px", borderTop: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "100px 1fr 1fr 80px", fontSize: 13 }}>
                      <span style={{ color: "var(--text-muted)" }}>{new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>{parseInt(day.input_tokens).toLocaleString()}</span>
                      <span>{parseInt(day.output_tokens).toLocaleString()}</span>
                      <span style={{ color: "var(--green)" }}>${parseFloat(day.cost_usd).toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By model */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: 13, fontWeight: 600 }}>By Model</div>

              {/* Pricing reference */}
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Pricing (per 1M tokens)</div>
                {Object.entries(PRICING).map(([model, price]) => (
                  <div key={model} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{model}</span>
                    <span style={{ color: "var(--text-muted)" }}>in ${price.input} / out ${price.output}</span>
                  </div>
                ))}
              </div>

              {byModel.length === 0 ? (
                <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No data yet</div>
              ) : byModel.map((m: any) => (
                <div key={m.model} style={{ padding: "12px 16px", borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{m.model}</span>
                    <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>${parseFloat(m.cost_usd).toFixed(4)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {parseInt(m.input_tokens).toLocaleString()} in · {parseInt(m.output_tokens).toLocaleString()} out
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual log modal */}
          {showManual && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
              onClick={e => { if (e.target === e.currentTarget) setShowManual(false); }}>
              <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 12, width: 440, padding: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Log Usage Session</div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Model</label>
                  <select value={form.model} onChange={e => setForm({ ...form, model: e.target.value })}
                    style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }}>
                    {Object.keys(PRICING).map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {[{ label: "Input Tokens", key: "input_tokens", placeholder: "e.g. 50000" }, { label: "Output Tokens", key: "output_tokens", placeholder: "e.g. 5000" }].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>
                      <input placeholder={placeholder} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, fontWeight: 500 }}>Session Label (optional)</label>
                  <input placeholder="e.g. Mission Control build session" value={form.session_label} onChange={e => setForm({ ...form, session_label: e.target.value })}
                    style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
                </div>
                {form.input_tokens && (
                  <div style={{ background: "var(--bg-tertiary)", borderRadius: 6, padding: "8px 12px", marginBottom: 16, fontSize: 12, color: "var(--text-secondary)" }}>
                    Estimated cost: <strong style={{ color: "var(--green)" }}>${calcCost(form.model, parseInt(form.input_tokens || "0"), parseInt(form.output_tokens || "0")).toFixed(6)}</strong>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowManual(false)} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={submitManual} disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "var(--accent)", color: "white", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>{saving ? "Saving..." : "Log Session"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
