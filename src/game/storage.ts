import { createInitialProgress, PROGRESS_VERSION, STORAGE_KEY } from "./logic";
import type { ProgressState } from "./types";

export interface LoadResult {
  progress: ProgressState;
  storageAvailable: boolean;
}

/** Validates untrusted saved data and merges it onto a fresh profile. */
export function sanitize(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Partial<ProgressState>;
  if (typeof data.missions !== "object" || data.missions === null) return null;

  const base = createInitialProgress();
  const missions = { ...base.missions };

  for (const key of Object.keys(data.missions) as unknown as Array<keyof ProgressState["missions"]>) {
    const incoming = data.missions[key];
    const existing = base.missions[key];
    if (!incoming || !existing) continue;
    missions[key] = {
      ...existing,
      gameplayPoints: Number(incoming.gameplayPoints) || 0,
      quizPoints: Number(incoming.quizPoints) || 0,
      quizBest: Math.min(3, Math.max(0, Number(incoming.quizBest) || 0)),
      litterCollected: Number(incoming.litterCollected) || 0,
      decisions: Number(incoming.decisions) || 0,
      completedAt: typeof incoming.completedAt === "number" ? incoming.completedAt : null,
      status: incoming.status ?? existing.status,
      started: incoming.started === true || existing.status !== "locked",
    };
  }

  return {
    version: PROGRESS_VERSION,
    missions,
    lessonsCompleted: Number(data.lessonsCompleted) || 0,
    badges: Array.isArray(data.badges) ? data.badges.filter((b) => typeof b === "string") : [],
    settings: {
      sound: data.settings?.sound !== false,
      reduceMotion: data.settings?.reduceMotion === true,
    },
    startedAt: typeof data.startedAt === "number" ? data.startedAt : Date.now(),
  };
}

/** Reads saved progress. Falls back to a fresh profile when storage is unavailable. */
export function loadProgress(): LoadResult {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = sanitize(JSON.parse(raw));
      if (parsed) return { progress: parsed, storageAvailable: true };
    }
    return { progress: createInitialProgress(), storageAvailable: true };
  } catch {
    return { progress: createInitialProgress(), storageAvailable: false };
  }
}

/** Persists progress. Returns false when storage is unavailable or full. */
export function saveProgress(progress: ProgressState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
