import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color/role. @default "neutral" */
  variant?: 'neutral' | 'brand' | 'gold' | 'success' | 'warning' | 'danger' | 'info' | 'solid' | 'outline';
  /** Show a leading status dot. */
  dot?: boolean;
}

/**
 * Small status / metadata pill. Use status colors for application state
 * (success = matched, warning = pending, danger = closed) and `brand`/`gold`
 * for emphasis labels like "Verified" or "Top rated".
 */
export function Badge(props: BadgeProps): JSX.Element;
