import { PanelRightClose, PanelRightOpen } from "lucide-react";

import { projectTabs } from "@renderer/features/home/home.data";
import { ProjectDrawerChaptersTab } from "@renderer/features/home/project-drawer-chapters-tab";
import { ProjectDrawerDirectoryTab } from "@renderer/features/home/project-drawer-directory-tab";
import { ProjectDrawerNodesTab } from "@renderer/features/home/project-drawer-nodes-tab";
import { ProjectDrawerOutlineTab } from "@renderer/features/home/project-drawer-outline-tab";
import type { ProjectTabId } from "@renderer/features/home/home.types";
import { cn } from "@renderer/lib/utils";

type ProjectDrawerProps = {
  activeTab: ProjectTabId;
  isOpen: boolean;
  onTabChange: (tab: ProjectTabId) => void;
  onToggle: () => void;
};

export function ProjectDrawer({ activeTab, isOpen, onTabChange, onToggle }: ProjectDrawerProps): JSX.Element {
  return (
    <aside
      className={cn(
        "relative z-20 flex min-h-0 shrink-0 overflow-hidden bg-surface/22 shadow-[inset_1px_0_0_hsl(var(--border)/0.20)] backdrop-blur-xl transition-[width] duration-300 ease-out",
        isOpen ? "w-[410px]" : "w-[72px]"
      )}
      data-reveal
    >
      <div className="flex h-full w-[72px] shrink-0 flex-col items-center py-2">
        <div className="flex h-12 shrink-0 items-center justify-center">
          <button
            aria-label={isOpen ? "收起页面栏" : "展开页面栏"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background/18 text-muted transition hover:bg-surface/46 hover:text-foreground"
            onClick={onToggle}
            type="button"
          >
            {isOpen ? (
              <PanelRightClose aria-hidden="true" className="h-4 w-4" />
            ) : (
              <PanelRightOpen aria-hidden="true" className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2 py-3">
          {projectTabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                aria-label={tab.label}
                aria-pressed={selected}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl text-muted transition hover:bg-surface/46 hover:text-foreground",
                  selected && "bg-foreground text-background shadow-[0_10px_24px_hsl(var(--foreground)/0.14)]"
                )}
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);

                  if (!isOpen) {
                    onToggle();
                  }
                }}
                title={tab.label}
                type="button"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden={!isOpen}
        className={cn(
          "app-scrollbar min-h-0 w-[338px] shrink-0 overflow-y-auto bg-surface/30 p-4 transition duration-300 ease-out",
          isOpen ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-4 opacity-0"
        )}
      >
        {activeTab === "directory" ? <ProjectDrawerDirectoryTab /> : null}
        {activeTab === "outline" ? <ProjectDrawerOutlineTab /> : null}
        {activeTab === "chapters" ? <ProjectDrawerChaptersTab /> : null}
        {activeTab === "nodes" ? <ProjectDrawerNodesTab /> : null}
      </div>
    </aside>
  );
}
