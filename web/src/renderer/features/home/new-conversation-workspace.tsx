import { useState } from "react";

import { FolderDialog } from "@renderer/features/home/composer-ui";
import { ConversationStarterWorkspace } from "@renderer/features/home/conversation-starter-workspace";
import type { CreateConversationInput } from "@renderer/features/home/home.types";
import { useComposerControls } from "@renderer/features/home/use-composer-controls";
import { useI18n } from "@renderer/i18n/use-i18n";

export function NewConversationWorkspace({
  currentProjectName,
  onCreateConversation
}: {
  currentProjectName?: string;
  onCreateConversation: (input: CreateConversationInput) => void;
  workspaceMode: "conversation" | "new-conversation";
}): JSX.Element {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const controls = useComposerControls({
    existingFolderPath: "D:/Stories/SuspenseVN"
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
    <>
      <ConversationStarterWorkspace
        canSubmit={canSubmit}
        controls={controls}
        copy={{
          eyebrow: t("starter.eyebrow"),
          title: t("starter.title"),
          description: t("starter.description")
        }}
        draft={draft}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
        promptPlaceholder={t("composer.quickStartPlaceholder")}
      />

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
        projectInputMode="readonly"
        projectName={currentProjectName ?? t("common.currentProject")}
      />
    </>
  );
}
