import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Badge } from "@/components/ui/Badge";
import { listCmsPagesForAdmin } from "@/db/cms-queries";
import { requireMarketplaceAdmin } from "@/lib/admin-auth";
import { MARKETING_PAGES } from "@/content/marketing/registry";
import styles from "./ContentAdmin.module.css";

export const dynamic = "force-dynamic";

export default async function CmsContentListPage() {
  await requireMarketplaceAdmin();
  const rows = await listCmsPagesForAdmin();
  const bySlug = new Map(rows.map((row) => [row.slug, row]));

  return (
    <>
      <Topbar
        title="Public Facing Content"
        subtitle="Edit copy for the public marketing pages. Changes stay in draft until you publish."
      />
      <div className={styles.page}>
        <div className={styles.grid}>
          {MARKETING_PAGES.map((page) => {
            const status = bySlug.get(page.slug)?.status ?? "not_customized";
            return (
              <Link key={page.slug} href={`/dashboard/admin/content/${page.slug}`} className={styles.listCard}>
                <div className={styles.listCardRow}>
                  <div>
                    <div className={styles.listCardTitle}>{page.title}</div>
                    <div className={styles.listCardSlug}>/{page.slug}</div>
                  </div>
                  {status === "published" && <Badge variant="success">Published</Badge>}
                  {status === "draft" && <Badge variant="warning">Draft</Badge>}
                  {status === "not_customized" && <Badge variant="neutral">Not customized</Badge>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
