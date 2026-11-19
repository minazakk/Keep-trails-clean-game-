import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Star, Target, X } from "lucide-react";
import type { DecisionOption } from "../game/content";
import { ProgressBar } from "../components/Common";

export interface PlayScenario {
  id: string;
  title: string;
  situation: string;
  options: DecisionOption[];
  art: ReactNode;
  note?: ReactNode;
}

interface DecisionPlayProps {
  scenarios: PlayScenario[];
  pointsPerChoice: number;
  accent: string;
  onComplete: (summary: { points: number; decisions: number }) => void;
  onProgress?: (summary: { points: number; decisions: number }) => void;
  missionTip?: string;
}

/**
 * Shared engine for missions built on decision cards (Wildlife Guardian,
 * Don't Feed Animals, Hike Safe).
 */
export function DecisionPlay({
  scenarios,
  pointsPerChoice,
  accent,
  onComplete,
  onProgress,
  missionTip,
}: DecisionPlayProps) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [points, setPoints] = useState(0);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  const scenario = scenarios[index];
  const total = scenarios.length;
  const isLast = index === total - 1;
  const chosen = choice === null ? null : scenario.options[choice];

  function pick(optionIndex: number) {
    if (solved) return;
    const option = scenario.options[optionIndex];
    setChoice(optionIndex);
    if (option.responsible) {
      setSolved(true);
      if (!solvedIds.includes(scenario.id)) {
        const nextSolved = [...solvedIds, scenario.id];
        const nextPoints = points + pointsPerChoice;
        setSolvedIds(nextSolved);
        setPoints(nextPoints);
        onProgress?.({ points: nextPoints, decisions: nextSolved.length });
      }
    }
  }

  function next() {
    if (isLast) {
      onComplete({ points, decisions: solvedIds.length });
      return;
    }
    setIndex(index + 1);
    setChoice(null);
    setSolved(false);
  }

  return (
    <div className="game-layout">
      <div className="stack">
        <div className="hud">
          <div className="hud__stats">
            <div className="stat">
              <Target size={16} aria-hidden="true" />
              Situation {index + 1} of {total}
            </div>
            <div className="stat">
              <Star size={16} aria-hidden="true" />
              {points} points
            </div>
            <div className="stat">
              <Check size={16} aria-hidden="true" />
              {solvedIds.length} good calls
            </div>
          </div>
        </div>

        <ProgressBar
          value={index + (solved ? 1 : 0)}
          max={total}
          label="Mission progress"
          valueText={`${index + (solved ? 1 : 0)}/${total}`}
        />

        <div className="panel scenario">
          <div className="scenario__stage">{scenario.art}</div>

          <div>
            <div className="panel__title" style={{ color: accent }}>
              {scenario.title}
            </div>
            <p style={{ marginTop: 6, fontSize: "1.02rem", lineHeight: 1.55, fontWeight: 600 }}>
              {scenario.situation}
            </p>
          </div>

          <div className="options" role="group" aria-label={`Choices for ${scenario.title}`}>
            {scenario.options.map((option, optionIndex) => {
              const state = solved
                ? option.responsible
                  ? "is-correct"
                  : choice === optionIndex
                    ? "is-wrong"
                    : ""
                : choice === optionIndex
                  ? "is-wrong"
                  : "";
              return (
                <button
                  key={optionIndex}
                  type="button"
                  className={`option ${state}`.trim()}
                  onClick={() => pick(optionIndex)}
                  disabled={solved}
                  aria-pressed={choice === optionIndex}
                >
                  <span className="option__marker" aria-hidden="true">
                    {state === "is-correct" ? (
                      <Check size={15} />
                    ) : state === "is-wrong" ? (
                      <X size={15} />
                    ) : (
                      optionIndex + 1
                    )}
                  </span>
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>

          {chosen && !solved ? (
            <div className="feedback feedback--bad" role="status">
              <span className="feedback__icon">
                <X size={20} aria-hidden="true" />
              </span>
              <span>
                {chosen.feedback}{" "}
                <strong>Have another go and pick the responsible action.</strong>
              </span>
            </div>
          ) : null}

          {solved && chosen ? (
            <div className="feedback feedback--good" role="status">
              <span className="feedback__icon">
                <Check size={20} aria-hidden="true" />
              </span>
              <span>
                {chosen.feedback}
                <span style={{ display: "block", marginTop: 6, fontWeight: 800 }}>
                  +{pointsPerChoice} points
                </span>
              </span>
            </div>
          ) : null}

          {scenario.note ? (
            <div className="feedback feedback--info">
              <span className="feedback__icon">
                <Target size={20} aria-hidden="true" />
              </span>
              <span>{scenario.note}</span>
            </div>
          ) : null}

          {solved ? (
            <button
              type="button"
              className="btn btn--primary btn--lg btn--block"
              onClick={next}
              style={{ marginTop: 4 }}
            >
              {isLast ? "Finish mission" : "Next situation"}
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <aside className="panel stack" aria-label="Mission information">
        <div className="panel__title">Remember</div>
        <p className="explain">{missionTip ?? "Take your time and choose the option that protects the trail."}</p>
        <hr className="divider" />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, color: "var(--muted)" }}>Points this run</span>
          <span style={{ fontWeight: 900, color: accent, fontSize: "1.2rem" }}>{points}</span>
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, color: "var(--muted)" }}>Responsible choices</span>
          <span style={{ fontWeight: 900, color: accent, fontSize: "1.2rem" }}>
            {solvedIds.length}/{total}
          </span>
        </div>
        <hr className="divider" />
        <p className="explain" style={{ fontSize: "0.9rem" }}>
          No timer, no penalty. If you pick an unsafe option you can simply choose again — the game only
          rewards responsible choices.
        </p>
      </aside>
    </div>
  );
}
