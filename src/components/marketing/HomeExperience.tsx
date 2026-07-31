"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { BraidelLogo } from "@/components/ui/BraidelLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./HomeExperience.module.css";

const pathways = [
  {
    label: "Find braiders",
    description: "Book trusted craft or meet the talent your salon needs.",
    href: "/find-braiders",
    image: "/images/home/find-braiders.png",
    imageAlt: "Professional braider creating knotless braids in a modern studio",
    index: "01",
  },
  {
    label: "Find salons",
    description: "Discover welcoming spaces built around textured-hair expertise.",
    href: "/find-salons",
    image: "/images/home/find-salons.png",
    imageAlt: "Salon owner welcoming a client into a contemporary braiding salon",
    index: "02",
  },
  {
    label: "Job opportunities",
    description: "Turn your portfolio and experience into your next paid move.",
    href: "/opportunities",
    image: "/images/home/job-opportunities.png",
    imageAlt: "Salon owner and professional braider reviewing paid opportunities",
    index: "03",
  },
];

const slides = [
  {
    eyebrow: "Find your people",
    title: "Craft worth being seen.",
    body: "Explore professional braiders by specialty, portfolio, location, and availability.",
    href: "/find-braiders",
    cta: "Meet braiders",
    image: "/images/home/find-braiders.png",
    imageAlt: "Professional braider working with a client",
    marker: "Braiders",
  },
  {
    eyebrow: "Find your place",
    title: "A chair that fits your ambition.",
    body: "Discover braiding salons where skill, culture, and professional growth belong together.",
    href: "/find-salons",
    cta: "Explore salons",
    image: "/images/home/find-salons.png",
    imageAlt: "Modern braiding salon with its owner and clients",
    marker: "Salons",
  },
  {
    eyebrow: "Keep moving",
    title: "One conversation can change your next move.",
    body: "Bring opportunities, applications, and hiring conversations into one connected network.",
    href: "/sign-up",
    cta: "Join the network",
    image: "/images/home/job-opportunities.png",
    imageAlt: "Braider and salon owner discussing work together",
    marker: "Connect",
  },
];

const navItems = [
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

export function HomeExperience() {
  const { isSignedIn } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotlightPaused, setSpotlightPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || spotlightPaused) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [spotlightPaused]);

  const slide = slides[activeSlide];

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brandLink} aria-label="braid.el home">
          <BraidelLogo size={31} />
        </Link>

        <Link href="/marketplace" className={styles.marketplaceLink}>
          Marketplace
          <ArrowUpRight />
        </Link>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <ThemeToggle className={styles.themeToggle} />
          {isSignedIn ? (
            <div className={styles.accountActions}>
              <Link href="/dashboard" className={styles.dashboardLink}>
                Dashboard
                <ArrowRight />
              </Link>
              <UserButton />
            </div>
          ) : (
            <Link href="/sign-up" className={styles.getStarted}>
              Get started
              <ArrowRight />
            </Link>
          )}
          {isSignedIn ? (
            <span className={styles.mobileProfile}>
              <UserButton />
            </span>
          ) : null}
          <button
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <Link href="/marketplace" onClick={() => setMenuOpen(false)}>
              Marketplace
            </Link>
            {navItems.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            {isSignedIn ? (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                Get started
              </Link>
            )}
          </nav>
        )}
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="home-title">
          <aside className={styles.pathways} aria-label="Explore braid.el">
            {pathways.map((pathway) => (
              <Link key={pathway.href} href={pathway.href} className={styles.pathway}>
                <Image
                  src={pathway.image}
                  alt={pathway.imageAlt}
                  fill
                  priority={pathway.index === "01"}
                  sizes="(max-width: 860px) 88vw, 32vw"
                  className={styles.pathwayImage}
                />
                <span className={styles.pathwayShade} aria-hidden="true" />
                <span className={styles.pathwayIndex}>{pathway.index}</span>
                <span className={styles.pathwayCopy}>
                  <strong>{pathway.label}</strong>
                  <span>{pathway.description}</span>
                </span>
                <span className={styles.pathwayArrow} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            ))}
          </aside>

          <div
            className={styles.stage}
            onMouseEnter={() => setSpotlightPaused(true)}
            onMouseLeave={() => setSpotlightPaused(false)}
            onFocusCapture={() => setSpotlightPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setSpotlightPaused(false);
              }
            }}
          >
            <div className={styles.copyViewport} aria-live="polite" aria-atomic="true">
              <div
                className={styles.copyTrack}
                style={{ transform: `translate3d(-${activeSlide * 100}%, 0, 0)` }}
              >
                {slides.map((item, index) => (
                  <div
                    key={item.marker}
                    className={styles.stageCopy}
                    aria-hidden={index !== activeSlide}
                  >
                    <div className={styles.eyebrow}>
                      <span aria-hidden="true" />
                      {item.eyebrow}
                    </div>
                    {index === activeSlide ? (
                      <h1 id="home-title">{item.title}</h1>
                    ) : (
                      <div className={styles.stageTitle}>{item.title}</div>
                    )}
                    <p>{item.body}</p>
                    <Link
                      href={item.href}
                      className={styles.stageCta}
                      tabIndex={index === activeSlide ? undefined : -1}
                    >
                      {item.cta}
                      <span aria-hidden="true">
                        <ArrowRight />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.carousel}>
              {slides.map((item, index) => (
                <div
                  key={item.marker}
                  className={`${styles.slide} ${index === activeSlide ? styles.slideActive : ""}`}
                  aria-hidden={index !== activeSlide}
                >
                  <Image
                    src={item.image}
                    alt={index === activeSlide ? item.imageAlt : ""}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 860px) 100vw, 68vw"
                    className={styles.slideImage}
                  />
                </div>
              ))}

              <div className={styles.slideMeta}>
                <span className={styles.slideMarker}>{slide.marker}</span>
                <span className={styles.slideCount}>
                  0{activeSlide + 1} / 0{slides.length}
                </span>
              </div>

              <div className={styles.carouselControls} aria-label="Spotlight slides">
                {slides.map((item, index) => (
                  <button
                    key={item.marker}
                    type="button"
                    className={index === activeSlide ? styles.controlActive : ""}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${item.marker} spotlight`}
                    aria-current={index === activeSlide ? "true" : undefined}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={styles.about}>
          <p className={styles.sectionLabel}>Built for the braiding economy</p>
          <div className={styles.aboutGrid}>
            <h2>One network. Every side of the chair.</h2>
            <div>
              <p>
                braid.el gives braiders, salon owners, and clients a clearer way to discover each
                other, show real work, and build lasting professional relationships.
              </p>
              <Link href="/marketplace" className={styles.textLink}>
                Enter the marketplace <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.process}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>How it works</p>
            <h2>From discovery to connection.</h2>
          </div>
          <ol className={styles.steps}>
            <li>
              <span>01</span>
              <strong>Build your presence</strong>
              <p>Create a profile that reflects your craft, business, or next opportunity.</p>
            </li>
            <li>
              <span>02</span>
              <strong>Explore with intent</strong>
              <p>Search braiders, salons, and paid work with meaningful filters.</p>
            </li>
            <li>
              <span>03</span>
              <strong>Connect directly</strong>
              <p>Apply, shortlist, match, and keep the conversation in one place.</p>
            </li>
          </ol>
        </section>

        <section id="pricing" className={styles.pricing}>
          <div>
            <p className={styles.sectionLabel}>Simple pricing</p>
            <h2>Start building your network for free.</h2>
          </div>
          <div className={styles.priceCallout}>
            <span>$0</span>
            <p>Join, create your profile, and explore the marketplace.</p>
            <Link href="/sign-up">
              Create your account <ArrowRight />
            </Link>
          </div>
        </section>

        <section id="journal" className={styles.journal}>
          <div className={styles.sectionIntro}>
            <p className={styles.sectionLabel}>From the braid.el journal</p>
            <h2>Ideas for craft, chairs, and growth.</h2>
          </div>
          <div className={styles.journalGrid}>
            <article>
              <span>Career</span>
              <h3>How to turn a strong portfolio into better opportunities</h3>
              <p>Practical ways to present your work and make your specialty easier to discover.</p>
            </article>
            <article>
              <span>Salon</span>
              <h3>Building a salon culture braiders want to join</h3>
              <p>What thoughtful owners can do to attract, support, and retain excellent talent.</p>
            </article>
            <article>
              <span>Community</span>
              <h3>Why the future of braiding is connected</h3>
              <p>How a trusted professional network can strengthen the entire industry.</p>
            </article>
          </div>
        </section>
      </main>

      <footer id="contact" className={styles.footer}>
        <div>
          <BraidelLogo light size={36} tagline />
          <p>Ready for your next connection?</p>
        </div>
        <div className={styles.footerActions}>
          <Link href="/sign-up">Get started</Link>
          <a href="mailto:hello@braidel.com">hello@braidel.com</a>
        </div>
        <span className={styles.copyright}>© 2026 braid.el</span>
      </footer>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
