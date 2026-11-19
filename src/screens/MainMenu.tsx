import { useState } from "react";
import { BarChart3, HelpCircle, Play, Settings, Volume2, VolumeX } from "lucide-react";
import { MountainScene } from "../art/Scenery";
import { Logo } from "../components/Common";
import { HowToPlayModal, SettingsModal } from "./Modals";
import { useGame } from "../game/state";
import { totalPoints } from "../game/logic";

export function MainMenu() {
  const { progress, go, sound, setSettings } = useGame();
  const [modal, setModal] = useState<"none" | "howto" | "settings">("none");
  const points = totalPoints(progress);

  return (
    <div className="menu">
      <div className="menu__bg">
        <MountainScene />
      </div>
      <div className="menu__veil" />

      <div className="menu__toolbar">
        <button
          type="button"
          className="btn btn--icon"
          onClick={() => setSettings({ sound: !progress.settings.sound })}
          aria-label={progress.settings.sound ? "Mute sound" : "Turn sound on"}
          aria-pressed={progress.settings.sound}
        >
          {progress.settings.sound ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="btn btn--icon"
          onClick={() => setModal("settings")}
          aria-label="Open settings"
        >
          <Settings size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="menu__content">
        <Logo size={78} />
        <h1 className="menu__title">TRAIL GUARDIANS</h1>
        <p className="menu__tagline">Clean Trails. Safe Wildlife. Better Tomorrow.</p>
        <p className="menu__motto">Your Visit. Your Responsibility.</p>

        <div className="menu__actions">
          <button
            type="button"
            className="btn btn--accent btn--lg btn--block"
            onClick={() => {
              sound("click");
              go({ name: "missions" });
            }}
          >
            <Play size={22} aria-hidden="true" />
            PLAY
          </button>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setModal("howto")}>
            <HelpCircle size={19} aria-hidden="true" />
            How to play
          </button>
          <button
            type="button"
            className="btn btn--quiet btn--block"
            style={{ color: "rgba(255,255,255,0.92)" }}
            onClick={() => go({ name: "dashboard" })}
          >
            <BarChart3 size={18} aria-hidden="true" />
            My progress
          </button>
        </div>

        {points > 0 ? (
          <p style={{ fontWeight: 800, fontSize: "0.95rem", opacity: 0.95 }}>
            Welcome back — {points} points earned so far
          </p>
        ) : null}
      </div>

      <p className="menu__footer">A five-mission environmental awareness game · Works offline once loaded</p>

      {modal === "howto" ? <HowToPlayModal onClose={() => setModal("none")} /> : null}
      {modal === "settings" ? <SettingsModal onClose={() => setModal("none")} /> : null}
    </div>
  );
}
