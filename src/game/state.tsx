import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadProgress, saveProgress } from "./storage";
import { setSoundEnabled, playSfx } from "./sound";
import { recordGameplay, recordStart } from "./logic";
import type { MissionId, ProgressState, Screen } from "./types";

export interface GameplaySummary {
  mission: MissionId;
  points: number;
  litter: number;
  decisions: number;
}

interface GameContextValue {
  progress: ProgressState;
  storageAvailable: boolean;
  screen: Screen;
  toast: string | null;
  session: GameplaySummary | null;
  quizResult: { score: number; points: number; passed: boolean } | null;
  go: (screen: Screen) => void;
  openMission: (id: MissionId) => void;
  update: (fn: (current: ProgressState) => ProgressState) => void;
  /** Saves the result of an interactive mission run and opens the celebration screen. */
  finishGameplay: (summary: GameplaySummary) => void;
  startMission: (id: MissionId) => void;
  setQuizResult: (result: { score: number; points: number; passed: boolean } | null) => void;
  resetProgress: () => void;
  setSettings: (patch: Partial<ProgressState["settings"]>) => void;
  notify: (message: string) => void;
  sound: (name: Parameters<typeof playSfx>[0]) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadProgress());
  const [progress, setProgress] = useState<ProgressState>(initial.current.progress);
  const [storageAvailable, setStorageAvailable] = useState(initial.current.storageAvailable);
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  const [toast, setToast] = useState<string | null>(null);
  const [session, setSession] = useState<GameplaySummary | null>(null);
  const [quizResult, setQuizResult] = useState<{ score: number; points: number; passed: boolean } | null>(
    null,
  );
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!saveProgress(progress)) setStorageAvailable(false);
  }, [progress]);

  useEffect(() => {
    setSoundEnabled(progress.settings.sound);
  }, [progress.settings.sound]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = progress.settings.reduceMotion || media.matches;
    root.classList.toggle("reduce-motion", active);
    const onChange = () => root.classList.toggle("reduce-motion", active);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, [progress.settings.reduceMotion]);

  const update = useCallback((fn: (current: ProgressState) => ProgressState) => {
    setProgress((current) => fn(current));
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const go = useCallback((next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const openMission = useCallback((id: MissionId) => {
    setScreen({ name: "intro", mission: id });
    setQuizResult(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const startMission = useCallback((id: MissionId) => {
    setSession(null);
    setQuizResult(null);
    setProgress((current) => recordStart(current, id));
    setScreen({ name: "play", mission: id });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const finishGameplay = useCallback((summary: GameplaySummary) => {
    setSession(summary);
    setProgress((current) =>
      recordGameplay(current, summary.mission, summary.points, {
        litter: summary.litter,
        decisions: summary.decisions,
      }),
    );
    setScreen({ name: "missiondone", mission: summary.mission });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress((current) => ({
      ...current,
      missions: createFreshMissions(),
      lessonsCompleted: 0,
      badges: [],
      startedAt: Date.now(),
    }));
  }, []);

  const setSettings = useCallback((patch: Partial<ProgressState["settings"]>) => {
    setProgress((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }, []);

  const sound = useCallback((name: Parameters<typeof playSfx>[0]) => playSfx(name), []);

  const value = useMemo<GameContextValue>(
    () => ({
      progress,
      storageAvailable,
      screen,
      toast,
      session,
      quizResult,
      go,
      openMission,
      update,
      finishGameplay,
      startMission,
      setQuizResult,
      resetProgress,
      setSettings,
      notify,
      sound,
    }),
    [
      progress,
      storageAvailable,
      screen,
      toast,
      session,
      quizResult,
      go,
      openMission,
      update,
      finishGameplay,
      startMission,
      setQuizResult,
      resetProgress,
      setSettings,
      notify,
      sound,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

function createFreshMissions(): ProgressState["missions"] {
  const base = loadProgress().progress.missions;
  const fresh = {} as ProgressState["missions"];
  for (const key of Object.keys(base) as unknown as Array<keyof ProgressState["missions"]>) {
    fresh[key] = { ...base[key] };
    fresh[key].status = key === 1 ? "available" : "locked";
    fresh[key].started = false;
    fresh[key].gameplayPoints = 0;
    fresh[key].quizPoints = 0;
    fresh[key].quizBest = 0;
    fresh[key].litterCollected = 0;
    fresh[key].decisions = 0;
    fresh[key].completedAt = null;
  }
  return fresh;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
