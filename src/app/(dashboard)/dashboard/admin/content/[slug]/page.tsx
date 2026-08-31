import { notFound } from "next/navigation";
import { Topbar } from "@/components/dashboard/Topbar";
import { getCmsPageForAdmin } from "@/db/cms-queries";
import { requireMarketplaceAdmin } from "@/lib/admin-auth";
import { getMarketingPageSchema } from "@/content/marketing/registry";
import type { CmsPageStatus } from "@/lib/cms-domain";
import { ContentEditorClient } from "./ContentEditorClient";

export const dynamic = "force-dynamic";

export default async function CmsContentEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireMarketplaceAdmin();
  const { slug } = await params;
  const schema = getMarketingPageSchema(slug);
  if (!schema) notFound();

  const existing = await getCmsPageForAdmin(slug);
  const status: CmsPageStatus = existing?.status ?? "draft";
  const sections: Record<string, unknown> = {
    ...schema.defaults,
    ...(existing?.sections ?? {}),
  };

  return (
    <>
      <Topbar title={schema.title} subtitle={`/${schema.slug}`} />
      <ContentEditorClient schema={schema} initialStatus={status} initialSections={sections} />
    </>
  );
}
