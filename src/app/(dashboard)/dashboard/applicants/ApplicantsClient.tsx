"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Tabs } from "@/components/ui/Tabs";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import type { ApplicantDTO } from "@/db/queries";

const STATUS_VARIANT: Record<ApplicantDTO["status"], "warning" | "info" | "success" | "danger"> = {
  New: "warning",
  Shortlisted: "info",
  Matched: "success",
  Declined: "danger",
};

type ApplicantStatus = ApplicantDTO["status"];
type Filter = "all" | ApplicantStatus;

const ACTIONS: Array<{ label: string; status: ApplicantStatus; variant: "primary" | "outline" | "ghost" | "dark" }> = [
  { label: "Shortlist", status: "Shortlisted", variant: "outline" },
  { label: "Match", status: "Matched", variant: "primary" },
  { label: "Decline", status: "Declined", variant: "ghost" },
];

export function ApplicantsClient({ applicants }: { applicants: ApplicantDTO[] }) {
  const router = useRouter();
  const [localApplicants, setLocalApplicants] = useState(applicants);
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      all: localApplicants.length,
      New: localApplicants.filter((a) => a.status === "New").length,
      Shortlisted: localApplicants.filter((a) => a.status === "Shortlisted").length,
      Matched: localApplicants.filter((a) => a.status === "Matched").length,
      Declined: localApplicants.filter((a) => a.status === "Declined").length,
    };
  }, [localApplicants]);

  const rows = useMemo(
    () => (filter === "all" ? localApplicants : localApplicants.filter((a) => a.status === filter)),
    [localApplicants, filter]
  );

  async function updateStatus(applicant: ApplicantDTO, status: ApplicantStatus) {
    const previous = localApplicants;
    setPendingId(applicant.id);
    setError(null);
    setLocalApplicants((current) => current.map((row) => (row.id === applicant.id ? { ...row, status } : row)));

    const res = await fetch(`/api/applications/${applicant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    setPendingId(null);

    if (!res.ok) {
      setLocalApplicants(previous);
      setError(data.error ?? "Could not update applicant status.");
      return;
    }

    router.refresh();
  }

  return (
    <>
      <Topbar title="Applicants" subtitle="Review and shortlist braiders for your posts." />

      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 18 }}>
          <Tabs
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            items={[
              { value: "all", label: "All", count: counts.all },
              { value: "New", label: "New", count: counts.New },
              { value: "Shortlisted", label: "Shortlisted", count: counts.Shortlisted },
              { value: "Matched", label: "Matched", count: counts.Matched },
              { value: "Declined", label: "Declined", count: counts.Declined },
            ]}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 14, color: "var(--danger)", fontSize: 14, fontWeight: 600 }}>
            {error}
          </div>
        )}

        {rows.length === 0 ? (
          <Card padded>
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0", margin: 0 }}>
              No applicants in this category yet.
            </p>
          </Card>
        ) : (
          <Card>
            {rows.map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", borderTop: i ? "1px solid var(--border-subtle)" : "none", flexWrap: "wrap" }}>
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
                  <Link href={`/dashboard/messages?application=${a.id}`}>
                    <Button size="sm" variant="outline" iconLeft={<MessageIcon />}>Message</Button>
                  </Link>
                  {a.status === "Matched" && (
                    <ReviewDialog
                      applicationId={a.id}
                      targetName={a.name}
                      targetType="braider"
                      initialReview={a.review}
                    />
                  )}
                  {ACTIONS.filter((action) => action.status !== a.status).map((action) => (
                    <Button
                      key={action.status}
                      size="sm"
                      variant={action.variant}
                      disabled={pendingId === a.id}
                      onClick={() => updateStatus(a, action.status)}
                    >
                      {action.label}
                    </Button>
                  ))}
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
