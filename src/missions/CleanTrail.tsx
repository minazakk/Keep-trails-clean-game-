import { useMemo, useRef, useState } from "react";
import { Check, Eye, Lightbulb, MousePointerClick, Star, Trash2 } from "lucide-react";
import { COLLECT_MESSAGES, LITTER } from "../game/content";
import { recordGameplay } from "../game/logic";
import { LitterArt } from "../art/Items";
import { TrailSceneBg } from "../art/Scenery";
import { ProgressBar } from "../components/Common";
import { useGame } from "../game/state";

const POINTS_PER_ITEM = 10;

export function CleanTrail() {
  const { finishGameplay, notify, sound, update } = useGame();
  const [found, setFound] = useState<string[]>([]);
  const foundRef = useRef<string[]>([]);
  const [hint, setHint] = useState(false);

  const total = LITTER.length;
  const collected = found.length;
  const points = collected * POINTS_PER_ITEM;
  const remaining = useMemo(() => LITTER.filter((item) => !found.includes(item.id)), [found]);

  function collect(id: string, label: string) {
    if (foundRef.current.includes(id)) return;
    const next = [...foundRef.current, id];
    foundRef.current = next;
    setFound(next);
    update((progress) => recordGameplay(progress, 1, next.length * POINTS_PER_ITEM, { litter: next.length }));
    sound("collect");
    notify(`${label} collected — ${next.length}/${total}`);

    if (next.length === total) {
      window.setTimeout(() => {
        sound("complete");
        finishGameplay({ mission: 1, points: total * POINTS_PER_ITEM, litter: total, decisions: 0 });
      }, 700);
    }
  }

  return (
    <div className="game-layout">
      <div className="stack">
        <div className="hud">
          <div className="hud__stats">
            <div className="stat">
              <Trash2 size={16} aria-hidden="true" />
              {collected}/{total} collected
            </div>
            <div className="stat">
              <Star size={16} aria-hidden="true" />
              {points} points
            </div>
            <div className="stat">
              <Eye size={16} aria-hidden="true" />
              {total - collected} left
            </div>
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            aria-pressed={hint}
            onClick={() => {
              setHint((value) => !value);
              sound("select");
            }}
          >
            <Lightbulb size={18} aria-hidden="true" />
            {hint ? "Hide hints" : "Show hint"}
          </button>
        </div>

        <ProgressBar
          value={collected}
          max={total}
          label="Trail cleanup"
          valueText={`${collected}/${total} collected`}
        />

        <div className={`scene ${hint ? "hint-on" : ""}`.trim()}>
          <div className="scene__art">
            <TrailSceneBg />
          </div>
          <div className="scene__label">Tap every piece of rubbish you can see</div>

          {LITTER.map((item) => {
            const isFound = found.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`litter ${isFound ? "litter--found" : ""}`.trim()}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => collect(item.id, item.label)}
                disabled={isFound}
                aria-label={isFound ? `${item.label} collected` : `Collect ${item.label}`}
              >
                <span className="litter__ring" aria-hidden="true" />
                <span
                  style={{
                    display: "block",
                    transform: `rotate(${item.tilt}deg)`,
                    filter: "drop-shadow(0 4px 6px rgba(20,40,25,0.35))",
                  }}
                >
                  <LitterArt kind={item.kind} size={item.size} />
                </span>
              </button>
            );
          })}

          {collected === total ? (
            <div
              className="feedback feedback--good"
              style={{ position: "absolute", left: "50%", bottom: 14, transform: "translateX(-50%)", zIndex: 5, maxWidth: "92%" }}
              role="status"
            >
              <span className="feedback__icon">
                <Check size={20} aria-hidden="true" />
              </span>
              <span>All litter collected — the trail is clean again!</span>
            </div>
          ) : null}
        </div>

        <div className="feedback feedback--info">
          <span className="feedback__icon">
            <MousePointerClick size={20} aria-hidden="true" />
          </span>
          <span>
            <strong>Take your rubbish with you. Leave the trail as you found it.</strong> Tap or click each
            item to pick it up. On a keyboard, press Tab to move and Enter to collect.
          </span>
        </div>
      </div>

      <aside className="panel stack" aria-label="Cleanup status">
        <div className="panel__title">
          <Trash2 size={18} aria-hidden="true" /> Cleanup list
        </div>
        <ul style={{ display: "grid", gap: 8, listStyle: "none", padding: 0, margin: 0 }}>
          {LITTER.map((item) => {
            const done = found.includes(item.id);
            return (
              <li
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: 700,
                  color: done ? "var(--muted)" : "var(--ink)",
                  textDecoration: done ? "line-through" : "none",
                  fontSize: "0.92rem",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: done ? "var(--ok)" : "var(--cream-deep)",
                    color: "#fff",
                    flex: "0 0 auto",
                  }}
                >
                  {done ? <Check size={14} /> : null}
                </span>
                {item.label}
              </li>
            );
          })}
        </ul>
        <hr className="divider" />
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, color: "var(--muted)" }}>Points this run</span>
          <span style={{ fontWeight: 900, color: "var(--forest)", fontSize: "1.2rem" }}>{points}</span>
        </div>
        <p className="explain" style={{ fontSize: "0.9rem" }}>
          {remaining.length > 0
            ? `Hint: ${remaining.length} item${remaining.length === 1 ? "" : "s"} still hiding on the trail. Turn on hints to see a pulsing ring.`
            : COLLECT_MESSAGES[COLLECT_MESSAGES.length - 1]}
        </p>
      </aside>
    </div>
  );
}
