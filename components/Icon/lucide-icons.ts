// frontend/components/Icon/lucide-icons.ts
// ============================================================================
// Lucide Icon Registry
// Version: 1.1.0 — 2025-12-27
// Purpose:
// Central mapping between string icon identifiers and lucide-react icons.
// Used across Updates, Navigation, Feature Lists, etc.
// ============================================================================

import {
  Cpu,
  Lock,
  Layers,
  MessageCircle,
  LayoutDashboard,
  ServerCog,
  ShieldCheck,
  Bot,
  FileStack,
  GlobeLock,
  FileCheck,
  Braces,
  BarChart3,
  UserCog,
  FolderGit2,
  FileSearch,
  Settings,
  UserRoundCheck,
  AlertCircle,
  Cloud,
  MessageSquareText,
  LogIn,

  // Auth / Security
  Fingerprint,        // ✅ Passkey / Face ID
  FileSignature,
  FilePen,
} from "lucide-react";

export const lucideIcons: { [key: string]: React.ElementType } = {
  // Core / Infra
  cpu: Cpu,
  lock: Lock,
  layers: Layers,
  bot: Bot,
  cloud: Cloud,

  // UI / Navigation
  message: MessageCircle,
  "message-square-text": MessageSquareText,
  "layout-dashboard": LayoutDashboard,
  settings: Settings,
  "log-in": LogIn,

  // Backend / Ops
  "server-cog": ServerCog,
  "bar-chart-3": BarChart3,
  "folder-git-2": FolderGit2,
  "file-search": FileSearch,

  // Security / Compliance
  "shield-check": ShieldCheck,
  "user-round-check": UserRoundCheck,
  "alert-circle": AlertCircle,

  // Content / Files
  "file-stack": FileStack,
  "file-check": FileCheck,
  "file-signature": FileSignature,
  "file-pen": FilePen,
  braces: Braces,

  // Internationalization
  "globe-lock": GlobeLock,

  // ✅ Passkey / Face ID / WebAuthn
  fingerprint: Fingerprint,
};

export const LucideIconMap = lucideIcons;
