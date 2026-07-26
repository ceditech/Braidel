import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { Photo } from "@/components/ui/Photo";
import { BRAIDERS } from "@/lib/sampleData";
import styles from "./Marketplace.module.css";

/* Featured braiders on the landing page = first three of the shared pool */
const FEATURED = BRAIDERS.slice(0, 3);

/* ── How it works steps ── */
const HOW = [
  { n: "01", title: "Create your profile", body: "Set up your salon or braider profile in minutes — showcase your work and tell the community who you are.", tone: "brand" },
  { n: "02", title: "Post or apply",       body: "Salon owners post staffing opportunities. Braiders browse, filter by specialty and location, and apply with one tap.", tone: "gold" },
  { n: "03", title: "Match & connect",     body: "Message directly in-platform, review portfolios, and confirm arrangements — no middlemen, no fees on Phase 1.", tone: "sage" },
];

export default function MarketplacePage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className={styles.hero}
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "72px var(--gutter) 48px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* Copy */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: ".16em",
              color: "var(--brand)",
              marginBottom: 18,
            }}
          >
            The braiding marketplace
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(42px, 5vw, 68px)",
              lineHeight: 1.04,
              letterSpacing: 0,
              color: "var(--text-strong)",
              margin: 0,
            }}
          >
            Braid your craft
            <br />
            into work you love.
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: "var(--text-body)",
              maxWidth: 480,
              marginTop: 20,
            }}
          >
            Braidel connects salon owners with skilled braiders — and helps clients discover and
            book the styles they love.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <Link href="/find-braiders">
              <Button size="lg" iconRight={<ArrowRight />}>Find braiders</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline">I&apos;m a braider</Button>
            </Link>
          </div>

          {/* Social proof counters */}
          <div style={{ display: "flex", gap: 32, marginTop: 36 }}>
            {[["12k+", "braiders"], ["3.4k", "salons"], ["4.9★", "avg rating"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, color: "var(--text-strong)" }}>{n}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo collage */}
        <div className={styles.heroPhotos} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Photo seed={4} aspect="3/4" radius="20px" />
          <div style={{ display: "grid", gap: 14 }}>
            <Photo seed={2} aspect="4/3" radius="20px" />
            <Photo seed={0} aspect="4/3" radius="20px" />
          </div>
        </div>
      </section>

      {/* ── Two-sided value props ─────────────────────────────────── */}
      <section
        className={styles.valueProps}
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "8px var(--gutter) 48px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 22,
        }}
      >
        {[
          {
            title: "For salon owners",
            body: "Post staffing opportunities, review portfolios, and hire vetted braiders fast — fill your chairs without the guesswork.",
            cta: "Post an opportunity",
            href: "/sign-up",
            bg: "var(--bg-inverse)",
            icon: <BriefcaseIcon />,
          },
          {
            title: "For braiders",
            body: "Build a portfolio, set your availability, and find paid work at salons near you — on your terms.",
            cta: "Join as a braider",
            href: "/sign-up",
            bg: "var(--terracotta-500)",
            icon: <UsersIcon />,
          },
        ].map((p) => (
          <div
            key={p.title}
            style={{
              background: p.bg,
              color: "var(--cream-50)",
              borderRadius: "var(--radius-xl)",
              padding: 40,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(255,255,255,.14)",
                display: "grid",
                placeItems: "center",
                marginBottom: 20,
              }}
            >
              {p.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 27,
                margin: 0,
                color: "var(--cream-50)",
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.9, marginTop: 12, maxWidth: 380 }}>
              {p.body}
            </p>
            <Link href={p.href}>
              <button
                style={{
                  marginTop: 24,
                  background: "var(--cream-50)",
                  color: "var(--black)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  height: 46,
                  padding: "0 22px",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {p.cta}
                <ArrowRight />
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* ── Featured braiders ─────────────────────────────────────── */}
      <section
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "0 var(--gutter) 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 32,
                margin: 0,
                color: "var(--text-strong)",
              }}
            >
              Featured braiders
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
              Top-rated professionals taking new clients now.
            </p>
          </div>
          <Link
            href="/find-braiders"
            style={{
              color: "var(--brand)",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 15,
            }}
          >
            See all <ArrowRight />
          </Link>
        </div>

        <div className={styles.featuredGrid} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {FEATURED.map((b) => (
            <Link key={b.id} href={`/find-braiders/${b.id}`} style={{ textDecoration: "none" }}>
              <Card interactive>
                <Photo seed={b.tone} aspect="4/3" />
                <CardBody>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "var(--text-strong)",
                      }}
                    >
                      {b.name}
                    </span>
                    <Badge variant={b.badge === "New" ? "gold" : "brand"}>{b.badge}</Badge>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      color: "var(--text-muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <PinIcon /> {b.city}
                  </span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {b.specs.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 12,
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <Rating value={b.rate} count={b.rev} size="0.9rem" />
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: "var(--text-strong)",
                      }}
                    >
                      {b.price}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-subtle)", padding: "72px var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".16em",
                color: "var(--brand)",
                marginBottom: 12,
              }}
            >
              Simple by design
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(28px,3vw,42px)",
                color: "var(--text-strong)",
                margin: 0,
              }}
            >
              How Braidel works
            </h2>
          </div>

          <div className={styles.stepsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
            {HOW.map((step) => (
              <div
                key={step.n}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-lg)",
                  padding: "32px 28px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--brand)",
                    marginBottom: 16,
                  }}
                >
                  {step.n}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "var(--text-strong)",
                    margin: "0 0 12px",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)", margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--bg-inverse)",
          padding: "80px var(--gutter)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(28px,3vw,44px)",
              color: "var(--cream-50)",
              margin: "0 0 16px",
              lineHeight: 1.12,
            }}
          >
            Ready to grow your braiding career?
          </h2>
          <p style={{ fontSize: 17, color: "var(--taupe-400)", marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of braiders and salon owners building their futures on Braidel.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-up">
              <Button size="lg" iconRight={<ArrowRight />}>Get started free</Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" style={{ color: "var(--cream-100)", borderColor: "rgba(255,255,255,.3)" }}>
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Inline SVG icons (no icon lib dependency) ── */
function ArrowRight() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
