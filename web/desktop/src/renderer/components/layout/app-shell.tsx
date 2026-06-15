import { Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { ThemeId } from "@renderer/components/primitives/theme-switcher";
import { WindowTitleBar } from "@renderer/components/layout/window-title-bar";
import { cn } from "@renderer/lib/utils";

type AppShellProps = {
  children: ReactNode;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
};

const scrollbarHideDelay = 800;

export function AppShell({ children, onThemeChange, theme }: AppShellProps): JSX.Element {
  const scrollHideTimerRef = useRef<number | undefined>(undefined);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,hsl(var(--accent)/0.22),transparent_34rem),radial-gradient(circle_at_88%_18%,hsl(var(--signal)/0.16),transparent_36rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--surface-strong)))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <WindowTitleBar theme={theme} onThemeChange={onThemeChange} />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside
            className={cn(
              "hidden shrink-0 border-r border-border/70 bg-surface/38 backdrop-blur-2xl transition-[width] duration-300 ease-out lg:flex lg:flex-col",
              isSidebarExpanded ? "w-[280px]" : "w-[76px]"
            )}
          >
            <div
              className={cn(
                "flex h-12 shrink-0 items-center border-b border-border/35 px-3",
                isSidebarExpanded ? "justify-end" : "justify-center"
              )}
            >
              <button
                aria-label={isSidebarExpanded ? "收起导航栏" : "展开导航栏"}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border/70 bg-background/26 text-muted transition hover:bg-surface/58 hover:text-foreground"
                onClick={() => setIsSidebarExpanded((current) => !current)}
                title={isSidebarExpanded ? "收起导航栏" : "展开导航栏"}
                type="button"
              >
                {isSidebarExpanded ? (
                  <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
            </div>

            <nav
              aria-label="主导航"
              className={cn("flex-1 py-4", isSidebarExpanded ? "px-4" : "px-2")}
            >
              <button
                className={cn(
                  "group flex w-full items-center rounded-2xl bg-foreground text-left text-sm font-bold text-background shadow-lift transition hover:translate-x-1",
                  isSidebarExpanded ? "justify-between px-4 py-3" : "justify-center px-0 py-3"
                )}
                type="button"
              >
                <span className={cn("flex items-center", isSidebarExpanded ? "gap-3" : "gap-0")}>
                  <Home aria-hidden="true" className="h-4 w-4" />
                  <span className={cn(isSidebarExpanded ? "inline" : "sr-only")}>主页</span>
                </span>
                {isSidebarExpanded ? (
                  <PanelLeftClose aria-hidden="true" className="h-4 w-4 opacity-50 transition group-hover:opacity-90" />
                ) : null}
              </button>
            </nav>

            {isSidebarExpanded ? (
              <div className="border-t border-border/60 px-4 py-5">
                <p className="text-xs leading-6 text-muted">
                  当前只保留主页。后续新增模块时，从同一导航轨道扩展，不预先制造空菜单。
                </p>
              </div>
            ) : null}
          </aside>

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background/18">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-surface/26 px-4 backdrop-blur-2xl lg:hidden">
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
