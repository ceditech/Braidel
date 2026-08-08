import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import styles from "./page.module.css";

export const metadata = {
  title: "Payment System Design - Braidel",
};

const paymentTables = [
  {
    name: "provider_payment_accounts",
    purpose: "Tracks provider Stripe Connect readiness, onboarding state, charge capability, payout capability, and account restrictions.",
  },
  {
    name: "booking_payments",
    purpose: "Stores the payment record tied to one booking, including status, amount, currency, platform fee, provider gross, and Stripe object references.",
  },
  {
    name: "payment_ledger_entries",
    purpose: "Records the auditable money movement view: client charge, platform fee, provider gross, refund, dispute, or adjustment.",
  },
  {
    name: "payment_webhook_events",
    purpose: "Stores Stripe event IDs and processing state so webhook retries are idempotent and operationally visible.",
  },
];

const launchGates = [
  "Finalize platform fee, deposit, refund, cancellation, no-show, and payout policy.",
  "Choose the Stripe Connect charge architecture and document the risk model.",
  "Implement provider Connect onboarding and payout-readiness warnings.",
  "Create checkout/payment intents from authenticated server code only.",
  "Verify Stripe webhook signatures from raw request bodies and store event IDs.",
  "Run Stripe test-mode QA for success, failure, retry, refund, cancellation, replay, and out-of-order events.",
];

const qaBoundaries = [
  "No live checkout route should be reachable yet.",
  "Stripe environment placeholders may exist, but normal local browsing must not require Stripe secrets.",
  "Existing booking, review, messaging, and notification flows should remain unchanged.",
  "Migration 0015 and all four payment tables should be present in development Neon.",
];

async function getPaymentDiagram() {
  return readFile(
    path.join(process.cwd(), "docs", "payment-system-architecture.svg"),
    "utf8"
  );
}

export default async function PaymentSystemDesignPage() {
  const paymentDiagram = await getPaymentDiagram();

  return (
    <>
      <Topbar
        title="Payment System Design"
        subtitle="Workstream 5 architecture, launch boundaries, and stakeholder decision record."
      />

      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="payment-system-title">
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>Workstream 5</div>
            <h2 id="payment-system-title">Payments are designed in layers so money movement never outruns policy.</h2>
            <p>
              Braidel&apos;s payment architecture separates the first launch path from future
              hiring compensation. Client-to-Provider booking payments are the primary Stripe
              Connect track. Salon-to-Braider money movement is deferred, but the agreement
              itself must be captured later as a product workflow.
            </p>
            <div className={styles.badges}>
              <Badge variant="info" dot>Foundation implemented</Badge>
              <Badge variant="warning" dot>Checkout inactive</Badge>
              <Badge variant="neutral">Decision record</Badge>
            </div>
          </div>
          <div className={styles.heroPanel} aria-label="Current implementation state">
            <span className={styles.panelLabel}>Current state</span>
            <strong>Schema and architecture foundation only</strong>
            <p>
              No Stripe checkout, Connect onboarding, refunds, disputes, payouts, or payment
              webhooks are active as user-facing flows.
            </p>
          </div>
        </section>

        <nav className={styles.anchorTabs} aria-label="Payment design sections">
          <a href="#architecture">Architecture</a>
          <a href="#tracks">Payment Tracks</a>
          <a href="#data-model">Data Model</a>
          <a href="#qa">QA Boundaries</a>
          <a href="#launch">Launch Gates</a>
        </nav>

        <section id="architecture" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Architecture</span>
            <h3>Braidel payment system map</h3>
            <p>
              This diagram is rendered from the durable SVG asset in
              <code>docs/payment-system-architecture.svg</code>.
            </p>
          </div>
          <Card className={styles.diagramCard}>
            <div
              className={styles.diagram}
              aria-label="Braidel payment system architecture diagram"
              dangerouslySetInnerHTML={{ __html: paymentDiagram }}
            />
          </Card>
        </section>

        <section id="tracks" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Payment Tracks</span>
            <h3>Two money relationships, two maturity levels</h3>
          </div>
          <div className={styles.trackGrid}>
            <Card className={styles.trackCard} padded>
              <div className={styles.trackTopline}>
                <Badge variant="success" dot>Launch track</Badge>
                <span>Stripe Connect</span>
              </div>
              <h4>Client-to-Provider booking payments</h4>
              <p>
                Clients pay for appointments. Braidel calculates the booking amount and
                platform fee on the server, Stripe collects payment, and the provider
                portion can be routed to the connected Salon or Braider.
              </p>
              <ul>
                <li>Supports deposits or full payment after policy is finalized.</li>
                <li>Supports platform fees, refunds, disputes, and reconciliation later.</li>
                <li>Maps directly to bookings, notifications, reviews, and support history.</li>
              </ul>
            </Card>

            <Card className={styles.trackCard} padded>
              <div className={styles.trackTopline}>
                <Badge variant="warning" dot>Deferred money movement</Badge>
                <span>Agreement first</span>
              </div>
              <h4>Salon-to-Braider hiring compensation</h4>
              <p>
                Salon owners and Braiders should eventually record hiring terms in Braidel:
                rate, compensation type, work period, completion status, and external payment
                confirmation. Braidel-managed payouts should wait until policy and operations
                are mature.
              </p>
              <ul>
                <li>Capture the agreement before managing the funds.</li>
                <li>Start with external payment status such as paid outside Braidel.</li>
                <li>Add optional in-app invoices only after trust, tax, and dispute rules exist.</li>
              </ul>
            </Card>
          </div>
        </section>

        <section id="data-model" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Data Model</span>
            <h3>Foundation tables already migrated</h3>
            <p>
              Migration <code>0015_cheerful_daredevil.sql</code> established the payment
              foundation in development Neon.
            </p>
          </div>
          <div className={styles.tableGrid}>
            {paymentTables.map((table) => (
              <Card key={table.name} className={styles.tableCard} padded>
                <code>{table.name}</code>
                <p>{table.purpose}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className={styles.splitSection}>
          <div id="qa" className={styles.sectionHeader}>
            <span>QA Scope</span>
            <h3>Validate the boundary, not live payments</h3>
            <p>
              Workstream 5 QA should prove that the foundation exists and nothing accidental
              exposes money movement before the product policy is ready.
            </p>
          </div>
          <Card padded className={styles.checkCard}>
            <ul>
              {qaBoundaries.map((item) => (
                <li key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section id="launch" className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Launch Gates</span>
            <h3>What must be true before Stripe is active</h3>
          </div>
          <div className={styles.gateList}>
            {launchGates.map((gate, index) => (
              <Card key={gate} className={styles.gateItem} padded>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{gate}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className={styles.footerNote}>
          <div>
            <span>Source of truth</span>
            <p>
              The detailed decision record remains in <code>docs/PAYMENT_SYSTEM_ARCHITECTURE.md</code>.
              Keep this page, the tracker, and pre-production checks aligned when payment policy changes.
            </p>
          </div>
          <Link href="/tracker">Open project tracker</Link>
        </section>
      </main>
    </>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
