/**
 * ============================================================================
 * mhgpt-upload-client.ts — Client-side chunk upload (presigned PUT)
 * Version: v1.0 — 2026-02-09
 *
 * Phase 2.1:
 * - Chunk plan + manifest
 * - Presigned PUT per chunk (retry-safe, resumable)
 * - Works with encrypted chunks (ciphertext only)
 *
 * SECURITY / HEALTH-GRADE:
 * - No secrets here. Only presigned URLs.
 * - Deterministic chunk addressing via (fileId, chunkIndex) + sha256(ciphertext)
 * - Upload is idempotent: re-uploading same chunk is safe.
 * ============================================================================
 */

import { encryptFileToChunksWebCrypto } from "../crypto/mhgpt-file-crypto";

export type MhgptAlgo = "AES-256-GCM";

export type MhgptChunk = {
  chunkIndex: number;
  byteStart: number;
  byteEndExclusive: number;
};

export type MhgptChunkUploadResult = {
  chunkIndex: number;
  etag?: string;
  sha256Hex: string;
  sizeBytes: number;
};

export type MhgptUploadManifest = {
  version: 1;
  fileId: string;
  createdAtIso: string;
  algo: MhgptAlgo;

  original: {
    name: string;
    sizeBytes: number;
    mimeType: string;
    lastModifiedMs: number;
  };

  chunking: {
    chunkSizeBytes: number;
    chunkCount: number;
  };

  // ciphertext-only integrity / addressing
  chunks: Array<{
    chunkIndex: number;
    byteStart: number;
    byteEndExclusive: number;
    sha256Hex: string;
    sizeBytes: number;
    etag?: string;
  }>;
};

export type PresignChunkRequest = {
  fileId: string;
  chunkIndex: number;
  sha256Hex: string;
  sizeBytes: number;
  contentType: "application/octet-stream";
};

export type PresignChunkResponse = {
  method: "PUT";
  url: string;
  headers?: Record<string, string>;
};

export type PresignManifestRequest = {
  fileId: string;
  contentType: "application/json";
};

export type PresignManifestResponse = {
  method: "PUT";
  url: string;
  headers?: Record<string, string>;
};

export type MhgptPresignApi = {
  presignChunk(req: PresignChunkRequest): Promise<PresignChunkResponse>;
  presignManifest(req: PresignManifestRequest): Promise<PresignManifestResponse>;
};

export type MhgptUploadOptions = {
  chunkSizeBytes: number;         // e.g. 8 * 1024 * 1024
  maxConcurrency: number;         // e.g. 4
  maxRetries: number;             // e.g. 5
  baseRetryDelayMs: number;       // e.g. 300
  onProgress?: (p: {
    fileId: string;
    uploadedBytes: number;
    totalBytes: number;
    uploadedChunks: number;
    totalChunks: number;
  }) => void;
};

export type MhgptUploadResult = {
  fileId: string;
  manifest: MhgptUploadManifest;
};

function cryptoRandomUuid(): string {
  // browser-native UUID if available; otherwise fallback
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  const hex = [...buf].map(b => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function planChunks(fileSizeBytes: number, chunkSizeBytes: number): MhgptChunk[] {
  if (!Number.isFinite(fileSizeBytes) || fileSizeBytes < 0) throw new Error("Invalid file size");
  if (!Number.isFinite(chunkSizeBytes) || chunkSizeBytes <= 0) throw new Error("Invalid chunk size");

  const chunks: MhgptChunk[] = [];
  let idx = 0;
  for (let start = 0; start < fileSizeBytes; start += chunkSizeBytes) {
    const end = Math.min(start + chunkSizeBytes, fileSizeBytes);
    chunks.push({ chunkIndex: idx++, byteStart: start, byteEndExclusive: end });
  }
  return chunks;
}

async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return [...bytes].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function putWithRetry(args: {
  url: string;
  body: ArrayBuffer;
  headers?: Record<string, string>;
  maxRetries: number;
  baseDelayMs: number;
}): Promise<{ etag?: string }> {
  const { url, body, headers, maxRetries, baseDelayMs } = args;

  let attempt = 0;
  for (;;) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "content-type": "application/octet-stream",
          ...(headers ?? {}),
        },
        body: body as any,
      });

      if (!res.ok) {
        // retry on transient errors
        if (res.status >= 500 || res.status === 429) throw new Error(`PUT failed: ${res.status}`);
        // 4xx: treat as terminal
        const t = await safeText(res);
        throw new Error(`PUT failed: ${res.status} ${t}`);
      }

      const etag = res.headers.get("etag") ?? undefined;
      return { etag };
    } catch (e) {
      attempt += 1;
      if (attempt > maxRetries) throw e;

      const jitter = Math.floor(Math.random() * 120);
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + jitter;
      await sleep(delay);
    }
  }
}

async function putJsonWithRetry(args: {
  url: string;
  json: unknown;
  headers?: Record<string, string>;
  maxRetries: number;
  baseDelayMs: number;
}): Promise<void> {
  const { url, json, headers, maxRetries, baseDelayMs } = args;

  let attempt = 0;
  for (;;) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          ...(headers ?? {}),
        },
        body: JSON.stringify(json),
      });

      if (!res.ok) {
        if (res.status >= 500 || res.status === 429) throw new Error(`PUT manifest failed: ${res.status}`);
        const t = await safeText(res);
        throw new Error(`PUT manifest failed: ${res.status} ${t}`);
      }
      return;
    } catch (e) {
      attempt += 1;
      if (attempt > maxRetries) throw e;

      const jitter = Math.floor(Math.random() * 120);
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + jitter;
      await sleep(delay);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return "";
  }
}

async function runPool<T>(args: {
  items: T[];
  concurrency: number;
  worker: (item: T) => Promise<void>;
}): Promise<void> {
  const { items, concurrency, worker } = args;

  let i = 0;
  const runners = new Array(Math.max(1, concurrency)).fill(0).map(async () => {
    for (;;) {
      const idx = i++;
      if (idx >= items.length) return;
      await worker(items[idx]);
    }
  });

  await Promise.all(runners);
}

/**
 * Upload encrypted chunks + manifest.
 *
 * Requirement:
 * - encryptFileToChunksWebCrypto(...) must produce per-chunk ciphertext ArrayBuffer
 *   and use AAD binding (fileId, chunkIndex, algo, etc.).
 */
export async function uploadEncryptedFilePresigned(args: {
  file: File;
  algo: MhgptAlgo;
  presign: MhgptPresignApi;
  options: MhgptUploadOptions;
}): Promise<MhgptUploadResult> {
  const { file, algo, presign, options } = args;

  const fileId = cryptoRandomUuid();
  const chunksPlan = planChunks(file.size, options.chunkSizeBytes);

  let uploadedBytes = 0;
  let uploadedChunks = 0;

  const uploaded: MhgptChunkUploadResult[] = [];

  // 1) Encrypt file → yields ciphertext chunks in same plan order
  // NOTE: encryptFileToChunksWebCrypto must be implemented in lib/crypto/mhgpt-file-crypto.ts
  // and MUST bind AAD to (fileId, chunkIndex, algo, etc.).
  const ciphertextChunks = await encryptFileToChunksWebCrypto({
    file,
    fileId,
    algo,
    chunkSizeBytes: options.chunkSizeBytes,
  });

  if (ciphertextChunks.length !== chunksPlan.length) {
    throw new Error(`Chunk count mismatch: plan=${chunksPlan.length} got=${ciphertextChunks.length}`);
  }

  // 2) Upload each ciphertext chunk via presigned PUT (retry-safe)
  await runPool({
    items: chunksPlan,
    concurrency: options.maxConcurrency,
    worker: async (chunk) => {
      const ct = ciphertextChunks[chunk.chunkIndex];
      const sha = await sha256Hex(ct);

      const pres = await presign.presignChunk({
        fileId,
        chunkIndex: chunk.chunkIndex,
        sha256Hex: sha,
        sizeBytes: ct.byteLength,
        contentType: "application/octet-stream",
      });

      const putRes = await putWithRetry({
        url: pres.url,
        headers: pres.headers,
        body: ct,
        maxRetries: options.maxRetries,
        baseDelayMs: options.baseRetryDelayMs,
      });

      uploaded.push({
        chunkIndex: chunk.chunkIndex,
        sha256Hex: sha,
        sizeBytes: ct.byteLength,
        etag: putRes.etag,
      });

      uploadedBytes += ct.byteLength;
      uploadedChunks += 1;

      options.onProgress?.({
        fileId,
        uploadedBytes,
        totalBytes: ciphertextChunks.reduce((s, b) => s + b.byteLength, 0),
        uploadedChunks,
        totalChunks: chunksPlan.length,
      });
    },
  });

  uploaded.sort((a, b) => a.chunkIndex - b.chunkIndex);

  // 3) Build manifest (ciphertext-only)
  const manifest: MhgptUploadManifest = {
    version: 1,
    fileId,
    createdAtIso: new Date().toISOString(),
    algo,
    original: {
      name: file.name,
      sizeBytes: file.size,
      mimeType: file.type || "application/octet-stream",
      lastModifiedMs: file.lastModified,
    },
    chunking: {
      chunkSizeBytes: options.chunkSizeBytes,
      chunkCount: chunksPlan.length,
    },
    chunks: uploaded.map((u) => {
      const plan = chunksPlan[u.chunkIndex];
      return {
        chunkIndex: u.chunkIndex,
        byteStart: plan.byteStart,
        byteEndExclusive: plan.byteEndExclusive,
        sha256Hex: u.sha256Hex,
        sizeBytes: u.sizeBytes,
        etag: u.etag,
      };
    }),
  };

  // 4) Upload manifest JSON (presigned PUT)
  const presManifest = await presign.presignManifest({
    fileId,
    contentType: "application/json",
  });

  await putJsonWithRetry({
    url: presManifest.url,
    headers: presManifest.headers,
    json: manifest,
    maxRetries: options.maxRetries,
    baseDelayMs: options.baseRetryDelayMs,
  });

  return { fileId, manifest };
}
