import { useState, type ReactNode } from "react";

import { DesktopShell } from "@renderer/components/layout/desktop-shell";
import { SidebarNav } from "@renderer/components/layout/sidebar-nav";
import type { AppNavItemId, ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import type { ThemeId } from "@renderer/components/primitives/theme-switcher";

type AppShellProps = {
  activeNav: AppNavItemId | null;
  children: ReactNode;
  onNavigate: (item: AppNavItemId) => void;
  onReturnHome: () => void;
  onSelectConversation: (conversationId: string) => void;
  projectTree: ProjectTreeData;
  selectedConversationId: string | null;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
};

export function AppShell({
  activeNav,
  children,
  onNavigate,
  onReturnHome,
  onSelectConversation,
  projectTree,
  selectedConversationId,
  onThemeChange,
  theme
}: AppShellProps): JSX.Element {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <DesktopShell
      mobileLabel="HOME"
      mobileSubtitle="Home workspace"
      onThemeChange={onThemeChange}
      sidebar={
        <SidebarNav
          activeNav={activeNav}
          isExpanded={isSidebarExpanded}
          onExpandChange={setIsSidebarExpanded}
          onNavigate={onNavigate}
          onReturnHome={onReturnHome}
          onSelectConversation={onSelectConversation}
          projectTree={projectTree}
          selectedConversationId={selectedConversationId}
        />
      }
      theme={theme}
    >
      {children}
    </DesktopShell>
  );
}
