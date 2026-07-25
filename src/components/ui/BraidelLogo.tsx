import React from "react";

interface LogoProps {
  size?: number;
  light?: boolean;
  className?: string;
  tagline?: boolean;
}

export function BraidelLogo({
  size = 28,
  light = false,
  className,
  tagline = false,
}: LogoProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-grid",
        gap: tagline ? 5 : 0,
        color: light ? "var(--logo-on-dark)" : "var(--logo-ink)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 400,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: 0,
        }}
      >
        braid<span style={{ color: "var(--brand)" }}>.el</span>
      </span>
      {tagline && (
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: Math.max(8, Math.round(size * 0.24)),
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Connect<span style={{ color: "var(--brand)" }}>.</span> Book
          <span style={{ color: "var(--brand)" }}>.</span> Grow
          <span style={{ color: "var(--brand)" }}>.</span>
        </span>
      )}
    </span>
  );
}
