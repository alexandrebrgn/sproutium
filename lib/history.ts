import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import type { Organ, PlantNetResult } from './plantnet';

const STORAGE_KEY = '@sproutium/history';
const PHOTOS_DIR = `${FileSystem.documentDirectory}plants/`;

export type HistoryEntry = {
  id: string;
  date: string;
  photoPath: string;
  organ: Organ;
  topScientificName: string;
  topCommonName: string | null;
  topScore: number;
  results: PlantNetResult[];
};

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

function uuid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function saveAnalysis(
  photoUri: string,
  organ: Organ,
  results: PlantNetResult[],
): Promise<HistoryEntry> {
  await ensureDir();
  const id = uuid();
  const ext = photoUri.split('.').pop()?.toLowerCase() || 'jpg';
  const photoPath = `${PHOTOS_DIR}${id}.${ext}`;
  await FileSystem.copyAsync({ from: photoUri, to: photoPath });

  const top = results[0];
  const entry: HistoryEntry = {
    id,
    date: new Date().toISOString(),
    photoPath,
    organ,
    topScientificName: top?.species.scientificNameWithoutAuthor ?? 'Unknown',
    topCommonName: top?.species.commonNames?.[0] ?? null,
    topScore: top?.score ?? 0,
    results,
  };

  const list = await getHistory();
  list.unshift(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return entry;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  const list = await getHistory();
  const entry = list.find((e) => e.id === id);
  const next = list.filter((e) => e.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  if (entry) {
    try {
      await FileSystem.deleteAsync(entry.photoPath, { idempotent: true });
    } catch {
      // ignore — file may already be gone
    }
  }
}

export async function clearHistory(): Promise<void> {
  const list = await getHistory();
  await AsyncStorage.removeItem(STORAGE_KEY);
  await Promise.all(
    list.map((e) =>
      FileSystem.deleteAsync(e.photoPath, { idempotent: true }).catch(() => {}),
    ),
  );
}
