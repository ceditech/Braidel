import React from "react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "24px 32px 18px",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "rgba(251,247,241,.9)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 27,
            margin: 0,
            color: "var(--charcoal-900)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "3px 0 0", color: "var(--text-muted)", fontSize: 14 }}>{subtitle}</p>
        )}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notification bell */}
        <button
          style={{
            width: 42,
            height: 42,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-default)",
            background: "var(--surface-card)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
            color: "var(--brown-600)",
            position: "relative",
          }}
          aria-label="Notifications"
        >
          <BellIcon />
          <span
            style={{
              position: "absolute",
              top: 9,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--terracotta-500)",
              border: "2px solid var(--surface-card)",
            }}
          />
        </button>
        {action}
      </div>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
