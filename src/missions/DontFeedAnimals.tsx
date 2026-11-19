import { Hand, PawPrint } from "lucide-react";
import { FEED_SCENARIOS } from "../game/content";
import { recordGameplay } from "../game/logic";
import { HikerArt, MonkeyArt } from "../art/Characters";
import { useGame } from "../game/state";
import { DecisionPlay, type PlayScenario } from "./DecisionPlay";

export function DontFeedAnimals() {
  const { finishGameplay, sound, update } = useGame();

  const scenarios: PlayScenario[] = FEED_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    title: scenario.title,
    situation: scenario.situation,
    options: scenario.options,
    art: (
      <div className="row" style={{ justifyContent: "center", gap: 0 }}>
        <MonkeyArt size={200} />
        <HikerArt size={150} tone="#c2691c" />
      </div>
    ),
    note: scenario.lesson,
  }));

  return (
    <div className="stack">
      <div className="feedback feedback--info">
        <span className="feedback__icon">
          <Hand size={20} aria-hidden="true" />
        </span>
        <span>
          <strong>Admire wildlife. Never feed it. Let it stay wild.</strong> This mission only rewards
          keeping your distance and securing your food — feeding or touching an animal never earns points.
        </span>
      </div>

      <DecisionPlay
        scenarios={scenarios}
        pointsPerChoice={15}
        accent="#b5651d"
        missionTip="Feeding wildlife makes animals dependent on people, exposes them to food that makes them ill, changes their natural behaviour, and leads to conflict between animals and visitors."
        onProgress={({ points, decisions }) =>
          update((p) => recordGameplay(p, 4, points, { decisions }))
        }
        onComplete={({ points, decisions }) => {
          sound("complete");
          finishGameplay({ mission: 4, points, litter: 0, decisions });
        }}
      />

      <div className="feedback feedback--good">
        <span className="feedback__icon">
          <PawPrint size={20} aria-hidden="true" />
        </span>
        <span>Remember: a fed monkey becomes a bold monkey. Keep every snack in your bag.</span>
      </div>
    </div>
  );
}
