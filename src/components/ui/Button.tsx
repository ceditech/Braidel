"use client";
import React from "react";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { height: 36, padding: "0 16px", fontSize: 13, gap: 6, borderRadius: "var(--radius-sm)" },
  md: { height: 44, padding: "0 22px", fontSize: 15, gap: 8, borderRadius: "var(--radius-md)" },
  lg: { height: 52, padding: "0 28px", fontSize: 16, gap: 9, borderRadius: "var(--radius-md)" },
};

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "var(--brand)",
    color: "var(--cream-50)",
    border: "none",
  },
  outline: {
    background: "transparent",
    color: "var(--text-strong)",
    border: "1.5px solid var(--border-strong)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-body)",
    border: "none",
  },
  dark: {
    background: "var(--charcoal-900)",
    color: "var(--cream-50)",
    border: "none",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        cursor: "pointer",
        transition: `background var(--dur-fast) var(--ease-out),
                     box-shadow var(--dur-fast) var(--ease-out),
                     transform var(--dur-fast) var(--ease-out)`,
        width: fullWidth ? "100%" : undefined,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (variant === "primary") el.style.background = "var(--brand-hover)";
        if (variant === "dark") el.style.background = "var(--espresso-700)";
        if (variant === "outline") el.style.background = "var(--bg-subtle)";
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        if (variant === "primary") el.style.background = "var(--brand)";
        if (variant === "dark") el.style.background = "var(--charcoal-900)";
        if (variant === "outline") el.style.background = "transparent";
        props.onMouseLeave?.(e);
      }}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
