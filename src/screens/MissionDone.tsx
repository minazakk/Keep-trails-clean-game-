import { ArrowRight, Lightbulb, RotateCcw, Star, Trophy } from "lucide-react";
import { getMission } from "../game/content";
import { missionStatus, totalPoints } from "../game/logic";
import type { MissionId } from "../game/types";
import { useGame } from "../game/state";
import { BadgeMedal, Confetti, Logo, ProgressBar } from "../components/Common";

export function MissionDone({ missionId }: { missionId: MissionId }) {
  const { progress, session, go, sound, startMission } = useGame();
  const mission = getMission(missionId);
  const status = missionStatus(progress, missionId);
  const record = progress.missions[missionId];
  const run = session && session.mission === missionId ? session : null;

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <Logo size={36} />
          <div>
            <div className="topbar__title">{mission.title}</div>
            <div className="topbar__meta">Mission challenge finished</div>
          </div>
          <div className="spacer" />
          <div className="score-pill">
            <Star size={16} fill="currentColor" aria-hidden="true" />
            <span>{totalPoints(progress)}</span>
            <span className="score-pill__label">Points</span>
          </div>
        </div>
      </header>

      <div className="container container--narrow result">
        <Confetti />

        <div className="result__badge">
          <BadgeMedal id={mission.badge.id} size={150} />
        </div>

        <h1 className="result__title">MISSION COMPLETE!</h1>
        <p className="result__lead">
          {run
            ? "You finished the challenge part of the mission. Now prove what you learned in a short three-question quiz."
            : "Welcome back — you have finished this challenge before. Take the quiz again to improve your score."}
        </p>

        <div className="result-stats">
          <div className="result-stat">
            <div className="result-stat__value">{run ? run.points : record.gameplayPoints}</div>
            <div className="result-stat__label">Points earned</div>
          </div>
          <div className="result-stat">
            <div className="result-stat__value">
              {run ? run.litter : record.litterCollected}
              {missionId === 1 ? " items" : ""}
            </div>
            <div className="result-stat__label">
              {missionId === 1 ? "Litter collected" : "Good decisions"}
            </div>
          </div>
          <div className="result-stat">
            <div className="result-stat__value">{record.quizBest}/3</div>
            <div className="result-stat__label">Best quiz</div>
          </div>
          <div className="result-stat">
            <div className="result-stat__value">{status === "completed" ? "Done" : "New"}</div>
            <div className="result-stat__label">Mission status</div>
          </div>
        </div>

        <div className="takeaway">
          <Lightbulb size={20} aria-hidden="true" />
          <span>{mission.takeaway}</span>
        </div>

        <div style={{ width: "min(620px, 100%)" }}>
          <ProgressBar
            value={record.quizBest}
            max={3}
            label="Quiz score so far (2 needed to pass)"
            valueText={`${record.quizBest}/3`}
            accent
          />
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={() => {
              sound("click");
              go({ name: "quiz", mission: missionId });
            }}
          >
            Take the quiz
            <ArrowRight size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              sound("back");
              startMission(missionId);
            }}
          >
            <RotateCcw size={18} aria-hidden="true" />
            Replay level
          </button>
        </div>

        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => {
            sound("back");
            go({ name: "missions" });
          }}
        >
          Back to mission board
        </button>

        <p className="section-sub" style={{ textAlign: "center" }}>
          <Trophy size={15} aria-hidden="true" /> Finish the quiz to earn the {mission.badge.name} badge and
          unlock Mission {Math.min(5, missionId + 1)}.
        </p>
      </div>
    </div>
  );
}
