"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Topbar } from "@/components/dashboard/Topbar";
import type {
  ProviderVerificationStatus,
  ProviderVerificationWorkspaceDTO,
  VerificationEvidenceDTO,
  VerificationEvidenceType,
  VerificationStatusHistoryDTO,
} from "@/lib/verification-domain";
import {
  VERIFICATION_EVIDENCE_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/verification-domain";
import styles from "./VerificationClient.module.css";

interface VerificationClientProps {
  initialWorkspace: ProviderVerificationWorkspaceDTO;
}

type SaveState = "idle" | "saving" | "saved" | "error";

const EVIDENCE_OPTIONS: VerificationEvidenceType[] = [
  "identity",
  "business_license",
  "portfolio_proof",
  "location",
  "professional_credential",
  "other",
];

const LOCKED_STATUSES: ProviderVerificationStatus[] = [
  "submitted",
  "under_review",
  "verified",
  "revoked",
];

export function VerificationClient({ initialWorkspace }: VerificationClientProps) {
  const router = useRouter();
  const [verification, setVerification] = useState(initialWorkspace.verification);
  const [evidence, setEvidence] = useState(initialWorkspace.evidence);
  const [history, setHistory] = useState(initialWorkspace.history);
  const [type, setType] = useState<VerificationEvidenceType>(
    initialWorkspace.requiredEvidence[0] ?? "identity"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceState, setEvidenceState] = useState<SaveState>("idle");
  const [submitState, setSubmitState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  const submittedRequiredTypes = useMemo(
    () =>
      new Set(
        evidence
          .filter((item) => initialWorkspace.requiredEvidence.includes(item.type))
          .map((item) => item.type)
      ),
    [evidence, initialWorkspace.requiredEvidence]
  );
  const missingRequired = initialWorkspace.requiredEvidence.filter(
    (item) => !submittedRequiredTypes.has(item)
  );
  const completionPercent = Math.round(
    (submittedRequiredTypes.size / initialWorkspace.requiredEvidence.length) * 100
  );
  const isLocked = LOCKED_STATUSES.includes(verification.status);

  async function addEvidence() {
    setEvidenceState("saving");
    setSubmitState("idle");
    setMessage("");

    const response = await fetch("/api/provider-verification/evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, description, evidenceUrl }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setEvidenceState("error");
      setMessage(payload.error ?? "Evidence could not be added.");
      return;
    }

    setEvidence((current) => [payload.evidence as VerificationEvidenceDTO, ...current]);
    setEvidenceState("saved");
    setMessage("Evidence added.");
    setTitle("");
    setDescription("");
    setEvidenceUrl("");
    router.refresh();
  }

  async function submitForReview() {
    setSubmitState("saving");
    setEvidenceState("idle");
    setMessage("");

    const response = await fetch("/api/provider-verification/submit", {
      method: "POST",
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setSubmitState("error");
      const missing = Array.isArray(payload.missing) ? ` Missing: ${payload.missing.join(", ")}.` : "";
      setMessage(`${payload.error ?? "Verification could not be submitted."}${missing}`);
      return;
    }

    setVerification((current) => ({
      ...current,
      status: payload.verification.status,
      submittedAt: payload.verification.submittedAt,
      updatedAt: payload.verification.updatedAt,
    }));
    setHistory((current) => [payload.history as VerificationStatusHistoryDTO, ...current]);
    setSubmitState("saved");
    setMessage("Verification submitted for review.");
    router.refresh();
  }

  return (
    <>
      <Topbar
        title="Verification"
        subtitle="Submit trust evidence for marketplace review and future verified badges."
      />
      <main className={styles.page}>
        <section className={styles.heroPanel}>
          <div>
            <p className={styles.eyebrow}>Trust profile</p>
            <h1>{verification.providerName}</h1>
            <p>
              Evidence is visible only to Braidel review operations until
              marketplace trust badges are intentionally enabled.
            </p>
          </div>
          <div className={styles.statusBlock}>
            <Badge variant={statusVariant(verification.status)} dot>
              {VERIFICATION_STATUS_LABELS[verification.status]}
            </Badge>
            <strong>{completionPercent}% ready</strong>
            <span>
              {submittedRequiredTypes.size} of {initialWorkspace.requiredEvidence.length}
              {" "}required items
            </span>
          </div>
        </section>

        <section className={styles.grid}>
          <div className={styles.mainColumn}>
            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.eyebrow}>Required evidence</p>
                  <h2>Verification checklist</h2>
                </div>
                <Badge variant={missingRequired.length ? "warning" : "success"}>
                  {missingRequired.length ? `${missingRequired.length} missing` : "Complete"}
                </Badge>
              </div>

              <div className={styles.checklist}>
                {initialWorkspace.requiredEvidence.map((item) => {
                  const matches = evidence.filter((entry) => entry.type === item);
                  return (
                    <article key={item} className={styles.checkItem}>
                      <span className={matches.length ? styles.checkIconDone : styles.checkIcon}>
                        {matches.length ? <CheckIcon /> : <ShieldIcon />}
                      </span>
                      <div>
                        <strong>{VERIFICATION_EVIDENCE_LABELS[item]}</strong>
                        <p>{checklistCopy(item)}</p>
                      </div>
                      <Badge variant={matches.length ? "success" : "neutral"}>
                        {matches.length ? "Added" : "Needed"}
                      </Badge>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.eyebrow}>Evidence vault</p>
                  <h2>Submitted items</h2>
                </div>
                <Badge variant="neutral">{evidence.length} records</Badge>
              </div>

              {evidence.length ? (
                <div className={styles.evidenceList}>
                  {evidence.map((item) => (
                    <article key={item.id} className={styles.evidenceCard}>
                      <div>
                        <span className={styles.evidenceType}>
                          {VERIFICATION_EVIDENCE_LABELS[item.type]}
                        </span>
                        <h3>{item.title}</h3>
                        {item.description ? <p>{item.description}</p> : null}
                        {item.evidenceUrl ? (
                          <a href={item.evidenceUrl} target="_blank" rel="noreferrer">
                            Open reference
                          </a>
                        ) : null}
                      </div>
                      <div className={styles.evidenceMeta}>
                        <Badge variant={evidenceVariant(item.status)}>{evidenceLabel(item.status)}</Badge>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>No evidence submitted yet</p>
                  <p>Add the required evidence records, then submit the profile for review.</p>
                </div>
              )}
            </section>
          </div>

          <aside className={styles.sideColumn}>
            <section className={styles.panel}>
              <p className={styles.eyebrow}>Add evidence</p>
              <h2>Provider-owned submission</h2>
              <fieldset disabled={isLocked} className={styles.formStack}>
                <label className={styles.fieldLabel}>
                  Evidence type
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value as VerificationEvidenceType)}
                  >
                    {EVIDENCE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {VERIFICATION_EVIDENCE_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Title"
                  placeholder="e.g. Georgia salon license"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <Textarea
                  label="Notes"
                  placeholder="Add context for the reviewer."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                />
                <Input
                  label="Reference link"
                  placeholder="https://..."
                  value={evidenceUrl}
                  onChange={(event) => setEvidenceUrl(event.target.value)}
                />
              </fieldset>
              <Button
                fullWidth
                onClick={addEvidence}
                disabled={isLocked || evidenceState === "saving"}
              >
                {evidenceState === "saving" ? "Adding..." : "Add evidence"}
              </Button>
              {isLocked ? (
                <p className={styles.lockNote}>
                  Evidence is locked while this verification is submitted or approved.
                </p>
              ) : null}
            </section>

            <section className={styles.panel}>
              <p className={styles.eyebrow}>Review readiness</p>
              <h2>Submit profile</h2>
              <p className={styles.panelText}>
                Submit when every required evidence type has at least one record.
              </p>
              <Button
                fullWidth
                onClick={submitForReview}
                disabled={isLocked || Boolean(missingRequired.length) || submitState === "saving"}
              >
                {submitState === "saving" ? "Submitting..." : "Submit for review"}
              </Button>
              {message ? (
                <p className={evidenceState === "error" || submitState === "error" ? styles.errorText : styles.successText}>
                  {message}
                </p>
              ) : null}
            </section>

            <section className={styles.panel}>
              <p className={styles.eyebrow}>Audit trail</p>
              <h2>Status history</h2>
              {history.length ? (
                <div className={styles.timeline}>
                  {history.map((entry) => (
                    <article key={entry.id} className={styles.timelineItem}>
                      <strong>{VERIFICATION_STATUS_LABELS[entry.newStatus]}</strong>
                      <span>{formatDate(entry.createdAt)}</span>
                      {entry.note ? <p>{entry.note}</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <p className={styles.panelText}>
                  Status decisions will appear here once this profile is submitted.
                </p>
              )}
            </section>
          </aside>
        </section>
      </main>
    </>
  );
}

function checklistCopy(type: VerificationEvidenceType) {
  const copy: Record<VerificationEvidenceType, string> = {
    identity: "Owner or provider identity confirmation.",
    business_license: "Salon registration, license, or business document.",
    portfolio_proof: "Portfolio ownership or representative work proof.",
    location: "Address, service area, or operating location proof.",
    professional_credential: "Training, experience, certification, or specialty proof.",
    other: "Additional context requested by the review team.",
  };
  return copy[type];
}

function statusVariant(status: ProviderVerificationStatus) {
  if (status === "verified") return "success";
  if (status === "rejected" || status === "revoked" || status === "expired") return "danger";
  if (status === "submitted" || status === "under_review") return "warning";
  return "neutral";
}

function evidenceVariant(status: VerificationEvidenceDTO["status"]) {
  if (status === "approved") return "success";
  if (status === "rejected" || status === "expired") return "danger";
  if (status === "under_review") return "warning";
  return "info";
}

function evidenceLabel(status: VerificationEvidenceDTO["status"]) {
  const labels: Record<VerificationEvidenceDTO["status"], string> = {
    submitted: "Submitted",
    under_review: "Under review",
    approved: "Approved",
    rejected: "Needs changes",
    expired: "Expired",
  };
  return labels[status];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function CheckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
}

function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
