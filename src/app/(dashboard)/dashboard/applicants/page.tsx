"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Tabs } from "@/components/ui/Tabs";
import { APPLICANTS, type ApplicantStatus } from "@/lib/sampleData";

const STATUS_VARIANT: Record<ApplicantStatus, "warning" | "info" | "success" | "danger"> = {
  New: "warning",
  Shortlisted: "info",
  Matched: "success",
  Declined: "danger",
};

type Filter = "all" | "New" | "Shortlisted" | "Matched";

export default function ApplicantsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    return {
      all: APPLICANTS.length,
      New: APPLICANTS.filter((a) => a.status === "New").length,
      Shortlisted: APPLICANTS.filter((a) => a.status === "Shortlisted").length,
      Matched: APPLICANTS.filter((a) => a.status === "Matched").length,
    };
  }, []);

  const rows = useMemo(
    () => (filter === "all" ? APPLICANTS : APPLICANTS.filter((a) => a.status === filter)),
    [filter]
  );

  return (
    <>
      <Topbar title="Applicants" subtitle="Review and shortlist braiders for your posts." />

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 18 }}>
          <Tabs
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            items={[
              { value: "all",         label: "All",         count: counts.all },
              { value: "New",         label: "New",         count: counts.New },
              { value: "Shortlisted", label: "Shortlisted", count: counts.Shortlisted },
              { value: "Matched",     label: "Matched",     count: counts.Matched },
            ]}
          />
        </div>

        {rows.length === 0 ? (
          <Card padded>
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0", margin: 0 }}>
              No applicants in this category yet.
            </p>
          </Card>
        ) : (
          <Card>
            {rows.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 22px",
                  borderTop: i ? "1px solid var(--border-subtle)" : "none",
                  flexWrap: "wrap",
                }}
              >
                <Avatar name={a.name} size="md" />
                <div style={{ width: 190 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{a.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{a.experience} · {a.appliedFor}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 120, flexWrap: "wrap" }}>
                  {a.specs.map((s) => <Tag key={s}>{s}</Tag>)}
                </div>
                <Rating value={a.rate} count={a.rev} size="0.9rem" />
                <div style={{ width: 104, textAlign: "center" }}>
                  <Badge variant={STATUS_VARIANT[a.status]} dot>{a.status}</Badge>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href="/dashboard/messages">
                    <Button size="sm" variant="outline" iconLeft={<MessageIcon />}>Message</Button>
                  </Link>
                  <Button size="sm">Shortlist</Button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}

function MessageIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
