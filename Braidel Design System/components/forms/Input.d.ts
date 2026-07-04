import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text shown below when there is no error. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and overrides hint. */
  error?: React.ReactNode;
  /** Show required asterisk. */
  required?: boolean;
  /** Control height. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Icon node inside the field, left side. */
  iconLeft?: React.ReactNode;
  /** Icon node inside the field, right side. */
  iconRight?: React.ReactNode;
  /** Render a multi-line textarea instead of an input. */
  textarea?: boolean;
}

/**
 * Labeled text field with hint, error and icon adornments.
 * Set `textarea` for multi-line. Meets 44px touch target at default size.
 * @startingPoint section="Forms" subtitle="Text fields with label, hint & error" viewport="700x300"
 */
export function Input(props: InputProps): JSX.Element;
