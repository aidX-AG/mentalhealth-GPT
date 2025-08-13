"use client";
import "./i18n.client";                  // ⚡ init EINMAL global
import { Suspense, useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);   // vermeidet SSR-Flash
  if (!ready) return null;
  return <Suspense fallback={null}>{children}</Suspense>;
}
