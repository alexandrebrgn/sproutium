import { useCallback, useEffect, useState } from 'react';
import {
  type HistoryEntry,
  getHistory,
  saveAnalysis,
  deleteAnalysis,
  clearHistory,
} from '@/lib/history';
import type { Organ, PlantNetResult } from '@/lib/plantnet';

export function usePlantHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await getHistory();
    setEntries(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (photoUri: string, organ: Organ, results: PlantNetResult[]) => {
      const entry = await saveAnalysis(photoUri, organ, results);
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await deleteAnalysis(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clear = useCallback(async () => {
    await clearHistory();
    setEntries([]);
  }, []);

  return { entries, loading, refresh, add, remove, clear };
}
