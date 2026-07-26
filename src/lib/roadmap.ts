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
        status: "pending",
        priority: "high",
        phase: 2,
        note: "Model client profiles, service offerings, availability, bookings, status history, timezone-aware scheduling, and integer-cent pricing.",
      },
      {
        title: "3. Booking APIs + appointments/calendar UI",
        status: "pending",
        priority: "high",
        phase: 2,
        note: "Implement provider schedule management, booking requests, confirmations, rescheduling, cancellations, appointment dashboards, and internal calendar workflows.",
      },
      {
        title: "4. Booking-aware conversations, reviews + notifications",
        status: "pending",
        priority: "high",
        phase: 2,
        note: "Generalize application-scoped messaging, ratings, and notification events so they can safely support booking participants and lifecycle events.",
      },
      {
        title: "5. Payments + monetization",
        status: "pending",
        priority: "high",
        phase: 3,
        note: "Finalize subscriptions and transaction fees, then implement Stripe Connect accounts, payments, commissions, refunds, payouts, and idempotent webhooks.",
      },
      {
        title: "6. Trust, verification + marketplace administration",
        status: "pending",
        priority: "high",
        phase: 4,
        note: "Add verification evidence and audit history, moderation, reports, disputes, administrative actions, and account restrictions.",
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
