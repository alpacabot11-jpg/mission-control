"use client";

import { Search, Bell, Command } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <div
      style={{
        height: 52,
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        background: "var(--bg-primary)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{subtitle}</p>}
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "5px 10px",
          cursor: "pointer",
          color: "var(--text-muted)",
          fontSize: 13,
          minWidth: 200,
        }}
      >
        <Search size={13} />
        <span style={{ flex: 1 }}>Search...</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 11,
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "1px 5px",
          }}
        >
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      {/* Bell */}
      <button
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: "1px solid var(--border)",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--text-secondary)",
        }}
      >
        <Bell size={15} />
      </button>
    </div>
  );
}
