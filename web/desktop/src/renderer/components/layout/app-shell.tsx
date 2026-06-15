import { useEffect, useRef, useState, type ReactNode } from "react";

import { SidebarNav } from "@renderer/components/layout/sidebar-nav";
import type { AppNavItemId, ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import { WindowTitleBar } from "@renderer/components/layout/window-title-bar";
import type { ThemeId } from "@renderer/components/primitives/theme-switcher";
import { cn } from "@renderer/lib/utils";

type AppShellProps = {
  activeNav: AppNavItemId | null;
  children: ReactNode;
  onNavigate: (item: AppNavItemId) => void;
  onSelectConversation: (conversationId: string) => void;
  projectTree: ProjectTreeData;
  selectedConversationId: string | null;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
};

const scrollbarHideDelay = 800;

export function AppShell({
  activeNav,
  children,
  onNavigate,
  onSelectConversation,
  projectTree,
  selectedConversationId,
  onThemeChange,
  theme
}: AppShellProps): JSX.Element {
  const scrollHideTimerRef = useRef<number | undefined>(undefined);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    return () => {
      if (scrollHideTimerRef.current !== undefined) {
        window.clearTimeout(scrollHideTimerRef.current);
      }
    };
  }, []);

  const handleWorkspaceScroll = (): void => {
    setIsScrolling(true);

    if (scrollHideTimerRef.current !== undefined) {
      window.clearTimeout(scrollHideTimerRef.current);
    }

    scrollHideTimerRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, scrollbarHideDelay);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-95">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,hsl(var(--accent)/0.16),transparent_34rem),radial-gradient(circle_at_88%_18%,hsl(var(--signal)/0.12),transparent_36rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--surface-strong)))]" />
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <WindowTitleBar theme={theme} onThemeChange={onThemeChange} />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <SidebarNav
            activeNav={activeNav}
            isExpanded={isSidebarExpanded}
            onExpandChange={setIsSidebarExpanded}
            onNavigate={onNavigate}
            onSelectConversation={onSelectConversation}
            projectTree={projectTree}
            selectedConversationId={selectedConversationId}
          />

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background/10 backdrop-blur-[2px]">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/45 bg-surface/42 px-4 backdrop-blur-xl lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-xs font-black text-accent-foreground">
                  OSF
                </div>
                <div>
                  <div className="font-display text-sm font-black">OpenStoryForge</div>
                  <div className="text-[11px] text-muted">主页</div>
                </div>
              </div>
            </div>

            <main
              className={cn(
                "app-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
                isScrolling && "app-scrollbar-active"
              )}
              onScroll={handleWorkspaceScroll}
            >
              {children}
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}
