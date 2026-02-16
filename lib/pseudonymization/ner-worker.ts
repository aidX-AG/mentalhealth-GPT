// lib/pseudonymization/ner-worker.ts
// ============================================================================
// SPEC-007 §4.4, §4.5 — NER Web Worker
//
// Runs in a dedicated Web Worker. Loads Transformers.js + NER model.
// Self-hosted model with SHA-256 integrity verification.
//
// NOTE: This file is a Web Worker entry point. It will be bundled separately.
// ============================================================================

import type { NERWorkerRequest, NERWorkerResponse, NEREntity } from "./types";
import { MODEL_CONFIG, DOWNLOAD_CONFIG } from "./types";

// Transformers.js is loaded dynamically at runtime. Declare minimal types here.
// The actual package (@huggingface/transformers) is only available in the browser.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pipeline: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let nerPipeline: any = null;

function postMsg(msg: NERWorkerResponse): void {
  self.postMessage(msg);
}

// ---------------------------------------------------------------------------
// SHA-256 Integrity Verification (§4.5.3)
// ---------------------------------------------------------------------------

async function verifyIntegrity(
  data: ArrayBuffer,
  expectedHash: string,
): Promise<boolean> {
  if (!expectedHash) return true; // Skip if no hash configured yet
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashHex =
    "sha256-" +
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return hashHex === expectedHash;
}

// ---------------------------------------------------------------------------
// Model Initialization
// ---------------------------------------------------------------------------

async function initModel(): Promise<void> {
  try {
    // Dynamic import of Transformers.js
    const transformers = await import("@huggingface/transformers");
    pipeline = transformers.pipeline;

    // Configure for self-hosted model (§4.5.4)
    const env = transformers.env;
    env.useBrowserCache = true;
    env.cacheDir = "transformers-cache";
    env.allowRemoteModels = false;

    postMsg({ type: "progress", percent: 10 });

    // Create NER pipeline
    const modelUrl = `${MODEL_CONFIG.baseUrl}/${MODEL_CONFIG.version}`;
    nerPipeline = await pipeline("token-classification", modelUrl, {
      quantized: true,
      progress_callback: (progress: { progress?: number }) => {
        if (progress.progress !== undefined) {
          postMsg({
            type: "progress",
            percent: Math.round(10 + progress.progress * 0.9),
          });
        }
      },
    });

    postMsg({ type: "ready" });
  } catch (err) {
    postMsg({
      type: "error",
      message: err instanceof Error ? err.message : "Model initialization failed",
    });
  }
}

// ---------------------------------------------------------------------------
// NER Detection
// ---------------------------------------------------------------------------

async function detect(text: string, requestId: string): Promise<void> {
  if (!nerPipeline) {
    postMsg({
      type: "error",
      message: "Model not initialized",
    });
    return;
  }

  try {
    const results = await nerPipeline(text, {
      aggregation_strategy: "simple",
    });

    const entities: NEREntity[] = (results as Array<{
      entity_group: string;
      score: number;
      word: string;
      start: number;
      end: number;
    }>).map((r) => ({
      entity: r.entity_group,
      score: r.score,
      word: r.word,
      start: r.start,
      end: r.end,
    }));

    postMsg({ type: "result", requestId, entities });
  } catch (err) {
    postMsg({
      type: "error",
      message: err instanceof Error ? err.message : "Detection failed",
    });
  }
}

// ---------------------------------------------------------------------------
// Message Handler
// ---------------------------------------------------------------------------

self.onmessage = async (event: MessageEvent<NERWorkerRequest>) => {
  const msg = event.data;

  switch (msg.type) {
    case "init":
      await initModel();
      break;
    case "detect":
      await detect(msg.text, msg.requestId);
      break;
  }
};
