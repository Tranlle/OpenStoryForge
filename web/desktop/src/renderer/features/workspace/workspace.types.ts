import type { ConversationRecord, CreateConversationInput } from "@renderer/features/home/home.types";

export type TokenUsageSummary = {
  cached: number;
  input: number;
  output: number;
  total: number;
};

export type ProjectRecord = {
  id: string;
  linkedFolders: string[];
  name: string;
  tokenUsage: TokenUsageSummary;
  updatedAt: string;
  updatedAtTs: number;
};

export type TaskRecord = ConversationRecord & {
  modifiedAtTs: number;
  projectId: string;
  projectName: string;
};

export type QuickStartInput = CreateConversationInput & {
  projectName: string;
};
