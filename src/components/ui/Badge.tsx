import React from "react";

type BadgeVariant = "brand" | "gold" | "success" | "warning" | "danger" | "info" | "neutral";

const config: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  brand:   { bg: "var(--brand-soft)",    color: "var(--terracotta-700)", border: "var(--brand-soft-border)" },
  gold:    { bg: "var(--gold-50)",        color: "var(--gold-700)",       border: "var(--gold-100)" },
  success: { bg: "var(--success-soft)",  color: "var(--success-strong)", border: "var(--sage-100)" },
  warning: { bg: "var(--warning-soft)",  color: "var(--warning)",        border: "var(--gold-100)" },
  danger:  { bg: "var(--danger-soft)",   color: "var(--danger-strong)",  border: "var(--clay-100)" },
  info:    { bg: "var(--info-soft)",     color: "var(--teal-600)",       border: "var(--teal-100)" },
  neutral: { bg: "var(--bg-subtle)",     color: "var(--text-muted)",     border: "var(--border-default)" },
};

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", dot, children }: BadgeProps) {
  const { bg, color, border } = config[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px",
        borderRadius: "var(--radius-pill)",
        background: bg,
        color,
        border: `1px solid ${border}`,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
