import type { HeroContent } from "./types";

export const contactContent: {
  hero: HeroContent;
  email: string;
  channels: { label: string; value: string; href: string }[];
} = {
  hero: {
    eyebrow: "Contact",
    title: "We'd love to hear from you",
    body: "Questions, feedback, or a partnership idea — reach out and a real person on the braid.el team will get back to you.",
  },
  email: "hello@braid.el",
  channels: [
    { label: "Email", value: "hello@braid.el", href: "mailto:hello@braid.el" },
    { label: "Instagram", value: "@braid.el", href: "https://instagram.com/braid.el" },
  ],
};
