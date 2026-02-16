// lib/pseudonymization/ner-client.ts
// ============================================================================
// SPEC-007 §4.4 — NER Client (Main Thread)
//
// Wrapper around the NER Web Worker. Manages lifecycle, dispatches messages,
// and converts NER entities to DetectedPII format.
// ============================================================================

import type {
  DetectedPII,
  NERStatus,
  NERWorkerResponse,
  NEREntity,
} from "./types";
import {
  NER_CONFIDENCE_THRESHOLD,
  NER_HIGH_CONFIDENCE,
  NER_ENTITY_MAP,
} from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProgressCallback = (percent: number) => void;

interface PendingRequest {
  resolve: (entities: NEREntity[]) => void;
  reject: (error: Error) => void;
}

// ---------------------------------------------------------------------------
// NER Client
// ---------------------------------------------------------------------------

export class NERClient {
  private worker: Worker | null = null;
  private status: NERStatus = "idle";
  private pendingRequests = new Map<string, PendingRequest>();
  private onProgress: ProgressCallback | null = null;
  private onStatusChange: ((status: NERStatus) => void) | null = null;
  private requestCounter = 0;

  getStatus(): NERStatus {
    return this.status;
  }

  setProgressCallback(cb: ProgressCallback): void {
    this.onProgress = cb;
  }

  setStatusCallback(cb: (status: NERStatus) => void): void {
    this.onStatusChange = cb;
  }

  private setStatus(status: NERStatus): void {
    this.status = status;
    this.onStatusChange?.(status);
  }

  /**
   * Initialize the NER worker and start model loading.
   * Call this when the chat opens.
   */
  async init(): Promise<void> {
    if (this.status === "ready" || this.status === "loading") return;

    try {
      // Create worker — load from public/workers/ (not bundled)
      this.worker = new Worker("/workers/ner-worker.mjs", { type: "module" });

      this.worker.onmessage = (event: MessageEvent<NERWorkerResponse>) => {
        this.handleMessage(event.data);
      };

      this.worker.onerror = () => {
        this.setStatus("degraded");
      };

      this.setStatus("loading");
      this.worker.postMessage({ type: "init" });
    } catch {
      this.setStatus("degraded");
    }
  }

  /**
   * Detect NER entities in text.
   * Returns empty array if model is not ready.
   */
  async detect(text: string): Promise<DetectedPII[]> {
    if (this.status !== "ready" || !this.worker) {
      return [];
    }

    const requestId = `ner-${++this.requestCounter}`;

    const entities = await new Promise<NEREntity[]>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      this.worker!.postMessage({ type: "detect", text, requestId });

      // Timeout after 30s
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          resolve([]); // Graceful degradation
        }
      }, 30_000);
    });

    return this.convertEntities(entities, text);
  }

  /**
   * Terminate the worker. Call on cleanup.
   */
  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
    this.setStatus("idle");
    this.pendingRequests.clear();
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private handleMessage(msg: NERWorkerResponse): void {
    switch (msg.type) {
      case "ready":
        this.setStatus("ready");
        break;

      case "progress":
        this.onProgress?.(msg.percent);
        break;

      case "result": {
        const pending = this.pendingRequests.get(msg.requestId);
        if (pending) {
          this.pendingRequests.delete(msg.requestId);
          pending.resolve(msg.entities);
        }
        break;
      }

      case "error":
        // If model failed to load, go to degraded
        if (this.status === "loading") {
          this.setStatus("degraded");
        }
        // Reject all pending requests
        this.pendingRequests.forEach((pending, id) => {
          pending.reject(new Error(msg.message));
          this.pendingRequests.delete(id);
        });
        break;
    }
  }

  /**
   * Convert NER entities to DetectedPII format.
   * Filters by confidence threshold and maps entity types.
   */
  private convertEntities(
    entities: NEREntity[],
    text: string,
  ): DetectedPII[] {
    const results: DetectedPII[] = [];

    for (const entity of entities) {
      // Filter by confidence
      if (entity.score < NER_CONFIDENCE_THRESHOLD) continue;

      // Map NER entity type to PII category
      const category = NER_ENTITY_MAP[entity.entity];
      if (!category) continue;

      results.push({
        category,
        original: text.slice(entity.start, entity.end),
        start: entity.start,
        end: entity.end,
        confidence: entity.score,
        source: "ner",
        defaultAccepted: entity.score >= NER_HIGH_CONFIDENCE,
      });
    }

    return results;
  }
}
