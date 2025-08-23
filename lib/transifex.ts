// lib/transifex.ts
import { tx } from "@transifex/native";

/**
 * Verfügbare Locales aus .env.local
 */
export const LOCALES = (process.env.TX_AVAILABLE_LOCALES || "en,de,fr")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const DEFAULT_LOCALE = process.env.TX_DEFAULT_LOCALE || "en";

/**
 * Doppel-Init verhindern (HMR/SSR).
 */
declare global {
  // eslint-disable-next-line no-var
  var __tx_initialized__: boolean | undefined;
}

if (!globalThis.__tx_initialized__) {
  tx.init({
    token: process.env.TRANSIFEX_TOKEN || "", // Public/Read Token aus .env.local
  });
  globalThis.__tx_initialized__ = true;
}

/**
 * tx = gesamte API, t = Shortcut für Übersetzungen
 */
export { tx };
export const { t } = tx;
