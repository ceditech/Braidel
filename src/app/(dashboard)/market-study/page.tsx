import { Topbar } from "@/components/dashboard/Topbar";
import { PrintButton } from "@/components/dashboard/PrintButton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import {
  MARKET_STATS,
  COMPETITORS,
  BENCHMARKS,
  TAM_SAM_SOM,
  TAM_SAM_SOM_TOTAL,
  VIABILITY,
  VIABILITY_OVERALL,
  SUSTAINABILITY,
  KEY_RISKS,
} from "@/lib/marketStudy";

export const metadata = {
  title: "Market Study — Braidel",
};

const RELEVANCE_VARIANT = {
  Direct: "brand",
  Indirect: "neutral",
  "Very indirect": "neutral",
} as const;

export default function MarketStudyPage() {
  return (
    <>
      <Topbar
        title="Market Study & Benchmark"
        subtitle="Investor and partner briefing — the Braidel opportunity."
        action={<PrintButton />}
      />

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 26, maxWidth: 1080 }}>
        {/* ── Executive thesis ──────────────────────────────────── */}
        <div
          style={{
            background: "var(--bg-inverse)",
            color: "var(--cream-50)",
            borderRadius: "var(--radius-xl)",
            padding: 36,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".16em",
              color: "var(--gold-400)",
              marginBottom: 14,
            }}
          >
            The opportunity
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 26,
              lineHeight: 1.2,
              margin: "0 0 14px",
              maxWidth: 720,
            }}
          >
            A multi-billion-dollar industry with no category-defining platform.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--cream-200)", maxWidth: 720, margin: 0 }}>
            The braiding economy is large, culturally rooted, and overwhelmingly served by
            word-of-mouth, Instagram DMs, and cash. Horizontal players (StyleSeat, Booksy) treat
            braiding as one service among hundreds. Braidel&apos;s vertical focus — staffing first,
            then booking, payments, certification, and supply — is a genuine white space with a
            proven playbook behind it (Toast, Mindbody, StyleSeat).
          </p>

          <div style={{ display: "flex", gap: 32, marginTop: 26, flexWrap: "wrap" }}>
            {[
              [`${VIABILITY_OVERALL}/10`, "Overall viability"],
              ["$2.7B+", "Total addressable market"],
              ["7", "Stacked revenue streams"],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 28, color: "var(--cream-50)" }}>{n}</div>
                <div style={{ fontSize: 13, color: "var(--taupe-400)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Market size ───────────────────────────────────────── */}
        <Section title="Market size" subtitle="A large, growing, and under-digitized industry.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {MARKET_STATS.map((s) => (
              <StatCard key={s.label} icon={<TrendIcon />} label={s.label} value={s.value} tone={s.tone} />
            ))}
          </div>
        </Section>

        {/* ── Business model ────────────────────────────────────── */}
        <Section title="Why the model is sustainable & scalable" subtitle="Structural advantages and the risks we're managing.">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
            {/* Pillars */}
            <Card padded>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, margin: "0 0 16px", color: "var(--text-strong)" }}>
                Strengths
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {SUSTAINABILITY.map((p) => (
                  <div key={p.title} style={{ display: "flex", gap: 12 }}>
                    <span style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }}><CheckCircle /></span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-strong)" }}>{p.title}</div>
                      <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.55, marginTop: 2 }}>{p.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risks */}
            <Card padded>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, margin: "0 0 16px", color: "var(--text-strong)" }}>
                Risks we&apos;re managing
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {KEY_RISKS.map((p) => (
                  <div key={p.title} style={{ display: "flex", gap: 12 }}>
                    <span style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }}><AlertIcon /></span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text-strong)" }}>{p.title}</div>
                      <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.55, marginTop: 2 }}>{p.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* ── Competitive landscape ─────────────────────────────── */}
        <Section title="Competitive landscape" subtitle="No dominant vertical platform for braiding exists today.">
          <Card>
            <Table
              head={["Player", "Model", "Relevance", "Gap Braidel fills"]}
              widths={["150px", "1.2fr", "110px", "1.6fr"]}
              rows={COMPETITORS.map((c) => [
                <strong key="n" style={{ color: "var(--text-strong)" }}>{c.name}</strong>,
                <span key="m" style={{ color: "var(--text-muted)" }}>{c.model}</span>,
                <Badge key="r" variant={RELEVANCE_VARIANT[c.relevance]} dot={c.relevance === "Direct"}>{c.relevance}</Badge>,
                <span key="g" style={{ color: "var(--text-body)" }}>{c.gap}</span>,
              ])}
            />
          </Card>
        </Section>

        {/* ── Benchmarks ────────────────────────────────────────── */}
        <Section title="Benchmark platforms" subtitle="Vertical marketplaces that ran this exact playbook to scale.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
            {BENCHMARKS.map((b) => (
              <Card key={b.platform} padded>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>{b.platform}</span>
                  <Badge variant="gold">{b.outcome}</Badge>
                </div>
                <div style={{ fontSize: 13, color: "var(--brand)", fontWeight: 600, marginBottom: 8 }}>{b.why}</div>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--text-muted)", margin: 0 }}>{b.lesson}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── TAM / SAM / SOM ───────────────────────────────────── */}
        <Section title="Addressable market" subtitle="Conservative estimates for a focused US launch.">
          <Card>
            <Table
              head={["Segment", "TAM", "SAM", "3-yr SOM"]}
              widths={["1.6fr", "1fr", "1fr", "1fr"]}
              rows={TAM_SAM_SOM.map((m) => [
                <span key="s" style={{ color: "var(--text-strong)", fontWeight: 500 }}>{m.segment}</span>,
                <Mono key="t">{m.tam}</Mono>,
                <Mono key="a">{m.sam}</Mono>,
                <Mono key="o" strong>{m.som}</Mono>,
              ])}
              footer={[
                <strong key="s" style={{ color: "var(--text-strong)" }}>{TAM_SAM_SOM_TOTAL.segment}</strong>,
                <Mono key="t" strong>{TAM_SAM_SOM_TOTAL.tam}</Mono>,
                <Mono key="a" strong>{TAM_SAM_SOM_TOTAL.sam}</Mono>,
                <Mono key="o" strong>{TAM_SAM_SOM_TOTAL.som}</Mono>,
              ]}
            />
          </Card>
        </Section>

        {/* ── Viability scorecard ───────────────────────────────── */}
        <Section title="Viability scorecard" subtitle={`Weighted assessment across six factors — overall ${VIABILITY_OVERALL}/10.`}>
          <Card padded>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {VIABILITY.map((v) => (
                <div key={v.factor} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 220, flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>{v.factor}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{v.note}</div>
                  </div>
                  <div style={{ flex: 1, height: 10, borderRadius: 999, background: "var(--bg-sunken)", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${v.score * 10}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: v.score >= 8 ? "var(--success)" : v.score >= 6 ? "var(--gold-500)" : "var(--brand)",
                      }}
                    />
                  </div>
                  <div style={{ width: 44, textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>
                    {v.score}/10
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 22,
                paddingTop: 20,
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text-strong)" }}>
                  Overall viability
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Strong, with careful execution</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, color: "var(--brand)" }}>
                {VIABILITY_OVERALL}
                <span style={{ fontSize: 18, color: "var(--text-subtle)" }}>/10</span>
              </div>
            </div>
          </Card>
        </Section>

        {/* Disclaimer */}
        <p style={{ fontSize: 12, color: "var(--text-subtle)", lineHeight: 1.6, margin: 0 }}>
          Figures are analyst estimates compiled for the Braidel business case and include ranges to
          reflect informal-economy uncertainty. Prepared for partner and shareholder review — not a
          financial guarantee or offer.
        </p>
      </div>
    </>
  );
}

/* ── Section wrapper ─────────────────────────────────────────────── */
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, margin: 0, color: "var(--text-strong)" }}>{title}</h3>
        {subtitle && <p style={{ margin: "3px 0 0", fontSize: 14, color: "var(--text-muted)" }}>{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── Simple table (header + rows + optional footer) ──────────────── */
function Table({
  head,
  rows,
  widths,
  footer,
}: {
  head: string[];
  rows: React.ReactNode[][];
  widths: string[];
  footer?: React.ReactNode[];
}) {
  const grid = widths.join(" ");
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: grid,
          gap: 16,
          padding: "14px 22px",
          background: "var(--bg-subtle)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          color: "var(--text-muted)",
        }}
      >
        {head.map((h) => <span key={h}>{h}</span>)}
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: grid,
            gap: 16,
            padding: "15px 22px",
            alignItems: "center",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: 14,
          }}
        >
          {row}
        </div>
      ))}
      {/* Footer */}
      {footer && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: grid,
            gap: 16,
            padding: "15px 22px",
            alignItems: "center",
            borderTop: "2px solid var(--border-strong)",
            background: "var(--brand-soft)",
            fontSize: 14,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function Mono({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: strong ? 700 : 500, color: strong ? "var(--text-strong)" : "var(--text-body)" }}>
      {children}
    </span>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */
function TrendIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
}
function CheckCircle() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function AlertIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}
