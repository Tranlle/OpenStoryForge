import { useEffect, useState } from "react";

import { AppShell } from "@renderer/components/layout/app-shell";
import { type ThemeId } from "@renderer/components/primitives/theme-switcher";
import { HomePage } from "@renderer/features/home/home-page";

const themeStorageKey = "openstoryforge.desktop.theme";

function readInitialTheme(): ThemeId {
  const stored = window.localStorage.getItem(themeStorageKey);

  if (
    stored === "paper-atelier" ||
    stored === "glass-script" ||
    stored === "ink-theater" ||
    stored === "signal-forge"
  ) {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "ink-theater" : "paper-atelier";
}

export function App(): JSX.Element {
  const [theme, setTheme] = useState<ThemeId>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  return (
    <AppShell theme={theme} onThemeChange={setTheme}>
      <HomePage />
    </AppShell>
  );
}
