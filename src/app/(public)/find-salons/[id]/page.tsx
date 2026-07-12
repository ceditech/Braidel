import { getSalonBySlug } from "@/db/queries";
import { SalonDetailClient } from "./SalonDetailClient";

export const dynamic = "force-dynamic";

export default async function SalonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const salon = await getSalonBySlug(id);
  return <SalonDetailClient salon={salon} />;
}
