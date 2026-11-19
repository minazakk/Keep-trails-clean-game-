import { Compass, ShieldCheck } from "lucide-react";
import { SAFETY_SCENARIOS } from "../game/content";
import { recordGameplay } from "../game/logic";
import { SafetyClueArt } from "../art/Characters";
import { useGame } from "../game/state";
import { DecisionPlay, type PlayScenario } from "./DecisionPlay";

const CLUE_TIP: Record<string, string> = {
  trail: "Follow the marked path — it protects you and the habitat around it.",
  water: "Carry water, a snack, sun protection and a charged phone.",
  sign: "Warning signs and closures exist for real dangers. Respect them.",
  shortcut: "The long way down is easier on your knees and on the hillside.",
  weather: "Leave ridges early when clouds build. No view is worth the risk.",
  hiker: "Stay with an injured hiker and send someone for trained help.",
};

export function HikeSafe() {
  const { finishGameplay, sound, update } = useGame();

  const scenarios: PlayScenario[] = SAFETY_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    title: scenario.title,
    situation: scenario.situation,
    options: scenario.options,
    art: <SafetyClueArt clue={scenario.clue} />,
    note: CLUE_TIP[scenario.clue],
  }));

  return (
    <div className="stack">
      <div className="feedback feedback--info">
        <span className="feedback__icon">
          <Compass size={20} aria-hidden="true" />
        </span>
        <span>
          <strong>Plan ahead, stay on the trail, and look out for others.</strong> Six quick situations —
          pick the safe choice every time.
        </span>
      </div>

      <DecisionPlay
        scenarios={scenarios}
        pointsPerChoice={15}
        accent="#c2691c"
        missionTip="Carry drinking water, follow marked paths and warning signs, check the weather before you start, and never leave another hiker alone."
        onProgress={({ points, decisions }) =>
          update((p) => recordGameplay(p, 5, points, { decisions }))
        }
        onComplete={({ points, decisions }) => {
          sound("complete");
          finishGameplay({ mission: 5, points, litter: 0, decisions });
        }}
      />

      <div className="feedback feedback--good">
        <span className="feedback__icon">
          <ShieldCheck size={20} aria-hidden="true" />
        </span>
        <span>
          <strong>Trail safety kit:</strong> water, snack, sun protection, charged phone, and a plan
          someone at home knows about.
        </span>
      </div>
    </div>
  );
}
