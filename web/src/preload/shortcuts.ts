import { ipcRenderer } from "electron";

import type { RegisteredGlobalShortcut, ShortcutCommandId } from "../shared/electron";
import { invokeIpc } from "./invoke-ipc";

export function createShortcutsApi() {
  return {
    onCommand: (callback: (commandId: ShortcutCommandId) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, commandId: ShortcutCommandId): void => {
        callback(commandId);
      };

      ipcRenderer.on("shortcuts:command", handler);

      return () => {
        ipcRenderer.removeListener("shortcuts:command", handler);
      };
    },
    registerGlobalBindings: (bindings: RegisteredGlobalShortcut[]) =>
      invokeIpc("shortcuts:register-global-bindings", bindings)
  };
}
