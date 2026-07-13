"use client";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import type { ApplicationDTO, OpportunityDTO } from "@/db/queries";

const APP_STATUS_VARIANT: Record<ApplicationDTO["status"], "info" | "warning" | "danger" | "success"> = {
  Shortlisted: "info",
  "Under review": "warning",
  "Not selected": "danger",
  Matched: "success",
};

export function BraiderDashboardHome({
  firstName,
  opportunities,
  applications,
}: {
  firstName: string;
  opportunities: OpportunityDTO[];
  applications: ApplicationDTO[];
}) {
  const nearby = opportunities.slice(0, 3);
  const apps = applications.slice(0, 3);
  const avgOffer = firstHourlyOffer(opportunities) ?? "TBD";

  return (
    <>
      <Topbar
        title={`Welcome back${firstName !== "there" ? `, ${firstName}` : ""}!`}
        subtitle="New braiding work near you."
        action={
          <Link href="/dashboard/find-work">
            <Button size="sm" iconLeft={<SearchIcon />}>Find work</Button>
          </Link>
        }
      />

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "var(--brand-soft)", border: "1px solid var(--brand-soft-border)", borderRadius: "var(--radius-lg)" }}>
          <span style={{ color: "var(--brand)" }}><SparkIcon /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>Your profile is 80% complete</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Add 2 more portfolio photos to rank higher in salon searches.
            </div>
          </div>
          <Link href="/dashboard/settings">
            <Button size="sm" variant="outline">Complete profile</Button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          <StatCard icon={<BriefcaseIcon />} label="Jobs near you" value={String(opportunities.length)} tone="brand" />
          <StatCard icon={<SendIcon />} label="Applications" value={String(applications.length)} tone="gold" />
          <StatCard icon={<MessageIcon />} label="Salon replies" value={String(applications.filter((a) => a.status === "Shortlisted" || a.status === "Matched").length)} tone="sage" />
          <StatCard icon={<DollarIcon />} label="Avg offer" value={avgOffer} tone="teal" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }}>
          <Card padded>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, margin: 0, color: "var(--charcoal-900)" }}>
                Work near you
              </h3>
              <Link href="/dashboard/find-work" style={{ color: "var(--brand)", fontWeight: 600, fontSize: 14 }}>
                See all
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {nearby.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: 14, padding: 14 }}>No open work yet.</div>
              ) : nearby.map((j, i) => (
                <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                    <Photo seed={i} aspect="1/1" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{j.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{j.salon} · {j.city}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-strong)" }}>{j.pay}</span>
                  <Link href="/dashboard/find-work">
                    <Button size="sm">Apply</Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          <Card padded>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, margin: "0 0 16px", color: "var(--charcoal-900)" }}>
              Your applications
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {apps.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>No applications yet.</div>
              ) : apps.map((a) => (
                <div key={a.id} style={{ padding: 14, border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 14 }}>{a.role} · {a.salon}</div>
                  <div style={{ marginTop: 8 }}>
                    <Badge variant={APP_STATUS_VARIANT[a.status]} dot>{a.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/applications">
              <Button fullWidth variant="ghost" style={{ marginTop: 16 }}>View all applications</Button>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}

function firstHourlyOffer(opportunities: OpportunityDTO[]) {
  return opportunities.find((o) => o.pay.includes("/hr"))?.pay.split(" ")[0];
}

function SearchIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
function SparkIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8L20 10l-5.8 1.9L12 18l-1.9-5.8L4 10l6.1-1.2z"/></svg>; }
function BriefcaseIcon(){ return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function SendIcon()     { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>; }
function MessageIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function DollarIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
