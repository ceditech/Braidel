import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to colored initials when absent. */
  src?: string;
  /** Full name — used for initials and the deterministic fallback color. */
  name?: string;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Terracotta ring (e.g. featured braider). */
  ring?: boolean;
  /** Presence dot. */
  status?: 'online' | 'offline';
}

/**
 * User image with automatic initials + color fallback.
 * Wrap several in AvatarGroup for an overlapping stack.
 */
export function Avatar(props: AvatarProps): JSX.Element;
export function AvatarGroup(props: { children?: React.ReactNode; className?: string }): JSX.Element;
