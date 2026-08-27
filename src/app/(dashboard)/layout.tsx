import { Sidebar } from "@/components/dashboard/Sidebar";
import { RoleProvider } from "@/components/dashboard/RoleContext";
import {
  requireOnboardedUser,
  getAdminPreviewRole,
  getEffectiveDashboardRole,
} from "@/lib/authenticated-user";
import { isMarketplaceAdmin } from "@/lib/admin-auth";
import styles from "./layout.module.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOnboardedUser();
  const role = await getEffectiveDashboardRole(user);
  const showAdmin = isMarketplaceAdmin(user);
  const previewRole = user.role === "admin" ? await getAdminPreviewRole() : null;

  return (
    <RoleProvider initialRole={role}>
      <div className={styles.shell}>
        <Sidebar showAdmin={showAdmin} previewRole={previewRole} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
