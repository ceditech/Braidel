import { getBraidStyles, getSettingsProfile } from "@/db/queries";
import { requireOnboardedUser } from "@/lib/authenticated-user";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireOnboardedUser();
  const [profile, styles] = await Promise.all([
    getSettingsProfile(user.clerkId),
    getBraidStyles(),
  ]);

  return <SettingsClient profile={profile} styleOptions={styles.map((style) => style.name)} />;
}
