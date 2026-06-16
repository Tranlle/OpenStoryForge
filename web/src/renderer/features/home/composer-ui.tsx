import { Folder, SendHorizontal, SlidersHorizontal, X } from "lucide-react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";

import { useI18n } from "@renderer/i18n/use-i18n";
import { Button } from "@renderer/components/primitives/button";
import {
  getModelDisplay,
  modelGroups,
  presetGroups,
  type FolderDialogMode,
  type GroupedModels,
  type GroupedOptions,
  type ModelOption
} from "@renderer/features/home/composer-options";
import type { QuickPrompt } from "@renderer/features/home/home.types";
import { cn } from "@renderer/lib/utils";

export function InputComposerContainer({
  children,
  ...props
}: ComponentProps<"div"> & {
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      {...props}
      className={cn(
        "rounded-[1.85rem] bg-surface/[0.08] px-4 py-3 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.14)] transition-[box-shadow,background-color] duration-200 focus-within:bg-surface/[0.1] focus-within:shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.34),0_0_0_1px_hsl(var(--accent)/0.1)]",
        props.className
      )}
    >
      {children}
    </div>
  );
}

export function ComposerDivider(): JSX.Element {
  return <div className="my-3 border-t border-white/[0.06] dark:border-white/[0.045]" />;
}

export function SelectionButton({
  active,
  children,
  icon: Icon,
  label,
  onClick
}: {
  active?: boolean;
  children?: ReactNode;
  icon?: typeof Folder;
  label: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <div className="relative">
      <button
        className={cn(
          "inline-flex min-w-[148px] items-center gap-3 rounded-2xl bg-surface/16 px-4 py-3 text-left text-sm font-medium shadow-[inset_0_0_0_1px_hsl(var(--border)/0.14)] transition hover:bg-surface/22",
          active && "bg-surface/22 shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.12)]"
        )}
        onClick={onClick}
        type="button"
      >
        {Icon ? <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" /> : null}
        <span className="truncate">{label}</span>
      </button>
      {children}
    </div>
  );
}

export function IconButton({ children, label }: { children: ReactNode; label: string }): JSX.Element {
  return (
    <button
      aria-label={label}
      className="grid h-[50px] w-[50px] place-items-center rounded-2xl bg-surface/16 text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.14)] transition hover:bg-surface/22 hover:text-foreground"
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

export function OptionMenu({
  align = "left",
  children
}: {
  align?: "left" | "right";
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      className={cn(
        "absolute top-[calc(100%+10px)] z-30 max-h-[min(360px,calc(100vh-220px))] min-w-[240px] overflow-y-auto rounded-[1.2rem] bg-surface p-2 shadow-[0_10px_24px_hsl(var(--foreground)/0.02)]",
        align === "left" ? "left-0" : "right-0"
      )}
    >
      {children}
    </div>
  );
}

export function MenuAction({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      className="flex w-full items-center rounded-xl px-3 py-2 text-left text-[13px] text-foreground transition hover:bg-background/36"
      onClick={onClick}
      type="button"
    >
      <span className="truncate">{label}</span>
    </button>
  );
}

export function GroupedModelMenu({
  groups = modelGroups,
  onSelect
}: {
  groups?: GroupedModels[];
  onSelect: (model: ModelOption) => void;
}): JSX.Element {
  return (
    <OptionMenu align="right">
      <div className="space-y-1">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <MenuAction key={item.id} label={getModelDisplay(item)} onClick={() => onSelect(item)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </OptionMenu>
  );
}

export function GroupedLabelMenu({
  groups = presetGroups,
  onSelect
}: {
  groups?: GroupedOptions[];
  onSelect: (label: string) => void;
}): JSX.Element {
  return (
    <OptionMenu>
      <div className="space-y-1">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <MenuAction key={item.id} label={item.label} onClick={() => onSelect(item.label)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </OptionMenu>
  );
}

export function QuickPromptTags({
  prompts,
  onPromptClick
}: {
  onPromptClick: (prompt: QuickPrompt) => void;
  prompts: QuickPrompt[];
}): JSX.Element {
  return (
    <div className="mt-4 flex flex-wrap gap-2.5 px-1" data-home-prompts>
      {prompts.map((prompt) => (
        <button
          className="inline-flex max-w-full items-center rounded-full bg-surface/14 px-4 py-2 text-left text-xs text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.14)] transition hover:bg-surface/22 hover:text-foreground"
          key={prompt.id}
          onClick={() => onPromptClick(prompt)}
          title={prompt.summary}
          type="button"
        >
          <span className="truncate">
            <span className="font-semibold text-foreground/92">{prompt.title}</span>
            <span className="mx-2 text-muted/50">/</span>
            <span>{prompt.summary}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export function ProjectNameInput({
  helpText,
  label,
  listId,
  onChange,
  readOnly = false,
  suggestions = [],
  value
}: {
  helpText?: string;
  label: string;
  listId?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  suggestions?: string[];
  value: string;
}): JSX.Element {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput
        listId={readOnly ? undefined : listId}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        value={value}
      />
      {helpText ? <FieldHelp>{helpText}</FieldHelp> : null}
      {listId ? (
        <datalist id={listId}>
          {suggestions.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      ) : null}
    </Field>
  );
}

export function FolderDialog({
  existingFolderPath,
  folderBasePath,
  folderDialogMode,
  folderName,
  onClose,
  onConfirm,
  onExistingFolderPathChange,
  onFolderBasePathChange,
  onFolderNameChange,
  onProjectNameChange,
  projectInputMode = "hidden",
  projectName = "",
  projectSuggestions = []
}: {
  existingFolderPath: string;
  folderBasePath: string;
  folderDialogMode: FolderDialogMode;
  folderName: string;
  onClose: () => void;
  onConfirm: () => void;
  onExistingFolderPathChange: (value: string) => void;
  onFolderBasePathChange: (value: string) => void;
  onFolderNameChange: (value: string) => void;
  onProjectNameChange?: (value: string) => void;
  projectInputMode?: "editable" | "hidden" | "readonly";
  projectName?: string;
  projectSuggestions?: string[];
}): JSX.Element | null {
  const { t } = useI18n();

  if (!folderDialogMode) {
    return null;
  }

  const showProjectField = projectInputMode !== "hidden";

  return (
    <DialogBackdrop onClose={onClose}>
      <div className="rounded-[1.6rem] bg-surface p-5 shadow-[0_12px_32px_hsl(var(--foreground)/0.028)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl font-black">
              {folderDialogMode === "create" ? t("composer.dialog.createTitle") : t("composer.dialog.selectTitle")}
            </div>
            <div className="mt-2 text-sm leading-6 text-muted">{t("composer.dialog.description")}</div>
          </div>
          <button
            aria-label={t("composer.dialog.close")}
            className="grid h-9 w-9 place-items-center rounded-xl bg-background/30 text-muted transition hover:bg-background/50 hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {showProjectField ? (
            <ProjectNameInput
              helpText={
                projectInputMode === "readonly" ? t("composer.dialog.projectReadonly") : t("composer.dialog.projectEditable")
              }
              label={t("common.project")}
              listId="folder-dialog-project-options"
              onChange={(value) => onProjectNameChange?.(value)}
              readOnly={projectInputMode === "readonly"}
              suggestions={projectSuggestions}
              value={projectName}
            />
          ) : null}

          <Field>
            <FieldLabel>{folderDialogMode === "create" ? t("composer.dialog.basePath") : t("composer.dialog.folderPath")}</FieldLabel>
            <FieldInput
              onChange={(event) =>
                folderDialogMode === "create"
                  ? onFolderBasePathChange(event.target.value)
                  : onExistingFolderPathChange(event.target.value)
              }
              value={folderDialogMode === "create" ? folderBasePath : existingFolderPath}
            />
          </Field>

          {folderDialogMode === "create" ? (
            <Field>
              <FieldLabel>{t("composer.dialog.folderName")}</FieldLabel>
              <FieldInput onChange={(event) => onFolderNameChange(event.target.value)} value={folderName} />
            </Field>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="ghost">
            {t("common.cancel")}
          </Button>
          <Button onClick={onConfirm} type="button">
            {folderDialogMode === "create" ? t("composer.dialog.createAction") : t("composer.dialog.selectAction")}
          </Button>
        </div>
      </div>
    </DialogBackdrop>
  );
}

export function ComposerControlsRow({
  onFolderCreate,
  onFolderSelect,
  onModelSelect,
  onModeClick,
  onPresetSelect,
  onReasoningSelect,
  onSubmit,
  onToggleMenu,
  openMenu,
  reasoningLevels,
  selectedFolderLabel,
  selectedModelLabel,
  selectedPresetLabel,
  selectedReasoningLevel,
  submitDisabled = false,
  submitLabel
}: {
  onFolderCreate: () => void;
  onFolderSelect: () => void;
  onModeClick?: () => void;
  onPresetSelect: (label: string) => void;
  onModelSelect: (model: ModelOption) => void;
  onReasoningSelect: (level: string) => void;
  onSubmit?: () => void;
  onToggleMenu: (menu: "folder" | "model" | "preset" | "reasoning") => void;
  openMenu: "folder" | "model" | "preset" | "reasoning" | null;
  reasoningLevels: string[];
  selectedFolderLabel: string;
  selectedModelLabel: string;
  selectedPresetLabel: string;
  selectedReasoningLevel: string;
  submitDisabled?: boolean;
  submitLabel?: string;
}): JSX.Element {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SelectionButton
        active={openMenu === "folder"}
        icon={Folder}
        label={selectedFolderLabel}
        onClick={() => onToggleMenu("folder")}
      >
        {openMenu === "folder" ? (
          <OptionMenu>
            <MenuAction label={t("composer.createAndSpecifyFolder")} onClick={onFolderCreate} />
            <MenuAction label={t("composer.selectExistingFolder")} onClick={onFolderSelect} />
          </OptionMenu>
        ) : null}
      </SelectionButton>

      <SelectionButton
        active={openMenu === "preset"}
        label={selectedPresetLabel}
        onClick={() => onToggleMenu("preset")}
      >
        {openMenu === "preset" ? <GroupedLabelMenu onSelect={onPresetSelect} /> : null}
      </SelectionButton>

      <div className="flex-1" />

      <SelectionButton
        active={openMenu === "model"}
        label={selectedModelLabel}
        onClick={() => onToggleMenu("model")}
      >
        {openMenu === "model" ? <GroupedModelMenu onSelect={onModelSelect} /> : null}
      </SelectionButton>

      <SelectionButton
        active={openMenu === "reasoning"}
        label={selectedReasoningLevel}
        onClick={() => onToggleMenu("reasoning")}
      >
        {openMenu === "reasoning" ? (
          <OptionMenu align="right">
            {reasoningLevels.map((level) => (
              <MenuAction key={level} label={level} onClick={() => onReasoningSelect(level)} />
            ))}
          </OptionMenu>
        ) : null}
      </SelectionButton>

      {onModeClick ? (
        <button
          aria-label={t("composer.agentMode")}
          className="grid h-[50px] w-[50px] place-items-center rounded-2xl bg-surface/16 text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.14)] transition hover:bg-surface/22 hover:text-foreground"
          onClick={onModeClick}
          title={t("composer.agentMode")}
          type="button"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : (
        <IconButton label={t("composer.agentMode")}>
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
        </IconButton>
      )}

      <Button className="h-11 rounded-2xl px-4 text-sm" disabled={submitDisabled} onClick={onSubmit} type="button">
        <SendHorizontal aria-hidden="true" className="h-4 w-4" />
        {submitLabel ?? t("common.send")}
      </Button>
    </div>
  );
}

function DialogBackdrop({ children, onClose }: { children: ReactNode; onClose: () => void }): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/50 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="w-full max-w-xl" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Field({ children }: { children: ReactNode }): JSX.Element {
  return <label className="block space-y-2">{children}</label>;
}

function FieldHelp({ children }: { children: ReactNode }): JSX.Element {
  return <div className="text-xs leading-5 text-muted">{children}</div>;
}

function FieldLabel({ children }: { children: ReactNode }): JSX.Element {
  return <div className="text-sm font-medium text-foreground">{children}</div>;
}

function FieldInput({
  listId,
  onChange,
  readOnly = false,
  value
}: {
  listId?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  value: string;
}): JSX.Element {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl bg-background/34 px-4 text-sm outline-none shadow-[inset_0_0_0_1px_hsl(var(--border)/0.2)] placeholder:text-muted",
        readOnly && "cursor-default text-muted"
      )}
      list={listId}
      onChange={onChange}
      readOnly={readOnly}
      value={value}
    />
  );
}
