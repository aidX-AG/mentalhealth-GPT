// lib/pseudonymization/pdfjs-init.ts
// ============================================================================
// SPEC-007a §2.3 — pdfjs-dist Worker Setup
//
// MF-2: Primary worker path is pre-copied asset in /public/ (most stable).
//       This approach works reliably across:
//       - Development (Next.js dev server)
//       - Production build (static assets)
//       - CDN deployment (no bundler URL resolution issues)
//
// This file must be imported dynamically with `ssr: false` to avoid Next.js
// server-side execution issues.
// ============================================================================

import * as pdfjsLib from "pdfjs-dist";

// Worker path: asset in /public/ (copied during build via npm postinstall)
const WORKER_PUBLIC_PATH = "/pdf.worker.min.mjs";

// Only initialize if in browser context
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_PUBLIC_PATH;
}

export { pdfjsLib };
