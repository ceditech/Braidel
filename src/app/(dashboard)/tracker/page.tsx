"use client";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ROADMAP,
  countItems,
  overallCounts,
  percentComplete,
  phaseProgress,
  type Status,
  type RoadmapItem,
} from "@/lib/roadmap";

const STATUS_META: Record<Status, { label: string; variant: "success" | "info" | "neutral" | "danger"; color: string }> = {
  done:        { label: "Done",        variant: "success", color: "var(--success)" },
  in_progress: { label: "In progress", variant: "info",    color: "var(--info)" },
  pending:     { label: "Pending",     variant: "neutral", color: "var(--taupe-400)" },
  blocked:     { label: "Blocked",     variant: "danger",  color: "var(--danger)" },
};

const PRIORITY_COLOR: Record<string, string> = {
  high: "var(--brand)",
  medium: "var(--gold-500)",
  low: "var(--taupe-400)",
};

type Filter = "all" | Status;

export default function TrackerPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const overall = useMemo(() => overallCounts(), []);
  const phases = useMemo(() => phaseProgress(), []);
  const pct = percentComplete(overall);

  const filterTabs: { key: Filter; label: string; count: number }[] = [
    { key: "all",         label: "All",         count: overall.total },
    { key: "done",        label: "Done",        count: overall.done },
    { key: "in_progress", label: "In progress", count: overall.in_progress },
    { key: "pending",     label: "Pending",     count: overall.pending },
    ...(overall.blocked > 0 ? [{ key: "blocked" as Filter, label: "Blocked", count: overall.blocked }] : []),
  ];

  return (
    <>
      <Topbar
        title="Project Tracker"
        subtitle="Live implementation status across the Braidel build."
      />

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 26 }}>
        {/* ── Overall progress hero ─────────────────────────────── */}
        <Card padded>
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            {/* Radial % */}
            <ProgressRing pct={pct} />

            {/* Status legend */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--charcoal-900)", marginBottom: 4 }}>
                {pct}% complete
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 18 }}>
                {overall.done} of {overall.total} tasks done · {overall.in_progress} in progress · {overall.pending} pending
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
                {(["done", "in_progress", "pending", "blocked"] as Status[])
                  .filter((s) => overall[s] > 0)
                  .map((s) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_META[s].color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "var(--text-body)" }}>
                        <strong>{overall[s]}</strong> {STATUS_META[s].label}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ── Progress by phase ─────────────────────────────────── */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".14em",
              color: "var(--text-muted)",
              marginBottom: 12,
            }}
          >
            Progress by phase
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            {phases.map((p) => (
              <div
                key={p.phase}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  padding: 18,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--brand)" }}>
                    PHASE {p.phase}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                    {p.counts.done}/{p.counts.total}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--charcoal-900)", marginBottom: 10 }}>
                  {p.label}
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "var(--bg-sunken)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${p.pct}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: p.pct === 100 ? "var(--success)" : "var(--brand)",
                      transition: "width var(--dur-slow) var(--ease-out)",
                    }}
                  />
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>{p.pct}% complete</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter tabs ───────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filterTabs.map((t) => {
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-pill)",
                  border: `1px solid ${active ? "var(--charcoal-900)" : "var(--border-default)"}`,
                  background: active ? "var(--charcoal-900)" : "var(--surface-card)",
                  color: active ? "var(--cream-100)" : "var(--text-body)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all var(--dur-fast)",
                }}
              >
                {t.label}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    padding: "1px 7px",
                    borderRadius: "var(--radius-pill)",
                    background: active ? "rgba(255,255,255,.16)" : "var(--bg-subtle)",
                    color: active ? "var(--cream-100)" : "var(--text-muted)",
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Group sections ────────────────────────────────────── */}
        {ROADMAP.map((group) => {
          const visible = group.items.filter((i) => filter === "all" || i.status === filter);
          if (visible.length === 0) return null;
          const counts = countItems(group.items);
          const groupPct = percentComplete(counts);

          return (
            <Card key={group.id} padded>
              {/* Group header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, margin: 0, color: "var(--charcoal-900)" }}>
                    {group.label}
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{group.description}</p>
                </div>
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
                    {counts.done}/{counts.total}
                  </div>
                  <div style={{ width: 120, height: 6, borderRadius: 999, background: "var(--bg-sunken)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${groupPct}%`,
                        height: "100%",
                        background: groupPct === 100 ? "var(--success)" : "var(--brand)",
                        transition: "width var(--dur-slow) var(--ease-out)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Item rows */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {visible.map((item, i) => (
                  <ItemRow key={item.title} item={item} first={i === 0} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ── Single roadmap row ──────────────────────────────────────────── */
function ItemRow({ item, first }: { item: RoadmapItem; first: boolean }) {
  const meta = STATUS_META[item.status];
  const phases = Array.isArray(item.phase) ? item.phase : [item.phase];
  const phaseLabel =
    phases.length === 1 ? `P${phases[0]}` : `P${phases[0]}-${phases[phases.length - 1]}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 0",
        borderTop: first ? "none" : "1px solid var(--border-subtle)",
      }}
    >
      {/* Status dot */}
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${meta.color}`,
          background: item.status === "done" ? meta.color : "transparent",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
        }}
      >
        {item.status === "done" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {/* Title and implementation note */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 15,
            color: item.status === "done" ? "var(--text-muted)" : "var(--text-strong)",
            textDecoration: item.status === "done" ? "line-through" : "none",
            textDecorationColor: "var(--taupe-400)",
          }}
        >
          {item.title}
        </div>
        {item.note && (
          <div
            style={{
              marginTop: 3,
              maxWidth: 820,
              fontSize: 13,
              lineHeight: 1.45,
              color: "var(--text-muted)",
            }}
          >
            {item.note}
          </div>
        )}
      </div>

      {/* Phase pill */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-subtle)",
          padding: "2px 8px",
          borderRadius: "var(--radius-pill)",
          background: "var(--bg-subtle)",
        }}
      >
        {phaseLabel}
      </span>

      {/* Priority dot */}
      <span
        title={`${item.priority} priority`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 12,
          color: "var(--text-muted)",
          width: 66,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: PRIORITY_COLOR[item.priority] }} />
        {item.priority}
      </span>

      {/* Status badge */}
      <Badge variant={meta.variant} dot>{meta.label}</Badge>
    </div>
  );
}

/* ── Radial progress ring ────────────────────────────────────────── */
function ProgressRing({ pct }: { pct: number }) {
  const size = 108;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset var(--dur-slow) var(--ease-out)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 26,
          color: "var(--charcoal-900)",
        }}
      >
        {pct}%
      </div>
    </div>
  );
}
