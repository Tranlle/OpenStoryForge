import { ChevronDown, ChevronUp, Home, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { overflowNavItems, primaryNavItems, secondaryNavItems } from "@renderer/components/layout/app-shell.data";
import type { AppNavItemId, ProjectTreeData } from "@renderer/components/layout/app-shell.types";
import { ProjectTreePanel } from "@renderer/components/layout/project-tree-panel";
import { useSidebarNavState } from "@renderer/components/layout/use-sidebar-nav-state";
import { useI18n } from "@renderer/i18n/use-i18n";
import { cn } from "@renderer/lib/utils";

type SidebarNavProps = {
  activeNav: AppNavItemId | null;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
  onNavigate: (item: AppNavItemId) => void;
  onReturnHome: () => void;
  onSelectConversation: (conversationId: string) => void;
  projectTree: ProjectTreeData;
  selectedConversationId: string | null;
};

const menuFollowDelayMs = 40;

export function SidebarNav({
  activeNav,
  isExpanded,
  onExpandChange,
  onNavigate,
  onReturnHome,
  onSelectConversation,
  projectTree,
  selectedConversationId
}: SidebarNavProps): JSX.Element {
  const { t } = useI18n();
  const { isMoreExpanded, toggleMoreExpanded } = useSidebarNavState();
  const animationTimerRef = useRef<number | undefined>(undefined);
  const [isMenuExpanded, setIsMenuExpanded] = useState(isExpanded);
  const [isTreeVisible, setIsTreeVisible] = useState(isExpanded);
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
      setIsTreeVisible(true);

      animationTimerRef.current = window.setTimeout(() => {
        setIsMenuExpanded(true);
      }, menuFollowDelayMs);

      return;
    }

    setIsTreeVisible(false);

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
        <button
          aria-label={t("shell.backToWelcome")}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl bg-background/14 text-muted transition hover:bg-surface/46 hover:text-foreground",
            !isWidthExpanded && "hidden"
          )}
          onClick={onReturnHome}
          title={t("shell.backToWelcome")}
          type="button"
        >
          <Home aria-hidden="true" className="h-4 w-4" />
        </button>

        {isWidthExpanded ? (
          <button
            aria-label={t("shell.collapseSidebar")}
            className="grid h-10 w-10 place-items-center rounded-xl bg-background/14 text-muted transition hover:bg-surface/46 hover:text-foreground"
            onClick={() => onExpandChange(false)}
            title={t("shell.collapseSidebar")}
            type="button"
          >
            <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
          </button>
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
                  "min-h-[228px] max-h-[52%] shrink-0 overflow-hidden border-b border-border/[0.03] transition-[opacity,transform] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isMenuExpanded
                    ? "origin-left translate-x-0 scale-x-100 opacity-100"
                    : "pointer-events-none origin-right translate-x-5 scale-x-[0.86] opacity-0"
                )}
              >
                <div className="app-scrollbar h-full overflow-y-auto px-2 py-1.5">
                  <div className="space-y-0.5">
                    {primaryNavItems.map((item) => (
                      <SidebarNavButton
                        active={activeNav === item.id}
                        compact={!isWidthExpanded}
                        icon={item.icon}
                        key={item.id}
                        label={t(item.labelKey)}
                        onClick={() => onNavigate(item.id)}
                      />
                    ))}

                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300 ease-out",
                        isMoreExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-1 pt-1">
                          {overflowNavItems.map((item) => (
                            <SidebarPlaceholderButton
                              compact={!isWidthExpanded}
                              icon={item.icon}
                              key={item.labelKey}
                              label={t(item.labelKey)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      aria-expanded={isMoreExpanded}
                      className={cn(
                        "flex w-full items-center rounded-2xl text-sm font-medium text-muted transition hover:bg-surface/38 hover:text-foreground",
                        isWidthExpanded ? "px-4 py-2.5" : "justify-center px-0 py-2.5"
                      )}
                      onClick={toggleMoreExpanded}
                      type="button"
                    >
                      {isMoreExpanded ? (
                        <>
                          {isWidthExpanded ? <span className="flex-1" /> : null}
                          <ChevronUp aria-hidden="true" className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span className={cn("flex-1 text-left", !isWidthExpanded && "hidden")}>{t("nav.more")}</span>
                          <ChevronDown aria-hidden="true" className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <ProjectTreePanel
                isSidebarExpanded={isTreeVisible}
                onSelectConversation={onSelectConversation}
                projectTree={projectTree}
                selectedConversationId={selectedConversationId}
              />
            </div>
          </section>

          <section className="basis-[14.285714%]">
            <div className="flex h-full flex-col justify-end px-2 py-1.5">
              <div className="space-y-0.5">
                {secondaryNavItems.map((item) => (
                  <SidebarNavButton
                    active={activeNav === item.id}
                    compact={!isWidthExpanded}
                    icon={item.icon}
                    key={item.id}
                    label={t(item.labelKey)}
                    onClick={() => onNavigate(item.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}

function SidebarNavButton({
  active,
  compact,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  compact: boolean;
  icon: typeof Home;
  label: string;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "flex w-full items-center rounded-2xl text-left text-sm font-medium transition",
        compact ? "justify-center px-0 py-2.5" : "gap-3 px-4 py-2.5",
        active
          ? "bg-foreground text-background shadow-[0_14px_28px_hsl(var(--foreground)/0.14)]"
          : "bg-transparent text-muted hover:bg-surface/38 hover:text-foreground"
      )}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {!compact ? <span>{label}</span> : null}
    </button>
  );
}

function SidebarPlaceholderButton({
  compact,
  icon: Icon,
  label
}: {
  compact: boolean;
  icon: typeof Home;
  label: string;
}): JSX.Element {
  return (
    <div
      className={cn(
        "flex w-full items-center rounded-2xl text-left text-sm font-medium transition",
        compact
          ? "justify-center px-0 py-2.5 text-muted hover:bg-surface/38 hover:text-foreground"
          : "gap-3 px-4 py-2.5 text-muted hover:bg-surface/38 hover:text-foreground"
      )}
      title={label}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {!compact ? <span>{label}</span> : null}
    </div>
  );
}
