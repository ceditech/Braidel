import { getBookingWorkspace } from "@/db/booking-queries";
import { requireOnboardedUser } from "@/lib/authenticated-user";
import { AppointmentsClient } from "./AppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; service?: string }>;
}) {
  const [user, params] = await Promise.all([
    requireOnboardedUser(),
    searchParams,
  ]);
  const workspace = await getBookingWorkspace(user);

  return (
    <AppointmentsClient
      initialWorkspace={workspace}
      initialProviderId={params.provider ?? ""}
      initialServiceId={params.service ?? ""}
      referenceNow={new Date().toISOString()}
    />
  );
}
