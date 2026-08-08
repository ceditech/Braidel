"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tag } from "@/components/ui/Tag";
import { Photo } from "@/components/ui/Photo";
import type { OpportunityDTO } from "@/db/queries";
import styles from "../DashboardPages.module.css";

const TYPES = ["Any type", "Part-time", "Full-time", "Single event", "Booth rental", "Commission"];

export function FindWorkClient({ jobs }: { jobs: OpportunityDTO[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Any type");
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.salon.toLowerCase().includes(q) ||
        j.specs.some((s) => s.toLowerCase().includes(q));
      const matchesType = type === "Any type" || j.type === type;
      return matchesQuery && matchesType;
    });
  }, [jobs, query, type]);

  async function apply(opportunitySlug: string) {
    setPendingSlug(opportunitySlug);
    setMessage(null);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunitySlug }),
    });
    const data = await res.json().catch(() => ({}));
    setPendingSlug(null);
    setMessage(res.ok ? "Application sent." : data.error ?? "Could not send application.");
  }

  return (
    <>
      <Topbar title="Find work" subtitle={`${results.length} active opportunities`} />

      <div className={styles.page}>
        <div className={styles.filterRow}>
          <div style={{ flex: "2 1 260px" }}>
            <Input placeholder="Role, salon or style" iconLeft={<SearchIcon />} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <Select options={TYPES} value={type} onChange={(e) => setType(e.target.value)} />
          </div>
        </div>

        {message && (
          <div style={{ marginBottom: 16, color: "var(--text-body)", fontSize: 14 }}>
            {message}
          </div>
        )}

        {results.length === 0 ? (
          <Card padded>
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0", margin: 0 }}>
              No opportunities match your search.
            </p>
          </Card>
        ) : (
          <div className={styles.twoColumnGrid}>
            {results.map((j, i) => (
              <Card key={j.id} padded>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                    <Photo seed={i} aspect="1/1" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
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
                <div className={styles.jobCardFooter}>
                  <div style={{ display: "flex", gap: 14, fontSize: 13, color: "var(--text-muted)", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-strong)" }}>{j.pay}</span>
                    <span>{j.posted}</span>
                  </div>
                  <Button size="sm" onClick={() => apply(j.id)} disabled={pendingSlug === j.id}>
                    {pendingSlug === j.id ? "Applying..." : "Apply now"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SearchIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
