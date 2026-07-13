# SCALES Framework

> The operating standard for every change in the Braidel codebase. Read this
> before implementing. It exists to produce quality code with best practices and
> **low regressions** through stepwise, surgical work.

**S**urgical · **C**lean · **A**rchitecture-Aligned · **L**ow-Regression ·
**E**xpandable · **S**tepwise/Systematic

---

## The Six Principles

### S — Surgical
Make precise, minimal, targeted changes only where needed.
- Touch the fewest files and lines that fully solve the task.
- Prefer additive changes over rewrites; don't refactor unrelated code in the same pass.
- If a refactor is genuinely needed, isolate it and verify it separately.
- **Don't:** opportunistically "clean up" code the task didn't ask you to touch.

### C — Clean
Keep code readable, organized, typed, and maintainable.
- Full TypeScript types — no `any`, no implicit `any`, no unchecked casts.
- Match the surrounding style: naming, comment density, formatting, idioms.
- Small, single-responsibility components and functions.
- Meaningful names; comments explain *why*, not *what*.

### A — Architecture-Aligned
Follow best practices, existing patterns, and the project's architecture.
- Reuse the design-system primitives in `src/components/ui/` — never re-implement a button/card/input.
- Use design tokens (CSS variables), never hard-coded hex/px for themed values.
- Respect Next.js 16 App Router conventions (Server vs. Client Components, `proxy.ts` for auth).
- Keep the mock-data boundary (`src/lib/sampleData.ts`) until the backend wiring pass.
- New shared logic goes in `src/lib/`; new UI primitives in `src/components/ui/`.

### L — Low-Regression
Do not break existing features, flows, UI, APIs, database behavior, auth, billing, or integrations.
- Before editing shared code, find every consumer and account for them.
- After changes, verify existing routes still respond (see the verification checklist).
- Never change a public function/component signature without updating all call sites.
- Additive-by-default: extend, don't mutate, existing contracts.

### E — Expandable
Build so future features slot in without major rewrites.
- Design data shapes and component props for the known roadmap, not just today's screen.
- Prefer composition and configuration over duplication.
- Keep single sources of truth (e.g. `roadmap.ts`, `marketStudy.ts`, `sampleData.ts`, design tokens).
- Leave clear seams where the next phase plugs in (e.g. swapping mock data for real queries).

### S — Stepwise / Systematic
Work methodically: analyze → plan → implement → test → verify → finalize.
- State the plan before coding (which files, why).
- Implement in small, coherent steps.
- Verify each step; don't stack unverified changes.
- Finalize only after types pass, routes respond, and no regressions are observed.

---

## The Workflow (how "Stepwise" is executed)

1. **Analyze** — read the relevant files and existing patterns first. Understand the blast radius.
2. **Plan** — list the exact files to add/edit and the reason for each. Identify shared code and its consumers.
3. **Implement** — make surgical edits, reusing primitives and tokens.
4. **Test** — `npx tsc --noEmit` (types) + build where relevant.
5. **Verify** — confirm new behavior AND that existing routes/flows still work.
6. **Finalize** — update the tracker (`roadmap.ts` + `docs/PROJECT_TRACKER.md`) in the same pass; summarize what changed.

---

## Pre-Flight Checklist (before writing code)

- [ ] Do I understand the existing pattern for this kind of change? (found a sibling example)
- [ ] What shared code will this touch, and who consumes it?
- [ ] Can this be additive instead of a rewrite?
- [ ] Which design-system primitives and tokens already exist for this?
- [ ] What could regress, and how will I check it?

## Post-Flight Checklist (before finalizing)

- [ ] `npx tsc --noEmit` passes (exit 0).
- [ ] New route(s) respond as expected; a `307` on protected routes is correct.
- [ ] Existing key routes still return `200` (`/`, `/find-braiders`, `/dashboard`).
- [ ] No new mock data inlined outside `sampleData.ts`.
- [ ] No hard-coded themed colors/sizes; tokens used.
- [ ] Tracker updated (`roadmap.ts` + `docs/PROJECT_TRACKER.md`) and in sync.
- [ ] Change summary written: what, why, what was verified.

---

## Braidel-Specific Guardrails

These are the project's recurring regression traps (also in `CLAUDE_HANDOFF.md` §6):

- This is **Next.js 16** — check `node_modules/next/dist/docs/` before assuming an API.
- Auth/route protection is in **`src/proxy.ts`**, not `middleware.ts`.
- **Clerk v7** has no `<SignedIn>`/`<SignedOut>` — use `useAuth()` / server helpers.
- Google Fonts `@import` must be the **first line** of `globals.css`.
- Components with event handlers need **`"use client"`**.
- Verify via `curl` for HTTP status; the preview screenshot tool is flaky here.

---

## Definition of Done

A change is done when it is **Surgical** (minimal), **Clean** (typed, readable),
**Architecture-Aligned** (uses existing patterns), **Low-Regression** (verified not
to break anything), **Expandable** (future-friendly), and delivered **Stepwise**
(analyzed, implemented, and verified) — with the tracker updated to match.
