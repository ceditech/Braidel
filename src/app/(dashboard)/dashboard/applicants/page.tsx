import { currentUser } from "@clerk/nextjs/server";
import { getApplicantsForSalon } from "@/db/queries";
import { ApplicantsClient } from "./ApplicantsClient";

export const dynamic = "force-dynamic";

export default async function ApplicantsPage() {
  const user = await currentUser();
  const applicants = user ? await getApplicantsForSalon(user.id) : [];
  return <ApplicantsClient applicants={applicants} />;
}
