import type { HeroContent } from "./types";

export const blogContent: {
  hero: HeroContent;
  topics: string[];
} = {
  hero: {
    eyebrow: "Blog",
    title: "The braid.el blog is coming soon",
    body: "We're putting together stories, tips, and industry insight for salons, braiders, and clients. Check back soon — or follow us on Instagram for updates in the meantime.",
  },
  topics: [
    "Braider spotlights and portfolio features",
    "Running a braiding salon — staffing, scheduling, growth",
    "Style guides and trend roundups",
    "Product updates and what's next for braid.el",
  ],
};
