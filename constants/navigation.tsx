// constants/navigation.tsx
export type NavItemBase = {
  key: string;   // EN key used for translation lookup
  icon: string;
  color: string;
  url: string;
};

export const navigationBase: NavItemBase[] = [
  { key: "Therapy Support AI",          icon: "image-check",  color: "#8E55EA", url: "/therapy-support" },
  { key: "Supervision & Training",      icon: "lightbulb",    color: "#FACC15", url: "/supervision-training" },
  { key: "Diagnosis Support",           icon: "codepen",      color: "#52BA69", url: "/diagnosis-support" },
  { key: "Audio Transcription & Notes", icon: "music-note",   color: "#E68A1D", url: "/audio-transcription" },
  { key: "Video Analysis",              icon: "play-circle",  color: "#D84C10", url: "/video-analysis" },
  { key: "Documentation & Reporting",   icon: "trophy",       color: "#0084FF", url: "/documentation-reports" },
];

// helper to build translated items for the Menu
export function makeNavigation(t: (s: string) => string) {
  return navigationBase.map(({ key, ...rest }) => ({
    title: t(key),
    ...rest,
  }));
}
