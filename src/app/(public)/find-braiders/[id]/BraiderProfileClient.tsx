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
import type { BraiderDTO } from "@/db/queries";

const PORTFOLIO = ["Knotless waist", "Jumbo box", "Feed-in", "Goddess", "Bohemian", "Stitch"];

const ABOUT_FACTS: [string, string][] = [
  ["Experience", "9 years"],
  ["Travels to you", "Within 15 mi"],
  ["Hair provided", "Optional"],
  ["Languages", "English, Yoruba"],
];

const REVIEWS = [
  { name: "Destiny W.", style: "Knotless braids", text: "My braids came out flawless and my scalp never hurt. Booking again!" },
  { name: "Maya T.",    style: "Feed-in ponytail", text: "So gentle and quick — and the part work is unreal." },
];

export function BraiderProfileClient({ braider }: { braider: BraiderDTO | null }) {
  const [tab, setTab] = useState("portfolio");

  if (!braider) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px var(--gutter)", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--charcoal-900)" }}>
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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px var(--gutter) 40px" }}>
      {/* Back link */}
      <Link
        href="/find-braiders"
        style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 18 }}
      >
        <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><ChevronIcon /></span>
        Back to braiders
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
        {/* Main column */}
        <div>
          {/* Header */}
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Avatar name={braider.name} size="xl" ring />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,3vw,32px)", margin: 0, color: "var(--charcoal-900)" }}>
                  {braider.name}
                </h1>
                {braider.badge === "Verified" && <Badge variant="brand" dot>Verified</Badge>}
                {braider.badge === "Top rated" && <Badge variant="gold">Top rated</Badge>}
                {braider.badge === "New" && <Badge variant="gold">New</Badge>}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, color: "var(--text-muted)", fontSize: 15, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PinIcon /> {braider.city}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><ClockIcon /> Replies in ~1 hr</span>
                <Rating value={braider.rate} count={braider.rev} size="0.95rem" />
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 22 }}>
              {PORTFOLIO.map((label, i) => (
                <Photo key={label} seed={i} label={label} aspect="1/1" radius="14px" />
              ))}
            </div>
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

        {/* Sticky booking card */}
        <Card padded style={{ position: "sticky", top: 90 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--charcoal-900)" }}>
              {braider.price}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>· per style</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <Link href="/sign-up">
              <Button fullWidth size="lg" iconLeft={<CalendarIcon />}>Book appointment</Button>
            </Link>
            <Link href="/sign-up">
              <Button fullWidth variant="outline" size="lg" iconLeft={<MessageIcon />}>Message</Button>
            </Link>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
            {[["Identity verified", <ShieldIcon key="s" />], ["Secure payments", <DollarIcon key="d" />], ["Free cancellation 48h", <ClockIcon key="c" />]].map(([t, icon]) => (
              <span key={t as string} style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
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
function DollarIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
