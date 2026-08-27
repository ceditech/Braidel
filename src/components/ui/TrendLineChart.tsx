"use client";
import React, { useEffect, useId, useState } from "react";

export interface TrendPoint {
  /** ISO date, e.g. "2026-08-26" */
  date: string;
  count: number;
}

interface TrendLineChartProps {
  data: TrendPoint[];
  height?: number;
  color?: string;
}

const VIEWPORT_WIDTH = 560;
const PADDING = 8;

/** Dependency-free SVG line/area chart. Renders a flat baseline (not a
 * crash) when every value is zero, with a small caption explaining why.
 * Reveals left-to-right on mount via an animated clip-path, and shows an
 * animated tooltip on hovering any point. Tooltip position is computed as a
 * percentage of the viewBox, so it stays correctly aligned regardless of the
 * chart's actual rendered width (the <svg> scales via width="100%"). */
export function TrendLineChart({ data, height = 140, color = "var(--brand)" }: TrendLineChartProps) {
  const clipId = useId();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? (VIEWPORT_WIDTH - PADDING * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: PADDING + i * stepX,
    y: PADDING + (1 - d.count / max) * (height - PADDING * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath =
    points.length > 0 && lastPoint && firstPoint
      ? `${linePath} L ${lastPoint.x} ${height - PADDING} L ${firstPoint.x} ${height - PADDING} Z`
      : "";

  const hasBookings = data.some((d) => d.count > 0);
  const hoveredPoint = hovered !== null ? { point: points[hovered], datum: data[hovered] } : null;

  return (
    <div style={{ position: "relative" }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${VIEWPORT_WIDTH} ${height}`}
        preserveAspectRatio="none"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={0}
              y={0}
              width={mounted ? VIEWPORT_WIDTH : 0}
              height={height}
              style={{ transition: "width 900ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {areaPath && <path d={areaPath} fill={color} opacity={0.12} stroke="none" />}
          {linePath && (
            <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={color}
              opacity={mounted ? 1 : 0}
              style={{ transition: `opacity 300ms ease-out ${400 + i * 20}ms` }}
            />
            {/* Larger invisible hit-area — easier to hover than the 2.5px dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r={10}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip — always mounted, positioned by % of the viewBox so it stays
          aligned regardless of the SVG's actual rendered width. */}
      {hoveredPoint && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            left: `${(hoveredPoint.point.x / VIEWPORT_WIDTH) * 100}%`,
            top: `${(hoveredPoint.point.y / height) * 100}%`,
            transform: `translate(-50%, -130%) scale(${hovered !== null ? 1 : 0.92})`,
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
          {formatShortDate(hoveredPoint.datum.date)}: <strong>{hoveredPoint.datum.count}</strong>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-muted)" }}>
        <span>{formatShortDate(data[0]?.date)}</span>
        <span>{formatShortDate(data[data.length - 1]?.date)}</span>
      </div>
      {!hasBookings && (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
          No bookings created in this window yet.
        </p>
      )}
    </div>
  );
}

function formatShortDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}
