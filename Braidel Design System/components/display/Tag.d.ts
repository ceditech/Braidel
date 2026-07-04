import * as React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  /** Selected (filter active) state. */
  selected?: boolean;
  /** @default "default" */
  variant?: 'default' | 'solid';
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Show a remove "×"; receives the click event. Makes the tag dismissible. */
  onRemove?: (e: React.MouseEvent) => void;
}

/**
 * Chip for specialties, filters and tokens. Renders as a <button> when
 * `onClick` is set (filter toggle) — pair with `selected`. Add `onRemove`
 * for a dismissible input token.
 */
export function Tag(props: TagProps): JSX.Element;
