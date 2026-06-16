import { useEffect, useMemo, useState } from "react";

import type { AppNavItemId } from "@renderer/components/layout/app-shell.types";
import type { ConversationRecord } from "@renderer/features/home/home.types";

export type WorkspaceMode = "conversation" | "new-conversation";
export type SidebarSelectionMode = "conversation" | "nav";

export function useWorkspaceState(
  conversations: ConversationRecord[],
  externalSelectedConversationId?: string | null
): {
  activeNav: AppNavItemId | null;
  handleNavigate: (item: AppNavItemId) => void;
  handleOpenConversation: (conversationId: string) => void;
  selectedConversation: ConversationRecord;
  selectedConversationId: string | null;
  sidebarSelectionMode: SidebarSelectionMode;
  workspaceMode: WorkspaceMode;
} {
  const [activeNav, setActiveNav] = useState<AppNavItemId>("new-chat");
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>("new-conversation");
  const [selectedConversationId, setSelectedConversationId] = useState(
    externalSelectedConversationId ?? conversations[0]?.id ?? ""
  );
  const [sidebarSelectionMode, setSidebarSelectionMode] = useState<SidebarSelectionMode>("nav");

  useEffect(() => {
    if (conversations.length === 0) {
      return;
    }

    const hasSelectedConversation = conversations.some((conversation) => conversation.id === selectedConversationId);

    if (!hasSelectedConversation) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (!externalSelectedConversationId || externalSelectedConversationId === selectedConversationId) {
      return;
    }

    setSelectedConversationId(externalSelectedConversationId);
    setSidebarSelectionMode("conversation");
    setWorkspaceMode("conversation");
  }, [externalSelectedConversationId, selectedConversationId]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? conversations[0],
    [conversations, selectedConversationId]
  );

  const handleNavigate = (item: AppNavItemId): void => {
    setActiveNav(item);
    setSidebarSelectionMode("nav");

    if (item === "new-chat") {
      setWorkspaceMode("new-conversation");
    }
  };

  const handleOpenConversation = (conversationId: string): void => {
    setSelectedConversationId(conversationId);
    setSidebarSelectionMode("conversation");
    setWorkspaceMode("conversation");
  };

  return {
    activeNav: sidebarSelectionMode === "nav" ? activeNav : null,
    handleNavigate,
    handleOpenConversation,
    selectedConversation,
    selectedConversationId: sidebarSelectionMode === "conversation" ? selectedConversationId : null,
    sidebarSelectionMode,
    workspaceMode
  };
}
