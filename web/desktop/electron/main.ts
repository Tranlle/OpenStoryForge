import { app, BrowserWindow, ipcMain, shell } from "electron";
import { join } from "node:path";

type WindowState = {
  isFullScreen: boolean;
  isMaximized: boolean;
};

const getActiveWindow = (): BrowserWindow | undefined =>
  BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];

const readWindowState = (window: BrowserWindow): WindowState => ({
  isFullScreen: window.isFullScreen(),
  isMaximized: window.isMaximized()
});

const sendWindowState = (window: BrowserWindow): void => {
  window.webContents.send("window:state-changed", readWindowState(window));
};

const registerWindowControls = (): void => {
  ipcMain.handle("window:minimize", () => {
    getActiveWindow()?.minimize();
  });

  ipcMain.handle("window:toggle-maximize", () => {
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

  ipcMain.handle("window:close", () => {
    getActiveWindow()?.close();
  });

  ipcMain.handle("window:get-state", () => {
    const window = getActiveWindow();
    return window ? readWindowState(window) : { isFullScreen: false, isMaximized: false };
  });
};

const createWindow = (): void => {
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
      sandbox: false,
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

  if (process.env.VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    return;
  }

  void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
};

app.whenReady().then(() => {
  registerWindowControls();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
