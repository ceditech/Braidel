import type { HeroContent, StepContent } from "./types";

export const howItWorksContent: {
  hero: HeroContent;
  steps: StepContent[];
  audiences: { title: string; body: string; cta: { label: string; href: string } }[];
} = {
  hero: {
    eyebrow: "How it works",
    title: "One marketplace, three ways to use it",
    body: "Whether you run a salon, braid for a living, or are booking your next style, braid.el connects you directly — no middlemen, no runaround.",
  },
  steps: [
    {
      n: "01",
      title: "Create your profile",
      body: "Set up your salon or braider profile in minutes — showcase your work and tell the community who you are.",
      tone: "brand",
    },
    {
      n: "02",
      title: "Post or apply",
      body: "Salon owners post staffing opportunities. Braiders browse, filter by specialty and location, and apply with one tap.",
      tone: "gold",
    },
    {
      n: "03",
      title: "Match & connect",
      body: "Message directly in-platform, review portfolios, and confirm arrangements — no middlemen, no fees on Phase 1.",
      tone: "sage",
    },
  ],
  audiences: [
    {
      title: "For salons",
      body: "Post open chairs or staffing opportunities, browse verified braiders by specialty and location, and message candidates directly to arrange interviews or trials.",
      cta: { label: "Find braiders", href: "/find-braiders" },
    },
    {
      title: "For braiders",
      body: "Build a portfolio, get discovered by salons and clients searching by style, and apply to opportunities that fit your schedule and specialty.",
      cta: { label: "Browse opportunities", href: "/opportunities" },
    },
    {
      title: "For clients",
      body: "Search braiders and salons by style, read verified reviews, and book directly with the person doing your hair — no back-and-forth.",
      cta: { label: "Find braiders", href: "/find-braiders" },
    },
  ],
};
