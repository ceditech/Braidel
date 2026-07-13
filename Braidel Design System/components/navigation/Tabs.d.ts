import * as React from 'react';

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Optional count badge (e.g. applicant count). */
  count?: number;
  /** Optional leading icon. */
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** Controlled active value. Omit for uncontrolled. */
  value?: string;
  onChange?: (value: string) => void;
  /** @default "underline" */
  variant?: 'underline' | 'pill';
  className?: string;
}

/**
 * Horizontal tab switcher. `underline` for page sections, `pill` for
 * compact in-card segmented controls. Supports per-tab count badges.
 */
export function Tabs(props: TabsProps): JSX.Element;
