"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSetupClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activateAdmin() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/onboarding", {
        method: "POST",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not activate this admin account.");
        return;
      }

      router.replace("/dashboard/admin");
      router.refresh();
    } catch {
      setError("Could not activate this admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] px-4 py-12 text-white">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-xl items-center">
        <section className="w-full rounded-2xl border border-white/10 bg-[#15171b] p-8 shadow-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d05d6a]">
            Internal access
          </p>
          <h1 className="text-3xl font-bold">Activate admin workspace</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            This path is reserved for allowlisted Braidel team members. It
            creates an internal admin identity without creating a Salon, Braider,
            or Client marketplace profile.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={activateAdmin}
            disabled={loading}
            className="mt-8 w-full rounded-full bg-[#d05d6a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bd4f5d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Activating..." : "Activate admin access"}
          </button>

          <p className="mt-5 text-xs leading-5 text-white/50">
            If this fails, confirm the signed-in email is listed in
            BRAIDEL_ADMIN_EMAILS and restart the dev server.
          </p>
        </section>
      </main>
    </div>
  );
}
