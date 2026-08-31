import type { CmsPageSchema } from "@/lib/cms-domain";
import { pricingContent } from "./pricing";
import { howItWorksContent } from "./howItWorks";
import { aboutContent } from "./about";
import { contactContent } from "./contact";
import { blogContent } from "./blog";
import { faqContent } from "./faq";
import { termsContent } from "./terms";
import { privacyContent } from "./privacy";

const heroFields = [
  { kind: "text" as const, key: "eyebrow", label: "Eyebrow" },
  { kind: "text" as const, key: "title", label: "Title" },
  { kind: "textarea" as const, key: "body", label: "Body" },
];

const titleBodyFields = [
  { kind: "text" as const, key: "title", label: "Title" },
  { kind: "textarea" as const, key: "body", label: "Body" },
];

const headingBodyFields = [
  { kind: "text" as const, key: "heading", label: "Heading" },
  { kind: "textarea" as const, key: "body", label: "Body" },
];

export const MARKETING_PAGES: CmsPageSchema[] = [
  {
    slug: "pricing",
    title: "Pricing",
    sections: [
      { key: "hero", label: "Hero", rootKind: "object", fields: heroFields },
      { key: "points", label: "Points", rootKind: "list", itemLabel: "Point", itemFields: titleBodyFields },
    ],
    defaults: pricingContent,
  },
  {
    slug: "how-it-works",
    title: "How It Works",
    sections: [
      { key: "hero", label: "Hero", rootKind: "object", fields: heroFields },
      {
        key: "steps",
        label: "Steps",
        rootKind: "list",
        itemLabel: "Step",
        itemFields: [
          { kind: "text", key: "n", label: "Number (e.g. 01)" },
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "body", label: "Body" },
          { kind: "select", key: "tone", label: "Tone", options: ["brand", "gold", "sage"] },
        ],
      },
      {
        key: "audiences",
        label: "Audiences",
        rootKind: "list",
        itemLabel: "Audience",
        itemFields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "textarea", key: "body", label: "Body" },
          {
            kind: "object",
            key: "cta",
            label: "Call to action",
            fields: [
              { kind: "text", key: "label", label: "Label" },
              { kind: "text", key: "href", label: "Link" },
            ],
          },
        ],
      },
    ],
    defaults: howItWorksContent,
  },
  {
    slug: "about",
    title: "About",
    sections: [
      { key: "hero", label: "Hero", rootKind: "object", fields: heroFields },
      { key: "values", label: "Values", rootKind: "list", itemLabel: "Value", itemFields: titleBodyFields },
    ],
    defaults: aboutContent,
  },
  {
    slug: "contact",
    title: "Contact",
    sections: [
      { key: "hero", label: "Hero", rootKind: "object", fields: heroFields },
      {
        key: "channels",
        label: "Contact channels",
        rootKind: "list",
        itemLabel: "Channel",
        itemFields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "value", label: "Displayed value" },
          { kind: "text", key: "href", label: "Link (mailto:/https://)" },
        ],
      },
    ],
    defaults: contactContent,
  },
  {
    slug: "blog",
    title: "Blog",
    sections: [
      { key: "hero", label: "Hero", rootKind: "object", fields: heroFields },
      { key: "topics", label: "Coming-soon topics", rootKind: "stringList", itemLabel: "Topic" },
    ],
    defaults: blogContent,
  },
  {
    slug: "faq",
    title: "FAQ",
    sections: [
      { key: "hero", label: "Hero", rootKind: "object", fields: heroFields },
      {
        key: "items",
        label: "Questions",
        rootKind: "list",
        itemLabel: "Question",
        itemFields: [
          { kind: "text", key: "question", label: "Question" },
          { kind: "textarea", key: "answer", label: "Answer" },
        ],
      },
    ],
    defaults: faqContent,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    sections: [
      { key: "updated", label: "Draft notice", rootKind: "text" },
      { key: "sections", label: "Sections", rootKind: "list", itemLabel: "Section", itemFields: headingBodyFields },
    ],
    defaults: termsContent,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    sections: [
      { key: "updated", label: "Draft notice", rootKind: "text" },
      { key: "sections", label: "Sections", rootKind: "list", itemLabel: "Section", itemFields: headingBodyFields },
    ],
    defaults: privacyContent,
  },
];

export function getMarketingPageSchema(slug: string): CmsPageSchema | undefined {
  return MARKETING_PAGES.find((page) => page.slug === slug);
}
