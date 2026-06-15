import { ChevronDown, ChevronUp, FolderTree, History, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { statusIconMap, statusLabel } from "@renderer/components/layout/app-shell.data";
import type { ProjectTreeConversation, ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import { useProjectTreeState } from "@renderer/components/layout/use-project-tree-state";
import { cn } from "@renderer/lib/utils";

type ProjectTreePanelProps = {
  isSidebarExpanded: boolean;
  onSelectConversation: (conversationId: string) => void;
  projectTree: ProjectTreeData;
  selectedConversationId: string | null;
};

export function ProjectTreePanel({
  isSidebarExpanded,
  onSelectConversation,
  projectTree,
  selectedConversationId
}: ProjectTreePanelProps): JSX.Element {
  const { isFolderExpanded, toggleFolderExpanded } = useProjectTreeState();

  return (
    <div
      className={cn(
        "min-h-0 flex-1 transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        isSidebarExpanded
          ? "origin-top-left translate-x-0 translate-y-0 opacity-100"
          : "pointer-events-none origin-bottom-right -translate-x-6 -translate-y-6 opacity-0"
      )}
    >
      <div className="app-scrollbar h-full overflow-y-auto p-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          <FolderTree aria-hidden="true" className="h-3.5 w-3.5" />
          <span>项目树</span>
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-[12px] font-semibold">
            <FolderTree aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
            <span>{projectTree.name}</span>
          </div>

          <div className="mt-0.5 pl-2">
            <button
              aria-expanded={isFolderExpanded}
              className="flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1 text-left text-[11px] text-muted transition hover:bg-surface/24 hover:text-foreground"
              onClick={toggleFolderExpanded}
              type="button"
            >
              <History aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{projectTree.folderName}</span>
              <span className="flex-1" />
              <span className="flex items-center gap-0.5 text-current">
                <TreeIconButton label="新增对话">
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                </TreeIconButton>
                <TreeIconButton label="删除文件夹">
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                </TreeIconButton>
                {isFolderExpanded ? (
                  <ChevronUp aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                )}
              </span>
            </button>

            <div
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-out",
                isFolderExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="mt-0.5 space-y-1 pl-2">
                  {projectTree.conversations.map((conversation) => (
                    <ProjectConversationItem
                      conversation={conversation}
                      key={conversation.id}
                      onSelectConversation={onSelectConversation}
                      selected={selectedConversationId === conversation.id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectConversationItem({
  conversation,
  onSelectConversation,
  selected
}: {
  conversation: ProjectTreeConversation;
  onSelectConversation: (conversationId: string) => void;
  selected: boolean;
}): JSX.Element {
  const StatusIcon = statusIconMap[conversation.status];

  return (
    <button
      className={cn(
        "block w-full rounded-lg bg-surface/12 px-2 py-1.5 text-left shadow-[inset_0_0_0_1px_hsl(var(--border)/0.12)] transition hover:bg-surface/22",
        selected && "bg-surface/28 shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.34)]"
      )}
      onClick={() => onSelectConversation(conversation.id)}
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
        <span>{statusLabel[conversation.status]}</span>
        <span className="h-1 w-1 rounded-full bg-muted/60" />
        <span>{conversation.modifiedAt}</span>
      </div>
    </button>
  );
}

function TreeIconButton({ children, label }: { children: ReactNode; label: string }): JSX.Element {
  return (
    <span
      aria-label={label}
      className="grid h-5 w-5 place-items-center rounded text-current transition hover:bg-surface/28"
      title={label}
    >
      {children}
    </span>
  );
}

