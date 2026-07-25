"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./Drawer.module.css";

interface DrawerProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeDisabled?: boolean;
  onClose: () => void;
}

export function Drawer({
  open,
  title,
  description,
  children,
  footer,
  closeDisabled = false,
  onClose,
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!closeDisabled) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !closeDisabled) onClose();
      }}
      onClose={() => {
        if (open && !closeDisabled) onClose();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headingGroup}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            {description && <p id={descriptionId} className={styles.description}>{description}</p>}
          </div>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close applicant details"
            title="Close"
            disabled={closeDisabled}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </dialog>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
