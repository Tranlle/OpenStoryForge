import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronRight, FolderOpen, Link2, SendHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@renderer/components/primitives/button";
import { Surface } from "@renderer/components/primitives/surface";
import {
  ComposerControlsRow,
  ComposerDivider,
  FolderDialog,
  InputComposerContainer,
  ProjectNameInput,
  QuickPromptTags
} from "@renderer/features/home/composer-ui";
import { quickPromptPlaceholders } from "@renderer/features/home/home.data";
import { useComposerControls } from "@renderer/features/home/use-composer-controls";
import { getPathLeaf } from "@renderer/features/workspace/workspace.data";
import type { ProjectRecord, QuickStartInput, TaskRecord } from "@renderer/features/workspace/workspace.types";
import type { WelcomeSectionId } from "@renderer/features/welcome/welcome-sidebar";
import { cn } from "@renderer/lib/utils";

const quickStartSchema = z.object({
  projectName: z.string().trim().min(1, "Project name is required"),
  prompt: z.string().trim().min(1, "Prompt is required")
});

type QuickStartValues = z.infer<typeof quickStartSchema>;

export function WelcomePage({
  activeSection,
  onOpenTask,
  onQuickStart,
  projects,
  tasks,
  tokenUsageSummary
}: {
  activeSection: WelcomeSectionId;
  onOpenTask: (taskId: string) => void;
  onQuickStart: (input: QuickStartInput) => void;
  projects: ProjectRecord[];
  tasks: TaskRecord[];
  tokenUsageSummary: ProjectRecord["tokenUsage"];
}): JSX.Element {
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const controls = useComposerControls({
    existingFolderPath: projects[0]?.linkedFolders[0] ?? "D:/Stories",
    folderLabel: projects[0]?.linkedFolders[0] ? getPathLeaf(projects[0].linkedFolders[0]) : "Select folder"
  });
  const form = useForm<QuickStartValues>({
    defaultValues: {
      projectName: projects[0]?.name ?? "",
      prompt: ""
    },
    mode: "onChange",
    resolver: zodResolver(quickStartSchema)
  });

  const projectSuggestions = useMemo(() => projects.map((project) => project.name), [projects]);
  const projectName = form.watch("projectName");
  const canSubmit = form.formState.isValid;

  const groupedTasks = useMemo(() => {
    const projectMap = new Map<string, TaskRecord[]>();

    for (const task of tasks) {
      const current = projectMap.get(task.projectId) ?? [];
      current.push(task);
      projectMap.set(task.projectId, current);
    }

    return projectMap;
  }, [tasks]);

  const toggleProject = (projectId: string): void => {
    setExpandedProjects((current) => ({
      ...current,
      [projectId]: !current[projectId]
    }));
  };

  const handleQuickStart = (values: QuickStartValues): void => {
    onQuickStart({
      folderLabel: controls.selectedFolderLabel,
      folderPath: controls.existingFolderPath,
      modelId: controls.selectedModelId,
      presetLabel: controls.selectedPresetLabel,
      projectName: values.projectName,
      prompt: values.prompt,
      reasoningLevel: controls.selectedReasoningLevel
    });

    form.reset({
      projectName: values.projectName,
      prompt: ""
    });
  };

  return (
    <section className="min-h-full bg-surface/10 px-6 py-8 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full bg-surface/18 px-4 py-2 text-sm text-muted shadow-[inset_0_0_0_1px_hsl(var(--border)/0.16)]">
            WELCOME / project-first launcher
          </div>
          <h1 className="mt-6 font-display text-4xl font-black tracking-tight md:text-5xl">
            Start from the project layer, then jump into Home with the new task already open.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
            Welcome is a separate route. It creates or binds projects, keeps folder context optional, and launches task
            nodes into the unchanged Home workspace.
          </p>
        </div>

        {activeSection === "quick-start" ? (
          <QuickStartPanel
            canSubmit={canSubmit}
            controls={controls}
            form={form}
            onSubmit={form.handleSubmit(handleQuickStart)}
            projectName={projectName}
            projectSuggestions={projectSuggestions}
          />
        ) : null}

        {activeSection === "projects" ? (
          <ProjectListPanel
            expandedProjects={expandedProjects}
            onOpenTask={onOpenTask}
            onToggleProject={toggleProject}
            projects={projects}
            tasksByProject={groupedTasks}
          />
        ) : null}

        {activeSection === "tokens" ? <TokenUsagePanel projects={projects} summary={tokenUsageSummary} /> : null}

        {activeSection === "project-tree" ? (
          <ProjectTreePanel
            expandedProjects={expandedProjects}
            onOpenTask={onOpenTask}
            onToggleProject={toggleProject}
            projects={projects.slice(0, 5)}
            tasksByProject={groupedTasks}
          />
        ) : null}

        {activeSection === "settings" ? <SettingsPanel /> : null}
      </div>

      <FolderDialog
        existingFolderPath={controls.existingFolderPath}
        folderBasePath={controls.folderBasePath}
        folderDialogMode={controls.folderDialogMode}
        folderName={controls.folderName}
        onClose={() => controls.setFolderDialogMode(null)}
        onConfirm={controls.completeFolderDialog}
        onExistingFolderPathChange={controls.setExistingFolderPath}
        onFolderBasePathChange={controls.setFolderBasePath}
        onFolderNameChange={controls.setFolderName}
        onProjectNameChange={(value) => form.setValue("projectName", value, { shouldDirty: true, shouldValidate: true })}
        projectInputMode="editable"
        projectName={projectName}
        projectSuggestions={projectSuggestions}
      />
    </section>
  );
}

function QuickStartPanel({
  canSubmit,
  controls,
  form,
  onSubmit,
  projectName,
  projectSuggestions
}: {
  canSubmit: boolean;
  controls: ReturnType<typeof useComposerControls>;
  form: ReturnType<typeof useForm<QuickStartValues>>;
  onSubmit: () => void;
  projectName: string;
  projectSuggestions: string[];
}): JSX.Element {
  return (
    <Surface className="overflow-hidden p-6 md:p-8" tone="transparent">
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <form className="contents" onSubmit={(event) => void form.handleSubmit(() => onSubmit())(event)}>
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <ProjectNameInput
              helpText="Type a new project name or pick an existing one. Project identity does not depend on folder selection."
              label="Project"
              listId="welcome-project-options"
              onChange={(value) => form.setValue("projectName", value, { shouldDirty: true, shouldValidate: true })}
              suggestions={projectSuggestions}
              value={projectName}
            />

            <Surface className="p-4" tone="soft">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Current folder context</div>
              <div className="mt-3 text-sm font-medium">{controls.existingFolderPath || "No folder selected yet"}</div>
              <div className="mt-2 text-xs leading-6 text-muted">
                Folder context stays optional here. Users can still switch folders later inside Home conversations.
              </div>
            </Surface>
          </div>

          <InputComposerContainer>
            <textarea
              className="min-h-[180px] w-full resize-none bg-transparent px-1 py-2 text-base leading-7 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted"
              onChange={(event) => form.setValue("prompt", event.target.value, { shouldDirty: true, shouldValidate: true })}
              placeholder="Describe what you want to create, inspect, or continue in this project..."
              rows={6}
              value={form.watch("prompt")}
            />

            <ComposerDivider />

            <ComposerControlsRow
              onFolderCreate={() => {
                controls.closeMenus();
                controls.setFolderDialogMode("create");
              }}
              onFolderSelect={() => {
                controls.closeMenus();
                controls.setFolderDialogMode("select");
              }}
              onModelSelect={(model) => controls.selectModel(model.id)}
              onPresetSelect={controls.selectPreset}
              onReasoningSelect={controls.selectReasoningLevel}
              onSubmit={onSubmit}
              onToggleMenu={(menu) => controls.setOpenMenu((current) => (current === menu ? null : menu))}
              openMenu={controls.openMenu}
              reasoningLevels={controls.reasoningLevels}
              selectedFolderLabel={controls.selectedFolderLabel}
              selectedModelLabel={controls.selectedModelLabel}
              selectedPresetLabel={controls.selectedPresetLabel}
              selectedReasoningLevel={controls.selectedReasoningLevel}
              submitDisabled={!canSubmit}
              submitLabel="Create task and open Home"
            />
          </InputComposerContainer>

          <QuickPromptTags
            onPromptClick={(prompt) => form.setValue("prompt", prompt.summary, { shouldDirty: true, shouldValidate: true })}
            prompts={quickPromptPlaceholders}
          />
        </form>

        <Surface className="p-5" tone="soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Launch behavior</div>
              <div className="mt-2 font-display text-xl font-black">Project-first quick start</div>
            </div>
            <Button onClick={onSubmit} size="sm" type="button" variant="secondary">
              <SendHorizontal aria-hidden="true" className="h-4 w-4" />
              Send
            </Button>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-7 text-muted">
            <p>1. Match the typed project name against existing projects.</p>
            <p>2. Create the project in mock state if it does not exist yet.</p>
            <p>3. Create a task node with the current prompt and optional folder context.</p>
            <p>4. Navigate to Home and open the new task immediately.</p>
          </div>
        </Surface>
      </div>
    </Surface>
  );
}

function ProjectListPanel({
  expandedProjects,
  onOpenTask,
  onToggleProject,
  projects,
  tasksByProject
}: {
  expandedProjects: Record<string, boolean>;
  onOpenTask: (taskId: string) => void;
  onToggleProject: (projectId: string) => void;
  projects: ProjectRecord[];
  tasksByProject: Map<string, TaskRecord[]>;
}): JSX.Element {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectGroupCard
          expanded={expandedProjects[project.id] ?? true}
          key={project.id}
          onOpenTask={onOpenTask}
          onToggle={() => onToggleProject(project.id)}
          project={project}
          tasks={tasksByProject.get(project.id) ?? []}
        />
      ))}
    </div>
  );
}

function ProjectTreePanel({
  expandedProjects,
  onOpenTask,
  onToggleProject,
  projects,
  tasksByProject
}: {
  expandedProjects: Record<string, boolean>;
  onOpenTask: (taskId: string) => void;
  onToggleProject: (projectId: string) => void;
  projects: ProjectRecord[];
  tasksByProject: Map<string, TaskRecord[]>;
}): JSX.Element {
  return (
    <Surface className="p-6" tone="transparent">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Recently modified projects</div>
      <div className="mt-5 space-y-3">
        {projects.map((project) => (
          <div className="rounded-[1.4rem] border border-border/70 bg-surface/40 p-4" key={project.id}>
            <button
              className="flex w-full items-center gap-3 text-left"
              onClick={() => onToggleProject(project.id)}
              type="button"
            >
              {expandedProjects[project.id] ? (
                <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted" />
              ) : (
                <ChevronRight aria-hidden="true" className="h-4 w-4 text-muted" />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{project.name}</div>
                <div className="text-xs text-muted">{project.updatedAt}</div>
              </div>
            </button>

            {(expandedProjects[project.id] ?? false) ? (
              <div className="mt-3 space-y-2 pl-7">
                {(tasksByProject.get(project.id) ?? []).map((task) => (
                  <button
                    className="block w-full rounded-2xl bg-background/30 px-4 py-3 text-left text-sm transition hover:bg-background/45"
                    key={task.id}
                    onClick={() => onOpenTask(task.id)}
                    type="button"
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="mt-1 text-xs text-muted">{task.modifiedAt}</div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Surface>
  );
}

function TokenUsagePanel({
  projects,
  summary
}: {
  projects: ProjectRecord[];
  summary: ProjectRecord["tokenUsage"];
}): JSX.Element {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Global totals</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricCard label="Total" value={formatNumber(summary.total)} />
          <MetricCard label="Input" value={formatNumber(summary.input)} />
          <MetricCard label="Output" value={formatNumber(summary.output)} />
          <MetricCard label="Cached" value={formatNumber(summary.cached)} />
        </div>
      </Surface>

      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Per project</div>
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <div className="rounded-[1.4rem] border border-border/70 bg-surface/40 p-4" key={project.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-muted">{project.updatedAt}</div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                <MetricCard compact label="Total" value={formatNumber(project.tokenUsage.total)} />
                <MetricCard compact label="Input" value={formatNumber(project.tokenUsage.input)} />
                <MetricCard compact label="Output" value={formatNumber(project.tokenUsage.output)} />
                <MetricCard compact label="Cached" value={formatNumber(project.tokenUsage.cached)} />
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function SettingsPanel(): JSX.Element {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Theme</div>
        <div className="mt-3 text-lg font-semibold">Continue using the global desktop theme switcher from the title bar.</div>
        <p className="mt-3 text-sm leading-7 text-muted">
          This settings panel stays scaffolded for workspace preferences while the shell keeps the existing global theme
          control intact.
        </p>
      </Surface>

      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Workspace preferences</div>
        <div className="mt-3 flex items-start gap-3">
          <FolderOpen aria-hidden="true" className="mt-1 h-4 w-4 text-muted" />
          <p className="text-sm leading-7 text-muted">
            Future settings can pin launch folders, project defaults, and token display preferences without changing
            Home route behavior.
          </p>
        </div>
      </Surface>
    </div>
  );
}

function ProjectGroupCard({
  expanded,
  onOpenTask,
  onToggle,
  project,
  tasks
}: {
  expanded: boolean;
  onOpenTask: (taskId: string) => void;
  onToggle: () => void;
  project: ProjectRecord;
  tasks: TaskRecord[];
}): JSX.Element {
  return (
    <Surface className="p-5" tone="transparent">
      <button className="flex w-full items-start gap-3 text-left" onClick={onToggle} type="button">
        {expanded ? (
          <ChevronDown aria-hidden="true" className="mt-1 h-4 w-4 text-muted" />
        ) : (
          <ChevronRight aria-hidden="true" className="mt-1 h-4 w-4 text-muted" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="truncate font-display text-xl font-black">{project.name}</div>
            <div className="rounded-full border border-border/70 bg-surface/60 px-3 py-1 text-[11px] font-semibold text-muted">
              {project.updatedAt}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.linkedFolders.length > 0 ? (
              project.linkedFolders.slice(0, 2).map((folder) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-background/34 px-3 py-1 text-[11px] text-muted"
                  key={folder}
                >
                  <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
                  {folder}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-full bg-background/34 px-3 py-1 text-[11px] text-muted">
                No linked folders yet
              </span>
            )}
          </div>
        </div>
      </button>

      {expanded ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {tasks.map((task) => (
            <button
              className="rounded-[1.4rem] border border-border/70 bg-background/26 px-4 py-4 text-left transition hover:bg-background/40"
              key={task.id}
              onClick={() => onOpenTask(task.id)}
              type="button"
            >
              <div className="font-medium">{task.title}</div>
              <div className="mt-2 text-xs text-muted">
                {task.modifiedAt} / {task.status}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </Surface>
  );
}

function MetricCard({
  compact = false,
  label,
  value
}: {
  compact?: boolean;
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className={cn("rounded-[1.2rem] border border-border/70 bg-surface/40 p-4", compact && "p-3")}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className={cn("mt-2 font-display text-2xl font-black", compact && "text-lg")}>{value}</div>
    </div>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
