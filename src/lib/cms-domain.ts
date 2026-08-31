/** Field kinds usable inside an object (a section's own fields, or an item's fields within a list). */
export type CmsFieldSpec =
  | { kind: "text"; key: string; label: string }
  | { kind: "textarea"; key: string; label: string }
  | { kind: "select"; key: string; label: string; options: string[] }
  | { kind: "object"; key: string; label: string; fields: CmsFieldSpec[] };

/** A section's root shape: plain text, a single object, a list of objects, or a list of plain strings. */
export type CmsSectionSchema =
  | { key: string; label: string; rootKind: "text" }
  | { key: string; label: string; rootKind: "object"; fields: CmsFieldSpec[] }
  | { key: string; label: string; rootKind: "list"; itemLabel: string; itemFields: CmsFieldSpec[] }
  | { key: string; label: string; rootKind: "stringList"; itemLabel: string };

export interface CmsPageSchema {
  slug: string;
  title: string;
  sections: CmsSectionSchema[];
  /** Default values, keyed by section key — the Phase 1 static content. */
  defaults: Record<string, unknown>;
}

export type CmsPageStatus = "draft" | "published";

export interface CmsPageAdminDTO {
  slug: string;
  title: string;
  status: CmsPageStatus;
  updatedAt: string | null;
  /** Section values currently stored in the DB, keyed by section key. Missing keys fall back to schema defaults. */
  sections: Record<string, unknown>;
}
