"use client";

import i18n from "./i18n.client";               // init + Events
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lng, setLng] = useState(() =>
    (i18n.language || "de").split("-")[0].toLowerCase()
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Warten bis i18n initialisiert ist
        if (!i18n.isInitialized) {
          await new Promise<void>((resolve) => {
            const onInit = () => {
              i18n.off("initialized", onInit);
              resolve();
            };
            i18n.on("initialized", onInit);
          });
        }

        // 2) Alle Namespaces laden, bevor wir das erste Mal rendern
        const ns = Array.isArray(i18n.options?.ns) ? (i18n.options!.ns as string[]) : [];
        if (ns.length) {
          await i18n.loadNamespaces(ns);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    // 3) Bei Sprachwechsel remounten (für direkte i18next.t(...) Aufrufe)
    const onLang = (newLng: string) => {
      const base = (newLng || "de").split("-")[0].toLowerCase();
      setLng(base);
    };
    i18n.on("languageChanged", onLang);

    return () => {
      cancelled = true;
      i18n.off("languageChanged", onLang);
    };
  }, []);

  if (!ready) return null; // verhindert EN-defaultValues beim ersten Render

  return (
    <Suspense fallback={null}>
      <div key={lng}>{children}</div>
    </Suspense>
  );
}
