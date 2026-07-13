import * as React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label rendered above the control. */
  label?: React.ReactNode;
  /** Control height. @default "md" */
  size?: 'sm' | 'md';
  /** Convenience options array (string or {value,label}); or pass <option> children. */
  options?: Array<string | SelectOption>;
}

/**
 * Styled native select with custom chevron. Pass `options` or <option> children.
 */
export function Select(props: SelectProps): JSX.Element;
