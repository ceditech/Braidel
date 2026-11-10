# Braidel — Project Tracker

> Live implementation status across the Braidel build.
> The interactive version lives in the dashboard at `/tracker`, driven by
> [`src/lib/roadmap.ts`](../src/lib/roadmap.ts). This markdown is a point-in-time
> snapshot — regenerate it when the roadmap changes.

**Overall: ~88% complete** (124 done · 4 in progress · 15 pending of 143) · Legend: ✅ Done · 🔄 In progress · ⬜ Pending · ⛔ Blocked

> All work follows the [STABLE Framework](../STABLE_FRAMEWORK.md) — surgical &
> SOLID, testable & traceable, architecture-aligned & available, balanced for
> bottlenecks, low-regression & loosely coupled, expandable & elastic. The
> earlier [SCALES Framework](../SCALES_FRAMEWORK.md) remains in force as the
> Braidel-specific guardrails.
>
> _Last synced with `src/lib/roadmap.ts`: November 9, 2026._
>
> Numbers below are computed from `overallCounts()`/`phaseProgress()` in
> [`src/lib/roadmap.ts`](../src/lib/roadmap.ts), not hand-counted — the phase
> field can be a single number or an array, so always regenerate via that
> logic rather than grepping the file.

### Progress by phase

| Phase | Focus | Done | In progress | % |
|-------|-------|------|--------------|---|
| **Phase 1** | Workforce & Staffing | 77 / 88 | 1 | ~88% |
| **Phase 2** | Client Booking | 21 / 21 | 0 | 100% |
| **Phase 3** | Online Payments | 6 / 7 | 1 | ~93% |
| **Phase 4** | Reputation & Verification | 20 / 26 | 2 | ~81% |
| **Phase 5** | Braidel Academy | 0 / 1 | 0 | 0% |
| **Phase 6** | Braidel Supply | 0 / 1 | 0 | 0% |
| **Phase 7** | Salon Franchise | 0 / 1 | 0 | 0% |

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
| ✅ | Vercel git deployment (production braidel.com + preview per push) | High | 1 |
| ⬜ | CI checks (typecheck, lint, build, migration consistency) | High | 1 |

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
| ✅ | provider_review_responses table | High | 4 |
| ✅ | provider_review_response_history table | High | 4 |
| ✅ | review_reports table | High | 4 |
| ✅ | provider_verifications table | High | 4 |
| ✅ | verification_evidence table | High | 4 |
| ✅ | verification_status_history table | High | 4 |
| ✅ | marketplace_admin_actions table | High | 4 |
| ✅ | review_reminder_events table | Medium | 4 |
| ✅ | cms_pages table | Medium | 1 |
| ✅ | cms_sections table | Medium | 1 |

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
| ✅ | Marketplace landing preserved at /marketplace | High | 1 |
| ✅ | Find Braiders page | High | 2 |
| ✅ | Find Salons page | High | 2 |
| ✅ | Salon detail page | High | 2 |
| ✅ | Job Opportunities page | High | 1 |
| ✅ | Job Opportunity detail page | High | 1 |
| ✅ | Braider profile page | High | 2 |
| ✅ | Pricing page | Medium | 1 |
| ✅ | How It Works page | Low | 1 |
| ✅ | About / Contact / Blog / FAQ | Low | 1 |
| 🔄 | Terms & Privacy pages | High | 1 |
| ✅ | Marketing content CMS (admin editor, draft/publish) | Medium | 1 |

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
| ✅ | Verification evidence workspace | High | 4 |

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
| ✅ | Verification evidence workspace | High | 4 |

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
| ✅ | Provider reviews dashboard | High | 4 |
| ✅ | Provider review responses + report intake | High | 4 |
| ✅ | Verification evidence foundation | High | 4 |
| 🔄 | Admin and moderation surface | High | 4 |

## Backend / API
_Data routes & business logic_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Schema extensions + migrations | High | 1 |
| ✅ | DB seed script | High | 1 |
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
| ✅ | Provider review response/report APIs | High | 4 |
| ✅ | Provider verification evidence APIs | High | 4 |
| ✅ | Marketplace admin decision APIs + explicit account/profile lifecycle controls | High | 4 |
| ✅ | Admin "preview as" mode (Salon/Braider/Client) for UI review and QA | Medium | 4 |
| ✅ | Admin dashboard insight charts (donut/bar/line) | Medium | 4 |
| ✅ | Marketplace trust signals in discovery (Slice 6.5) | High | 4 |
| ✅ | Capped Client review reminders (Slice 6.6) | High | 4 |
| ✅ | Marketing content write API + published-content resolver | Medium | 1 |

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
6. **Trust, verification + marketplace administration** — slices 6.1–6.3
   and 6.5–6.6 are implemented and manual-QA passed; slice 6.4 is implemented
   and QA-passed except the verification and review-report approve/reject
   decision actions, which have not been exercised.
   - **6.1** provider reviews dashboard at `/dashboard/reviews` (QA August 1, 2026).
   - **6.2** provider review responses and report intake (migration `0016`, QA August 1).
   - **6.3** verification evidence foundation with proof-quality enforcement
     (migration `0017`, QA August 9).
   - **6.4** admin and moderation: allowlist plus `users.role = admin` gated
     `/dashboard/admin` (Performance, Users, Money, Moderation), audited actions
     in `marketplace_admin_actions`, account suspension kept separate from
     provider profile unlisting, Promote admin, "Preview as" mode, and
     data-driven charts (migrations `0018`–`0021`, QA August 29). The Users tab
     also carries an "Access model" governance panel labelled "User STABLE
     framework" — a product-level checklist, unrelated to the STABLE development
     framework in [`STABLE_FRAMEWORK.md`](../STABLE_FRAMEWORK.md).
   - **6.5** trust signals in discovery: booking-verified reviews, live rating
     aggregates, completed-booking and portfolio counts, response rate, and
     verified claims gated on the real `isVerified` flag (no schema change;
     visually confirmed in the August 29 live QA session).
   - **6.6** capped Client review reminders (migration `0022`; idempotent; QA August 29).

   Before the workstream can close: exercise the admin approve/reject decisions,
   define the sensitive-evidence file upload policy, design formal dispute
   resolution and appeals, add an explicit provider-role helper if provider types
   expand, move the applicant-listing queries off the legacy stored rating
   columns, and replace the opportunistic review-reminder trigger with a real
   scheduler. Planning record:
   [`docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md`](WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md).
7. **Ecosystem expansion** — scope Academy, Supply, Franchise, and later native
   mobile clients before implementing those phases.

## Production Readiness & Hardening
_Launch gates and operational risk, ordered by risk (from the November 9, 2026 audit)_

| Status | Task | Priority | Phase | Detail |
|--------|------|----------|-------|--------|
| ✅ | Isolate local development from the production database (Neon dev branch + script guards) | High | 1 | Neon project Braidel now has two branches: production and development (a copy-on-write fork created November 9, 2026). Local .env.local points at development and lists the production hostname in BRAIDEL_PRODUCTION_DB_HOSTS. src/db/safety.ts makes db:seed and verify:booking refuse production hosts (direct or pooled), refuse when the list is unset, and refuse in a production environment; npm run db:target reports the target and db:migrate prints it first. Verified: guard paths, db:migrate and verify:booking on development, and a canary write to development that was absent from production. |
| ✅ | Point Vercel Preview deployments at the development database | High | 1 | Done November 10, 2026: DATABASE_URL is now two Vercel variables, Production (Neon production branch) and Preview (Neon development branch), both Sensitive. Verified on the PR #14 preview: it showed a change made only in the development database while braidel.com did not. Preview still shares the Clerk development keys, which is handled by the Clerk production item. |
| ✅ | Give the development branch its own database password | High | 1 | A Neon branch inherits its parent's role passwords, so development initially shared production's neondb_owner password. Reset on November 9, 2026 (development branch only) and .env.local refreshed. Verified with a script that never prints credentials: the two passwords differ, the development password is rejected by the production host, and each credential works on its own host. |
| ⬜ | Rotate the production database password | Medium | 1 | The production connection string was printed once into a local assistant session transcript on November 9, 2026. Rotating it requires updating the Vercel Production DATABASE_URL and redeploying, so schedule it deliberately. |
| ✅ | Re-link existing accounts by verified email when the Clerk instance changes | High | 1 | src/lib/clerk-link-domain.ts decides link/insert/conflict; clerk-sync.ts relinkClerkIdentityByEmail attaches a new Clerk ID to the existing user row with the same VERIFIED email (never unverified or deleted rows), keeping role, onboarding and history. Used by the webhook sync, the first sign-in miss in requireOnboardedUser, and the onboarding route. Verified: npm run verify:clerk-link (6 rule cases) and a throwaway-row check on the development branch (conflict when unverified, link when verified with role preserved, idempotent repeat, unknown email unchanged). |
| ✅ | Clerk production instance + identity webhook | High | 1 | Done November 10, 2026. braidel.com now uses the Clerk production instance (DNS verified in GoDaddy, SSL issued, Google + email sign-in), Production and Preview have separate Clerk keys, and /api/webhooks/clerk is active with a Production-only signing secret. Verified: live key on the deployed page, admin sign-in with role preserved via the verified-email re-link, and a disposable-user lifecycle (created, updated, deleted all delivered; Neon row tombstoned). Open follow-ups: turn off the unused Username requirement, retire the old development Clerk app, audit leftover development-era accounts, and Vercel Hobby keeps runtime logs for one hour only. |
| ⬜ | Patch dependency vulnerabilities | High | 1 | npm audit --omit=dev (November 9, 2026): 11 advisories (1 critical, 9 high, 1 moderate). The critical one is next (installed 16.2.7; audit lists 16.4.6 as the non-major fix). The @vercel/blob chain (@vercel/oidc, @vercel/cli-config, zod) plus nanoid, undici, source-map-js, and sharp need triage. |
| ⬜ | Automated test suite (domain unit tests + smoke tests) | High | 1 | No test runner is installed; regression protection is manual QA plus three ad hoc scripts/verify-*.ts files. Start with unit tests for payments-domain, booking-availability, review-reminders, and the CMS sanitizer, then a small Playwright smoke suite for the public routes. |
| ⬜ | Error monitoring, uptime alerting, and rate limiting | High | 1 | None exist. Add runtime error monitoring and uptime checks, and rate-limit public and write routes (applications, messages, onboarding, portfolio upload). |
| ⬜ | Clear lint debt | Medium | 1 | npm run lint exits with 2 errors and 60 warnings. Both errors are in the Braidel Design System/ reference folder, which is not part of the app; exclude it from lint or fix it so CI can require a clean lint. |
| ⬜ | Admin toggle to show or hide seeded demo profiles on public pages | Medium | 4 | Seeded demo braiders and salons (clerk_id starting 'seed_') currently appear next to real profiles in public discovery. Decision (November 9, 2026): keep them as demo content for now, but give admins a switch to hide them (production-like checks) or display them (testing). Needs a small persisted settings store and a filter in the public discovery queries; do not purge production seed data until this exists. |

## Known Issues Backlog
_Defects reported in manual QA (screenshots in docs/Issues/); none scheduled yet_

| Status | Task | Priority | Phase | Detail |
|--------|------|----------|-------|--------|
| ⬜ | Portfolio image upload fails in production | High | 1 | Reported August 26, 2026 on braidel.com. Cause confirmed November 9, 2026: BLOB_READ_WRITE_TOKEN is not set in any Vercel environment, so src/lib/portfolio-storage.ts throws 'Portfolio storage is not configured' in production. Create a Vercel Blob store and connect it to the project. |
| ⬜ | Braider Settings: profile fields and specialties not persisting; no profile photo upload | High | 1 | Reported August 26, 2026 (screenshots); not re-verified since. The photo control is a disabled 'Photo upload later' button (SettingsClient.tsx). |
| ⬜ | Find Work: 'Apply now' never becomes 'Already applied' | Medium | 1 | Reported August 26, 2026. FindWorkClient.tsx only has 'Applying...' and 'Apply now' states; after applying, the button should switch to a disabled 'Already applied'. |
| ⬜ | Salon profile About cards and 'Vetted braiders' claim are hardcoded | High | 4 | SalonDetailClient.tsx hardcodes Established 2018, Team 8 braiders, Stations 6, and Amenities for every salon, plus an unconditional 'Vetted braiders' line. These must come from the owner's profile, or be hidden when empty. |
| ⬜ | Public pages show fabricated figures and sample data | High | 4 | /marketplace shows hardcoded '12k+ braiders / 3.4k salons / 4.9' stats and braiders from sampleData; FindBraidersClient.tsx uses TOTAL_POOL = 12480 as a headline count. The database holds a few dozen users. Replace with real counts or remove, per the project's own honesty rule. |
| ⬜ | Admin Users: profile form shows stale data when another user is selected | Medium | 4 | Reported August 28, 2026: selecting a different user leaves the previous user's name and admin note in the form. |
| ⬜ | Salon Opportunities: no empty state | Low | 1 | Reported August 30, 2026: with no opportunities the page is blank. It should show a friendly empty state with a Post opportunity button. |

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
  and an "Access model" governance panel (labelled "User STABLE framework" in
  the UI; unrelated to the STABLE development framework). Migration
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
  QA-passed. (Superseded by the later August 29 entries below: the admin
  surface was QA'd the same day, and the Slice 6.5 trust signals were visually
  confirmed in this same session.)
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
- **August 29, 2026:** Completed live manual QA of the remaining admin
  lifecycle actions: Suspend account → confirmed status flips to `suspended`
  and reverses cleanly via Restore access; Promote admin → confirmed an
  allowlisted user's role flips to `admin`. Combined with the Unlist/Relist
  and chart verification done earlier the same day, this closes out manual
  QA for **Marketplace admin decision APIs**, **Admin "preview as" mode**,
  and **Admin dashboard insight charts** — all three flipped to done. The
  broader **Admin and moderation surface** item stays in progress: the
  verification/review-report *decision* actions themselves (approve/reject)
  were not exercised, since the only pending items in dev belong to the
  project owner's own real accounts — deferred until they opt in.
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
- **August 28, 2026** (merged and deployed August 30 via PR #11): Marketing pages shipped: `/pricing`,
  `/how-it-works`, `/about`, `/contact`, `/blog`, `/faq`, `/terms`, `/privacy`,
  with copy in typed files under `src/content/marketing/`. `/pricing` is live but
  intentionally unlinked until pricing is decided; Terms and Privacy carry marked
  draft copy; Contact is static info; Blog is a "coming soon" placeholder.
  Footer links for About, Contact, Blog, How it works, FAQ, Terms, and Privacy
  now resolve (previously 404). Verified in development at desktop and mobile
  widths, light and dark, and the pages were spot-checked on production.
- **August 30, 2026:** CMS Phase 2 shipped (PR #12). Migration
  `0023_add_cms_pages_and_sections.sql` adds `cms_pages`/`cms_sections`;
  migration `0024_widen_admin_actions_target_type.sql` widens the
  `marketplace_admin_actions` target-type check to allow `cms_page` (without it,
  every CMS save would fail). New admin-only editor at `/dashboard/admin/content`,
  a schema-driven registry (`src/content/marketing/registry.ts`), a validated
  write API (`PATCH /api/admin/content/[slug]`), and a never-throwing
  public resolver (`resolveMarketingContent`) that falls back to the static copy.
  Two defects found in review and fixed before merge: the SEO meta description
  ignored published content (now `generateMetadata`, memoized per request), and a
  new list item's untouched nested object saved as `{}` (now default-filled).
  Verified in development end to end (draft does not leak, publish is live,
  list/nested/select fields round-trip, test edits reverted). Migration `0024`
  was confirmed present in the shared Neon database with a direct
  `pg_constraint` query. The 8 public pages were spot-checked on production;
  the editor UI itself has not yet been exercised on production.
- **November 9, 2026:** Tracker and docs brought back in sync with reality
  (this change). Corrections: Pricing, How It Works, About/Contact/Blog/FAQ now
  done and Terms & Privacy in progress (draft copy); the two Verification
  evidence workspace rows (QA-passed August 9) marked done; six missing
  Phase 4 tables plus `marketplace_admin_actions`, `review_reminder_events`,
  `cms_pages`, and `cms_sections` added; Slices 6.5/6.6, the CMS, and its API
  added; the "CI / deployment pipeline" item split into Vercel git deployment
  (done) and CI checks (pending). Added two new groups, **Production Readiness &
  Hardening** and **Known Issues Backlog**, so audit findings are tracked rather
  than living only in screenshots. Overall completion moves from the stale ~91%
  to a computed ~87% because pending hardening work and known defects are now
  counted. The audit that prompted this found: production and development share
  one Neon database; Clerk on production appears to be in Development mode;
  `npm audit --omit=dev` reports 11 advisories (1 critical, in `next`); there is
  no automated test suite or CI; and no monitoring or rate limiting.
- **November 9, 2026:** Environment isolation (Production Readiness item 1).
  Created the Neon branch `development` (a fork of `production` with its own
  compute endpoint) using `neonctl`; local `.env.local` now points at it and
  records the production hostname in `BRAIDEL_PRODUCTION_DB_HOSTS`. New
  `src/db/safety.ts` guard is applied to `db:seed` and `verify:booking`; new
  `npm run db:target`; `db:migrate` prints its target first. Verified: the target
  report, all guard refusal paths (production host direct and pooled, unset host
  list, production environment flag), `db:migrate` and `verify:booking` on
  `development`, and a canary row written to `development` that was absent from
  `production` (read-only check) and removed. The Vercel project review showed
  that `DATABASE_URL` is one variable scoped to Production and Preview, that the
  Clerk keys are shared with Preview, and that `BLOB_READ_WRITE_TOKEN` is not set
  (confirming the cause of the failing portfolio uploads). The roadmap item was
  split: local isolation is done; pointing Vercel Preview at `development` and
  rotating the production password are tracked as separate pending items.
- **November 9, 2026 (follow-up):** The `development` branch had inherited
  production's `neondb_owner` password (Neon copies it on branch), so credentials
  were not truly separate. Reset the development role password and refreshed
  `.env.local`; verified with a script that never prints credentials: the
  passwords differ, the development password is rejected by the production host,
  and each credential works on its own host. In Vercel, `DATABASE_URL` (one
  sensitive variable scoped to Production and Preview) was narrowed to Production
  only, so preview deployments can no longer reach the production database. The
  Preview-scoped value for `development` has not been added yet, so Preview
  deployments currently have no database connection.

- **November 10, 2026 (item 2, phase A: Clerk email re-link):** PR #14 merged;
  the Preview-scoped `DATABASE_URL` was verified on its preview deployment (a
  change made only in `development` showed on the preview, not on braidel.com)
  and production rebuilt healthy. Added re-linking of existing accounts by
  verified email for the move to a Clerk production instance
  (`src/lib/clerk-link-domain.ts`, `relinkClerkIdentityByEmail`), used by the
  webhook sync, the first-sign-in lookup miss and the onboarding route. Verified:
  `npm run verify:clerk-link` (6 cases) and a throwaway-row check on
  `development`. The Clerk production instance, DNS, key split and webhook remain.

- **November 10, 2026 (item 2 complete: Clerk production + webhook):** The Clerk
  production instance is live on braidel.com (DNS verified, Google and email
  sign-in, live keys on Production, development keys kept for Preview), and the
  identity webhook is active. The admin signed in and kept the admin role via the
  verified-email re-link; a disposable-user lifecycle delivered created, updated
  and deleted events and tombstoned the Neon row. Follow-ups: turn off the unused
  Username requirement, retire the old development Clerk app, audit leftover
  development-era accounts, and note that Vercel Hobby keeps runtime logs for one
  hour only. Overall moves to ~88% (124 done · 4 in progress · 15 pending of 143).
