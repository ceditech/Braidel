# Braidel Pre-Production Release Checks

> Dynamic production-readiness checklist for Braidel.
>
> **Current release posture:** **NO-GO — active development**
>
> **Last reviewed:** July 24, 2026

This document tracks work that must be implemented, configured, verified, or
approved before a production launch. It is not the general product backlog; use
[`docs/PROJECT_TRACKER.md`](docs/PROJECT_TRACKER.md) for feature progress.

## Maintenance Rules

- Update this file whenever a change introduces or modifies an external service,
  secret, environment variable, database migration, webhook, background task,
  authorization boundary, data-retention behavior, legal obligation, monitoring
  requirement, or rollback concern.
- Mark an item complete only after it has been verified in the target
  environment. Local success does not prove production readiness.
- Record evidence where practical: deployment URL, CI run, migration identifier,
  test date, dashboard delivery attempt, backup confirmation, or sign-off.
- Do not remove completed release gates. Keep them checked or move them to the
  Completed Evidence section so the launch history remains auditable.
- Keep this checklist aligned with `CLAUDE_HANDOFF.md`,
  `docs/PROJECT_TRACKER.md`, and `src/lib/roadmap.ts`.

## Status Legend

- `[x]` Implemented and verified at the scope stated.
- `[ ]` Required before production.
- **Deferred** means intentionally postponed during development, not optional.

## P0 Launch Gates

Production must not launch until every item in this section is complete.

### Deployment and CI

- [ ] Create and link the production Vercel project.
- [ ] Establish a stable staging or Preview environment for release-candidate
      testing.
- [ ] Configure the production domain and verify HTTPS.
- [ ] Add CI checks for TypeScript, ESLint, production build, and migration
      consistency.
- [ ] Make the full repository lint command pass. Current known debt includes
      generated/design-system source errors and render-time `Date.now()` usage in
      `NewOpportunityClient.tsx`.
- [ ] Require successful CI before production deployment.
- [ ] Pin and document the production Node.js runtime.
- [ ] Verify a production-equivalent build from a clean checkout.

### Environment and Secrets

- [ ] Configure and validate `DATABASE_URL` for the production Neon database.
- [ ] Configure production `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
      `CLERK_SECRET_KEY`.
- [ ] Configure `CLERK_WEBHOOK_SIGNING_SECRET` after the production webhook
      endpoint is created.
- [ ] Configure `BLOB_READ_WRITE_TOKEN`; production portfolio uploads must not
      rely on the local filesystem fallback.
- [ ] Configure the canonical production application URL and all Clerk redirect
      URLs.
- [ ] Confirm no development, test, or seed secrets are present in production.
- [ ] Confirm secrets are stored only in the hosting provider and ignored local
      environment files, never in Git.
- [ ] Document secret rotation and emergency revocation ownership.

### Database and Data Safety

- [ ] Use an isolated production database or Neon production branch.
- [ ] Confirm all committed Drizzle migrations apply cleanly in a
      production-equivalent environment.
- [ ] Apply migration `0009_striped_black_knight.sql` to the production database
      before activating Clerk synchronization.
- [ ] Review every pending migration for destructive or locking operations.
- [ ] Capture and verify a pre-launch backup or restorable Neon branch.
- [ ] Document database rollback and forward-fix procedures.
- [ ] Prevent `npm run db:seed` from being run against production.
- [ ] Confirm production queries do not merge development/demo rows.
- [ ] Validate referential integrity and uniqueness for users, salons, braiders,
      opportunities, applications, messages, ratings, and portfolio media.

### Authentication and Authorization

- [ ] Configure and test the Clerk Production instance.
- [ ] Verify production sign-up, sign-in, sign-out, session expiry, and onboarding.
- [ ] Verify each real role can access only its authorized workflows.
- [ ] Verify salon owners cannot mutate another salon's opportunities,
      applications, messages, settings, or ratings.
- [ ] Verify braiders cannot mutate another braider's applications, portfolio,
      settings, messages, or ratings.
- [ ] Confirm protected routes and APIs reject unauthenticated requests.
- [ ] Confirm public routes expose no private profile or account data.
- [ ] Verify account deletion behavior, data retention, and user-facing policy
      language agree.

## Clerk Webhook Activation

**Status: Deferred until a stable staging or production URL exists.**

Webhook activation is not a prerequisite for continued feature development.
It is a production launch gate because Clerk-side identity changes and deletion
events otherwise will not automatically synchronize to Neon.

### Already Implemented

- [x] Public route created at `/api/webhooks/clerk`.
- [x] Clerk signature verification implemented with `verifyWebhook()`.
- [x] `user.created`, `user.updated`, and `user.deleted` handlers implemented.
- [x] Identity updates are idempotent and preserve the role selected during
      onboarding.
- [x] Stale webhook events are ignored.
- [x] Deletions tombstone user identity data instead of cascading away
      marketplace history.
- [x] Deleted braider profiles and salon opportunities are deactivated.
- [x] Onboarding remains safe when the webhook creates the local user first.
- [x] Required lifecycle columns and one-profile-per-user constraints are
      represented by migration `0009_striped_black_knight.sql`.

### Staging Activation

- [ ] Establish a stable, publicly reachable staging URL.
- [ ] Confirm hosting-level deployment protection does not block Clerk's POST
      request to `/api/webhooks/clerk`.
- [ ] In the Clerk Development instance, create an endpoint ending in
      `/api/webhooks/clerk`.
- [ ] Subscribe only to `user.created`, `user.updated`, and `user.deleted`.
- [ ] Store that endpoint's signing secret as
      `CLERK_WEBHOOK_SIGNING_SECRET` in the staging environment.
- [ ] Redeploy staging after adding the secret.
- [ ] Send Clerk example deliveries for all three events and confirm HTTP 200.
- [ ] Run a real lifecycle test: create a user, update identity fields, then
      delete the test user.
- [ ] Verify the expected Neon insert, update, tombstone, and public-record
      deactivation behavior.
- [ ] Verify repeated and out-of-order deliveries remain idempotent.
- [ ] Review failed delivery logs and retry behavior.

### Production Activation

- [ ] Create a separate endpoint in the Clerk Production instance using the
      stable production URL.
- [ ] Subscribe to `user.created`, `user.updated`, and `user.deleted`.
- [ ] Store the production endpoint's signing secret in the Vercel Production
      environment.
- [ ] Redeploy production so the new environment variable is active.
- [ ] Send and verify example deliveries for all three events.
- [ ] Audit existing Clerk and Neon users before launch; reconcile missing or
      stale identities because webhooks only guarantee future event delivery.
- [ ] Perform one controlled production lifecycle test with a disposable user.
- [ ] Confirm webhook failures are visible in operational monitoring.
- [ ] Record the endpoint owner, activation date, test evidence, and rotation
      procedure in Completed Evidence.

## Storage and Media

- [ ] Provision the production Vercel Blob store and token.
- [ ] Verify upload, read, and delete flows against production-equivalent Blob
      storage.
- [ ] Confirm file type, file size, count, and ownership limits are enforced.
- [ ] Confirm deleted portfolio records and Blob objects follow the intended
      retention policy.
- [ ] Verify media URLs, image optimization, and fallbacks on desktop and mobile.
- [ ] Confirm local upload directories cannot be used in production.

## Product and Quality

- [ ] Complete production-critical Terms of Service and Privacy Policy pages.
- [ ] Ensure consent, deletion, retention, and contact language match actual app
      behavior.
- [ ] Complete critical end-to-end tests for salon and braider workflows.
- [ ] Test empty, loading, error, unauthorized, and stale-data states.
- [ ] Verify responsive behavior on supported mobile and desktop viewports.
- [ ] Complete keyboard, focus, form-label, contrast, and screen-reader checks.
- [ ] Verify notification counts, deep links, read state, and preferences.
- [ ] Verify messaging participant authorization and unread-state behavior.
- [ ] Verify application status transitions and rating eligibility rules.
- [ ] Run a production smoke test without development/demo fallbacks.

## Security and Operations

- [ ] Complete dependency and vulnerability review.
- [ ] Review server logs to ensure secrets and sensitive payloads are not logged.
- [ ] Add rate limiting or abuse controls to sensitive public and write routes.
- [ ] Configure runtime error monitoring and alert ownership.
- [ ] Configure availability monitoring for the production site and critical APIs.
- [ ] Define log retention and access controls.
- [ ] Document incident response, rollback, database recovery, and secret
      rotation procedures.
- [ ] Confirm webhook, database, Clerk, and Blob failure modes degrade safely.
- [ ] Define launch-day monitoring coverage and escalation contacts.

## Release-Candidate Verification

- [ ] Production build passes from the release commit.
- [ ] TypeScript passes with no errors.
- [ ] Full ESLint passes with no errors.
- [ ] All migrations are committed, reviewed, and applied.
- [ ] All P0 launch gates are complete.
- [ ] Staging acceptance test is signed off.
- [ ] Production environment variables are reviewed by two people where possible.
- [ ] Rollback target and database recovery point are recorded.
- [ ] Final production smoke test passes.

## Launch Sign-Off

| Area | Owner | Status | Evidence / Date |
|---|---|---|---|
| Product | TBD | Pending | |
| Engineering | TBD | Pending | |
| Database | TBD | Pending | |
| Authentication | TBD | Pending | |
| Security / Privacy | TBD | Pending | |
| Operations | TBD | Pending | |

## Completed Evidence

Add dated entries here as production gates are verified.

- **July 18, 2026:** Clerk webhook handler, onboarding race protection, identity
  lifecycle schema, and migration `0009_striped_black_knight.sql` were
  implemented. TypeScript, focused lint, and production build passed locally.
  External Clerk endpoint activation remains deferred.

