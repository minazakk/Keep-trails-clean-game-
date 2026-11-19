import { useState } from "react";
import { Check, Footprints, Lightbulb, MousePointerClick, Star, Trophy, Volume2, VolumeX } from "lucide-react";
import { Modal } from "../components/Modal";
import { useGame } from "../game/state";
import { MISSIONS, QUIZZES } from "../game/content";

export function HowToPlayModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: <Footprints size={20} />, text: "Pick a mission from the mission board. Missions unlock one after another." },
    { icon: <MousePointerClick size={20} />, text: "Play the interactive challenge — tap, click or use the keyboard to make choices." },
    { icon: <Star size={20} />, text: "Earn points for every responsible action you take." },
    { icon: <Lightbulb size={20} />, text: "Read the feedback after each choice — that is where the lessons live." },
    { icon: <Trophy size={20} />, text: "Finish the mission, then answer a 3-question quiz. Score 2 or more to pass." },
    { icon: <Check size={20} />, text: "Pass the quiz to earn a badge and unlock the next mission." },
  ];
  return (
    <Modal title="How to play" onClose={onClose}>
      <p className="explain">
        Trail Guardians is a short environmental awareness game. Every mission takes about two minutes and
        teaches one real trail skill.
      </p>
      <div className="steps">
        {steps.map((step, index) => (
          <div className="step" key={index}>
            <span className="step__num">{index + 1}</span>
            <span style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "var(--forest)", marginTop: 2 }}>{step.icon}</span>
              <span>{step.text}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="feedback feedback--info">
        <span className="feedback__icon">
          <Lightbulb size={20} aria-hidden="true" />
        </span>
        <span>
          There is no timer and no losing. If you miss a quiz question you can review the lesson and try
          again straight away.
        </span>
      </div>
      <button type="button" className="btn btn--primary btn--block btn--lg" onClick={onClose}>
        Got it
      </button>
    </Modal>
  );
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { progress, setSettings, resetProgress, notify, storageAvailable } = useGame();
  const [confirming, setConfirming] = useState(false);

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="toggle-row">
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {progress.settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
          Sound effects
        </span>
        <button
          type="button"
          className="switch"
          role="switch"
          aria-checked={progress.settings.sound}
          aria-label="Sound effects"
          onClick={() => setSettings({ sound: !progress.settings.sound })}
        />
      </div>

      <div className="toggle-row">
        <span>Reduce motion</span>
        <button
          type="button"
          className="switch"
          role="switch"
          aria-checked={progress.settings.reduceMotion}
          aria-label="Reduce motion"
          onClick={() => setSettings({ reduceMotion: !progress.settings.reduceMotion })}
        />
      </div>

      {!storageAvailable ? (
        <div className="notice">
          <span>Storage is unavailable in this browser, so progress will not be saved after you close the
            tab.</span>
        </div>
      ) : null}

      <hr className="divider" />

      {confirming ? (
        <div className="stack">
          <p className="explain">
            This clears every mission, point and badge you have earned. It cannot be undone.
          </p>
          <div className="row">
            <button type="button" className="btn btn--ghost" onClick={() => setConfirming(false)}>
              Keep my progress
            </button>
            <button
              type="button"
              className="btn btn--accent"
              onClick={() => {
                resetProgress();
                setConfirming(false);
                notify("Progress restarted. Mission 1 is available again.");
              }}
            >
              Yes, restart
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn--ghost btn--block" onClick={() => setConfirming(true)}>
          Restart all progress
        </button>
      )}
    </Modal>
  );
}

export function LessonReviewModal({ missionId, onClose }: { missionId: 1 | 2 | 3 | 4 | 5; onClose: () => void }) {
  const quiz = QUIZZES[missionId];
  const mission = MISSIONS.find((m) => m.id === missionId);
  return (
    <Modal title={`Review: ${mission?.title}`} onClose={onClose}>
      <div className="takeaway" style={{ width: "100%" }}>
        <Lightbulb size={20} aria-hidden="true" />
        <span>{mission?.takeaway}</span>
      </div>
      <div className="steps">
        {quiz.map((question, index) => (
          <div className="step" key={index}>
            <span className="step__num">{index + 1}</span>
            <span>
              <strong>{question.prompt}</strong>
              <br />
              Correct answer: {question.options[question.correct]}
              <br />
              <span style={{ color: "var(--muted)", fontWeight: 700 }}>{question.explanation}</span>
            </span>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn--primary btn--block" onClick={onClose}>
        Back to quiz
      </button>
    </Modal>
  );
}
