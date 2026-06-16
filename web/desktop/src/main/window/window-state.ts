import type { BrowserWindow } from "electron";

import type { OpenStoryForgeWindowState } from "../../shared/electron";

export function readWindowState(window: BrowserWindow): OpenStoryForgeWindowState {
  return {
    isFullScreen: window.isFullScreen(),
    isMaximized: window.isMaximized()
  };
}

export function sendWindowState(window: BrowserWindow): void {
  window.webContents.send("window:state-changed", readWindowState(window));
}
