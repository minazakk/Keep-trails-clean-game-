import { ArrowRight, Lightbulb, Play, Star, Target, Trophy } from "lucide-react";
import { useGame } from "../game/state";
import { MISSIONS } from "../game/content";
import { missionStatus, totalPoints } from "../game/logic";
import type { MissionId } from "../game/types";
import { Logo, MissionIcon, ScorePill, StatusChip } from "../components/Common";

export function MissionIntro({ missionId }: { missionId: MissionId }) {
  const { progress, go, sound, notify, startMission } = useGame();
  const mission = MISSIONS.find((m) => m.id === missionId)!;
  const status = missionStatus(progress, missionId);
  const record = progress.missions[missionId];

  const rules: { icon: React.ReactNode; text: string }[] = [
    { icon: <Target size={18} />, text: mission.objective },
    {
      icon: <Star size={18} />,
      text:
        missionId === 1
          ? "10 points for every piece of litter you collect."
          : missionId === 2
            ? "10 points for each item sorted correctly first time."
            : "15 points for every responsible decision.",
    },
    {
      icon: <Trophy size={18} />,
      text: `Score 2 out of 3 in the quiz to pass and earn the ${mission.badge.name} badge.`,
    },
    {
      icon: <Lightbulb size={18} />,
      text: "Read the short explanation after each choice — that is the lesson.",
    },
  ];

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => {
              sound("back");
              go({ name: "missions" });
            }}
            aria-label="Back to mission board"
          >
            <ArrowRight size={20} aria-hidden="true" style={{ transform: "scaleX(-1)" }} />
          </button>
          <Logo size={38} />
          <div style={{ minWidth: 0 }}>
            <div className="topbar__title">Mission {missionId}</div>
            <div className="topbar__meta">{mission.title}</div>
          </div>
          <div className="spacer" />
          <ScorePill points={totalPoints(progress)} />
        </div>
      </header>

      <div className="container container--narrow stack" style={{ paddingBlock: "clamp(20px, 5vh, 40px)" }}>
        <div className="card" style={{ display: "grid", gap: 16 }}>
          <div className="row" style={{ gap: 16 }}>
            <span
              className="mission-card__icon"
              style={{ background: `${mission.accent}22`, color: mission.accent, width: 64, height: 64 }}
            >
              <MissionIcon icon={mission.icon} size={30} />
            </span>
            <div>
              <div className="breadcrumb">
                Mission {missionId} of 5 <StatusChip status={status} />
              </div>
              <h1 className="section-title">{mission.title}</h1>
              <p className="section-sub">{mission.short}</p>
            </div>
          </div>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.6, fontWeight: 600 }}>{mission.description}</p>

          <div className="steps">
            {rules.map((rule, index) => (
              <div className="step" key={index}>
                <span className="step__num">{index + 1}</span>
                <span style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: mission.accent, marginTop: 2 }}>{rule.icon}</span>
                  <span>{rule.text}</span>
                </span>
              </div>
            ))}
          </div>

          {record.completedAt ? (
            <div className="feedback feedback--good">
              <span className="feedback__icon">
                <Trophy size={20} aria-hidden="true" />
              </span>
              <span>
                You have completed this mission before (best quiz {record.quizBest}/3). Replaying keeps your
                highest score and never removes points.
              </span>
            </div>
          ) : null}
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              sound("back");
              go({ name: "missions" });
            }}
          >
            Not now
          </button>
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={() => {
              sound("click");
              notify(`Mission ${missionId}: ${mission.title}`);
              startMission(missionId);
            }}
          >
            <Play size={20} aria-hidden="true" />
            Start mission
          </button>
        </div>
      </div>
    </div>
  );
}
