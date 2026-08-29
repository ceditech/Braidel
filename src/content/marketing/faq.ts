import type { FaqItem, HeroContent } from "./types";

export const faqContent: {
  hero: HeroContent;
  items: FaqItem[];
} = {
  hero: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    body: "Can't find what you're looking for? Reach out on the Contact page and we'll help directly.",
  },
  items: [
    {
      question: "Is braid.el free to use?",
      answer: "Yes. During this phase, braid.el is free for salons, braiders, and clients — no listing fees or booking fees. See the Pricing page for more.",
    },
    {
      question: "Who can join braid.el?",
      answer: "Salon owners looking to post opportunities or find braiders, independent braiders building a portfolio and finding work, and clients looking to discover and book braiders or salons.",
    },
    {
      question: "How do I create a profile?",
      answer: "Click \"Get started\" to sign up, choose whether you're a salon, braider, or client, and follow the onboarding steps to set up your profile.",
    },
    {
      question: "How does booking work?",
      answer: "Search for a braider or salon, review their profile and availability, and book directly in-platform. You can message the provider before confirming.",
    },
    {
      question: "How do I apply for opportunities?",
      answer: "Browse open opportunities on the Opportunities page, filter by specialty or location, and apply directly from a listing.",
    },
    {
      question: "Is my information safe?",
      answer: "We only use your information to run the marketplace — matching you with the right salons, braiders, or clients. See our Privacy Policy for details.",
    },
  ],
};
