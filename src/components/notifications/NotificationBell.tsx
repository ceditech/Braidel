"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NotificationBell() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const handleUpdate = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      const nextCount = Number(event.detail?.unreadCount);
      if (Number.isFinite(nextCount)) setUnreadCount(Math.max(0, nextCount));
    };
    fetch("/api/notifications", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { unreadCount: 0 }))
      .then((data) => setUnreadCount(Number(data.unreadCount) || 0))
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") setUnreadCount(0);
      });
    window.addEventListener("braidel:notifications-updated", handleUpdate);
    return () => {
      controller.abort();
      window.removeEventListener("braidel:notifications-updated", handleUpdate);
    };
  }, [pathname]);

  const label = unreadCount
    ? `Notifications, ${unreadCount} unread`
    : "Notifications";

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={label}
      title="Notifications"
      style={{
        width: 42,
        height: 42,
        borderRadius: 8,
        border: "1px solid var(--border-default)",
        background: "var(--surface-card)",
        display: "grid",
        placeItems: "center",
        color: "var(--brown-600)",
        position: "relative",
      }}
    >
      <BellIcon />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            display: "grid",
            minWidth: 20,
            height: 20,
            padding: "0 5px",
            placeItems: "center",
            borderRadius: 10,
            background: "var(--terracotta-500)",
            color: "white",
            border: "2px solid var(--bg-page)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
