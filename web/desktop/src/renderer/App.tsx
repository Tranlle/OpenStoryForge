import { useMemo, useState } from "react";

import { AppShell } from "@renderer/components/layout/app-shell";
import { buildProjectTree, createConversationRecord, mockConversations } from "@renderer/features/home/home.data";
import { HomePage } from "@renderer/features/home/home-page";
import type { CreateConversationInput } from "@renderer/features/home/home.types";
import { useThemeState } from "@renderer/use-theme-state";
import { useWorkspaceState } from "@renderer/use-workspace-state";

export function App(): JSX.Element {
  const { setTheme, theme } = useThemeState();
  const [conversations, setConversations] = useState(mockConversations);
  const { activeNav, handleNavigate, handleOpenConversation, selectedConversation, selectedConversationId, workspaceMode } =
    useWorkspaceState(conversations);

  const projectTree = useMemo(() => buildProjectTree(conversations), [conversations]);

  const handleCreateConversation = (input: CreateConversationInput): void => {
    const nextConversation = createConversationRecord(input);

    setConversations((current) => [nextConversation, ...current]);
    handleOpenConversation(nextConversation.id);
  };

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={handleNavigate}
      onSelectConversation={handleOpenConversation}
      projectTree={projectTree}
      selectedConversationId={selectedConversationId}
      theme={theme}
      onThemeChange={setTheme}
    >
      <HomePage
        conversation={selectedConversation}
        onCreateConversation={handleCreateConversation}
        workspaceMode={workspaceMode}
      />
    </AppShell>
  );
}
