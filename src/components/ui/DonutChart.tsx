"use client";
import React, { useEffect, useState } from "react";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
}

/** Dependency-free SVG donut chart with a side legend, hover tooltip, and a
 * staggered sweep-in animation on mount. Renders an empty ring + "No data
 * yet" when every value is zero, rather than crashing on a divide-by-zero. */
export function DonutChart({ data, size = 152, thickness = 20 }: DonutChartProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offsetAccum = 0;
  const arcs = data.map((slice, i) => {
    const value = Math.max(0, slice.value);
    const fraction = total > 0 ? value / total : 0;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    const startOffset = offsetAccum;
    offsetAccum += dash;

    // Anchor point at the arc's midpoint, baked-in -90° so it matches the
    // ring's CSS rotation without a separate rotation-of-a-point step.
    const midAngle = ((startOffset + dash / 2) / circumference) * 2 * Math.PI - Math.PI / 2;
    const anchor = { x: cx + r * Math.cos(midAngle), y: cy + r * Math.sin(midAngle) };

    return { slice, i, dash, gap, startOffset, anchor, pct: total > 0 ? Math.round(fraction * 100) : 0 };
  });

  const hoveredArc = hovered !== null ? arcs[hovered] : null;

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={thickness} />
          {total > 0 &&
            arcs.map(({ slice, i, dash, gap, startOffset }) => (
              <circle
                key={slice.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={slice.color}
                strokeWidth={hovered === i ? thickness + 3 : thickness}
                strokeDasharray={mounted ? `${dash} ${gap}` : `0 ${circumference}`}
                strokeDashoffset={-startOffset}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  transition: `stroke-dasharray 700ms cubic-bezier(0.22,1,0.36,1) ${i * 70}ms, stroke-width 150ms ease-out`,
                }}
              />
            ))}
        </svg>

        {/* Tooltip — always mounted, animated via opacity/transform so it can transition both in and out */}
        {hoveredArc && (
          <div
            role="tooltip"
            style={{
              position: "absolute",
              left: hoveredArc.anchor.x,
              top: hoveredArc.anchor.y,
              transform: `translate(-50%, -50%) scale(${hovered !== null ? 1 : 0.92})`,
              opacity: hovered !== null ? 1 : 0,
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
            {hoveredArc.slice.label}: <strong>{hoveredArc.slice.value}</strong> ({hoveredArc.pct}%)
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 140 }}>
        {total === 0 ? (
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>No data yet</span>
        ) : (
          arcs.map(({ slice, i, pct }) => (
            <div
              key={slice.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                cursor: "pointer",
                borderRadius: "var(--radius-xs)",
                padding: "2px 4px",
                marginLeft: -4,
                background: hovered === i ? "var(--bg-subtle)" : "transparent",
                transition: "background 120ms ease-out",
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: slice.color, flexShrink: 0 }} />
              <span style={{ color: "var(--text-body)", flex: 1 }}>{slice.label}</span>
              <span style={{ color: "var(--text-strong)", fontWeight: 700 }}>{slice.value}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 12, width: 36, textAlign: "right" }}>{pct}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
