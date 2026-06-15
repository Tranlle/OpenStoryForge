/// <reference types="vite/client" />

export type OpenStoryForgeAppInfo = {
  name: string;
  platform: NodeJS.Platform;
  versions: {
    chrome: string;
    electron: string;
    node: string;
  };
};

declare global {
  interface Window {
    openStoryForge: {
      getAppInfo: () => OpenStoryForgeAppInfo;
    };
  }
}
