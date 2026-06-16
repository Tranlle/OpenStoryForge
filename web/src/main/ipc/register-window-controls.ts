import { BrowserWindow } from "electron";

import { handleIpc } from "./handle-ipc";
import { readWindowState } from "../window/window-state";

function getActiveWindow(): BrowserWindow | undefined {
  return BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
}

export function registerWindowControls(): void {
  handleIpc("window:minimize", () => {
    getActiveWindow()?.minimize();
  });

  handleIpc("window:toggle-maximize", () => {
    const window = getActiveWindow();

    if (!window) {
      return;
    }

    if (window.isMaximized()) {
      window.unmaximize();
      return;
    }

    window.maximize();
  });

  handleIpc("window:close", () => {
    getActiveWindow()?.close();
  });

  handleIpc("window:get-state", () => {
    const window = getActiveWindow();
    return window ? readWindowState(window) : { isFullScreen: false, isMaximized: false };
  });
}
