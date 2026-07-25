"use client";

import Link from "next/link";
import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import type { NotificationDTO, NotificationType } from "@/db/queries";
import styles from "./NotificationsClient.module.css";

export function NotificationsClient({ initialNotifications }: { initialNotifications: NotificationDTO[] }) {
  const [items, setItems] = useState(initialNotifications);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const unreadCount = items.filter((item) => item.readAt === null).length;

  async function markRead(id: string) {
    const readAt = new Date().toISOString();
    setItems((current) => current.map((item) => (item.id === id ? { ...item, readAt } : item)));
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        window.dispatchEvent(new CustomEvent("braidel:notifications-updated", {
          detail: { unreadCount: data.unreadCount },
        }));
        return;
      }
    } catch {
      // Restore the unread state below.
    }
    setItems((current) => current.map((item) => (item.id === id ? { ...item, readAt: null } : item)));
  }

  async function markAllRead() {
    if (!unreadCount) return;
    const previous = items;
    const readAt = new Date().toISOString();
    setIsMarkingAll(true);
    setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? readAt })));
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!response.ok) {
        setItems(previous);
      } else {
        const data = await response.json().catch(() => ({}));
        window.dispatchEvent(new CustomEvent("braidel:notifications-updated", {
          detail: { unreadCount: data.unreadCount },
        }));
      }
    } catch {
      setItems(previous);
    } finally {
      setIsMarkingAll(false);
    }
  }

  return (
    <>
      <Topbar title="Notifications" subtitle="Application, message, review, and profile activity." />
      <main className={styles.page}>
        <div className={styles.toolbar}>
          <p className={styles.summary}>{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</p>
          <Button type="button" size="sm" variant="outline" disabled={!unreadCount || isMarkingAll} onClick={markAllRead}>
            {isMarkingAll ? "Marking..." : "Mark all read"}
          </Button>
        </div>

        <div className={styles.list}>
          {items.length ? items.map((item) => (
            <article key={item.id} className={`${styles.row} ${item.readAt ? "" : styles.unread}`}>
              <span className={styles.icon}><NotificationIcon type={item.type} /></span>
              {item.href ? (
                <Link href={item.href} className={styles.content} onClick={() => !item.readAt && markRead(item.id)}>
                  <NotificationText item={item} />
                </Link>
              ) : (
                <div className={styles.content}><NotificationText item={item} /></div>
              )}
              {!item.readAt && (
                <button type="button" className={styles.readButton} aria-label={`Mark ${item.title} as read`} title="Mark as read" onClick={() => markRead(item.id)}>
                  <CheckIcon />
                </button>
              )}
            </article>
          )) : (
            <div className={styles.empty}>No notifications yet.</div>
          )}
        </div>
      </main>
    </>
  );
}

function NotificationText({ item }: { item: NotificationDTO }) {
  return (
    <>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.body}>{item.body}</div>
      <div className={styles.time}>{formatActivityTime(item.createdAt)}</div>
    </>
  );
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function NotificationIcon({ type }: { type: NotificationType }) {
  if (type === "message") return <MessageIcon />;
  if (type === "review") return <StarIcon />;
  if (type === "portfolio") return <ImageIcon />;
  if (type === "application" || type === "application_status") return <BriefcaseIcon />;
  return <BellIcon />;
}

function CheckIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>; }
function MessageIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function StarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/></svg>; }
function ImageIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>; }
function BriefcaseIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function BellIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>; }
