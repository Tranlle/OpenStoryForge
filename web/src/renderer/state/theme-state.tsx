import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { getNextThemeId, type ThemeId } from "@renderer/components/primitives/theme-switcher";

const themeStorageKey = "openstoryforge.desktop.theme";

type ThemeStateContextValue = {
  setTheme: (theme: ThemeId) => void;
  theme: ThemeId;
  toggleTheme: () => void;
};

const ThemeStateContext = createContext<ThemeStateContextValue | null>(null);

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

export function ThemeStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<ThemeId>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  return (
    <ThemeStateContext.Provider
      value={{
        setTheme,
        theme,
        toggleTheme: () => setTheme((current) => getNextThemeId(current))
      }}
    >
      {children}
    </ThemeStateContext.Provider>
  );
}

export function useThemeState(): ThemeStateContextValue {
  const context = useContext(ThemeStateContext);

  if (!context) {
    throw new Error("useThemeState must be used within ThemeStateProvider");
  }

  return context;
}
