// public/workers/ner-worker.mjs
// ============================================================================
// SPEC-007 §4.4, §4.5 — NER Web Worker (Self-Hosted CDN Version)
//
// Runs in a dedicated Web Worker. Loads Transformers.js from self-hosted CDN.
// Version pinning + SHA-256 integrity verification for supply-chain security.
// ============================================================================

const TRANSFORMERS_CDN = {
  baseUrl: "https://models.mentalhealthgpt.ch/vendor/transformers",
  version: "v3.2.0",
  integrity: null, // TODO: Add SHA-256 hash after hosting
};

const MODEL_CONFIG = {
  baseUrl: "https://models.mentalhealthgpt.ch/ner",
  version: "v1.0",
  integrity: null,
};

let pipeline = null;
let nerPipeline = null;
let transformersLib = null;

function postMsg(msg) {
  self.postMessage(msg);
}

async function verifyIntegrity(data, expectedHash) {
  if (!expectedHash) {
    console.warn("[NER Worker] No integrity hash - skipping verification");
    return true;
  }
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashHex =
    "sha256-" +
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return hashHex === expectedHash;
}

async function loadTransformersLib() {
  if (transformersLib) return transformersLib;

  try {
    const cdnUrl = TRANSFORMERS_CDN.baseUrl + "/" + TRANSFORMERS_CDN.version + "/transformers.min.mjs";
    
    postMsg({ type: "progress", percent: 5, message: "Loading Transformers.js library..." });

    if (TRANSFORMERS_CDN.integrity) {
      const response = await fetch(cdnUrl);
      const arrayBuffer = await response.arrayBuffer();
      const valid = await verifyIntegrity(arrayBuffer, TRANSFORMERS_CDN.integrity);
      if (!valid) {
        throw new Error("Transformers.js integrity verification failed");
      }
      const blob = new Blob([arrayBuffer], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      transformersLib = await import(blobUrl);
      URL.revokeObjectURL(blobUrl);
    } else {
      transformersLib = await import(cdnUrl);
    }

    postMsg({ type: "progress", percent: 10, message: "Transformers.js loaded" });
    return transformersLib;
  } catch (err) {
    throw new Error("Failed to load Transformers.js from CDN: " + err.message);
  }
}

async function initModel() {
  try {
    const transformers = await loadTransformersLib();
    pipeline = transformers.pipeline;

    const env = transformers.env;
    env.useBrowserCache = true;
    env.cacheDir = "transformers-cache";
    env.allowRemoteModels = false;
    env.remoteHost = MODEL_CONFIG.baseUrl;

    postMsg({ type: "progress", percent: 15, message: "Loading NER model..." });

    const modelUrl = MODEL_CONFIG.baseUrl + "/" + MODEL_CONFIG.version;
    nerPipeline = await pipeline("token-classification", modelUrl, {
      quantized: true,
      progress_callback: (progress) => {
        if (progress.progress !== undefined) {
          postMsg({
            type: "progress",
            percent: Math.round(15 + progress.progress * 0.85),
            message: "Loading model... " + Math.round(progress.progress * 100) + "%",
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

async function detect(text, requestId) {
  if (!nerPipeline) {
    postMsg({ type: "error", message: "Model not initialized" });
    return;
  }

  try {
    const results = await nerPipeline(text, {
      aggregation_strategy: "simple",
    });

    const entities = results.map((r) => ({
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

self.onmessage = async (event) => {
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

postMsg({ type: "progress", percent: 0, message: "Worker started" });
