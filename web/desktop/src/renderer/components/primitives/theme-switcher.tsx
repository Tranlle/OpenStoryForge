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
  return (
    <Tooltip.Provider delayDuration={120}>
      <div className="flex items-center gap-2 rounded-control border border-border bg-surface/54 p-1 shadow-panel">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const selected = value === theme.id;

          return (
            <Tooltip.Root key={theme.id}>
              <Tooltip.Trigger asChild>
                <Button
                  aria-label={`切换到${theme.label}`}
                  className={cn(
                    "h-9 w-9 rounded-control",
                    selected && "bg-accent text-accent-foreground hover:brightness-100"
                  )}
                  size="icon"
                  type="button"
                  variant={selected ? "primary" : "ghost"}
                  onClick={() => onChange(theme.id)}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="z-50 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-lift"
                  sideOffset={8}
                >
                  {theme.name} · {theme.label}
                  <Tooltip.Arrow className="fill-surface" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </div>
    </Tooltip.Provider>
  );
}
