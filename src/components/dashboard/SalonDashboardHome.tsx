"use client";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

const posts = [
  { t: "Weekend knotless specialist", a: 9,  type: "Part-time", pay: "$28–35/hr" },
  { t: "Full-time senior braider",    a: 14, type: "Full-time", pay: "$45k–60k" },
];

const applicants = [
  { n: "Imani Carter",  s: "Knotless · 5 yrs",   st: "New",         v: "warning"  as const },
  { n: "Zola Adeyemi",  s: "Senegalese · 7 yrs", st: "Shortlisted", v: "info"     as const },
  { n: "Nia Robinson",  s: "Goddess · 4 yrs",    st: "Matched",     v: "success"  as const },
];

export function SalonDashboardHome({ firstName }: { firstName: string }) {
  return (
    <>
      <Topbar
        title={`Welcome back${firstName !== "there" ? `, ${firstName}` : ""}!`}
        subtitle="Here's what's happening at your salon today."
        action={
          <Link href="/dashboard/opportunities/new">
            <Button size="sm" iconLeft={<PlusIcon />}>Post opportunity</Button>
          </Link>
        }
      />

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 26 }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          <StatCard icon={<BriefcaseIcon />} label="Open opportunities" value="3" tone="brand" />
          <StatCard icon={<UsersIcon />}     label="New applicants"     value="12" delta="+5 today" tone="gold" />
          <StatCard icon={<CheckIcon />}     label="Matches made"       value="48" tone="sage" />
          <StatCard icon={<CalendarIcon />}  label="Chairs filled"      value="86%" tone="teal" />
        </div>

        {/* Content grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }}>
          {/* Active opportunities */}
          <Card padded>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, margin: 0, color: "var(--charcoal-900)" }}>
                Your opportunities
              </h3>
              <Link href="/dashboard/opportunities/new">
                <Button size="sm" variant="outline" iconLeft={<PlusIcon />}>Post</Button>
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {posts.map((p) => (
                <Link key={p.t} href="/dashboard/applicants" style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: 14,
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: "background var(--dur-fast)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{p.t}</div>
                      <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                        <Badge variant="neutral">{p.type}</Badge>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>{p.pay}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--brand)" }}>{p.a}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>applicants</div>
                    </div>
                    <ChevronIcon />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent applicants */}
          <Card padded>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, margin: "0 0 16px", color: "var(--charcoal-900)" }}>
              Recent applicants
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {applicants.map((a) => (
                <div key={a.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={a.n} size="md" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-strong)", fontSize: 14 }}>{a.n}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{a.s}</div>
                  </div>
                  <Badge variant={a.v} dot>{a.st}</Badge>
                </div>
              ))}
            </div>
            <Link href="/dashboard/applicants">
              <Button fullWidth variant="ghost" style={{ marginTop: 16 }}>View all applicants</Button>
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}

/* Icons */
function PlusIcon()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>; }
function BriefcaseIcon(){ return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function UsersIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CheckIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>; }
function ChevronIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
