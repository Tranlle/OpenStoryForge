import { create } from "zustand";

import type { CreateConversationInput } from "@renderer/features/home/home.types";
import {
  buildHomeProjectTree,
  createProjectRecord,
  createTaskRecord,
  mergeProjectFolder,
  mockProjects,
  mockTasks,
  sortProjects,
  sortTasks,
  sumTokenUsage
} from "@renderer/features/workspace/workspace.data";
import type { ProjectRecord, QuickStartInput, TaskRecord } from "@renderer/features/workspace/workspace.types";

type AppStoreState = {
  currentProjectId: string;
  currentTaskId: string | null;
  projects: ProjectRecord[];
  tasks: TaskRecord[];
};

type AppStoreActions = {
  createQuickStartTask: (input: QuickStartInput) => TaskRecord;
  createTaskInCurrentProject: (input: CreateConversationInput) => TaskRecord | null;
  openTask: (taskId: string) => void;
};

type AppStore = AppStoreState & AppStoreActions;

const initialProjects = sortProjects(mockProjects);
const initialTasks = sortTasks(mockTasks);

export const useAppStore = create<AppStore>((set, get) => ({
  currentProjectId: mockTasks[0]?.projectId ?? mockProjects[0]?.id ?? "",
  currentTaskId: mockTasks[0]?.id ?? null,
  projects: initialProjects,
  tasks: initialTasks,
  openTask: (taskId) => {
    const nextTask = get().tasks.find((task) => task.id === taskId);

    if (!nextTask) {
      return;
    }

    set({
      currentProjectId: nextTask.projectId,
      currentTaskId: nextTask.id
    });
  },
  createTaskInCurrentProject: (input) => {
    const state = get();
    const currentProject = state.projects.find((project) => project.id === state.currentProjectId) ?? state.projects[0] ?? null;

    if (!currentProject) {
      return null;
    }

    const nextProject = touchProject(mergeProjectFolder(currentProject, input.folderPath), input.folderPath);
    const task = createTaskRecord(input, nextProject);

    set((current) => ({
      currentProjectId: nextProject.id,
      currentTaskId: task.id,
      projects: sortProjects(current.projects.map((item) => (item.id === nextProject.id ? nextProject : item))),
      tasks: sortTasks([task, ...current.tasks])
    }));

    return task;
  },
  createQuickStartTask: (input) => {
    const state = get();
    const normalizedProjectName = input.projectName.trim();
    const existingProject =
      state.projects.find((project) => project.name.toLowerCase() === normalizedProjectName.toLowerCase()) ?? null;
    const baseProject = existingProject ?? createProjectRecord(normalizedProjectName, input.folderPath);
    const touchedProject = touchProject(mergeProjectFolder(baseProject, input.folderPath), input.folderPath);
    const task = createTaskRecord(input, touchedProject);

    set((current) => {
      const nextProjects = existingProject
        ? current.projects.map((project) => (project.id === touchedProject.id ? touchedProject : project))
        : [touchedProject, ...current.projects];

      return {
        currentProjectId: touchedProject.id,
        currentTaskId: task.id,
        projects: sortProjects(nextProjects),
        tasks: sortTasks([task, ...current.tasks])
      };
    });

    return task;
  }
}));

export function useAppState() {
  const projects = useAppStore((state) => state.projects);
  const tasks = useAppStore((state) => state.tasks);
  const currentProjectId = useAppStore((state) => state.currentProjectId);
  const currentTaskId = useAppStore((state) => state.currentTaskId);
  const createQuickStartTask = useAppStore((state) => state.createQuickStartTask);
  const createTaskInCurrentProject = useAppStore((state) => state.createTaskInCurrentProject);
  const openTask = useAppStore((state) => state.openTask);

  const currentProject = projects.find((project) => project.id === currentProjectId) ?? projects[0] ?? null;
  const currentProjectTasks = sortTasks(tasks.filter((task) => task.projectId === currentProject?.id));
  const currentTask = tasks.find((task) => task.id === currentTaskId) ?? currentProjectTasks[0] ?? null;
  const tokenUsageSummary = sumTokenUsage(projects);
  const homeProjectTree = currentProject ? buildHomeProjectTree(currentProject, currentProjectTasks) : null;
  const recentProjects = sortProjects(projects).slice(0, 5);
  const allProjects = sortProjects(projects);
  const allTasks = sortTasks(tasks);

  return {
    allProjects,
    allTasks,
    createQuickStartTask,
    createTaskInCurrentProject,
    currentProject,
    currentProjectTasks,
    currentTask,
    homeProjectTree,
    openTask,
    recentProjects,
    tokenUsageSummary
  };
}

function touchProject(project: ProjectRecord, folderPath?: string): ProjectRecord {
  const timestamp = Date.now();

  return {
    ...mergeProjectFolder(project, folderPath ?? ""),
    updatedAt: "Just now",
    updatedAtTs: timestamp
  };
}
