import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Control height. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Render as a different element, e.g. "a" for links. @default "button" */
  as?: 'button' | 'a';
  /** Stretch to fill container width. */
  block?: boolean;
  /** Fully rounded pill shape. */
  pill?: boolean;
  /** Square icon-only button (pass a single icon as children). */
  icon?: boolean;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  /** Leading icon node. */
  iconLeft?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
}

/**
 * Primary action control for Braidel. Terracotta-filled by default;
 * use `secondary` (gold) for high-emphasis alternates, `outline`/`ghost`
 * for lower emphasis, `danger` for destructive actions.
 * @startingPoint section="Forms" subtitle="Buttons in every variant, size & state" viewport="700x320"
 */
export function Button(props: ButtonProps): JSX.Element;
