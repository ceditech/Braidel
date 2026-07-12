"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Photo } from "@/components/ui/Photo";
import { JOBS } from "@/lib/sampleData";
import type { SalonDTO } from "@/db/queries";

const ABOUT_FACTS: [string, string][] = [
  ["Established", "2018"],
  ["Team", "8 braiders"],
  ["Stations", "6"],
  ["Amenities", "Wi-Fi · refreshments"],
];

const REVIEWS = [
  { name: "Destiny W.", style: "Knotless braids", text: "Clean, welcoming space and the team is incredibly talented. My go-to salon." },
  { name: "Maya T.",    style: "Feed-in ponytail", text: "Booked same-week and left thrilled. The stylists really know protective styles." },
];

export function SalonDetailClient({ salon }: { salon: SalonDTO | null }) {
  const [tab, setTab] = useState("about");

  if (!salon) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px var(--gutter)", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--charcoal-900)" }}>Salon not found</h1>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 24px" }}>This salon may have moved or is no longer listed.</p>
        <Link href="/find-salons"><Button>Back to salons</Button></Link>
      </div>
    );
  }

  // Openings still sourced from mock JOBS (name-matched) until the Opportunities
  // vertical is wired to the DB; seeded salon names match, so this works.
  const openings = JOBS.filter((j) => j.salon === salon.name);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px var(--gutter) 40px" }}>
      <Link href="/find-salons" style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 18 }}>
        <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><ChevronIcon /></span>
        Back to salons
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
        {/* Main */}
        <div>
          {/* Header */}
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Avatar name={salon.name} size="xl" ring />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,3vw,32px)", margin: 0, color: "var(--charcoal-900)" }}>
                  {salon.name}
                </h1>
                {salon.verified && <Badge variant="brand" dot>Verified</Badge>}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, color: "var(--text-muted)", fontSize: 15, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PinIcon /> {salon.city}</span>
                <Rating value={salon.rating} count={salon.reviews} size="0.95rem" />
                {salon.openRoles > 0 && <span style={{ color: "var(--brand)", fontWeight: 600 }}>{salon.openRoles} open roles</span>}
              </div>
            </div>
          </div>

          {/* Services */}
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {salon.services.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 26 }}>
            <Tabs
              value={tab}
              onChange={setTab}
              items={[
                { value: "about", label: "About" },
                { value: "openings", label: "Openings", count: openings.length },
                { value: "reviews", label: "Reviews", count: salon.reviews },
              ]}
            />
          </div>

          {tab === "about" && (
            <div style={{ marginTop: 22, maxWidth: 620 }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-body)" }}>
                {salon.name} is a {salon.verified ? "verified " : ""}braiding salon in {salon.city}, known for
                {" "}{salon.services.slice(0, 2).map((s) => s.toLowerCase()).join(" and ")} and a welcoming,
                scalp-first approach. A supportive team, clean stations, and a steady clientele make it a great
                place to book a style — or to build your braiding career.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
                {ABOUT_FACTS.map(([k, v]) => (
                  <div key={k} style={{ padding: 14, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{k}</div>
                    <div style={{ fontWeight: 600, color: "var(--text-strong)", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "openings" && (
            <div style={{ marginTop: 22 }}>
              {openings.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>No current openings — check back soon.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {openings.map((j, i) => (
                    <Link key={j.id} href={`/opportunities/${j.id}`} style={{ textDecoration: "none" }}>
                      <Card interactive>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                            <Photo seed={i} aspect="1/1" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{j.title}</div>
                            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{j.type} · {j.pay}</div>
                          </div>
                          <ChevronIcon />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "reviews" && (
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14, maxWidth: 620 }}>
              {REVIEWS.map((r) => (
                <div key={r.name} style={{ padding: 18, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={r.name} size="sm" />
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{r.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.style}</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "var(--gold-400)" }}>★★★★★</div>
                  </div>
                  <p style={{ margin: "12px 0 0", color: "var(--text-body)", lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky card */}
        <Card padded style={{ position: "sticky", top: 90 }}>
          <Rating value={salon.rating} count={salon.reviews} size="1rem" />
          <div style={{ marginTop: 6, fontSize: 14, color: "var(--text-muted)" }}>{salon.city}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {salon.openRoles > 0 && (
              <Button fullWidth size="lg" onClick={() => setTab("openings")} iconLeft={<BriefcaseIcon />}>
                View {salon.openRoles} opening{salon.openRoles > 1 ? "s" : ""}
              </Button>
            )}
            <Link href="/sign-up">
              <Button fullWidth variant="outline" size="lg" iconLeft={<HeartIcon />}>Follow salon</Button>
            </Link>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
            {[["Verified business", <ShieldIcon key="s" />], ["Vetted braiders", <UsersIcon key="u" />], ["Responds quickly", <ClockIcon key="c" />]].map(([t, icon]) => (
              <span key={t as string} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <span style={{ color: "var(--success)" }}>{icon}</span>{t}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ChevronIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function PinIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function BriefcaseIcon(){ return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function HeartIcon()    { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>; }
function ShieldIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function UsersIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>; }
function ClockIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
