import { useEffect, useState } from "react";

import type { ThemeId } from "@renderer/components/primitives/theme-switcher";

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

export function useThemeState(): {
  setTheme: (theme: ThemeId) => void;
  theme: ThemeId;
} {
  const [theme, setTheme] = useState<ThemeId>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  return { setTheme, theme };
}
