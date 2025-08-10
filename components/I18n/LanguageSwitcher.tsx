"use client";

import i18n from "i18next";

const SUPPORTED = [
  { code: "en", label: "English" },
  // { code: "de", label: "Deutsch" }, // aktivieren, sobald de da ist
];

export default function LanguageSwitcher() {
  const current = i18n.language || "en";

  return (
    <select
      value={current}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="border rounded px-2 py-1"
      aria-label="Change language"
    >
      {SUPPORTED.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
