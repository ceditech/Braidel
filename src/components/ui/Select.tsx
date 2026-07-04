"use client";
import React from "react";

type Size = "sm" | "md" | "lg";
const heights: Record<Size, number> = { sm: 36, md: 44, lg: 52 };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  selectSize?: Size;
}

export function Select({ label, options, selectSize = "md", style, id, ...props }: SelectProps) {
  const selectId = id ?? (label ? `sel-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {label && (
        <label htmlFor={selectId} style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={selectId}
          {...props}
          style={{
            width: "100%",
            height: heights[selectSize],
            padding: "0 40px 0 14px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--border-default)",
            background: "var(--surface-card)",
            color: "var(--text-body)",
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            outline: "none",
            appearance: "none",
            cursor: "pointer",
            transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--brand)";
            e.currentTarget.style.boxShadow = "var(--shadow-focus)";
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span style={{ position: "absolute", right: 14, pointerEvents: "none", color: "var(--text-subtle)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  );
}
