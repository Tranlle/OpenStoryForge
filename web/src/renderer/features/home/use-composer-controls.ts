import { useMemo, useState } from "react";

import {
  getModelDisplay,
  modelGroups,
  reasoningLevelsByModel,
  type FolderDialogMode,
  type MenuId,
  type ModelOption
} from "@renderer/features/home/composer-options";
import { useI18n } from "@renderer/i18n/use-i18n";

type ComposerControlsInit = {
  existingFolderPath?: string;
  folderBasePath?: string;
  folderLabel?: string;
  folderName?: string;
  modelId?: string;
  presetLabel?: string;
  reasoningLevel?: string;
};

const defaultFolderBasePath = "D:/Stories";
const defaultFolderName = "new-project-task";
const defaultModelId = "deepseek-v4-flash";
const defaultPresetLabel = "Story Planner Agent";
const defaultReasoningLevel = "None";

export function useComposerControls(initial?: ComposerControlsInit) {
  const { t } = useI18n();
  const defaultFolderLabel = t("composer.selectFolder");
  const [openMenu, setOpenMenu] = useState<MenuId>(null);
  const [folderDialogMode, setFolderDialogMode] = useState<FolderDialogMode>(null);
  const [selectedFolderLabel, setSelectedFolderLabel] = useState(initial?.folderLabel ?? "");
  const [selectedModelId, setSelectedModelId] = useState(initial?.modelId ?? defaultModelId);
  const [selectedPresetLabel, setSelectedPresetLabel] = useState(initial?.presetLabel ?? "");
  const [selectedReasoningLevel, setSelectedReasoningLevel] = useState(initial?.reasoningLevel ?? defaultReasoningLevel);
  const [folderBasePath, setFolderBasePath] = useState(initial?.folderBasePath ?? defaultFolderBasePath);
  const [folderName, setFolderName] = useState(initial?.folderName ?? defaultFolderName);
  const [existingFolderPath, setExistingFolderPath] = useState(
    initial?.existingFolderPath ?? `${defaultFolderBasePath}/${defaultFolderLabel}`
  );

  const selectedModel = useMemo<ModelOption | null>(
    () => modelGroups.flatMap((group) => group.items).find((model) => model.id === selectedModelId) ?? null,
    [selectedModelId]
  );

  const reasoningLevels = reasoningLevelsByModel[selectedModelId] ?? [defaultReasoningLevel];

  const closeMenus = (): void => setOpenMenu(null);

  const selectModel = (modelId: string): void => {
    setSelectedModelId(modelId);
    setSelectedReasoningLevel(defaultReasoningLevel);
    closeMenus();
  };

  const selectPreset = (label: string): void => {
    setSelectedPresetLabel(label);
    closeMenus();
  };

  const selectReasoningLevel = (level: string): void => {
    setSelectedReasoningLevel(level);
    closeMenus();
  };

  const completeFolderDialog = (): void => {
    if (folderDialogMode === "create") {
      const nextPath = `${folderBasePath.replace(/[\\/]+$/, "")}/${folderName}`;
      setSelectedFolderLabel(folderName);
      setExistingFolderPath(nextPath);
    } else if (folderDialogMode === "select") {
      const nextFolderName = existingFolderPath.split(/[\\/]/).filter(Boolean).at(-1) ?? defaultFolderLabel;
      setSelectedFolderLabel(nextFolderName);
    }

    setFolderDialogMode(null);
  };

  return {
    closeMenus,
    completeFolderDialog,
    existingFolderPath,
    folderBasePath,
    folderDialogMode,
    folderName,
    openMenu,
    reasoningLevels,
    selectedFolderLabel: selectedFolderLabel || defaultFolderLabel,
    selectedModel,
    selectedModelId,
    selectedModelLabel: selectedModel ? getModelDisplay(selectedModel) : t("composer.selectModel"),
    selectedPresetLabel: selectedPresetLabel || defaultPresetLabel,
    selectedReasoningLevel,
    selectModel,
    selectPreset,
    selectReasoningLevel,
    setExistingFolderPath,
    setFolderBasePath,
    setFolderDialogMode,
    setFolderName,
    setOpenMenu
  };
}
