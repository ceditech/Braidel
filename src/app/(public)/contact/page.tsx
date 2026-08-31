import type { Metadata } from "next";
import { contactContent } from "@/content/marketing/contact";
import { resolveMarketingContent } from "@/content/marketing/resolve";
import styles from "@/components/marketing/Marketing.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await resolveMarketingContent("contact", contactContent);
  return {
    title: "Contact | braid.el",
    description: hero.body,
  };
}

export default async function ContactPage() {
  const { hero, channels } = await resolveMarketingContent("contact", contactContent);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.title}>{hero.title}</h1>
        <p className={styles.body}>{hero.body}</p>
      </div>

      <div className={styles.section} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
        {channels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.href.startsWith("http") ? "_blank" : undefined}
            rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
              textDecoration: "none",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-subtle)" }}>
              {channel.label}
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-strong)" }}>
              {channel.value}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
