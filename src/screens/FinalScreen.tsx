import { useState } from "react";
import { Award, Check, Copy, ListChecks, RotateCcw, Share2, Star, Trash2, Trophy } from "lucide-react";
import { SunsetScene } from "../art/Scenery";
import { useGame } from "../game/state";
import { FINAL_BADGE, MISSIONS, QUIZZES } from "../game/content";
import { completedCount, decisionsTotal, litterTotal, totalPoints } from "../game/logic";
import { BadgeMedal, Confetti } from "../components/Common";
import { Modal } from "../components/Modal";

function AllLessonsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Review what you learned" onClose={onClose}>
      <div className="steps">
        {MISSIONS.map((mission) => (
          <div className="step" key={mission.id}>
            <span className="step__num">{mission.id}</span>
            <span>
              <strong>{mission.title}:</strong> {mission.takeaway}
              <span style={{ display: "block", marginTop: 6, color: "var(--muted)", fontWeight: 700 }}>
                Quiz check: {QUIZZES[mission.id][0].prompt} →{" "}
                {QUIZZES[mission.id][0].options[QUIZZES[mission.id][0].correct]}
              </span>
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--primary btn--block" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
}

export function FinalScreen() {
  const { progress, go, resetProgress, notify, sound } = useGame();
  const [showLessons, setShowLessons] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copied, setCopied] = useState(false);

  const points = totalPoints(progress);
  const done = completedCount(progress);
  const litter = litterTotal(progress);
  const decisions = decisionsTotal(progress);

  const shareText = `I became a TRAIL GUARDIAN in Trail Guardians! ${points} points · ${done}/5 missions · ${litter} litter items removed · ${decisions} responsible choices. Clean trails. Respect wildlife. Hike safely. Your Visit. Your Responsibility.`;

  async function share() {
    sound("collect");
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title: "Trail Guardians", text: shareText });
        return;
      } catch {
        /* user cancelled or sharing failed — fall back to copying */
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      notify("Achievement message copied to your clipboard.");
    } catch {
      setCopied(true);
      notify("Select the message below and copy it to share.");
    }
  }

  return (
    <div className="screen final-screen">
      <div className="final-screen__bg">
        <SunsetScene />
      </div>

      <div className="container final-screen__content">
        <Confetti />

        <BadgeMedal id={FINAL_BADGE.id} size={168} />

        <h1 className="result__title" style={{ color: "#ffffff", textShadow: "0 6px 24px rgba(6,26,15,0.5)" }}>
          YOU ARE A TRAIL GUARDIAN!
        </h1>

        <div className="share-card" style={{ width: "min(620px, 100%)" }}>
          <div className="share-card__title">Clean trails. Respect wildlife. Hike safely.</div>
          <div className="share-card__motto">Your Visit. Your Responsibility.</div>
          <div className="result-stats" style={{ width: "100%", marginTop: 8 }}>
            <div className="result-stat">
              <div className="result-stat__value">{points}</div>
              <div className="result-stat__label">Final points</div>
            </div>
            <div className="result-stat">
              <div className="result-stat__value">{done}/5</div>
              <div className="result-stat__label">Missions</div>
            </div>
            <div className="result-stat">
              <div className="result-stat__value">{litter}</div>
              <div className="result-stat__label">Litter removed</div>
            </div>
            <div className="result-stat">
              <div className="result-stat__value">{progress.badges.length}/6</div>
              <div className="result-stat__label">Badges</div>
            </div>
          </div>
        </div>

        <div className="badge-grid" style={{ width: "min(680px, 100%)" }}>
          {MISSIONS.map((mission) => (
            <div className="badge-tile" key={mission.id}>
              <BadgeMedal id={mission.badge.id} size={70} />
              <div className="badge-tile__name">{mission.badge.name}</div>
              <div className="badge-tile__blurb">{mission.badge.blurb}</div>
              <span className="chip chip--done">
                <Check size={13} aria-hidden="true" /> Earned
              </span>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={() => {
              sound("click");
              go({ name: "missions" });
            }}
          >
            <Trophy size={20} aria-hidden="true" />
            Play again
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => setShowLessons(true)}>
            <ListChecks size={18} aria-hidden="true" />
            Review what you learned
          </button>
          <button type="button" className="btn btn--accent" onClick={share}>
            <Share2 size={18} aria-hidden="true" />
            Share your achievement
          </button>
        </div>

        {copied ? (
          <div className="share-card" style={{ width: "min(620px, 100%)" }}>
            <div className="row" style={{ justifyContent: "center" }}>
              <Copy size={18} aria-hidden="true" />
              <strong>Copy this message</strong>
            </div>
            <p style={{ fontWeight: 700, lineHeight: 1.5 }}>{shareText}</p>
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(shareText)
                  .then(() => notify("Copied again."))
                  .catch(() => notify("Select the text above to copy it."));
              }}
            >
              <Copy size={18} aria-hidden="true" /> Copy text
            </button>
          </div>
        ) : null}

        <div className="row" style={{ justifyContent: "center" }}>
          <button
            type="button"
            className="btn btn--quiet"
            style={{ color: "rgba(255,255,255,0.95)" }}
            onClick={() => {
              sound("back");
              go({ name: "dashboard" });
            }}
          >
            <Award size={18} aria-hidden="true" />
            Progress dashboard
          </button>
          <button
            type="button"
            className="btn btn--quiet"
            style={{ color: "rgba(255,255,255,0.95)" }}
            onClick={() => {
              sound("back");
              go({ name: "menu" });
            }}
          >
            Main menu
          </button>
          <button
            type="button"
            className="btn btn--quiet"
            style={{ color: "rgba(255,255,255,0.95)" }}
            onClick={() => setConfirmReset(true)}
          >
            <RotateCcw size={18} aria-hidden="true" />
            Restart game
          </button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.92)", fontWeight: 800 }}>
          <Star size={15} aria-hidden="true" /> {decisions} responsible decisions · {points} points ·{" "}
          {MISSIONS.length} lessons
        </p>
      </div>

      {showLessons ? <AllLessonsModal onClose={() => setShowLessons(false)} /> : null}

      {confirmReset ? (
        <Modal title="Restart the game?" onClose={() => setConfirmReset(false)}>
          <p className="explain">
            This clears every mission, point and badge so you can play from the beginning again.
          </p>
          <div className="row">
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
              Keep my results
            </button>
            <button
              type="button"
              className="btn btn--accent"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                notify("Game restarted. Mission 1 is available.");
                go({ name: "missions" });
              }}
            >
              <Trash2 size={18} aria-hidden="true" />
              Restart
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
