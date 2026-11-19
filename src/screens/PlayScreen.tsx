import { ArrowLeft, Home, Volume2, VolumeX } from "lucide-react";
import { getMission } from "../game/content";
import { missionStatus, totalPoints } from "../game/logic";
import type { MissionId } from "../game/types";
import { useGame } from "../game/state";
import { Logo, MissionIcon, ProgressBar, ScorePill } from "../components/Common";
import { MissionPlay } from "../missions";

export function PlayScreen({ missionId }: { missionId: MissionId }) {
  const { progress, go, setSettings } = useGame();
  const mission = getMission(missionId);
  const status = missionStatus(progress, missionId);
  const record = progress.missions[missionId];
  const statusText =
    status === "completed" ? "Replay — your best score is kept" : `Mission ${missionId} of 5`;

  return (
    <div className="screen">
      <header className="topbar">
        <div className="container topbar__inner">
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => go({ name: "missions" })}
            aria-label="Leave mission and return to mission board"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <Logo size={36} />
          <div style={{ minWidth: 0 }}>
            <div className="topbar__title">
              {mission.title}
            </div>
            <div className="topbar__meta">{statusText}</div>
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
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => go({ name: "menu" })}
            aria-label="Back to main menu"
          >
            <Home size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="container stack" style={{ paddingBlock: "clamp(16px, 3vh, 28px)" }}>
        <div className="row" style={{ gap: 14 }}>
          <span className="mission-card__icon" style={{ background: `${mission.accent}22`, color: mission.accent }}>
            <MissionIcon icon={mission.icon} size={26} />
          </span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontWeight: 800, color: "var(--forest)" }}>{mission.objective}</p>
            <div style={{ marginTop: 8 }}>
              <ProgressBar
                value={record.gameplayPoints}
                max={mission.maxPoints}
                label="Best run"
                valueText={`${record.gameplayPoints}/${mission.maxPoints} pts`}
                accent
              />
            </div>
          </div>
        </div>

        <MissionPlay id={missionId} />
      </div>
    </div>
  );
}
