"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  {
    value: "salon_owner",
    label: "Salon Owner",
    description: "I run a salon and need to hire skilled braiders.",
  },
  {
    value: "braider",
    label: "Professional Braider",
    description: "I'm a braider looking for work opportunities.",
  },
  {
    value: "client",
    label: "Client",
    description: "I'm looking to book braiding services.",
  },
] as const;

type Role = (typeof roles)[number]["value"];

export default function OnboardingForm() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not finish setting up your account.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Could not finish setting up your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => setSelected(role.value)}
          className={`text-left p-4 rounded-xl border-2 transition ${
            selected === role.value
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <div className="font-semibold">{role.label}</div>
          <div className="text-sm text-gray-500 mt-0.5">{role.description}</div>
        </button>
      ))}
      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <button
        disabled={!selected || loading}
        onClick={handleSubmit}
        className="mt-2 w-full py-3 bg-black text-white rounded-xl font-medium disabled:opacity-40 hover:bg-gray-800 transition"
      >
        {loading ? "Setting up your account…" : "Continue"}
      </button>
    </div>
  );
}
