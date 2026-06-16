import { app, BrowserWindow } from "electron";

import { registerWindowControls } from "./ipc/register-window-controls";
import { log } from "./logger";
import { registerGlobalShortcuts } from "./shortcuts/register-global-shortcuts";
import { createMainWindow } from "./window/create-main-window";

app.whenReady().then(() => {
  log.info("OpenStoryForge desktop starting");
  registerGlobalShortcuts();
  registerWindowControls();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  log.info("All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});
