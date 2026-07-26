"use client";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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

      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: 18,
            }}
          >
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

        <section
          style={{
            padding: "24px 26px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-subtle)",
          }}
        >
          <p style={{ margin: 0, color: "var(--brand)", fontSize: 13, fontWeight: 700 }}>
            Coming in the booking phase
          </p>
          <h2
            style={{
              margin: "7px 0 6px",
              color: "var(--text-strong)",
              fontFamily: "var(--font-display)",
              fontSize: 24,
            }}
          >
            Appointments, saved professionals, and booking history
          </h2>
          <p style={{ maxWidth: 680, margin: 0, color: "var(--text-body)", lineHeight: 1.55 }}>
            Your client account is ready for the scheduling and booking workflows planned in the
            next implementation workstream.
          </p>
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
