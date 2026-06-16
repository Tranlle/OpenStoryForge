import type { LucideIcon } from "lucide-react";

export type AppNavItemId =
  | "home"
  | "new-chat"
  | "skills"
  | "tools"
  | "automation"
  | "mcp"
  | "archive"
  | "settings";

export type ProjectTreeConversation = {
  id: string;
  modifiedAt: string;
  status: "completed" | "error" | "running";
  title: string;
};

export type ProjectTreeData = {
  conversations: ProjectTreeConversation[];
  folderName: string;
  name: string;
};

export type AppNavItem = {
  icon: LucideIcon;
  id: AppNavItemId;
  labelKey: string;
};

export type OverflowNavItem = {
  icon: LucideIcon;
  labelKey: string;
};
