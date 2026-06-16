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
  folderName: string;
  name: string;
  conversations: ProjectTreeConversation[];
};

export type AppNavItem = {
  id: AppNavItemId;
  icon: LucideIcon;
  label: string;
};

export type OverflowNavItem = {
  icon: LucideIcon;
  label: string;
};
