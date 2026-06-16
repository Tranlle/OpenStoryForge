import { NewConversationWorkspace } from "@renderer/features/home/new-conversation-workspace";
import { ConversationWorkspace } from "@renderer/features/home/conversation-workspace";
import { useHomePageMotion } from "@renderer/features/home/use-home-page-motion";
import type { ConversationRecord, CreateConversationInput } from "@renderer/features/home/home.types";
import { cn } from "@renderer/lib/utils";

type HomePageProps = {
  conversation: ConversationRecord;
  currentProjectName?: string;
  onCreateConversation: (input: CreateConversationInput) => void;
  workspaceMode: "conversation" | "new-conversation";
};

export function HomePage({ conversation, currentProjectName, onCreateConversation, workspaceMode }: HomePageProps): JSX.Element {
  const { conversationLayerRef, displayMode, isTransitioning, rootRef, welcomeLayerRef } = useHomePageMotion({
    conversationId: conversation.id,
    workspaceMode
  });

  const showWelcomeLayer = isTransitioning || displayMode === "new-conversation";
  const showConversationLayer = isTransitioning || displayMode === "conversation";

  return (
    <div ref={rootRef} className="relative h-full min-h-[720px] overflow-hidden">
      <div
        ref={welcomeLayerRef}
        aria-hidden={!showWelcomeLayer}
        className={cn("absolute inset-0", showWelcomeLayer ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}
      >
        <NewConversationWorkspace
          currentProjectName={currentProjectName}
          onCreateConversation={onCreateConversation}
          workspaceMode={workspaceMode}
        />
      </div>

      <div
        ref={conversationLayerRef}
        aria-hidden={!showConversationLayer}
        className={cn(
          "absolute inset-0",
          showConversationLayer ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <ConversationWorkspace conversation={conversation} key={conversation.id} />
      </div>
    </div>
  );
}
