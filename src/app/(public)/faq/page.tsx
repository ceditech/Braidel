import type { Metadata } from "next";
import { faqContent } from "@/content/marketing/faq";
import styles from "@/components/marketing/Marketing.module.css";

export const metadata: Metadata = {
  title: "FAQ | braid.el",
  description: faqContent.hero.body,
};

export default function FaqPage() {
  const { hero, items } = faqContent;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.body}>{hero.body}</p>
      </div>

      <div className={styles.section} style={{ maxWidth: 720 }}>
        {items.map((item) => (
          <details key={item.question} className={styles.faqItem}>
            <summary>
              {item.question}
              <ChevronIcon />
            </summary>
            <p className={styles.faqAnswer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
