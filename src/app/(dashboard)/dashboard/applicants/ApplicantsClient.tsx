"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
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
import { Alert } from "@/components/ui/Alert";
import { Drawer } from "@/components/ui/Drawer";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import type { ApplicantDTO } from "@/db/queries";
import styles from "./ApplicantsClient.module.css";

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
  const [pendingStatus, setPendingStatus] = useState<ApplicantStatus | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const selectedApplicant = selectedId
    ? localApplicants.find((applicant) => applicant.id === selectedId) ?? null
    : null;

  async function updateStatus(applicant: ApplicantDTO, status: ApplicantStatus) {
    const previous = localApplicants;
    setPendingId(applicant.id);
    setPendingStatus(status);
    setError(null);
    setLocalApplicants((current) => current.map((row) => (row.id === applicant.id ? { ...row, status } : row)));

    try {
      const res = await fetch(`/api/applications/${applicant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLocalApplicants(previous);
        setError(data.error ?? "Could not update applicant status.");
        return;
      }

      router.refresh();
    } catch {
      setLocalApplicants(previous);
      setError("Could not reach the server. Please try again.");
    } finally {
      setPendingId(null);
      setPendingStatus(null);
    }
  }

  return (
    <>
      <Topbar title="Applicants" subtitle="Review and shortlist braiders for your posts." />

      <main className={styles.page}>
        <div className={styles.tabs}>
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
          <div className={styles.pageAlert}><Alert variant="danger">{error}</Alert></div>
        )}

        {rows.length === 0 ? (
          <Card padded>
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "32px 0", margin: 0 }}>
              No applicants in this category yet.
            </p>
          </Card>
        ) : (
          <Card className={styles.list}>
            {rows.map((a) => (
              <div key={a.id} className={styles.row}>
                <button
                  type="button"
                  className={styles.profileTrigger}
                  aria-label={`View ${a.name}'s applicant profile`}
                  onClick={() => {
                    setError(null);
                    setSelectedId(a.id);
                  }}
                >
                  <Avatar name={a.name} src={a.avatarUrl ?? undefined} size="md" />
                  <span className={styles.identity}>
                    <span className={styles.name}>{a.name}</span>
                    <span className={styles.applicationMeta}>{a.experience} | {a.appliedFor}</span>
                    <span className={styles.viewLabel}>View applicant <ArrowIcon /></span>
                  </span>
                </button>
                <div className={styles.specialties}>
                  {a.specs.map((s) => <Tag key={s}>{s}</Tag>)}
                </div>
                <div className={styles.reputation}><Rating value={a.rate} count={a.rev} size="0.9rem" /></div>
                <div className={styles.status}>
                  <Badge variant={STATUS_VARIANT[a.status]} dot>{a.status}</Badge>
                </div>
                <div className={styles.actions}>
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
      </main>

      <Drawer
        open={selectedApplicant !== null}
        title="Applicant profile"
        description={selectedApplicant ? `${selectedApplicant.appliedAt} for ${selectedApplicant.appliedFor}` : undefined}
        closeDisabled={selectedApplicant ? pendingId === selectedApplicant.id : false}
        onClose={() => setSelectedId(null)}
        footer={selectedApplicant ? (
          <>
            <Button
              type="button"
              variant="outline"
              iconLeft={<MessageIcon />}
              onClick={() => router.push(`/dashboard/messages?application=${selectedApplicant.id}`)}
            >
              Message
            </Button>
            {ACTIONS.filter((action) => action.status !== selectedApplicant.status).map((action) => (
              <Button
                key={action.status}
                type="button"
                variant={action.variant}
                disabled={pendingId === selectedApplicant.id}
                onClick={() => updateStatus(selectedApplicant, action.status)}
              >
                {pendingId === selectedApplicant.id && pendingStatus === action.status ? "Updating..." : action.label}
              </Button>
            ))}
          </>
        ) : undefined}
      >
        {selectedApplicant && (
          <ApplicantDetails applicant={selectedApplicant} error={error} />
        )}
      </Drawer>
    </>
  );
}

function ApplicantDetails({ applicant, error }: { applicant: ApplicantDTO; error: string | null }) {
  return (
    <div className={styles.drawerContent}>
      {error && <Alert variant="danger">{error}</Alert>}

      <section className={styles.hero}>
        <Avatar name={applicant.name} src={applicant.avatarUrl ?? undefined} size="xl" ring />
        <div className={styles.heroText}>
          <div className={styles.heroNameLine}>
            <h3 className={styles.heroName}>{applicant.name}</h3>
            {applicant.isVerified && <Badge variant="brand" dot>Verified</Badge>}
          </div>
          <div className={styles.heroLocation}><PinIcon /> {applicant.city || "Location not added"}</div>
          <Rating value={applicant.rate} count={applicant.rev} size="0.95rem" />
        </div>
        <Badge variant={STATUS_VARIANT[applicant.status]} dot>{applicant.status}</Badge>
      </section>

      <div className={styles.facts}>
        <ProfileFact label="Experience" value={applicant.experience} />
        <ProfileFact label="Rate range" value={applicant.priceRange} />
        <ProfileFact label="Applied for" value={applicant.appliedFor} />
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h4>Professional profile</h4>
          <Link href={`/find-braiders/${applicant.profileSlug}`} className={styles.profileLink}>
            Public profile <ExternalIcon />
          </Link>
        </div>
        <p className={styles.bio}>
          {applicant.bio || `${applicant.name} has not added a professional bio yet.`}
        </p>
        <div className={styles.drawerTags}>
          {applicant.specs.length
            ? applicant.specs.map((specialty) => <Tag key={specialty}>{specialty}</Tag>)
            : <span className={styles.muted}>No specialties added.</span>}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h4>Application note</h4>
          <span>{applicant.appliedAt}</span>
        </div>
        <blockquote className={styles.coverNote}>
          {applicant.coverNote || "No cover note was included with this application."}
        </blockquote>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h4>Portfolio</h4>
          <span>{applicant.portfolio.length} image{applicant.portfolio.length === 1 ? "" : "s"}</span>
        </div>
        {applicant.portfolio.length ? (
          <div className={styles.portfolioGrid}>
            {applicant.portfolio.map((media) => (
              <div key={media.id} className={styles.portfolioItem}>
                <Image
                  src={media.url}
                  alt={media.altText}
                  fill
                  sizes="(max-width: 640px) 50vw, 240px"
                  className={styles.portfolioImage}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.portfolioEmpty}>No portfolio images have been added yet.</div>
        )}
      </section>
    </div>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MessageIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function ArrowIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>; }
function PinIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ExternalIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>; }
