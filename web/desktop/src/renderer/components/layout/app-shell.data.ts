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
  { id: "new-chat", icon: Sparkles, label: "新建对话" },
  { id: "skills", icon: Bot, label: "Skills" },
  { id: "tools", icon: Wrench, label: "Tools" },
  { id: "automation", icon: Workflow, label: "自动流" },
  { id: "mcp", icon: Puzzle, label: "MCP Server" }
];

export const secondaryNavItems: AppNavItem[] = [
  { id: "archive", icon: Archive, label: "归档" },
  { id: "settings", icon: Settings, label: "设置" }
];

export const overflowNavItems: OverflowNavItem[] = [
  { icon: LayoutTemplate, label: "最近模板" },
  { icon: Users, label: "团队空间" },
  { icon: GitBranch, label: "实验面板" }
];

export const statusLabel: Record<ProjectTreeConversation["status"], string> = {
  completed: "已完成",
  error: "异常",
  running: "运行中"
};

export const statusIconMap: Record<ProjectTreeConversation["status"], LucideIcon> = {
  completed: CircleCheck,
  error: AlertTriangle,
  running: LoaderCircle
};
