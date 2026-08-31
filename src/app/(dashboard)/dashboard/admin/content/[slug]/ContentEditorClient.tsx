"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import type { CmsFieldSpec, CmsPageSchema, CmsPageStatus } from "@/lib/cms-domain";
import styles from "../ContentAdmin.module.css";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CmsFieldSpec;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.kind === "text") {
    return (
      <Input
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.kind === "textarea") {
    return (
      <Textarea
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.kind === "select") {
    return (
      <Select
        label={field.label}
        options={field.options}
        value={typeof value === "string" ? value : field.options[0]}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  // object
  const objectValue = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.fieldGroupLabel}>{field.label}</div>
      {field.fields.map((sub) => (
        <FieldInput
          key={sub.key}
          field={sub}
          value={objectValue[sub.key]}
          onChange={(next) => onChange({ ...objectValue, [sub.key]: next })}
        />
      ))}
    </div>
  );
}

function ObjectFieldGroup({
  fields,
  value,
  onChange,
}: {
  fields: CmsFieldSpec[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className={styles.fieldStack}>
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={value[field.key]}
          onChange={(next) => onChange({ ...value, [field.key]: next })}
        />
      ))}
    </div>
  );
}

function ListEditor({
  itemLabel,
  itemFields,
  value,
  onChange,
}: {
  itemLabel: string;
  itemFields: CmsFieldSpec[];
  value: Record<string, unknown>[];
  onChange: (next: Record<string, unknown>[]) => void;
}) {
  return (
    <div className={styles.listItems}>
      {value.map((item, i) => (
        <div key={i} className={styles.listItem}>
          <div className={styles.listItemHead}>
            <span className={styles.listItemLabel}>{itemLabel} {i + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              Remove
            </Button>
          </div>
          <ObjectFieldGroup
            fields={itemFields}
            value={item}
            onChange={(next) => onChange(value.map((v, idx) => (idx === i ? next : v)))}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.addRow}
        onClick={() => onChange([...value, {}])}
      >
        Add {itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}

function StringListEditor({
  itemLabel,
  value,
  onChange,
}: {
  itemLabel: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className={styles.listItems}>
      {value.map((item, i) => (
        <div key={i} className={styles.stringRow}>
          <Input
            value={item}
            onChange={(e) => onChange(value.map((v, idx) => (idx === i ? e.target.value : v)))}
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className={styles.addRow} onClick={() => onChange([...value, ""])}>
        Add {itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}

export function ContentEditorClient({
  schema,
  initialStatus,
  initialSections,
}: {
  schema: CmsPageSchema;
  initialStatus: CmsPageStatus;
  initialSections: Record<string, unknown>;
}) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function save(nextStatus: "draft" | "published") {
    setSaving(nextStatus);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${schema.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, sections }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(body.error ?? "Failed to save");
        return;
      }
      setStatus(nextStatus);
      setMessage(nextStatus === "published" ? "Published." : "Draft saved.");
      router.refresh();
    } catch {
      setMessage("Failed to save — check your connection and try again.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.editorHeader}>
        {status === "published" ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}
        {message && <span className={styles.message}>{message}</span>}
      </div>

      <div className={styles.sectionStack}>
        {schema.sections.map((section) => (
          <div key={section.key} className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>{section.label}</h3>

            {section.rootKind === "text" && (
              <Textarea
                value={typeof sections[section.key] === "string" ? (sections[section.key] as string) : ""}
                onChange={(e) => setSections({ ...sections, [section.key]: e.target.value })}
              />
            )}

            {section.rootKind === "object" && (
              <ObjectFieldGroup
                fields={section.fields}
                value={(sections[section.key] as Record<string, unknown>) ?? {}}
                onChange={(next) => setSections({ ...sections, [section.key]: next })}
              />
            )}

            {section.rootKind === "list" && (
              <ListEditor
                itemLabel={section.itemLabel}
                itemFields={section.itemFields}
                value={(sections[section.key] as Record<string, unknown>[]) ?? []}
                onChange={(next) => setSections({ ...sections, [section.key]: next })}
              />
            )}

            {section.rootKind === "stringList" && (
              <StringListEditor
                itemLabel={section.itemLabel}
                value={(sections[section.key] as string[]) ?? []}
                onChange={(next) => setSections({ ...sections, [section.key]: next })}
              />
            )}
          </div>
        ))}
      </div>

      <div className={styles.actionBar}>
        <div className={styles.actionBarInner}>
          <Button variant="outline" onClick={() => save("draft")} disabled={saving !== null}>
            {saving === "draft" ? "Saving…" : "Save draft"}
          </Button>
          <Button onClick={() => save("published")} disabled={saving !== null}>
            {saving === "published" ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
