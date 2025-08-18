// types/weglot.d.ts

// Minimales, aber praxistaugliches Typ-Set für Weglot im Browser
declare global {
  interface WeglotConfig {
    api_key: string;
    wait_transition?: boolean;
    auto_switch?: boolean;
    persistence?: 'localstorage' | 'cookie' | 'none';
    dynamic?: {
      enabled?: boolean;
      observe?: boolean;
      refreshOnLoad?: boolean;
    };
    exclude_selectors?: string[];
    switchers?: Array<{ target: string }>;
    lazy_load?: boolean;
  }

  interface WeglotAPI {
    initialize?: (config: WeglotConfig) => void;
    refresh?: () => void;
    getCurrentLang?: () => string | undefined;
    switchTo?: (lang: string) => void;
    on?: (eventName: string, handler: (payload?: any) => void) => void;
    off?: (eventName: string, handler: (payload?: any) => void) => void;
  }

  interface Window {
    Weglot?: WeglotAPI;
    WeglotConfig?: WeglotConfig;
    __WEGLOT?: { lang?: string };
  }
}

export {};
