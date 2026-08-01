"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { Topbar } from "@/components/dashboard/Topbar";
import type {
  ProviderReviewDTO,
  ProviderReviewDashboardDTO,
  ProviderReviewReportCategory,
} from "@/lib/review-domain";
import styles from "./ProviderReviewsClient.module.css";

interface ProviderReviewsClientProps {
  dashboard: ProviderReviewDashboardDTO;
}

const REPORT_OPTIONS: Array<{
  value: ProviderReviewReportCategory;
  label: string;
}> = [
  { value: "inaccurate", label: "Inaccurate details" },
  { value: "abusive", label: "Abusive or harmful" },
  { value: "private_info", label: "Private information" },
  { value: "fraud", label: "Fraud or spam" },
  { value: "other", label: "Other" },
];

export function ProviderReviewsClient({ dashboard }: ProviderReviewsClientProps) {
  const [reviews, setReviews] = useState(dashboard.reviews);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? null,
    [reviews, selectedReviewId]
  );
  const updateReview = (reviewId: string, patch: Partial<ProviderReviewDTO>) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === reviewId ? { ...review, ...patch } : review
      )
    );
  };

  return (
    <>
      <Topbar
        title="Reviews"
        subtitle="Monitor client feedback, rating history, and trust signals tied to completed appointments."
      />
      <main className={styles.page}>
        <section className={styles.statsGrid} aria-label="Review summary">
          <MetricCard
            label="Average rating"
            value={dashboard.totalReviews ? dashboard.averageRating.toFixed(1) : "-"}
            hint={dashboard.latestReviewAt ? `Latest ${formatShortDate(dashboard.latestReviewAt)}` : "No ratings yet"}
          />
          <MetricCard
            label="Total reviews"
            value={String(dashboard.totalReviews)}
            hint="Completed appointments with feedback"
          />
          <MetricCard
            label="Five-star share"
            value={`${dashboard.fiveStarShare}%`}
            hint="Quality signal for marketplace trust"
          />
          <MetricCard
            label="Edited reviews"
            value={String(dashboard.editedReviews)}
            hint="Transparent update history"
          />
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.reviewPanel}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Provider reputation</p>
                <h2 className={styles.sectionTitle}>Client reviews</h2>
              </div>
              <Badge variant="brand">{dashboard.totalReviews} total</Badge>
            </div>

            {reviews.length ? (
              <div className={styles.reviewList}>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isSelected={review.id === selectedReviewId}
                    onSelect={() => setSelectedReviewId(review.id)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No reviews yet</p>
                <p>
                  Reviews will appear here after clients submit feedback for completed
                  appointments.
                </p>
              </div>
            )}
          </div>

          <aside className={styles.insightPanel} aria-label="Rating distribution">
            <div>
              <p className={styles.eyebrow}>Rating mix</p>
              <h2 className={styles.sectionTitle}>Distribution</h2>
            </div>
            <div className={styles.distributionList}>
              {dashboard.distribution.map((item) => (
                <div key={item.score} className={styles.distributionRow}>
                  <span className={styles.scoreLabel}>{item.score} star</span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </span>
                  <span className={styles.countLabel}>{item.count}</span>
                </div>
              ))}
            </div>
            <div className={styles.policyNote}>
              <p className={styles.policyTitle}>Trust controls</p>
              <p>
                Provider responses and report intake are available here. Admin moderation,
                public trust placement, and reminder automation remain tracked before launch.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <Drawer
        open={Boolean(selectedReview)}
        title={selectedReview ? `Review from ${selectedReview.client.name}` : "Review details"}
        description={
          selectedReview
            ? `${selectedReview.serviceName} - ${formatAppointment(selectedReview)}`
            : undefined
        }
        onClose={() => setSelectedReviewId(null)}
        footer={
          selectedReview ? (
            <div className={styles.drawerActions}>
              <Link
                className={styles.appointmentLink}
                href={`/dashboard/appointments?booking=${selectedReview.bookingId}`}
              >
                Open appointment
                <ArrowIcon />
              </Link>
            </div>
          ) : null
        }
      >
        {selectedReview && (
          <ReviewDetails
            key={selectedReview.id}
            review={selectedReview}
            onReviewUpdated={updateReview}
          />
        )}
      </Drawer>
    </>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className={styles.metricCard}>
      <p className={styles.metricValue}>{value}</p>
      <h2 className={styles.metricLabel}>{label}</h2>
      <p className={styles.metricHint}>{hint}</p>
    </article>
  );
}

function ReviewCard({
  review,
  isSelected,
  onSelect,
}: {
  review: ProviderReviewDTO;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const wasEdited = review.history.some((entry) => entry.action === "updated");

  return (
    <button
      type="button"
      className={`${styles.reviewCard} ${isSelected ? styles.reviewCardSelected : ""}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <span className={styles.reviewTopline}>
        <span>
          <strong>{review.client.name}</strong>
          <span className={styles.reviewMeta}>
            {review.serviceName} - {formatShortDate(review.appointmentStartsAt)}
          </span>
        </span>
        <span className={styles.ratingPill} aria-label={`${review.score} out of 5 stars`}>
          <StarIcon />
          {review.score.toFixed(1)}
        </span>
      </span>
      <span className={styles.reviewComment}>{review.comment || "No written comment."}</span>
      <span className={styles.reviewFooter}>
        {wasEdited ? <Badge variant="info">Updated</Badge> : <Badge variant="success">Original</Badge>}
        {review.providerResponse ? <Badge variant="brand">Responded</Badge> : null}
        {review.report ? <Badge variant="warning">Reported</Badge> : null}
        <span>Reviewed {formatShortDate(review.createdAt)}</span>
      </span>
    </button>
  );
}

function ReviewDetails({
  review,
  onReviewUpdated,
}: {
  review: ProviderReviewDTO;
  onReviewUpdated: (reviewId: string, patch: Partial<ProviderReviewDTO>) => void;
}) {
  const [responseBody, setResponseBody] = useState(review.providerResponse?.body ?? "");
  const [responseStatus, setResponseStatus] = useState<FeedbackState>({});
  const [isSavingResponse, setIsSavingResponse] = useState(false);
  const [reportCategory, setReportCategory] =
    useState<ProviderReviewReportCategory>("inaccurate");
  const [reportReason, setReportReason] = useState("");
  const [reportStatus, setReportStatus] = useState<FeedbackState>({});
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  async function saveResponse() {
    setIsSavingResponse(true);
    setResponseStatus({});

    const response = await fetch(`/api/provider-reviews/${review.id}/response`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: responseBody }),
    });
    const payload = await response.json().catch(() => ({}));

    setIsSavingResponse(false);
    if (!response.ok) {
      setResponseStatus({ error: payload.error ?? "Response could not be saved" });
      return;
    }

    onReviewUpdated(review.id, {
      providerResponse: {
        ...payload.response,
        history: [
          ...(review.providerResponse?.history ?? []),
          ...(payload.response.history ?? []),
        ],
      },
    });
    setResponseStatus({ message: "Provider response saved" });
  }

  async function submitReport() {
    setIsSubmittingReport(true);
    setReportStatus({});

    const response = await fetch(`/api/provider-reviews/${review.id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: reportCategory, reason: reportReason }),
    });
    const payload = await response.json().catch(() => ({}));

    setIsSubmittingReport(false);
    if (!response.ok) {
      setReportStatus({ error: payload.error ?? "Report could not be submitted" });
      return;
    }

    onReviewUpdated(review.id, { report: payload.report });
    setReportReason("");
    setReportStatus({ message: "Review report submitted" });
  }

  return (
    <div className={styles.drawerContent}>
      <section className={styles.drawerSection}>
        <div className={styles.largeRating} aria-label={`${review.score} out of 5 stars`}>
          <span>{review.score.toFixed(1)}</span>
          <StarStrip score={review.score} />
        </div>
        <p className={styles.fullComment}>{review.comment || "No written comment."}</p>
      </section>

      <section className={styles.detailGrid} aria-label="Review context">
        <div>
          <span>Client</span>
          <strong>{review.client.name}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{review.client.email}</strong>
        </div>
        <div>
          <span>Appointment</span>
          <strong>{formatAppointment(review)}</strong>
        </div>
        <div>
          <span>Last updated</span>
          <strong>{formatDateTime(review.updatedAt, review.timezone)}</strong>
        </div>
      </section>

      <section className={styles.drawerSection}>
        <div className={styles.sectionHeaderCompact}>
          <h3>Audit history</h3>
          <Badge variant="neutral">{review.history.length} events</Badge>
        </div>
        {review.history.length ? (
          <ol className={styles.historyList}>
            {review.history.map((entry, index) => (
              <li key={`${entry.createdAt}-${index}`} className={styles.historyItem}>
                <span className={styles.historyDot} />
                <div>
                  <p>
                    <strong>{entry.action === "updated" ? "Review updated" : "Review created"}</strong>
                    <span>{formatDateTime(entry.createdAt, review.timezone)}</span>
                  </p>
                  <p className={styles.historyBody}>
                    {entry.action === "updated"
                      ? `${entry.previousScore ?? "-"} to ${entry.newScore} stars`
                      : `${entry.newScore} stars`}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.mutedText}>No history events have been recorded for this review yet.</p>
        )}
      </section>

      <section className={styles.drawerSection}>
        <div className={styles.sectionHeaderCompact}>
          <h3>Provider response</h3>
          <Badge variant={review.providerResponse ? "success" : "neutral"}>
            {review.providerResponse ? "Published" : "Not published"}
          </Badge>
        </div>
        {review.providerResponse ? (
          <div className={styles.responsePreview}>
            <p>{review.providerResponse.body}</p>
            <span>Last updated {formatDateTime(review.providerResponse.updatedAt, review.timezone)}</span>
          </div>
        ) : null}
        <label className={styles.formLabel} htmlFor={`response-${review.id}`}>
          Public response
        </label>
        <textarea
          id={`response-${review.id}`}
          className={styles.textarea}
          value={responseBody}
          maxLength={2000}
          onChange={(event) => setResponseBody(event.target.value)}
          placeholder="Thank the client, clarify context, or explain how your team handled the appointment."
        />
        <div className={styles.formFooter}>
          <span>{responseBody.trim().length}/2000 characters</span>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={saveResponse}
            disabled={isSavingResponse || !responseBody.trim()}
          >
            {isSavingResponse
              ? "Saving..."
              : review.providerResponse
                ? "Update response"
                : "Publish response"}
          </button>
        </div>
        <FeedbackMessage state={responseStatus} />
        {review.providerResponse?.history.length ? (
          <details className={styles.historyDetails}>
            <summary>Response history ({review.providerResponse.history.length})</summary>
            <ol className={styles.historyList}>
              {review.providerResponse.history.map((entry, index) => (
                <li key={`${entry.createdAt}-${index}`} className={styles.historyItem}>
                  <span className={styles.historyDot} />
                  <div>
                    <p>
                      <strong>
                        {entry.action === "updated" ? "Response updated" : "Response created"}
                      </strong>
                      <span>{formatDateTime(entry.createdAt, review.timezone)}</span>
                    </p>
                    <p className={styles.historyBody}>{entry.newBody}</p>
                  </div>
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </section>

      <section className={styles.drawerSection}>
        <div className={styles.sectionHeaderCompact}>
          <h3>Report review</h3>
          {review.report ? (
            <Badge variant="warning">{formatReportStatus(review.report.status)}</Badge>
          ) : (
            <Badge variant="neutral">Optional</Badge>
          )}
        </div>
        {review.report ? (
          <div className={styles.reportState}>
            <p>
              <strong>{formatReportCategory(review.report.category)}</strong>
              <span>Submitted {formatDateTime(review.report.createdAt, review.timezone)}</span>
            </p>
            <p>{review.report.reason}</p>
          </div>
        ) : (
          <>
            <label className={styles.formLabel} htmlFor={`report-category-${review.id}`}>
              Category
            </label>
            <select
              id={`report-category-${review.id}`}
              className={styles.select}
              value={reportCategory}
              onChange={(event) =>
                setReportCategory(event.target.value as ProviderReviewReportCategory)
              }
            >
              {REPORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className={styles.formLabel} htmlFor={`report-reason-${review.id}`}>
              Reason
            </label>
            <textarea
              id={`report-reason-${review.id}`}
              className={styles.textarea}
              value={reportReason}
              maxLength={2000}
              onChange={(event) => setReportReason(event.target.value)}
              placeholder="Explain what should be reviewed by the Braidel team. Include only relevant facts."
            />
            <div className={styles.formFooter}>
              <span>{reportReason.trim().length}/2000 characters</span>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={submitReport}
                disabled={isSubmittingReport || reportReason.trim().length < 10}
              >
                {isSubmittingReport ? "Submitting..." : "Submit report"}
              </button>
            </div>
            <FeedbackMessage state={reportStatus} />
          </>
        )}
      </section>
    </div>
  );
}

interface FeedbackState {
  message?: string;
  error?: string;
}

function FeedbackMessage({ state }: { state: FeedbackState }) {
  if (!state.message && !state.error) return null;
  return (
    <p className={state.error ? styles.formError : styles.formSuccess}>
      {state.error ?? state.message}
    </p>
  );
}

function StarStrip({ score }: { score: number }) {
  return (
    <span className={styles.starStrip} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((value) => (
        <StarIcon key={value} filled={value <= Math.round(score)} />
      ))}
    </span>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAppointment(review: ProviderReviewDTO) {
  return formatDateTime(review.appointmentStartsAt, review.timezone);
}

function formatReportCategory(category: ProviderReviewReportCategory) {
  return REPORT_OPTIONS.find((option) => option.value === category)?.label ?? "Other";
}

function formatReportStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
