import React from "react";

interface LogoProps {
  size?: number;
  light?: boolean;
  className?: string;
}

function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M15 6C15 15 33 17 33 24 33 31 15 33 15 42"
        stroke="#C75D3F"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path
        d="M33 6C33 15 15 17 15 24 15 31 33 33 33 42"
        stroke="#C2922F"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BraidelLogo({ size = 28, light = false, className }: LogoProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "-0.02em",
        color: light ? "var(--cream-50)" : "var(--charcoal-900)",
      }}
    >
      <Mark size={size} />
      <span>
        Braide<span style={{ color: "var(--terracotta-500)" }}>l</span>
      </span>
    </span>
  );
}
