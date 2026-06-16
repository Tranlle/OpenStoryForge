import { useState } from "react";

export function useProjectTreeState(): {
  isFolderExpanded: boolean;
  toggleFolderExpanded: () => void;
} {
  const [isFolderExpanded, setIsFolderExpanded] = useState(true);

  return {
    isFolderExpanded,
    toggleFolderExpanded: () => setIsFolderExpanded((current) => !current)
  };
}
