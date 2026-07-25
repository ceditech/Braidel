"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { BraidelLogo } from "@/components/ui/BraidelLogo";
import { Button } from "@/components/ui/Button";
import styles from "./Navbar.module.css";

const links = [
  { href: "/find-braiders", label: "Find braiders" },
  { href: "/find-salons",   label: "Find salons" },
  { href: "/opportunities", label: "Job opportunities" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(251,247,241,.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className={styles.container}>
        <Link href="/">
          <BraidelLogo size={26} />
        </Link>

        <nav className={styles.nav}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: 15,
                fontWeight: 600,
                color: pathname.startsWith(href) ? "var(--brand)" : "var(--text-body)",
                transition: "color var(--dur-fast)",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.account}>
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button size="sm" variant="outline">Dashboard</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                style={{ fontWeight: 600, fontSize: 15, color: "var(--text-body)" }}
              >
                Log in
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
