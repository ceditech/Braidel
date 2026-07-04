import * as React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label to the right of the switch. */
  label?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/**
 * On/off toggle for instant-apply settings (e.g. availability).
 * Use a Checkbox for form selections that submit later.
 */
export function Switch(props: SwitchProps): JSX.Element;
