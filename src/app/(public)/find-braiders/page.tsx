import { getBraiders, getBraidStyles } from "@/db/queries";
import { FindBraidersClient } from "./FindBraidersClient";

export const dynamic = "force-dynamic"; // always read fresh from the DB

export default async function FindBraidersPage() {
  const [braiders, styles] = await Promise.all([getBraiders(), getBraidStyles()]);
  return <FindBraidersClient braiders={braiders} specialtyOptions={styles.map((style) => style.name)} />;
}
