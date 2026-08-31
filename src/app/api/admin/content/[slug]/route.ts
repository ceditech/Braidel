import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { withBookingTransaction } from "@/db/booking-db";
import { cmsPages, cmsSections, marketplaceAdminActions } from "@/db/schema";
import { getMarketplaceAdminForApi } from "@/lib/admin-auth";
import { getMarketingPageSchema } from "@/content/marketing/registry";
import type { CmsFieldSpec } from "@/lib/cms-domain";

const MAX_STRING_LENGTH = 4000;
const MAX_LIST_ITEMS = 40;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Validates a submitted section value against its schema, stripping anything unrecognized. Returns null if invalid. */
function sanitizeSectionValue(
  section: NonNullable<ReturnType<typeof getMarketingPageSchema>>["sections"][number],
  value: unknown
): unknown {
  if (section.rootKind === "text") {
    if (typeof value !== "string" || value.length > MAX_STRING_LENGTH) return null;
    return value;
  }

  if (section.rootKind === "object") {
    if (!isPlainObject(value)) return null;
    return sanitizeFields(section.fields, value);
  }

  if (section.rootKind === "stringList") {
    if (!Array.isArray(value) || value.length > MAX_LIST_ITEMS) return null;
    if (!value.every((item) => typeof item === "string" && item.length <= MAX_STRING_LENGTH)) return null;
    return value;
  }

  // rootKind === "list"
  if (!Array.isArray(value) || value.length > MAX_LIST_ITEMS) return null;
  const items: unknown[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) return null;
    items.push(sanitizeFields(section.itemFields, item));
  }
  return items;
}

function sanitizeFields(fields: CmsFieldSpec[], value: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = value[field.key];
    if (field.kind === "text" || field.kind === "textarea") {
      result[field.key] = typeof raw === "string" ? raw.slice(0, MAX_STRING_LENGTH) : "";
    } else if (field.kind === "select") {
      result[field.key] = typeof raw === "string" && field.options.includes(raw) ? raw : field.options[0];
    } else {
      result[field.key] = sanitizeFields(field.fields, isPlainObject(raw) ? raw : {});
    }
  }
  return result;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const schema = getMarketingPageSchema(slug);
  if (!schema) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const admin = await getMarketplaceAdminForApi();
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const payload = await req.json().catch(() => ({}));
  const status = payload.status === "published" ? "published" : "draft";
  const sectionsInput = isPlainObject(payload.sections) ? payload.sections : {};

  const sanitized: Record<string, unknown> = {};
  for (const section of schema.sections) {
    if (!(section.key in sectionsInput)) continue;
    const clean = sanitizeSectionValue(section, sectionsInput[section.key]);
    if (clean === null) {
      return NextResponse.json(
        { error: `Invalid content for section "${section.key}"` },
        { status: 400 }
      );
    }
    sanitized[section.key] = clean;
  }

  const now = new Date();

  await withBookingTransaction(async (tx) => {
    const [existingPage] = await tx
      .select({ id: cmsPages.id })
      .from(cmsPages)
      .where(eq(cmsPages.slug, slug))
      .limit(1);

    const pageId =
      existingPage?.id ??
      (
        await tx
          .insert(cmsPages)
          .values({ slug, title: schema.title, status, updatedByUserId: admin.id, updatedAt: now })
          .returning({ id: cmsPages.id })
      )[0].id;

    if (existingPage) {
      await tx
        .update(cmsPages)
        .set({ status, updatedByUserId: admin.id, updatedAt: now })
        .where(eq(cmsPages.id, pageId));
    }

    for (const [key, value] of Object.entries(sanitized)) {
      await tx
        .insert(cmsSections)
        .values({ pageId, key, content: JSON.stringify(value), updatedAt: now })
        .onConflictDoUpdate({
          target: [cmsSections.pageId, cmsSections.key],
          set: { content: JSON.stringify(value), updatedAt: now },
        });
    }

    await tx.insert(marketplaceAdminActions).values({
      actorUserId: admin.id,
      targetType: "cms_page",
      targetId: pageId,
      action: status === "published" ? "cms_page_publish" : "cms_page_save",
      newState: JSON.stringify({ slug, status, sections: Object.keys(sanitized) }),
    });
  });

  revalidatePath("/dashboard/admin/content");
  revalidatePath(`/${slug}`);

  return NextResponse.json({ ok: true, status });
}
