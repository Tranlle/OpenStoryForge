import { zodResolver } from "@hookform/resolvers/zod";
import { FolderOpen, Link2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Surface } from "@renderer/components/primitives/surface";
import { FolderDialog } from "@renderer/features/home/composer-ui";
import { ConversationStarterWorkspace } from "@renderer/features/home/conversation-starter-workspace";
import { useComposerControls } from "@renderer/features/home/use-composer-controls";
import { getPathLeaf } from "@renderer/features/workspace/workspace.data";
import type { ProjectRecord, QuickStartInput, TaskRecord } from "@renderer/features/workspace/workspace.types";
import { useI18n } from "@renderer/i18n/use-i18n";
import { supportedLocales } from "@renderer/i18n/messages";
import { useLocaleState } from "@renderer/i18n/locale-state";
import { useShortcutState } from "@renderer/shortcuts/shortcut-state";
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
  const { t } = useI18n();
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const controls = useComposerControls({
    existingFolderPath: projects[0]?.linkedFolders[0] ?? "D:/Stories",
    folderLabel: projects[0]?.linkedFolders[0] ? getPathLeaf(projects[0].linkedFolders[0]) : t("composer.selectFolder")
  });
  const form = useForm<QuickStartValues>({
    defaultValues: {
      projectName: projects[0]?.name ?? "Untitled Project",
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

  const handleToggleProject = (projectId: string): void => {
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
    <>
      {activeSection === "quick-start" ? (
        <QuickStartWorkspace
          canSubmit={canSubmit}
          controls={controls}
          form={form}
          onSubmit={() => {
            void form.handleSubmit(handleQuickStart)();
          }}
        />
      ) : (
        <section className="min-h-full bg-surface/10 px-6 py-8 md:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {activeSection === "projects" ? (
              <ProjectListPanel
                expandedProjects={expandedProjects}
                onOpenTask={onOpenTask}
                onToggleProject={handleToggleProject}
                projects={projects}
                tasksByProject={groupedTasks}
              />
            ) : null}

            {activeSection === "tokens" ? <TokenUsagePanel projects={projects} summary={tokenUsageSummary} /> : null}

            {activeSection === "settings" ? <SettingsPanel /> : null}
          </div>
        </section>
      )}

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
    </>
  );
}

function QuickStartWorkspace({
  canSubmit,
  controls,
  form,
  onSubmit
}: {
  canSubmit: boolean;
  controls: ReturnType<typeof useComposerControls>;
  form: ReturnType<typeof useForm<QuickStartValues>>;
  onSubmit: () => void;
}): JSX.Element {
  const { t } = useI18n();
  const prompt = form.watch("prompt");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <ConversationStarterWorkspace
        canSubmit={canSubmit}
        controls={controls}
        copy={{
          eyebrow: t("starter.eyebrow"),
          title: t("starter.title"),
          description: t("starter.description")
        }}
        draft={prompt}
        onDraftChange={(value) => form.setValue("prompt", value, { shouldDirty: true, shouldValidate: true })}
        onPromptClick={(selectedPrompt) =>
          form.setValue("prompt", selectedPrompt.summary, { shouldDirty: true, shouldValidate: true })
        }
        onSubmit={onSubmit}
        promptPlaceholder={t("composer.quickStartPlaceholder")}
        submitLabel={t("common.createTaskAndOpenHome")}
      />
    </form>
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

function TokenUsagePanel({
  projects,
  summary
}: {
  projects: ProjectRecord[];
  summary: ProjectRecord["tokenUsage"];
}): JSX.Element {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("common.globalTotals")}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MetricCard label={t("common.total")} value={formatNumber(summary.total)} />
          <MetricCard label={t("common.input")} value={formatNumber(summary.input)} />
          <MetricCard label={t("common.output")} value={formatNumber(summary.output)} />
          <MetricCard label={t("common.cached")} value={formatNumber(summary.cached)} />
        </div>
      </Surface>

      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("common.perProject")}</div>
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <div className="rounded-[1.4rem] border border-border/70 bg-surface/40 p-4" key={project.id}>
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-muted">{project.updatedAt}</div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                <MetricCard compact label={t("common.total")} value={formatNumber(project.tokenUsage.total)} />
                <MetricCard compact label={t("common.input")} value={formatNumber(project.tokenUsage.input)} />
                <MetricCard compact label={t("common.output")} value={formatNumber(project.tokenUsage.output)} />
                <MetricCard compact label={t("common.cached")} value={formatNumber(project.tokenUsage.cached)} />
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function SettingsPanel(): JSX.Element {
  const { locale, setLocale } = useLocaleState();
  const { t } = useI18n();
  const { descriptors, getBinding, resetBindings } = useShortcutState();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("welcome.settingsThemeTitle")}</div>
        <div className="mt-3 text-lg font-semibold">{t("welcome.settingsThemeDescription")}</div>
      </Surface>

      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("welcome.settingsLanguageTitle")}</div>
        <p className="mt-3 text-sm leading-7 text-muted">{t("welcome.settingsLanguageDescription")}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {supportedLocales.map((candidateLocale) => (
            <button
              className={cn(
                "rounded-full border border-border/70 px-4 py-2 text-sm transition",
                locale === candidateLocale ? "bg-foreground text-background" : "bg-surface/30 text-foreground hover:bg-surface/50"
              )}
              key={candidateLocale}
              onClick={() => setLocale(candidateLocale)}
              type="button"
            >
              {t(`locale.${candidateLocale}`)}
            </button>
          ))}
        </div>
      </Surface>

      <Surface className="p-6 lg:col-span-2" tone="transparent">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("welcome.settingsShortcutTitle")}</div>
            <p className="mt-3 text-sm leading-7 text-muted">{t("welcome.settingsShortcutDescription")}</p>
            <p className="mt-2 text-xs leading-6 text-muted">{t("common.saveForLater")}</p>
          </div>
          <button
            className="rounded-full border border-border/70 px-4 py-2 text-sm text-foreground transition hover:bg-surface/40"
            onClick={resetBindings}
            type="button"
          >
            {t("common.resetDefaults")}
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {descriptors.map((descriptor) => (
            <div className="grid gap-3 rounded-[1.25rem] border border-border/70 bg-surface/24 p-4 md:grid-cols-[1.4fr,0.7fr,0.7fr]" key={descriptor.id}>
              <div>
                <div className="font-medium">{t(descriptor.labelKey)}</div>
                <div className="mt-1 text-xs text-muted">{descriptor.id}</div>
              </div>
              <div className="text-sm text-muted">{descriptor.scope === "global" ? t("common.global") : t("common.page")}</div>
              <div className="font-mono text-sm">{getBinding(descriptor.id)}</div>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="p-6" tone="transparent">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("welcome.workspacePreferencesTitle")}</div>
        <div className="mt-3 flex items-start gap-3">
          <FolderOpen aria-hidden="true" className="mt-1 h-4 w-4 text-muted" />
          <p className="text-sm leading-7 text-muted">{t("welcome.workspacePreferencesDescription")}</p>
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
  const { t } = useI18n();

  return (
    <Surface className="p-5" tone="transparent">
      <button className="flex w-full items-start gap-3 text-left" onClick={onToggle} type="button">
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
                {t("common.noLinkedFoldersYet")}
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
