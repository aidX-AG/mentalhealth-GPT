// lib/pseudonymization/ner-singleton.ts
// ============================================================================
// SPEC-007 §4.4 — NER Singleton (Framework-Agnostic)
//
// globalThis singleton guarantees exactly ONE Worker per browser tab,
// even under React Strict Mode (double-mount in dev) and Next.js HMR
// (module re-evaluation on hot reload).
//
// Hooks subscribe to status/progress events — they never own the worker.
//
// Pattern:
//   ensureReady()  → starts init exactly once, returns Promise
//   subscribe(cb)  → receive status/progress events, returns unsubscribe fn
//   detect(text)   → NER detection (empty [] if not ready / degraded)
//   getStatus()    → current NER status (sync)
//   getProgress()  → current download progress 0–100 (sync)
//   destroy()      → tear down worker + remove globalThis entry (for tests)
// ============================================================================

import { NERClient } from "./ner-client";
import type { DetectedPII, NERStatus } from "./types";

// ---------------------------------------------------------------------------
// Listener type
// ---------------------------------------------------------------------------

export interface NERSingletonListener {
  onStatus?: (status: NERStatus) => void;
  onProgress?: (percent: number) => void;
}

// ---------------------------------------------------------------------------
// Internal singleton state
// ---------------------------------------------------------------------------

interface NERSingletonState {
  client: NERClient;
  listeners: Set<NERSingletonListener>;
  initPromise: Promise<void> | null;
  progress: number;
}

const GLOBAL_KEY = "__mhgpt_ner_singleton__" as const;

// Type augmentation for globalThis
declare global {
  // eslint-disable-next-line no-var
  var __mhgpt_ner_singleton__: NERSingletonState | undefined;
}

// ---------------------------------------------------------------------------
// Access the singleton (create on first access)
// ---------------------------------------------------------------------------

function getSingleton(): NERSingletonState {
  if (!globalThis[GLOBAL_KEY]) {
    const client = new NERClient();
    const state: NERSingletonState = {
      client,
      listeners: new Set(),
      initPromise: null,
      progress: 0,
    };

    // Wire NERClient callbacks → broadcast to all subscribers
    client.setStatusCallback((status: NERStatus) => {
      Array.from(state.listeners).forEach((listener) => {
        listener.onStatus?.(status);
      });
    });

    client.setProgressCallback((percent: number) => {
      state.progress = percent;
      Array.from(state.listeners).forEach((listener) => {
        listener.onProgress?.(percent);
      });
    });

    globalThis[GLOBAL_KEY] = state;
  }
  return globalThis[GLOBAL_KEY]!;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Subscribe to NER status and progress events.
 * Returns an unsubscribe function. Safe to call multiple times.
 *
 * Immediately fires onStatus with current status so the subscriber
 * doesn't have to poll.
 */
export function subscribe(listener: NERSingletonListener): () => void {
  const s = getSingleton();
  s.listeners.add(listener);

  // Immediate sync: fire current state so subscriber starts correct
  listener.onStatus?.(s.client.getStatus());
  if (s.progress > 0) {
    listener.onProgress?.(s.progress);
  }

  return () => {
    s.listeners.delete(listener);
  };
}

/**
 * Start NER model loading exactly once.
 * Subsequent calls return the same Promise.
 * If already ready or degraded, resolves immediately.
 */
export function ensureReady(): Promise<void> {
  const s = getSingleton();
  const status = s.client.getStatus();

  // Already terminal state
  if (status === "ready" || status === "degraded") {
    return Promise.resolve();
  }

  // Init only once
  if (!s.initPromise) {
    s.initPromise = s.client.init().catch(() => {
      // Error handled internally by NERClient → status goes to "degraded"
    });
  }

  return s.initPromise;
}

/**
 * Run NER detection on text.
 * Returns empty array if model is not ready (degraded-safe).
 */
export function detect(text: string): Promise<DetectedPII[]> {
  return getSingleton().client.detect(text);
}

/**
 * Current NER status (synchronous).
 */
export function getStatus(): NERStatus {
  return getSingleton().client.getStatus();
}

/**
 * Current download progress 0–100 (synchronous).
 */
export function getProgress(): number {
  return getSingleton().progress;
}

/**
 * Tear down the worker and remove the globalThis entry.
 * For tests only — guarded by NODE_ENV check in production.
 */
export function destroy(): void {
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "test") {
    console.warn("[ner-singleton] destroy() should only be called in test environment");
    return;
  }
  const s = globalThis[GLOBAL_KEY];
  if (s) {
    s.client.destroy();
    s.listeners.clear();
    s.initPromise = null;
    globalThis[GLOBAL_KEY] = undefined;
  }
}
