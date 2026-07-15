# Braidel — Claude Handoff

A working brief for any Claude (or engineer) picking up this project. Read this
first, then `AGENTS.md`, then the two docs in `docs/`.

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
│   ├── schema.ts                 # 7 tables + relations
│   └── migrations/               # Drizzle-generated SQL
├── lib/
│   ├── roadmap.ts                # Source of truth for /tracker
│   └── marketStudy.ts            # Source of truth for /market-study
└── proxy.ts                      # Clerk route protection (NOT middleware.ts — see §6)
```

---

## 4. Database Schema (Neon)

Eight tables, all migrated and live: `users`, `salons`, `braiders`,
`opportunities`, `applications`, `braid_styles`, `messages`, `ratings`. Full definitions and
relations in [`src/db/schema.ts`](src/db/schema.ts).

- `users.clerkId` links a row to the Clerk user (auth source of truth).
- Role-specific profile rows (`salons`, `braiders`) are seeded on onboarding.

### Data strategy — backend wiring in progress

**Current state:** Phase 1 screens were built on **mock data first**, and the
backend wiring pass is now well underway. The database schema, migrations, seed
script, read query layer, public marketplace reads, opportunity posting,
application creation, applicant review, dashboard summaries, and the braid style
catalog, and settings/profile persistence are DB-backed. Messages and ratings
are the remaining major backend wiring targets.

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
9. 🔄 Wire messages and ratings to Neon reads/writes.

### Roles in the dashboard

The dashboard shell serves both **salon** and **braider** roles from one layout.
Role is held in a client context — [`RoleContext`](src/components/dashboard/RoleContext.tsx)
— toggled from the sidebar pill, defaulting to `salon`. The sidebar swaps its nav
set and `/dashboard` renders `SalonDashboardHome` or `BraiderDashboardHome`
accordingly. **When the backend pass lands, seed the initial role from the
signed-in user's `users.role`** and the toggle becomes a dev/demo affordance (or
is gated to the user's real role).

---

## 5. Local Setup & Commands

**Environment** — copy `.env.example` to `.env.local` and fill in:
- `DATABASE_URL` — Neon connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — Clerk API keys
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

Sourced from the "Braidel Design System" kit (in repo root). All tokens are
ported into `src/app/globals.css`:

- **Brand:** terracotta (`--brand` / `#C75D3F`), secondary deep gold.
- **Neutrals:** warm cream → charcoal ramp. Page bg is `--bg-page` (cream).
- **Fonts:** Bricolage Grotesque (display), Hanken Grotesk (body/UI),
  JetBrains Mono (eyebrows/data).
- **Prefer semantic tokens** (`--brand`, `--text-body`, `--surface-card`) over
  raw ramp values in product code.

The `Braidel Design System/` folder contains the original JSX reference kits
(marketing + app). They are **reference only** — the shipped components in
`src/components/` are the real implementation.

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

**Phase 1 is UI-complete and ~85% complete overall by the tracker.** Both
marketplace sides are navigable, with public discovery, opportunities,
applications/applicants, style catalog, and dashboard summaries now DB-backed.
The remaining workforce flows are concentrated in messaging, ratings, and
supporting polish:

- **Public:** landing, Find Braiders (+ profile), Find Salons (+ detail),
  Job Opportunities (+ detail). Discovery filters and jobs are wired to Neon.
- **Salon app:** dashboard, Opportunities (list + post form), Applicants with
  status actions, Messages, Settings.
- **Braider app:** dashboard, Find Work + apply, Applications, Messages,
  Settings (profile editor).
- **Shell:** role switch (salon/braider), internal Tracker + Market Study.

**Remaining (highest value first):**

1. **Backend Wiring Pass 4: Messaging + Ratings** — replace dashboard
   conversations and ratings with real user-scoped reads/writes.
2. **Portfolio media persistence** — replace placeholder portfolio tiles with
   real upload/storage once storage is selected.
3. **Notifications page** (shared) — last pending UI screen.
4. Polish: Clerk webhook (user sync), CI/deploy, Alert/Modal primitives, legal
   and content pages.

Source of truth: [`src/lib/roadmap.ts`](src/lib/roadmap.ts). Snapshot:
[`docs/PROJECT_TRACKER.md`](docs/PROJECT_TRACKER.md). Live dashboard: `/tracker`.

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
