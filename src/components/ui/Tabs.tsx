"use client";
import React from "react";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  items: TabItem[];
}

export function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-subtle)" }}>
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 14px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 15,
              color: active ? "var(--brand)" : "var(--text-muted)",
              borderBottom: `2px solid ${active ? "var(--brand)" : "transparent"}`,
              marginBottom: -1,
              transition: "color var(--dur-fast)",
            }}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "1px 7px",
                  borderRadius: "var(--radius-pill)",
                  background: active ? "var(--brand-soft)" : "var(--bg-subtle)",
                  color: active ? "var(--terracotta-700)" : "var(--text-muted)",
                }}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
