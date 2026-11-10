/* Checks the rules for re-linking a Clerk identity to an existing user by
   email (src/lib/clerk-link-domain.ts). Pure logic, no database or network.
   Run with: npm run verify:clerk-link */
import assert from "node:assert/strict";
import { decideClerkLink } from "../src/lib/clerk-link-domain";

const live = { clerkId: "user_old", deletedAt: null };
const tombstoned = { clerkId: "user_old", deletedAt: new Date("2026-01-01") };

const cases: Array<[string, ReturnType<typeof decideClerkLink>, string]> = [
  [
    "no row uses the email -> insert",
    decideClerkLink({ incomingClerkId: "user_new", emailVerified: true, existingByEmail: null }),
    "insert",
  ],
  [
    "same Clerk ID already owns the email -> normal path",
    decideClerkLink({
      incomingClerkId: "user_old",
      emailVerified: true,
      existingByEmail: live,
    }),
    "same_identity",
  ],
  [
    "verified email, live row, different Clerk ID -> link",
    decideClerkLink({
      incomingClerkId: "user_new",
      emailVerified: true,
      existingByEmail: live,
    }),
    "link",
  ],
  [
    "UNVERIFIED email never links (account-takeover guard)",
    decideClerkLink({
      incomingClerkId: "user_new",
      emailVerified: false,
      existingByEmail: live,
    }),
    "conflict",
  ],
  [
    "tombstoned row is never re-linked, even when verified",
    decideClerkLink({
      incomingClerkId: "user_new",
      emailVerified: true,
      existingByEmail: tombstoned,
    }),
    "conflict",
  ],
  [
    "unverified + same Clerk ID is still the normal path",
    decideClerkLink({
      incomingClerkId: "user_old",
      emailVerified: false,
      existingByEmail: live,
    }),
    "same_identity",
  ],
];

let failed = 0;
for (const [name, actual, expected] of cases) {
  try {
    assert.equal(actual, expected);
    console.log(`PASS  ${name}`);
  } catch {
    failed += 1;
    console.error(`FAIL  ${name} (expected ${expected}, got ${actual})`);
  }
}

if (failed > 0) {
  console.error(`${failed} of ${cases.length} checks failed`);
  process.exit(1);
}
console.log(`All ${cases.length} checks passed`);
