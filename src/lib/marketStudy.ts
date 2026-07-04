/* ══════════════════════════════════════════════════════════════════
   Braidel — Market Study & Benchmark (shareholder / partner facing)

   Source of truth for the in-dashboard Market Study page. Figures are
   analyst estimates compiled for the Braidel business case; update here
   and the page reflects it. Ranges are intentional (est.).
   ══════════════════════════════════════════════════════════════════ */

export interface MarketStat {
  value: string;
  label: string;
  tone: "brand" | "gold" | "sage" | "teal";
}

export const MARKET_STATS: MarketStat[] = [
  { value: "$3.1B",   label: "US Black hair care market (2024)",         tone: "brand" },
  { value: "$15.5B",  label: "Global ethnic hair care market (2024)",    tone: "gold" },
  { value: "~5.5%",   label: "Ethnic hair care CAGR to 2030",            tone: "sage" },
  { value: "500k+",   label: "Braiders across the US",                   tone: "teal" },
  { value: "40–60k",  label: "US braiding salons / establishments",      tone: "brand" },
  { value: "$21B+",   label: "Global market projected by 2030",          tone: "gold" },
];

export interface Competitor {
  name: string;
  model: string;
  relevance: "Direct" | "Indirect" | "Very indirect";
  gap: string;
}

export const COMPETITORS: Competitor[] = [
  { name: "StyleSeat",        model: "General beauty booking marketplace",   relevance: "Indirect",      gap: "Not braiding-specific; no staffing/workforce layer" },
  { name: "Booksy",           model: "Appointment booking for pros",          relevance: "Indirect",      gap: "No staffing; no braiding focus; no ecosystem" },
  { name: "Vagaro",           model: "Salon management software",             relevance: "Indirect",      gap: "Software for existing businesses, not a marketplace" },
  { name: "Thumbtack",        model: "Gig service marketplace",               relevance: "Very indirect", gap: "Not beauty/braiding-specific; no community trust" },
  { name: "Indeed / ZipRec.", model: "General job boards",                    relevance: "Indirect",      gap: "Not industry-specific; no portfolio/verification" },
  { name: "Hush",             model: "Braider-focused booking (early)",       relevance: "Direct",        gap: "Less developed; no staffing side; limited vision" },
];

export interface Benchmark {
  platform: string;
  why: string;
  lesson: string;
  outcome: string;
}

export const BENCHMARKS: Benchmark[] = [
  { platform: "Toast",     why: "Restaurant OS — closest analog",        lesson: "Started with one painful daily problem, then layered financial services on top", outcome: "$14B+ valuation" },
  { platform: "Mindbody",  why: "Fitness / wellness business OS",         lesson: "Scheduling → full ecosystem (payments, marketing, hiring)",                       outcome: "$1.9B acquisition" },
  { platform: "StyleSeat", why: "Beauty services marketplace",            lesson: "Owned a niche before broadening; started supply-side (stylists)",                 outcome: "$700M+ valuation" },
  { platform: "Thumbtack", why: "Two-sided skilled-worker marketplace",   lesson: "Solved cold-start via supply-side seeding, city by city",                         outcome: "$3B+ valuation" },
  { platform: "Care.com",  why: "Vertical workforce marketplace",         lesson: "Built trust through verification; monetized both sides",                          outcome: "$500M acquisition" },
  { platform: "Jobber",    why: "Field-service management platform",      lesson: "Solved hardest operational pain (scheduling + payment) first",                    outcome: "$1B+ valuation" },
];

export interface MarketSegment {
  segment: string;
  tam: string;
  sam: string;
  som: string;
}

export const TAM_SAM_SOM: MarketSegment[] = [
  { segment: "Salon staffing fees",     tam: "$500M+",  sam: "$150M",  som: "$5–15M" },
  { segment: "Booking commissions",     tam: "$1.2B+",  sam: "$300M",  som: "$10–30M" },
  { segment: "Academy / certification", tam: "$200M",   sam: "$50M",   som: "$2–5M" },
  { segment: "Supply / wholesale",      tam: "$800M+",  sam: "$100M",  som: "$5–15M" },
];

export const TAM_SAM_SOM_TOTAL: MarketSegment = {
  segment: "Combined opportunity",
  tam: "$2.7B+",
  sam: "$600M+",
  som: "$22–65M",
};

export interface ViabilityFactor {
  factor: string;
  score: number; // out of 10
  note: string;
}

export const VIABILITY: ViabilityFactor[] = [
  { factor: "Market need (problem clarity)", score: 9, note: "Real, documented, underserved" },
  { factor: "Competitive moat potential",    score: 8, note: "Vertical specificity + ecosystem lock-in" },
  { factor: "Revenue model diversity",       score: 8, note: "7 revenue streams across phases" },
  { factor: "Community trust factor",        score: 8, note: "Tight-knit community, word spreads fast" },
  { factor: "Regulatory risk",               score: 6, note: "Licensing varies by state, improving" },
  { factor: "Cold-start risk",               score: 5, note: "Two-sided marketplace — needs seeding" },
];

export const VIABILITY_OVERALL = 7.3;

export interface Pillar {
  title: string;
  body: string;
}

export const SUSTAINABILITY: Pillar[] = [
  {
    title: "Vertical marketplace flywheel",
    body: "Each new salon attracts more braiders and vice versa — a network effect that becomes a defensible moat once both sides are onboarded.",
  },
  {
    title: "Revenue stacking",
    body: "Seven monetization layers compound on the same user base: subscriptions, booking fees, verification, courses, product margins, and franchise royalties.",
  },
  {
    title: "Natural recurring usage",
    body: "Clients rebook every 4–8 weeks, driving recurring platform activity without aggressive re-acquisition cost.",
  },
  {
    title: "Software-led, globally portable",
    body: "Near-zero marginal cost per user, and the model replicates across the US, UK, France, Canada, and West Africa.",
  },
];

export const KEY_RISKS: Pillar[] = [
  {
    title: "Cold-start problem",
    body: "Both sides must be seeded before the marketplace has value. A focused launch-city strategy is essential.",
  },
  {
    title: "Trust & vetting timing",
    body: "Verification is a later phase — a basic vetting layer should be accelerated to protect early reputation.",
  },
  {
    title: "Disintermediation",
    body: "Salons and braiders may transact off-platform. Payments (Phase 3) must be convenient enough to retain the transaction.",
  },
];
