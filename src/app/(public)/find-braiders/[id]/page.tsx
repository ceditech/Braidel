import { getBraiderBySlug } from "@/db/queries";
import { BraiderProfileClient } from "./BraiderProfileClient";

export const dynamic = "force-dynamic";

export default async function BraiderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const braider = await getBraiderBySlug(id);
  return <BraiderProfileClient braider={braider} />;
}
