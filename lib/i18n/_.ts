// lib/i18n/_.ts
// Minimal: diente NUR als Platzhalter/Fallback.
// Unser Build-Script ersetzt _("...") durch fertige Strings vor dem Next-Build.
export function _(key: string): string {
  return key; // Text-as-Key Fallback (sollte man im Build nie sehen)
}
