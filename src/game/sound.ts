type SfxName = "click" | "select" | "collect" | "correct" | "wrong" | "complete" | "unlock" | "back";

let context: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!context) context = new Ctor();
    if (context.state === "suspended") void context.resume();
    return context;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

const PATTERNS: Record<SfxName, Array<[number, number, number, OscillatorType?]>> = {
  click: [[520, 0, 0.07, "triangle"]],
  select: [[420, 0, 0.07, "triangle"]],
  back: [[320, 0, 0.08, "triangle"]],
  collect: [
    [660, 0, 0.09, "sine"],
    [880, 0.07, 0.11, "sine"],
  ],
  correct: [
    [587, 0, 0.1, "triangle"],
    [784, 0.09, 0.14, "triangle"],
  ],
  wrong: [
    [220, 0, 0.14, "sine"],
    [180, 0.1, 0.18, "sine"],
  ],
  complete: [
    [523, 0, 0.14, "triangle"],
    [659, 0.12, 0.14, "triangle"],
    [784, 0.24, 0.16, "triangle"],
    [1046, 0.38, 0.3, "triangle"],
  ],
  unlock: [
    [392, 0, 0.1, "sine"],
    [587, 0.1, 0.16, "sine"],
  ],
};

/** Plays a short synthesised sound effect. Silent when muted or unsupported. */
export function playSfx(name: SfxName): void {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;
  try {
    for (const [freq, start, duration, type] of PATTERNS[name]) {
      tone(ctx, freq, start, duration, 0.06, type ?? "sine");
    }
  } catch {
    /* audio is a nice-to-have; ignore failures */
  }
}
