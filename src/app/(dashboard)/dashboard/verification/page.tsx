import { Topbar } from "@/components/dashboard/Topbar";
import { getProviderForUser } from "@/db/booking-queries";
import { getProviderVerificationWorkspace } from "@/db/verification-queries";
import { requireDashboardRole } from "@/lib/authenticated-user";
import { VerificationClient } from "./VerificationClient";
import styles from "./VerificationClient.module.css";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const user = await requireDashboardRole("salon_owner", "braider");
  const provider = await getProviderForUser(user);

  if (!provider) {
    return (
      <>
        <Topbar
          title="Verification"
          subtitle="Prepare trust evidence for marketplace review."
        />
        <main className={styles.page}>
          <section className={styles.emptyState}>
            <p className={styles.emptyTitle}>Provider profile required</p>
            <p>
              Complete your provider profile before submitting verification
              evidence.
            </p>
          </section>
        </main>
      </>
    );
  }

  const workspace = await getProviderVerificationWorkspace(provider, user);
  return <VerificationClient initialWorkspace={workspace} />;
}
