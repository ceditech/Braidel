"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tag } from "@/components/ui/Tag";
import { Photo } from "@/components/ui/Photo";
import type { OpportunityDTO } from "@/db/queries";
import layoutStyles from "../Directory.module.css";

const TYPES = ["Any type", "Part-time", "Full-time", "Single event", "Booth rental", "Commission"];

export function OpportunitiesClient({ jobs }: { jobs: OpportunityDTO[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Any type");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.salon.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q) ||
        j.specs.some((s) => s.toLowerCase().includes(q));
      const matchesType = type === "Any type" || j.type === type;
      return matchesQuery && matchesType;
    });
  }, [jobs, query, type]);

  return (
    <div className={layoutStyles.page}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px,4vw,42px)", margin: 0, color: "var(--text-strong)" }}>
        Job opportunities
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
        Braiding roles at salons hiring now. Showing {results.length} openings.
      </p>

      <div className={layoutStyles.filterBar}>
        <div className={layoutStyles.searchField}>
          <Input placeholder="Role, salon, city or style" iconLeft={<SearchIcon />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className={layoutStyles.sortField}>
          <Select options={TYPES} value={type} onChange={(e) => setType(e.target.value)} />
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "72px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text-strong)", marginBottom: 8 }}>
            No openings match your search
          </div>
          <Button onClick={() => { setQuery(""); setType("Any type"); }}>Reset filters</Button>
        </div>
      ) : (
        <div className={layoutStyles.resultGridTwo}>
          {results.map((j, i) => (
            <Card key={j.id} padded>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                  <Photo seed={i} aspect="1/1" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={layoutStyles.jobHeader}>
                    <div>
                      <Link href={`/opportunities/${j.id}`} style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-strong)" }}>{j.title}</Link>
                      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{j.salon} · {j.city}</div>
                    </div>
                    <Badge variant="neutral">{j.type}</Badge>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, margin: "14px 0", flexWrap: "wrap" }}>
                {j.specs.map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
              <div className={layoutStyles.jobFooter}>
                <div className={layoutStyles.jobMeta}>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-strong)" }}>{j.pay}</span>
                  <span>{j.posted}</span>
                </div>
                <Link href="/sign-up">
                  <Button size="sm">Apply now</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
