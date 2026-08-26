import { Sidebar } from "@/components/dashboard/Sidebar";
import { RoleProvider } from "@/components/dashboard/RoleContext";
import {
  requireOnboardedUser,
  toDashboardRole,
} from "@/lib/authenticated-user";
import { isMarketplaceAdmin } from "@/lib/admin-auth";
import styles from "./layout.module.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireOnboardedUser();
  const role = toDashboardRole(user.role);
  const showAdmin = isMarketplaceAdmin(user);

  return (
    <RoleProvider initialRole={role}>
      <div className={styles.shell}>
        <Sidebar showAdmin={showAdmin} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
