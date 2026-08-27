"use client";
import React, { useEffect, useState } from "react";

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarDatum[];
  maxValue?: number;
  barHeight?: number;
}

/** Dependency-free horizontal bar chart (plain divs — no measured dimensions
 * needed, so it lays out correctly on first paint). Bars grow in from 0 on
 * mount, and hovering a bar shows an animated tooltip near its fill-end. */
export function BarChart({ data, maxValue, barHeight = 26 }: BarChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const max = maxValue ?? Math.max(1, ...data.map((d) => d.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {data.map((d, i) => {
        const pct = max > 0 ? Math.min(100, (Math.max(0, d.value) / max) * 100) : 0;
        const isHovered = hovered === i;
        return (
          <div
            key={d.label}
            style={{ display: "grid", gridTemplateColumns: "128px 1fr 44px", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {d.label}
            </span>
            <div
              style={{ position: "relative", height: barHeight, borderRadius: 6, background: "var(--bg-sunken)", overflow: "visible" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{
                  width: mounted ? `${pct}%` : "0%",
                  height: "100%",
                  borderRadius: 6,
                  background: d.color ?? "var(--brand)",
                  filter: isHovered ? "brightness(1.1)" : "none",
                  transition: `width 650ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, filter 120ms ease-out`,
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              />
              {/* Tooltip — always mounted, animated via opacity/transform */}
              <div
                role="tooltip"
                style={{
                  position: "absolute",
                  left: `${pct}%`,
                  bottom: "100%",
                  marginBottom: 8,
                  transform: `translate(-50%, ${isHovered ? "0" : "4px"}) scale(${isHovered ? 1 : 0.92})`,
                  opacity: isHovered ? 1 : 0,
                  transition: "opacity 150ms ease-out, transform 150ms ease-out",
                  pointerEvents: "none",
                  background: "var(--bg-inverse)",
                  color: "var(--cream-50)",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  boxShadow: "var(--shadow-md)",
                  zIndex: 5,
                }}
              >
                {d.label}: <strong>{d.value}</strong>
              </div>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", textAlign: "right" }}>
              {d.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
