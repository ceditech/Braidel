# Workstream 6: Trust, Verification, and Marketplace Administration

> Planning record for the next strategic implementation stream.
>
> Status: in progress.
>
> Last updated: August 9, 2026

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
  remain deferred to later slices.
- **August 8, 2026:** Slice 6.3 QA follow-up tightened evidence quality without
  removing flexibility. Evidence records now need either a reviewer-accessible
  reference link or at least 40 characters of proof details; title-only records
  do not satisfy required evidence or submit readiness. The Verification UI now
  includes tooltips describing accepted proof sources such as provider profiles,
  portfolio galleries, business/state registry pages, secure upload links, and
  private/offline fallback notes.
- **August 9, 2026:** Slice 6.3 manual QA passed after the proof-quality
  follow-up. Slice 6.4 implementation started with migration
  `0018_spooky_tattoo.sql`, the `marketplace_admin_actions` audit ledger,
  allowlist-gated `/dashboard/admin`, verification decision APIs, review report
  moderation APIs, provider notifications, and verified-flag updates. Migration
  `0018_spooky_tattoo.sql` was applied to the configured development Neon
  database; manual QA remains pending before marking 6.4 complete.
- **August 9, 2026:** Admin access hardening added migration
  `0019_curved_silver_centurion.sql` and a separate `/admin/sign-up` ->
  `/admin/setup` activation path. Allowlisted admins now receive an internal
  `admin` role without creating marketplace profile records.
- **August 9, 2026:** Slice 6.4 admin portal expansion added migration
  `0020_grey_turbo.sql`, allowing `marketplace_admin_actions` to audit
  `user_account` lifecycle changes. `/dashboard/admin` now includes Performance,
  Users, Money, and Moderation tabs with Neon-backed KPIs, safe profile editing,
  initial user lifecycle controls, booking commission visibility, upcoming
  affiliate/subscription lanes, and a User STABLE framework. Migration `0021`
  later clarifies those lifecycle controls into explicit account suspension and
  provider profile unlisting. Manual QA remains pending before marking 6.4
  complete.
- **August 26, 2026:** Slice 6.4 moderation semantics were split into two
  explicit concepts with migration `0021_reflective_princess_powerful.sql`.
  `users.account_status` now governs protected platform access
  (`active`/`suspended`), while `service_providers.visibility` governs public
  discovery and bookability (`listed`/`unlisted`). Admin actions now expose
  **Suspend/Restore access** separately from **Unlist/Relist profile** and
  write audit rows to `marketplace_admin_actions`.
- **August 26, 2026:** Deferred hardening note: profile unlisting is currently
  gated by the presence of a provider profile row, which is correct while only
  Salon owners and Braiders can have `service_providers` records. If Braidel
  adds new provider roles or changes provider identity modeling, replace this
  data-shape inference with an explicit provider-role/domain helper so the
  admin gate fails loudly instead of silently drifting.
- **August 26, 2026:** Closed an email-only privilege path: `isMarketplaceAdmin`
  now requires both an allowlisted `BRAIDEL_ADMIN_EMAILS` entry and a Neon
  `users.role` of `admin` — an allowlisted email alone is no longer sufficient
  if the account onboarded through a non-admin path. Added a **Promote admin**
  action so an existing admin can grant the `admin` role to another user,
  gated on that user's email already being allowlisted so promotion cannot
  itself add a new trusted email.
- **August 26, 2026:** Fixed a sidebar regression pre-dating this admin work
  (introduced in `caae426`): "Admin Review" appeared twice, and the internal
  Project Tracker/Market Study/Payment System Design pages had no server-side
  admin check at all — the sidebar was the only thing hiding them from
  non-admins, and it was hiding them incorrectly. Added
  `requireMarketplaceAdmin()` to all three pages; `tracker/page.tsx` was split
  into a server wrapper + `TrackerClient.tsx` since it was a full client
  component.
- **August 26, 2026:** Added an admin **Preview as** Salon/Braider/Client mode
  for UI review and QA (`POST /api/admin/preview`, admin-gated cookie).
  Deliberately scoped so it never exposes another user's data — preview
  queries stay bound to the admin's own `clerkId`, which owns no
  salon/braider profile, so each role renders its genuine empty-state shell.
- **August 26, 2026:** Added SVG donut/bar/line chart primitives to the admin
  Performance tab (user composition, booking lifecycle, provider
  verification, and a 14-day bookings-created trend). Dependency-free,
  matching the codebase's existing hand-rolled-SVG convention. The new trend
  query is isolated in its own try/catch so a failure there can't take down
  the rest of the admin dashboard.

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
  **Implemented; manual QA passed August 9, 2026.**
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
  **Implemented as an allowlist-gated `/dashboard/admin` queue; manual QA
  pending.**
- Review reported/disputed reviews.
  **Implemented for existing review reports; manual QA pending.**
- Apply moderation decisions with audit history.
  **Implemented through `marketplace_admin_actions` plus verification status
  history; manual QA pending.**
- Restrict, suspend, restore, unlist, or relist accounts/listings.
  **Implemented as two separate controls: account suspension blocks protected
  dashboard/API access, while provider profile unlisting hides public discovery
  and booking without locking remediation access. Appeals/dispute policy remains
  deferred.**
- Preserve evidence and decisions for audit.
  **Implemented for admin decisions; sensitive file retention policy deferred.**
- Monitor marketplace KPIs and earnings.
  **Implemented with live admin Performance and Money tabs. Affiliate and
  subscription earnings remain upcoming placeholders until business rules are
  finalized.**

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
- Explicit provider-role helper for admin profile visibility actions if the
  provider model evolves beyond Salon owners and Braiders.
- Background worker or cron implementation for review reminders.
- Legal copy for review guidelines, verification standards, and evidence
  retention.
