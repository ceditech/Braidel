"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BraidelLogo } from "@/components/ui/BraidelLogo";
import { useRole, type Role } from "@/components/dashboard/RoleContext";

const salonNav = [
  { href: "/dashboard",              label: "Dashboard",     icon: <GridIcon /> },
  { href: "/dashboard/opportunities",label: "Opportunities", icon: <BriefcaseIcon /> },
  { href: "/dashboard/applicants",   label: "Applicants",    icon: <UsersIcon /> },
  { href: "/dashboard/messages",     label: "Messages",      icon: <MessageIcon /> },
  { href: "/dashboard/settings",     label: "Settings",      icon: <SettingsIcon /> },
];

const braiderNav = [
  { href: "/dashboard",             label: "Dashboard",    icon: <GridIcon /> },
  { href: "/dashboard/find-work",   label: "Find work",    icon: <BriefcaseIcon /> },
  { href: "/dashboard/applications",label: "Applications", icon: <InboxIcon /> },
  { href: "/dashboard/messages",    label: "Messages",     icon: <MessageIcon /> },
  { href: "/dashboard/settings",    label: "Settings",     icon: <SettingsIcon /> },
];

const buildNav = [
  { href: "/tracker",      label: "Project Tracker", icon: <TrackerIcon /> },
  { href: "/market-study", label: "Market Study",    icon: <ChartIcon /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useRole();
  const nav = role === "braider" ? braiderNav : salonNav;

  const switchRole = (next: Role) => {
    setRole(next);
    router.push("/dashboard"); // return to the role-aware home on switch
  };

  return (
    <aside
      style={{
        width: 248,
        flexShrink: 0,
        background: "var(--charcoal-900)",
        color: "var(--cream-100)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "20px 20px 18px",
        }}
      >
        <BraidelLogo light size={24} />
      </div>

      {/* Role pill */}
      <div
        style={{
          margin: "0 16px 16px",
          background: "rgba(255,255,255,.06)",
          borderRadius: "var(--radius-pill)",
          padding: 4,
          display: "flex",
          gap: 4,
        }}
      >
        {(["salon", "braider"] as const).map((r) => (
          <button
            key={r}
            onClick={() => switchRole(r)}
            style={{
              flex: 1,
              textAlign: "center",
              border: "none",
              borderRadius: "var(--radius-pill)",
              padding: "7px 0",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 13,
              background: role === r ? "var(--terracotta-500)" : "transparent",
              color: role === r ? "#fff" : "var(--taupe-400)",
              cursor: "pointer",
            }}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 12px" }}>
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "11px 13px",
                borderRadius: "var(--radius-md)",
                fontSize: 15,
                fontWeight: 500,
                color: active ? "#fff" : "var(--cream-200)",
                background: active ? "rgba(255,255,255,.08)" : "transparent",
                transition: "background var(--dur-fast)",
                textDecoration: "none",
              }}
            >
              <span style={{ color: active ? "var(--terracotta-400)" : "var(--taupe-400)" }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Build / internal section */}
      <div
        style={{
          margin: "18px 24px 8px",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--taupe-400)",
        }}
      >
        Insights
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 12px" }}>
        {buildNav.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "11px 13px",
                borderRadius: "var(--radius-md)",
                fontSize: 15,
                fontWeight: 500,
                color: active ? "#fff" : "var(--cream-200)",
                background: active ? "rgba(255,255,255,.08)" : "transparent",
                transition: "background var(--dur-fast)",
                textDecoration: "none",
              }}
            >
              <span style={{ color: active ? "var(--terracotta-400)" : "var(--taupe-400)" }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div
        style={{
          marginTop: "auto",
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <UserButton />
        <div style={{ lineHeight: 1.2, overflow: "hidden" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--cream-100)", whiteSpace: "nowrap" }}>
            My account
          </div>
          <div style={{ fontSize: 12, color: "var(--taupe-400)" }}>
            {role === "salon" ? "Salon owner" : "Braider"}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* Icons */
function GridIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
}
function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function MessageIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function InboxIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}
function SettingsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
}
function TrackerIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
}
function ChartIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
