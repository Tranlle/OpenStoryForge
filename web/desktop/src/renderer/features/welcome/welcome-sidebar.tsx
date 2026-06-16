import {
  FolderTree,
  LayoutDashboard,
  ListTree,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@renderer/lib/utils";

export type WelcomeSectionId = "project-tree" | "projects" | "quick-start" | "settings" | "tokens";

const navItems: Array<{ id: WelcomeSectionId; icon: typeof Sparkles; label: string }> = [
  { id: "quick-start", icon: Sparkles, label: "快速开始" },
  { id: "projects", icon: ListTree, label: "项目清单" },
  { id: "tokens", icon: LayoutDashboard, label: "Token 用量" },
  { id: "project-tree", icon: FolderTree, label: "项目树" },
  { id: "settings", icon: Settings, label: "设置" }
];

const menuFollowDelayMs = 40;

export function WelcomeSidebar({
  activeSection,
  isExpanded,
  onExpandChange,
  onSelectSection
}: {
  activeSection: WelcomeSectionId;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
  onSelectSection: (section: WelcomeSectionId) => void;
}): JSX.Element {
  const animationTimerRef = useRef<number | undefined>(undefined);
  const [isMenuExpanded, setIsMenuExpanded] = useState(isExpanded);
  const [isWidthExpanded, setIsWidthExpanded] = useState(isExpanded);

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
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Welcome</div>
              <div className="font-display text-sm font-black">Project launcher</div>
            </div>
            <button
              aria-label="Collapse sidebar"
              className="grid h-10 w-10 place-items-center rounded-xl bg-background/14 text-muted transition hover:bg-surface/46 hover:text-foreground"
              onClick={() => onExpandChange(false)}
              title="Collapse sidebar"
              type="button"
            >
              <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            aria-label="Expand sidebar"
            className="absolute right-3 top-2 hidden h-10 w-10 place-items-center rounded-xl bg-background/14 text-muted transition hover:bg-surface/46 hover:text-foreground lg:grid"
            onClick={() => onExpandChange(true)}
            title="Expand sidebar"
            type="button"
          >
            <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <div
          className={cn(
            "space-y-1 transition-[opacity,transform] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isMenuExpanded ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-5 opacity-0"
          )}
        >
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
    </aside>
  );
}
