import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

export const MAX_PORTFOLIO_FILE_SIZE = 4 * 1024 * 1024;
export const MAX_PORTFOLIO_ITEMS = 8;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface StoredPortfolioFile {
  url: string;
  storageKey: string;
  storageProvider: "local" | "vercel_blob";
}

export async function validatePortfolioFile(file: File): Promise<string | null> {
  if (!EXTENSIONS[file.type]) return "Use a JPG, PNG, or WebP image.";
  if (file.size <= 0) return "The selected image is empty.";
  if (file.size > MAX_PORTFOLIO_FILE_SIZE) return "Images must be 4 MB or smaller.";

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    .every((value, index) => bytes[index] === value);
  const isWebp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  const contentMatches =
    (file.type === "image/jpeg" && isJpeg)
    || (file.type === "image/png" && isPng)
    || (file.type === "image/webp" && isWebp);
  if (!contentMatches) return "The file contents do not match the selected image type.";
  return null;
}

export async function storePortfolioFile(
  file: File,
  braiderId: string
): Promise<StoredPortfolioFile> {
  const extension = EXTENSIONS[file.type];
  const storageKey = `portfolio/${braiderId}/${randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(storageKey, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return {
      url: blob.url,
      storageKey: blob.pathname,
      storageProvider: "vercel_blob",
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Portfolio storage is not configured.");
  }

  const localKey = `uploads/${storageKey}`;
  const destination = path.join(process.cwd(), "public", ...localKey.split("/"));
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await file.arrayBuffer()));

  return {
    url: `/${localKey}`,
    storageKey: localKey,
    storageProvider: "local",
  };
}

export async function deletePortfolioFile(input: {
  url: string;
  storageKey: string;
  storageProvider: string;
}) {
  if (input.storageProvider === "vercel_blob") {
    await del(input.url);
    return;
  }

  if (input.storageProvider !== "local") return;
  if (!input.storageKey.startsWith("uploads/portfolio/")) {
    throw new Error("Invalid local portfolio path.");
  }

  const publicRoot = path.resolve(process.cwd(), "public");
  const destination = path.resolve(publicRoot, ...input.storageKey.split("/"));
  if (!destination.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error("Invalid local portfolio path.");
  }

  await unlink(destination).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") throw error;
  });
}
