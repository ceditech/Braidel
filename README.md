# braid.el (Braidel)

A workforce and booking marketplace for the hair braiding industry. Salon owners
post opportunities and hire braiders; clients discover and book braiders and
salons; everyone messages, reviews, and builds trust through verification.

Live at [braidel.com](https://braidel.com). Product requirements:
[`docs/Braidel.pdf`](docs/Braidel.pdf).

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 with
CSS design tokens · Clerk v7 (auth) · Neon Postgres + Drizzle ORM · Vercel Blob
(media) · Vercel (hosting). Stripe Connect is planned; no payment flow is live.

> This is **not** the Next.js you may know. Read the matching guide in
> `node_modules/next/dist/docs/` before relying on an API (see
> [`AGENTS.md`](AGENTS.md)). Route protection lives in `src/proxy.ts`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3003
```

Required environment variables are listed in [`.env.example`](.env.example):
`DATABASE_URL`, the Clerk keys, `CLERK_WEBHOOK_SIGNING_SECRET`,
`BRAIDEL_ADMIN_EMAILS` (comma-separated admin allowlist), `BLOB_READ_WRITE_TOKEN`
(required for portfolio uploads in production), and the Stripe keys (only needed
once payments are activated).

> ⚠️ **Shared database.** Production and local development currently use the
> **same Neon database**, and `npm run db:seed` has no production guard. Treat
> `db:migrate`, `db:seed`, and any script that writes data as a production
> command until a separate Neon dev branch exists.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server on port 3003 |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint (currently 2 known errors in `Braidel Design System/`) |
| `npx tsc --noEmit` | Type check |
| `npm run db:generate` | Generate a Drizzle migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations to the configured database |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run db:seed` | Seed demo data (re-runnable; removes only `seed_` rows) |
| `npm run verify:booking` | Reversible booking-lifecycle smoke check |

There is no automated test suite or CI yet; both are tracked as launch gates.

## Documentation

| Doc | What it covers |
|---|---|
| [`CLAUDE_HANDOFF.md`](CLAUDE_HANDOFF.md) | Architecture, conventions, gotchas, and current status — start here |
| [`STABLE_FRAMEWORK.md`](STABLE_FRAMEWORK.md) | Operating standard for every change (with [`SCALES_FRAMEWORK.md`](SCALES_FRAMEWORK.md) guardrails) |
| [`docs/PROJECT_TRACKER.md`](docs/PROJECT_TRACKER.md) | Feature and hardening status (live version at `/tracker`, driven by `src/lib/roadmap.ts`) |
| [`PRE-PRODUCTION-RELEASE-CHECKS.md`](PRE-PRODUCTION-RELEASE-CHECKS.md) | Launch gates, deferred work, and dated evidence |
| [`docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md`](docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md) | Trust, verification, and admin plan |
| [`docs/PAYMENT_SYSTEM_ARCHITECTURE.md`](docs/PAYMENT_SYSTEM_ARCHITECTURE.md) | Stripe Connect architecture decision record |
| [`docs/MARKET_STUDY.md`](docs/MARKET_STUDY.md) | Business case |

## Deployment

Pushes to `main` deploy to production on Vercel; other branches get Preview
deployments (which currently share the production database). Marketing page copy
is editable by admins at `/dashboard/admin/content`.
