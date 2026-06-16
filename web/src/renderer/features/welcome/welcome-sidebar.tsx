import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  FolderTree,
  History,
  LayoutDashboard,
  ListTree,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { statusIconMap } from "@renderer/components/layout/app-shell.data";
import type { ProjectTreeConversation } from "@renderer/components/layout/app-shell.types";
import { getPathLeaf } from "@renderer/features/workspace/workspace.data";
import type { ProjectRecord } from "@renderer/features/workspace/workspace.types";
import { useI18n } from "@renderer/i18n/use-i18n";
import { cn } from "@renderer/lib/utils";

export type WelcomeProjectTreeData = {
  conversations: ProjectTreeConversation[];
  folderName: string;
  name: string;
};

export type WelcomeSectionId = "projects" | "quick-start" | "settings" | "tokens";

const menuFollowDelayMs = 40;

export function WelcomeSidebar({
  activeSection,
  fetchProjectTree,
  isExpanded,
  onExpandChange,
  onOpenTask,
  onSelectSection,
  recentProjects
}: {
  activeSection: WelcomeSectionId;
  fetchProjectTree: (projectId: string) => Promise<WelcomeProjectTreeData>;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
  onOpenTask: (taskId: string) => void;
  onSelectSection: (section: WelcomeSectionId) => void;
  recentProjects: ProjectRecord[];
}): JSX.Element {
  const { t } = useI18n();
  const animationTimerRef = useRef<number | undefined>(undefined);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [isMenuExpanded, setIsMenuExpanded] = useState(isExpanded);
  const [isWidthExpanded, setIsWidthExpanded] = useState(isExpanded);

  const navItems: Array<{ id: WelcomeSectionId; icon: typeof Sparkles; label: string }> = [
    { id: "quick-start", icon: Sparkles, label: t("welcome.quickStart") },
    { id: "projects", icon: ListTree, label: t("welcome.projectList") },
    { id: "tokens", icon: LayoutDashboard, label: t("welcome.tokenUsage") }
  ];

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== undefined) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (animationTimerRef.current !== undefined) {
      window.clearTimeout(animationTimerRef.current);
    }

    if (isExpanded) {
      setIsWidthExpanded(true);
      animationTimerRef.current = window.setTimeout(() => setIsMenuExpanded(true), menuFollowDelayMs);
      return;
    }

    animationTimerRef.current = window.setTimeout(() => {
      setIsMenuExpanded(false);
      setIsWidthExpanded(false);
    }, menuFollowDelayMs);
  }, [isExpanded]);

  return (
    <aside
      className={cn(
        "hidden shrink-0 bg-surface/24 shadow-[inset_-1px_0_0_hsl(var(--border)/0.26)] backdrop-blur-xl transition-[width] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex lg:flex-col",
        isWidthExpanded ? "w-[300px]" : "w-[76px]"
      )}
    >
      <div
        className={cn(
          "relative flex h-14 shrink-0 items-center border-b border-border/40 px-3",
          isWidthExpanded ? "justify-between" : "justify-center"
        )}
      >
        {isWidthExpanded ? (
          <>
            <div className="px-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {t("shell.welcomeMobileLabel")}
              </div>
              <div className="font-display text-sm font-black">{t("shell.welcomeMobileSubtitle")}</div>
            </div>
            <button
              aria-label={t("shell.collapseSidebar")}
              className="grid h-10 w-10 place-items-center rounded-xl bg-background/14 text-muted transition hover:bg-surface/46 hover:text-foreground"
              onClick={() => onExpandChange(false)}
              title={t("shell.collapseSidebar")}
              type="button"
            >
              <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            aria-label={t("shell.expandSidebar")}
            className="absolute right-3 top-2 hidden h-10 w-10 place-items-center rounded-xl bg-background/14 text-muted transition hover:bg-surface/46 hover:text-foreground lg:grid"
            onClick={() => onExpandChange(true)}
            title={t("shell.expandSidebar")}
            type="button"
          >
            <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 px-3 py-4">
        <div className="flex h-full min-h-0 flex-col">
          <section className="min-h-0 basis-[85.714286%] overflow-hidden">
            <div className="flex h-full min-h-0 flex-col">
              <div
                className={cn(
                  "shrink-0 transition-[opacity,transform] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isMenuExpanded ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-5 opacity-0"
                )}
              >
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      className={cn(
                        "flex w-full items-center rounded-2xl text-left text-sm font-medium transition",
                        isWidthExpanded ? "gap-3 px-4 py-3" : "justify-center px-0 py-3",
                        activeSection === item.id
                          ? "bg-foreground text-background shadow-[0_14px_28px_hsl(var(--foreground)/0.14)]"
                          : "text-muted hover:bg-surface/38 hover:text-foreground"
                      )}
                      key={item.id}
                      onClick={() => onSelectSection(item.id)}
                      title={item.label}
                      type="button"
                    >
                      <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {isWidthExpanded ? <span>{item.label}</span> : null}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "min-h-0 flex-1 transition-[opacity,transform] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isMenuExpanded ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-5 opacity-0"
                )}
              >
                <div className="app-scrollbar mt-4 h-full overflow-y-auto pr-1">
                  <div className="flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    <FolderTree aria-hidden="true" className="h-3.5 w-3.5" />
                    {isWidthExpanded ? <span>{t("common.projectTree")}</span> : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    {recentProjects.slice(0, 5).map((project) => (
                      <WelcomeProjectTreeItem
                        expanded={expandedProjectId === project.id}
                        fetchProjectTree={fetchProjectTree}
                        key={project.id}
                        onOpenTask={onOpenTask}
                        onToggle={() =>
                          setExpandedProjectId((current) => (current === project.id ? null : project.id))
                        }
                        project={project}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="basis-[14.285714%]">
            <div className="flex h-full flex-col justify-end">
              <button
                className={cn(
                  "flex w-full items-center rounded-2xl text-left text-sm font-medium transition",
                  isWidthExpanded ? "gap-3 px-4 py-3" : "justify-center px-0 py-3",
                  activeSection === "settings"
                    ? "bg-foreground text-background shadow-[0_14px_28px_hsl(var(--foreground)/0.14)]"
                    : "text-muted hover:bg-surface/38 hover:text-foreground"
                )}
                onClick={() => onSelectSection("settings")}
                title={t("common.settings")}
                type="button"
              >
                <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
                {isWidthExpanded ? <span>{t("common.settings")}</span> : null}
              </button>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

function WelcomeProjectTreeItem({
  expanded,
  fetchProjectTree,
  onOpenTask,
  onToggle,
  project
}: {
  expanded: boolean;
  fetchProjectTree: (projectId: string) => Promise<WelcomeProjectTreeData>;
  onOpenTask: (taskId: string) => void;
  onToggle: () => void;
  project: ProjectRecord;
}): JSX.Element {
  const { t } = useI18n();
  const [folderExpanded, setFolderExpanded] = useState(false);
  const { data, isFetching } = useQuery({
    enabled: expanded,
    queryKey: ["welcome-project-tree", project.id],
    queryFn: async () => fetchProjectTree(project.id),
    staleTime: Number.POSITIVE_INFINITY
  });

  useEffect(() => {
    if (!expanded) {
      setFolderExpanded(false);
    }
  }, [expanded]);

  return (
    <div className="rounded-[1rem] px-2 py-2 transition hover:bg-surface/18">
      <button
        aria-expanded={expanded}
        className="flex w-full items-start gap-2 text-left"
        onClick={onToggle}
        type="button"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{project.name}</div>
          <div className="mt-1 text-[11px] text-muted">{project.updatedAt}</div>
        </div>
        {expanded ? (
          <ChevronDown aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        ) : (
          <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        )}
      </button>

      {expanded ? (
        <div className="mt-3 pl-3">
          {isFetching && !data ? (
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
              <span>{t("welcome.loadingProjectTree")}</span>
            </div>
          ) : data ? (
            <>
              <button
                aria-expanded={folderExpanded}
                className="flex w-full items-center gap-2 text-left text-[11px] text-muted transition hover:text-foreground"
                onClick={() => setFolderExpanded((current) => !current)}
                type="button"
              >
                <History aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  {data.folderName || getPathLeaf(project.linkedFolders[0] ?? "") || t("common.noLinkedFolder")}
                </span>
                {folderExpanded ? (
                  <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                ) : (
                  <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-muted" />
                )}
              </button>

              {folderExpanded ? (
                <div className="mt-2 space-y-1.5">
                  {data.conversations.map((conversation) => {
                    const StatusIcon = statusIconMap[conversation.status];

                    return (
                      <button
                        className="block w-full rounded-lg bg-surface/12 px-2 py-1.5 text-left shadow-[inset_0_0_0_1px_hsl(var(--border)/0.12)] transition hover:bg-surface/22"
                        key={conversation.id}
                        onClick={() => onOpenTask(conversation.id)}
                        title={conversation.title}
                        type="button"
                      >
                        <div className="flex items-center gap-2">
                          <div className="min-w-0 flex-1 truncate text-[11px] font-medium leading-4">{conversation.title}</div>
                          <StatusIcon
                            aria-hidden="true"
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              conversation.status === "running" && "animate-spin text-sky-400",
                              conversation.status === "error" && "text-amber-400",
                              conversation.status === "completed" && "text-emerald-400"
                            )}
                          />
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] leading-4 text-muted">
                          <span>{t(`status.${conversation.status}`)}</span>
                          <span className="h-1 w-1 rounded-full bg-muted/60" />
                          <span>{conversation.modifiedAt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
