import { useState, useCallback, useEffect } from "react";
import type { Profession } from "@/game/vocabularyData";

const STORAGE_KEY = "germanllama-professions";

function loadFromStorage(): Profession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Profession[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return []; // empty = all professions
}

function saveToStorage(professions: Profession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(professions));
}

export function useProfessionFilter() {
  const [selected, setSelected] = useState<Profession[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(selected);
  }, [selected]);

  const toggle = useCallback((p: Profession) => {
    setSelected((prev) => {
      if (prev.includes(p)) {
        return prev.filter((x) => x !== p);
      }
      return [...prev, p];
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected([]);
  }, []);

  const isAllSelected = selected.length === 0;

  return { selected, toggle, selectAll, isAllSelected };
}
