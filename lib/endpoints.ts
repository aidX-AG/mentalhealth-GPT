// lib/endpoints.ts
// ============================================================================
// Public endpoints (www / api / media / rt)
// Version: v1.0 – 2026-01-12
// ============================================================================

function trimSlash(s: string): string {
  return s.replace(/\/$/, "");
}

/**
 * Defaults are production. Override via NEXT_PUBLIC_* in build environment.
 * - www is where the app is served (not needed as base here)
 * - api is JSON/Auth/metadata/key-wrapping gateway
 * - media is ciphertext transfer orchestration (uploads/downloads)
 * - rt is optional (streaming later)
 */
export const endpoints = {
  api: trimSlash(process.env.NEXT_PUBLIC_API_ORIGIN || "https://api.mentalhealth-gpt.ch"),
  media: trimSlash(process.env.NEXT_PUBLIC_MEDIA_ORIGIN || "https://media.mentalhealth-gpt.ch"),
  rt: trimSlash(process.env.NEXT_PUBLIC_RT_ORIGIN || "https://rt.mentalhealth-gpt.ch"),
} as const;

// Type for endpoints
export type EndpointKey = keyof typeof endpoints;

// Helper to ensure we always use proper paths
export const apiPaths = {
  auth: "/api/v1/auth",
  profile: "/api/v1/profile",
  media: {
    init: "/api/v1/media/init",
    finalize: "/api/v1/media/finalize",
    metadata: "/api/v1/media",
  },
  crypto: {
    wrapDek: "/v1/crypto/wrap-dek-for-worker",
  },
  devices: {
    register: "/api/v1/devices/mk-wrap",
    current: "/api/v1/devices/current/mk-wrap",
    byId: (id: string) => `/api/v1/devices/${id}/mk-wrap` as const,
    list: "/api/v1/devices",
    revoke: (id: string) => `/api/v1/devices/${id}/revoke` as const,
  },
  pairing: {
    create: "/api/v1/pairing/sessions",
    sendResponse: (id: string) => `/api/v1/pairing/${id}/response` as const,
    getResponse: (id: string) => `/api/v1/pairing/${id}/response` as const,
    sendData: (id: string) => `/api/v1/pairing/${id}/data` as const,
    getData: (id: string) => `/api/v1/pairing/${id}/data` as const,
  },
  mappings: {
    presignedUpload: "/api/v1/mappings/presigned-upload",
    presignedDownload: "/api/v1/mappings/presigned-download",
    metadata: "/api/v1/mappings/metadata",
  },
} as const;

// Full URL builder
export function getApiUrl(path: string): string {
  return `${endpoints.api}${path}`;
}

export function getMediaUrl(path: string): string {
  return `${endpoints.media}${path}`;
}
