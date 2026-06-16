import { createContext, startTransition, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { messages, supportedLocales, type AppLocale } from "@renderer/i18n/messages";

const localeStorageKey = "openstoryforge.desktop.locale";

type LocaleStateContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LocaleStateContext = createContext<LocaleStateContextValue | null>(null);

function isSupportedLocale(value: string | null): value is AppLocale {
  return Boolean(value && supportedLocales.includes(value as AppLocale));
}

function readInitialLocale(): AppLocale {
  const stored = window.localStorage.getItem(localeStorageKey);

  if (isSupportedLocale(stored)) {
    return stored;
  }

  const browserLocale = window.navigator.language;

  if (browserLocale.startsWith("zh")) {
    return "zh-CN";
  }

  if (browserLocale.startsWith("ja")) {
    return "ja-JP";
  }

  return "en-US";
}

function resolveMessage(locale: AppLocale, key: string): string | null {
  const segments = key.split(".");
  let current: unknown = messages[locale];

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : null;
}

function interpolateMessage(template: string, vars?: Record<string, string | number>): string {
  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_match, token: string) => {
    const value = vars[token];
    return value === undefined ? `{${token}}` : String(value);
  });
}

export function LocaleStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const [locale, setLocaleState] = useState<AppLocale>(readInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(localeStorageKey, locale);
  }, [locale]);

  const value = useMemo<LocaleStateContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        startTransition(() => {
          setLocaleState(nextLocale);
        });
      },
      t: (key, vars) => {
        const localized = resolveMessage(locale, key) ?? resolveMessage("en-US", key) ?? key;
        return interpolateMessage(localized, vars);
      }
    }),
    [locale]
  );

  return <LocaleStateContext.Provider value={value}>{children}</LocaleStateContext.Provider>;
}

export function useLocaleState(): LocaleStateContextValue {
  const context = useContext(LocaleStateContext);

  if (!context) {
    throw new Error("useLocaleState must be used within LocaleStateProvider");
  }

  return context;
}
