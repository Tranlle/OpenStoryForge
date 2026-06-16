import type { OpenStoryForgeWindowState } from "../shared/electron";
import { invokeIpc } from "./invoke-ipc";
import { ipcRenderer } from "electron";

export function createWindowControlsApi() {
  return {
    close: () => invokeIpc("window:close"),
    getState: () => invokeIpc("window:get-state") as Promise<OpenStoryForgeWindowState>,
    minimize: () => invokeIpc("window:minimize"),
    onStateChange: (callback: (state: OpenStoryForgeWindowState) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, state: OpenStoryForgeWindowState): void => {
        callback(state);
      };

      ipcRenderer.on("window:state-changed", handler);

      return () => {
        ipcRenderer.removeListener("window:state-changed", handler);
      };
    },
    toggleMaximize: () => invokeIpc("window:toggle-maximize")
  };
}
