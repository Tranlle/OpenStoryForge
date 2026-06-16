export type FolderDialogMode = "create" | "select" | null;
export type MenuId = "folder" | "model" | "preset" | "reasoning" | null;

export type ModelOption = {
  id: string;
  name?: string;
  shortName?: string;
};

export type GroupedModels = {
  items: ModelOption[];
  label: string;
};

export type GroupedOptions = {
  items: Array<{ id: string; label: string }>;
  label: string;
};

export const conversationRailClass = "mx-auto w-full max-w-[1040px]";

export const modelGroups: GroupedModels[] = [
  {
    label: "DeepSeek",
    items: [
      { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", shortName: "deepseek-v4-flash" },
      { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", shortName: "deepseek-v4-pro" }
    ]
  },
  {
    label: "OpenAI",
    items: [
      { id: "gpt-5-codex", name: "GPT-5 Codex", shortName: "gpt-5-codex" },
      { id: "gpt-5", name: "GPT-5" }
    ]
  }
];

export const presetGroups: GroupedOptions[] = [
  {
    label: "写作",
    items: [
      { id: "story-planner", label: "故事策划 Agent" },
      { id: "world-builder", label: "世界观构建 Agent" }
    ]
  },
  {
    label: "分析",
    items: [
      { id: "branch-reviewer", label: "分支节奏审校 Agent" },
      { id: "character-analyst", label: "角色关系分析 Agent" }
    ]
  }
];

export const reasoningLevelsByModel: Record<string, string[]> = {
  "deepseek-v4-flash": ["None", "Low", "Medium"],
  "deepseek-v4-pro": ["None", "Low", "Medium", "High", "XHigh"],
  "gpt-5-codex": ["None", "Low", "Medium", "High"],
  "gpt-5": ["None", "Low", "Medium", "High"]
};

export const welcomeCopy = {
  eyebrow: "让故事先轻轻露面",
  title: "让我们从哪里开始？\n遇见星尘，还是再会某位灵魂故人？",
  description:
    "先说出一句目标也可以。它可以是一座尚未命名的城市，一段悬而未决的命运，或一个仍在记忆深处等待重逢的人。"
};

export function getModelDisplay(model: ModelOption): string {
  return model.shortName || model.name || model.id;
}

