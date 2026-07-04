"use client";
import React, { useState } from "react";

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

export function Checkbox({ checked, defaultChecked, onChange, label }: CheckboxProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <button
        type="button"
        role="checkbox"
        aria-checked={on}
        onClick={toggle}
        style={{
          width: 22,
          height: 22,
          borderRadius: "var(--radius-xs)",
          border: `1.5px solid ${on ? "var(--brand)" : "var(--border-strong)"}`,
          background: on ? "var(--brand)" : "var(--surface-card)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          transition: "all var(--dur-fast) var(--ease-out)",
          flexShrink: 0,
        }}
      >
        {on && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      {label && <span style={{ fontSize: 15, color: "var(--text-body)" }}>{label}</span>}
    </label>
  );
}
