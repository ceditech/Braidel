/**
 * Rules for attaching a Clerk identity to an existing Neon user row by email.
 *
 * When the app moves to a new Clerk instance (for example development ->
 * production) every person receives a new Clerk user ID, while Neon keeps the
 * row (role, onboarding, history) keyed by the old ID. `users.email` is unique,
 * so a plain insert for the same person would fail. Linking by email keeps the
 * account, but only when Clerk has verified the email: linking on an
 * unverified address would let anyone claim another person's account.
 *
 * Pure and dependency-free so it is unit-checkable without a database.
 */

export type ClerkLinkInput = {
  /** Clerk user ID of the person signing in / being synced. */
  incomingClerkId: string;
  /** True only when Clerk reports the primary email as verified. */
  emailVerified: boolean;
  /** The Neon row that already uses this email, if any. */
  existingByEmail: { clerkId: string; deletedAt: Date | null } | null;
};

export type ClerkLinkDecision =
  /** No row uses this email: create a new user as usual. */
  | "insert"
  /** The email already belongs to this Clerk ID: normal update path. */
  | "same_identity"
  /** Verified email matches a live row with a different Clerk ID: re-link it. */
  | "link"
  /** Email is taken but we must not link (unverified or tombstoned row). */
  | "conflict";

export function decideClerkLink(input: ClerkLinkInput): ClerkLinkDecision {
  const { existingByEmail } = input;
  if (!existingByEmail) return "insert";
  if (existingByEmail.clerkId === input.incomingClerkId) return "same_identity";
  if (existingByEmail.deletedAt) return "conflict";
  return input.emailVerified ? "link" : "conflict";
}
