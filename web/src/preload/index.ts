import { contextBridge } from "electron";

import type { OpenStoryForgeDesktopApi } from "../shared/electron";
import { createWindowControlsApi } from "./window-controls";

const desktopApi: OpenStoryForgeDesktopApi = {
  getAppInfo: () => ({
    name: "OpenStoryForge",
    platform: process.platform,
    versions: {
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      node: process.versions.node
    }
  }),
  windowControls: createWindowControlsApi()
};

contextBridge.exposeInMainWorld("openStoryForge", desktopApi);
