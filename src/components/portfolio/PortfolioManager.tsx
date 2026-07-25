"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { PortfolioMediaDTO } from "@/db/queries";
import styles from "./PortfolioManager.module.css";

const MAX_ITEMS = 8;

interface PortfolioManagerProps {
  enabled: boolean;
  initialMedia: PortfolioMediaDTO[];
}

export function PortfolioManager({ enabled, initialMedia }: PortfolioManagerProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialMedia);
  const [pendingDelete, setPendingDelete] = useState<PortfolioMediaDTO | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || !enabled) return;
    const remaining = MAX_ITEMS - items.length;
    if (remaining <= 0) {
      setError(`Portfolio limit reached (${MAX_ITEMS} images).`);
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      setError(`Only ${remaining} more image${remaining === 1 ? "" : "s"} can be added.`);
    } else {
      setError(null);
    }

    setIsUploading(true);
    const uploaded: PortfolioMediaDTO[] = [];

    try {
      for (const file of selected) {
        const formData = new FormData();
        formData.set("file", file);
        const response = await fetch("/api/portfolio", { method: "POST", body: formData });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data.error ?? `Could not upload ${file.name}.`);
          break;
        }
        uploaded.push(data.media);
      }
    } catch {
      setError("The upload could not be completed. Check your connection and try again.");
    } finally {
      setItems((current) => [...current, ...uploaded]);
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
      if (uploaded.length) router.refresh();
    }
  }

  async function deleteImage() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/portfolio/${pendingDelete.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not remove the image.");
        return;
      }

      setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
      router.refresh();
    } catch {
      setError("The image could not be removed. Check your connection and try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {!enabled && (
        <Alert variant="warning" title="Braider profile required">
          Complete braider onboarding before adding portfolio images.
        </Alert>
      )}

      <div className={styles.toolbar}>
        <p className={styles.summary}>
          {items.length} of {MAX_ITEMS} images | JPG, PNG, or WebP | 4 MB maximum
        </p>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            disabled={!enabled || isUploading || items.length >= MAX_ITEMS}
            onChange={(event) => uploadFiles(event.target.files)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            iconLeft={<UploadIcon />}
            disabled={!enabled || isUploading || items.length >= MAX_ITEMS}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? "Uploading..." : "Add images"}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className={styles.grid} style={{ marginTop: error || !enabled ? 14 : 0 }}>
        {items.map((item) => (
          <div key={item.id} className={styles.tile}>
            <Image
              src={item.url}
              alt={item.altText}
              fill
              sizes="(max-width: 720px) 50vw, 180px"
              className={styles.image}
            />
            <button
              type="button"
              className={styles.deleteButton}
              aria-label={`Remove ${item.altText}`}
              title="Remove image"
              onClick={() => setPendingDelete(item)}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>

      {!items.length && enabled && (
        <div className={styles.empty}>Add your first portfolio image to showcase your work.</div>
      )}

      <Modal
        open={pendingDelete !== null}
        title="Remove portfolio image?"
        description="This removes the image from your public braider profile."
        closeDisabled={isDeleting}
        onClose={() => setPendingDelete(null)}
        footer={
          <>
            <Button type="button" variant="ghost" disabled={isDeleting} onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={isDeleting} onClick={deleteImage}>
              {isDeleting ? "Removing..." : "Remove image"}
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, color: "var(--text-body)", lineHeight: 1.6 }}>
          Uploaded files cannot be restored after removal.
        </p>
      </Modal>
    </>
  );
}

function UploadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 21h14a2 2 0 0 0 2-2v-4M3 15v4a2 2 0 0 0 2 2"/></svg>;
}

function TrashIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>;
}
