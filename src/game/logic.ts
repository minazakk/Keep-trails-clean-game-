import { FINAL_BADGE, MISSIONS, QUIZZES, QUIZ_PASS_MARK } from "./content";
import type { MissionId, MissionRecord, MissionStatus, ProgressState } from "./types";

export const STORAGE_KEY = "trail-guardians:progress:v1";
export const PROGRESS_VERSION = 1;

export const MISSION_IDS: MissionId[] = [1, 2, 3, 4, 5];

export function emptyRecord(status: MissionStatus): MissionRecord {
  return {
    status,
    started: false,
    gameplayPoints: 0,
    quizPoints: 0,
    quizBest: 0,
    litterCollected: 0,
    decisions: 0,
    completedAt: null,
  };
}

export function createInitialProgress(): ProgressState {
  const missions = {} as Record<MissionId, MissionRecord>;
  for (const id of MISSION_IDS) {
    missions[id] = emptyRecord(id === 1 ? "available" : "locked");
  }
  return {
    version: PROGRESS_VERSION,
    missions,
    lessonsCompleted: 0,
    badges: [],
    settings: { sound: true, reduceMotion: false },
    startedAt: Date.now(),
  };
}

export function isUnlocked(progress: ProgressState, id: MissionId): boolean {
  if (id === 1) return true;
  const previous = progress.missions[(id - 1) as MissionId];
  return previous.status === "completed";
}

export function missionStatus(progress: ProgressState, id: MissionId): MissionStatus {
  const record = progress.missions[id];
  if (record.status === "completed") return "completed";
  if (!isUnlocked(progress, id)) return "locked";
  return record.started ? "in_progress" : "available";
}

export function totalPoints(progress: ProgressState): number {
  return MISSION_IDS.reduce((sum, id) => {
    const r = progress.missions[id];
    return sum + r.gameplayPoints + r.quizPoints;
  }, 0);
}

export function litterTotal(progress: ProgressState): number {
  return MISSION_IDS.reduce((sum, id) => sum + progress.missions[id].litterCollected, 0);
}

export function decisionsTotal(progress: ProgressState): number {
  return MISSION_IDS.reduce((sum, id) => sum + progress.missions[id].decisions, 0);
}

export function quizTotal(progress: ProgressState): number {
  return MISSION_IDS.reduce((sum, id) => sum + progress.missions[id].quizBest, 0);
}

export function completedCount(progress: ProgressState): number {
  return MISSION_IDS.filter((id) => progress.missions[id].status === "completed").length;
}

export function isGameComplete(progress: ProgressState): boolean {
  return completedCount(progress) === MISSION_IDS.length;
}

export function overallPercent(progress: ProgressState): number {
  const done = MISSION_IDS.reduce((sum, id) => {
    const r = progress.missions[id];
    const missionMax = 3;
    return sum + (r.status === "completed" ? 1 : r.quizBest / missionMax);
  }, 0);
  return Math.round((done / MISSION_IDS.length) * 100);
}

/** Records the best score of an interactive mission run. Safe to call repeatedly. */
export function recordGameplay(
  progress: ProgressState,
  id: MissionId,
  points: number,
  extra: { litter?: number; decisions?: number } = {},
): ProgressState {
  const current = progress.missions[id];
  const record: MissionRecord = {
    ...current,
    started: true,
    gameplayPoints: Math.max(current.gameplayPoints, points),
    litterCollected: Math.max(current.litterCollected, extra.litter ?? 0),
    decisions: Math.max(current.decisions, extra.decisions ?? 0),
    status: current.status === "completed" ? "completed" : "in_progress",
  };
  return { ...progress, missions: { ...progress.missions, [id]: record } };
}

/** Marks a mission as started so it shows as "In Progress". */
export function recordStart(progress: ProgressState, id: MissionId): ProgressState {
  const current = progress.missions[id];
  if (current.started) return progress;
  return {
    ...progress,
    missions: { ...progress.missions, [id]: { ...current, started: true } },
  };
}

export interface QuizOutcome {
  progress: ProgressState;
  passed: boolean;
  score: number;
  pointsEarned: number;
  newlyCompleted: boolean;
}

/** Validates a quiz attempt, applies points once per best score and unlocks the next mission. */
export function applyQuiz(
  progress: ProgressState,
  id: MissionId,
  answers: number[],
): QuizOutcome {
  const questions = QUIZZES[id];
  const correctCount = answers.reduce(
    (sum, answer, index) => (answer === questions[index]?.correct ? sum + 1 : sum),
    0,
  );
  const passed = correctCount >= QUIZ_PASS_MARK;
  const pointsEarned = correctCount * 10;
  const current = progress.missions[id];
  const alreadyCompleted = current.status === "completed";

  const record: MissionRecord = {
    ...current,
    quizBest: Math.max(current.quizBest, correctCount),
    quizPoints: Math.max(current.quizPoints, pointsEarned),
    status: passed ? "completed" : current.status === "completed" ? "completed" : "in_progress",
    completedAt: passed ? (current.completedAt ?? Date.now()) : current.completedAt,
  };

  const missions = { ...progress.missions, [id]: record };
  const next: ProgressState = { ...progress, missions };

  if (passed) {
    if (!alreadyCompleted) {
      next.lessonsCompleted = progress.lessonsCompleted + 1;
    }
    next.badges = ensureBadge(next.badges, id);
    if (isGameComplete(next)) {
      next.badges = ensureBadge(next.badges, "final");
    }
    const nextMission = MISSION_IDS.find((m) => m > id);
    if (nextMission) {
      const nextRecord = missions[nextMission];
      if (nextRecord.status === "locked") {
        next.missions = {
          ...missions,
          [nextMission]: { ...nextRecord, status: "available" },
        };
      }
    }
  }

  return { progress: next, passed, score: correctCount, pointsEarned, newlyCompleted: passed && !alreadyCompleted };
}

export function ensureBadge(badges: string[], missionId: MissionId | "final"): string[] {
  const id =
    missionId === "final" ? FINAL_BADGE.id : MISSIONS.find((m) => m.id === missionId)?.badge.id;
  if (!id || badges.includes(id)) return badges;
  return [...badges, id];
}

export function badgeForMission(id: MissionId) {
  const mission = MISSIONS.find((m) => m.id === id);
  return mission ? mission.badge : { id: "unknown", name: "Unknown", blurb: "" };
}

export function statusLabel(status: MissionStatus): string {
  switch (status) {
    case "locked":
      return "Locked";
    case "available":
      return "Available";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
  }
}
