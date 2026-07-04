"use client";
import React from "react";

type Size = "sm" | "md" | "lg";

const heights: Record<Size, number> = { sm: 36, md: 44, lg: 52 };

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  inputSize?: Size;
  hint?: string;
}

export function Input({ label, iconLeft, inputSize = "md", hint, style, id, ...props }: InputProps) {
  const inputId = id ?? (label ? `in-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
          {props.required && <span style={{ color: "var(--brand)" }}> *</span>}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {iconLeft && (
          <span style={{ position: "absolute", left: 14, color: "var(--text-subtle)", display: "grid", placeItems: "center", pointerEvents: "none" }}>
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          {...props}
          style={{
            width: "100%",
            height: heights[inputSize],
            padding: iconLeft ? "0 14px 0 42px" : "0 14px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--border-default)",
            background: "var(--surface-card)",
            color: "var(--text-body)",
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            outline: "none",
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
        />
      </div>
      {hint && <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}
