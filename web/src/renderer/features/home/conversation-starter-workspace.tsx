import type { ReactNode } from "react";

import {
  ComposerControlsRow,
  ComposerDivider,
  InputComposerContainer,
  QuickPromptTags
} from "@renderer/features/home/composer-ui";
import { conversationRailClass, type WelcomeCopy } from "@renderer/features/home/composer-options";
import { quickPromptPlaceholders } from "@renderer/features/home/home.data";
import type { QuickPrompt } from "@renderer/features/home/home.types";
import type { useComposerControls } from "@renderer/features/home/use-composer-controls";
import { cn } from "@renderer/lib/utils";

type ConversationStarterWorkspaceProps = {
  canSubmit: boolean;
  controls: ReturnType<typeof useComposerControls>;
  copy: WelcomeCopy;
  draft: string;
  onDraftChange: (value: string) => void;
  onPromptClick?: (prompt: QuickPrompt) => void;
  onSubmit: () => void;
  projectField?: ReactNode;
  promptPlaceholder: string;
  submitLabel?: string;
};

export function ConversationStarterWorkspace({
  canSubmit,
  controls,
  copy,
  draft,
  onDraftChange,
  onPromptClick,
  onSubmit,
  projectField,
  promptPlaceholder,
  submitLabel
}: ConversationStarterWorkspaceProps): JSX.Element {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col bg-surface/10 px-6 py-8 md:px-10">
      <div className="flex h-full w-full flex-col justify-center">
        <div className={cn(conversationRailClass, "mb-10")} data-home-hero data-reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-surface/18 px-4 py-2 text-sm text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.16)]">
              {copy.eyebrow}
            </div>
            <h1 className="mt-6 whitespace-pre-line font-display text-4xl font-black tracking-tight md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{copy.description}</p>
          </div>
        </div>

        <div className={conversationRailClass} data-reveal>
          <InputComposerContainer data-home-composer>
            {projectField ? (
              <>
                <div className="px-1 py-1">{projectField}</div>
                <ComposerDivider />
              </>
            ) : null}

            <textarea
              className="min-h-[160px] w-full resize-none bg-transparent px-1 py-2 text-base leading-7 outline-none ring-0 placeholder:text-muted focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder={promptPlaceholder}
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
              onSubmit={onSubmit}
              onToggleMenu={(menu) => controls.setOpenMenu((current) => (current === menu ? null : menu))}
              openMenu={controls.openMenu}
              reasoningLevels={controls.reasoningLevels}
              selectedFolderLabel={controls.selectedFolderLabel}
              selectedModelLabel={controls.selectedModelLabel}
              selectedPresetLabel={controls.selectedPresetLabel}
              selectedReasoningLevel={controls.selectedReasoningLevel}
              submitDisabled={!canSubmit}
              submitLabel={submitLabel}
            />
          </InputComposerContainer>

          <QuickPromptTags
            onPromptClick={onPromptClick ?? ((prompt) => onDraftChange(prompt.summary))}
            prompts={quickPromptPlaceholders}
          />
        </div>
      </div>
    </section>
  );
}
