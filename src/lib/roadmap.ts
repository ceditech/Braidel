/* ══════════════════════════════════════════════════════════════════
   Braidel — Implementation Roadmap (single source of truth)

   This file drives the in-dashboard Tracker page. To update progress,
   change an item's `status` here and the Tracker reflects it instantly.

   status:   "done" | "in_progress" | "pending" | "blocked"
   priority: "high" | "medium" | "low"
   phase:    PRD phase number (1–7)
   ══════════════════════════════════════════════════════════════════ */

export type Status = "done" | "in_progress" | "pending" | "blocked";
export type Priority = "high" | "medium" | "low";

export interface RoadmapItem {
  title: string;
  status: Status;
  priority: Priority;
  phase: number | number[];
  note?: string;
}

export interface RoadmapGroup {
  id: string;
  label: string;
  description: string;
  items: RoadmapItem[];
}

export const ROADMAP: RoadmapGroup[] = [
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Framework, hosting, tooling",
    items: [
      { title: "Next.js 16 app (TS, Tailwind v4, App Router, src/)", status: "done", priority: "high", phase: 1 },
      { title: "Neon (Postgres) connected & migrated", status: "done", priority: "high", phase: 1 },
      { title: "Clerk auth + route protection (proxy.ts)", status: "done", priority: "high", phase: 1 },
      { title: "Drizzle ORM + migration scripts", status: "done", priority: "high", phase: 1 },
      { title: "Environment config (.env.local)", status: "done", priority: "high", phase: 1 },
      { title: "Vercel git deployment (production braidel.com + preview per push)", status: "done", priority: "high", phase: 1, note: "Vercel project braidel is linked to GitHub (ceditech/Braidel). Merges to main deploy to production (braidel.com, www.braidel.com); other branches get preview deployments. Confirmed in Vercel: PR #12 (CMS Phase 2) deployed to production on August 30, 2026." },
      { title: "CI checks (typecheck, lint, build, migration consistency)", status: "pending", priority: "high", phase: 1, note: "No .github workflows exist. Vercel builds on every push, but typecheck, lint, and migration drift are not enforced before merge, and full lint still fails (2 errors, both in the Braidel Design System/ reference folder). Tracked as a production launch gate in PRE-PRODUCTION-RELEASE-CHECKS.md." },
    ],
  },
  {
    id: "database",
    label: "Database Schema",
    description: "Tables & relations in Neon",
    items: [
      { title: "users table", status: "done", priority: "high", phase: 1 },
      { title: "salons table", status: "done", priority: "high", phase: 1 },
      { title: "braiders table", status: "done", priority: "high", phase: 1 },
      { title: "opportunities table", status: "done", priority: "high", phase: 1 },
      { title: "applications table", status: "done", priority: "high", phase: 1 },
      { title: "braid_styles table", status: "done", priority: "high", phase: 1 },
      { title: "messages table", status: "done", priority: "high", phase: 1 },
      { title: "ratings table", status: "done", priority: "high", phase: 1 },
      { title: "portfolio_media table", status: "done", priority: "high", phase: 1 },
      { title: "notifications table", status: "done", priority: "high", phase: 1 },
      { title: "notification_preferences table", status: "done", priority: "medium", phase: 1 },
      { title: "client_profiles table", status: "done", priority: "high", phase: 2 },
      { title: "service_providers table", status: "done", priority: "high", phase: 2 },
      { title: "service_offerings table", status: "done", priority: "high", phase: 2 },
      { title: "availability_rules table", status: "done", priority: "high", phase: 2 },
      { title: "availability_exceptions table", status: "done", priority: "high", phase: 2 },
      { title: "bookings table", status: "done", priority: "high", phase: 2 },
      { title: "booking_status_history table", status: "done", priority: "high", phase: 2 },
      { title: "rating_history table", status: "done", priority: "high", phase: 2 },
      { title: "provider_payment_accounts table", status: "done", priority: "high", phase: 3 },
      { title: "booking_payments table", status: "done", priority: "high", phase: 3 },
      { title: "payment_ledger_entries table", status: "done", priority: "high", phase: 3 },
      { title: "payment_webhook_events table", status: "done", priority: "high", phase: 3 },
      { title: "provider_review_responses table", status: "done", priority: "high", phase: 4 },
      { title: "provider_review_response_history table", status: "done", priority: "high", phase: 4 },
      { title: "review_reports table", status: "done", priority: "high", phase: 4 },
      { title: "provider_verifications table", status: "done", priority: "high", phase: 4 },
      { title: "verification_evidence table", status: "done", priority: "high", phase: 4 },
      { title: "verification_status_history table", status: "done", priority: "high", phase: 4 },
      { title: "marketplace_admin_actions table", status: "done", priority: "high", phase: 4, note: "Append-only admin audit ledger (migration 0018). Its target_type check constraint was widened by 0020 (user_account), 0021 (provider_profile), and 0024 (cms_page)." },
      { title: "review_reminder_events table", status: "done", priority: "medium", phase: 4, note: "Migration 0022. Unique (booking_id, reminder_number) makes capped review reminders idempotent." },
      { title: "cms_pages table", status: "done", priority: "medium", phase: 1, note: "Migration 0023. One row per editable marketing page (slug, title, draft/published status)." },
      { title: "cms_sections table", status: "done", priority: "medium", phase: 1, note: "Migration 0023. JSON content per page section, unique on (page_id, key)." },
    ],
  },
  {
    id: "design-system",
    label: "Design System",
    description: "Tokens & UI primitives",
    items: [
      { title: "Design tokens (color, type, spacing, motion)", status: "done", priority: "high", phase: 1 },
      { title: "braid.el wordmark + rose/ink brand system", status: "done", priority: "high", phase: 1 },
      { title: "Persistent light/dark theme across shared app chrome", status: "done", priority: "high", phase: 1 },
      { title: "Brand fonts (Bricolage / Hanken / JetBrains)", status: "done", priority: "high", phase: 1 },
      { title: "Button, Card, Badge, Tag components", status: "done", priority: "high", phase: 1 },
      { title: "Avatar, Rating, StatCard, Logo components", status: "done", priority: "high", phase: 1 },
      { title: "Form inputs (Input, Select, Switch, Checkbox, Textarea)", status: "done", priority: "high", phase: 1 },
      { title: "Tabs component", status: "done", priority: "medium", phase: 1 },
      { title: "Alert, Modal components", status: "done", priority: "medium", phase: 1 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Site",
    description: "Public-facing pages",
    items: [
      { title: "Navbar (auth-aware)", status: "done", priority: "high", phase: 1 },
      { title: "Footer", status: "done", priority: "high", phase: 1 },
      { title: "Editorial braid.el landing page", status: "done", priority: "high", phase: 1 },
      { title: "Marketplace landing preserved at /marketplace", status: "done", priority: "high", phase: 1 },
      { title: "Find Braiders page", status: "done", priority: "high", phase: 2 },
      { title: "Find Salons page", status: "done", priority: "high", phase: 2 },
      { title: "Salon detail page", status: "done", priority: "high", phase: 2 },
      { title: "Job Opportunities page", status: "done", priority: "high", phase: 1 },
      { title: "Job Opportunity detail page", status: "done", priority: "high", phase: 1 },
      { title: "Braider profile page", status: "done", priority: "high", phase: 2 },
      { title: "Pricing page", status: "done", priority: "medium", phase: 1, note: "Live at /pricing with a 'free during this phase' message. Intentionally not linked from the Navbar or Footer until real pricing is decided; promote it by adding a Footer link at that point." },
      { title: "How It Works page", status: "done", priority: "low", phase: 1, note: "Live at /how-it-works: three-step flow plus per-audience (salon, braider, client) cards." },
      { title: "About / Contact / Blog / FAQ", status: "done", priority: "low", phase: 1, note: "Live at /about, /contact, /blog, /faq. Contact is static info only (email and Instagram links, no form). Blog is an intentional 'coming soon' placeholder with no post system. FAQ is a native details/summary accordion." },
      { title: "Terms & Privacy pages", status: "in_progress", priority: "high", phase: 1, note: "Live at /terms and /privacy with clearly marked DRAFT copy. Needs legal review and alignment with real data handling, retention, and deletion behavior before launch (release gate in PRE-PRODUCTION-RELEASE-CHECKS.md)." },
      { title: "Marketing content CMS (admin editor, draft/publish)", status: "done", priority: "medium", phase: 1, note: "Admin-only editor at /dashboard/admin/content, linked from the admin portal. One schema-driven form (src/content/marketing/registry.ts) covers all 8 pages; edits save as draft and go live on Publish, overriding the static defaults in src/content/marketing/*.ts. Public pages fall back to the static copy on any error, and the SEO meta description follows published content. Verified end to end in development (draft, publish, revalidation, list/nested fields; test edits reverted) and the 8 public pages were spot-checked on production on August 30, 2026. The editor UI itself has not yet been exercised on production (admin sign-in required)." },
    ],
  },
  {
    id: "auth",
    label: "Auth & Onboarding",
    description: "Account creation & role setup",
    items: [
      { title: "Sign-in page (Clerk)", status: "done", priority: "high", phase: 1 },
      { title: "Sign-up page (Clerk)", status: "done", priority: "high", phase: 1 },
      { title: "Onboarding role selection", status: "done", priority: "high", phase: 1 },
      { title: "Onboarding API (writes user to Neon)", status: "done", priority: "high", phase: 1 },
      { title: "Clerk webhook → user sync", status: "done", priority: "medium", phase: 1 },
    ],
  },
  {
    id: "salon-app",
    label: "Salon Dashboard",
    description: "Salon owner workflows",
    items: [
      { title: "App shell (Sidebar + Topbar)", status: "done", priority: "high", phase: 1 },
      { title: "Salon dashboard home", status: "done", priority: "high", phase: 1 },
      { title: "Opportunities list", status: "done", priority: "high", phase: 1 },
      { title: "Post Opportunity form", status: "done", priority: "high", phase: 1 },
      { title: "Manage Applicants screen", status: "done", priority: "high", phase: 1 },
      { title: "Applicant profile + portfolio drawer", status: "done", priority: "high", phase: 1 },
      { title: "Appointments calendar + booking setup", status: "done", priority: "high", phase: 2 },
      { title: "Verification evidence workspace", status: "done", priority: "high", phase: 4, note: "Provider-owned evidence submission and review-readiness tracking at /dashboard/verification. Manual QA passed August 9, 2026 (after proof-quality enforcement). Sensitive evidence file upload remains deferred to a later slice." },
    ],
  },
  {
    id: "braider-app",
    label: "Braider Dashboard",
    description: "Braider workflows",
    items: [
      { title: "Demo role switch (salon / braider)", status: "done", priority: "high", phase: 1 },
      { title: "Braider dashboard home", status: "done", priority: "high", phase: 1 },
      { title: "Find Work (search + apply)", status: "done", priority: "high", phase: 1 },
      { title: "Applications tracker", status: "done", priority: "high", phase: 1 },
      { title: "Profile editor + portfolio upload", status: "done", priority: "high", phase: 1 },
      { title: "Appointments calendar + booking setup", status: "done", priority: "high", phase: 2 },
      { title: "Verification evidence workspace", status: "done", priority: "high", phase: 4, note: "Provider-owned evidence submission and review-readiness tracking at /dashboard/verification. Manual QA passed August 9, 2026 (after proof-quality enforcement). Sensitive evidence file upload remains deferred to a later slice." },
    ],
  },
  {
    id: "shared-app",
    label: "Shared App",
    description: "Cross-role features",
    items: [
      { title: "Messaging (DB-backed list + thread)", status: "done", priority: "high", phase: 1 },
      { title: "Notifications page", status: "done", priority: "medium", phase: 1 },
      { title: "Settings page (role-aware)", status: "done", priority: "medium", phase: 1 },
      { title: "Client booking discovery + appointment management", status: "done", priority: "high", phase: 2 },
      { title: "Booking review visibility, update notifications, and audit history", status: "done", priority: "high", phase: 2 },
      { title: "Payment system design insight page", status: "done", priority: "medium", phase: 3 },
      { title: "Provider reviews dashboard", status: "done", priority: "high", phase: 4, note: "Manual QA passed August 1, 2026 for provider access, client redirect protection, scoped data, drawer details, booking deep links, and responsive light/dark checks." },
      { title: "Provider review responses + report intake", status: "done", priority: "high", phase: 4, note: "Manual QA passed August 1, 2026. Migration 0016_absurd_slyde.sql added provider response create/update with Client notifications, response audit history, appointment drawer visibility, and one provider report per review." },
      { title: "Verification evidence foundation", status: "done", priority: "high", phase: 4, note: "Manual QA passed August 9, 2026 after proof-quality enforcement was added. Migration 0017_flat_leopardon.sql added provider verification profiles, evidence records, status history, provider-only /dashboard/verification, and protected evidence/submit APIs." },
      { title: "Admin and moderation surface", status: "in_progress", priority: "high", phase: 4, note: "Implementation added migrations 0018_spooky_tattoo.sql, 0019_curved_silver_centurion.sql, 0020_grey_turbo.sql, and 0021_reflective_princess_powerful.sql. /dashboard/admin now has Performance, Users, Money, and Moderation tabs with live KPIs, safe user profile edits, explicit account suspension/restoration, provider profile unlisting/relisting, audited admin actions, booking commission visibility, and the original verification/review-report moderation queues. Development migrations are applied. Manual QA (August 29, 2026) with the project owner passed for Performance (real KPIs, donut/bar/line charts), Money, and all Users lifecycle actions verified live end to end: Unlist/Relist (confirmed a salon disappears from and returns to /find-salons), Suspend/Restore (confirmed status flips to suspended/active), and Promote admin (confirmed an allowlisted user's role flips to admin). Moderation tab renders real verification-queue and review-report data with an honest empty state for reports. Not yet exercised: actually approving/rejecting a pending verification submission or review report, since the only pending verifications in dev belong to the project owner's own real accounts — deferred until they opt in to that specific test." },
    ],
  },
  {
    id: "backend",
    label: "Backend / API",
    description: "Data routes & business logic",
    items: [
      { title: "Schema extensions + migrations", status: "done", priority: "high", phase: 1 },
      { title: "DB seed script", status: "done", priority: "high", phase: 1 },
      { title: "DB query layer (reads)", status: "done", priority: "high", phase: 1 },
      { title: "Wire Find Braiders to DB", status: "done", priority: "high", phase: 1 },
      { title: "Wire Find Salons to DB", status: "done", priority: "high", phase: 1 },
      { title: "Wire Job Opportunities to DB", status: "done", priority: "high", phase: 1 },
      { title: "Wire dashboards to DB", status: "done", priority: "high", phase: 1 },
      { title: "Application read/create/status flows", status: "done", priority: "high", phase: 1 },
      { title: "Profile + settings DB persistence", status: "done", priority: "high", phase: 1 },
      { title: "Messaging DB persistence", status: "done", priority: "high", phase: 1 },
      { title: "Ratings read/write flows", status: "done", priority: "high", phase: 1 },
      { title: "Portfolio media persistence", status: "done", priority: "high", phase: 1 },
      { title: "Notifications persistence + event wiring", status: "done", priority: "high", phase: 1 },
      { title: "Availability engine + transactional booking lifecycle APIs", status: "done", priority: "high", phase: 2 },
      { title: "Review audit history + update notification wiring", status: "done", priority: "high", phase: 2 },
      { title: "Payment foundation schema + fee split helpers", status: "done", priority: "high", phase: 3 },
      { title: "Provider review response/report APIs", status: "done", priority: "high", phase: 4 },
      { title: "Provider verification evidence APIs", status: "done", priority: "high", phase: 4 },
      { title: "Marketplace admin decision APIs + explicit account/profile lifecycle controls", status: "done", priority: "high", phase: 4, note: "Migration 0021_reflective_princess_powerful.sql splits moderation into accountStatus active/suspended for protected access and provider visibility listed/unlisted for public discovery/bookability. Admin actions now audit Suspend/Restore access separately from Unlist/Relist profile. Deferred hardening: if the provider model expands beyond Salon owners/Braiders, replace provider-row inference with an explicit provider-role/domain helper. isMarketplaceAdmin now requires role='admin' in Neon in addition to an allowlisted BRAIDEL_ADMIN_EMAILS entry, closing an email-only privilege path. A new Promote admin action lets an existing admin grant the admin role to another user, gated on that user's email already being allowlisted. Manual QA (August 29, 2026) passed: verified live that Suspend/Restore, Unlist/Relist, and Promote admin all correctly persist and are reflected in the public-facing app (an unlisted salon disappears from /find-salons and returns on relist)." },
      { title: "Admin \"preview as\" mode (Salon/Braider/Client) for UI review and QA", status: "done", priority: "medium", phase: 4, note: "Sidebar adds Preview as Salon/Braider/Client for allowlisted admins, backed by a POST /api/admin/preview route that sets an httpOnly cookie (admin-gated, validated). requireDashboardRole and dashboard/page.tsx honor the preview role via getEffectiveDashboardRole, so an admin sees each role's real dashboard shell. Deliberately scoped to the admin's own (empty) records - queries stay clerkId-scoped, so preview never exposes another user's data. Live manual QA (August 29, 2026) with the project owner found this guarantee was not actually true: an includeDemoRows() helper in src/db/queries.ts (gated on NODE_ENV !== 'production') merged in — or in two messaging queries, stopped filtering to — every other user's real applications, applicants, and message conversations in any non-production environment, including this preview mode itself. Root cause predates this feature; it was a pre-existing 'make dev look populated' pattern across 5 call sites (getOpportunitiesForSalon, getApplicationsForBraider, getApplicantsForSalon, and both getApplicationConversations/getBookingConversations messaging queries), not something introduced by preview mode. Fixed by removing includeDemoRows()/uniqueById() entirely and the two now-dead unscoped exports (getApplications(), getApplicants()) that had no other callers; two related 'no owner row found' fallbacks that also returned all rows unscoped now return an empty array instead. getOpportunities() (public job listings — intentionally public data) was left as-is. Re-verified live: admin preview now shows a genuine empty state (0 applications, 'No applications yet', 'No appointment or application conversations yet.'), the public /opportunities marketplace is unaffected, and a real signed-in test user's own dashboard/messages still render correctly. tsc/eslint clean. Live authenticated QA now complete for the admin account; the documented privacy guarantee is now actually true." },
      { title: "Admin dashboard insight charts (donut/bar/line)", status: "done", priority: "medium", phase: 4, note: "New dependency-free SVG chart primitives (DonutChart, BarChart, TrendLineChart in src/components/ui/) added to the admin Performance tab: user role composition (donut), booking lifecycle and provider verification (bar, alongside the existing numeric grids - not replacing them), and a bookings-created trend (line) backed by a new getAdminBookingTrend() query. The trend query is isolated in its own try/catch and zero-fills 14 days so a query hiccup degrades to an empty chart rather than failing the whole admin dashboard. User-composition and booking-lifecycle categories are now fully data-driven: getAdminUserRoleDistribution()/getAdminBookingStatusDistribution() GROUP BY users.role / bookings.status live, so a future enum value appears automatically (with a title-cased fallback label + rotating palette color) rather than requiring a chart code change - Provider verification stays a fixed 4-metric bar since it's inherently a 2-type structure, not an enum list. All three charts now show an elegant animated tooltip on hover and animate in on mount (donut sweep, bar grow, line reveal via clip-path). Verified: both new distribution queries tested directly against dev Neon (scripts/verify-admin-distributions.ts, scripts/verify-booking-trend.ts), tsc/build clean, existing admin markup unchanged. Live visual QA (August 29, 2026) passed: all three charts confirmed rendering real, non-empty data via DOM inspection (donut: 5 real arc segments; trend line: 2 real paths with 28 real data points; bar sections: correct real numbers/labels for booking lifecycle and provider verification)." },
      { title: "Marketplace trust signals in discovery (Slice 6.5)", status: "done", priority: "high", phase: 4, note: "Public braider/salon profiles show real booking-verified reviews (first name + last initial only), a live-aggregated rating, completed-booking count, braider portfolio-photo count, and provider response rate. 'Verified' claims render only when the provider's real isVerified flag is true. No schema change. Visually confirmed in the August 29, 2026 live QA session. Known gap: the salon detail About cards and the 'Vetted braiders' line are still hardcoded (see Known Issues Backlog)." },
      { title: "Capped Client review reminders (Slice 6.6)", status: "done", priority: "high", phase: 4, note: "Migration 0022 (review_reminder_events). Idempotent, capped at 5, stops as soon as a review exists, honors the Account activity preference. Runs opportunistically from the notifications API and page because the app has no scheduler yet. Manual QA passed August 29, 2026." },
      { title: "Marketing content write API + published-content resolver", status: "done", priority: "medium", phase: 1, note: "PATCH /api/admin/content/[slug]: admin-gated, validates the slug and sections against the registry, sanitizes fields (length caps, select options, nested objects default-filled), upserts cms_pages/cms_sections in one transaction, writes a marketplace_admin_actions audit row, and revalidates the public path. Public pages read published content through resolveMarketingContent(), which never throws and falls back to the static copy." },
    ],
  },
  {
    id: "strategic-workstreams",
    label: "Strategic Implementation Workstreams",
    description: "Core gaps and next product phases, ordered for low-regression delivery",
    items: [
      {
        title: "1. Real role state + client account foundation",
        status: "done",
        priority: "high",
        phase: 1,
        note: "Single-role accounts now derive dashboard state from the authenticated Neon user, onboarding completion is explicit, incompatible role routes redirect server-side, and clients have dashboard and settings foundations.",
      },
      {
        title: "2. Booking domain schema + migrations",
        status: "done",
        priority: "high",
        phase: 2,
        note: "Migration 0011 adds client and provider booking identities, services, recurring availability and exceptions, bookings with timezone-aware instants and integer-cent snapshots, status history, lifecycle constraints, indexes, and existing-profile backfills.",
      },
      {
        title: "3. Booking APIs + appointments/calendar UI",
        status: "done",
        priority: "high",
        phase: 2,
        note: "Provider services, timezone, capacity, recurring schedules, exceptions, DST-safe availability, idempotent booking requests, lifecycle actions, and role-aware calendar, agenda, and booking views are live.",
      },
      {
        title: "4. Booking-aware conversations, reviews + notifications",
        status: "done",
        priority: "high",
        phase: 2,
        note: "Migrations 0013 and 0014 add booking-scoped messages and reviews, booking lifecycle notifications, client appointment conversations, direct appointment message links, completed-booking provider reviews, provider-visible review details, update notifications, and review audit history.",
      },
      {
        title: "5. Payments + monetization",
        status: "in_progress",
        priority: "high",
        phase: 3,
        note: "Foundation slice QA passed: payment accounts, booking payments, ledger entries, webhook idempotency schema, server-side fee split helpers, payment architecture documentation, and an internal Payment System Design insight page are added. Client-to-Provider booking payments are the primary Stripe Connect launch track. Salon-to-Braider agreement capture is required later, while in-app money movement is deferred until policy and operations mature. Workstream remains in progress until live Stripe checkout, Connect onboarding, webhooks, refunds, disputes, and payouts are intentionally implemented.",
      },
      {
        title: "6. Trust, verification + marketplace administration",
        status: "in_progress",
        priority: "high",
        phase: 4,
        note: "Slices 6.1-6.3 and 6.5-6.6 are implemented and manual-QA passed. Slice 6.4 is implemented and QA-passed except the verification and review-report approve/reject decision actions, which have not been exercised. 6.1 provider reviews dashboard (QA August 1, 2026). 6.2 provider responses and report intake (migration 0016, QA August 1). 6.3 verification evidence foundation with proof-quality enforcement (migration 0017, QA August 9). 6.4 admin and moderation: allowlist plus role-gated /dashboard/admin, audited actions, account suspension separate from profile unlisting, Promote admin, Preview as, data-driven charts (migrations 0018-0021, QA August 29). 6.5 trust signals in discovery: booking-verified reviews, live rating aggregates, completed-booking and portfolio counts, response rate, verified claims gated on the real isVerified flag (no schema change; visually confirmed August 29). 6.6 capped Client review reminders (migration 0022; idempotent; QA August 29). Before this workstream can close: exercise the admin approve/reject decisions, define the sensitive-evidence file upload policy, design formal dispute resolution and appeals, add an explicit provider-role helper if provider types expand, move the applicant-listing queries off the legacy stored rating columns, and replace the opportunistic review-reminder trigger with a real scheduler. Full history: docs/PROJECT_TRACKER.md and docs/WORKSTREAM_6_TRUST_VERIFICATION_PLAN.md.",
      },
      {
        title: "7. Ecosystem expansion: Academy, Supply, Franchise + mobile",
        status: "pending",
        priority: "medium",
        phase: [5, 6, 7],
        note: "Scope each later PRD phase before implementation: learning and certification, wholesale commerce, franchise operations, then native mobile clients.",
      },
    ],
  },
  {
    id: "production-readiness",
    label: "Production Readiness & Hardening",
    description: "Launch gates and operational risk, ordered by risk (from the November 9, 2026 audit)",
    items: [
      { title: "Isolate local development from the production database (Neon dev branch + script guards)", status: "done", priority: "high", phase: 1, note: "Neon project Braidel now has two branches: production and development (a copy-on-write fork created November 9, 2026). Local .env.local points at development and lists the production hostname in BRAIDEL_PRODUCTION_DB_HOSTS. src/db/safety.ts makes db:seed and verify:booking refuse production hosts (direct or pooled), refuse when the list is unset, and refuse in a production environment; npm run db:target reports the target and db:migrate prints it first. Verified: guard paths, db:migrate and verify:booking on development, and a canary write to development that was absent from production." },
      { title: "Point Vercel Preview deployments at the development database", status: "done", priority: "high", phase: 1, note: "Done November 10, 2026: DATABASE_URL is now two Vercel variables, Production (Neon production branch) and Preview (Neon development branch), both Sensitive. Verified on the PR #14 preview: it showed a change made only in the development database while braidel.com did not. Preview still shares the Clerk development keys, which is handled by the Clerk production item." },
      { title: "Give the development branch its own database password", status: "done", priority: "high", phase: 1, note: "A Neon branch inherits its parent's role passwords, so development initially shared production's neondb_owner password. Reset on November 9, 2026 (development branch only) and .env.local refreshed. Verified with a script that never prints credentials: the two passwords differ, the development password is rejected by the production host, and each credential works on its own host." },
      { title: "Rotate the production database password", status: "pending", priority: "medium", phase: 1, note: "The production connection string was printed once into a local assistant session transcript on November 9, 2026. Rotating it requires updating the Vercel Production DATABASE_URL and redeploying, so schedule it deliberately." },
      { title: "Re-link existing accounts by verified email when the Clerk instance changes", status: "done", priority: "high", phase: 1, note: "src/lib/clerk-link-domain.ts decides link/insert/conflict; clerk-sync.ts relinkClerkIdentityByEmail attaches a new Clerk ID to the existing user row with the same VERIFIED email (never unverified or deleted rows), keeping role, onboarding and history. Used by the webhook sync, the first sign-in miss in requireOnboardedUser, and the onboarding route. Verified: npm run verify:clerk-link (6 rule cases) and a throwaway-row check on the development branch (conflict when unverified, link when verified with role preserved, idempotent repeat, unknown email unchanged)." },
      { title: "Clerk production instance + identity webhook", status: "done", priority: "high", phase: 1, note: "Done November 10, 2026. braidel.com now uses the Clerk production instance (DNS verified in GoDaddy, SSL issued, Google + email sign-in), Production and Preview have separate Clerk keys, and /api/webhooks/clerk is active with a Production-only signing secret. Verified: live key on the deployed page, admin sign-in with role preserved via the verified-email re-link, and a disposable-user lifecycle (created, updated, deleted all delivered; Neon row tombstoned). Open follow-ups: turn off the unused Username requirement, retire the old development Clerk app, audit leftover development-era accounts, and Vercel Hobby keeps runtime logs for one hour only." },
      { title: "Patch dependency vulnerabilities", status: "pending", priority: "high", phase: 1, note: "npm audit --omit=dev (November 9, 2026): 11 advisories (1 critical, 9 high, 1 moderate). The critical one is next (installed 16.2.7; audit lists 16.4.6 as the non-major fix). The @vercel/blob chain (@vercel/oidc, @vercel/cli-config, zod) plus nanoid, undici, source-map-js, and sharp need triage." },
      { title: "Automated test suite (domain unit tests + smoke tests)", status: "pending", priority: "high", phase: 1, note: "No test runner is installed; regression protection is manual QA plus three ad hoc scripts/verify-*.ts files. Start with unit tests for payments-domain, booking-availability, review-reminders, and the CMS sanitizer, then a small Playwright smoke suite for the public routes." },
      { title: "Error monitoring, uptime alerting, and rate limiting", status: "pending", priority: "high", phase: 1, note: "None exist. Add runtime error monitoring and uptime checks, and rate-limit public and write routes (applications, messages, onboarding, portfolio upload)." },
      { title: "Clear lint debt", status: "pending", priority: "medium", phase: 1, note: "npm run lint exits with 2 errors and 60 warnings. Both errors are in the Braidel Design System/ reference folder, which is not part of the app; exclude it from lint or fix it so CI can require a clean lint." },
      { title: "Admin toggle to show or hide seeded demo profiles on public pages", status: "pending", priority: "medium", phase: 4, note: "Seeded demo braiders and salons (clerk_id starting 'seed_') currently appear next to real profiles in public discovery. Decision (November 9, 2026): keep them as demo content for now, but give admins a switch to hide them (production-like checks) or display them (testing). Needs a small persisted settings store and a filter in the public discovery queries; do not purge production seed data until this exists." },
    ],
  },
  {
    id: "known-issues",
    label: "Known Issues Backlog",
    description: "Defects reported in manual QA (screenshots in docs/Issues/); none scheduled yet",
    items: [
      { title: "Portfolio image upload fails in production", status: "pending", priority: "high", phase: 1, note: "Reported August 26, 2026 on braidel.com. Cause confirmed November 9, 2026: BLOB_READ_WRITE_TOKEN is not set in any Vercel environment, so src/lib/portfolio-storage.ts throws 'Portfolio storage is not configured' in production. Create a Vercel Blob store and connect it to the project." },
      { title: "Braider Settings: profile fields and specialties not persisting; no profile photo upload", status: "pending", priority: "high", phase: 1, note: "Reported August 26, 2026 (screenshots); not re-verified since. The photo control is a disabled 'Photo upload later' button (SettingsClient.tsx)." },
      { title: "Find Work: 'Apply now' never becomes 'Already applied'", status: "pending", priority: "medium", phase: 1, note: "Reported August 26, 2026. FindWorkClient.tsx only has 'Applying...' and 'Apply now' states; after applying, the button should switch to a disabled 'Already applied'." },
      { title: "Salon profile About cards and 'Vetted braiders' claim are hardcoded", status: "pending", priority: "high", phase: 4, note: "SalonDetailClient.tsx hardcodes Established 2018, Team 8 braiders, Stations 6, and Amenities for every salon, plus an unconditional 'Vetted braiders' line. These must come from the owner's profile, or be hidden when empty." },
      { title: "Public pages show fabricated figures and sample data", status: "pending", priority: "high", phase: 4, note: "/marketplace shows hardcoded '12k+ braiders / 3.4k salons / 4.9' stats and braiders from sampleData; FindBraidersClient.tsx uses TOTAL_POOL = 12480 as a headline count. The database holds a few dozen users. Replace with real counts or remove, per the project's own honesty rule." },
      { title: "Admin Users: profile form shows stale data when another user is selected", status: "pending", priority: "medium", phase: 4, note: "Reported August 28, 2026: selecting a different user leaves the previous user's name and admin note in the form." },
      { title: "Salon Opportunities: no empty state", status: "pending", priority: "low", phase: 1, note: "Reported August 30, 2026: with no opportunities the page is blank. It should show a friendly empty state with a Post opportunity button." },
    ],
  },
];

/* ── Derived helpers ─────────────────────────────────────────────── */

export interface StatusCounts {
  done: number;
  in_progress: number;
  pending: number;
  blocked: number;
  total: number;
}

export function countItems(items: RoadmapItem[]): StatusCounts {
  const counts: StatusCounts = { done: 0, in_progress: 0, pending: 0, blocked: 0, total: items.length };
  for (const item of items) counts[item.status]++;
  return counts;
}

export function allItems(): RoadmapItem[] {
  return ROADMAP.flatMap((g) => g.items);
}

export function overallCounts(): StatusCounts {
  return countItems(allItems());
}

export function percentComplete(counts: StatusCounts): number {
  if (counts.total === 0) return 0;
  // in_progress counts as half toward completion
  return Math.round(((counts.done + counts.in_progress * 0.5) / counts.total) * 100);
}

/* ── Phase tracking (PRD phases 1–7) ─────────────────────────────── */

export const PHASE_LABELS: Record<number, string> = {
  1: "Workforce & Staffing",
  2: "Client Booking",
  3: "Online Payments",
  4: "Reputation & Verification",
  5: "Braidel Academy",
  6: "Braidel Supply",
  7: "Salon Franchise",
};

export interface PhaseProgress {
  phase: number;
  label: string;
  counts: StatusCounts;
  pct: number;
}

/** Progress rolled up per PRD phase, ordered by phase number. */
export function phaseProgress(): PhaseProgress[] {
  const byPhase = new Map<number, RoadmapItem[]>();
  for (const item of allItems()) {
    const phases = Array.isArray(item.phase) ? item.phase : [item.phase];
    for (const phase of phases) {
      const list = byPhase.get(phase) ?? [];
      list.push(item);
      byPhase.set(phase, list);
    }
  }
  return [...byPhase.entries()]
    .sort(([a], [b]) => a - b)
    .map(([phase, items]) => {
      const counts = countItems(items);
      return { phase, label: PHASE_LABELS[phase] ?? `Phase ${phase}`, counts, pct: percentComplete(counts) };
    });
}
