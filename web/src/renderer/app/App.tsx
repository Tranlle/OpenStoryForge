import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { appRouter } from "@renderer/app/router";
import { LocaleStateProvider } from "@renderer/i18n/locale-state";
import { AppStateProvider } from "@renderer/state/app-state";
import { queryClient } from "@renderer/state/query-client";
import { ShortcutStateProvider } from "@renderer/shortcuts/shortcut-state";
import { ThemeStateProvider } from "@renderer/state/theme-state";

export function App(): JSX.Element {
  return (
    <ThemeStateProvider>
      <LocaleStateProvider>
        <ShortcutStateProvider>
          <QueryClientProvider client={queryClient}>
            <AppStateProvider>
              <RouterProvider router={appRouter} />
            </AppStateProvider>
          </QueryClientProvider>
        </ShortcutStateProvider>
      </LocaleStateProvider>
    </ThemeStateProvider>
  );
}
