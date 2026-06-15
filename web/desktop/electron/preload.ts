import { contextBridge, ipcRenderer } from "electron";

type WindowState = {
  isFullScreen: boolean;
  isMaximized: boolean;
};

contextBridge.exposeInMainWorld("openStoryForge", {
  getAppInfo: () => ({
    name: "OpenStoryForge",
    platform: process.platform,
    versions: {
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      node: process.versions.node
    }
  }),
  windowControls: {
    close: () => ipcRenderer.invoke("window:close"),
    getState: () => ipcRenderer.invoke("window:get-state") as Promise<WindowState>,
    minimize: () => ipcRenderer.invoke("window:minimize"),
    onStateChange: (callback: (state: WindowState) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, state: WindowState): void => {
        callback(state);
      };

      ipcRenderer.on("window:state-changed", handler);

      return () => {
        ipcRenderer.removeListener("window:state-changed", handler);
      };
    },
    toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize")
  }
});
