import { WILDLIFE_SCENARIOS } from "../game/content";
import { recordGameplay } from "../game/logic";
import { SituationArt } from "../art/Characters";
import { useGame } from "../game/state";
import { DecisionPlay, type PlayScenario } from "./DecisionPlay";

const SCENE_TIP: Record<string, string> = {
  monkey: "Wild monkeys are curious, not friendly. Space keeps everyone safe.",
  nest: "A nest is a home. Never look inside, touch it or move it.",
  deer: "Watch from the trail. Binoculars beat running through the habitat.",
  hikers: "Speak up kindly — most people simply do not know the trail rules.",
};

export function WildlifeGuardian() {
  const { finishGameplay, sound, update } = useGame();

  const scenarios: PlayScenario[] = WILDLIFE_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    title: scenario.title,
    situation: scenario.situation,
    options: scenario.options,
    art: <SituationArt scene={scenario.scene} />,
    note: SCENE_TIP[scenario.scene],
  }));

  return (
    <DecisionPlay
      scenarios={scenarios}
      pointsPerChoice={15}
      accent="#3f7d3a"
      missionTip="Observe wildlife from a safe distance. Never chase, touch or corner an animal, never disturb a nest, keep noise low, and follow official park instructions."
      onProgress={({ points, decisions }) =>
        update((p) => recordGameplay(p, 3, points, { decisions }))
      }
      onComplete={({ points, decisions }) => {
        sound("complete");
        finishGameplay({ mission: 3, points, litter: 0, decisions });
      }}
    />
  );
}
