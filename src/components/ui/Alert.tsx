import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "danger";

const COLORS: Record<AlertVariant, { background: string; border: string; color: string }> = {
  info: { background: "var(--info-soft)", border: "var(--teal-100)", color: "var(--teal-600)" },
  success: { background: "var(--success-soft)", border: "var(--sage-100)", color: "var(--success-strong)" },
  warning: { background: "var(--warning-soft)", border: "var(--gold-100)", color: "var(--warning)" },
  danger: { background: "var(--danger-soft)", border: "var(--clay-100)", color: "var(--danger-strong)" },
};

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
}

export function Alert({ children, variant = "info", title }: AlertProps) {
  const colors = COLORS[variant];
  return (
    <div
      role={variant === "danger" ? "alert" : "status"}
      style={{
        padding: "12px 14px",
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        background: colors.background,
        color: colors.color,
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      {title && <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>}
      <div>{children}</div>
    </div>
  );
}
