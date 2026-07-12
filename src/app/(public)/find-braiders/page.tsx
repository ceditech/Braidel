import { getBraiders } from "@/db/queries";
import { FindBraidersClient } from "./FindBraidersClient";

export const dynamic = "force-dynamic"; // always read fresh from the DB

export default async function FindBraidersPage() {
  const braiders = await getBraiders();
  return <FindBraidersClient braiders={braiders} />;
}
