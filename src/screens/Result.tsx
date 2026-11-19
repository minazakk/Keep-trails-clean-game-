import { useState } from "react";
import { ArrowRight, Lightbulb, ListChecks, RotateCcw, Star, Trophy } from "lucide-react";
import { getMission, QUIZ_PASS_MARK } from "../game/content";
import { totalPoints } from "../game/logic";
import type { MissionId } from "../game/types";
import { useGame } from "../game/state";
import { BadgeMedal, Confetti, Logo, ProgressBar } from "../components/Common";
import { LessonReviewModal } from "./Modals";

export function ResultScreen({ missionId }: { missionId: MissionId }) {
  const { progress, quizResult, go, sound, openMission, startMission } = useGame();
  const [showReview, setShowReview] = useState(false);
  const mission = getMission(missionId);
  const record = progress.missions[missionId];
  const passed = quizResult?.passed ?? record.quizBest >= QUIZ_PASS_MARK;
  const score = quizResult?.score ?? record.quizBest;
  const quizPoints = quizResult?.points ?? 0;
  const nextMission = (missionId < 5 ? missionId + 1 : null) as MissionId | null;
  const allDone = nextMission === null;

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <Logo size={36} />
          <div style={{ minWidth: 0 }}>
            <div className="topbar__title">{mission.title}</div>
            <div className="topbar__meta">{passed ? "Quiz passed" : "Quiz review"}</div>
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
        {passed ? <Confetti /> : null}

        <div className="result__badge">
          <BadgeMedal id={mission.badge.id} size={150} />
        </div>

        <h1 className={`result__title ${passed ? "" : "result__title--fail"}`.trim()}>
          {passed ? "LEVEL COMPLETE!" : "ALMOST THERE!"}
        </h1>

        <p className="result__lead">
          {passed
            ? `You passed the ${mission.title} quiz and earned the ${mission.badge.name} badge.`
            : `You scored ${score} out of 3. You need ${QUIZ_PASS_MARK} correct to pass — review the lesson and try again, nothing is lost.`}
        </p>

        <div className="result-stats">
          <div className="result-stat">
            <div className="result-stat__value">{totalPoints(progress)}</div>
            <div className="result-stat__label">Total points</div>
          </div>
          <div className="result-stat">
            <div className="result-stat__value">
              {score}/3
            </div>
            <div className="result-stat__label">Quiz score</div>
          </div>
          <div className="result-stat">
            <div className="result-stat__value">+{quizPoints}</div>
            <div className="result-stat__label">Quiz points</div>
          </div>
          <div className="result-stat">
            <div className="result-stat__value">
              {missionId === 1 ? record.litterCollected : record.decisions}
            </div>
            <div className="result-stat__label">
              {missionId === 1 ? "Litter collected" : "Good decisions"}
            </div>
          </div>
        </div>

        <div style={{ width: "min(620px, 100%)" }}>
          <ProgressBar
            value={score}
            max={3}
            label="Quiz result"
            valueText={`${score}/3`}
            accent={!passed}
          />
        </div>

        <div className="takeaway">
          <Lightbulb size={20} aria-hidden="true" />
          <span>{mission.takeaway}</span>
        </div>

        {passed ? (
          <div className="result-actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => {
                sound("unlock");
                if (allDone) go({ name: "final" });
                else if (nextMission) openMission(nextMission);
              }}
            >
              {allDone ? "See your final reward" : `Next level: Mission ${nextMission}`}
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
        ) : (
          <div className="result-actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={() => {
                sound("click");
                go({ name: "quiz", mission: missionId });
              }}
            >
              Retry quiz
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setShowReview(true)}>
              <ListChecks size={18} aria-hidden="true" />
              Review the lesson
            </button>
          </div>
        )}

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

        {passed ? (
          <p className="section-sub" style={{ textAlign: "center" }}>
            <Trophy size={15} aria-hidden="true" /> Badges reward learning and responsible choices — never
            speed or risk.
          </p>
        ) : null}
      </div>

      {showReview ? <LessonReviewModal missionId={missionId} onClose={() => setShowReview(false)} /> : null}
    </div>
  );
}
