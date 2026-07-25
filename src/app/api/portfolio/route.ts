import { currentUser } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { braiders, portfolioMedia, users } from "@/db/schema";
import {
  deletePortfolioFile,
  MAX_PORTFOLIO_ITEMS,
  storePortfolioFile,
  validatePortfolioFile,
} from "@/lib/portfolio-storage";

export const runtime = "nodejs";

function stringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
  }

  const validationError = await validatePortfolioFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const [profile] = await db
    .select({
      braiderId: braiders.id,
      slug: braiders.slug,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(braiders)
    .innerJoin(users, eq(braiders.userId, users.id))
    .where(eq(users.clerkId, clerkUser.id))
    .limit(1);

  if (!profile) {
    return NextResponse.json({ error: "Braider profile not found" }, { status: 404 });
  }

  const existing = await db
    .select({ id: portfolioMedia.id, sortOrder: portfolioMedia.sortOrder })
    .from(portfolioMedia)
    .where(eq(portfolioMedia.braiderId, profile.braiderId))
    .orderBy(asc(portfolioMedia.sortOrder));

  if (existing.length >= MAX_PORTFOLIO_ITEMS) {
    return NextResponse.json(
      { error: `Portfolio limit reached (${MAX_PORTFOLIO_ITEMS} images)` },
      { status: 409 }
    );
  }

  const stored = await storePortfolioFile(file, profile.braiderId);
  const sortOrder = existing.length ? Math.max(...existing.map((item) => item.sortOrder)) + 1 : 0;
  const defaultName = `${profile.firstName} ${profile.lastName}`.replace(/\s+-$/, "").trim() || "Braidel braider";
  const altText = stringValue(formData?.get("altText") ?? null) || `Braiding work by ${defaultName}`;

  try {
    const [media] = await db
      .insert(portfolioMedia)
      .values({
        braiderId: profile.braiderId,
        url: stored.url,
        storageKey: stored.storageKey,
        storageProvider: stored.storageProvider,
        altText: altText.slice(0, 240),
        mimeType: file.type,
        sizeBytes: file.size,
        sortOrder,
      })
      .returning({
        id: portfolioMedia.id,
        url: portfolioMedia.url,
        altText: portfolioMedia.altText,
        mimeType: portfolioMedia.mimeType,
        sizeBytes: portfolioMedia.sizeBytes,
        sortOrder: portfolioMedia.sortOrder,
      });

    revalidatePath("/dashboard/settings");
    revalidatePath(`/find-braiders/${profile.slug}`);
    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    await deletePortfolioFile(stored).catch(() => undefined);
    throw error;
  }
}
