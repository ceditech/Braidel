"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DonutChart } from "@/components/ui/DonutChart";
import { BarChart } from "@/components/ui/BarChart";
import { TrendLineChart } from "@/components/ui/TrendLineChart";
import type {
  AdminReviewReportDecision,
  AdminReviewReportQueueItemDTO,
  AdminUserDTO,
  AdminVerificationDecision,
  AdminVerificationQueueItemDTO,
  MarketplaceAdminDashboardDTO,
} from "@/lib/admin-domain";
import {
  VERIFICATION_EVIDENCE_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/verification-domain";
import styles from "./AdminModerationClient.module.css";

type PortalTab = "overview" | "users" | "money" | "moderation";
type QueueTab = "verifications" | "reports";

const verificationDecisions: Array<{
  value: AdminVerificationDecision;
  label: string;
  intent: "neutral" | "positive" | "danger";
}> = [
  { value: "under_review", label: "Start review", intent: "neutral" },
  { value: "verified", label: "Approve", intent: "positive" },
  { value: "rejected", label: "Reject", intent: "danger" },
  { value: "revoked", label: "Revoke", intent: "danger" },
];

const reportDecisions: Array<{
  value: AdminReviewReportDecision;
  label: string;
  intent: "neutral" | "positive" | "danger";
}> = [
  { value: "under_review", label: "Start review", intent: "neutral" },
  { value: "resolved", label: "Resolve", intent: "positive" },
  { value: "dismissed", label: "Dismiss", intent: "danger" },
];

/* ── Chart category labels/colors ────────────────────────────────────────
   Data itself is fully dynamic (GROUP BY in admin-queries.ts — any future
   role/status value appears automatically). These maps only supply a nicer
   display label + curated color for KNOWN values; anything unrecognized
   still renders correctly via the title-cased fallback + rotating palette,
   it just won't have a hand-picked color/label yet. */
const ROLE_LABELS: Record<string, string> = {
  salon_owner: "Salon owners",
  braider: "Braiders",
  client: "Clients",
  admin: "Admins",
};
const ROLE_ORDER = ["salon_owner", "braider", "client", "admin"];
const STATUS_LABELS: Record<string, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
  no_show: "No-show",
};
const STATUS_ORDER = ["requested", "confirmed", "completed", "cancelled", "declined", "no_show"];
const CHART_PALETTE = [
  "var(--brand)",
  "var(--color-gold)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-danger)",
  "var(--border-strong)",
];

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function sortByPreferredOrder<T>(items: T[], key: (item: T) => string, order: string[]): T[] {
  const rank = new Map(order.map((value, i) => [value, i]));
  return [...items].sort((a, b) => {
    const ra = rank.get(key(a)) ?? Number.MAX_SAFE_INTEGER;
    const rb = rank.get(key(b)) ?? Number.MAX_SAFE_INTEGER;
    return ra !== rb ? ra - rb : key(a).localeCompare(key(b));
  });
}

function toChartData(
  rows: Array<{ count: number } & Record<string, unknown>>,
  keyOf: (row: Record<string, unknown>) => string,
  labels: Record<string, string>,
  order: string[]
) {
  return sortByPreferredOrder(rows, keyOf, order).map((row, i) => {
    const key = keyOf(row);
    return {
      label: labels[key] ?? titleCase(key),
      value: row.count,
      color: CHART_PALETTE[i % CHART_PALETTE.length],
    };
  });
}

const stableItems = [
  ["Secure", "Clerk owns identity. Admin access requires an allowlisted email and DB admin role."],
  ["Traceable", "User lifecycle changes are recorded in the admin action log."],
  ["Accountable", "Notes are captured for moderation and account actions."],
  ["Bounded", "Admins can unlist provider profiles or suspend accounts as separate actions."],
  ["Lifecycle-safe", "Suspension blocks access while unlisting only removes public discovery."],
  ["Evidence-ready", "Verification, reviews, and user actions remain auditable."],
];

export function AdminModerationClient({
  initialDashboard,
}: {
  initialDashboard: MarketplaceAdminDashboardDTO;
}) {
  const [dashboard] = useState(initialDashboard);
  const [portalTab, setPortalTab] = useState<PortalTab>("overview");

  return (
    <main className={styles.page}>
      <nav className={styles.portalTabs} aria-label="Admin portal sections">
        <TabButton label="Performance" active={portalTab === "overview"} onClick={() => setPortalTab("overview")} />
        <TabButton label="Users" active={portalTab === "users"} onClick={() => setPortalTab("users")} />
        <TabButton label="Money" active={portalTab === "money"} onClick={() => setPortalTab("money")} />
        <TabButton label="Moderation" active={portalTab === "moderation"} onClick={() => setPortalTab("moderation")} />
        <Link href="/dashboard/admin/content">Content</Link>
      </nav>

      {portalTab === "overview" && <OverviewPanel dashboard={dashboard} />}
      {portalTab === "users" && <UsersPanel users={dashboard.users} />}
      {portalTab === "money" && <MoneyPanel dashboard={dashboard} />}
      {portalTab === "moderation" && <ModerationPanel dashboard={dashboard} />}
    </main>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? styles.portalTabActive : undefined}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function OverviewPanel({ dashboard }: { dashboard: MarketplaceAdminDashboardDTO }) {
  const { kpis } = dashboard;

  // Fully data-driven: derived from a live GROUP BY, not a hardcoded list of
  // roles/statuses. A future enum value appears here automatically once it's
  // used, with a sensible fallback label/color — no chart code change needed.
  const roleChartData = useMemo(
    () => toChartData(kpis.userRoleDistribution, (row) => String(row.role), ROLE_LABELS, ROLE_ORDER),
    [kpis.userRoleDistribution]
  );
  const bookingStatusChartData = useMemo(
    () => toChartData(kpis.bookingStatusDistribution, (row) => String(row.status), STATUS_LABELS, STATUS_ORDER),
    [kpis.bookingStatusDistribution]
  );

  return (
    <div className={styles.portalStack}>
      <section className={styles.heroPanel}>
        <div>
          <p className={styles.eyebrow}>Marketplace command center</p>
          <h2>Operational visibility across trust, bookings, users, and revenue.</h2>
          <p>
            These metrics are pulled from Neon so admins can read the health of the
            marketplace before making moderation or lifecycle decisions.
          </p>
        </div>
        <div className={styles.heroNumbers}>
          <MiniStat value={kpis.users.active} label="Active users" />
          <MiniStat value={kpis.bookings.total} label="Bookings" />
          <MiniStat value={formatCurrency(kpis.money.bookingCommissionsCents)} label="Booking commissions" />
        </div>
      </section>

      <section className={styles.statsGrid} aria-label="Admin KPI summary">
        <Metric value={kpis.users.salons} label={`Salon owners - ${kpis.users.salonRate}%`} />
        <Metric value={kpis.users.braiders} label={`Braiders - ${kpis.users.braiderRate}%`} />
        <Metric value={kpis.users.clients} label={`Clients - ${kpis.users.clientRate}%`} />
        <Metric value={kpis.users.suspended} label={`Suspended users - ${kpis.users.deleted} deleted records`} />
        <Metric value={kpis.messages.total} label={`${kpis.messages.last7Days} messages in 7 days`} />
        <Metric value={kpis.notifications.total} label={`${kpis.notifications.processed} notifications processed`} />
        <Metric value={kpis.bookings.completed} label="Completed bookings" />
        <Metric value={dashboard.stats.completedDecisions} label="Admin decisions" />
      </section>

      <section className={styles.splitGrid} aria-label="Admin insight charts">
        <div className={styles.panelCard}>
          <p className={styles.eyebrow}>User composition</p>
          <DonutChart data={roleChartData} />
        </div>
        <div className={styles.panelCard}>
          <p className={styles.eyebrow}>Bookings created — last 14 days</p>
          <TrendLineChart data={kpis.bookingTrend} />
        </div>
      </section>

      <section className={styles.splitGrid}>
        <div className={styles.panelCard}>
          <p className={styles.eyebrow}>Booking lifecycle</p>
          <BarChart data={bookingStatusChartData} />
          <LifecycleGrid
            items={[
              ["Requested", kpis.bookings.requested],
              ["Confirmed", kpis.bookings.confirmed],
              ["Completed", kpis.bookings.completed],
              ["Cancelled", kpis.bookings.cancelled],
              ["Declined", kpis.bookings.declined],
              ["No-show", kpis.bookings.noShow],
            ]}
          />
        </div>
        <div className={styles.panelCard}>
          <p className={styles.eyebrow}>Provider verification</p>
          <BarChart
            data={[
              { label: "Salon profiles", value: kpis.providers.salons, color: "var(--border-strong)" },
              { label: "Verified salons", value: kpis.providers.verifiedSalons, color: "var(--brand)" },
              { label: "Braider profiles", value: kpis.providers.braiders, color: "var(--border-strong)" },
              { label: "Verified braiders", value: kpis.providers.verifiedBraiders, color: "var(--color-gold)" },
            ]}
          />
          <LifecycleGrid
            items={[
              ["Salon profiles", kpis.providers.salons],
              ["Verified salons", kpis.providers.verifiedSalons],
              ["Braider profiles", kpis.providers.braiders],
              ["Verified braiders", kpis.providers.verifiedBraiders],
              ["Verification queue", dashboard.stats.pendingVerifications],
              ["Reported reviews", dashboard.stats.reportedReviews],
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function UsersPanel({ users }: { users: AdminUserDTO[] }) {
  const [selectedId, setSelectedId] = useState(users[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const selectedUser =
    users.find((user) => user.id === selectedId) ?? users[0] ?? null;

  const filteredUsers = users.filter((user) => {
    const haystack = `${user.firstName} ${user.lastName} ${user.email} ${user.profileLabel}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesRole = role === "all" || user.role === role;
    return matchesQuery && matchesRole;
  });

  return (
    <section className={styles.workspace}>
      <aside className={styles.queuePanel}>
        <div className={styles.filterBar}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users"
            aria-label="Search users"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            aria-label="Filter by role"
          >
            <option value="all">All roles</option>
            <option value="salon_owner">Salon owners</option>
            <option value="braider">Braiders</option>
            <option value="client">Clients</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <div className={styles.queueList}>
          {filteredUsers.map((user) => (
            <button
              type="button"
              key={user.id}
              className={`${styles.queueItem} ${selectedUser?.id === user.id ? styles.queueItemActive : ""}`}
              onClick={() => setSelectedId(user.id)}
            >
              <span className={styles.itemTopline}>
                <strong>{user.firstName} {user.lastName}</strong>
                <Badge variant={user.accountStatus === "suspended" ? "danger" : "success"} dot>
                  {user.accountStatus}
                </Badge>
              </span>
              <span className={styles.itemMeta}>{user.profileLabel} - {user.email}</span>
              {user.profileName && (
                <span className={styles.itemMeta}>
                  {user.profileName}
                  {user.providerVisibility ? ` - ${user.providerVisibility}` : ""}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <section className={styles.detailPanel}>
        {selectedUser ? <UserDetail user={selectedUser} /> : <EmptyState title="No users found" />}
      </section>

      <section className={`${styles.panelCard} ${styles.fullSpan}`}>
        <p className={styles.eyebrow}>User STABLE framework</p>
        <div className={styles.stableGrid}>
          {stableItems.map(([title, body]) => (
            <article key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function UserDetail({ user }: { user: AdminUserDTO }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("");

  async function runUserAction(
    action:
      | "update_profile"
      | "suspend_account"
      | "restore_account"
      | "unlist_profile"
      | "relist_profile"
      | "promote_admin"
  ) {
    setState("saving");
    setMessage("");
    const response = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, firstName, lastName, note }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(typeof payload.error === "string" ? payload.error : "User action failed");
      setState("idle");
      return;
    }
    window.location.reload();
  }

  return (
    <div className={styles.detailContent}>
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.eyebrow}>User management</p>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>
        </div>
        <Badge variant={user.accountStatus === "suspended" ? "danger" : "success"} dot>
          {user.accountStatus}
        </Badge>
      </div>

      <div className={styles.userMetaGrid}>
        <InfoTile label="Role" value={user.profileLabel} />
        <InfoTile label="Profile" value={user.profileName || "Not linked"} />
        <InfoTile label="Listing visibility" value={user.providerVisibility ?? "Not a provider"} />
        <InfoTile label="Joined" value={formatDate(user.createdAt)} />
        <InfoTile label="Onboarding" value={user.onboardedAt ? "Completed" : "Pending"} />
      </div>

      <section className={styles.decisionBox}>
        <label htmlFor="first-name">First name</label>
        <input
          id="first-name"
          value={firstName}
          maxLength={80}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label htmlFor="last-name">Last name</label>
        <input
          id="last-name"
          value={lastName}
          maxLength={80}
          onChange={(event) => setLastName(event.target.value)}
        />
        <label htmlFor="user-note">Admin note</label>
        <textarea
          id="user-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add context for lifecycle or profile changes."
        />
        {message && <p className={styles.error}>{message}</p>}
        <div className={styles.actionRow}>
          <button
            type="button"
            disabled={state === "saving"}
            className={`${styles.decisionButton} ${styles.neutral}`}
            onClick={() => runUserAction("update_profile")}
          >
            Save profile
          </button>
          {user.providerVisibility === "unlisted" ? (
            <button
              type="button"
              disabled={state === "saving"}
              className={`${styles.decisionButton} ${styles.positive}`}
              onClick={() => runUserAction("relist_profile")}
            >
              Relist profile
            </button>
          ) : user.providerVisibility === "listed" ? (
            <button
              type="button"
              disabled={state === "saving"}
              className={`${styles.decisionButton} ${styles.danger}`}
              onClick={() => runUserAction("unlist_profile")}
            >
              Unlist profile
            </button>
          ) : null}
          {user.accountStatus === "suspended" ? (
            <button
              type="button"
              disabled={state === "saving"}
              className={`${styles.decisionButton} ${styles.positive}`}
              onClick={() => runUserAction("restore_account")}
            >
              Restore access
            </button>
          ) : (
            <button
              type="button"
              disabled={state === "saving"}
              className={`${styles.decisionButton} ${styles.danger}`}
              onClick={() => runUserAction("suspend_account")}
            >
              Suspend account
            </button>
          )}
          {user.role !== "admin" && (
            <button
              type="button"
              disabled={state === "saving"}
              className={`${styles.decisionButton} ${styles.positive}`}
              onClick={() => runUserAction("promote_admin")}
            >
              Promote admin
            </button>
          )}
        </div>
      </section>

      <div className={styles.noticeBox}>
        <strong>Access model</strong>
        <p>
          Admin access requires both an email listed in BRAIDEL_ADMIN_EMAILS and
          a Neon user role of Admin. Promote admin only succeeds for allowlisted
          emails.
        </p>
        <p>
          Unlist hides a Salon/Braider from discovery and booking while keeping
          their account available for remediation. Suspend blocks authenticated
          dashboard and API access until an admin restores the account.
        </p>
      </div>
    </div>
  );
}

function MoneyPanel({ dashboard }: { dashboard: MarketplaceAdminDashboardDTO }) {
  const { money } = dashboard.kpis;
  return (
    <div className={styles.portalStack}>
      <section className={styles.moneyGrid}>
        <MoneyCard
          title="Booking commissions"
          value={formatCurrency(money.bookingCommissionsCents)}
          body="Platform fees collected or marked as succeeded through booking payments."
        />
        <MoneyCard
          title="Affiliate commissions"
          value={formatCurrency(money.affiliateCommissionsCents)}
          body="Upcoming. Reserved for partner and referral revenue tracking."
          upcoming
        />
        <MoneyCard
          title="Subscriptions"
          value="Upcoming"
          body="Reserved for future salon, provider, or featured-listing plans."
          upcoming
        />
      </section>
      <section className={styles.panelCard}>
        <p className={styles.eyebrow}>Affiliate management</p>
        <h2>Partner payouts and referral programs are intentionally staged.</h2>
        <p>
          The admin surface reserves this lane now, but transactions should not
          be activated until partner contracts, payout rules, tax handling, and
          reconciliation reporting are defined.
        </p>
      </section>
    </div>
  );
}

function ModerationPanel({ dashboard }: { dashboard: MarketplaceAdminDashboardDTO }) {
  const [tab, setTab] = useState<QueueTab>("verifications");
  const [selectedVerificationId, setSelectedVerificationId] = useState(
    dashboard.verifications[0]?.id ?? ""
  );
  const [selectedReportId, setSelectedReportId] = useState(
    dashboard.reviewReports[0]?.id ?? ""
  );
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "saving">("idle");
  const [message, setMessage] = useState("");

  const selectedVerification = useMemo(
    () =>
      dashboard.verifications.find((item) => item.id === selectedVerificationId) ??
      dashboard.verifications[0] ??
      null,
    [dashboard.verifications, selectedVerificationId]
  );
  const selectedReport = useMemo(
    () =>
      dashboard.reviewReports.find((item) => item.id === selectedReportId) ??
      dashboard.reviewReports[0] ??
      null,
    [dashboard.reviewReports, selectedReportId]
  );

  async function decideVerification(decision: AdminVerificationDecision) {
    if (!selectedVerification) return;
    await runDecision(
      `/api/admin/verifications/${selectedVerification.id}/decision`,
      decision
    );
  }

  async function decideReport(decision: AdminReviewReportDecision) {
    if (!selectedReport) return;
    await runDecision(`/api/admin/review-reports/${selectedReport.id}/decision`, decision);
  }

  async function runDecision(url: string, decision: string) {
    setState("saving");
    setMessage("");
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(typeof payload.error === "string" ? payload.error : "Decision failed");
      setState("idle");
      return;
    }
    window.location.reload();
  }

  return (
    <>
      <section className={styles.statsGrid} aria-label="Moderation summary">
        <Metric value={dashboard.stats.pendingVerifications} label="Verification queue" />
        <Metric value={dashboard.stats.reportedReviews} label="Reported reviews" />
        <Metric value={dashboard.stats.underReview} label="Under review" />
        <Metric value={dashboard.stats.completedDecisions} label="Admin decisions" />
      </section>

      <section className={styles.workspace}>
        <aside className={styles.queuePanel}>
          <div className={styles.tabs} role="tablist" aria-label="Moderation queues">
            <button
              type="button"
              className={tab === "verifications" ? styles.tabActive : undefined}
              onClick={() => {
                setTab("verifications");
                setNote("");
                setMessage("");
              }}
            >
              Verifications
              <span>{dashboard.verifications.length}</span>
            </button>
            <button
              type="button"
              className={tab === "reports" ? styles.tabActive : undefined}
              onClick={() => {
                setTab("reports");
                setNote("");
                setMessage("");
              }}
            >
              Reports
              <span>{dashboard.reviewReports.length}</span>
            </button>
          </div>

          {tab === "verifications" ? (
            <VerificationQueue
              items={dashboard.verifications}
              selectedId={selectedVerification?.id ?? ""}
              onSelect={(id) => {
                setSelectedVerificationId(id);
                setNote("");
                setMessage("");
              }}
            />
          ) : (
            <ReportQueue
              items={dashboard.reviewReports}
              selectedId={selectedReport?.id ?? ""}
              onSelect={(id) => {
                setSelectedReportId(id);
                setNote("");
                setMessage("");
              }}
            />
          )}
        </aside>

        <section className={styles.detailPanel}>
          {tab === "verifications" ? (
            selectedVerification ? (
              <VerificationDetail
                item={selectedVerification}
                note={note}
                onNoteChange={setNote}
                onDecide={decideVerification}
                busy={state === "saving"}
                message={message}
              />
            ) : (
              <EmptyState title="No verification submissions" />
            )
          ) : selectedReport ? (
            <ReportDetail
              item={selectedReport}
              note={note}
              onNoteChange={setNote}
              onDecide={decideReport}
              busy={state === "saving"}
              message={message}
            />
          ) : (
            <EmptyState title="No reported reviews" />
          )}
        </section>
      </section>
    </>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) {
  return (
    <div className={styles.metricCard}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function MiniStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LifecycleGrid({ items }: { items: Array<[string, number]> }) {
  return (
    <div className={styles.lifecycleGrid}>
      {items.map(([label, value]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function MoneyCard({
  title,
  value,
  body,
  upcoming,
}: {
  title: string;
  value: string;
  body: string;
  upcoming?: boolean;
}) {
  return (
    <article className={styles.moneyCard}>
      <span>{upcoming ? "Upcoming" : "Live"}</span>
      <h2>{value}</h2>
      <strong>{title}</strong>
      <p>{body}</p>
    </article>
  );
}

function VerificationQueue({
  items,
  selectedId,
  onSelect,
}: {
  items: AdminVerificationQueueItemDTO[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!items.length) return <EmptyState title="No verification submissions" compact />;
  return (
    <div className={styles.queueList}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`${styles.queueItem} ${selectedId === item.id ? styles.queueItemActive : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.itemTopline}>
            <strong>{item.providerName}</strong>
            <StatusBadge status={item.status} />
          </span>
          <span className={styles.itemMeta}>
            {item.providerType} - {item.ownerEmail}
          </span>
          <span className={styles.itemMeta}>{item.evidenceCount} evidence records</span>
        </button>
      ))}
    </div>
  );
}

function ReportQueue({
  items,
  selectedId,
  onSelect,
}: {
  items: AdminReviewReportQueueItemDTO[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (!items.length) return <EmptyState title="No reported reviews" compact />;
  return (
    <div className={styles.queueList}>
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`${styles.queueItem} ${selectedId === item.id ? styles.queueItemActive : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.itemTopline}>
            <strong>{item.providerName}</strong>
            <ReportStatusBadge status={item.status} />
          </span>
          <span className={styles.itemMeta}>
            {item.category.replace("_", " ")} - {item.reporterEmail}
          </span>
          <span className={styles.itemMeta}>{item.score}-star review</span>
        </button>
      ))}
    </div>
  );
}

function VerificationDetail({
  item,
  note,
  onNoteChange,
  onDecide,
  busy,
  message,
}: {
  item: AdminVerificationQueueItemDTO;
  note: string;
  onNoteChange: (value: string) => void;
  onDecide: (decision: AdminVerificationDecision) => void;
  busy: boolean;
  message: string;
}) {
  return (
    <div className={styles.detailContent}>
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.eyebrow}>Verification review</p>
          <h2>{item.providerName}</h2>
          <p>{item.ownerName} - {item.ownerEmail}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.evidenceGrid}>
        {item.evidence.map((evidence) => (
          <article key={evidence.id} className={styles.evidenceCard}>
            <div>
              <Badge variant="neutral">{VERIFICATION_EVIDENCE_LABELS[evidence.type]}</Badge>
              <h3>{evidence.title}</h3>
            </div>
            <p>{evidence.description || "No description provided."}</p>
            {evidence.evidenceUrl && (
              <a href={evidence.evidenceUrl} target="_blank" rel="noreferrer">
                Open reference
              </a>
            )}
          </article>
        ))}
      </div>

      <Timeline entries={item.history} />
      <DecisionBox
        note={note}
        onNoteChange={onNoteChange}
        busy={busy}
        message={message}
        actions={verificationDecisions}
        onDecide={onDecide}
      />
    </div>
  );
}

function ReportDetail({
  item,
  note,
  onNoteChange,
  onDecide,
  busy,
  message,
}: {
  item: AdminReviewReportQueueItemDTO;
  note: string;
  onNoteChange: (value: string) => void;
  onDecide: (decision: AdminReviewReportDecision) => void;
  busy: boolean;
  message: string;
}) {
  return (
    <div className={styles.detailContent}>
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.eyebrow}>Review report</p>
          <h2>{item.providerName}</h2>
          <p>{item.serviceName} - reported by {item.reporterName}</p>
        </div>
        <ReportStatusBadge status={item.status} />
      </div>

      <div className={styles.reviewBox}>
        <div>
          <span className={styles.rating}>{item.score}.0 star</span>
          <strong>Client review</strong>
        </div>
        <p>{item.reviewComment || "No written comment."}</p>
      </div>

      <div className={styles.reportBox}>
        <p className={styles.eyebrow}>{item.category.replace("_", " ")}</p>
        <p>{item.reason}</p>
      </div>

      <DecisionBox
        note={note}
        onNoteChange={onNoteChange}
        busy={busy}
        message={message}
        actions={reportDecisions}
        onDecide={onDecide}
      />
    </div>
  );
}

function DecisionBox<T extends string>({
  note,
  onNoteChange,
  busy,
  message,
  actions,
  onDecide,
}: {
  note: string;
  onNoteChange: (value: string) => void;
  busy: boolean;
  message: string;
  actions: Array<{ value: T; label: string; intent: "neutral" | "positive" | "danger" }>;
  onDecide: (decision: T) => void;
}) {
  return (
    <section className={styles.decisionBox}>
      <label htmlFor="admin-note">Decision note</label>
      <textarea
        id="admin-note"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="Write the moderation reason, reviewer guidance, or resolution details."
      />
      {message && <p className={styles.error}>{message}</p>}
      <div className={styles.actionRow}>
        {actions.map((action) => (
          <button
            key={action.value}
            type="button"
            disabled={busy}
            className={`${styles.decisionButton} ${styles[action.intent]}`}
            onClick={() => onDecide(action.value)}
          >
            {busy ? "Saving..." : action.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function Timeline({ entries }: { entries: AdminVerificationQueueItemDTO["history"] }) {
  if (!entries.length) return null;
  return (
    <section className={styles.timeline}>
      <h3>Status history</h3>
      {entries.slice(0, 5).map((entry) => (
        <div key={entry.id} className={styles.timelineItem}>
          <span>{VERIFICATION_STATUS_LABELS[entry.newStatus]}</span>
          <p>{entry.note || "No note provided."}</p>
        </div>
      ))}
    </section>
  );
}

function StatusBadge({ status }: { status: AdminVerificationQueueItemDTO["status"] }) {
  const variant =
    status === "verified"
      ? "success"
      : status === "rejected" || status === "revoked"
        ? "danger"
        : "warning";
  return (
    <Badge variant={variant} dot>
      {VERIFICATION_STATUS_LABELS[status]}
    </Badge>
  );
}

function ReportStatusBadge({ status }: { status: AdminReviewReportQueueItemDTO["status"] }) {
  const variant = status === "resolved" ? "success" : status === "dismissed" ? "danger" : "warning";
  return (
    <Badge variant={variant} dot>
      {status.replace("_", " ")}
    </Badge>
  );
}

function EmptyState({ title, compact }: { title: string; compact?: boolean }) {
  return (
    <div className={`${styles.emptyState} ${compact ? styles.emptyStateCompact : ""}`}>
      <strong>{title}</strong>
      <p>Nothing needs action in this section right now.</p>
    </div>
  );
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
