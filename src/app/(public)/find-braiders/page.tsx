"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Photo } from "@/components/ui/Photo";
import { BRAIDERS, SPECIALTIES } from "@/lib/sampleData";

const SORTS = ["Sort: Top rated", "Sort: Most reviews", "Sort: Name A–Z"] as const;
type Sort = (typeof SORTS)[number];

const TOTAL_POOL = 12480; // headline count for social proof

export default function FindBraidersPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("Sort: Top rated");

  const toggle = (s: string) =>
    setActive((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = BRAIDERS.filter((b) => {
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.specs.some((s) => s.toLowerCase().includes(q));
      const matchesSpecs =
        active.length === 0 || active.some((s) => b.specs.includes(s));
      return matchesQuery && matchesSpecs;
    });

    list = [...list].sort((a, b) => {
      if (sort === "Sort: Top rated") return b.rate - a.rate;
      if (sort === "Sort: Most reviews") return b.rev - a.rev;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [query, active, sort]);

  return (
    <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "34px var(--gutter) 40px" }}>
      {/* Header */}
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px,4vw,42px)", margin: 0, color: "var(--charcoal-900)" }}>
        Find braiders
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
        Browse vetted braiders near you. Showing {results.length} of {TOTAL_POOL.toLocaleString()}.
      </p>

      {/* Search bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 22,
          padding: 14,
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
          position: "sticky",
          top: 74,
          zIndex: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "2 1 240px" }}>
          <Input
            placeholder="Style, name or city"
            iconLeft={<SearchIcon />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <Select
            options={[...SORTS]}
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          />
        </div>
      </div>

      {/* Specialty filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0 4px", alignItems: "center" }}>
        {SPECIALTIES.map((s) => (
          <Tag key={s} selected={active.includes(s)} onClick={() => toggle(s)}>
            {s}
          </Tag>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => setActive([])}
            style={{
              background: "none",
              border: "none",
              color: "var(--brand)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState onReset={() => { setQuery(""); setActive([]); }} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, margin: "24px 0", paddingBottom: 20 }}>
          {results.map((b) => (
            <Link key={b.id} href={`/find-braiders/${b.id}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <div style={{ position: "relative" }}>
                  <Photo seed={b.tone} aspect="4/3" />
                  <button
                    aria-label="Save braider"
                    onClick={(e) => { e.preventDefault(); }}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(251,247,241,.9)",
                      backdropFilter: "blur(4px)",
                      cursor: "pointer",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--brown-600)",
                    }}
                  >
                    <HeartIcon />
                  </button>
                </div>
                <CardBody>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--charcoal-900)" }}>
                      {b.name}
                    </span>
                    <Badge variant={b.badge === "New" ? "gold" : "brand"} dot={b.badge === "Verified"}>
                      {b.badge}
                    </Badge>
                  </div>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <PinIcon /> {b.city}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "2px 0" }}>
                    {b.specs.map((s) => <Tag key={s}>{s}</Tag>)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                    <Rating value={b.rate} count={b.rev} size="0.9rem" />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-strong)" }}>{b.price}</span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 20px", color: "var(--text-muted)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", marginBottom: 8 }}>
        No braiders match your filters
      </div>
      <p style={{ marginBottom: 20 }}>Try removing a specialty or broadening your search.</p>
      <button
        onClick={onReset}
        style={{
          background: "var(--brand)",
          color: "var(--cream-50)",
          border: "none",
          borderRadius: "var(--radius-md)",
          height: 44,
          padding: "0 22px",
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        Reset filters
      </button>
    </div>
  );
}

/* Icons */
function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}
function PinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function HeartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>;
}
