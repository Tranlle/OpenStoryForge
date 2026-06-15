import { Home } from "lucide-react";
import type { ReactNode } from "react";

import { Surface } from "@renderer/components/primitives/surface";
import { ThemeSwitcher, type ThemeId } from "@renderer/components/primitives/theme-switcher";

type AppShellProps = {
  children: ReactNode;
  theme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
};

export function AppShell({
  children,
  onThemeChange,
  theme
}: AppShellProps): JSX.Element {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden p-4 text-foreground md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1760px] grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Surface className="flex flex-col justify-between gap-10 p-4" tone="transparent">
          <div>
            <div className="mb-8 flex items-center gap-3 px-2 pt-2">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent font-display text-sm font-black text-accent-foreground shadow-lift">
                OSF
              </div>
              <div>
                <div className="font-display text-base font-black">OpenStoryForge</div>
                <div className="text-xs text-muted">视觉小说创作底座</div>
              </div>
            </div>

            <nav aria-label="主导航" className="space-y-2">
              <button
                className="flex w-full items-center gap-3 rounded-2xl bg-accent px-4 py-3 text-left text-sm font-bold text-accent-foreground shadow-lift"
                type="button"
              >
                <Home aria-hidden="true" className="h-4 w-4" />
                主页
              </button>
            </nav>
          </div>

          <div className="space-y-4 px-2 pb-2">
            <ThemeSwitcher value={theme} onChange={onThemeChange} />
            <div className="h-px bg-border" />
            <div className="text-xs leading-6 text-muted">
              菜单保持克制。后续新增作品、角色、Agent 或设置入口时，会从这里扩展。
            </div>
          </div>
        </Surface>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
