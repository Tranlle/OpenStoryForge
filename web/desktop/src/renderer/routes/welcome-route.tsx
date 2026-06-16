import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DesktopShell } from "@renderer/components/layout/desktop-shell";
import { WelcomePage } from "@renderer/features/welcome/welcome-page";
import { WelcomeSidebar, type WelcomeSectionId } from "@renderer/features/welcome/welcome-sidebar";
import { useAppState } from "@renderer/state/app-state";
import { useThemeState } from "@renderer/state/theme-state";

export function WelcomeRoute(): JSX.Element {
  const navigate = useNavigate();
  const { setTheme, theme } = useThemeState();
  const [activeWelcomeSection, setActiveWelcomeSection] = useState<WelcomeSectionId>("quick-start");
  const [isWelcomeSidebarExpanded, setIsWelcomeSidebarExpanded] = useState(true);
  const { allProjects, allTasks, createQuickStartTask, openTask, recentProjects, tokenUsageSummary } = useAppState();

  const handleOpenTask = (taskId: string): void => {
    openTask(taskId);
    navigate("/home");
  };

  const handleQuickStart = (input: Parameters<typeof createQuickStartTask>[0]): void => {
    createQuickStartTask(input);
    navigate("/home");
  };

  return (
    <DesktopShell
      mobileLabel="WELCOME"
      mobileSubtitle="Project-first entry"
      onThemeChange={setTheme}
      sidebar={
        <WelcomeSidebar
          activeSection={activeWelcomeSection}
          isExpanded={isWelcomeSidebarExpanded}
          onExpandChange={setIsWelcomeSidebarExpanded}
          onSelectSection={setActiveWelcomeSection}
        />
      }
      theme={theme}
    >
      <WelcomePage
        activeSection={activeWelcomeSection}
        onOpenTask={handleOpenTask}
        onQuickStart={handleQuickStart}
        projects={activeWelcomeSection === "project-tree" ? recentProjects : allProjects}
        tasks={allTasks}
        tokenUsageSummary={tokenUsageSummary}
      />
    </DesktopShell>
  );
}
