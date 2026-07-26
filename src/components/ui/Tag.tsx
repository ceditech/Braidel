"use client";
import React from "react";

interface TagProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function Tag({ children, selected, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 11px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        fontSize: 13,
        cursor: onClick ? "pointer" : "default",
        transition: `all var(--dur-fast) var(--ease-out)`,
        background: selected ? "var(--bg-inverse)" : "var(--bg-subtle)",
        color: selected ? "var(--cream-100)" : "var(--text-muted)",
        border: `1px solid ${selected ? "var(--bg-inverse)" : "var(--border-default)"}`,
      }}
    >
      {children}
    </span>
  );
}
