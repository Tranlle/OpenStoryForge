import * as Tooltip from "@radix-ui/react-tooltip";
import { Moon, Sparkles, Sun, Waves } from "lucide-react";

import { useI18n } from "@renderer/i18n/use-i18n";
import { Button } from "@renderer/components/primitives/button";
import { cn } from "@renderer/lib/utils";

export const themes = [
  {
    id: "paper-atelier",
    name: "Paper Atelier",
    labelKey: "theme.paper-atelier",
    icon: Sun
  },
  {
    id: "glass-script",
    name: "Glass Script",
    labelKey: "theme.glass-script",
    icon: Waves
  },
  {
    id: "ink-theater",
    name: "Ink Theater",
    labelKey: "theme.ink-theater",
    icon: Moon
  },
  {
    id: "signal-forge",
    name: "Signal Forge",
    labelKey: "theme.signal-forge",
    icon: Sparkles
  }
] as const;

export type ThemeId = (typeof themes)[number]["id"];

type ThemeSwitcherProps = {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
};

export function getNextThemeId(value: ThemeId): ThemeId {
  const selectedIndex = themes.findIndex((theme) => theme.id === value);
  return themes[(selectedIndex + 1) % themes.length]?.id ?? themes[0].id;
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps): JSX.Element {
  const { t } = useI18n();
  const selectedIndex = themes.findIndex((theme) => theme.id === value);
  const selectedTheme = themes[selectedIndex] ?? themes[0];
  const Icon = selectedTheme.icon;
  const selectedLabel = t(selectedTheme.labelKey);

  const handleCycleTheme = (): void => {
    onChange(getNextThemeId(value));
  };

  return (
    <Tooltip.Provider delayDuration={120}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            aria-label={t("theme.cycle", { label: selectedLabel })}
            className={cn(
              "h-9 rounded-control border border-border bg-surface/54 px-3 text-foreground shadow-panel hover:bg-surface",
              "gap-2 font-medium"
            )}
            onClick={handleCycleTheme}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
            <span className="truncate text-[12px]">{selectedLabel}</span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground shadow-lift"
            sideOffset={8}
          >
            {t("theme.clickToCycle")}
            <Tooltip.Arrow className="fill-surface" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
