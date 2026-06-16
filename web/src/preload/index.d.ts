import type { OpenStoryForgeDesktopApi } from "../shared/electron";

declare global {
  interface Window {
    openStoryForge?: OpenStoryForgeDesktopApi;
  }
}

export {};
