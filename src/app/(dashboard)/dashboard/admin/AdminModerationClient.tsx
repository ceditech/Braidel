"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type {
  AdminReviewReportDecision,
  AdminReviewReportQueueItemDTO,
  AdminVerificationDecision,
  AdminVerificationQueueItemDTO,
  MarketplaceAdminDashboardDTO,
} from "@/lib/admin-domain";
import {
  VERIFICATION_EVIDENCE_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/verification-domain";
import styles from "./AdminModerationClient.module.css";

type QueueTab = "verifications" | "reports";

const verificationDecisions: Array<{
  value: AdminVerificationDecision;
  label: string;
  intent: "neutral" | "positive" | "danger";
}> = [
  { value: "under_review", label: "Start review", intent: "neutral" },
  { value: "verified", label: "Approve", intent: "positive" },
  { value: "rejected", label: "Reject", intent: "danger" },
  { value: "revoked", label: "Revoke", intent: "danger" },
];

const reportDecisions: Array<{
  value: AdminReviewReportDecision;
  label: string;
  intent: "neutral" | "positive" | "danger";
}> = [
  { value: "under_review", label: "Start review", intent: "neutral" },
  { value: "resolved", label: "Resolve", intent: "positive" },
  { value: "dismissed", label: "Dismiss", intent: "danger" },
];

export function AdminModerationClient({
  initialDashboard,
}: {
  initialDashboard: MarketplaceAdminDashboardDTO;
}) {
  const [dashboard] = useState(initialDashboard);
  const [tab, setTab] = useState<QueueTab>("verifications");
  const [selectedVerificationId, setSelectedVerificationId] = useState(
    initialDashboard.verifications[0]?.id ?? ""
  );
  const [selectedReportId, setSelectedReportId] = useState(
    initialDashboard.reviewReports[0]?.id ?? ""
  );
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("");

  const selectedVerification = useMemo(
    () =>
      dashboard.verifications.find((item) => item.id === selectedVerificationId) ??
      dashboard.verifications[0] ??
      null,
    [dashboard.verifications, selectedVerificationId]
  );
  const selectedReport = useMemo(
    () =>
      dashboard.reviewReports.find((item) => item.id === selectedReportId) ??
      dashboard.reviewReports[0] ??
      null,
    [dashboard.reviewReports, selectedReportId]
  );

  async function decideVerification(decision: AdminVerificationDecision) {
    if (!selectedVerification) return;
    await runDecision(
      `/api/admin/verifications/${selectedVerification.id}/decision`,
      decision
    );
  }

  async function decideReport(decision: AdminReviewReportDecision) {
    if (!selectedReport) return;
    await runDecision(`/api/admin/review-reports/${selectedReport.id}/decision`, decision);
  }

  async function runDecision(url: string, decision: string) {
    setState("saving");
    setMessage("");
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(typeof payload.error === "string" ? payload.error : "Decision failed");
      setState("idle");
      return;
    }
    window.location.reload();
  }

  return (
    <main className={styles.page}>
      <section className={styles.statsGrid} aria-label="Moderation summary">
        <Metric value={dashboard.stats.pendingVerifications} label="Verification queue" />
        <Metric value={dashboard.stats.reportedReviews} label="Reported reviews" />
        <Metric value={dashboard.stats.underReview} label="Under review" />
        <Metric value={dashboard.stats.completedDecisions} label="Admin decisions" />
      </section>

      <section className={styles.workspace}>
        <aside className={styles.queuePanel}>
          <div className={styles.tabs} role="tablist" aria-label="Moderation queues">
            <button
              type="button"
              className={tab === "verifications" ? styles.tabActive : undefined}
              onClick={() => {
                setTab("verifications");
                setNote("");
                setMessage("");
              }}
            >
              Verifications
              <span>{dashboard.verifications.length}</span>
            </button>
            <button
              type="button"
              className={tab === "reports" ? styles.tabActive : undefined}
              onClick={() => {
                setTab("reports");
                setNote("");
                setMessage("");
              }}
            >
              Reports
              <span>{dashboard.reviewReports.length}</span>
            </button>
          </div>

          {tab === "verifications" ? (
            <VerificationQueue
              items={dashboard.verifications}
              selectedId={selectedVerification?.id ?? ""}
              onSelect={(id) => {
                setSelectedVerificationId(id);
                setNote("");
                setMessage("");
              }}
            />
          ) : (
            <ReportQueue
              items={dashboard.reviewReports}
              selectedId={selectedReport?.id ?? ""}
              onSelect={(id) => {
                setSelectedReportId(id);
                setNote("");
                setMessage("");
              }}
            />
          )}
        </aside>

        <section className={styles.detailPanel}>
          {tab === "verifications" ? (
            selectedVerification ? (
              <VerificationDetail
                item={selectedVerification}
                note={note}
                onNoteChange={setNote}
                onDecide={decideVerification}
                busy={state === "saving"}
                message={message}
              />
            ) : (
              <EmptyState title="No verification submissions" />
            )
          ) : selectedReport ? (
            <ReportDetail
              item={selectedReport}
              note={note}
              onNoteChange={setNote}
              onDecide={decideReport}
              busy={state === "saving"}
              message={message}
            />
          ) : (
            <EmptyState title="No reported reviews" />
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.metricCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function VerificationQueue({
  items,
  selectedId,
  onSelect,
}: {
  items: AdminVerificationQueueItemDTO[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!items.length) return <EmptyState title="No verification submissions" compact />;
  return (
    <div className={styles.queueList}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`${styles.queueItem} ${selectedId === item.id ? styles.queueItemActive : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.itemTopline}>
            <strong>{item.providerName}</strong>
            <StatusBadge status={item.status} />
          </span>
          <span className={styles.itemMeta}>
            {item.providerType} · {item.ownerEmail}
          </span>
          <span className={styles.itemMeta}>{item.evidenceCount} evidence records</span>
        </button>
      ))}
    </div>
  );
}

function ReportQueue({
  items,
  selectedId,
  onSelect,
}: {
  items: AdminReviewReportQueueItemDTO[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!items.length) return <EmptyState title="No reported reviews" compact />;
  return (
    <div className={styles.queueList}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`${styles.queueItem} ${selectedId === item.id ? styles.queueItemActive : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.itemTopline}>
            <strong>{item.providerName}</strong>
            <ReportStatusBadge status={item.status} />
          </span>
          <span className={styles.itemMeta}>
            {item.category.replace("_", " ")} · {item.reporterEmail}
          </span>
          <span className={styles.itemMeta}>{item.score}-star review</span>
        </button>
      ))}
    </div>
  );
}

function VerificationDetail({
  item,
  note,
  onNoteChange,
  onDecide,
  busy,
  message,
}: {
  item: AdminVerificationQueueItemDTO;
  note: string;
  onNoteChange: (value: string) => void;
  onDecide: (decision: AdminVerificationDecision) => void;
  busy: boolean;
  message: string;
}) {
  return (
    <div className={styles.detailContent}>
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.eyebrow}>Verification review</p>
          <h2>{item.providerName}</h2>
          <p>{item.ownerName} · {item.ownerEmail}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.evidenceGrid}>
        {item.evidence.map((evidence) => (
          <article key={evidence.id} className={styles.evidenceCard}>
            <div>
              <Badge variant="neutral">{VERIFICATION_EVIDENCE_LABELS[evidence.type]}</Badge>
              <h3>{evidence.title}</h3>
            </div>
            <p>{evidence.description || "No description provided."}</p>
            {evidence.evidenceUrl && (
              <a href={evidence.evidenceUrl} target="_blank" rel="noreferrer">
                Open reference
              </a>
            )}
          </article>
        ))}
      </div>

      <Timeline entries={item.history} />
      <DecisionBox
        note={note}
        onNoteChange={onNoteChange}
        busy={busy}
        message={message}
        actions={verificationDecisions}
        onDecide={onDecide}
      />
    </div>
  );
}

function ReportDetail({
  item,
  note,
  onNoteChange,
  onDecide,
  busy,
  message,
}: {
  item: AdminReviewReportQueueItemDTO;
  note: string;
  onNoteChange: (value: string) => void;
  onDecide: (decision: AdminReviewReportDecision) => void;
  busy: boolean;
  message: string;
}) {
  return (
    <div className={styles.detailContent}>
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.eyebrow}>Review report</p>
          <h2>{item.providerName}</h2>
          <p>{item.serviceName} · reported by {item.reporterName}</p>
        </div>
        <ReportStatusBadge status={item.status} />
      </div>

      <div className={styles.reviewBox}>
        <div>
          <span className={styles.rating}>{item.score}.0 ★</span>
          <strong>Client review</strong>
        </div>
        <p>{item.reviewComment || "No written comment."}</p>
      </div>

      <div className={styles.reportBox}>
        <p className={styles.eyebrow}>{item.category.replace("_", " ")}</p>
        <p>{item.reason}</p>
      </div>

      <DecisionBox
        note={note}
        onNoteChange={onNoteChange}
        busy={busy}
        message={message}
        actions={reportDecisions}
        onDecide={onDecide}
      />
    </div>
  );
}

function DecisionBox<T extends string>({
  note,
  onNoteChange,
  busy,
  message,
  actions,
  onDecide,
}: {
  note: string;
  onNoteChange: (value: string) => void;
  busy: boolean;
  message: string;
  actions: Array<{ value: T; label: string; intent: "neutral" | "positive" | "danger" }>;
  onDecide: (decision: T) => void;
}) {
  return (
    <section className={styles.decisionBox}>
      <label htmlFor="admin-note">Decision note</label>
      <textarea
        id="admin-note"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Write the moderation reason, reviewer guidance, or resolution details."
      />
      {message && <p className={styles.error}>{message}</p>}
      <div className={styles.actionRow}>
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            disabled={busy}
            className={`${styles.decisionButton} ${styles[action.intent]}`}
            onClick={() => onDecide(action.value)}
          >
            {busy ? "Saving..." : action.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function Timeline({ entries }: { entries: AdminVerificationQueueItemDTO["history"] }) {
  if (!entries.length) return null;
  return (
    <section className={styles.timeline}>
      <h3>Status history</h3>
      {entries.slice(0, 5).map((entry) => (
        <div key={entry.id} className={styles.timelineItem}>
          <span>{VERIFICATION_STATUS_LABELS[entry.newStatus]}</span>
          <p>{entry.note || "No note provided."}</p>
        </div>
      ))}
    </section>
  );
}

function StatusBadge({ status }: { status: AdminVerificationQueueItemDTO["status"] }) {
  const variant =
    status === "verified" ? "success" : status === "rejected" || status === "revoked" ? "danger" : "warning";
  return <Badge variant={variant} dot>{VERIFICATION_STATUS_LABELS[status]}</Badge>;
}

function ReportStatusBadge({ status }: { status: AdminReviewReportQueueItemDTO["status"] }) {
  const variant = status === "resolved" ? "success" : status === "dismissed" ? "danger" : "warning";
  return <Badge variant={variant} dot>{status.replace("_", " ")}</Badge>;
}

function EmptyState({ title, compact }: { title: string; compact?: boolean }) {
  return (
    <div className={`${styles.emptyState} ${compact ? styles.emptyStateCompact : ""}`}>
      <strong>{title}</strong>
      <p>Nothing needs action in this queue right now.</p>
    </div>
  );
}
