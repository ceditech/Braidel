import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function AccountSuspendedPage() {
  return (
    <main className="min-h-screen bg-[#0b0c0d] px-6 py-16 text-white">
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#d66a77]">
          Account review
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          This account is temporarily suspended.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
          Access to Braidel dashboard features is paused while the marketplace
          team reviews this account. Public profile visibility, booking, posting,
          messaging, and protected actions remain unavailable until access is
          restored.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-[#c85d6a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b64f5c]"
          >
            Contact support
          </Link>
          <SignOutButton>
            <button
              type="button"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </section>
    </main>
  );
}
