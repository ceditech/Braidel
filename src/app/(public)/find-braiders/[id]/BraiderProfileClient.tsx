"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import type { BraiderDTO } from "@/db/queries";
import styles from "./BraiderProfileClient.module.css";

const ABOUT_FACTS: [string, string][] = [
  ["Experience", "9 years"],
  ["Travels to you", "Within 15 mi"],
  ["Hair provided", "Optional"],
  ["Languages", "English, Yoruba"],
];

export function BraiderProfileClient({ braider }: { braider: BraiderDTO | null }) {
  const [tab, setTab] = useState("portfolio");

  if (!braider) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px var(--gutter)", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--text-strong)" }}>
          Braider not found
        </h1>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 24px" }}>
          This profile may have moved or is no longer available.
        </p>
        <Link href="/find-braiders">
          <Button>Back to braiders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Back link */}
      <Link
        href="/find-braiders"
        style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 18 }}
      >
        <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><ChevronIcon /></span>
        Back to braiders
      </Link>

      <div className={styles.layout}>
        {/* Main column */}
        <div className={styles.main}>
          {/* Header */}
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Avatar name={braider.name} size="xl" ring />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,3vw,32px)", margin: 0, color: "var(--text-strong)" }}>
                  {braider.name}
                </h1>
                {braider.badge === "Verified" && <Badge variant="brand" dot>Verified</Badge>}
                {braider.badge === "Top rated" && <Badge variant="gold">Top rated</Badge>}
                {braider.badge === "New" && <Badge variant="gold">New</Badge>}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, color: "var(--text-muted)", fontSize: 15, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PinIcon /> {braider.city}</span>
                <Rating value={braider.rate} count={braider.rev} size="0.95rem" />
                {braider.completedBookingCount > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <CalendarIcon /> {braider.completedBookingCount} completed booking{braider.completedBookingCount === 1 ? "" : "s"}
                  </span>
                )}
                {braider.portfolio.length > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <ImageIcon /> {braider.portfolio.length} portfolio photo{braider.portfolio.length === 1 ? "" : "s"}
                  </span>
                )}
                {braider.responseRate !== null && braider.responseRate > 0 && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <MessageIcon /> Responds to {braider.responseRate}% of reviews
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Specialty tags */}
          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {[...braider.specs, "Kids welcome"].map((s) => <Tag key={s}>{s}</Tag>)}
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 26 }}>
            <Tabs
              value={tab}
              onChange={setTab}
              items={[
                { value: "portfolio", label: "Portfolio" },
                { value: "about", label: "About" },
                { value: "reviews", label: "Reviews", count: braider.rev },
              ]}
            />
          </div>

          {/* Portfolio */}
          {tab === "portfolio" && (
            braider.portfolio.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 22 }}>
                {braider.portfolio.map((media) => (
                  <div key={media.id} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: 8, border: "1px solid var(--border-subtle)", background: "var(--bg-subtle)" }}>
                    <Image
                      src={media.url}
                      alt={media.altText}
                      fill
                      sizes="(max-width: 700px) 50vw, 260px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 22, padding: 24, border: "1px dashed var(--border-strong)", borderRadius: 8, color: "var(--text-muted)", textAlign: "center" }}>
                This braider has not added portfolio images yet.
              </div>
            )
          )}

          {/* About */}
          {tab === "about" && (
            <div style={{ marginTop: 22, maxWidth: 580 }}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-body)" }}>
                {braider.bio || `${braider.city.split(",")[0]}-based braider specializing in ${(braider.specs[0] ?? "braiding").toLowerCase()} and protective styles that guard your edges and last.`}
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

          {/* Reviews */}
          {tab === "reviews" && (
            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14, maxWidth: 600 }}>
              {braider.reviews.length === 0 ? (
                <div style={{ padding: 24, border: "1px dashed var(--border-strong)", borderRadius: 8, color: "var(--text-muted)", textAlign: "center" }}>
                  No reviews yet.
                </div>
              ) : (
                braider.reviews.map((r) => (
                  <div key={r.id} style={{ padding: 18, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={r.reviewerName} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-strong)" }}>{r.reviewerName}</div>
                      </div>
                      <div style={{ marginLeft: "auto", color: "var(--gold-400)" }}>{"★".repeat(r.score)}{"☆".repeat(5 - r.score)}</div>
                    </div>
                    {r.comment && <p style={{ margin: "12px 0 0", color: "var(--text-body)", lineHeight: 1.6 }}>{r.comment}</p>}
                    {r.providerResponse && (
                      <div style={{ marginTop: 12, padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>Response from {braider.name}</div>
                        <p style={{ margin: 0, color: "var(--text-body)", lineHeight: 1.6 }}>{r.providerResponse}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sticky booking card */}
        <Card padded className={styles.bookingCard}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--text-strong)" }}>
              {braider.price}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>· per style</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {braider.isAcceptingBookings && braider.bookingProviderId ? (
              <Link href={`/dashboard/appointments?provider=${braider.bookingProviderId}`}>
                <Button fullWidth size="lg" iconLeft={<CalendarIcon />}>Book appointment</Button>
              </Link>
            ) : (
              <Button fullWidth size="lg" variant="outline" disabled iconLeft={<CalendarIcon />}>
                Booking unavailable
              </Button>
            )}
            <Link href="/sign-up">
              <Button fullWidth variant="outline" size="lg" iconLeft={<MessageIcon />}>Message</Button>
            </Link>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
            {[
              ...(braider.badge === "Verified" ? [["Identity verified", <ShieldIcon key="s" />] as const] : []),
              ["Booking details protected", <CalendarIcon key="d" />] as const,
              ["Schedule changes recorded", <ClockIcon key="c" />] as const,
            ].map(([t, icon]) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                <span style={{ color: "var(--success)" }}>{icon}</span>
                {t}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* Icons */
function ChevronIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function PinIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function ClockIcon()   { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>; }
function MessageIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function ShieldIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function ImageIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>; }
