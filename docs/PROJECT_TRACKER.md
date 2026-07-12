# Braidel — Project Tracker

> Live implementation status across the Braidel build.
> The interactive version lives in the dashboard at `/tracker`, driven by
> [`src/lib/roadmap.ts`](../src/lib/roadmap.ts). This markdown is a point-in-time
> snapshot — regenerate it when the roadmap changes.

**Overall: ~81% complete** · Legend: ✅ Done · 🔄 In progress · ⬜ Pending · ⛔ Blocked

> All work follows the [SCALES Framework](../SCALES_FRAMEWORK.md) — surgical,
> clean, architecture-aligned, low-regression, expandable, stepwise.

### Progress by phase

| Phase | Focus | Done | % |
|-------|-------|------|---|
| **Phase 1** | Workforce & Staffing | 44 / 55 | ~80% |
| **Phase 2** | Client Booking (early discovery UI) | 4 / 4 | 100% |

_Phases 3–7 (payments, verification, academy, supply, franchise) are not yet
scoped into tracked tasks._

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
| ✅ | messages table | High | 1 |
| ✅ | ratings table | High | 1 |

## Design System
_Tokens & UI primitives_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Design tokens (color, type, spacing, motion) | High | 1 |
| ✅ | Brand fonts (Bricolage / Hanken / JetBrains) | High | 1 |
| ✅ | Button, Card, Badge, Tag components | High | 1 |
| ✅ | Avatar, Rating, StatCard, Logo components | High | 1 |
| ✅ | Form inputs (Input, Select, Switch, Checkbox, Textarea) | High | 1 |
| ✅ | Tabs component | Medium | 1 |
| ⬜ | Alert, Modal components | Medium | 1 |

## Marketing Site
_Public-facing pages_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Navbar (auth-aware) | High | 1 |
| ✅ | Footer | High | 1 |
| ✅ | Landing page | High | 1 |
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
| ⬜ | Clerk webhook → user sync | Medium | 1 |

## Salon Dashboard
_Salon owner workflows_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | App shell (Sidebar + Topbar) | High | 1 |
| ✅ | Salon dashboard home | High | 1 |
| ✅ | Opportunities list | High | 1 |
| ✅ | Post Opportunity form | High | 1 |
| ✅ | Manage Applicants screen | High | 1 |

## Braider Dashboard
_Braider workflows_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Role switch (salon / braider) | High | 1 |
| ✅ | Braider dashboard home | High | 1 |
| ✅ | Find Work (search + apply) | High | 1 |
| ✅ | Applications tracker | High | 1 |
| ✅ | Profile editor + portfolio upload | High | 1 |

## Shared App
_Cross-role features_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Messaging (list + thread) | High | 1 |
| ⬜ | Notifications page | Medium | 1 |
| ✅ | Settings page (role-aware) | Medium | 1 |

## Backend / API
_Data routes & business logic_

| Status | Task | Priority | Phase |
|--------|------|----------|-------|
| ✅ | Schema extensions + migrations | High | 1 |
| ✅ | DB seed script (`npm run db:seed`) | High | 1 |
| ✅ | DB query layer (reads) | High | 1 |
| ✅ | Wire Find Braiders to DB | High | 1 |
| ✅ | Wire Find Salons to DB | High | 1 |
| ⬜ | Wire Job Opportunities to DB | High | 1 |
| ⬜ | Wire dashboards to DB | High | 1 |
| ⬜ | Write routes: applications, messages, ratings | High | 1 |

---

### How to update
1. Edit the item's `status` in [`src/lib/roadmap.ts`](../src/lib/roadmap.ts).
2. The `/tracker` dashboard page updates automatically.
3. Regenerate this markdown to keep the docs snapshot in sync.
