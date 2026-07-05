"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { JOBS, SALONS } from "@/lib/sampleData";

const RESPONSIBILITIES = [
  "Deliver high-quality braiding styles to a steady flow of clients",
  "Maintain a clean, welcoming station and follow salon hygiene standards",
  "Advise clients on style options and aftercare",
  "Collaborate with the team during busy weekends and events",
];

const OFFERS = [
  "Competitive pay with tips",
  "Steady, pre-booked clientele",
  "Supportive team and clean, modern stations",
  "Flexible scheduling",
];

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const job = JOBS.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px var(--gutter)", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--charcoal-900)" }}>Opportunity not found</h1>
        <p style={{ color: "var(--text-muted)", margin: "8px 0 24px" }}>This opening may have been filled or removed.</p>
        <Link href="/opportunities"><Button>Back to opportunities</Button></Link>
      </div>
    );
  }

  const salon = SALONS.find((s) => s.name === job.salon);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px var(--gutter) 40px" }}>
      <Link href="/opportunities" style={{ color: "var(--text-muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 18 }}>
        <span style={{ transform: "rotate(180deg)", display: "inline-flex" }}><ChevronIcon /></span>
        Back to opportunities
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32, alignItems: "start" }}>
        {/* Main */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(26px,3vw,34px)", margin: 0, color: "var(--charcoal-900)" }}>
              {job.title}
            </h1>
            <Badge variant="neutral">{job.type}</Badge>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, color: "var(--text-muted)", fontSize: 15, flexWrap: "wrap", alignItems: "center" }}>
            {salon ? (
              <Link href={`/find-salons/${salon.id}`} style={{ color: "var(--text-link)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                <BuildingIcon /> {job.salon}
              </Link>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><BuildingIcon /> {job.salon}</span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><PinIcon /> {job.city}</span>
            <span>Posted {job.posted}</span>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
            {job.specs.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>

          {/* Sections */}
          <Section title="About the role">
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text-body)", margin: 0 }}>
              {job.salon} in {job.city} is hiring a {job.title.toLowerCase()} ({job.type.toLowerCase()}).
              You&apos;ll work with a supportive team serving clients who love {job.specs.map((s) => s.toLowerCase()).join(", ")} styles.
              This is a great fit for a braider who takes pride in clean part work, healthy scalps, and lasting styles.
            </p>
          </Section>

          <Section title="What you'll do">
            <BulletList items={RESPONSIBILITIES} />
          </Section>

          <Section title="What we offer">
            <BulletList items={OFFERS} />
          </Section>
        </div>

        {/* Sticky apply card */}
        <Card padded style={{ position: "sticky", top: 90 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--charcoal-900)" }}>{job.pay}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>{job.type} · {job.city}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <Link href="/sign-up"><Button fullWidth size="lg" iconRight={<ArrowRight />}>Apply now</Button></Link>
            <Link href="/sign-up"><Button fullWidth variant="outline" size="lg">Save for later</Button></Link>
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
            {[["Verified salon", <ShieldIcon key="s" />], ["Direct messaging", <MessageIcon key="m" />], ["No placement fees", <DollarIcon key="d" />]].map(([t, icon]) => (
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28, maxWidth: 620 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, margin: "0 0 12px", color: "var(--charcoal-900)" }}>{title}</h2>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((it) => (
        <li key={it} style={{ display: "flex", gap: 10, fontSize: 15, lineHeight: 1.55, color: "var(--text-body)" }}>
          <span style={{ color: "var(--brand)", flexShrink: 0, marginTop: 3 }}><CheckIcon /></span>
          {it}
        </li>
      ))}
    </ul>
  );
}

function ChevronIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>; }
function PinIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function BuildingIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10M9 7h.01M15 7h.01M9 12h.01M15 12h.01"/></svg>; }
function ArrowRight()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>; }
function CheckIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function ShieldIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function MessageIcon()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function DollarIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
