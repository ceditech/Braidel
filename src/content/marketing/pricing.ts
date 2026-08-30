import type { HeroContent } from "./types";

export const pricingContent: {
  hero: HeroContent;
  points: { title: string; body: string }[];
} = {
  hero: {
    eyebrow: "Pricing",
    title: "Free while we build the marketplace with you",
    body: "braid.el is free for salons, braiders, and clients during this phase — no listing fees, no booking fees, no subscription. We're focused on getting the marketplace right before we introduce paid plans.",
  },
  points: [
    {
      title: "No fees, right now",
      body: "Create a profile, post opportunities, book services, and message other users at no cost while we're in this phase of the platform.",
    },
    {
      title: "Pricing is coming",
      body: "As we add premium tools for salons and braiders, we'll introduce paid plans. Anyone using braid.el today will hear about it first, with plenty of notice before anything changes.",
    },
    {
      title: "Built with your feedback",
      body: "What you need from a paid plan is still open. If you have thoughts on what's worth paying for, reach out — it'll shape what we build.",
    },
  ],
};
