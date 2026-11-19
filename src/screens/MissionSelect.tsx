import type { CSSProperties } from "react";
import { ArrowLeft, BarChart3, Lock, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useGame } from "../game/state";
import { MISSIONS } from "../game/content";
import { missionStatus, overallPercent, totalPoints } from "../game/logic";
import type { MissionId } from "../game/types";
import { Logo, MissionIcon, ProgressBar, ScorePill, StatusChip } from "../components/Common";

function MissionCard({ id }: { id: MissionId }) {
  const { progress, openMission, sound } = useGame();
  const mission = MISSIONS.find((m) => m.id === id)!;
  const status = missionStatus(progress, id);
  const locked = status === "locked";
  const record = progress.missions[id];

  const accentSoft: Record<string, string> = {
    1: "#dff0e2",
    2: "#d9eef3",
    3: "#e2f0dd",
    4: "#fbe9d8",
    5: "#fbe6d2",
  };

  return (
    <button
      type="button"
      className="mission-card"
      style={
        {
          "--accent": mission.accent,
          "--accent-soft": accentSoft[String(id)],
        } as CSSProperties
      }
      onClick={() => {
        if (locked) return;
        sound("click");
        openMission(id);
      }}
      disabled={locked}
      aria-label={`${mission.title}. Status: ${status}. ${locked ? "Locked." : "Select mission."}`}
    >
      <div className="mission-card__head">
        <span className="mission-card__icon">
          {locked ? <Lock size={26} aria-hidden="true" /> : <MissionIcon icon={mission.icon} size={26} />}
        </span>
        <span>
          <span className="mission-card__title">
            Mission {id}: {mission.title}
          </span>
          <span className="mission-card__short">{mission.short}</span>
        </span>
      </div>

      <p className="mission-card__desc">{mission.description}</p>

      <div className="row" style={{ gap: 8 }}>
        <StatusChip status={status} />
        {record.quizBest > 0 ? (
          <span className="chip chip--done">Quiz {record.quizBest}/3</span>
        ) : null}
      </div>

      <div className="mission-card__foot">
        <span>
          {locked ? "Finish the previous mission to unlock" : `${mission.maxPoints} pts available`}
        </span>
        {status === "completed" ? (
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "var(--ok)" }}>
            <RotateCcw size={16} aria-hidden="true" /> Replay
          </span>
        ) : status === "in_progress" ? (
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "#8a4a12" }}>
            <Play size={16} aria-hidden="true" /> Continue
          </span>
        ) : locked ? null : (
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center", color: mission.accent }}>
            <Play size={16} aria-hidden="true" /> Start
          </span>
        )}
      </div>
    </button>
  );
}

export function MissionSelect() {
  const { progress, go, setSettings } = useGame();
  const percent = overallPercent(progress);

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => go({ name: "menu" })}
            aria-label="Back to main menu"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <Logo size={38} />
          <div style={{ minWidth: 0 }}>
            <div className="topbar__title">Mission board</div>
            <div className="topbar__meta">{percent}% complete</div>
          </div>
          <div className="spacer" />
          <ScorePill points={totalPoints(progress)} />
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => setSettings({ sound: !progress.settings.sound })}
            aria-label={progress.settings.sound ? "Mute sound" : "Turn sound on"}
            aria-pressed={progress.settings.sound}
          >
            {progress.settings.sound ? (
              <Volume2 size={20} aria-hidden="true" />
            ) : (
              <VolumeX size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <div className="container stack" style={{ paddingBlock: "clamp(18px, 4vh, 34px)" }}>
        <div>
          <h1 className="section-title">Choose your mission</h1>
          <p className="section-sub">
            Five short missions. Complete a mission and its quiz to unlock the next one. You can replay any
            mission you have finished.
          </p>
        </div>

        <ProgressBar
          value={percent}
          max={100}
          label="Overall progress"
          valueText={`${percent}%`}
          accent
        />

        <div className="mission-grid">
          {MISSIONS.map((mission) => (
            <MissionCard key={mission.id} id={mission.id} />
          ))}
        </div>

        <div className="row" style={{ justifyContent: "space-between" }}>
          <button type="button" className="btn btn--ghost" onClick={() => go({ name: "dashboard" })}>
            <BarChart3 size={18} aria-hidden="true" />
            Progress dashboard
          </button>
          <button type="button" className="btn btn--primary" onClick={() => go({ name: "menu" })}>
            Main menu
          </button>
        </div>
      </div>
    </div>
  );
}
