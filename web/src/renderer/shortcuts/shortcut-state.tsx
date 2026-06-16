import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { shortcutDescriptors, shortcutDescriptorMap } from "@renderer/shortcuts/commands";
import type { ShortcutCommandId, ShortcutDescriptor } from "@renderer/shortcuts/shortcut-types";

const shortcutStorageKey = "openstoryforge.desktop.shortcuts";

type ShortcutOverrides = Partial<Record<ShortcutCommandId, string>>;

type ShortcutStateContextValue = {
  descriptors: ShortcutDescriptor[];
  getBinding: (commandId: ShortcutCommandId) => string;
  resetBindings: () => void;
  setBinding: (commandId: ShortcutCommandId, binding: string) => void;
};

const ShortcutStateContext = createContext<ShortcutStateContextValue | null>(null);

function readOverrides(): ShortcutOverrides {
  try {
    const raw = window.localStorage.getItem(shortcutStorageKey);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as ShortcutOverrides;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function ShortcutStateProvider({ children }: { children: ReactNode }): JSX.Element {
  const [overrides, setOverrides] = useState<ShortcutOverrides>(readOverrides);

  useEffect(() => {
    window.localStorage.setItem(shortcutStorageKey, JSON.stringify(overrides));
  }, [overrides]);

  const globalBindings = useMemo(
    () =>
      shortcutDescriptors
        .filter((descriptor) => descriptor.scope === "global")
        .map((descriptor) => ({
          accelerator: overrides[descriptor.id] ?? descriptor.defaultBinding,
          commandId: descriptor.id
        })),
    [overrides]
  );

  useEffect(() => {
    void window.openStoryForge?.shortcuts?.registerGlobalBindings(globalBindings);
  }, [globalBindings]);

  const value = useMemo<ShortcutStateContextValue>(
    () => ({
      descriptors: shortcutDescriptors,
      getBinding: (commandId) => overrides[commandId] ?? shortcutDescriptorMap.get(commandId)?.defaultBinding ?? "",
      resetBindings: () => setOverrides({}),
      setBinding: (commandId, binding) =>
        setOverrides((current) => ({
          ...current,
          [commandId]: binding
        }))
    }),
    [overrides]
  );

  return <ShortcutStateContext.Provider value={value}>{children}</ShortcutStateContext.Provider>;
}

export function useShortcutState(): ShortcutStateContextValue {
  const context = useContext(ShortcutStateContext);

  if (!context) {
    throw new Error("useShortcutState must be used within ShortcutStateProvider");
  }

  return context;
}
