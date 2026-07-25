import Link from "next/link";
import { BraidelLogo } from "@/components/ui/BraidelLogo";
import styles from "./Footer.module.css";

const cols = [
  {
    heading: "For braiders",
    links: [
      { label: "Find work", href: "/opportunities" },
      { label: "Build your profile", href: "/sign-up" },
      { label: "Browse salons", href: "/find-salons" },
    ],
  },
  {
    heading: "For salons",
    links: [
      { label: "Post an opportunity", href: "/dashboard/opportunities" },
      { label: "Find braiders", href: "/find-braiders" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "For clients",
    links: [
      { label: "Book a style", href: "/find-braiders" },
      { label: "How it works", href: "/how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--charcoal-900)", color: "var(--cream-100)", marginTop: 80 }}>
      <div className={styles.grid}>
        {/* Brand */}
        <div className={styles.brand}>
          <BraidelLogo light size={26} />
          <p
            style={{
              marginTop: 14,
              fontSize: 14,
              color: "var(--taupe-400)",
              maxWidth: 240,
              lineHeight: 1.6,
            }}
          >
            The marketplace built for the braiding industry — salons, braiders, and the clients who
            love their work.
          </p>
        </div>

        {/* Columns */}
        {cols.map(({ heading, links }) => (
          <div key={heading}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".14em",
                color: "var(--gold-400)",
                marginBottom: 14,
              }}
            >
              {heading}
            </div>
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  display: "block",
                  fontSize: 14,
                  color: "var(--cream-200)",
                  padding: "5px 0",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,.1)",
          padding: "20px var(--gutter)",
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          fontSize: 13,
          color: "var(--taupe-400)",
        }}
      >
        © 2026 Braidel. Made for the culture.
      </div>
    </footer>
  );
}
