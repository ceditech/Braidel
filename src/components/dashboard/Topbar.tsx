import React from "react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./Topbar.module.css";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <div className={styles.topbar}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>
          {title}
        </h1>
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.utilityActions}>
          <ThemeToggle />
          <NotificationBell />
        </div>
        {action && <div className={styles.primaryAction}>{action}</div>}
      </div>
    </div>
  );
}
