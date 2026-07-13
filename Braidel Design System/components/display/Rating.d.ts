import * as React from 'react';

export interface RatingProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Score 0–5 (supports fractional, e.g. 4.8). */
  value?: number;
  /** Optional review count shown in parentheses. */
  count?: number;
  /** Star size (any CSS length). @default "1.05rem" */
  size?: string;
  /** Show the numeric value beside the stars. @default true */
  showValue?: boolean;
}

/**
 * Read-only gold star rating with fractional fill, numeric value and
 * optional review count — used on braider & salon cards/profiles.
 */
export function Rating(props: RatingProps): JSX.Element;
