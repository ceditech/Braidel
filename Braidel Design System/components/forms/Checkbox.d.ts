import * as React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text label next to the control. */
  label?: React.ReactNode;
  /** Secondary description line under the label. */
  description?: React.ReactNode;
  /** Render as a radio (round) instead of a checkbox. */
  radio?: boolean;
}

/**
 * Checkbox or radio with optional label + description.
 * Set `radio` and share a `name` to build a radio group.
 */
export function Checkbox(props: CheckboxProps): JSX.Element;
