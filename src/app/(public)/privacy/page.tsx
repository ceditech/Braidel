import type { Metadata } from "next";
import { privacyContent } from "@/content/marketing/privacy";
import styles from "@/components/marketing/Marketing.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | braid.el",
  description: "braid.el's privacy policy.",
};

export default function PrivacyPage() {
  const { updated, sections } = privacyContent;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>Legal</div>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.body}>{updated}</p>
      </div>

      <div className={styles.section} style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 720 }}>
        {sections.map((section) => (
          <div key={section.heading}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--text-strong)", margin: "0 0 8px" }}>
              {section.heading}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-muted)", margin: 0 }}>
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
