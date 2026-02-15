// hooks/useCryptoKeys.ts
// ============================================================================
// React hook for SK (Device Key) lifecycle and eviction detection
// Version: v1.0 – 2026-02-14
//
// Checks IndexedDB for the presence of the device's Storage Key (SK).
// Detects eviction: user is authenticated but SK is missing.
//
// SPEC-006 §8.3: SK eviction detection
// SPEC-006 §2: SK-Persistenz (Best Effort)
//
// Usage:
//   const { hasKeys, isLoading, isEvicted, error } = useCryptoKeys();
//
//   if (isEvicted) {
//     // Show: "Ihre Sicherheitsschlüssel wurden gelöscht.
//     //        Bitte koppeln Sie dieses Gerät erneut."
//   }
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { hasDeviceKey } from "../lib/crypto/sk";
import { useSession } from "./useSession";

const BROADCAST_CHANNEL_NAME = "mhgpt-crypto-keys";

type CryptoKeysState = {
  /** Whether SK exists in IndexedDB */
  hasKeys: boolean;
  /** Initial check in progress */
  isLoading: boolean;
  /** User is authenticated but SK is missing (SPEC-006 §8.3) */
  isEvicted: boolean;
  /** Error during IndexedDB access */
  error: Error | null;
};

export function useCryptoKeys() {
  const { isAuthenticated } = useSession();

  const [state, setState] = useState<CryptoKeysState>({
    hasKeys: false,
    isLoading: true,
    isEvicted: false,
    error: null,
  });

  const unmountedRef = useRef(false);

  // Check IndexedDB for SK presence
  const checkKeys = useCallback(async () => {
    if (unmountedRef.current) return;

    try {
      const exists = await hasDeviceKey();
      if (unmountedRef.current) return;

      setState((prev) => ({
        ...prev,
        hasKeys: exists,
        isLoading: false,
        error: null,
      }));
    } catch (err) {
      if (unmountedRef.current) return;

      setState((prev) => ({
        ...prev,
        hasKeys: false,
        isLoading: false,
        error:
          err instanceof Error
            ? err
            : new Error("Failed to check device keys"),
      }));
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    unmountedRef.current = false;
    checkKeys();

    return () => {
      unmountedRef.current = true;
    };
  }, [checkKeys]);

  // Compute isEvicted: authenticated but no keys
  useEffect(() => {
    if (state.isLoading) return;

    setState((prev) => ({
      ...prev,
      isEvicted: isAuthenticated === true && !prev.hasKeys,
    }));
  }, [isAuthenticated, state.isLoading, state.hasKeys]);

  // Multi-tab sync via BroadcastChannel
  // If another tab generates SK, this tab picks it up
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

    channel.onmessage = (event) => {
      if (
        event.data &&
        event.data.type === "mhgpt-crypto-keys-changed"
      ) {
        // Re-check IndexedDB when another tab signals a change
        checkKeys();
      }
    };

    return () => {
      channel.close();
    };
  }, [checkKeys]);

  // Broadcast our own changes to other tabs
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.isLoading) return;
    if (!("BroadcastChannel" in window)) return;

    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.postMessage({
      type: "mhgpt-crypto-keys-changed",
      payload: { hasKeys: state.hasKeys },
    });
    channel.close();
  }, [state.hasKeys, state.isLoading]);

  return {
    hasKeys: state.hasKeys,
    isLoading: state.isLoading,
    isEvicted: state.isEvicted,
    error: state.error,
  };
}
