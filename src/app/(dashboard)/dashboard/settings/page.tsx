import { currentUser } from "@clerk/nextjs/server";
import { getBraidStyles, getSettingsProfile } from "@/db/queries";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await currentUser();
  const [profile, styles] = await Promise.all([
    user ? getSettingsProfile(user.id) : Promise.resolve({ user: null, salon: null, braider: null }),
    getBraidStyles(),
  ]);

  return <SettingsClient profile={profile} styleOptions={styles.map((style) => style.name)} />;
}
