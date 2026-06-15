import * as Tooltip from "@radix-ui/react-tooltip";
import { Moon, Sparkles, Sun, Waves } from "lucide-react";

import { Button } from "@renderer/components/primitives/button";
import { cn } from "@renderer/lib/utils";

export const themes = [
  {
    id: "paper-atelier",
    name: "Paper Atelier",
    label: "明亮编辑室",
    icon: Sun
  },
  {
    id: "glass-script",
    name: "Glass Script",
    label: "明亮玻璃稿台",
    icon: Waves
  },
  {
    id: "ink-theater",
    name: "Ink Theater",
    label: "暗黑剧场",
    icon: Moon
  },
  {
    id: "signal-forge",
    name: "Signal Forge",
    label: "暗黑信号熔炉",
    icon: Sparkles
  }
] as const;

export type ThemeId = (typeof themes)[number]["id"];

type ThemeSwitcherProps = {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
};

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps): JSX.Element {
  const selectedIndex = themes.findIndex((theme) => theme.id === value);
  const selectedTheme = themes[selectedIndex] ?? themes[0];
  const Icon = selectedTheme.icon;

  const handleCycleTheme = (): void => {
    const nextTheme = themes[(selectedIndex + 1) % themes.length] ?? themes[0];
    onChange(nextTheme.id);
  };

  return (
    <Tooltip.Provider delayDuration={120}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            aria-label={`切换主题，当前为 ${selectedTheme.label}`}
            className={cn(
              "h-9 rounded-control border border-border bg-surface/54 px-3 text-foreground shadow-panel hover:bg-surface",
              "gap-2 font-medium"
            )}
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleCycleTheme}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
            <span className="truncate text-[12px]">{selectedTheme.label}</span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-lift"
            sideOffset={8}
          >
            点击切换主题
            <Tooltip.Arrow className="fill-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
