"use client";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  padded?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, padded, interactive, onClick, className, style }: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        padding: padded ? 22 : 0,
        cursor: interactive ? "pointer" : undefined,
        transition: interactive
          ? `box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)`
          : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (interactive) {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (interactive) {
          (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }
      }}
    >
      {children}
    </div>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
      {children}
    </div>
  );
}
