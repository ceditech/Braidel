# Braidel — Claude Handoff

A working brief for any Claude (or engineer) picking up this project. Read this
first, then `AGENTS.md`, the two docs in `docs/`, and
[`PRE-PRODUCTION-RELEASE-CHECKS.md`](PRE-PRODUCTION-RELEASE-CHECKS.md).

---

## 1. What Braidel Is

A specialized **workforce + marketplace platform for the hair braiding industry**.
It connects salon owners who need skilled braiders with braiders seeking work, and
(later phases) lets clients discover and book braiding services.

- **Product requirements:** [`docs/Braidel.pdf`](docs/Braidel.pdf)
- **Business case:** [`docs/MARKET_STUDY.md`](docs/MARKET_STUDY.md)
- **Build status:** [`docs/PROJECT_TRACKER.md`](docs/PROJECT_TRACKER.md)

Three user roles: **Salon Owner**, **Braider**, **Client**. Phase 1 (current focus)
is the workforce/staffing platform — salons post opportunities, braiders apply,
both message and rate each other.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 16** (App Router, Turbopack) | ⚠️ Breaking changes vs. older Next — see §6 |
| Language | TypeScript | strict |
| Styling | Tailwind v4 + CSS design tokens | tokens in `src/app/globals.css` |
| Auth | **Clerk** (`@clerk/nextjs` v7) | multi-role via user metadata |
| Database | **Neon** (serverless Postgres) | |
| ORM | **Drizzle** | schema in `src/db/schema.ts` |
| Media storage | **Vercel Blob** | local filesystem fallback in development |

Stack rationale: best-of-breed and decoupled (Neon and Clerk are independently
swappable) — chosen over Supabase/Firebase for a relational marketplace. Full
reasoning is in the git history / prior design discussion.

---

## 3. Project Structure

```
src/
├── app/
│   ├── (public)/                 # Marketing site (Navbar + Footer layout)
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── (dashboard)/              # Authenticated app (Sidebar layout)
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx    # Salon dashboard home
│   │   ├── tracker/page.tsx      # Internal: project tracker
│   │   └── market-study/page.tsx # Internal: investor market study
│   ├── sign-in / sign-up         # Clerk-hosted auth
│   ├── onboarding/               # Role selection (Salon/Braider/Client)
│   ├── api/onboarding/route.ts   # Writes user + role profile to Neon
│   ├── api/webhooks/clerk/       # Verified Clerk identity lifecycle sync
│   ├── layout.tsx                # Root — ClerkProvider, fonts
│   └── globals.css               # ALL design tokens + Tailwind theme
├── components/
│   ├── ui/                       # Design-system primitives
│   │   ├── BraidelLogo, Button, Card, Badge, Tag,
│   │   └── Avatar, Rating, StatCard
│   ├── marketing/                # Navbar, Footer
│   └── dashboard/                # Sidebar, Topbar, PrintButton,
│                                 #   RoleContext (salon/braider toggle),
│                                 #   Salon/BraiderDashboardHome
├── db/
│   ├── index.ts                  # Drizzle + Neon connection
│   ├── schema.ts                 # 11 tables + relations
│   └── migrations/               # Drizzle-generated SQL
├── lib/
│   ├── roadmap.ts                # Source of truth for /tracker
│   └── marketStudy.ts            # Source of truth for /market-study
└── proxy.ts                      # Clerk route protection (NOT middleware.ts — see §6)
```

### Current public route split

- [`src/app/(home)/page.tsx`](<src/app/(home)/page.tsx>) owns the editorial brand
  homepage at `/` and renders
  [`HomeExperience`](src/components/marketing/HomeExperience.tsx).
- [`src/app/(public)/marketplace/page.tsx`](<src/app/(public)/marketplace/page.tsx>)
  preserves the previous marketplace landing experience at `/marketplace`.
- The remaining `(public)` routes continue to use the shared public navigation
  and footer layout. The editorial homepage intentionally owns its own immersive
  header, content sections, and footer.

---

## 4. Database Schema (Neon)

Nineteen tables, all migrated and live: users/profiles, marketplace listings,
opportunities/applications, booking/availability, messages, ratings,
`rating_history`, portfolio media, notifications, and notification preferences.
Full definitions and relations are in [`src/db/schema.ts`](src/db/schema.ts).

- `users.clerkId` links a row to the Clerk user (auth source of truth).
- `users.onboardedAt` distinguishes identity rows created by Clerk sync from
  accounts that have explicitly completed role selection. Migration `0010`
  backfills existing accounts and leaves future pre-onboarding rows nullable.
- Role-specific profile rows (`salons`, `braiders`) are seeded on onboarding.
- Clerk identity updates are synchronized through a signed webhook. Deletions
  tombstone the user, remove identity PII, and deactivate public marketplace
  records without cascading away applications, messages, or ratings.

### Data strategy — backend wiring in progress

**Current state:** Phase 1 screens were built on **mock data first**, and the
backend wiring pass now covers the core Phase 1 workflows. The database schema,
migrations, seed script, read query layer, public marketplace reads, opportunity posting,
application creation, applicant review, dashboard summaries, and the braid style
catalog, settings/profile persistence, and application-scoped messaging are
DB-backed. Ratings and reviews are application-scoped, participant-authorized,
and persisted in Neon with database-maintained aggregates. Portfolio metadata,
notification preferences, and in-app notifications are also persisted in Neon;
portfolio binaries use Vercel Blob in production and `public/uploads/portfolio`
only as a local-development fallback.
Clerk `user.created`, `user.updated`, and `user.deleted` events now keep Neon
identity fields aligned; onboarding remains the source of truth for the selected
marketplace role and is idempotent when the webhook arrives first.

Rules while this transition holds:
- **All remaining mock data lives in [`src/lib/sampleData.ts`](src/lib/sampleData.ts)**.
  Do not add new inline mock arrays. Replace imports with query helpers screen by
  screen.
- Prefer Server Components for read screens that can query `db` directly.
- Use route handlers or Server Actions for writes, and always re-check auth and
  authorization inside the write path.

**Backend wiring progress:**
1. ✅ Seed script exists (`npm run db:seed`) and currently populates braid styles,
   braiders, salons, opportunities, and applications from shared seed datasets.
2. ✅ DB query layer exists in [`src/db/queries.ts`](src/db/queries.ts).
3. ✅ Find Braiders + braider profile read from Neon.
4. ✅ Find Salons + salon detail read from Neon.
5. ✅ Opportunities read from and write to Neon.
6. ✅ Applications/applicants read from Neon; braiders can apply; salons can
   shortlist, match, and decline applicants.
7. ✅ Dashboard summaries use DB-backed opportunity/application data.
8. ✅ Profile + settings persistence saves salon/braider profile fields to Neon.
9. ✅ Messaging reads, sends, and read receipts are application-scoped and
   persisted in Neon.
10. ✅ Ratings are limited to matched applications and completed bookings,
    support one editable review per participant direction, refresh
    salon/braider aggregates in Neon, notify providers on review updates, and
    retain append-only `rating_history` audit rows.
11. ✅ Portfolio media upload/delete flows persist normalized metadata, enforce
    ownership/type/size/count limits, and render on public braider profiles.
12. ✅ Notifications persist with idempotent event keys for applications,
    application status changes, messages, booking lifecycle events, and review
    create/update events; read state and preferences are DB-backed.
13. ✅ Dashboard role state is derived from the authenticated Neon user;
    incompatible role pages redirect server-side, onboarding completion is
    explicit, and Client dashboard/settings foundations are available.

### Roles in the dashboard

The dashboard shell serves **salon**, **braider**, and **client** roles from one
layout. [`src/app/(dashboard)/layout.tsx`](<src/app/(dashboard)/layout.tsx>)
resolves the signed-in, onboarded Neon user on the server and seeds the read-only
[`RoleContext`](src/components/dashboard/RoleContext.tsx). The sidebar no longer
simulates another identity: it displays the authenticated account role and swaps
only the role-compatible navigation set.

The account model is intentionally **single-role** for this phase. `users.role`
is the authorization source of truth; client context controls presentation only.
Role-specific pages call `requireDashboardRole()` and redirect incompatible
accounts to `/dashboard`. Changing account roles is not a self-service action.

---

## 5. Local Setup & Commands

**Environment** — copy `.env.example` to `.env.local` and fill in:
- `DATABASE_URL` — Neon connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — Clerk API keys
- `CLERK_WEBHOOK_SIGNING_SECRET` — signing secret for `/api/webhooks/clerk`;
  subscribe that endpoint to `user.created`, `user.updated`, and `user.deleted`
- `BLOB_READ_WRITE_TOKEN` — required for portfolio uploads in production;
  optional locally because the development adapter writes ignored files under
  `public/uploads/portfolio`
- Clerk redirect paths (already set; relative, so port-independent)

**Commands:**
```bash
npm run dev          # dev server on http://localhost:3003
npm run build        # production build
npm run db:generate  # generate a migration from schema.ts
npm run db:migrate   # apply migrations to Neon
npm run db:studio    # browse the database (Drizzle Studio)
```

> **Port:** dev runs on **3003** (hardcoded via `next dev --port 3003`) because
> 3000/3001/3002 are used by other local apps. `.claude/launch.json` matches.

---

## 6. Gotchas & Hard-Won Lessons

These cost time once already — don't repeat them.

1. **This is Next.js 16 — not older Next.** APIs/conventions differ from most
   training data. Read `node_modules/next/dist/docs/` before assuming an API.
   (This is also the standing instruction in `AGENTS.md`.)

2. **Route protection lives in `src/proxy.ts`, not `middleware.ts`.** Next.js 16
   deprecated the `middleware` file convention and renamed it to `proxy`. Clerk's
   `clerkMiddleware` still works inside it.

3. **Clerk v7 renamed the gate components.** There is **no** `<SignedIn>` /
   `<SignedOut>` export. Use the `useAuth()` hook (`isSignedIn`) in client
   components, or `currentUser()` / `auth()` from `@clerk/nextjs/server`.

4. **Google Fonts `@import` must be the very first line in `globals.css`** —
   before `@import "tailwindcss"`. CSS requires `@import` rules to precede all
   other rules; putting it lower throws a PostCSS parse error.

5. **Components with hover/click handlers need `"use client"`.** Server
   components can't pass event handlers. `Card.tsx`, `Button.tsx`, `Tag.tsx`,
   the `Navbar`, and any page using `onMouseEnter`/`onClick` are client
   components. Keep purely presentational pieces as server components.

6. **npm rejects the capitalized folder name "Braidel"** for `create-next-app`.
   The project was scaffolded in a temp lowercase dir and moved in. Not an issue
   now, but relevant if re-scaffolding.

7. **The preview screenshot MCP tool has been flaky in this repo** — it times out
   / loses the server between calls. Verify via `curl` for HTTP status, or open
   `http://localhost:3003` directly in a browser. A `307` on `/tracker` or
   `/market-study` is **correct** — those are protected routes redirecting to
   sign-in.

---

## 7. Design System

The shared implementation lives in `src/app/globals.css` and the primitives in
`src/components/ui/`:

- **Brand:** the lowercase `braid.el` wordmark, muted rose
  (`--brand` / `#C65D66`), ink black, and cool neutral surfaces.
- **Themes:** persistent light/dark preference is stored under
  `braidel-theme`; `ThemeToggle` is exposed in public and dashboard chrome.
- **Fonts:** Bricolage Grotesque (display), Hanken Grotesk (body/UI),
  JetBrains Mono (eyebrows/data).
- **Prefer semantic tokens** (`--brand`, `--text-body`, `--surface-card`) over
  raw ramp values in product code.

The `Braidel Design System/` folder contains the original JSX reference kits
(marketing + app). They are **reference only** — the shipped components in
`src/components/` are the real implementation.

### Editorial homepage UI

The redesigned homepage at `/` is a responsive, image-led editorial experience:

- **Implementation:** [`HomeExperience.tsx`](src/components/marketing/HomeExperience.tsx)
  with scoped styles in
  [`HomeExperience.module.css`](src/components/marketing/HomeExperience.module.css).
  It is intentionally separate from the shared marketplace `Navbar` and
  `Footer`.
- **Primary navigation:** the `braid.el` wordmark returns home, `Marketplace`
  routes to `/marketplace`, and About, How It Works, Pricing, Blog, and Contact
  use anchored homepage sections. The responsive mobile menu exposes the same
  destinations.
- **Discovery pathways:** three image cards link directly to Find Braiders,
  Find Salons, and Job Opportunities. Their generated imagery lives under
  `public/images/home/`.
- **Spotlight:** three synchronized copy-and-image slides rotate every seven
  seconds, pause during pointer or keyboard interaction, support direct slide
  selection, preserve stable layout dimensions, and disable transitions when
  reduced motion is requested.
- **Supporting content:** About, How It Works, introductory Pricing, Journal,
  contact, and sign-up calls to action are present below the first viewport.
- **Theme behavior:** the light header uses the CSS-module rule
  `:global(html[data-theme="light"]) .header` with a white-to-`#733831`
  gradient and explicit high-contrast navigation controls. Dark mode retains
  its solid near-black header. The spotlight subtitle uses the rose brand
  accent, and the persistent theme preference still uses `braidel-theme`.
- **Responsive behavior:** the desktop two-column experience becomes a stacked
  layout with horizontally scrollable pathway cards and compact navigation at
  tablet/mobile breakpoints. Keep header contrast, stable spotlight geometry,
  and overflow checks in the regression checklist for future homepage edits.

### Dashboard shell responsive polish

The authenticated dashboard shell has been tightened for mobile and dark mode:

- **Mobile layout:** the desktop sidebar collapses into a bottom navigation with
  a More drawer for secondary routes, while dashboard cards, lists, and booking
  views stack into single-column layouts at small breakpoints.
- **Dark theme header:** [`Topbar.module.css`](src/components/dashboard/Topbar.module.css)
  uses the semantic `--nav-glass` token so the header resolves to a dark glass
  surface in dark mode instead of the old light backdrop. Notification bell icon
  color follows `--text-muted` for contrast across both themes.
- **Verification:** rerun responsive checks for `/dashboard`, role dashboards,
  `/dashboard/appointments`, and the public homepage whenever dashboard shell or
  theme tokens change.

---

## 8. Internal Dashboard Tools

Two data-driven internal pages, both under the **"Insights"** sidebar section:

- **`/tracker`** — live build status. Edit [`src/lib/roadmap.ts`](src/lib/roadmap.ts);
  the page recomputes percentages, counts, and progress bars automatically.
- **`/market-study`** — investor/partner briefing with an "Export PDF" button.
  Edit [`src/lib/marketStudy.ts`](src/lib/marketStudy.ts).

When you complete a feature, **update its status in `roadmap.ts` as part of the
same change**, then regenerate `docs/PROJECT_TRACKER.md` so the snapshot stays
accurate. Both pages are protected routes (auth required).

---

## 9. Status & What's Next

**Phase 1 workforce workflows are mostly complete and ~93% complete by the
tracker.** Both
marketplace sides are navigable, with public discovery, opportunities,
applications/applicants, style catalog, and dashboard summaries now DB-backed.
Portfolio media, notifications, messaging, ratings, and role-aware settings are
now persistent. Remaining Phase 1 work is concentrated in operational readiness
and public content:

- **Public:** the editorial brand home is `/`; the previous marketplace landing
  is preserved at public route `/marketplace`; Find Braiders (+ profile), Find
  Salons (+ detail), and Job Opportunities (+ detail) remain wired to Neon.
- **Salon app:** dashboard, Opportunities (list + post form), Applicants with
  a responsive profile/portfolio drawer and status actions, Appointments with
  multi-chair capacity and provider setup, Messages, Settings.
- **Braider app:** dashboard, Find Work + apply, Applications, Messages,
  Appointments with single-provider availability, Settings (profile editor).
- **Client app:** role-aware dashboard, public Braider/Salon discovery links,
  booking discovery and appointment management, Notifications, and
  account/notification Settings.
- **Shell:** server-owned Salon/Braider/Client role state, role-compatible
  navigation, internal Tracker + Market Study.

**Strategic implementation order:**

1. **Real role state + client account foundation.**
2. **Booking domain schema + migrations.**
3. **Booking APIs + appointments/calendar UI.**
4. **Booking-aware conversations, reviews, and notifications.**
5. **Payments + monetization.**
6. **Trust, verification, and marketplace administration.**
7. **Ecosystem expansion:** Academy, Supply, Franchise, then mobile.

### Completed: workstreams 1/7, 2/7, and 3/7

**Real role state + client account foundation** is complete:

1. Single-role accounts are the documented current policy.
2. The dashboard layout resolves `users.role` on the server through
   [`authenticated-user.ts`](src/lib/authenticated-user.ts).
3. `RoleContext` is read-only and no longer defaults to or toggles Salon.
4. Role-specific dashboard pages redirect incompatible accounts server-side;
   API authorization continues to independently enforce `users.role`.
5. Client accounts have dedicated navigation, dashboard discovery, account
   settings, and notification preferences.
6. Migration `0010_violet_bloodstrike.sql` adds and backfills
   `users.onboarded_at`; onboarding is idempotent and prevents silent role
   replacement after completion.

**Booking domain schema + migrations** is also complete:

1. Migration `0011_white_rage.sql` adds `client_profiles`,
   `service_providers`, `service_offerings`, `availability_rules`,
   `availability_exceptions`, `bookings`, and `booking_status_history`.
2. `service_providers` is the neutral bookable identity for exactly one Salon or
   Braider, avoiding repeated polymorphic ownership logic throughout Phase 2.
3. Recurring availability stores provider-local day/time rules; exceptions and
   appointment instants use timezone-aware timestamps.
4. Services and bookings use integer cents plus three-letter currencies.
   Bookings snapshot service name, price, currency, and timezone for durable
   history.
5. A composite foreign key prevents a booking from pairing a service with the
   wrong provider. Time ranges, provider identity, currency, price, duration,
   and optimistic version values have database checks and query-path indexes.
6. Onboarding and the development seed create the required Client or Provider
   identity. The migration backfilled the configured development database to
   `1/1` Client profile, `8/8` Salon providers, and `7/7` Braider providers.
7. Providers default to `UTC` and `is_accepting_bookings = false`; APIs must
   require a real timezone, at least one active service, and valid availability
   before enabling booking.

**Booking APIs + appointments/calendar UI** is complete:

1. Migration `0012_slippery_tomas.sql` adds provider booking capacity and a
   client-scoped idempotency key for booking requests.
2. Provider APIs persist timezone, booking activation, Salon capacity, service
   offerings, recurring weekly hours, and date-specific exceptions.
3. Availability is calculated with Temporal using each provider's IANA
   timezone, including daylight-saving transitions, lead time, exceptions,
   existing bookings, Salon capacity, and Client conflicts.
4. Booking mutations run in isolated serializable Neon transactions with
   ownership checks, row locks, optimistic versions, retry handling, durable
   status history, and role-valid request, confirm, decline, reschedule,
   cancel, complete, and no-show transitions.
5. `/dashboard/appointments` provides role-aware calendar and agenda views,
   Client provider/service discovery and booking, Provider services and
   availability setup, and responsive appointment action drawers.
6. Public Braider and Salon profiles link accepting providers into the booking
   workflow. Dashboard navigation exposes Appointments for all three roles.
7. Development seed data creates bookable Braiders, Salons, services, schedules,
   and a Client identity. `npm run verify:booking` exercises and removes a real
   request → confirmation → cancellation lifecycle.

**Booking-aware conversations, reviews + notifications** is complete:

1. Migration `0013_funny_umar.sql` adds nullable `booking_id` context links to
   `messages` and `ratings`, enforces exactly one conversation/review context,
   and expands notification types with `booking`.
2. `/dashboard/messages` now supports application conversations for Salon/Braider
   staffing flows and booking conversations for Client/Provider appointment
   flows, including direct links via `?booking=...`.
3. Booking creation and status mutations emit in-app booking notifications to
   the opposite participant; booking message notifications deep-link to the
   booking conversation.
4. Completed Client bookings can review the provider. Those booking reviews use
   the existing Salon/Braider rating aggregate trigger and preserve current
   application review behavior.
5. Review creation and edits retain append-only `rating_history` audit rows.
   Client and Provider appointment drawers show the current review and edit
   history, and Provider receives a new notification when a Client updates an
   existing booking review.
6. July 31, 2026 manual QA passed for the six-step Workstream 4 hardening
   flow: Client review edit, Provider update notification, Provider drawer
   visibility, Client drawer history visibility, shared audit visibility, and
   old application messaging/review regression checks.

Payments, external calendar synchronization, recurring appointments, and
provider payout/commission handling remain deferred; they were intentionally not
part of workstreams `3/7` or `4/7`.

Deferred review/reputation surfaces that must be revisited before launch or in
Workstream `6/7`: a dedicated `/dashboard/reviews` provider surface, an
automated capped 5-step Client review reminder system for completed bookings,
and formal review dispute/moderation workflows. The current implementation
provides review persistence, update notifications, and audit history, but not
those larger product surfaces.

**Immediate next strategic focus:** workstream `5/7`, payments and
monetization. Planning is active. Finalize the pricing/subscription/transaction
fee model first, then implement Stripe Connect account onboarding,
checkout/payment capture, platform commissions, refunds, payouts, and
idempotent payment webhooks in small, independently testable slices.

Recommended Workstream 5 slices:

1. **Payment product model:** decide what is paid by Clients, Providers, and
   Salon owners; define subscriptions, transaction fees, cancellation/no-show
   rules, refund windows, and payout timing.
2. **Schema + state machine:** add payment accounts, checkout sessions, payment
   intents, ledger/fee records, payout status, refund/dispute records, and
   webhook event idempotency.
3. **Provider monetization setup:** Stripe Connect onboarding, account status,
   payout readiness, dashboard warnings, and role-compatible settings.
4. **Client checkout:** attach payment capture to booking confirmation or
   booking request according to the chosen product model.
5. **Webhook reliability:** verify Stripe webhook signatures, persist raw event
   IDs, update local state idempotently, and handle retries/out-of-order events.
6. **Operational QA:** test successful payment, failed payment, refund,
   cancellation, no-show, provider payout readiness, and double-submit
   idempotency before expanding the UI.

CI/deployment, legal and trust content, Pricing, How It Works, and secondary
public content remain parallel launch-readiness work. Clerk webhook activation
remains deferred until a stable staging or production URL exists.

Notification delivery is currently in-app. The activity/message/digest
preferences are persisted for later email or push delivery, but no external
delivery worker is implemented yet.

Source of truth: [`src/lib/roadmap.ts`](src/lib/roadmap.ts). Snapshot:
[`docs/PROJECT_TRACKER.md`](docs/PROJECT_TRACKER.md). Live dashboard: `/tracker`.
Production gates and deferred activation work:
[`PRE-PRODUCTION-RELEASE-CHECKS.md`](PRE-PRODUCTION-RELEASE-CHECKS.md).

---

## 10. Conventions

- **Follow the [SCALES Framework](SCALES_FRAMEWORK.md)** for every change —
  Surgical, Clean, Architecture-Aligned, Low-Regression, Expandable, Stepwise.
  It is the operating standard; read it before implementing.
- Match the surrounding code style: inline styles with CSS-variable tokens,
  function components, small inline SVG icons (no icon library yet).
- Reuse `src/components/ui/` primitives; don't re-implement buttons/cards.
- Keep sample/mock data obvious and co-located until the API routes land.
- Confirm outward-facing or hard-to-reverse actions before running them.
- Treat `PRE-PRODUCTION-RELEASE-CHECKS.md` as a living release document. Update
  it whenever work adds or changes production secrets, integrations, migrations,
  webhooks, jobs, authorization boundaries, retention behavior, monitoring,
  legal obligations, or rollback requirements.
