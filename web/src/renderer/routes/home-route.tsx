import { Navigate, useNavigate } from "react-router-dom";

import { AppShell } from "@renderer/components/layout/app-shell";
import { HomePage } from "@renderer/features/home/home-page";
import type { CreateConversationInput } from "@renderer/features/home/home.types";
import { useShortcutHandlers } from "@renderer/shortcuts/use-shortcut-handler";
import { useAppState } from "@renderer/state/app-state";
import { useThemeState } from "@renderer/state/theme-state";
import { useWorkspaceState } from "@renderer/state/workspace-state";

export function HomeRoute(): JSX.Element {
  const navigate = useNavigate();
  const { setTheme, theme, toggleTheme } = useThemeState();
  const {
    createTaskInCurrentProject,
    currentProject,
    currentProjectTasks,
    currentTask,
    homeProjectTree,
    openTask
  } = useAppState();
  const workspaceState = useWorkspaceState(currentProjectTasks, currentTask?.id ?? null);

  const handleOpenTask = (taskId: string): void => {
    openTask(taskId);
    workspaceState.handleOpenConversation(taskId);
    navigate("/home");
  };

  const handleCreateConversation = (input: CreateConversationInput): void => {
    const task = createTaskInCurrentProject(input);

    if (!task) {
      return;
    }

    workspaceState.handleOpenConversation(task.id);
  };

  const handleReturnToWelcome = (): void => {
    navigate("/welcome");
  };

  useShortcutHandlers("home", {
    "app.gotoHome": () => navigate("/home"),
    "app.gotoWelcome": handleReturnToWelcome,
    "app.toggleTheme": toggleTheme,
    "home.newConversation": () => workspaceState.handleNavigate("new-chat"),
    "home.returnWelcome": handleReturnToWelcome
  });

  const projectTree = homeProjectTree;
  const conversation = currentTask ?? currentProjectTasks[0];

  if (!projectTree || !conversation || !currentProject) {
    return <Navigate replace to="/welcome" />;
  }

  return (
    <AppShell
      activeNav={workspaceState.activeNav}
      onNavigate={workspaceState.handleNavigate}
      onReturnHome={handleReturnToWelcome}
      onSelectConversation={handleOpenTask}
      projectTree={projectTree}
      selectedConversationId={workspaceState.selectedConversationId}
      theme={theme}
      onThemeChange={setTheme}
    >
      <HomePage
        conversation={conversation}
        currentProjectName={currentProject.name}
        onCreateConversation={handleCreateConversation}
        workspaceMode={workspaceState.workspaceMode}
      />
    </AppShell>
  );
}
