# STABLE Framework

> The operating standard for every change in the Braidel codebase, adopted
> November 9, 2026. It builds on [`SCALES_FRAMEWORK.md`](SCALES_FRAMEWORK.md),
> which stays in force for the Braidel-specific guardrails (Next.js 16 gotchas,
> design tokens, the mock-data boundary). STABLE adds the two things SCALES did
> not cover: **testability** and **performance/availability thinking**.

**S**urgical & SOLID · **T**estable & Traceable · **A**rchitecture-Aligned &
Available · **B**alanced for Bottlenecks · **L**ow-Regression & Loosely Coupled ·
**E**xpandable & Elastic

The goal is production-aware development: no unnecessary rewrites, no hidden
regressions, no unscalable shortcuts. It is not a license to over-engineer.

---

## The six principles, applied to Braidel

### S — Surgical & SOLID
- Smallest correct change; additive over rewrite; one concern per commit/PR.
- One responsibility per module. Split files that keep growing (known offenders:
  `AdminModerationClient.tsx`, `db/queries.ts`, `ProviderBookingSetup.tsx`,
  `lib/booking-service.ts`) when you next touch them for a real reason.
- Do not change public behavior, signatures, or contracts unless asked.

### T — Testable & Traceable
- Write acceptance criteria before coding.
- New or changed logic, APIs, auth, money, or migrations get a test (unit for
  domain logic in `src/lib/`, integration/smoke for routes) once the test runner
  exists, or a documented, repeatable manual check until then.
- Validate inputs, permissions, and edge cases; log critical operations.
- Traceability: record evidence (what was verified, when) in
  `docs/PROJECT_TRACKER.md` and `PRE-PRODUCTION-RELEASE-CHECKS.md`; admin actions
  go through `marketplace_admin_actions`; keep append-only history tables.
- Never claim a check passed that was not run.

### A — Architecture-Aligned & Available
- Reuse the existing layers: route handlers re-check auth, queries in
  `src/db/*-queries.ts`, domain rules in `src/lib/*-domain.ts`, UI primitives in
  `src/components/ui/`.
- Make failure safe: idempotency keys, transactions where state spans rows,
  graceful fallbacks (see `resolveMarketingContent`), isolated try/catch around
  non-critical enrichment.
- Ask for every change: what if the database, Clerk, Blob, or Stripe is down?
  Can the user retry safely?

### B — Balanced for Bottlenecks
- Paginate lists; index query paths; avoid per-request aggregates that scan
  whole tables; cache public, rarely-changing reads where it is safe.
- Ask: does this still work at 10x users or rows? Do not add queues or caches
  without a measured or clearly foreseeable need.

### L — Low-Regression & Loosely Coupled
- Find every consumer before editing shared code. Keep migrations additive and
  backward compatible; use feature flags or staged rollout for risky changes.
- Protect: sign-in/sign-up, role access, the admin portal, bookings, messaging,
  notifications, webhooks, and public routes.

### E — Expandable & Elastic
- Config in environment variables, not code; data-driven over hardcoded lists;
  single sources of truth (`roadmap.ts`, content registry, design tokens).
- Leave seams for the roadmap without building features early.

---

## Workflow for every change

1. **Understand** — restate the goal, constraints, and what must not break.
2. **Impact analysis** — files, consumers, tables, auth, integrations, tests.
3. **Plan** — the smallest safe change, where it lives, how it is verified.
4. **Implement** — minimal diffs, existing patterns, full types.
5. **Verify** — `npx tsc --noEmit`, `npm run lint`, tests (when present), the
   manual flow, and the regression areas listed in the plan.
6. **Record** — update the tracker and release checklist in the same change.
7. **Ship** — commit, push, PR, merge; then confirm on production.

## Definition of done

- [ ] Acceptance criteria met and demonstrated.
- [ ] `tsc` clean; lint introduces no new errors; tests pass (or the manual
      check is written down).
- [ ] No new regression in the protected areas above; existing routes still
      respond (`/`, `/find-braiders`, `/marketplace`, `/dashboard`).
- [ ] Migrations are additive, reviewed, and applied intentionally.
- [ ] Tracker (`src/lib/roadmap.ts` + `docs/PROJECT_TRACKER.md`) and
      `PRE-PRODUCTION-RELEASE-CHECKS.md` updated.
- [ ] Summary written: what changed, what was verified, what risk remains.

## Output contract (for AI-assisted changes)

```
STABLE Analysis      Goal · Affected areas · Risks · Plan
Implementation       Changed · Preserved · Why this approach
Verification         Checks run · Manual tests · Regression areas reviewed
Remaining notes      Risks · Follow-ups
```

---

## Braidel operating rules (read before touching data)

- **Local development uses the Neon branch `development`; production is the
  `production` branch.** Check with `npm run db:target` before any data command.
  Never put the production connection string in `.env.local` or in output; set it
  in the shell for a single, deliberate production command (for example a
  migration). `db:seed` and `verify:booking` refuse production hosts. Vercel
  Preview deployments still use the production `DATABASE_URL` until their scope
  is changed, so treat preview testing as production-data testing for now.
  Never print connection strings; scripts that handle them must not echo them.
- Confirm outward-facing or hard-to-reverse actions (migrations on shared data,
  pushes, merges, anything sent to a third party) before running them.
- This is **Next.js 16**: read `node_modules/next/dist/docs/` before assuming an
  API (`AGENTS.md`).
