import * as React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tone. @default "info" */
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'brand';
  /** Bold title line. */
  title?: React.ReactNode;
  /** Override the default leading icon. */
  icon?: React.ReactNode;
}

/**
 * Inline contextual message banner. Use `success` for confirmations,
 * `warning`/`danger` for issues, `brand` for onboarding nudges.
 */
export function Alert(props: AlertProps): JSX.Element;
