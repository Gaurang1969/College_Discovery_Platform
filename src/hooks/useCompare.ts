import { useState } from "react";

interface UseCompareReturn {
  compareIds: string[];
  addCollege: (id: string) => void;
  removeCollege: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export function useCompare(): UseCompareReturn {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const addCollege = (id: string) => {
    if (compareIds.length >= 3) return;
    if (compareIds.includes(id)) return;
    setCompareIds((prev) => [...prev, id]);
  };

  const removeCollege = (id: string) => {
    setCompareIds((prev) => prev.filter((c) => c !== id));
  };

  const clearCompare = () => setCompareIds([]);

  const isInCompare = (id: string) => compareIds.includes(id);

  return {
    compareIds,
    addCollege,
    removeCollege,
    clearCompare,
    isInCompare,
  };
}