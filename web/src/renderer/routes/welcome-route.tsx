import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { DesktopShell } from "@renderer/components/layout/desktop-shell";
import { useI18n } from "@renderer/i18n/use-i18n";
import { getPathLeaf } from "@renderer/features/workspace/workspace.data";
import { WelcomePage } from "@renderer/features/welcome/welcome-page";
import { WelcomeSidebar, type WelcomeProjectTreeData, type WelcomeSectionId } from "@renderer/features/welcome/welcome-sidebar";
import { useShortcutHandlers } from "@renderer/shortcuts/use-shortcut-handler";
import { useAppState } from "@renderer/state/app-state";
import { useThemeState } from "@renderer/state/theme-state";

export function WelcomeRoute(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setTheme, theme, toggleTheme } = useThemeState();
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

  const handleFetchProjectTree = async (projectId: string): Promise<WelcomeProjectTreeData> => {
    const project = allProjects.find((item) => item.id === projectId);

    if (!project) {
      return {
        conversations: [],
        folderName: t("common.noLinkedFolder"),
        name: ""
      };
    }

    const projectTasks = allTasks
      .filter((task) => task.projectId === project.id)
      .sort((left, right) => right.modifiedAtTs - left.modifiedAtTs);

    await new Promise((resolve) => window.setTimeout(resolve, 180));

    return {
      conversations: projectTasks.map((task) => ({
        id: task.id,
        modifiedAt: task.modifiedAt,
        status: task.status,
        title: task.title
      })),
      folderName: getPathLeaf(project.linkedFolders[0] ?? "") || t("common.noLinkedFolder"),
      name: project.name
    };
  };

  useShortcutHandlers("welcome", {
    "app.gotoHome": () => navigate("/home"),
    "app.gotoWelcome": () => navigate("/welcome"),
    "app.toggleTheme": toggleTheme,
    "welcome.projects": () => setActiveWelcomeSection("projects"),
    "welcome.quickStart": () => setActiveWelcomeSection("quick-start"),
    "welcome.settings": () => setActiveWelcomeSection("settings"),
    "welcome.tokens": () => setActiveWelcomeSection("tokens")
  });

  return (
    <DesktopShell
      mobileLabel={t("shell.welcomeMobileLabel")}
      mobileSubtitle={t("shell.welcomeMobileSubtitle")}
      onThemeChange={setTheme}
      sidebar={
        <WelcomeSidebar
          activeSection={activeWelcomeSection}
          fetchProjectTree={handleFetchProjectTree}
          isExpanded={isWelcomeSidebarExpanded}
          onOpenTask={handleOpenTask}
          onExpandChange={setIsWelcomeSidebarExpanded}
          onSelectSection={setActiveWelcomeSection}
          recentProjects={recentProjects}
        />
      }
      theme={theme}
    >
      <WelcomePage
        activeSection={activeWelcomeSection}
        onOpenTask={handleOpenTask}
        onQuickStart={handleQuickStart}
        projects={allProjects}
        tasks={allTasks}
        tokenUsageSummary={tokenUsageSummary}
      />
    </DesktopShell>
  );
}
