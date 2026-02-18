// components/NERStatusBadge/index.tsx
// ============================================================================
// SPEC-007a §5 — NER Status Indicator
//
// Shows inline status of NER model loading/readiness during file upload.
// Displays near Message input area to inform user about detection capabilities.
//
// States:
//   - idle: hidden (worker not started)
//   - loading: "Loading advanced detection... (42%)"
//   - ready: "Advanced detection active" (green dot)
//   - degraded: "Basic detection only (pattern-based)" (gold dot)
//               → NER failed (integrity, timeout, WASM error), NOT "not downloaded"
// ============================================================================

import { useTranslation } from "@/lib/i18n/I18nContext";
import type { NERStatus } from "../../lib/pseudonymization";

type NERStatusBadgeProps = {
  status: NERStatus;
  progress: number; // 0-100
};

const NERStatusBadge = ({ status, progress }: NERStatusBadgeProps) => {
  const t = useTranslation();

  // idle: hidden (worker not started yet)
  if (status === "idle") {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-n-4 dark:text-n-3 mt-2">
      {status === "loading" && (
        <>
          <span className="inline-block w-2 h-2 bg-primary-1 rounded-full animate-pulse" />
          <span>
            {t("pseudonymization.status.loading")} ({Math.round(progress)}%)
          </span>
        </>
      )}

      {status === "ready" && (
        <>
          <span className="inline-block w-2 h-2 bg-primary-2 rounded-full" />
          <span>{t("pseudonymization.status.ready")}</span>
        </>
      )}

      {status === "degraded" && (
        <>
          <span className="inline-block w-2 h-2 bg-accent-5 rounded-full" />
          <span>{t("pseudonymization.status.degraded")}</span>
        </>
      )}
    </div>
  );
};

export default NERStatusBadge;
