import type { MissionId } from "../game/types";
import { CleanTrail } from "./CleanTrail";
import { SortWaste } from "./SortWaste";
import { WildlifeGuardian } from "./WildlifeGuardian";
import { DontFeedAnimals } from "./DontFeedAnimals";
import { HikeSafe } from "./HikeSafe";

export function MissionPlay({ id }: { id: MissionId }) {
  switch (id) {
    case 1:
      return <CleanTrail />;
    case 2:
      return <SortWaste />;
    case 3:
      return <WildlifeGuardian />;
    case 4:
      return <DontFeedAnimals />;
    case 5:
      return <HikeSafe />;
    default:
      return null;
  }
}
