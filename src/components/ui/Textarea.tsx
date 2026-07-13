"use client";
import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function Textarea({ label, hint, style, id, rows = 4, ...props }: TextareaProps) {
  const taId = id ?? (label ? `ta-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {label && (
        <label htmlFor={taId} style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
          {props.required && <span style={{ color: "var(--brand)" }}> *</span>}
        </label>
      )}
      <textarea
        id={taId}
        rows={rows}
        {...props}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "var(--radius-md)",
          border: "1.5px solid var(--border-default)",
          background: "var(--surface-card)",
          color: "var(--text-body)",
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          lineHeight: 1.55,
          outline: "none",
          resize: "vertical",
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
      {hint && <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{hint}</span>}
    </div>
  );
}
