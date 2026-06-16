import { BrowserWindow, app, globalShortcut } from "electron";

import type { RegisteredGlobalShortcut } from "@shared/electron";
import { handleIpc } from "../ipc/handle-ipc";

let activeBindings = new Map<string, string>();

function getMainWindow(): BrowserWindow | undefined {
  return BrowserWindow.getAllWindows()[0];
}

function dispatchCommand(commandId: string): void {
  const window = getMainWindow();

  if (!window) {
    return;
  }

  if (!window.isVisible()) {
    window.show();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
  window.webContents.send("shortcuts:command", commandId);
}

function registerBindings(bindings: RegisteredGlobalShortcut[]): void {
  globalShortcut.unregisterAll();
  activeBindings = new Map();

  for (const binding of bindings) {
    if (!binding.accelerator.trim()) {
      continue;
    }

    const registered = globalShortcut.register(binding.accelerator, () => {
      dispatchCommand(binding.commandId);
    });

    if (registered) {
      activeBindings.set(binding.commandId, binding.accelerator);
    }
  }
}

export function registerGlobalShortcuts(): void {
  handleIpc("shortcuts:register-global-bindings", (bindings) => {
    registerBindings(bindings);
    return {
      registeredCommandIds: Array.from(activeBindings.keys())
    };
  });

  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
}
