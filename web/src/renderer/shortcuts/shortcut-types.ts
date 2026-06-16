export type ShortcutScope = "global" | "page";
export type ShortcutRouteScope = "any" | "welcome" | "home";

export type ShortcutCommandId =
  | "app.gotoWelcome"
  | "app.gotoHome"
  | "app.toggleTheme"
  | "welcome.quickStart"
  | "welcome.projects"
  | "welcome.tokens"
  | "welcome.settings"
  | "home.newConversation"
  | "home.returnWelcome";

export type ShortcutDescriptor = {
  allowInInput?: boolean;
  defaultBinding: string;
  id: ShortcutCommandId;
  labelKey: string;
  routeScope: ShortcutRouteScope;
  scope: ShortcutScope;
};
