import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { getOpportunitiesForSalon, type OpportunityStatus } from "@/db/queries";
import { requireDashboardRole } from "@/lib/authenticated-user";

const STATUS_BADGE: Record<OpportunityStatus, { label: string; variant: "success" | "neutral" | "danger" }> = {
  active: { label: "Active", variant: "success" },
  draft:  { label: "Draft",  variant: "neutral" },
  closed: { label: "Closed", variant: "danger" },
};

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage() {
  const user = await requireDashboardRole("salon_owner");
  const opportunities = await getOpportunitiesForSalon(user.clerkId);

  return (
    <>
      <Topbar
        title="Opportunities"
        subtitle="Manage your staffing posts and track applicants."
        action={
          <Link href="/dashboard/opportunities/new">
            <Button size="sm" iconLeft={<PlusIcon />}>Post opportunity</Button>
          </Link>
        }
      />

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        {opportunities.map((o) => {
          const badge = STATUS_BADGE[o.status];
          return (
            <Card key={o.id} padded>
              <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>
                      {o.title}
                    </span>
                    <Badge variant={badge.variant} dot={o.status === "active"}>{badge.label}</Badge>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge variant="neutral">{o.type}</Badge>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>{o.pay}</span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <PinIcon /> {o.city}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>· {o.posted}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                    {o.specs.map((s) => <Tag key={s}>{s}</Tag>)}
                  </div>
                </div>

                <div style={{ textAlign: "center", minWidth: 90 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--brand)" }}>
                    {o.applicants}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>applicants</div>
                </div>

                <Link href="/dashboard/applicants">
                  <Button size="sm" variant="outline" iconRight={<ChevronIcon />}>
                    {o.status === "draft" ? "Edit draft" : "View applicants"}
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function PlusIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>; }
function PinIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ChevronIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
