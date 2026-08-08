"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { SalonDTO } from "@/db/queries";
import layoutStyles from "../Directory.module.css";

const SORTS = ["Sort: Top rated", "Sort: Most reviews", "Sort: Open roles"] as const;
type Sort = (typeof SORTS)[number];

export function FindSalonsClient({
  salons,
  specialtyOptions,
}: {
  salons: SalonDTO[];
  specialtyOptions: string[];
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("Sort: Top rated");

  const toggle = (s: string) =>
    setActive((a) => (a.includes(s) ? a.filter((x) => x !== s) : [...a, s]));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = salons.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.services.some((v) => v.toLowerCase().includes(q));
      const matchesServices = active.length === 0 || active.some((v) => s.services.includes(v));
      return matchesQuery && matchesServices;
    });
    list = [...list].sort((a, b) => {
      if (sort === "Sort: Top rated") return b.rating - a.rating;
      if (sort === "Sort: Most reviews") return b.reviews - a.reviews;
      return b.openRoles - a.openRoles;
    });
    return list;
  }, [salons, query, active, sort]);

  return (
    <div className={layoutStyles.page}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px,4vw,42px)", margin: 0, color: "var(--text-strong)" }}>
        Find salons
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
        Discover braiding salons near you. Showing {results.length} of 3,400+.
      </p>

      {/* Search bar */}
      <div className={layoutStyles.filterBar}>
        <div className={layoutStyles.searchField}>
          <Input placeholder="Salon name, city or service" iconLeft={<SearchIcon />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className={layoutStyles.sortField}>
          <Select options={[...SORTS]} value={sort} onChange={(e) => setSort(e.target.value as Sort)} />
        </div>
      </div>

      {/* Service chips */}
      <div className={layoutStyles.chipRail}>
        {specialtyOptions.map((s) => (
          <Tag key={s} selected={active.includes(s)} onClick={() => toggle(s)}>{s}</Tag>
        ))}
        {active.length > 0 && (
          <button onClick={() => setActive([])} style={{ background: "none", border: "none", color: "var(--brand)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "4px 8px" }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", marginBottom: 8 }}>
            No salons match your filters
          </div>
          <p style={{ marginBottom: 20 }}>Try removing a service or broadening your search.</p>
          <Button onClick={() => { setQuery(""); setActive([]); }}>Reset filters</Button>
        </div>
      ) : (
        <div className={layoutStyles.resultGridThree}>
          {results.map((s) => (
            <Link key={s.id} href={`/find-salons/${s.id}`} className={layoutStyles.resultLink}>
            <Card interactive>
              <Photo seed={s.tone} aspect="4/3" />
              <CardBody>
                <div className={layoutStyles.cardHeader}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>{s.name}</span>
                  {s.verified && <Badge variant="brand" dot>Verified</Badge>}
                </div>
                <span style={{ fontSize: 14, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <PinIcon /> {s.city}
                </span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "2px 0" }}>
                  {s.services.map((v) => <Tag key={v}>{v}</Tag>)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                  <Rating value={s.rating} count={s.reviews} size="0.9rem" />
                  {s.openRoles > 0 ? (
                    <span style={{ color: "var(--brand)", fontWeight: 600, fontSize: 13 }}>
                      {s.openRoles} open role{s.openRoles > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>No openings</span>
                  )}
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

function SearchIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
function PinIcon()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
