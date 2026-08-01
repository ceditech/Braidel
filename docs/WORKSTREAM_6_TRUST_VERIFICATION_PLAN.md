# Workstream 6: Trust, Verification, and Marketplace Administration

> Planning record for the next strategic implementation stream.
>
> Status: planned, not yet implemented.
>
> Last updated: July 31, 2026

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

- Average rating, review count, and rating distribution.
- Latest review list with appointment/service context.
- Review detail drawer with rating, comment, timestamps, booking link, and
  audit history.
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
- Provider can request clarification or report/dispute a review.
- Dispute status should be visible but not over-automated at first.
- Notifications should be created for relevant Client/provider/admin events.

Recommended product language:

- Use "Respond" and "Report review" or "Dispute review".
- Avoid "negotiate review" language because reviews should not feel coercive.

### 6.3 Verification Evidence Foundation

Add verification data structures for trust badges and provider quality.

Scope:

- Verification profile/status for Salons and Braiders.
- Evidence records for identity, business/license, portfolio proof, location, or
  professional credentials.
- Status history for submitted, under review, approved, rejected, expired, or
  revoked.
- Server-side authorization so users can submit only their own evidence.

Initial implementation can store metadata first and defer sensitive file upload
policy until production storage rules are finalized.

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

