"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { ReviewDTO } from "@/db/queries";
import styles from "./ReviewDialog.module.css";

interface ReviewDialogProps {
  applicationId: string;
  targetName: string;
  targetType: "braider" | "salon";
  initialReview: ReviewDTO | null;
}

export function ReviewDialog({
  applicationId,
  targetName,
  targetType,
  initialReview,
}: ReviewDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [review, setReview] = useState(initialReview);
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(initialReview?.score ?? 0);
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function openDialog() {
    setScore(review?.score ?? 0);
    setComment(review?.comment ?? "");
    setError(null);
    setIsOpen(true);
  }

  function closeDialog() {
    if (!isSaving) setIsOpen(false);
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!score) {
      setError("Choose a rating from 1 to 5.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/ratings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, score, comment }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not save your review.");
        return;
      }

      setReview(data.review);
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const titleId = `review-title-${applicationId}`;

  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={openDialog} iconLeft={<StarIcon />}>
        {review ? "Edit review" : "Review"}
      </Button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => setIsOpen(false)}
      >
        <form className={styles.content} onSubmit={submitReview}>
          <div className={styles.header}>
            <div>
              <h2 id={titleId} className={styles.title}>Review {targetName}</h2>
              <p className={styles.subtitle}>
                Share your experience with this matched {targetType}.
              </p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close review"
              title="Close"
              disabled={isSaving}
              onClick={closeDialog}
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.ratingGroup}>
            <span className={styles.label}>Rating</span>
            <div className={styles.stars} role="radiogroup" aria-label={`Rating for ${targetName}`}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={score === value}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  className={`${styles.starButton} ${value <= score ? styles.starButtonActive : ""}`}
                  onClick={() => setScore(value)}
                >
                  <StarIcon filled={value <= score} />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            id={`review-comment-${applicationId}`}
            label="Review"
            value={comment}
            rows={5}
            maxLength={2000}
            placeholder="What stood out about working together?"
            hint={`${comment.length}/2000 characters`}
            onChange={(event) => setComment(event.target.value)}
          />

          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.footer}>
            <Button type="button" variant="ghost" disabled={isSaving} onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : review ? "Update review" : "Publish review"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
