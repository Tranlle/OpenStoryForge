import type { ShortcutCommandId, ShortcutDescriptor } from "@renderer/shortcuts/shortcut-types";

export const shortcutDescriptors: ShortcutDescriptor[] = [
  {
    id: "app.gotoWelcome",
    labelKey: "shortcuts.commands.app.gotoWelcome",
    scope: "global",
    routeScope: "any",
    defaultBinding: "CommandOrControl+Alt+1"
  },
  {
    id: "app.gotoHome",
    labelKey: "shortcuts.commands.app.gotoHome",
    scope: "global",
    routeScope: "any",
    defaultBinding: "CommandOrControl+Alt+2"
  },
  {
    id: "app.toggleTheme",
    labelKey: "shortcuts.commands.app.toggleTheme",
    scope: "page",
    routeScope: "any",
    defaultBinding: "Mod+Shift+T"
  },
  {
    id: "welcome.quickStart",
    labelKey: "shortcuts.commands.welcome.quickStart",
    scope: "page",
    routeScope: "welcome",
    defaultBinding: "Mod+1"
  },
  {
    id: "welcome.projects",
    labelKey: "shortcuts.commands.welcome.projects",
    scope: "page",
    routeScope: "welcome",
    defaultBinding: "Mod+2"
  },
  {
    id: "welcome.tokens",
    labelKey: "shortcuts.commands.welcome.tokens",
    scope: "page",
    routeScope: "welcome",
    defaultBinding: "Mod+3"
  },
  {
    id: "welcome.settings",
    labelKey: "shortcuts.commands.welcome.settings",
    scope: "page",
    routeScope: "welcome",
    defaultBinding: "Mod+,"
  },
  {
    id: "home.newConversation",
    labelKey: "shortcuts.commands.home.newConversation",
    scope: "page",
    routeScope: "home",
    defaultBinding: "Mod+N"
  },
  {
    id: "home.returnWelcome",
    labelKey: "shortcuts.commands.home.returnWelcome",
    scope: "page",
    routeScope: "home",
    defaultBinding: "Mod+Shift+H"
  }
];

export const shortcutDescriptorMap = new Map<ShortcutCommandId, ShortcutDescriptor>(
  shortcutDescriptors.map((descriptor) => [descriptor.id, descriptor])
);
