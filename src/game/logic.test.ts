import { describe, expect, it } from "vitest";
import {
  applyQuiz,
  completedCount,
  createInitialProgress,
  ensureBadge,
  isGameComplete,
  isUnlocked,
  missionStatus,
  recordGameplay,
  recordStart,
  totalPoints,
} from "./logic";
import type { MissionId } from "./types";
import { FEED_SCENARIOS, FINAL_BADGE, LITTER, QUIZZES, WASTE_ITEMS } from "./content";
import { sanitize } from "./storage";

const ALL_CORRECT = (id: MissionId) => QUIZZES[id].map((question) => question.correct);
const wrongAnswer = (id: MissionId, index: number) => {
  const correct = QUIZZES[id][index].correct;
  return (correct + 1) % 4;
};

describe("content sanity", () => {
  it("has exactly three questions with four options in every quiz", () => {
    for (const [id, questions] of Object.entries(QUIZZES)) {
      expect(questions.length, `mission ${id}`).toBe(3);
      for (const question of questions) {
        expect(question.options.length, question.prompt).toBe(4);
        expect(question.correct).toBeGreaterThanOrEqual(0);
        expect(question.correct).toBeLessThan(4);
        expect(question.explanation.length).toBeGreaterThan(10);
      }
    }
  });

  it("never rewards feeding, touching or chasing wildlife", () => {
    for (const scenario of FEED_SCENARIOS) {
      const responsible = scenario.options.filter((option) => option.responsible);
      expect(responsible.length, scenario.title).toBe(1);
      expect(responsible[0].text).toMatch(/distance|secure|pack all food|remind|harmful/i);
      expect(responsible[0].text).not.toMatch(/\b(feed|offer|touch|chase|share|crowd)\b(?!ing)/i);
    }
  });

  it("places eight litter items inside the scene", () => {
    expect(LITTER.length).toBe(8);
    for (const item of LITTER) {
      expect(item.x).toBeGreaterThan(0);
      expect(item.x).toBeLessThan(100);
      expect(item.y).toBeGreaterThan(0);
      expect(item.y).toBeLessThan(100);
    }
  });

  it("spreads waste items across all four bins", () => {
    expect(WASTE_ITEMS.length).toBe(8);
    expect(new Set(WASTE_ITEMS.map((item) => item.bin)).size).toBe(4);
  });
});

describe("progress and unlocking", () => {
  it("starts with mission 1 available and the rest locked", () => {
    const progress = createInitialProgress();
    expect(missionStatus(progress, 1)).toBe("available");
    for (const id of [2, 3, 4, 5] as const) {
      expect(missionStatus(progress, id)).toBe("locked");
      expect(isUnlocked(progress, id)).toBe(false);
    }
    expect(totalPoints(progress)).toBe(0);
  });

  it("unlocks the next mission only after the quiz is passed", () => {
    let progress = createInitialProgress();
    progress = recordStart(progress, 1);
    progress = recordGameplay(progress, 1, 80, { litter: 8 });
    expect(missionStatus(progress, 1)).toBe("in_progress");
    expect(isUnlocked(progress, 2)).toBe(false);

    const failed = applyQuiz(progress, 1, [wrongAnswer(1, 0), wrongAnswer(1, 1), wrongAnswer(1, 2)]);
    expect(failed.passed).toBe(false);
    expect(isUnlocked(failed.progress, 2)).toBe(false);

    const passed = applyQuiz(failed.progress, 1, ALL_CORRECT(1));
    expect(passed.passed).toBe(true);
    expect(passed.score).toBe(3);
    expect(missionStatus(passed.progress, 1)).toBe("completed");
    expect(isUnlocked(passed.progress, 2)).toBe(true);
    expect(passed.progress.badges).toContain("trail-cleaner");
  });

  it("passes with exactly two correct answers and fails with one", () => {
    const base = createInitialProgress();
    const twoRight = applyQuiz(base, 1, [
      QUIZZES[1][0].correct,
      QUIZZES[1][1].correct,
      wrongAnswer(1, 2),
    ]);
    expect(twoRight.passed).toBe(true);
    expect(twoRight.score).toBe(2);

    const oneRight = applyQuiz(base, 1, [
      QUIZZES[1][0].correct,
      wrongAnswer(1, 1),
      wrongAnswer(1, 2),
    ]);
    expect(oneRight.passed).toBe(false);
    expect(oneRight.score).toBe(1);
  });

  it("never double counts points when a mission is replayed", () => {
    let progress = createInitialProgress();
    progress = recordStart(progress, 1);
    progress = recordGameplay(progress, 1, 80, { litter: 8 });
    progress = applyQuiz(progress, 1, ALL_CORRECT(1)).progress;
    expect(totalPoints(progress)).toBe(110);
    expect(progress.lessonsCompleted).toBe(1);

    // A weaker replay must not reduce or duplicate anything.
    progress = recordStart(progress, 1);
    progress = recordGameplay(progress, 1, 30, { litter: 3 });
    const weaker = applyQuiz(progress, 1, [QUIZZES[1][0].correct, wrongAnswer(1, 1), wrongAnswer(1, 2)]);
    expect(totalPoints(weaker.progress)).toBe(110);
    expect(weaker.progress.missions[1].quizBest).toBe(3);
    expect(weaker.progress.missions[1].litterCollected).toBe(8);

    // Repeating the same perfect run must not duplicate points either.
    const repeat = applyQuiz(progress, 1, ALL_CORRECT(1));
    expect(totalPoints(repeat.progress)).toBe(110);
    expect(repeat.progress.lessonsCompleted).toBe(1);
    expect(repeat.pointsEarned).toBe(30);
  });

  it("awards the final badge only when all five missions are complete", () => {
    let progress = createInitialProgress();
    for (const id of [1, 2, 3, 4, 5] as const) {
      progress = recordStart(progress, id);
      progress = recordGameplay(progress, id, 20, { decisions: 3 });
      progress = applyQuiz(progress, id, ALL_CORRECT(id)).progress;
    }
    expect(progress.lessonsCompleted).toBe(5);
    expect(completedCount(progress)).toBe(5);
    expect(isGameComplete(progress)).toBe(true);
    expect(progress.badges).toContain(FINAL_BADGE.id);
    expect(progress.badges.length).toBe(6);
    expect(totalPoints(progress)).toBe((20 + 30) * 5);
  });

  it("keeps a completed mission completed even if a later quiz attempt fails", () => {
    let progress = createInitialProgress();
    progress = applyQuiz(progress, 1, ALL_CORRECT(1)).progress;
    expect(missionStatus(progress, 1)).toBe("completed");

    const replayFail = applyQuiz(progress, 1, [
      wrongAnswer(1, 0),
      wrongAnswer(1, 1),
      wrongAnswer(1, 2),
    ]);
    expect(replayFail.passed).toBe(false);
    expect(missionStatus(replayFail.progress, 1)).toBe("completed");
    expect(isUnlocked(replayFail.progress, 2)).toBe(true);
    expect(replayFail.newlyCompleted).toBe(false);
  });

  it("adds badges once", () => {
    const badges = ensureBadge([], 1);
    expect(ensureBadge(badges, 1)).toEqual(badges);
    expect(badges).toEqual(["trail-cleaner"]);
  });
});

describe("storage sanitiser", () => {
  it("falls back to defaults for corrupt or partial data", () => {
    expect(sanitize(null)).toBeNull();
    expect(sanitize({})).toBeNull();
    expect(sanitize({ missions: "nope" })).toBeNull();

    const cleaned = sanitize({
      missions: { 1: { gameplayPoints: 99999, quizBest: 12, status: "completed" } },
      lessonsCompleted: "3",
      badges: ["trail-cleaner", 42],
      settings: { sound: false, reduceMotion: true },
    });
    expect(cleaned).not.toBeNull();
    expect(cleaned!.missions[1].quizBest).toBe(3);
    expect(cleaned!.missions[1].gameplayPoints).toBe(99999);
    expect(cleaned!.lessonsCompleted).toBe(3);
    expect(cleaned!.badges).toEqual(["trail-cleaner"]);
    expect(cleaned!.settings.sound).toBe(false);
    expect(cleaned!.settings.reduceMotion).toBe(true);
    expect(missionStatus(cleaned!, 1)).toBe("completed");
    expect(missionStatus(cleaned!, 2)).toBe("available");
  });
});
