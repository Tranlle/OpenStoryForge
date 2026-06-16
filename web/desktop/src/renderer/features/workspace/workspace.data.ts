import type { ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import type { ConversationMessage, CreateConversationInput } from "@renderer/features/home/home.types";
import type { ProjectRecord, QuickStartInput, TaskRecord, TokenUsageSummary } from "@renderer/features/workspace/workspace.types";

const now = Date.now();

export const mockProjects: ProjectRecord[] = [
  {
    id: "proj-suspense-vn",
    linkedFolders: ["D:/Stories/SuspenseVN", "D:/Stories/SuspenseVN/assets"],
    name: "Suspense Visual Novel",
    tokenUsage: { cached: 21000, input: 84200, output: 26540, total: 131740 },
    updatedAt: "5 min ago",
    updatedAtTs: now - 5 * 60 * 1000
  },
  {
    id: "proj-archive-city",
    linkedFolders: ["D:/Stories/ArchiveCity"],
    name: "Archive City",
    tokenUsage: { cached: 9000, input: 38500, output: 11280, total: 58780 },
    updatedAt: "Today 09:40",
    updatedAtTs: now - 3 * 60 * 60 * 1000
  },
  {
    id: "proj-orbit-house",
    linkedFolders: [],
    name: "Orbit House",
    tokenUsage: { cached: 4200, input: 17220, output: 6480, total: 27900 },
    updatedAt: "Yesterday",
    updatedAtTs: now - 27 * 60 * 60 * 1000
  }
];

export const mockTasks: TaskRecord[] = [
  createSeedTask({
    modifiedAt: "5 min ago",
    modifiedAtTs: now - 5 * 60 * 1000,
    projectId: "proj-suspense-vn",
    projectName: "Suspense Visual Novel",
    projectPath: "D:/Stories/SuspenseVN",
    status: "running",
    title: "World setup and conflict map",
    userBody: "Build the world rules, faction relationships, and chapter one mystery hooks."
  }),
  createSeedTask({
    modifiedAt: "Today 11:08",
    modifiedAtTs: now - 95 * 60 * 1000,
    projectId: "proj-suspense-vn",
    projectName: "Suspense Visual Novel",
    projectPath: "D:/Stories/SuspenseVN",
    status: "completed",
    title: "Chapter pacing review",
    userBody: "Review the first three chapter branches and reduce duplicated beats."
  }),
  createSeedTask({
    modifiedAt: "Today 09:40",
    modifiedAtTs: now - 3 * 60 * 60 * 1000,
    projectId: "proj-archive-city",
    projectName: "Archive City",
    projectPath: "D:/Stories/ArchiveCity",
    status: "error",
    title: "Character motive audit",
    userBody: "Audit motive consistency between the archivist, witness, and antagonist."
  }),
  createSeedTask({
    modifiedAt: "Yesterday",
    modifiedAtTs: now - 27 * 60 * 60 * 1000,
    projectId: "proj-orbit-house",
    projectName: "Orbit House",
    projectPath: "D:/Stories/OrbitHouse",
    status: "completed",
    title: "Opening route scaffold",
    userBody: "Sketch the opening route variants for a quiet science-fiction mystery."
  })
];

export function buildHomeProjectTree(project: ProjectRecord, tasks: TaskRecord[]): ProjectTreeData {
  const sortedTasks = sortTasks(tasks);

  return {
    conversations: sortedTasks.map((task) => ({
      id: task.id,
      modifiedAt: task.modifiedAt,
      status: task.status,
      title: task.title
    })),
    folderName: project.linkedFolders[0] ? getPathLeaf(project.linkedFolders[0]) : "No linked folder",
    name: project.name
  };
}

export function createProjectRecord(name: string, folderPath?: string): ProjectRecord {
  const trimmedName = name.trim();
  const timestamp = Date.now();

  return {
    id: `proj-${timestamp}`,
    linkedFolders: folderPath?.trim() ? [folderPath.trim()] : [],
    name: trimmedName,
    tokenUsage: { cached: 0, input: 0, output: 0, total: 0 },
    updatedAt: "Just now",
    updatedAtTs: timestamp
  };
}

export function createTaskRecord(input: CreateConversationInput | QuickStartInput, project: ProjectRecord): TaskRecord {
  const normalizedPrompt = input.prompt.trim();
  const timestamp = Date.now();
  const title = buildConversationTitle(normalizedPrompt);
  const folderPath = input.folderPath.trim();
  const folderLabel = input.folderLabel.trim() || getPathLeaf(folderPath) || project.name;
  const projectPath = folderPath || project.linkedFolders[0] || `D:/Stories/${project.name.replace(/\s+/g, "")}`;

  const messages: ConversationMessage[] = [
    {
      body: normalizedPrompt,
      id: `user-${timestamp}`,
      role: "user",
      title: "Creator"
    },
    {
      body: `Task "${title}" is ready. I will work inside project "${project.name}" and use the current folder context to continue execution.`,
      id: `agent-${timestamp}`,
      role: "agent",
      title: "OpenStoryForge Agent"
    }
  ];

  return {
    config: {
      folderLabel,
      modelLabel: input.modelId || "deepseek-v4-flash",
      presetLabel: input.presetLabel || "Story Planner Agent",
      reasoningLevel: input.reasoningLevel || "None"
    },
    id: `task-${timestamp}`,
    messages,
    modifiedAt: "Just now",
    modifiedAtTs: timestamp,
    projectId: project.id,
    projectName: project.name,
    projectPath,
    status: "running",
    title
  };
}

export function getPathLeaf(path: string): string {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? "";
}

export function mergeProjectFolder(project: ProjectRecord, folderPath: string): ProjectRecord {
  const normalizedFolder = folderPath.trim();

  if (!normalizedFolder || project.linkedFolders.includes(normalizedFolder)) {
    return project;
  }

  return {
    ...project,
    linkedFolders: [normalizedFolder, ...project.linkedFolders]
  };
}

export function sortProjects(projects: ProjectRecord[]): ProjectRecord[] {
  return [...projects].sort((left, right) => right.updatedAtTs - left.updatedAtTs);
}

export function sortTasks(tasks: TaskRecord[]): TaskRecord[] {
  return [...tasks].sort((left, right) => right.modifiedAtTs - left.modifiedAtTs);
}

export function sumTokenUsage(projects: ProjectRecord[]): TokenUsageSummary {
  return projects.reduce<TokenUsageSummary>(
    (summary, project) => ({
      cached: summary.cached + project.tokenUsage.cached,
      input: summary.input + project.tokenUsage.input,
      output: summary.output + project.tokenUsage.output,
      total: summary.total + project.tokenUsage.total
    }),
    { cached: 0, input: 0, output: 0, total: 0 }
  );
}

function buildConversationTitle(prompt: string): string {
  const firstLine = prompt.split(/\r?\n/).find((line) => line.trim().length > 0)?.trim() ?? "New task";
  return firstLine.length > 40 ? `${firstLine.slice(0, 40)}...` : firstLine;
}

function createSeedTask({
  modifiedAt,
  modifiedAtTs,
  projectId,
  projectName,
  projectPath,
  status,
  title,
  userBody
}: {
  modifiedAt: string;
  modifiedAtTs: number;
  projectId: string;
  projectName: string;
  projectPath: string;
  status: TaskRecord["status"];
  title: string;
  userBody: string;
}): TaskRecord {
  return {
    config: {
      folderLabel: getPathLeaf(projectPath) || projectName,
      modelLabel: "deepseek-v4-flash",
      presetLabel: "Story Planner Agent",
      reasoningLevel: "Medium"
    },
    id: `task-seed-${projectId}-${modifiedAtTs}`,
    messages: [
      {
        body: userBody,
        id: `user-seed-${modifiedAtTs}`,
        role: "user",
        title: "Creator"
      },
      {
        body: `Working inside ${projectName}. Current task focus: ${title}.`,
        id: `agent-seed-${modifiedAtTs}`,
        role: "agent",
        title: "OpenStoryForge Agent"
      }
    ],
    modifiedAt,
    modifiedAtTs,
    projectId,
    projectName,
    projectPath,
    status,
    title
  };
}
