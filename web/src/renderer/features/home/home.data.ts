import { BookOpenText, FolderTree, ListTree, Network } from "lucide-react";

import type { ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import type {
  ChapterItem,
  ConversationConfig,
  ConversationMessage,
  ConversationRecord,
  CreateConversationInput,
  DirectoryItem,
  NodeItem,
  QuickPrompt
} from "@renderer/features/home/home.types";

const defaultProjectPath = "D:/Stories/SuspenseVN";

const defaultConversationConfig: ConversationConfig = {
  folderLabel: "Select folder",
  modelLabel: "deepseek-v4-flash",
  presetLabel: "Story Planner Agent",
  reasoningLevel: "None"
};

const markdownProbeMessage = `# Story workspace probe

After a project folder is selected, I will first read the directory structure and then organize the outline, chapters, and nodes into the drawer on the right.

## First-pass actions

- Scan the project directory and any existing assets
- Extract worldbuilding, characters, and chapter signals
- Build reusable context for the next round of conversation

> This message is intentionally rich so the Markdown renderer can be checked with headings, lists, quotes, tables, tasks, and code blocks.

## Current checks

- [x] Heading hierarchy
- [x] Unordered lists
- [x] Quote block
- [x] Table layout
- [ ] Code block highlighting

## Summary

| Module | Status | Note |
| --- | --- | --- |
| Project directory | Connected | Waiting for a real backend directory response |
| Chapter outline | Placeholder | Will be replaced with project data later |
| Node panel | Expandable | Ready to host structured analysis output |

\`\`\`ts
const workspacePlan = {
  folder: "SuspenseVN",
  focus: ["worldbuilding", "character dynamics", "chapter structure"],
  nextStep: "sync the right drawer with live project context"
};
\`\`\`

If this renders well, the next step can deepen the code blocks, tables, and long-form layout support.`;

export const mockConversations: ConversationRecord[] = [
  {
    config: {
      folderLabel: "SuspenseVN",
      modelLabel: "deepseek-v4-pro",
      presetLabel: "World Builder Agent",
      reasoningLevel: "High"
    },
    id: "conv-01",
    modifiedAt: "5 min ago",
    projectPath: defaultProjectPath,
    status: "running",
    title: "Suspense visual novel world setup",
    messages: [
      {
        id: "agent-1",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: markdownProbeMessage
      },
      {
        id: "user-1",
        role: "user",
        title: "Creator",
        body: "I want to build a suspense visual novel project and first sort out the world rules, character relations, and the structure of the first three chapters."
      },
      {
        id: "agent-2",
        role: "agent",
        title: "OpenStoryForge Agent",
        body: "Understood. I will organize the project context first, then continue refining chapters and conflict beats."
      }
    ]
  }
];

export const quickPromptPlaceholders: QuickPrompt[] = [
  {
    id: "quick-01",
    title: "Continue the current conflict",
    summary: "Based on the existing setup, continue mapping the motives between the protagonist, anonymous informant, and antagonist."
  },
  {
    id: "quick-02",
    title: "Push the first three chapters",
    summary: "Review the branch beats in the first three chapters and fill in misleading clues plus key decisions."
  }
];

export const projectTabs = [
  { id: "directory", label: "Directory", icon: FolderTree },
  { id: "outline", label: "Outline", icon: ListTree },
  { id: "chapters", label: "Chapters", icon: BookOpenText },
  { id: "nodes", label: "Nodes", icon: Network }
] as const;

export const directoryItems: DirectoryItem[] = [
  { depth: 0, name: "SuspenseVN", type: "folder" },
  { depth: 1, name: "story-outline.md", type: "file" },
  { depth: 1, name: "characters/", type: "folder" },
  { depth: 1, name: "chapter-drafts/", type: "folder" }
];

export const outlineItems = ["Worldbuilding", "Main character motive", "Conflict escalation", "Ending branches"];

export const chapterItems: ChapterItem[] = [
  { title: "Prologue", meta: "Establish the central mystery" },
  { title: "Chapter One", meta: "Bring the cast into the abnormal scene" },
  { title: "Chapter Two", meta: "Introduce contradictory testimony" }
];

export const nodeItems: NodeItem[] = [
  { title: "Opening node", children: ["Cold open", "Environmental setup"] },
  { title: "Investigation node", children: ["Clue A", "Clue B", "Branch decision"] }
];

export function buildProjectTree(conversations: ConversationRecord[]): ProjectTreeData {
  const latestProjectPath = conversations[0]?.projectPath ?? defaultProjectPath;

  return {
    folderName: getPathLeaf(latestProjectPath),
    name: "OpenStoryForge",
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      modifiedAt: conversation.modifiedAt,
      status: conversation.status,
      title: conversation.title
    }))
  };
}

export function createConversationRecord(input: CreateConversationInput): ConversationRecord {
  const normalizedPrompt = input.prompt.trim();
  const projectPath = normalizeProjectPath(input.folderPath, input.folderLabel);
  const title = buildConversationTitle(normalizedPrompt);
  const modelLabel = input.modelId || defaultConversationConfig.modelLabel;
  const presetLabel = input.presetLabel || defaultConversationConfig.presetLabel;
  const folderLabel = input.folderLabel || getPathLeaf(projectPath);
  const reasoningLevel = input.reasoningLevel || defaultConversationConfig.reasoningLevel;
  const userMessage: ConversationMessage = {
    id: `user-${Date.now()}`,
    role: "user",
    title: "Creator",
    body: normalizedPrompt
  };
  const agentMessage: ConversationMessage = {
    id: `agent-${Date.now()}`,
    role: "agent",
    title: "OpenStoryForge Agent",
    body: `A new conversation entry point is ready for "${title}". I will start by organizing the project context around ${presetLabel} and then continue into execution.`
  };

  return {
    config: {
      folderLabel,
      modelLabel,
      presetLabel,
      reasoningLevel
    },
    id: `conv-${Date.now()}`,
    messages: [userMessage, agentMessage],
    modifiedAt: "Just now",
    projectPath,
    status: "running",
    title
  };
}

function buildConversationTitle(prompt: string): string {
  const firstLine = prompt.split(/\r?\n/).find((line) => line.trim().length > 0)?.trim() ?? "New topic conversation";

  return firstLine.length > 22 ? `${firstLine.slice(0, 22)}...` : firstLine;
}

function normalizeProjectPath(folderPath: string, folderLabel: string): string {
  if (folderPath.trim()) {
    return folderPath.trim();
  }

  if (folderLabel.trim()) {
    return `D:/Stories/${folderLabel.trim()}`;
  }

  return defaultProjectPath;
}

function getPathLeaf(path: string): string {
  const segments = path.split(/[\\/]/).filter(Boolean);

  return segments.at(-1) ?? "Unassigned project";
}
