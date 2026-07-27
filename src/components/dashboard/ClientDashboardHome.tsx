"use client";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./DashboardHome.module.css";

const discoveryOptions = [
  {
    title: "Find your braider",
    description: "Explore professionals by specialty, portfolio, and location.",
    href: "/find-braiders",
    action: "Browse braiders",
  },
  {
    title: "Discover salons",
    description: "Find welcoming salons built around textured-hair expertise.",
    href: "/find-salons",
    action: "Explore salons",
  },
  {
    title: "Book an appointment",
    description: "Compare live services and request a time that fits your schedule.",
    href: "/dashboard/appointments",
    action: "Open appointments",
  },
];

export function ClientDashboardHome({ firstName }: { firstName: string }) {
  return (
    <>
      <Topbar
        title={`Welcome${firstName !== "there" ? `, ${firstName}` : ""}!`}
        subtitle="Discover trusted braiding professionals and save your next connection."
        action={
          <Link href="/find-braiders">
            <Button size="sm" iconRight={<ArrowIcon />}>
              Find a braider
            </Button>
          </Link>
        }
      />

      <div className={styles.body}>
        <section>
          <p
            style={{
              margin: "0 0 14px",
              color: "var(--text-muted)",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Start exploring
          </p>
          <div className={styles.clientGrid}>
            {discoveryOptions.map((option) => (
              <Card key={option.href} padded>
                <h2
                  style={{
                    margin: 0,
                    color: "var(--text-strong)",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                  }}
                >
                  {option.title}
                </h2>
                <p
                  style={{
                    minHeight: 48,
                    margin: "10px 0 20px",
                    color: "var(--text-body)",
                    lineHeight: 1.5,
                  }}
                >
                  {option.description}
                </p>
                <Link href={option.href}>
                  <Button variant="outline" size="sm" iconRight={<ArrowIcon />}>
                    {option.action}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        <section className={styles.clientCallout}>
          <p style={{ margin: 0, color: "var(--brand)", fontSize: 13, fontWeight: 700 }}>
            Booking is live
          </p>
          <h2
            style={{
              margin: "7px 0 6px",
              color: "var(--text-strong)",
              fontFamily: "var(--font-display)",
              fontSize: 24,
            }}
          >
            Your appointments and booking history
          </h2>
          <p style={{ maxWidth: 680, margin: 0, color: "var(--text-body)", lineHeight: 1.55 }}>
            Request services from available Salons and Braiders, track confirmations,
            and manage schedule changes from one calendar.
          </p>
          <Link href="/dashboard/appointments" style={{ display: "inline-flex", marginTop: 18 }}>
            <Button size="sm" iconRight={<ArrowIcon />}>
              Manage appointments
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
