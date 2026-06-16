import { useState } from "react";

import type { ProjectTabId } from "@renderer/features/home/home.types";

export function useProjectDrawerState(): {
  activeTab: ProjectTabId;
  isDrawerOpen: boolean;
  setActiveTab: (tab: ProjectTabId) => void;
  toggleDrawer: () => void;
} {
  const [activeTab, setActiveTab] = useState<ProjectTabId>("directory");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return {
    activeTab,
    isDrawerOpen,
    setActiveTab,
    toggleDrawer: () => setIsDrawerOpen((current) => !current)
  };
}
