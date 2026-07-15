import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { getApplicationsForBraider, type ApplicationDTO } from "@/db/queries";

const STATUS_VARIANT: Record<ApplicationDTO["status"], "info" | "warning" | "danger" | "success"> = {
  Shortlisted: "info",
  "Under review": "warning",
  "Not selected": "danger",
  Matched: "success",
};

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const user = await currentUser();
  const applications = user ? await getApplicationsForBraider(user.id) : [];

  return (
    <>
      <Topbar title="Your applications" subtitle="Track where you stand with each salon." />

      <div style={{ padding: 32, maxWidth: 820 }}>
        <Card>
          {applications.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0", margin: 0 }}>
              No applications yet.
            </p>
          ) : applications.map((a, i) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 22px",
                borderTop: i ? "1px solid var(--border-subtle)" : "none",
                flexWrap: "wrap",
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                <Photo seed={i} aspect="1/1" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{a.role} · {a.salon}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{a.when}</div>
              </div>
              <Badge variant={STATUS_VARIANT[a.status]} dot>{a.status}</Badge>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {a.status === "Matched" && (
                  <ReviewDialog
                    applicationId={a.id}
                    targetName={a.salon}
                    targetType="salon"
                    initialReview={a.review}
                  />
                )}
                <Link href={`/dashboard/messages?application=${a.id}`}>
                  <Button size="sm" variant="outline" iconRight={<ChevronIcon />}>View</Button>
                </Link>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

function ChevronIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
