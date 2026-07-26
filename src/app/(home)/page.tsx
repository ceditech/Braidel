import type { Metadata } from "next";
import { HomeExperience } from "@/components/marketing/HomeExperience";

export const metadata: Metadata = {
  title: "braid.el | Connect. Book. Grow.",
  description:
    "Find professional braiders, discover braiding salons, and explore paid opportunities in one trusted marketplace.",
};

export default function HomePage() {
  return <HomeExperience />;
}
