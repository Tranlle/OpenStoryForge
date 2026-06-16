import { useEffect, useRef, useState, type ReactNode } from "react";

import { WindowTitleBar } from "@renderer/components/layout/window-title-bar";
import type { ThemeId } from "@renderer/components/primitives/theme-switcher";
import { cn } from "@renderer/lib/utils";

type DesktopShellProps = {
  children: ReactNode;
  mobileLabel: string;
  mobileSubtitle: string;
  onThemeChange: (theme: ThemeId) => void;
  sidebar: ReactNode;
  theme: ThemeId;
};

const scrollbarHideDelay = 800;

export function DesktopShell({
  children,
  mobileLabel,
  mobileSubtitle,
  onThemeChange,
  sidebar,
  theme
}: DesktopShellProps): JSX.Element {
  const scrollHideTimerRef = useRef<number | undefined>(undefined);
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,hsl(var(--accent)/0.16),transparent_34rem),radial-gradient(circle_at_88%_18%,hsl(var(--signal)/0.12),transparent_36rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--surface-strong)))]" />
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <WindowTitleBar theme={theme} onThemeChange={onThemeChange} />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {sidebar}

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background/10 backdrop-blur-[2px]">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/45 bg-surface/42 px-4 backdrop-blur-xl lg:hidden">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent font-display text-xs font-black text-accent-foreground">
                  OSF
                </div>
                <div>
                  <div className="font-display text-sm font-black">OpenStoryForge</div>
                  <div className="text-[11px] text-muted">{mobileSubtitle}</div>
                </div>
              </div>

              <div className="rounded-full border border-border/60 bg-surface/72 px-3 py-1 text-[11px] font-semibold text-muted">
                {mobileLabel}
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
