export type ConversationStatus = "completed" | "error" | "running";

export type ConversationMessage = {
  id: string;
  role: "agent" | "user";
  title: string;
  body: string;
};

export type ConversationConfig = {
  folderLabel: string;
  modelLabel: string;
  presetLabel: string;
  reasoningLevel: string;
};

export type ConversationRecord = {
  config: ConversationConfig;
  id: string;
  messages: ConversationMessage[];
  modifiedAt: string;
  projectName?: string;
  projectPath: string;
  status: ConversationStatus;
  title: string;
};

export type CreateConversationInput = {
  folderLabel: string;
  folderPath: string;
  modelId: string;
  presetLabel: string;
  prompt: string;
  reasoningLevel: string;
};

export type QuickPrompt = {
  id: string;
  summary: string;
  title: string;
};

export type ProjectTabId = "directory" | "outline" | "chapters" | "nodes";

export type DirectoryItem = {
  depth: number;
  name: string;
  type: "file" | "folder";
};

export type ChapterItem = {
  meta: string;
  title: string;
};

export type NodeItem = {
  children: string[];
  title: string;
};
