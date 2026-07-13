"use client";
import React, { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, defaultChecked, onChange, label }: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      style={{
        width: 44,
        height: 26,
        borderRadius: "var(--radius-pill)",
        border: "none",
        padding: 3,
        cursor: "pointer",
        background: on ? "var(--brand)" : "var(--sand-300)",
        transition: "background var(--dur-base) var(--ease-out)",
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--white)",
          boxShadow: "var(--shadow-sm)",
          transition: "all var(--dur-base) var(--ease-out)",
        }}
      />
    </button>
  );

  if (!label) return control;

  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      {control}
      <span style={{ fontSize: 15, color: "var(--text-body)" }}>{label}</span>
    </label>
  );
}
