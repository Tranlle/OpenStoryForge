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

export type WelcomeCopy = {
  description: string;
  eyebrow: string;
  title: string;
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
    label: "Writing",
    items: [
      { id: "story-planner", label: "Story Planner Agent" },
      { id: "world-builder", label: "World Builder Agent" }
    ]
  },
  {
    label: "Analysis",
    items: [
      { id: "branch-reviewer", label: "Branch Review Agent" },
      { id: "character-analyst", label: "Character Analyst Agent" }
    ]
  }
];

export const reasoningLevelsByModel: Record<string, string[]> = {
  "deepseek-v4-flash": ["None", "Low", "Medium"],
  "deepseek-v4-pro": ["None", "Low", "Medium", "High", "XHigh"],
  "gpt-5-codex": ["None", "Low", "Medium", "High"],
  "gpt-5": ["None", "Low", "Medium", "High"]
};

export const welcomeCopy: WelcomeCopy = {
  eyebrow: "Let the story surface first",
  title: "Where should we begin?\nA city not yet named, or a mystery still unresolved?",
  description:
    "A single sentence is enough to start. It can be a world seed, a route sketch, a conflict map, or a character thread waiting to be pulled into focus."
};

export function getModelDisplay(model: ModelOption): string {
  return model.shortName || model.name || model.id;
}
