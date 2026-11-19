export type MissionId = 1 | 2 | 3 | 4 | 5;

export type MissionStatus = "locked" | "available" | "in_progress" | "completed";

export interface MissionRecord {
  status: MissionStatus;
  /** True once the player has entered the interactive part. */
  started: boolean;
  /** Best points earned in the interactive part of the mission. */
  gameplayPoints: number;
  /** Best points earned in the mission quiz. */
  quizPoints: number;
  /** Best quiz score, out of 3. */
  quizBest: number;
  /** Best number of litter items collected (Mission 1). */
  litterCollected: number;
  /** Total number of responsible decisions made (Missions 3-5). */
  decisions: number;
  completedAt: number | null;
}

export interface Settings {
  sound: boolean;
  reduceMotion: boolean;
}

export interface ProgressState {
  version: number;
  missions: Record<MissionId, MissionRecord>;
  /** Count of lessons (missions + quizzes) finished. */
  lessonsCompleted: number;
  badges: string[];
  settings: Settings;
  startedAt: number;
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  short: string;
  description: string;
  objective: string;
  icon: "trash" | "recycle" | "paw" | "noFeed" | "shield";
  accent: string;
  badge: { id: string; name: string; blurb: string };
  takeaway: string;
  maxPoints: number;
}

export type ScreenName =
  | "menu"
  | "missions"
  | "intro"
  | "play"
  | "missiondone"
  | "quiz"
  | "result"
  | "dashboard"
  | "final";

export interface Screen {
  name: ScreenName;
  mission?: MissionId;
}

export interface QuizQuestion {
  prompt: string;
  image?: "bottle" | "monkey" | "deer" | "sign" | "bin" | "water";
  options: string[];
  correct: number;
  explanation: string;
}
