import { useState, type CSSProperties } from "react";
import { Check, Info, MousePointerClick, Recycle, Star, X } from "lucide-react";
import { BINS, SORT_RULE_NOTE, WASTE_ITEMS, type BinId } from "../game/content";
import { recordGameplay } from "../game/logic";
import { BinArt, WasteArt } from "../art/Items";
import { ProgressBar } from "../components/Common";
import { useGame } from "../game/state";

const POINTS_PER_ITEM = 10;

type Feedback =
  | { type: "good"; text: string; item: string; award: number }
  | { type: "bad"; text: string; item: string }
  | { type: "info"; text: string; item: string }
  | null;

export function SortWaste() {
  const { finishGameplay, notify, sound, update } = useGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [sortedIds, setSortedIds] = useState<string[]>([]);
  const [retriedIds, setRetriedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [wrongBin, setWrongBin] = useState<BinId | null>(null);
  const [points, setPoints] = useState(0);

  const total = WASTE_ITEMS.length;
  const sorted = sortedIds.length;
  const current = selected ? WASTE_ITEMS.find((item) => item.id === selected) ?? null : null;

  function handleBin(binId: BinId) {
    if (!current) {
      setFeedback({ type: "info", text: "Choose an item first, then pick the bin it belongs in.", item: "" });
      sound("select");
      return;
    }

    if (current.bin === binId) {
      const award = retriedIds.includes(current.id) ? 0 : POINTS_PER_ITEM;
      const nextSorted = [...sortedIds, current.id];
      setSortedIds(nextSorted);
      setPoints((value) => value + award);
      update((progress) =>
        recordGameplay(progress, 2, points + award, { decisions: nextSorted.length }),
      );
      setFeedback({
        type: "good",
        text: current.note,
        item: current.label,
        award,
      });
      setSelected(null);
      sound(award > 0 ? "collect" : "correct");
      notify(`${current.label} sorted correctly!`);

      if (nextSorted.length === total) {
        window.setTimeout(() => {
          sound("complete");
          finishGameplay({ mission: 2, points: points + award, litter: 0, decisions: total });
        }, 900);
      }
      return;
    }

    const bin = BINS.find((b) => b.id === binId)!;
    if (!retriedIds.includes(current.id)) setRetriedIds([...retriedIds, current.id]);
    setWrongBin(binId);
    window.setTimeout(() => setWrongBin(null), 450);
    setFeedback({
      type: "bad",
      text: `Not ${bin.name}. The right place for “${current.label}” is the ${BINS.find((b) => b.id === current.bin)?.name} bin. Try again.`,
      item: current.label,
    });
    sound("wrong");
  }

  function selectItem(id: string) {
    setSelected(id);
    sound("select");
    setFeedback({ type: "info", text: "Now choose the bin it belongs in.", item: "" });
  }

  return (
    <div className="game-layout">
      <div className="stack">
        <div className="hud">
          <div className="hud__stats">
            <div className="stat">
              <Recycle size={16} aria-hidden="true" />
              {sorted}/{total} sorted
            </div>
            <div className="stat">
              <Star size={16} aria-hidden="true" />
              {points} points
            </div>
          </div>
          {current ? (
            <span className="chip chip--progress">
              Selected: {current.label}
            </span>
          ) : (
            <span className="chip">Select an item</span>
          )}
        </div>

        <ProgressBar
          value={sorted}
          max={total}
          label="Sorting progress"
          valueText={`${sorted}/${total} sorted`}
          accent
        />

        <div className="panel sort-area">
          <div className="panel__title">1. Choose an item</div>
          <div className="item-tray">
            {WASTE_ITEMS.map((item) => {
              const isSorted = sortedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`waste-item ${isSorted ? "is-done" : ""}`.trim()}
                  aria-pressed={selected === item.id}
                  onClick={() => selectItem(item.id)}
                  disabled={isSorted}
                  draggable={!isSorted}
                  onDragStart={() => {
                    setSelected(item.id);
                    setFeedback({ type: "info", text: "Drop it into the right bin.", item: "" });
                  }}
                  aria-label={`${item.label}${isSorted ? ", sorted" : ""}`}
                >
                  <WasteArt kind={item.art} size={52} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="panel__title" style={{ marginTop: 6 }}>
            2. Send it to the right bin
          </div>
          <div className="bin-row">
            {BINS.map((bin) => (
              <button
                key={bin.id}
                type="button"
                className={`bin ${wrongBin === bin.id ? "is-wrong" : ""} ${
                  current && current.bin === bin.id ? "is-target" : ""
                }`.trim()}
                style={{ "--bin-color": bin.color, "--bin-ring": bin.ring } as CSSProperties}
                onClick={() => handleBin(bin.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  handleBin(bin.id);
                }}
                aria-label={`${bin.name} bin. ${bin.hint}`}
              >
                <BinArt color={bin.color} size={54} />
                <span className="bin__name">{bin.name}</span>
                <span className="bin__hint">{bin.hint}</span>
              </button>
            ))}
          </div>

          {feedback ? (
            <div
              className={`feedback ${
                feedback.type === "good"
                  ? "feedback--good"
                  : feedback.type === "bad"
                    ? "feedback--bad"
                    : "feedback--info"
              }`}
              role="status"
            >
              <span className="feedback__icon">
                {feedback.type === "good" ? (
                  <Check size={20} aria-hidden="true" />
                ) : feedback.type === "bad" ? (
                  <X size={20} aria-hidden="true" />
                ) : (
                  <Info size={20} aria-hidden="true" />
                )}
              </span>
              <span>
                {feedback.type === "good" ? (
                  <>
                    <strong>{feedback.item} — correct!</strong> {feedback.text}
                    {feedback.award > 0 ? (
                      <span style={{ display: "block", marginTop: 4, fontWeight: 900 }}>
                        +{feedback.award} points
                      </span>
                    ) : (
                      <span style={{ display: "block", marginTop: 4, fontWeight: 800 }}>
                        Correct — no extra points after a retry, but the lesson counts.
                      </span>
                    )}
                  </>
                ) : (
                  feedback.text
                )}
              </span>
            </div>
          ) : (
            <div className="feedback feedback--info">
              <span className="feedback__icon">
                <MousePointerClick size={20} aria-hidden="true" />
              </span>
              <span>
                Tap an item, then tap a bin. You can also drag an item into a bin with a mouse. Keyboard
                users can Tab between items and bins and press Enter.
              </span>
            </div>
          )}
        </div>
      </div>

      <aside className="panel stack" aria-label="Sorting rules">
        <div className="panel__title">
          <Recycle size={18} aria-hidden="true" /> Sorting rules
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, color: "var(--muted)" }}>Sorted</span>
          <span style={{ fontWeight: 900, color: "var(--forest)" }}>
            {sorted}/{total}
          </span>
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, color: "var(--muted)" }}>Points</span>
          <span style={{ fontWeight: 900, color: "var(--forest)" }}>{points}</span>
        </div>
        <hr className="divider" />
        <div className="feedback feedback--info">
          <span className="feedback__icon">
            <Info size={20} aria-hidden="true" />
          </span>
          <span>{SORT_RULE_NOTE}</span>
        </div>
        <p className="explain" style={{ fontSize: "0.9rem" }}>
          Clean, dry and empty is the golden rule for recyclables. Food-soiled paper and multi-layer
          packets usually go to general waste.
        </p>
      </aside>
    </div>
  );
}
