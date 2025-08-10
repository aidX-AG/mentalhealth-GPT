"use client";

import "./i18n.client"; // side-effect: initialisiert i18next
import { ReactNode } from "react";

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
