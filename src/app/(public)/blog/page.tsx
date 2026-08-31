import type { Metadata } from "next";
import { blogContent } from "@/content/marketing/blog";
import { resolveMarketingContent } from "@/content/marketing/resolve";
import styles from "@/components/marketing/Marketing.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await resolveMarketingContent("blog", blogContent);
  return {
    title: "Blog | braid.el",
    description: hero.body,
  };
}

export default async function BlogPage() {
  const { hero, topics } = await resolveMarketingContent("blog", blogContent);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.body}>{hero.body}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionHeading}>What&apos;s coming</h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: 12, padding: 0, margin: 0, listStyle: "none", maxWidth: 560 }}>
          {topics.map((topic) => (
            <li
              key={topic}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 15,
                color: "var(--text-body)",
                padding: "12px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", flexShrink: 0 }} />
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
