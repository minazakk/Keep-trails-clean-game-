import { GameProvider, useGame } from "./game/state";
import { MainMenu } from "./screens/MainMenu";
import { MissionSelect } from "./screens/MissionSelect";
import { MissionIntro } from "./screens/MissionIntro";
import { PlayScreen } from "./screens/PlayScreen";
import { MissionDone } from "./screens/MissionDone";
import { QuizScreen } from "./screens/Quiz";
import { ResultScreen } from "./screens/Result";
import { Dashboard } from "./screens/Dashboard";
import { FinalScreen } from "./screens/FinalScreen";

function CurrentScreen() {
  const { screen } = useGame();

  switch (screen.name) {
    case "menu":
      return <MainMenu />;
    case "missions":
      return <MissionSelect />;
    case "intro":
      return <MissionIntro missionId={screen.mission ?? 1} />;
    case "play":
      return <PlayScreen missionId={screen.mission ?? 1} />;
    case "missiondone":
      return <MissionDone missionId={screen.mission ?? 1} />;
    case "quiz":
      return <QuizScreen missionId={screen.mission ?? 1} />;
    case "result":
      return <ResultScreen missionId={screen.mission ?? 1} />;
    case "dashboard":
      return <Dashboard />;
    case "final":
      return <FinalScreen />;
    default:
      return <MainMenu />;
  }
}

function Shell() {
  const { toast, storageAvailable } = useGame();
  return (
    <div className="app-shell">
      <CurrentScreen />
      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
      {!storageAvailable ? (
        <div className="toast" role="status">
          Saving is unavailable in this browser — progress lasts until you close the tab.
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Shell />
    </GameProvider>
  );
}
