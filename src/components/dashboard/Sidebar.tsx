"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { BraidelLogo } from "@/components/ui/BraidelLogo";
import { Drawer } from "@/components/ui/Drawer";
import { useRole, type Role } from "@/components/dashboard/RoleContext";
import styles from "./Sidebar.module.css";

const salonNav = [
  { href: "/dashboard",              label: "Dashboard",     icon: <GridIcon /> },
  { href: "/dashboard/appointments", label: "Appointments",  icon: <CalendarIcon /> },
  { href: "/dashboard/reviews",      label: "Reviews",       icon: <StarIcon /> },
  { href: "/dashboard/opportunities",label: "Opportunities", icon: <BriefcaseIcon /> },
  { href: "/dashboard/applicants",   label: "Applicants",    icon: <UsersIcon /> },
  { href: "/dashboard/messages",     label: "Messages",      icon: <MessageIcon /> },
  { href: "/dashboard/notifications",label: "Notifications", icon: <BellIcon /> },
  { href: "/dashboard/verification", label: "Verification",  icon: <ShieldIcon /> },
  { href: "/dashboard/settings",     label: "Settings",      icon: <SettingsIcon /> },
];

const braiderNav = [
  { href: "/dashboard",             label: "Dashboard",    icon: <GridIcon /> },
  { href: "/dashboard/appointments",label: "Appointments", icon: <CalendarIcon /> },
  { href: "/dashboard/reviews",     label: "Reviews",      icon: <StarIcon /> },
  { href: "/dashboard/find-work",   label: "Find work",    icon: <BriefcaseIcon /> },
  { href: "/dashboard/applications",label: "Applications", icon: <InboxIcon /> },
  { href: "/dashboard/messages",    label: "Messages",     icon: <MessageIcon /> },
  { href: "/dashboard/notifications",label: "Notifications", icon: <BellIcon /> },
  { href: "/dashboard/verification",label: "Verification", icon: <ShieldIcon /> },
  { href: "/dashboard/settings",    label: "Settings",     icon: <SettingsIcon /> },
];

const clientNav = [
  { href: "/dashboard",               label: "Dashboard",     icon: <GridIcon /> },
  { href: "/dashboard/appointments",  label: "Appointments",  icon: <CalendarIcon /> },
  { href: "/find-braiders",           label: "Find braiders", icon: <UsersIcon /> },
  { href: "/find-salons",             label: "Find salons",   icon: <BriefcaseIcon /> },
  { href: "/dashboard/messages",      label: "Messages",      icon: <MessageIcon /> },
  { href: "/dashboard/notifications", label: "Notifications", icon: <BellIcon /> },
  { href: "/dashboard/settings",      label: "Settings",      icon: <SettingsIcon /> },
];

const roleLabels: Record<Role, string> = {
  salon: "Salon owner",
  braider: "Braider",
  client: "Client",
  admin: "Admin",
};

const buildNav = [
  { href: "/tracker",               label: "Project Tracker",       icon: <TrackerIcon /> },
  { href: "/market-study",          label: "Market Study",          icon: <ChartIcon /> },
  { href: "/payment-system-design", label: "Payment System Design", icon: <PaymentIcon /> },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Admin Review", icon: <ShieldIcon /> },
];

export function Sidebar({ showAdmin = false }: { showAdmin?: boolean }) {
  const pathname = usePathname();
  const { role } = useRole();
  const [moreOpen, setMoreOpen] = useState(false);
  const nav =
    role === "salon"
      ? salonNav
      : role === "braider"
        ? braiderNav
        : role === "admin"
          ? adminNav
          : clientNav;
  const insightsNav = showAdmin ? [...buildNav, ...adminNav] : buildNav;
  const mobilePrimary = nav.slice(0, 4);
  const mobileMore = nav.slice(4);

  return (
    <>
      <aside
        className={styles.sidebar}
        style={{
          width: 248,
          flexShrink: 0,
          background: "var(--bg-inverse)",
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
        className={styles.logo}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "20px 20px 18px",
        }}
      >
        <BraidelLogo light size={24} />
      </div>

      {/* Authenticated account role */}
      <div
        className={styles.roleSwitch}
        style={{
          margin: "0 16px 16px",
          background: "rgba(255,255,255,.06)",
          borderRadius: "var(--radius-pill)",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--cream-100)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {roleLabels[role]}
      </div>

      {/* Nav items */}
      <nav className={styles.primaryNav} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 12px" }}>
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
        className={styles.insightsLabel}
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
      <nav className={styles.insightsNav} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "0 12px" }}>
        {insightsNav.map(({ href, label, icon }) => {
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
          className={styles.userArea}
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
              {roleLabels[role]}
            </div>
          </div>
        </div>

        <nav className={styles.mobilePrimaryNav} aria-label="Mobile dashboard navigation">
          {mobilePrimary.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={active ? styles.mobileItemActive : undefined}
                onClick={() => setMoreOpen(false)}
              >
                <span aria-hidden="true">{icon}</span>
                <span>{shortMobileLabel(label)}</span>
              </Link>
            );
          })}
          <button
            type="button"
            className={moreOpen ? styles.mobileItemActive : undefined}
            aria-label="Open more dashboard navigation"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
          >
            <span aria-hidden="true"><MoreIcon /></span>
            <span>More</span>
          </button>
        </nav>
      </aside>

      <Drawer
        open={moreOpen}
        title="More"
        description={`${roleLabels[role]} navigation and account`}
        onClose={() => setMoreOpen(false)}
      >
        <div className={styles.moreMenu}>
          <div className={styles.moreSection}>
            <p className={styles.moreLabel}>Workspace</p>
            {mobileMore.map(({ href, label, icon }) => {
              const active = pathname === href || pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.moreLink} ${active ? styles.moreLinkActive : ""}`}
                  onClick={() => setMoreOpen(false)}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.moreSection}>
            <p className={styles.moreLabel}>Insights</p>
            {insightsNav.map(({ href, label, icon }) => {
              const active = pathname === href || pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.moreLink} ${active ? styles.moreLinkActive : ""}`}
                  onClick={() => setMoreOpen(false)}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.mobileAccount}>
            <UserButton />
            <div className={styles.mobileAccountText}>
              <strong>My account</strong>
              <span>{roleLabels[role]}</span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

function shortMobileLabel(label: string) {
  if (label === "Opportunities") return "Jobs";
  if (label === "Appointments") return "Bookings";
  if (label === "Applications") return "Applied";
  if (label === "Find braiders") return "Braiders";
  if (label === "Find salons") return "Salons";
  return label;
}

/* Icons */
function GridIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
}
function CalendarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/></svg>;
}
function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function MessageIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function BellIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
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
function PaymentIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h.01"/><path d="M11 15h2"/></svg>;
}
function StarIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
}
function MoreIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>;
}
