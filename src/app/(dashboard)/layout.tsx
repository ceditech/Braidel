import { Sidebar } from "@/components/dashboard/Sidebar";
import { RoleProvider } from "@/components/dashboard/RoleContext";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div className={styles.shell}>
        <Sidebar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
