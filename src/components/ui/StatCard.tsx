import React from "react";

type Tone = "brand" | "gold" | "sage" | "teal";

const toneConfig: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: "var(--brand-soft)",   fg: "var(--terracotta-600)" },
  gold:  { bg: "var(--gold-50)",       fg: "var(--gold-700)" },
  sage:  { bg: "var(--success-soft)", fg: "var(--success-strong)" },
  teal:  { bg: "var(--info-soft)",    fg: "var(--teal-600)" },
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: string;
  tone?: Tone;
}

export function StatCard({ icon, label, value, delta, tone = "brand" }: StatCardProps) {
  const { bg, fg } = toneConfig[tone];
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: bg,
          color: fg,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 30,
          color: "var(--charcoal-900)",
          marginTop: 14,
        }}
      >
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{label}</span>
        {delta && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success-strong)" }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
