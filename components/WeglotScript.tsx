"use client";

import { useEffect } from "react";

export default function WeglotScript() {
  useEffect(() => {
    // Sicherstellen, dass nur im Browser geladen wird
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.weglot.com/weglot.min.js";
      script.async = true;
      script.onload = () => {
        if (typeof Weglot !== "undefined") {
          Weglot.initialize({
            api_key: "wg_d9cb54c80d40ded6bb70278dc06ee7f97",
            auto_switch: false, // Oder false, wenn gewünscht
          });
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
