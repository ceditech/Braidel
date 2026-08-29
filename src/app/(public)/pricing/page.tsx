import type { Metadata } from "next";
import { pricingContent } from "@/content/marketing/pricing";
import styles from "@/components/marketing/Marketing.module.css";

export const metadata: Metadata = {
  title: "Pricing | braid.el",
  description: pricingContent.hero.body,
};

export default function PricingPage() {
  const { hero, points } = pricingContent;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.body}>{hero.body}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.grid3}>
          {points.map((point) => (
            <div
              key={point.title}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
              }}
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text-strong)", margin: "0 0 10px" }}>
                {point.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-muted)", margin: 0 }}>
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
