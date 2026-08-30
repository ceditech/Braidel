/**
 * Shared content shapes for static marketing pages.
 * Pages import a typed const from this directory today; a future CMS can
 * populate these same shapes from `cmsPages`/`cmsSections` without page changes.
 */

export interface HeroContent {
  eyebrow: string;
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StepContent {
  n: string;
  title: string;
  body: string;
  tone: "brand" | "gold" | "sage";
}
