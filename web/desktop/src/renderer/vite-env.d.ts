/// <reference types="vite/client" />

export type OpenStoryForgeAppInfo = {
  name: string;
  platform: NodeJS.Platform | "browser";
  versions: {
    chrome: string;
    electron: string;
    node: string;
  };
};

export type OpenStoryForgeWindowState = {
  isFullScreen: boolean;
  isMaximized: boolean;
};

declare global {
  interface Window {
    openStoryForge?: {
      getAppInfo: () => OpenStoryForgeAppInfo;
      windowControls: {
        close: () => Promise<void>;
        getState: () => Promise<OpenStoryForgeWindowState>;
        minimize: () => Promise<void>;
        onStateChange: (callback: (state: OpenStoryForgeWindowState) => void) => () => void;
        toggleMaximize: () => Promise<void>;
      };
    };
  }
}
