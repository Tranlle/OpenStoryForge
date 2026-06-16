import {
  AlertTriangle,
  Archive,
  Bot,
  CircleCheck,
  GitBranch,
  LayoutTemplate,
  LoaderCircle,
  Puzzle,
  Settings,
  Sparkles,
  Users,
  Workflow,
  Wrench,
  type LucideIcon
} from "lucide-react";

import type { AppNavItem, OverflowNavItem, ProjectTreeConversation } from "@renderer/components/layout/app-shell.types";

export const primaryNavItems: AppNavItem[] = [
  { id: "new-chat", icon: Sparkles, labelKey: "nav.newChat" },
  { id: "skills", icon: Bot, labelKey: "nav.skills" },
  { id: "tools", icon: Wrench, labelKey: "nav.tools" },
  { id: "automation", icon: Workflow, labelKey: "nav.automation" },
  { id: "mcp", icon: Puzzle, labelKey: "nav.mcp" }
];

export const secondaryNavItems: AppNavItem[] = [
  { id: "archive", icon: Archive, labelKey: "nav.archive" },
  { id: "settings", icon: Settings, labelKey: "nav.settings" }
];

export const overflowNavItems: OverflowNavItem[] = [
  { icon: LayoutTemplate, labelKey: "nav.recentTemplates" },
  { icon: Users, labelKey: "nav.teamSpace" },
  { icon: GitBranch, labelKey: "nav.experiments" }
];

export const statusIconMap: Record<ProjectTreeConversation["status"], LucideIcon> = {
  completed: CircleCheck,
  error: AlertTriangle,
  running: LoaderCircle
};
