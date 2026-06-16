import type { ReactNode } from "react";

import { useAppState as useStoreState } from "@renderer/state/app-store";

export function AppStateProvider({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}

export function useAppState() {
  return useStoreState();
}
