"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeDisabled?: boolean;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  closeDisabled = false,
  onClose,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
      onCancel={(event) => {
        event.preventDefault();
        if (!closeDisabled) onClose();
      }}
      onClose={() => {
        if (open && !closeDisabled) onClose();
      }}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            title="Close"
            disabled={closeDisabled}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
}

function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
