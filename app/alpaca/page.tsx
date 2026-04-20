"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, Activity, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function AlpacaPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetch_ = async () => {
    try {
      const res = await fetch("/api/alpaca");
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setData(d);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch_();
    const interval = setInterval(fetch_, 30000);
    return () => clearInterval(interval);
  }, []);

  const account = data?.account;
  const positions = data?.positions || [];
  const orders = data?.orders || [];
  const clock = data?.clock;

  const portfolioValue = parseFloat(account?.portfolio_value || 0);
  const cash = parseFloat(account?.cash || 0);
  const buyingPower = parseFloat(account?.buying_power || 0);
  const equity = parseFloat(account?.equity || 0);
  const lastEquity = parseFloat(account?.last_equity || 0);
  const dayPnl = equity - lastEquity;
  const dayPnlPct = lastEquity > 0 ? (dayPnl / lastEquity) * 100 : 0;
  const isMarketOpen = clock?.is_open;

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1 }}>
        <TopBar title="Alpaca" subtitle="Paper trading account · live data" />
        <div style={{ padding: "24px 28px", maxWidth: 1100 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: isMarketOpen ? "var(--green)" : "var(--text-muted)", background: isMarketOpen ? "var(--green-subtle)" : "var(--bg-secondary)", border: `1px solid ${isMarketOpen ? "rgba(75,200,128,0.3)" : "var(--border)"}`, padding: "4px 10px", borderRadius: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: isMarketOpen ? "var(--green)" : "var(--text-muted)" }} />
                {loading ? "Checking..." : isMarketOpen ? "Market Open" : "Market Closed"}
              </div>
              {!loading && clock && (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {isMarketOpen ? `Closes ${new Date(clock.next_close).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : `Opens ${new Date(clock.next_open).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {lastUpdated && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Updated {lastUpdated}</span>}
              <button onClick={fetch_} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", color: "var(--text-muted)", fontSize: 12, cursor: "pointer" }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "var(--red-subtle)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "var(--red)", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Account stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Portfolio Value", value: loading ? "—" : fmt(portfolioValue), sub: "Total account value", icon: DollarSign, color: "var(--accent)" },
              { label: "Day P&L", value: loading ? "—" : fmt(dayPnl), sub: loading ? "" : fmtPct(dayPnlPct), icon: dayPnl >= 0 ? TrendingUp : TrendingDown, color: dayPnl >= 0 ? "var(--green)" : "var(--red)" },
              { label: "Cash", value: loading ? "—" : fmt(cash), sub: "Available cash", icon: DollarSign, color: "var(--text-secondary)" },
              { label: "Buying Power", value: loading ? "—" : fmt(buyingPower), sub: "2x margin", icon: Activity, color: "var(--yellow)" },
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Positions */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Open Positions</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{positions.length} holdings</span>
              </div>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
              ) : positions.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No open positions</div>
              ) : (
                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                  <div style={{ padding: "8px 16px", display: "grid", gridTemplateColumns: "60px 1fr 80px 80px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-subtle)" }}>
                    <span>Symbol</span><span>Value</span><span>P&L</span><span>%</span>
                  </div>
                  {positions.map((pos: any) => {
                    const pnl = parseFloat(pos.unrealized_pl);
                    const pnlPct = parseFloat(pos.unrealized_plpc) * 100;
                    const isUp = pnl >= 0;
                    return (
                      <div key={pos.symbol} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", display: "grid", gridTemplateColumns: "60px 1fr 80px 80px", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{pos.symbol}</span>
                        <div>
                          <div style={{ fontSize: 13 }}>{fmt(parseFloat(pos.market_value))}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{pos.qty} shares @ {fmt(parseFloat(pos.avg_entry_price))}</div>
                        </div>
                        <span style={{ fontSize: 13, color: isUp ? "var(--green)" : "var(--red)", fontWeight: 500 }}>{fmt(pnl)}</span>
                        <span style={{ fontSize: 12, color: isUp ? "var(--green)" : "var(--red)" }}>{fmtPct(pnlPct)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent orders */}
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Orders</span>
              </div>
              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>Loading...</div>
              ) : orders.length === 0 ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No recent orders</div>
              ) : (
                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                  {orders.map((order: any) => {
                    const isBuy = order.side === "buy";
                    const isFilled = order.status === "filled";
                    const isCanceled = order.status === "canceled";
                    return (
                      <div key={order.id} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: isBuy ? "var(--green-subtle)" : "var(--red-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {isBuy ? <TrendingUp size={13} style={{ color: "var(--green)" }} /> : <TrendingDown size={13} style={{ color: "var(--red)" }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{order.symbol}</span>
                            <span style={{ fontSize: 11, color: isBuy ? "var(--green)" : "var(--red)", textTransform: "uppercase" }}>{order.side}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {order.notional ? `$${parseFloat(order.notional).toFixed(2)}` : `${order.qty} shares`} · {order.type}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                            {isFilled ? <CheckCircle2 size={11} style={{ color: "var(--green)" }} /> : isCanceled ? <XCircle size={11} style={{ color: "var(--red)" }} /> : <Clock size={11} style={{ color: "var(--yellow)" }} />}
                            <span style={{ fontSize: 11, color: isFilled ? "var(--green)" : isCanceled ? "var(--red)" : "var(--yellow)", textTransform: "capitalize" }}>{order.status}</span>
                          </div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                            {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Account details */}
          {account && (
            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "16px 20px", marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Account Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { label: "Account #", value: account.account_number },
                  { label: "Status", value: account.status },
                  { label: "Pattern Day Trader", value: account.pattern_day_trader ? "Yes" : "No" },
                  { label: "Day Trades Remaining", value: account.daytrade_count ?? "—" },
                  { label: "Long Market Value", value: fmt(parseFloat(account.long_market_value || 0)) },
                  { label: "Short Market Value", value: fmt(parseFloat(account.short_market_value || 0)) },
                  { label: "Initial Margin", value: fmt(parseFloat(account.initial_margin || 0)) },
                  { label: "Maintenance Margin", value: fmt(parseFloat(account.maintenance_margin || 0)) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
