import { useState } from "react";

export function useSidebarNavState(): {
  isMoreExpanded: boolean;
  toggleMoreExpanded: () => void;
} {
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  return {
    isMoreExpanded,
    toggleMoreExpanded: () => setIsMoreExpanded((current) => !current)
  };
}
