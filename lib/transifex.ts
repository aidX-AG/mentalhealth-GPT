// lib/transifex.ts
import { tx } from '@transifex/native';

/**
 * Verfügbare Locales zentral verwalten (für Routing/SSR später nützlich).
 */
export const LOCALES = (process.env.TX_LOCALES || 'en,de,fr')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const DEFAULT_LOCALE = process.env.TX_DEFAULT_LOCALE || 'en';

/**
 * Doppel-Init verhindern (HMR/SSR).
 */
declare global {
  // eslint-disable-next-line no-var
  var __tx_initialized__: boolean | undefined;
}

if (!globalThis.__tx_initialized__) {
  tx.init({
    token: process.env.NEXT_PUBLIC_TX_PUBLIC_TOKEN || '', // nur Public Token im Frontend verwenden
    // KEIN sourceLocale: wird von tx.init() nicht unterstützt
  });
  globalThis.__tx_initialized__ = true;
}

export { tx };
