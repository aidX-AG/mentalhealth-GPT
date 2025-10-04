// constants/navigation.tsx

export type NavItemBase = {
  key: string;   // EN-Übersetzungs-Key
  icon: string;
  color: string;
  url: string;
};

export const navigationBase: NavItemBase[] = [
  { key: "therapy-support.chat.title",       icon: "image-check", color: "#8E55EA", url: "/therapy-support" },
  { key: "supervision-training.chat.title",  icon: "lightbulb",   color: "#FACC15", url: "/supervision-training" },
  { key: "diagnosis-support.chat.title",     icon: "codepen",     color: "#52BA69", url: "/diagnosis-support" },
  { key: "audio-transcription.chat.title",   icon: "music-note",  color: "#E68A1D", url: "/audio-transcription" },
  { key: "video-analysis.chat.title",        icon: "play-circle", color: "#D84C10", url: "/video-analysis" },
  { key: "documentation-reports.chat.title", icon: "trophy",      color: "#0084FF", url: "/documentation-reports" },
];

// Für Seiten, die die Keys extrahieren/pushen möchten (TX):
export const NAV_KEYS: string[] = navigationBase.map((n) => n.key);

// Übersetzte Items für <Menu/> erzeugen (Titel aus t(key)):
export function makeNavigation(t: (s: string) => string) {
  return navigationBase.map(({ key, ...rest }) => ({
    title: t(key),
    ...rest,
  }));
}

// Backwards-Compat: "navigation" wie früher (EN-Titel = key)
export const navigation = navigationBase.map(({ key, ...rest }) => ({
  title: key,
  ...rest,
}));
