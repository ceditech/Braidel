import type { HeroContent } from "./types";

export const aboutContent: {
  hero: HeroContent;
  values: { title: string; body: string }[];
} = {
  hero: {
    eyebrow: "About braid.el",
    title: "Built for the braiding industry, by people who love it",
    body: "braid.el is a marketplace connecting salons, independent braiders, and clients — so great work gets discovered and booked without middlemen or guesswork.",
  },
  values: [
    {
      title: "The culture, first",
      body: "Braiding is a craft with deep roots. We built braid.el to celebrate the artistry and make it easier for skilled braiders and salons to be found and booked.",
    },
    {
      title: "Trust, built in",
      body: "Verified profiles, honest reviews, and direct messaging mean clients know who they're booking and braiders know who they're working with.",
    },
    {
      title: "Fair for everyone",
      body: "No hidden fees, no opaque algorithms deciding who gets seen. Salons, braiders, and clients connect directly on a level playing field.",
    },
  ],
};
