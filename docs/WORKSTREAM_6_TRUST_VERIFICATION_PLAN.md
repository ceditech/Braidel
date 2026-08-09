# Workstream 6: Trust, Verification, and Marketplace Administration

> Planning record for the next strategic implementation stream.
>
> Status: in progress.
>
> Last updated: August 1, 2026

## Progress Notes

- **July 31, 2026:** Slice 6.1 started with a provider-only
  `/dashboard/reviews` route for Salon owners and Braiders. The first slice is
  read-only and uses existing completed-booking `ratings` plus append-only
  `rating_history` data. Provider responses, dispute intake, verification
  evidence, moderation, marketplace trust badges, and review reminders remain
  planned follow-up slices.
- **August 1, 2026:** Slice 6.1 manual QA passed. Coverage included Salon
  owner access, Braider access, Client redirect protection, provider-scoped
  review data, detail drawer content, appointment deep links, and responsive
  light/dark smoke testing.
- **August 1, 2026:** Slice 6.2 implementation added provider review
  responses and provider report intake. Migration `0016_absurd_slyde.sql`
  introduces `provider_review_responses`,
  `provider_review_response_history`, and `review_reports`; `/dashboard/reviews`
  now supports provider response publishing/edit history and one report per
  provider/review. Provider responses are also visible in the appointment
  details drawer so Client notifications land on a meaningful surface. Manual
  QA passed August 1, 2026 for response create/update, Client notification
  delivery, appointment drawer response visibility, response history, report
  intake, report status locking, and role-compatible access smoke checks.
- **August 1, 2026:** Slice 6.3 implementation added the verification evidence
  foundation. Migration `0017_flat_leopardon.sql` introduces
  `provider_verifications`, `verification_evidence`, and
  `verification_status_history`; Salon owners and Braiders now have a
  provider-only `/dashboard/verification` workspace for evidence readiness,
  metadata submission, submit-for-review, and status history. Sensitive file
  upload, admin decisions, public trust badges, and external review operations
  remain deferred to later slices. Manual QA is pending before marking this
  slice complete.
- **August 8, 2026:** Slice 6.3 QA follow-up tightened evidence quality without
  removing flexibility. Evidence records now need either a reviewer-accessible
  reference link or at least 40 characters of proof details; title-only records
  do not satisfy required evidence or submit readiness. The Verification UI now
  includes tooltips describing accepted proof sources such as provider profiles,
  portfolio galleries, business/state registry pages, secure upload links, and
  private/offline fallback notes.

## Purpose

Workstream 6 turns Braidel from a functional marketplace into a trusted
marketplace. The goal is to help Clients, Salon owners, and Braiders understand
who is credible, what has been verified, how reviews are handled, and how
marketplace issues are escalated.

This workstream should build on the completed booking, messaging, notification,
review, and review-audit foundation without disturbing payment boundaries.

## Recommended Implementation Order

### 6.1 Provider Reviews Dashboard

Build a dedicated provider-facing `/dashboard/reviews` surface for Salon owners
and Braiders.

Scope:

- Average rating, review count, and rating distribution. **Implemented in the
  first slice and manual-QA passed August 1, 2026.**
- Latest review list with appointment/service context. **Implemented in the
  first slice and manual-QA passed August 1, 2026.**
- Review detail drawer with rating, comment, timestamps, booking link, and
  audit history. **Implemented in the first slice and manual-QA passed
  August 1, 2026.**
- Provider response placeholder or first implementation, depending on scope.
- Empty state for providers with no reviews.

Why first:

- It uses already-stable `ratings` and `rating_history` data.
- It creates immediate trust value.
- It does not require new external services or money movement.

### 6.2 Provider Review Response and Dispute Intake

Add structured provider actions for review transparency.

Scope:

- Provider can respond once to a review, with edit history if edits are allowed.
  **Implemented and manual-QA passed August 1, 2026.**
- Provider can request clarification or report/dispute a review. **Initial
  report intake is implemented and manual-QA passed; admin moderation is
  deferred.**
- Dispute status should be visible but not over-automated at first. **Provider
  report status is visible in the drawer after submission.**
- Notifications should be created for relevant Client/provider/admin events.
  **Provider response create/update sends Client notifications and manual QA
  passed August 1, 2026; admin review queue notifications remain deferred with
  moderation tooling.**

Recommended product language:

- Use "Respond" and "Report review" or "Dispute review".
- Avoid "negotiate review" language because reviews should not feel coercive.

### 6.3 Verification Evidence Foundation

Add verification data structures for trust badges and provider quality.

Scope:

- Verification profile/status for Salons and Braiders.
  **Implemented; manual QA pending.**
- Evidence records for identity, business/license, portfolio proof, location, or
  professional credentials.
  **Implemented as metadata/reference records; sensitive upload policy remains
  deferred.**
- Status history for submitted, under review, approved, rejected, expired, or
  revoked.
  **Implemented for provider verification status changes.**
- Server-side authorization so users can submit only their own evidence.
  **Implemented through provider-owned dashboard route and protected APIs.**

Initial implementation can store metadata first and defer sensitive file upload
policy until production storage rules are finalized. **Current 6.3 slice follows
this approach.**

### 6.4 Admin and Moderation Surface

Add internal marketplace operations tools.

Scope:

- Review verification submissions.
- Review reported/disputed reviews.
- Apply moderation decisions with audit history.
- Restrict, suspend, or reactivate accounts/listings.
- Preserve evidence and decisions for audit.

This can begin as a protected internal dashboard route before adding more
advanced queues or role-specific admin permissions.

### 6.5 Trust Signals in Marketplace Discovery

Surface trust data where users make decisions.

Scope:

- Verified provider badge.
- Average rating and review count.
- Completed booking count when available.
- Response/dispute status where appropriate.
- Profile completeness or portfolio quality signals.

Keep signals honest: do not display "verified" until verification evidence is
approved by a real workflow.

### 6.6 Review Reminder System

Add a capped reminder flow for completed bookings with no review.

Scope:

- Maximum of 5 reminders.
- Suggested timing: 24 hours, 3 days, 7 days, 14 days, and 30 days after
  completion.
- Stop immediately when a review exists.
- Store reminder attempts for audit and anti-spam controls.
- Honor notification preferences before external email or push is activated.

This can remain internal/in-app first. Email or push delivery should wait for
the external notification worker.

## Suggested Schema Areas

Potential additive tables or fields:

- `provider_review_responses`
- `provider_review_response_history`
- `review_reports` or `review_disputes`
- `provider_verifications`
- `verification_evidence`
- `verification_status_history`
- `marketplace_admin_actions`
- `review_reminder_events`

Use append-only history for decisions that affect trust, moderation, account
standing, or public reputation.

## QA Strategy

Manual QA should include:

- Provider can see reviews and rating stats.
- Provider cannot see or act on another provider's reviews.
- Client-visible review content remains unchanged unless intentionally updated.
- Provider response/dispute actions create expected notifications and audit
  rows.
- Verification submissions are role-scoped and cannot be edited by unrelated
  users.
- Marketplace trust badges appear only after verified state exists.
- Reminder logic does not send duplicate reminders and stops after a review is
  submitted.
- Existing booking, messaging, notification, review, and payment-foundation
  boundaries continue to work.

## Deferred Until Policy Is Clear

- Full moderation policy and appeal workflow.
- Public dispute labels.
- External email/push reminder delivery.
- Background worker or cron implementation for review reminders.
- Legal copy for review guidelines, verification standards, and evidence
  retention.
