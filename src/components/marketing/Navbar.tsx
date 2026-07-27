"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";
import { BraidelLogo } from "@/components/ui/BraidelLogo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./Navbar.module.css";

const links = [
  { href: "/marketplace",   label: "Marketplace" },
  { href: "/find-braiders", label: "Find braiders" },
  { href: "/find-salons",   label: "Find salons" },
  { href: "/opportunities", label: "Job opportunities" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <BraidelLogo size={26} />
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname.startsWith(href) ? styles.navLinkActive : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.account}>
          <ThemeToggle />
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

        <div className={styles.mobileActions}>
          <ThemeToggle />
          {isSignedIn ? <UserButton /> : null}
          <button
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="public-mobile-navigation" className={styles.mobileMenu} aria-label="Mobile navigation">
          <div className={styles.mobileMenuInner}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={pathname.startsWith(href) ? styles.mobileMenuActive : ""}
              >
                <span>{label}</span>
                <ArrowIcon />
              </Link>
            ))}
            <div className={styles.mobileAuth}>
              {isSignedIn ? (
                <Link href="/dashboard" onClick={closeMenu}>
                  Dashboard
                  <ArrowIcon />
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" onClick={closeMenu}>Log in</Link>
                  <Link href="/sign-up" onClick={closeMenu} className={styles.mobileCta}>
                    Get started
                    <ArrowIcon />
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function MenuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

function CloseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function ArrowIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
