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
      { title: "CI / deployment pipeline", status: "pending", priority: "medium", phase: 1 },
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
      { title: "Pricing page", status: "pending", priority: "medium", phase: 1 },
      { title: "How It Works page", status: "pending", priority: "low", phase: 1 },
      { title: "About / Contact / Blog / FAQ", status: "pending", priority: "low", phase: 1 },
      { title: "Terms & Privacy pages", status: "pending", priority: "low", phase: 1 },
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
      { title: "Verification evidence workspace", status: "in_progress", priority: "high", phase: 4, note: "Implementation added provider-owned evidence submission and review-readiness tracking. Manual QA is pending." },
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
      { title: "Verification evidence workspace", status: "in_progress", priority: "high", phase: 4, note: "Implementation added provider-owned evidence submission and review-readiness tracking. Manual QA is pending." },
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
      { title: "Admin and moderation surface", status: "in_progress", priority: "high", phase: 4, note: "Implementation added migrations 0018_spooky_tattoo.sql, 0019_curved_silver_centurion.sql, 0020_grey_turbo.sql, and 0021_reflective_princess_powerful.sql. /dashboard/admin now has Performance, Users, Money, and Moderation tabs with live KPIs, safe user profile edits, explicit account suspension/restoration, provider profile unlisting/relisting, audited admin actions, booking commission visibility, and the original verification/review-report moderation queues. Development migrations are applied; manual QA is pending." },
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
      { title: "Marketplace admin decision APIs + explicit account/profile lifecycle controls", status: "in_progress", priority: "high", phase: 4, note: "Migration 0021_reflective_princess_powerful.sql splits moderation into accountStatus active/suspended for protected access and provider visibility listed/unlisted for public discovery/bookability. Admin actions now audit Suspend/Restore access separately from Unlist/Relist profile. Deferred hardening: if the provider model expands beyond Salon owners/Braiders, replace provider-row inference with an explicit provider-role/domain helper. isMarketplaceAdmin now requires role='admin' in Neon in addition to an allowlisted BRAIDEL_ADMIN_EMAILS entry, closing an email-only privilege path. A new Promote admin action lets an existing admin grant the admin role to another user, gated on that user's email already being allowlisted." },
      { title: "Admin \"preview as\" mode (Salon/Braider/Client) for UI review and QA", status: "in_progress", priority: "medium", phase: 4, note: "Sidebar adds Preview as Salon/Braider/Client for allowlisted admins, backed by a POST /api/admin/preview route that sets an httpOnly cookie (admin-gated, validated). requireDashboardRole and dashboard/page.tsx honor the preview role via getEffectiveDashboardRole, so an admin sees each role's real dashboard shell. Deliberately scoped to the admin's own (empty) records - queries stay clerkId-scoped, so preview never exposes another user's data. Live manual QA (August 29, 2026) with the project owner found this guarantee was not actually true: an includeDemoRows() helper in src/db/queries.ts (gated on NODE_ENV !== 'production') merged in — or in two messaging queries, stopped filtering to — every other user's real applications, applicants, and message conversations in any non-production environment, including this preview mode itself. Root cause predates this feature; it was a pre-existing 'make dev look populated' pattern across 5 call sites (getOpportunitiesForSalon, getApplicationsForBraider, getApplicantsForSalon, and both getApplicationConversations/getBookingConversations messaging queries), not something introduced by preview mode. Fixed by removing includeDemoRows()/uniqueById() entirely and the two now-dead unscoped exports (getApplications(), getApplicants()) that had no other callers; two related 'no owner row found' fallbacks that also returned all rows unscoped now return an empty array instead. getOpportunities() (public job listings — intentionally public data) was left as-is. Re-verified live: admin preview now shows a genuine empty state (0 applications, 'No applications yet', 'No appointment or application conversations yet.'), the public /opportunities marketplace is unaffected, and a real signed-in test user's own dashboard/messages still render correctly. tsc/eslint clean." },
      { title: "Admin dashboard insight charts (donut/bar/line)", status: "in_progress", priority: "medium", phase: 4, note: "New dependency-free SVG chart primitives (DonutChart, BarChart, TrendLineChart in src/components/ui/) added to the admin Performance tab: user role composition (donut), booking lifecycle and provider verification (bar, alongside the existing numeric grids - not replacing them), and a bookings-created trend (line) backed by a new getAdminBookingTrend() query. The trend query is isolated in its own try/catch and zero-fills 14 days so a query hiccup degrades to an empty chart rather than failing the whole admin dashboard. User-composition and booking-lifecycle categories are now fully data-driven: getAdminUserRoleDistribution()/getAdminBookingStatusDistribution() GROUP BY users.role / bookings.status live, so a future enum value appears automatically (with a title-cased fallback label + rotating palette color) rather than requiring a chart code change - Provider verification stays a fixed 4-metric bar since it's inherently a 2-type structure, not an enum list. All three charts now show an elegant animated tooltip on hover and animate in on mount (donut sweep, bar grow, line reveal via clip-path). Verified: both new distribution queries tested directly against dev Neon (scripts/verify-admin-distributions.ts, scripts/verify-booking-trend.ts), tsc/build clean, existing admin markup unchanged. Live visual QA pending." },
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
        note: "Provider reviews dashboard and Slice 6.2 provider responses/report intake both passed manual QA on August 1, 2026. Slice 6.3 verification evidence foundation passed manual QA on August 9, 2026. Slice 6.4 admin/moderation surface is implemented with migrations 0018_spooky_tattoo.sql, 0019_curved_silver_centurion.sql, 0020_grey_turbo.sql, and 0021_reflective_princess_powerful.sql applied to development. Admin lifecycle controls now distinguish profile unlisting from account suspension. Deferred hardening is logged for an explicit provider-role helper if provider modeling expands. Manual QA remains pending. Slice 6.5 trust signals in marketplace discovery implemented August 27, 2026: real booking-verified reviews (first name + last initial only) and a completed-booking count replace the previously hardcoded review/response-time copy on /find-braiders/[id] and /find-salons/[id], and the 'Identity verified'/'Verified business' claims are now gated on the real isVerified flag instead of showing unconditionally. No schema change — reuses the existing ratings/providerReviewResponses tables. Follow-up fix same day: the public rating badge (braiders.ratingAvg/ratingCount, salons.ratingAvg/ratingCount) was a write-once seed literal never recomputed from real reviews — a live staleness bug, not just a seed inconsistency. getBraiders/getBraiderBySlug/getSalons/getSalonBySlug now join a live GROUP BY aggregate over booking-scoped ratings instead of reading the frozen columns; db/seed.ts now seeds real completed bookings + ratings rows (via a new seedCompletedBookingReviews helper) so dev data is honest rather than fabricated, and the seed cleanup query was fixed to explicitly delete seed bookings before the cascading user delete (bookings.provider_id is ON DELETE RESTRICT, so the reseed script would otherwise break on any re-run once bookings exist). The applicant-listing queries (manage-applicants dashboard) still read the legacy stored columns — intentionally left out of scope, logged as a follow-up. tsc/eslint clean; verified live against dev Neon (seeded and non-seeded accounts both show correct live-aggregated ratings, honest zero-state for accounts with no reviews). Manual QA pending. Portfolio-photo-count signal added to the braider profile (portfolio has no salon equivalent in the schema, so intentionally braider-only). Response-rate signal added August 27, 2026: a new getProviderResponseRate() computes the real % of a provider's booking-verified reviews that have a public response (full aggregate, not the display-limited review list, so it stays correct beyond 10 reviews); shown on both profile pages only when the rate is greater than 0%, per the explicit call not to surface any public dispute/report status. Verified live by temporarily inserting one real response row, confirming '20% of reviews' rendered correctly, then deleting it. tsc/eslint clean. Manual QA pending. Workstream 6 complete: capped Client review reminders (Slice 6.6) implemented August 29, 2026. New review_reminder_events table (migration 0022_messy_red_hulk.sql) is the append-only, idempotent audit trail — a unique (bookingId, reminderNumber) constraint means re-evaluating a booking can never send the same numbered reminder twice. This app has no cron/scheduler, so backfillDueReviewReminders() (src/lib/review-reminders.ts) runs opportunistically inside GET /api/notifications (already polled by the notification bell on every dashboard navigation) for client-role users, sending at most one due reminder per booking per call — a client who hasn't opened the app in a while catches up gradually rather than getting a flooded backlog. Honors the existing 'Account activity' notification preference (no new schema needed for that). Isolated in try/catch so a reminder-logic failure can never break the notification bell. Verified against dev Neon: created a completed, unreviewed booking 2 days old, confirmed reminder #1 (24h tier) fires with correct copy, confirmed a second call is a no-op (idempotent), then cleaned up test data. Fixed a copy bug caught during verification: the notification body previously appended a hardcoded 'appointment' suffix, duplicating the word for braider service names that already end in 'appointment' (e.g. 'Knotless appointment appointment'). tsc/eslint clean. Manual QA session (August 29, 2026) with the project owner found and fixed two more issues live: (1) the notifications page's own server render didn't run the backfill, so a due reminder appeared in the bell's unread count but not in the visible list until a reload — fixed by also calling backfillDueReviewReminders() from dashboard/notifications/page.tsx, not just the API route; (2) with two opportunistic call sites now firing on one visit, a booking with a multi-tier backlog (e.g. 4 days overdue, both the 24h and 3-day tiers due) could have two tiers advanced in a single visit instead of one. Root-caused and fixed with a 1-hour minimum gap between reminders for the same booking (MIN_GAP_BETWEEN_REMINDERS_MS) — deliberately scoped per-booking rather than per-user-per-day so a client with two separate unreviewed bookings still gets each its own legitimate reminder; this floor is a no-op once a real cron replaces the opportunistic hooks (cron runs are naturally ~24h apart), so no rework is needed at that transition. All fixes re-verified end to end: created a 4-day-overdue unreviewed booking, confirmed only one reminder fires across both hook points in one visit, added a review, confirmed reminders stop immediately. All QA test data and scratch scripts cleaned up. tsc/eslint clean throughout. This slice is now considered QA-passed.",
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
