import { Settings2 } from "lucide-react";
import { useState } from "react";

import { ProjectDrawer } from "@renderer/features/home/project-drawer";
import { ConversationMarkdown } from "@renderer/features/home/conversation-markdown";
import {
  ComposerControlsRow,
  ComposerDivider,
  FolderDialog,
  IconButton,
  InputComposerContainer
} from "@renderer/features/home/composer-ui";
import { conversationRailClass } from "@renderer/features/home/composer-options";
import type { ConversationMessage, ConversationRecord } from "@renderer/features/home/home.types";
import { useComposerControls } from "@renderer/features/home/use-composer-controls";
import { useProjectDrawerState } from "@renderer/features/home/use-project-drawer-state";
import { cn } from "@renderer/lib/utils";

export function ConversationWorkspace({ conversation }: { conversation: ConversationRecord }): JSX.Element {
  const { activeTab, isDrawerOpen, setActiveTab, toggleDrawer } = useProjectDrawerState();

  return (
    <div className="flex h-full min-h-0 min-w-0 overflow-hidden">
      <AgentWorkspace conversation={conversation} />
      <ProjectDrawer activeTab={activeTab} isOpen={isDrawerOpen} onTabChange={setActiveTab} onToggle={toggleDrawer} />
    </div>
  );
}

function AgentWorkspace({ conversation }: { conversation: ConversationRecord }): JSX.Element {
  const [draft, setDraft] = useState("");
  const controls = useComposerControls({
    existingFolderPath: conversation.projectPath,
    folderBasePath: conversation.projectPath.replace(/[\\/][^\\/]+$/, ""),
    folderLabel: conversation.config.folderLabel,
    folderName: conversation.config.folderLabel,
    modelId: conversation.config.modelLabel,
    presetLabel: conversation.config.presetLabel,
    reasoningLevel: conversation.config.reasoningLevel
  });

  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface/16 shadow-[inset_-1px_0_0_hsl(var(--border)/0.24)]"
      data-reveal
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/45 bg-surface/36 px-4 md:px-6">
        <div className="min-w-0">
          <div className="truncate font-display text-base font-black">{conversation.title}</div>
          <div className="mt-1 truncate text-[11px] leading-4 text-muted">{conversation.projectPath}</div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Agent 设置">
            <Settings2 aria-hidden="true" className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-transparent">
        <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8">
          <div className={cn(conversationRailClass, "space-y-7")} data-conversation-stream>
            {conversation.messages.map((message) => (
              <ConversationMessageBlock key={message.id} message={message} />
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-border/45 bg-surface/28 px-4 py-4 md:px-6">
          <div className={conversationRailClass}>
            <InputComposerContainer data-conversation-composer>
              <textarea
                className="min-h-[96px] w-full resize-none bg-transparent px-1 py-2 text-sm leading-6 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="输入创作目标、剧情设定，或让 Agent 继续分析当前项目..."
                rows={3}
                value={draft}
              />

              <ComposerDivider />

              <ComposerControlsRow
                onFolderCreate={() => {
                  controls.closeMenus();
                  controls.setFolderDialogMode("create");
                }}
                onFolderSelect={() => {
                  controls.closeMenus();
                  controls.setFolderDialogMode("select");
                }}
                onModelSelect={(model) => controls.selectModel(model.id)}
                onPresetSelect={controls.selectPreset}
                onReasoningSelect={controls.selectReasoningLevel}
                onToggleMenu={(menu) => controls.setOpenMenu((current) => (current === menu ? null : menu))}
                openMenu={controls.openMenu}
                reasoningLevels={controls.reasoningLevels}
                selectedFolderLabel={controls.selectedFolderLabel}
                selectedModelLabel={controls.selectedModelLabel}
                selectedPresetLabel={controls.selectedPresetLabel}
                selectedReasoningLevel={controls.selectedReasoningLevel}
              />
            </InputComposerContainer>
          </div>
        </div>
      </div>

      <FolderDialog
        existingFolderPath={controls.existingFolderPath}
        folderBasePath={controls.folderBasePath}
        folderDialogMode={controls.folderDialogMode}
        folderName={controls.folderName}
        onClose={() => controls.setFolderDialogMode(null)}
        onConfirm={controls.completeFolderDialog}
        onExistingFolderPathChange={controls.setExistingFolderPath}
        onFolderBasePathChange={controls.setFolderBasePath}
        onFolderNameChange={controls.setFolderName}
      />
    </section>
  );
}

function ConversationMessageBlock({ message }: { message: ConversationMessage }): JSX.Element {
  if (message.role === "user") {
    return (
      <article className="flex justify-end" data-reveal>
        <div className="max-w-[72%] rounded-[1.35rem] border border-foreground/10 bg-foreground px-4 py-3 text-background shadow-[0_10px_28px_hsl(var(--foreground)/0.05)]">
          <p className="text-sm leading-7">{message.body}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="pr-6" data-reveal>
      <ConversationMarkdown content={message.body} />
    </article>
  );
}
