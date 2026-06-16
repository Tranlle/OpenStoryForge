import { BrowserWindow, shell } from "electron";
import { join } from "node:path";

import { sendWindowState } from "./window-state";

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1120,
    minHeight: 760,
    title: "OpenStoryForge",
    backgroundColor: "#11100f",
    frame: false,
    show: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on("enter-full-screen", () => sendWindowState(mainWindow));
  mainWindow.on("leave-full-screen", () => sendWindowState(mainWindow));
  mainWindow.on("maximize", () => sendWindowState(mainWindow));
  mainWindow.on("unmaximize", () => sendWindowState(mainWindow));
  mainWindow.on("restore", () => sendWindowState(mainWindow));

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    sendWindowState(mainWindow);
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL ?? process.env.VITE_DEV_SERVER_URL;

  if (rendererUrl) {
    void mainWindow.loadURL(rendererUrl);
    return mainWindow;
  }

  void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  return mainWindow;
}
