import "server-only";

import { cache } from "react";
import { getPublishedCmsSections } from "@/db/cms-queries";

/**
 * Fetches published CMS section overrides for a slug, deduped per request
 * (both the page and its generateMetadata call this for the same slug).
 * Never throws — any DB error or malformed JSON resolves to `{}` so a CMS
 * issue can never break a public page.
 */
const getOverrides = cache(async (slug: string): Promise<Record<string, unknown>> => {
  try {
    return await getPublishedCmsSections(slug);
  } catch {
    return {};
  }
});

/** Merges published CMS section overrides over the static default content. */
export async function resolveMarketingContent<T extends Record<string, unknown>>(
  slug: string,
  defaultContent: T
): Promise<T> {
  const overrides = await getOverrides(slug);
  if (Object.keys(overrides).length === 0) return defaultContent;
  return { ...defaultContent, ...overrides };
}
