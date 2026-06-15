import { Folder, SendHorizontal, SlidersHorizontal, X } from "lucide-react";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";

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
            <span className="mx-2 text-muted/50">·</span>
            <span>{prompt.summary}</span>
          </span>
        </button>
      ))}
    </div>
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
  onFolderNameChange
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
}): JSX.Element | null {
  if (!folderDialogMode) {
    return null;
  }

  return (
    <DialogBackdrop onClose={onClose}>
      <div className="rounded-[1.6rem] bg-surface p-5 shadow-[0_12px_32px_hsl(var(--foreground)/0.028)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl font-black">
              {folderDialogMode === "create" ? "新建项目任务文件夹" : "选定任务文件夹"}
            </div>
            <div className="mt-2 text-sm leading-6 text-muted">
              {folderDialogMode === "create"
                ? "这里先用前端示例占位，后续会改成调用后端接口创建任务目录。"
                : "这里先用前端示例占位，后续会改成调用后端接口选择已有任务目录。"}
            </div>
          </div>
          <button
            aria-label="关闭弹窗"
            className="grid h-9 w-9 place-items-center rounded-xl bg-background/30 text-muted transition hover:bg-background/50 hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field>
            <FieldLabel>{folderDialogMode === "create" ? "父级路径" : "文件夹路径"}</FieldLabel>
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
              <FieldLabel>文件夹名</FieldLabel>
              <FieldInput onChange={(event) => onFolderNameChange(event.target.value)} value={folderName} />
            </Field>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="ghost">
            取消
          </Button>
          <Button onClick={onConfirm} type="button">
            {folderDialogMode === "create" ? "创建文件夹" : "选择文件夹"}
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
  submitLabel = "发送"
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
            <MenuAction label="新建项目任务文件夹" onClick={onFolderCreate} />
            <MenuAction label="选定任务文件夹" onClick={onFolderSelect} />
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
          aria-label="Agent 运行模式"
          className="grid h-[50px] w-[50px] place-items-center rounded-2xl bg-surface/16 text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.14)] transition hover:bg-surface/22 hover:text-foreground"
          onClick={onModeClick}
          title="Agent 运行模式"
          type="button"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : (
        <IconButton label="Agent 运行模式">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
        </IconButton>
      )}

      <Button className="h-11 rounded-2xl px-4 text-sm" disabled={submitDisabled} onClick={onSubmit} type="button">
        <SendHorizontal aria-hidden="true" className="h-4 w-4" />
        {submitLabel}
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

function FieldLabel({ children }: { children: ReactNode }): JSX.Element {
  return <div className="text-sm font-medium text-foreground">{children}</div>;
}

function FieldInput({
  onChange,
  value
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}): JSX.Element {
  return (
    <input
      className="h-12 w-full rounded-2xl bg-background/34 px-4 text-sm outline-none shadow-[inset_0_0_0_1px_hsl(var(--border)/0.2)] placeholder:text-muted"
      onChange={onChange}
      value={value}
    />
  );
}
