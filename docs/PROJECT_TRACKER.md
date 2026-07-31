# Braidel — Project Tracker

> Live implementation status across the Braidel build.
> The interactive version lives in the dashboard at `/tracker`, driven by
> [`src/lib/roadmap.ts`](../src/lib/roadmap.ts). This markdown is a point-in-time
> snapshot — regenerate it when the roadmap changes.

**Overall: ~91% complete** · Legend: ✅ Done · 🔄 In progress · ⬜ Pending · ⛔ Blocked

> All work follows the [SCALES Framework](../SCALES_FRAMEWORK.md) — surgical,
> clean, architecture-aligned, low-regression, expandable, stepwise.

### Progress by phase

| Phase | Focus | Done | % |
|-------|-------|------|---|
| **Phase 1** | Workforce & Staffing | 64 / 69 | ~93% |
| **Phase 2** | Client Booking | 18 / 18 | 100% |
| **Phase 3** | Online Payments | 0 / 1 | 0% |
| **Phase 4** | Reputation & Verification | 0 / 1 | 0% |
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

## Strategic Implementation Workstreams
_Core gaps and next product phases, ordered for low-regression delivery_

| # | Status | Workstream | Priority | Phase |
|---|--------|------------|----------|-------|
| 1 | ✅ | Real role state + client account foundation | High | 1 |
| 2 | ✅ | Booking domain schema + migrations | High | 2 |
| 3 | ✅ | Booking APIs + appointments/calendar UI | High | 2 |
| 4 | ✅ | Booking-aware conversations, reviews + notifications | High | 2 |
| 5 | ⬜ | Payments + monetization | High | 3 |
| 6 | ⬜ | Trust, verification + marketplace administration | High | 4 |
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
   migration `0013` with booking-scoped messages and reviews, booking lifecycle
   notifications, client appointment conversations, direct appointment message
   links, and completed-booking provider reviews.
5. **Payments + monetization** — finalize subscriptions and transaction fees,
   then implement Stripe Connect, commissions, refunds, payouts, and idempotent
   payment webhooks.
6. **Trust, verification + marketplace administration** — add verification
   evidence and audit history, moderation, reports, disputes, administrative
   actions, and account restrictions.
7. **Ecosystem expansion** — scope Academy, Supply, Franchise, and later native
   mobile clients before implementing those phases.

---

### How to update
1. Edit the item's `status` in [`src/lib/roadmap.ts`](../src/lib/roadmap.ts).
2. The `/tracker` dashboard page updates automatically.
3. Regenerate this markdown to keep the docs snapshot in sync.
