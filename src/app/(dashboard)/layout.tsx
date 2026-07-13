import { Sidebar } from "@/components/dashboard/Sidebar";
import { RoleProvider } from "@/components/dashboard/RoleContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-page)" }}>
        <Sidebar />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
