import React from "react";

interface RatingProps {
  value: number;
  count?: number;
  size?: string;
}

export function Rating({ value, count, size = "0.95rem" }: RatingProps) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ color: "var(--gold-400)", fontSize: size }}>★</span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: size,
          color: "var(--text-strong)",
        }}
      >
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: "0.8em", color: "var(--text-muted)" }}>({count})</span>
      )}
    </span>
  );
}
