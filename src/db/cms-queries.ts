import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cmsPages, cmsSections } from "@/db/schema";
import type { CmsPageAdminDTO } from "@/lib/cms-domain";

function parseSections(rows: { key: string; content: string }[]) {
  const sections: Record<string, unknown> = {};
  for (const row of rows) {
    try {
      sections[row.key] = JSON.parse(row.content);
    } catch {
      // Skip a malformed row rather than fail the whole page — the caller
      // falls back to the schema default for this section key.
    }
  }
  return sections;
}

export async function getCmsPageForAdmin(slug: string): Promise<CmsPageAdminDTO | null> {
  const [page] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
  if (!page) return null;

  const rows = await db
    .select({ key: cmsSections.key, content: cmsSections.content })
    .from(cmsSections)
    .where(eq(cmsSections.pageId, page.id));

  return {
    slug: page.slug,
    title: page.title,
    status: page.status,
    updatedAt: page.updatedAt.toISOString(),
    sections: parseSections(rows),
  };
}

export async function listCmsPagesForAdmin(): Promise<
  Pick<CmsPageAdminDTO, "slug" | "status" | "updatedAt">[]
> {
  const rows = await db
    .select({ slug: cmsPages.slug, status: cmsPages.status, updatedAt: cmsPages.updatedAt })
    .from(cmsPages);
  return rows.map((row) => ({ ...row, updatedAt: row.updatedAt.toISOString() }));
}

/** Published section content only — used by the public marketing pages. */
export async function getPublishedCmsSections(slug: string): Promise<Record<string, unknown>> {
  const [page] = await db
    .select({ id: cmsPages.id })
    .from(cmsPages)
    .where(and(eq(cmsPages.slug, slug), eq(cmsPages.status, "published")))
    .limit(1);
  if (!page) return {};

  const rows = await db
    .select({ key: cmsSections.key, content: cmsSections.content })
    .from(cmsSections)
    .where(eq(cmsSections.pageId, page.id));

  return parseSections(rows);
}
