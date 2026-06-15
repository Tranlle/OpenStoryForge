import { useState } from "react";

import {
  ComposerControlsRow,
  ComposerDivider,
  FolderDialog,
  InputComposerContainer,
  QuickPromptTags
} from "@renderer/features/home/composer-ui";
import { conversationRailClass, welcomeCopy } from "@renderer/features/home/composer-options";
import { quickPromptPlaceholders } from "@renderer/features/home/home.data";
import type { CreateConversationInput } from "@renderer/features/home/home.types";
import { useComposerControls } from "@renderer/features/home/use-composer-controls";
import { cn } from "@renderer/lib/utils";

export function NewConversationWorkspace({
  onCreateConversation
}: {
  onCreateConversation: (input: CreateConversationInput) => void;
  workspaceMode: "conversation" | "new-conversation";
}): JSX.Element {
  const [draft, setDraft] = useState("");
  const controls = useComposerControls({
    existingFolderPath: "D:/Stories/悬疑视觉小说"
  });

  const canSubmit = draft.trim().length > 0;

  const handleSubmit = (): void => {
    if (!canSubmit) {
      return;
    }

    onCreateConversation({
      folderLabel: controls.selectedFolderLabel,
      folderPath: controls.existingFolderPath,
      modelId: controls.selectedModelId,
      presetLabel: controls.selectedPresetLabel,
      prompt: draft,
      reasoningLevel: controls.selectedReasoningLevel
    });

    setDraft("");
  };

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col bg-surface/10 px-6 py-8 md:px-10">
      <div className="flex h-full w-full flex-col justify-center">
        <div className={cn(conversationRailClass, "mb-10")} data-home-hero data-reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-surface/18 px-4 py-2 text-sm text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.16)]">
              {welcomeCopy.eyebrow}
            </div>
            <h1 className="mt-6 whitespace-pre-line font-display text-4xl font-black tracking-tight md:text-5xl">
              {welcomeCopy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{welcomeCopy.description}</p>
          </div>
        </div>

        <div className={conversationRailClass} data-reveal>
          <InputComposerContainer data-home-composer>
            <textarea
              className="min-h-[160px] w-full resize-none bg-transparent px-1 py-2 text-base leading-7 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="例如：我想创建一个赛博悬疑视觉小说，先梳理世界观、角色关系和前三章结构。"
              rows={6}
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
              onSubmit={handleSubmit}
              onToggleMenu={(menu) => controls.setOpenMenu((current) => (current === menu ? null : menu))}
              openMenu={controls.openMenu}
              reasoningLevels={controls.reasoningLevels}
              selectedFolderLabel={controls.selectedFolderLabel}
              selectedModelLabel={controls.selectedModelLabel}
              selectedPresetLabel={controls.selectedPresetLabel}
              selectedReasoningLevel={controls.selectedReasoningLevel}
              submitDisabled={!canSubmit}
            />
          </InputComposerContainer>

          <QuickPromptTags onPromptClick={(prompt) => setDraft(prompt.summary)} prompts={quickPromptPlaceholders} />
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

