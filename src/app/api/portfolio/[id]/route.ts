import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { braiders, portfolioMedia, users } from "@/db/schema";
import { deletePortfolioFile } from "@/lib/portfolio-storage";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [media] = await db
    .select({
      id: portfolioMedia.id,
      url: portfolioMedia.url,
      storageKey: portfolioMedia.storageKey,
      storageProvider: portfolioMedia.storageProvider,
      slug: braiders.slug,
    })
    .from(portfolioMedia)
    .innerJoin(braiders, eq(portfolioMedia.braiderId, braiders.id))
    .innerJoin(users, eq(braiders.userId, users.id))
    .where(and(eq(portfolioMedia.id, id), eq(users.clerkId, clerkUser.id)))
    .limit(1);

  if (!media) {
    return NextResponse.json({ error: "Portfolio image not found" }, { status: 404 });
  }

  await deletePortfolioFile(media);
  await db.delete(portfolioMedia).where(eq(portfolioMedia.id, media.id));

  revalidatePath("/dashboard/settings");
  revalidatePath(`/find-braiders/${media.slug}`);
  return NextResponse.json({ ok: true });
}
