import { useEffect } from "react";

import { useShortcutState } from "@renderer/shortcuts/shortcut-state";
import type { ShortcutCommandId, ShortcutRouteScope } from "@renderer/shortcuts/shortcut-types";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable ||
    target.getAttribute("role") === "textbox"
  );
}

function normalizePageBinding(binding: string): string[] {
  return binding
    .replaceAll("CommandOrControl", "Mod")
    .replaceAll("Ctrl", "Control")
    .split("+")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function eventMatchesBinding(event: KeyboardEvent, binding: string): boolean {
  const parts = normalizePageBinding(binding);
  const keyToken = parts.at(-1)?.toLowerCase();
  const modifierTokens = new Set(parts.slice(0, -1).map((token) => token.toLowerCase()));

  const expectsMod = modifierTokens.has("mod");
  const expectsControl = modifierTokens.has("control");
  const expectsMeta = modifierTokens.has("meta");
  const expectsAlt = modifierTokens.has("alt");
  const expectsShift = modifierTokens.has("shift");

  const modPressed = navigator.platform.toLowerCase().includes("mac") ? event.metaKey : event.ctrlKey;
  const currentKey = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();

  return (
    modPressed === expectsMod &&
    event.ctrlKey === expectsControl &&
    event.metaKey === expectsMeta &&
    event.altKey === expectsAlt &&
    event.shiftKey === expectsShift &&
    currentKey === keyToken
  );
}

export function useShortcutHandlers(
  routeScope: ShortcutRouteScope,
  handlers: Partial<Record<ShortcutCommandId, () => void>>
): void {
  const { descriptors, getBinding } = useShortcutState();

  useEffect(() => {
    const runCommand = (commandId: ShortcutCommandId): void => {
      handlers[commandId]?.();
    };

    const removeGlobalListener =
      window.openStoryForge?.shortcuts?.onCommand((commandId) => {
        runCommand(commandId);
      }) ?? (() => undefined);

    const handleKeyDown = (event: KeyboardEvent): void => {
      for (const descriptor of descriptors) {
        if (descriptor.scope !== "page") {
          continue;
        }

        if (descriptor.routeScope !== "any" && descriptor.routeScope !== routeScope) {
          continue;
        }

        if (isEditableTarget(event.target) && !descriptor.allowInInput) {
          continue;
        }

        if (!eventMatchesBinding(event, getBinding(descriptor.id))) {
          continue;
        }

        event.preventDefault();
        runCommand(descriptor.id);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      removeGlobalListener();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [descriptors, getBinding, handlers, routeScope]);
}
