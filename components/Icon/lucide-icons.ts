// frontend/components/Icon/lucide-icons.ts

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
} from "lucide-react";

export const lucideIcons: { [key: string]: React.ElementType } = {
  cpu: Cpu,
  lock: Lock,
  layers: Layers,
  message: MessageCircle,
  "layout-dashboard": LayoutDashboard,
  "server-cog": ServerCog,
  "shield-check": ShieldCheck,
  bot: Bot,
  "file-stack": FileStack,
  "globe-lock": GlobeLock,
  "file-check": FileCheck,
  braces: Braces,
  "bar-chart-3": BarChart3,
  "user-cog": UserCog,
  "folder-git-2": FolderGit2,
  "file-search": FileSearch,
  settings: Settings,
  "user-round-check": UserRoundCheck,
  "alert-circle": AlertCircle,
  cloud: Cloud,
  "message-square-text": MessageSquareText,
};

// Alias für klarere Lesbarkeit in Updates etc.
export const LucideIconMap = lucideIcons;
