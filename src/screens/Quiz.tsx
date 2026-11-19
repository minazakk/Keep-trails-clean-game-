import { useState } from "react";
import { ArrowRight, Check, Lightbulb, Star, X } from "lucide-react";
import { QUIZZES, QUIZ_PASS_MARK } from "../game/content";
import { applyQuiz, totalPoints } from "../game/logic";
import type { MissionId } from "../game/types";
import { useGame } from "../game/state";
import { Logo, ScorePill } from "../components/Common";
import { QuizVisual } from "../art/Characters";
import { LessonReviewModal } from "./Modals";

export function QuizScreen({ missionId }: { missionId: MissionId }) {
  const { progress, go, update, setQuizResult, sound, notify } = useGame();
  const questions = QUIZZES[missionId];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);

  const question = questions[index];
  const total = questions.length;
  const isLast = index === total - 1;
  const correctSoFar = answers.reduce(
    (sum, answer, i) => (answer === questions[i]?.correct ? sum + 1 : sum),
    0,
  );

  function choose(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    const correct = optionIndex === question.correct;
    sound(correct ? "correct" : "wrong");
    setAnswers((current) => [...current, optionIndex]);
  }

  function next() {
    if (!isLast) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    const outcome = applyQuiz(progress, missionId, answers);
    update(() => outcome.progress);
    setQuizResult({ score: outcome.score, points: outcome.pointsEarned, passed: outcome.passed });
    sound(outcome.passed ? "complete" : "wrong");
    notify(
      outcome.passed
        ? `Quiz passed: ${outcome.score}/${total}`
        : `You scored ${outcome.score}/${total} — review and try again.`,
    );
    go({ name: "result", mission: missionId });
  }

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <Logo size={36} />
          <div style={{ minWidth: 0 }}>
            <div className="topbar__title">Mission {missionId} quiz</div>
            <div className="topbar__meta">
              Question {index + 1} of {total} · {QUIZ_PASS_MARK} correct to pass
            </div>
          </div>
          <div className="spacer" />
          <ScorePill points={totalPoints(progress)} />
        </div>
      </header>

      <div className="container container--narrow stack" style={{ paddingBlock: "clamp(18px, 4vh, 34px)" }}>
        <div className="quiz-head">
          <div className="quiz-dots" aria-hidden="true">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`quiz-dot ${i === index ? "is-current" : i < index ? "is-done" : ""}`.trim()}
              />
            ))}
          </div>
          <span className="chip chip--progress">
            <Star size={13} aria-hidden="true" />
            {correctSoFar} correct so far
          </span>
        </div>

        <div className="question-card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="chip">Question {index + 1} of {total}</span>
            <span className="chip chip--done">
              <Check size={13} aria-hidden="true" /> Pass mark {QUIZ_PASS_MARK}/{total}
            </span>
          </div>

          <h1 className="question-card__prompt">{question.prompt}</h1>

          {question.image ? (
            <div className="question-visual">
              <QuizVisual kind={question.image} />
            </div>
          ) : null}

          <div className="options options--grid" role="group" aria-label={`Answers for question ${index + 1}`}>
            {question.options.map((option, optionIndex) => {
              const revealed = picked !== null;
              const isCorrect = optionIndex === question.correct;
              const state = revealed
                ? isCorrect
                  ? "is-correct"
                  : optionIndex === picked
                    ? "is-wrong"
                    : ""
                : "";
              return (
                <button
                  key={optionIndex}
                  type="button"
                  className={`option ${state}`.trim()}
                  onClick={() => choose(optionIndex)}
                  disabled={revealed}
                  aria-pressed={picked === optionIndex}
                >
                  <span className="option__marker" aria-hidden="true">
                    {state === "is-correct" ? (
                      <Check size={15} />
                    ) : state === "is-wrong" ? (
                      <X size={15} />
                    ) : (
                      String.fromCharCode(65 + optionIndex)
                    )}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {picked !== null ? (
            <div
              className={`feedback ${picked === question.correct ? "feedback--good" : "feedback--bad"}`}
              role="status"
            >
              <span className="feedback__icon">
                {picked === question.correct ? (
                  <Check size={20} aria-hidden="true" />
                ) : (
                  <X size={20} aria-hidden="true" />
                )}
              </span>
              <span>
                <strong>
                  {picked === question.correct
                    ? `Correct! +10 points.`
                    : `Not quite — the answer is “${question.options[question.correct]}”.`}
                </strong>
                <span style={{ display: "block", marginTop: 4, fontWeight: 700 }}>
                  {question.explanation}
                </span>
              </span>
            </div>
          ) : null}

          {picked !== null ? (
            <button type="button" className="btn btn--primary btn--lg btn--block" onClick={next}>
              {isLast ? "See my result" : "Next question"}
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <button type="button" className="btn btn--ghost" onClick={() => setShowReview(true)}>
            <Lightbulb size={18} aria-hidden="true" />
            Review the lesson
          </button>
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => {
              sound("back");
              go({ name: "missions" });
            }}
          >
            Quit quiz
          </button>
        </div>
      </div>

      {showReview ? <LessonReviewModal missionId={missionId} onClose={() => setShowReview(false)} /> : null}
    </div>
  );
}
