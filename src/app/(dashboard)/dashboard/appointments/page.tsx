import { getBookingWorkspace } from "@/db/booking-queries";
import { requireOnboardedUser } from "@/lib/authenticated-user";
import { AppointmentsClient } from "./AppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; service?: string; booking?: string }>;
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
      initialBookingId={params.booking ?? ""}
      referenceNow={new Date().toISOString()}
    />
  );
}
