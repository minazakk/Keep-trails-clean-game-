import { useState, type CSSProperties } from "react";
import { Award, Check, Lightbulb, Lock, RotateCcw, Settings, Star, Target, Trash2, Trophy } from "lucide-react";
import { useGame } from "../game/state";
import { FINAL_BADGE, MISSIONS, QUIZZES } from "../game/content";
import {
  completedCount,
  litterTotal,
  missionStatus,
  overallPercent,
  quizTotal,
  totalPoints,
} from "../game/logic";
import { Logo, ProgressBar, ScorePill, StatusChip, allBadges, BadgeTile } from "../components/Common";
import { SettingsModal } from "./Modals";

export function Dashboard() {
  const { progress, go, openMission, sound } = useGame();
  const [showSettings, setShowSettings] = useState(false);

  const points = totalPoints(progress);
  const done = completedCount(progress);
  const percent = overallPercent(progress);
  const litter = litterTotal(progress);
  const lessons = progress.lessonsCompleted;
  const quizScore = quizTotal(progress);
  const badges = allBadges();

  const cards = [
    { icon: <Star size={20} />, value: points, label: "Total points" },
    { icon: <Trophy size={20} />, value: `${done}/5`, label: "Missions done" },
    { icon: <Target size={20} />, value: `${quizScore}/15`, label: "Quiz score" },
    { icon: <Trash2 size={20} />, value: litter, label: "Litter collected" },
    { icon: <Lightbulb size={20} />, value: `${lessons}/5`, label: "Lessons finished" },
    { icon: <Award size={20} />, value: `${progress.badges.length}/${badges.length}`, label: "Badges earned" },
  ];

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <Logo size={36} />
          <div style={{ minWidth: 0 }}>
            <div className="topbar__title">Progress dashboard</div>
            <div className="topbar__meta">Every responsible choice makes a difference.</div>
          </div>
          <div className="spacer" />
          <ScorePill points={points} />
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
          >
            <Settings size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="container stack" style={{ paddingBlock: "clamp(18px, 4vh, 34px)" }}>
        <div className="row" style={{ gap: 24, alignItems: "center" }}>
          <div className="circle-progress" style={{ "--p": percent } as CSSProperties}>
            <span className="circle-progress__value">{percent}%</span>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h1 className="section-title">Your journey</h1>
            <p className="section-sub">
              You have finished {done} of 5 missions and collected {litter} pieces of litter from the
              trail. Keep going — every badge stands for something you learned.
            </p>
            <div style={{ marginTop: 14 }}>
              <ProgressBar value={percent} max={100} label="Overall progress" valueText={`${percent}%`} accent />
            </div>
          </div>
        </div>

        <div className="dash-grid">
          {cards.map((card) => (
            <div className="dash-card" key={card.label}>
              <span className="dash-card__icon">{card.icon}</span>
              <span className="dash-card__value">{card.value}</span>
              <span className="dash-card__label">{card.label}</span>
            </div>
          ))}
        </div>

        <section className="stack">
          <h2 className="section-title" style={{ fontSize: "1.3rem" }}>
            Missions
          </h2>
          <div className="stack" style={{ gap: 10 }}>
            {MISSIONS.map((mission) => {
              const status = missionStatus(progress, mission.id);
              const record = progress.missions[mission.id];
              const locked = status === "locked";
              return (
                <div className="card card--flat row" key={mission.id} style={{ gap: 14 }}>
                  <span className="mission-card__icon" style={{ background: `${mission.accent}22`, color: mission.accent }}>
                    {locked ? <Lock size={22} /> : status === "completed" ? <Check size={22} /> : <Star size={22} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 900 }}>
                      Mission {mission.id}: {mission.title}
                    </div>
                    <div style={{ color: "var(--muted)", fontWeight: 700, fontSize: "0.9rem" }}>
                      {mission.short}
                    </div>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <StatusChip status={status} />
                    <span className="chip chip--done">Quiz {record.quizBest}/3</span>
                    <span className="chip">{record.gameplayPoints} pts</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    disabled={locked}
                    onClick={() => {
                      sound("click");
                      openMission(mission.id);
                    }}
                    aria-label={`Open mission ${mission.id}`}
                  >
                    {status === "completed" ? "Replay" : locked ? "Locked" : "Play"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="stack">
          <h2 className="section-title" style={{ fontSize: "1.3rem" }}>
            Badges
          </h2>
          <div className="badge-grid">
            {badges.map((badge) => (
              <BadgeTile
                key={badge.id}
                id={badge.id}
                name={badge.name}
                blurb={badge.blurb}
                earned={progress.badges.includes(badge.id)}
              />
            ))}
          </div>
        </section>

        <section className="stack">
          <h2 className="section-title" style={{ fontSize: "1.3rem" }}>
            Lessons learned
          </h2>
          <div className="steps">
            {MISSIONS.map((mission) => {
              const finished = progress.missions[mission.id].status === "completed";
              return (
                <div className="step" key={mission.id}>
                  <span className="step__num">{finished ? <Check size={15} /> : mission.id}</span>
                  <span>
                    <strong>{mission.title}:</strong> {mission.takeaway}
                    {!finished ? (
                      <span style={{ display: "block", color: "var(--muted)", fontWeight: 700 }}>
                        Finish the mission and quiz to add this lesson.
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })}
            <div className="step">
              <span className="step__num">
                {progress.badges.includes(FINAL_BADGE.id) ? <Check size={15} /> : 6}
              </span>
              <span>
                <strong>{FINAL_BADGE.name}:</strong> {FINAL_BADGE.blurb}
              </span>
            </div>
          </div>
          <p className="explain">{Object.values(QUIZZES).length} quizzes · 15 questions in total</p>
        </section>

        <div className="feedback feedback--good">
          <span className="feedback__icon">
            <Trophy size={20} aria-hidden="true" />
          </span>
          <span>
            <strong>Every responsible choice makes a difference.</strong> Your progress is saved on this
            device automatically.
          </span>
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              sound("back");
              go({ name: "menu" });
            }}
          >
            Main menu
          </button>
          <button type="button" className="btn btn--primary" onClick={() => go({ name: "missions" })}>
            <RotateCcw size={18} aria-hidden="true" />
            Mission board
          </button>
        </div>
      </div>

      {showSettings ? <SettingsModal onClose={() => setShowSettings(false)} /> : null}
    </div>
  );
}
