import type { Metadata } from "next";
import Link from "next/link";
import { howItWorksContent } from "@/content/marketing/howItWorks";
import { Button } from "@/components/ui/Button";
import styles from "@/components/marketing/Marketing.module.css";

export const metadata: Metadata = {
  title: "How It Works | braid.el",
  description: howItWorksContent.hero.body,
};

const toneColor: Record<string, string> = {
  brand: "var(--brand)",
  gold: "var(--secondary)",
  sage: "var(--success)",
};

export default function HowItWorksPage() {
  const { hero, steps, audiences } = howItWorksContent;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.body}>{hero.body}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.grid3}>
          {steps.map((step) => (
            <div key={step.n}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: toneColor[step.tone],
                  marginBottom: 10,
                }}
              >
                {step.n}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--text-strong)", margin: "0 0 8px" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionHeading}>Choose your path</h2>
        <div className={styles.grid3}>
          {audiences.map((audience) => (
            <div
              key={audience.title}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text-strong)", margin: 0 }}>
                {audience.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0, flex: 1 }}>
                {audience.body}
              </p>
              <Link href={audience.cta.href}>
                <Button variant="outline" size="sm">{audience.cta.label}</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
