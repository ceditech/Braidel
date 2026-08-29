# Braidel — Project Tracker

> Live implementation status across the Braidel build.
> The interactive version lives in the dashboard at `/tracker`, driven by
> [`src/lib/roadmap.ts`](../src/lib/roadmap.ts). This markdown is a point-in-time
> snapshot — regenerate it when the roadmap changes.

**Overall: ~91% complete** · Legend: ✅ Done · 🔄 In progress · ⬜ Pending · ⛔ Blocked

> All work follows the [SCALES Framework](../SCALES_FRAMEWORK.md) — surgical,
> clean, architecture-aligned, low-regression, expandable, stepwise.
>
> Numbers below are computed from `overallCounts()`/`phaseProgress()` in
> [`src/lib/roadmap.ts`](../src/lib/roadmap.ts), not hand-counted — the phase
> field can be a single number or an array, so always regenerate via that
> logic rather than grepping the file.

### Progress by phase

| Phase | Focus | Done | In progress | % |
|-------|-------|------|--------------|---|
| **Phase 1** | Workforce & Staffing | 64 / 69 | 0 | ~93% |
| **Phase 2** | Client Booking | 21 / 21 | 0 | 100% |
| **Phase 3** | Online Payments | 6 / 7 | 1 | ~93% |
| **Phase 4** | Reputation & Verification | 11 / 18 | 7 | ~81% |
| **Phase 5** | Braidel Academy | 0 / 1 | 0% |
| **Phase 6** | Braidel Supply | 0 / 1 | 0% |
| **Phase 7** | Salon Franchise | 0 / 1 | 0% |

_Phases 3–7 are now represented as strategic workstreams. Each must be
decomposed into implementation-sized tasks before coding begins._

---

## Infrastructure
_Framework, hosting, tooling_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Next.js 16 app (TS, Tailwind v4, App Router, src/) | High | 1 |
| ✅ | Neon (Postgres) connected & migrated | High | 1 |
| ✅ | Clerk auth + route protection (proxy.ts) | High | 1 |
| ✅ | Drizzle ORM + migration scripts | High | 1 |
| ✅ | Environment config (.env.local) | High | 1 |
| ⬜ | CI / deployment pipeline | Medium | 1 |

## Database Schema
_Tables & relations in Neon_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | users table | High | 1 |
| ✅ | salons table | High | 1 |
| ✅ | braiders table | High | 1 |
| ✅ | opportunities table | High | 1 |
| ✅ | applications table | High | 1 |
| ✅ | braid_styles table | High | 1 |
| ✅ | messages table | High | 1 |
| ✅ | ratings table | High | 1 |
| ✅ | portfolio_media table | High | 1 |
| ✅ | notifications table | High | 1 |
| ✅ | notification_preferences table | Medium | 1 |
| ✅ | client_profiles table | High | 2 |
| ✅ | service_providers table | High | 2 |
| ✅ | service_offerings table | High | 2 |
| ✅ | availability_rules table | High | 2 |
| ✅ | availability_exceptions table | High | 2 |
| ✅ | bookings table | High | 2 |
| ✅ | booking_status_history table | High | 2 |
| ✅ | rating_history table | High | 2 |
| ✅ | provider_payment_accounts table | High | 3 |
| ✅ | booking_payments table | High | 3 |
| ✅ | payment_ledger_entries table | High | 3 |
| ✅ | payment_webhook_events table | High | 3 |

## Design System
_Tokens & UI primitives_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Design tokens (color, type, spacing, motion) | High | 1 |
| ✅ | braid.el wordmark + rose/ink brand system | High | 1 |
| ✅ | Persistent light/dark theme across shared app chrome | High | 1 |
| ✅ | Brand fonts (Bricolage / Hanken / JetBrains) | High | 1 |
| ✅ | Button, Card, Badge, Tag components | High | 1 |
| ✅ | Avatar, Rating, StatCard, Logo components | High | 1 |
| ✅ | Form inputs (Input, Select, Switch, Checkbox, Textarea) | High | 1 |
| ✅ | Tabs component | Medium | 1 |
| ✅ | Alert, Modal components | Medium | 1 |

## Marketing Site
_Public-facing pages_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Navbar (auth-aware) | High | 1 |
| ✅ | Footer | High | 1 |
| ✅ | Editorial braid.el landing page | High | 1 |
| ✅ | Marketplace landing preserved at `/marketplace` | High | 1 |
| ✅ | Find Braiders page | High | 2 |
| ✅ | Find Salons page | High | 2 |
| ✅ | Salon detail page | High | 2 |
| ✅ | Job Opportunities page | High | 1 |
| ✅ | Job Opportunity detail page | High | 1 |
| ✅ | Braider profile page | High | 2 |
| ⬜ | Pricing page | Medium | 1 |
| ⬜ | How It Works page | Low | 1 |
| ⬜ | About / Contact / Blog / FAQ | Low | 1 |
| ⬜ | Terms & Privacy pages | Low | 1 |

## Auth & Onboarding
_Account creation & role setup_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Sign-in page (Clerk) | High | 1 |
| ✅ | Sign-up page (Clerk) | High | 1 |
| ✅ | Onboarding role selection | High | 1 |
| ✅ | Onboarding API (writes user to Neon) | High | 1 |
| ✅ | Clerk webhook → user sync | Medium | 1 |

## Salon Dashboard
_Salon owner workflows_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | App shell (Sidebar + Topbar) | High | 1 |
| ✅ | Salon dashboard home | High | 1 |
| ✅ | Opportunities list | High | 1 |
| ✅ | Post Opportunity form | High | 1 |
| ✅ | Manage Applicants screen | High | 1 |
| ✅ | Applicant profile + portfolio drawer | High | 1 |
| ✅ | Appointments calendar + booking setup | High | 2 |

## Braider Dashboard
_Braider workflows_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Demo role switch (salon / braider) | High | 1 |
| ✅ | Braider dashboard home | High | 1 |
| ✅ | Find Work (search + apply) | High | 1 |
| ✅ | Applications tracker | High | 1 |
| ✅ | Profile editor + portfolio upload | High | 1 |
| ✅ | Appointments calendar + booking setup | High | 2 |

## Shared App
_Cross-role features_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Messaging (DB-backed list + thread) | High | 1 |
| ✅ | Notifications page | Medium | 1 |
| ✅ | Settings page (role-aware) | Medium | 1 |
| ✅ | Client booking discovery + appointment management | High | 2 |
| ✅ | Booking review visibility, update notifications, and audit history | High | 2 |
| ✅ | Payment system design insight page | Medium | 3 |

## Backend / API
_Data routes & business logic_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Schema extensions + migrations | High | 1 |
| ✅ | DB seed script (`npm run db:seed`) | High | 1 |
| ✅ | DB query layer (reads) | High | 1 |
| ✅ | Wire Find Braiders to DB | High | 1 |
| ✅ | Wire Find Salons to DB | High | 1 |
| ✅ | Wire Job Opportunities to DB | High | 1 |
| ✅ | Wire dashboards to DB | High | 1 |
| ✅ | Application read/create/status flows | High | 1 |
| ✅ | Profile + settings DB persistence | High | 1 |
| ✅ | Messaging DB persistence | High | 1 |
| ✅ | Ratings read/write flows | High | 1 |
| ✅ | Portfolio media persistence | High | 1 |
| ✅ | Notifications persistence + event wiring | High | 1 |
| ✅ | Availability engine + transactional booking lifecycle APIs | High | 2 |
| ✅ | Review audit history + update notification wiring | High | 2 |
| ✅ | Payment foundation schema + fee split helpers | High | 3 |
| 🔄 | Marketplace admin decision APIs + explicit account/profile lifecycle controls | High | 4 |
| 🔄 | Admin "preview as" mode (Salon/Braider/Client) for UI review and QA | Medium | 4 |
| 🔄 | Admin dashboard insight charts (donut/bar/line) | Medium | 4 |

## Strategic Implementation Workstreams
_Core gaps and next product phases, ordered for low-regression delivery_

| # | Status | Workstream | Priority | Phase |
|---|--------|------------|----------|-------|
| 1 | ✅ | Real role state + client account foundation | High | 1 |
| 2 | ✅ | Booking domain schema + migrations | High | 2 |
| 3 | ✅ | Booking APIs + appointments/calendar UI | High | 2 |
| 4 | ✅ | Booking-aware conversations, reviews + notifications | High | 2 |
| 5 | 🔄 | Payments + monetization | High | 3 |
| 6 | 🔄 | Trust, verification + marketplace administration | High | 4 |
| 7 | ⬜ | Ecosystem expansion: Academy, Supply, Franchise + mobile | Medium | 5–7 |

### Workstream scope

1. **Real role state + client account foundation** — completed with a
   server-owned single-role contract, explicit onboarding completion,
   role-compatible server redirects, and Client dashboard/settings foundations.
2. **Booking domain schema + migrations** — completed in migration `0011` with
   client and provider booking identities, service offerings, recurring
   availability and exceptions, timezone-aware bookings, integer-cent service
   and booking snapshots, status history, lifecycle constraints, indexes, and
   existing-profile backfills.
3. **Booking APIs + appointments/calendar UI** — completed with provider
   services, timezone, capacity, recurring schedules and exceptions, DST-safe
   availability, idempotent transactional booking requests, lifecycle actions,
   and role-aware calendar, agenda, discovery, and setup views.
4. **Booking-aware conversations, reviews + notifications** — completed in
   migrations `0013` and `0014` with booking-scoped messages and reviews,
   booking lifecycle notifications, client appointment conversations, direct
   appointment message links, completed-booking provider reviews, provider
   review visibility, update notifications, and review audit history.
5. **Payments + monetization** — foundation slice QA passed with payment
   accounts, booking payments, ledger entries, webhook idempotency schema,
   server-side fee split helpers, payment architecture documentation, and an
   internal Payment System Design insight page.
   Client-to-Provider booking payments are the primary Stripe Connect launch
   track. Salon-to-Braider agreement capture is required later, while in-app
   money movement is deferred until policy and operations mature. Workstream 5
   remains in progress until live Stripe checkout, Connect onboarding, webhooks,
   refunds, disputes, and payouts are intentionally implemented.
6. **Trust, verification + marketplace administration** — started with a
   provider-only reviews dashboard at `/dashboard/reviews`, scoped to completed
   booking reviews, provider-owned appointment links, rating distribution, and
   append-only review history. Slice 6.2 implementation now adds provider
   response publishing/edit history and provider report intake, with manual QA
   passed August 1, 2026. Slice 6.3 verification evidence foundation now adds
   provider verification profiles, evidence metadata/reference records, status
   history, provider-only `/dashboard/verification`, and protected evidence
  submission APIs; manual QA passed August 9, 2026. Slice 6.4 admin/moderation
  surface is implemented with the admin portal expanded to include live KPI
  dashboard metrics, explicit account suspension versus provider profile
  unlisting controls, money/earning visibility, the User STABLE framework, and
  the original moderation queues. Migration
  `0021_reflective_princess_powerful.sql` adds `users.account_status` and
  `service_providers.visibility` so suspension blocks protected access while
  unlisting only hides public discovery/bookability. Development migrations are
  applied. Deferred hardening is logged to replace provider-row inference with
  an explicit provider-role/domain helper if provider modeling expands beyond
  Salon owners and Braiders. Admin access now also requires a Neon `users.role`
  of `admin` in addition to an allowlisted `BRAIDEL_ADMIN_EMAILS` entry, and a
  new **Promote admin** action lets an existing admin grant that role to
  another allowlisted user. The Performance tab now also includes SVG donut,
  bar, and line charts (user composition, booking lifecycle, provider
  verification, and a 14-day bookings-created trend) built as dependency-free
  primitives in `src/components/ui/`, alongside — not replacing — the existing
  numeric grids. The user-composition and booking-lifecycle categories are
  fully data-driven — `getAdminUserRoleDistribution()`/
  `getAdminBookingStatusDistribution()` GROUP BY `users.role`/`bookings.status`
  live in Neon, so a future enum value appears automatically rather than
  needing a chart code change (Provider verification stays a fixed 4-metric
  bar, since it's inherently a 2-type structure, not an enum list). All three
  charts show an animated tooltip on hover and animate in on mount (donut
  sweep, bar grow, line reveal). Allowlisted admins can additionally toggle a
  **Preview as**
  Salon/Braider/Client mode via a new `/api/admin/preview` cookie route, purely
  for UI review/QA; it never exposes another user's data since queries stay
  scoped to the admin's own (empty) records. Manual QA is pending for both.
  Slice 6.5 trust signals in marketplace discovery is implemented: real
  booking-verified reviews and a completed-booking count replace previously
  hardcoded review/response-time copy on the public braider/salon profile
  pages, and verified-status claims are now gated on the real `isVerified`
  flag. Manual QA pending.
  Slice 6.6 capped Client review reminders is implemented and **QA-passed**
  (August 29, 2026) — see the dated entry below for what was found and fixed
  during that live session. Planning record:
   [`docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md`](WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md).
7. **Ecosystem expansion** — scope Academy, Supply, Franchise, and later native
   mobile clients before implementing those phases.

---

### How to update
1. Edit the item's `status` in [`src/lib/roadmap.ts`](../src/lib/roadmap.ts).
2. The `/tracker` dashboard page updates automatically.
3. Regenerate this markdown to keep the docs snapshot in sync.

### Latest QA evidence

- **July 31, 2026:** Workstream 4 manual QA passed across the six-step
  booking review hardening flow: Client review edit, Provider review-update
  notification, Provider drawer review visibility, Client drawer review history,
  shared audit history visibility, and application messaging/review regression
  checks.
- **July 31, 2026:** Workstream 5 payment foundation started with additive
  Drizzle schema/migration `0015_cheerful_daredevil.sql`, payment-domain fee
  split helpers, and verified dev Neon tables for provider payment accounts,
  booking payments, payment ledger entries, and payment webhook events.
  TypeScript and focused ESLint passed locally. No Stripe checkout, Connect
  onboarding, live payment capture, refunds, or payouts are active yet.
- **July 31, 2026:** Workstream 5 payment architecture documentation and SVG
  diagram were added. Client-to-Provider booking payments remain the primary
  Stripe Connect launch track. Salon-to-Braider payment movement is deferred,
  but agreement/payment-status capture is documented as a required future
  product surface.
- **July 31, 2026:** Added the protected `/payment-system-design` Insights
  page to render the payment architecture SVG and summarize launch boundaries,
  data model tables, QA scope, and Stripe activation gates for the team and
  stakeholders.
- **July 31, 2026:** Workstream 5 foundation manual QA passed: the payment
  design page loads for authenticated roles, all four payment tables exist in
  Neon, no live payment/checkout/Connect/refund/payout surface is exposed, and
  booking request, booking confirmation, booking messages, and notifications
  still work. Live Stripe-flow QA remains deferred until those flows are
  intentionally implemented.
- **July 31, 2026:** Workstream 6 planning added in
  [`docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md`](WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md).
- **July 31, 2026:** Workstream 6 implementation started with a guarded
  provider Reviews dashboard at `/dashboard/reviews`. Salon owners and Braiders
  now have a first-class view of completed-booking reviews, average rating,
  rating distribution, latest review cards, booking deep links, and audit
  history.
- **August 1, 2026:** Workstream 6.1 manual QA passed. Verified Salon owner
  access, Braider access, Client redirect protection, provider-scoped review
  data, review detail drawer content, booking deep links, and desktop/mobile
  light/dark responsiveness.
- **August 1, 2026:** Workstream 6.2 implementation and manual QA passed.
  Migration
  `0016_absurd_slyde.sql` adds provider review responses, response history, and
  review reports. The provider Reviews drawer now supports public response
  create/update with Client notifications, response audit history, and one
  provider report per review. Appointment drawers also show provider responses
  beside the related review. The migration was applied to the configured
  development Neon database. Manual QA covered response create/update, Client
  notifications, appointment drawer response visibility, response history,
  report intake, report status locking, and role-compatible access smoke checks.
- **August 1, 2026:** Workstream 6.3 verification evidence foundation
  implementation added migration `0017_flat_leopardon.sql`, provider
  verification profiles, evidence records, append-only verification status
  history, provider-only `/dashboard/verification`, protected evidence
  submission and submit-for-review APIs, and a self-notification when a provider
  submits for review. The migration was applied to the configured development
  Neon database. Manual QA remains pending before marking this slice complete.
- **August 8, 2026:** Workstream 6.3 QA follow-up tightened verification
  evidence readiness. Required evidence now needs either a reviewer-accessible
  reference link or at least 40 characters of proof details; title-only records
  do not count toward checklist or submit readiness. The provider Verification
  UI now includes tooltips for acceptable public links, business/state registry
  pages, secure upload links, portfolio references, and private/offline fallback
  proof notes.
- **August 9, 2026:** Workstream 6.3 manual QA passed after proof-quality
  validation. Workstream 6.4 admin/moderation implementation started with
  migration `0018_spooky_tattoo.sql`, allowlist-gated `/dashboard/admin`,
  verification decision APIs, review report decision APIs,
  `marketplace_admin_actions`, provider notifications, and verified-flag
  updates. Migration `0018_spooky_tattoo.sql` was applied to the configured
  development Neon database. Manual QA remains pending before marking 6.4
  complete.
- **August 9, 2026:** Admin access hardening added migration
  `0019_curved_silver_centurion.sql` for the internal `admin` user role, plus
  `/admin/sign-up`, `/admin/sign-in`, `/admin/setup`, and
  `/api/admin/onboarding`. Allowlisted admins can activate internal access
  without selecting a marketplace onboarding role or creating Salon/Braider/
  Client profile records.
- **August 9, 2026:** Admin portal expansion added migration
  `0020_grey_turbo.sql`, extending `marketplace_admin_actions` to audit
  `user_account` lifecycle changes. `/dashboard/admin` now includes Performance,
  Users, Money, and Moderation tabs with Neon-backed KPIs, safe user profile
  editing, booking commission visibility, upcoming affiliate/subscription lanes,
  and a User STABLE governance panel. Migration
  `0021_reflective_princess_powerful.sql` later split lifecycle moderation into
  explicit account suspension/restoration and provider profile
  unlisting/relisting.
- **August 26, 2026:** Logged a deferred Workstream 6 admin hardening item:
  profile visibility actions currently infer provider eligibility from the
  existence of a provider profile row. This is correct for the current
  Salon-owner/Braider model, but should become an explicit provider-role/domain
  helper if Braidel adds new provider types or changes provider identity rules.
- **August 26, 2026:** Tightened `isMarketplaceAdmin` to require both an
  allowlisted `BRAIDEL_ADMIN_EMAILS` entry and a Neon `users.role` of `admin`,
  closing a path where a regular onboarding could have granted admin access on
  email match alone. Added a **Promote admin** action so an existing admin can
  grant the `admin` role to another user, gated on that user's email already
  being allowlisted.
- **August 26, 2026:** Fixed a sidebar regression (pre-dating this admin work)
  where "Admin Review" appeared twice and Project Tracker/Market Study/Payment
  System Design were visible to every authenticated user, not admins only.
  Added `requireMarketplaceAdmin()` to all three pages (splitting
  `tracker/page.tsx` into a server wrapper + `TrackerClient.tsx` since it was a
  full client component) so non-admins are redirected server-side, not just
  hidden from the nav.
- **August 26, 2026:** Added an admin **"Preview as"** mode (Salon/Braider/
  Client) for UI review and QA. `POST /api/admin/preview` sets an httpOnly
  cookie after re-checking admin status server-side; `requireDashboardRole`
  and `dashboard/page.tsx` honor it via a new `getEffectiveDashboardRole`
  helper. Scoped deliberately narrow: previewing never grants access to
  another user's data, since every query still resolves against the admin's
  own `clerkId` (which owns no salon/braider profile, so the preview renders
  each role's genuine empty-state shell).
- **August 26, 2026:** Added SVG donut/bar/line chart primitives
  (`DonutChart`, `BarChart`, `TrendLineChart` in `src/components/ui/`) and
  wired them into the admin Performance tab for user composition, booking
  lifecycle, provider verification, and a 14-day bookings-created trend. The
  trend query (`getAdminBookingTrend`) is new and isolated in its own
  try/catch so a query failure degrades to an empty chart instead of failing
  the admin dashboard fetch; verified directly against dev Neon via
  `scripts/verify-booking-trend.ts` before wiring it in. Existing numeric
  grids were left in place — charts are additive, not a replacement.
- **August 27, 2026:** Workstream 6.5 (trust signals in marketplace discovery)
  implemented. `/find-braiders/[id]` and `/find-salons/[id]` previously showed
  hardcoded fake reviews and an unconditional "Identity verified"/"Verified
  business" claim on every profile regardless of actual verification status —
  a direct violation of the plan's own honesty rule. Both are now fixed:
  `getPublicProviderReviews()` and `getCompletedBookingCount()` (additive,
  `src/db/queries.ts`) surface real booking-verified reviews (reviewer shown
  as first name + last initial only, no email) and a real completed-booking
  count, reusing the existing `ratings` and `providerReviewResponses` tables —
  no schema change. The verified-claim line now only renders when the
  provider's real `isVerified` flag is true; fabricated "Replies in ~1 hr" /
  "Responds quickly" copy was removed since no data backs it. `tsc`/lint
  clean; manually spot-checked against dev Neon (verified vs. unverified
  braider, salon with no reviews yet). Manual QA pending.
- **August 27, 2026:** Follow-up fix to Slice 6.5: the public rating badge
  (`braiders.ratingAvg`/`ratingCount`, `salons.ratingAvg`/`ratingCount`) was
  found to be a write-once seed literal never recomputed from real reviews —
  a live staleness bug, not just a seed-data inconsistency. `getBraiders()`/
  `getBraiderBySlug()`/`getSalons()`/`getSalonBySlug()` now join a live
  `GROUP BY` aggregate over booking-scoped `ratings` instead of reading the
  frozen columns. `db/seed.ts` now seeds real completed bookings + ratings
  rows (`seedCompletedBookingReviews()`) so dev data is honest instead of
  fabricated, and the seed cleanup query was fixed to explicitly delete seed
  bookings before the cascading user delete (`bookings.provider_id` is
  `ON DELETE RESTRICT`, so re-running the seed script would otherwise break
  once any bookings exist — verified re-runnable with two consecutive
  `npm run db:seed` runs). The salon "manage applicants" query still reads
  the legacy stored columns — intentionally left out of scope, logged as a
  follow-up. `tsc`/`eslint` clean; verified live against dev Neon, including a
  real (non-seed) account with genuine reviews from earlier manual testing.
  Manual QA pending.
- **August 27, 2026:** Two more Slice 6.5 signals added. Portfolio-photo-count
  is braider-profile-only — `portfolio_media` has no `salonId` column, so a
  salon equivalent would be a fabricated signal, not a real one. Response-rate
  ("Responds to X% of reviews") is computed by a new
  `getProviderResponseRate()` over the *full* review set (not the
  display-limited review list, so it stays correct once a provider has more
  than 10 reviews), and is shown on both profile pages only when the rate is
  above 0% — no public dispute/report status is ever surfaced, per an explicit
  product decision. Verified live by temporarily inserting one real
  `provider_review_responses` row, confirming the profile correctly rendered
  "Responds to 20% of reviews" (1 of 5), then deleting the test row. `tsc`/
  `eslint` clean. Manual QA pending.
- **August 29, 2026:** Workstream 6 complete — capped Client review reminders
  (Slice 6.6) implemented. A new `review_reminder_events` table (migration
  `0022_messy_red_hulk.sql`) is the append-only, idempotent audit trail: a
  unique `(booking_id, reminder_number)` constraint means re-evaluating a
  booking can never send the same numbered reminder twice. This app has no
  cron/scheduler, so `backfillDueReviewReminders()`
  (`src/lib/review-reminders.ts`) runs opportunistically inside
  `GET /api/notifications` — already polled by the notification bell on every
  dashboard navigation — for client-role users, sending at most one due
  reminder per booking per call so a client who hasn't opened the app in a
  while catches up gradually rather than getting a flooded backlog. Honors
  the existing "Account activity" notification preference toggle (no new
  schema needed). Isolated in try/catch so a reminder-logic failure can never
  break the notification bell. Verified against dev Neon: created a
  completed, unreviewed booking 2 days old, confirmed reminder #1 (the 24h
  tier) fires with correct copy, confirmed a second call is a no-op
  (idempotent), then cleaned up the test data. Fixed a copy bug caught during
  verification — the notification body previously appended a hardcoded
  "appointment" suffix, duplicating the word for braider service names that
  already end in "appointment" (e.g. "Knotless appointment appointment").
  `tsc`/`eslint` clean. Manual QA pending.
- **August 29, 2026:** Live manual QA session with the project owner covering
  Slice 6.5 (trust signals) and Slice 6.6 (review reminders), plus the live
  rating aggregation fix. Confirmed visually: verified/unverified braiders and
  salons correctly show/hide "Identity verified"/"Verified business"; real
  reviews render with honest empty states; completed-booking and
  portfolio-photo counts show only when > 0; the seed script re-runs cleanly.
  For review reminders specifically, testing live surfaced and fixed two real
  issues: (1) the notifications page's own server render didn't run the
  backfill, so a due reminder showed in the bell's unread count but not in
  the visible list until a reload — fixed by also calling
  `backfillDueReviewReminders()` from `dashboard/notifications/page.tsx`, not
  just the API route; (2) with two opportunistic call sites now firing on one
  visit, a booking with a multi-tier backlog (e.g. 4 days overdue, both the
  24h and 3-day tiers due) could have two tiers advanced in a single visit
  instead of one. Fixed with a 1-hour minimum gap between reminders for the
  *same booking* (`MIN_GAP_BETWEEN_REMINDERS_MS`) — deliberately scoped
  per-booking rather than per-user-per-day so a client with two separate
  unreviewed bookings still gets each its own legitimate reminder; this floor
  becomes a no-op once a real cron replaces the opportunistic call sites
  (cron runs are naturally ~24h apart), so no rework is needed at that
  transition. Both fixes re-verified end to end: created a 4-day-overdue
  unreviewed booking, confirmed only one reminder fires across both hook
  points in one visit, added a review, confirmed reminders stop immediately.
  All QA test data and scratch verification scripts were cleaned up. `tsc`/
  `eslint` clean throughout. Slice 6.6 (capped Client review reminders) is now
  QA-passed; Slices 6.4 and 6.5 still await their own manual QA pass.
- **August 29, 2026:** Live manual QA of the admin surface (Performance,
  Users, Money, Moderation tabs, and "Preview as" mode) with the project
  owner. Confirmed working: real KPIs, donut/bar/line charts render real data
  (verified via DOM inspection after the Browser-pane screenshot tool itself
  started failing to capture pixels mid-session — a tool-side issue, not an
  app bug, confirmed by cross-checking `elementFromPoint` and page text at
  the same scroll position), a live unlist → relist round-trip on a seed
  salon correctly hid/restored it from `/find-salons`, and the verification
  queue renders real submitted evidence. Found a real, pre-existing privacy
  bug while checking "Preview as": the admin's braider preview showed a
  populated "Your applications" list and other users' real application data,
  directly contradicting that feature's own documented guarantee ("preview
  never exposes another user's data"). Root cause was much broader than
  preview mode — an `includeDemoRows()` helper (`NODE_ENV !== "production"`)
  in `src/db/queries.ts` merged in, or in two messaging queries stopped
  filtering to, every other user's real applications, applicants, and
  message conversations across 5 call sites, in **any** non-production
  environment. Fixed by removing `includeDemoRows()`/`uniqueById()` entirely,
  deleting the two now-dead unscoped exports (`getApplications()`,
  `getApplicants()`) that had no other callers, and changing two related
  "no owner row found" fallbacks to return an empty array instead of all
  rows. `getOpportunities()` (public job listings — intentionally public)
  was left alone. Re-verified live: admin preview now shows a genuine empty
  state, the public `/opportunities` marketplace is unaffected, and a real
  signed-in test user's own dashboard/messages still render correctly.
  `tsc`/`eslint` clean. Verification-queue approve/reject actions were not
  exercised since they belonged to the project owner's own real accounts.
- **August 26, 2026:** Made the user-composition and booking-lifecycle chart
  categories fully data-driven. Added `getAdminUserRoleDistribution()` and
  `getAdminBookingStatusDistribution()` — live `GROUP BY` queries over
  `users.role`/`bookings.status` — so any category that actually exists in
  the data appears on the chart automatically (a curated label/color for
  known values, a title-cased fallback + rotating palette color otherwise).
  Verified against dev Neon via `scripts/verify-admin-distributions.ts`
  before wiring in. Also added an animated, elegantly styled tooltip to each
  chart on hover, and a mount-in micro-animation (donut arcs sweep in
  staggered, bars grow from 0, the line reveals left-to-right via an
  animated `clipPath`) — all plain CSS/inline-style transitions, no new
  dependency, consistent with the codebase's existing dependency-free SVG
  approach. The "Provider verification" bar and all existing `LifecycleGrid`
  numeric displays were left unchanged.
