import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { appRouter } from "@renderer/app/router";
import { AppStateProvider } from "@renderer/state/app-state";
import { queryClient } from "@renderer/state/query-client";
import { ThemeStateProvider } from "@renderer/state/theme-state";

export function App(): JSX.Element {
  return (
    <ThemeStateProvider>
      <QueryClientProvider client={queryClient}>
        <AppStateProvider>
          <RouterProvider router={appRouter} />
        </AppStateProvider>
      </QueryClientProvider>
    </ThemeStateProvider>
  );
}
