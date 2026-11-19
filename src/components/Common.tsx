import { type ReactNode } from "react";
import {
  ArrowLeft,
  Award,
  Ban,
  Bird,
  Check,
  CloudRain,
  Droplets,
  Eye,
  Footprints,
  Hand,
  Home,
  Lock,
  Mountain,
  PawPrint,
  Recycle,
  Route,
  ShieldCheck,
  Star,
  Trash2,
  TriangleAlert,
  Trophy,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { MissionDefinition, MissionId, MissionStatus } from "../game/types";
import { MISSIONS, FINAL_BADGE } from "../game/content";
import { statusLabel } from "../game/logic";

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

export function Logo({ size = 64, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="logo" style={{ gap: withText ? 14 : 0 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Trail Guardians logo"
        style={{ flex: "0 0 auto" }}
      >
        <rect width="64" height="64" rx="18" fill="#1f5132" />
        <path d="M8 46l14-22 8 12 6-8 18 18z" fill="#8fcf9a" />
        <path d="M22 24l8 12 6-8 18 18H30z" fill="#6bbd82" />
        <path d="M8 46h46" stroke="#0f3420" strokeWidth="3" strokeLinecap="round" />
        <circle cx="46" cy="17" r="6" fill="#f4c04f" />
        <path d="M14 52c6-3 12-3 18 0" stroke="#e9dcbc" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
      {withText ? (
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: "1.1rem",
              letterSpacing: "0.06em",
              color: "var(--forest)",
            }}
          >
            TRAIL GUARDIANS
          </div>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--muted)" }}>
            Your Visit. Your Responsibility.
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mission icons                                                       */
/* ------------------------------------------------------------------ */

export function MissionIcon({ icon, size = 26 }: { icon: MissionDefinition["icon"]; size?: number }) {
  if (icon === "trash") return <Trash2 size={size} strokeWidth={2.2} aria-hidden="true" />;
  if (icon === "recycle") return <Recycle size={size} strokeWidth={2.2} aria-hidden="true" />;
  if (icon === "paw") return <PawPrint size={size} strokeWidth={2.2} aria-hidden="true" />;
  if (icon === "shield") return <ShieldCheck size={size} strokeWidth={2.2} aria-hidden="true" />;
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
      <Hand size={size} strokeWidth={2.2} aria-hidden="true" />
      <Ban
        size={size * 0.8}
        strokeWidth={2.6}
        aria-hidden="true"
        style={{ position: "absolute", right: -3, bottom: -3, color: "#b6462f" }}
      />
    </span>
  );
}

export function missionIconFor(id: MissionId) {
  const mission = MISSIONS.find((m) => m.id === id);
  return mission ? <MissionIcon icon={mission.icon} /> : null;
}

/* ------------------------------------------------------------------ */
/* Progress helpers                                                    */
/* ------------------------------------------------------------------ */

export function ProgressBar({
  value,
  max,
  accent = false,
  label,
  valueText,
}: {
  value: number;
  max: number;
  accent?: boolean;
  label?: string;
  valueText?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {label ? (
        <div className="progress-label">
          <span>{label}</span>
          <span>{valueText ?? `${value}/${max}`}</span>
        </div>
      ) : null}
      <div
        className={`progress ${accent ? "progress--accent" : ""}`.trim()}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Progress"}
        aria-valuetext={valueText ?? `${value} of ${max}`}
      >
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const STATUS_CLASS: Record<MissionStatus, string> = {
  locked: "chip chip--locked",
  available: "chip",
  in_progress: "chip chip--progress",
  completed: "chip chip--done",
};

const STATUS_ICON: Record<MissionStatus, ReactNode> = {
  locked: <Lock size={13} aria-hidden="true" />,
  available: <Star size={13} aria-hidden="true" />,
  in_progress: <Footprints size={13} aria-hidden="true" />,
  completed: <Check size={13} aria-hidden="true" />,
};

export function StatusChip({ status }: { status: MissionStatus }) {
  return (
    <span className={STATUS_CLASS[status]}>
      {STATUS_ICON[status]}
      {statusLabel(status)}
    </span>
  );
}

export function ScorePill({ points, label = "Points" }: { points: number; label?: string }) {
  return (
    <div className="score-pill" aria-label={`${points} ${label}`}>
      <Star size={16} fill="currentColor" aria-hidden="true" />
      <span>{points}</span>
      <span className="score-pill__label">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

const BADGE_STYLE: Record<string, { icon: typeof Star; color: string; ring: string }> = {
  "trail-cleaner": { icon: Trash2, color: "#2f7d4f", ring: "#8fcf9a" },
  "waste-sorting-hero": { icon: Recycle, color: "#1f7a8c", ring: "#a8ddec" },
  "wildlife-protector": { icon: PawPrint, color: "#3f7d3a", ring: "#a9dfbd" },
  "wildlife-feeding-awareness": { icon: Eye, color: "#b5651d", ring: "#f3cf9f" },
  "safety-champion": { icon: ShieldCheck, color: "#c2691c", ring: "#f6c79a" },
  "trail-guardian": { icon: Mountain, color: "#c8951f", ring: "#f6de9b" },
};

export function BadgeMedal({ id, size = 120 }: { id: string; size?: number }) {
  const style = BADGE_STYLE[id] ?? BADGE_STYLE["trail-guardian"];
  const Icon = style.icon;
  return (
    <div className="badge-art" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
        <path d="M30 70l-12 26 16-6 10 10 10-26z" fill="#e8873a" />
        <path d="M70 70l12 26-16-6-10 10-10-26z" fill="#d9722a" />
        <circle cx="50" cy="46" r="40" fill={style.ring} />
        <circle cx="50" cy="46" r="33" fill="#ffffff" />
        <circle cx="50" cy="46" r="28" fill={style.color} />
        <circle cx="50" cy="46" r="28" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
        <g fill="#ffffff" opacity="0.9">
          <circle cx="24" cy="20" r="2.5" />
          <circle cx="76" cy="18" r="3" />
          <circle cx="50" cy="8" r="2" />
        </g>
      </svg>
      <Icon
        size={size * 0.3}
        strokeWidth={2.4}
        color="#ffffff"
        aria-hidden="true"
        className="badge-art__icon"
      />
      <span className="sr-only">{id} badge</span>
    </div>
  );
}

export function BadgeTile({
  id,
  name,
  blurb,
  earned,
}: {
  id: string;
  name: string;
  blurb: string;
  earned: boolean;
}) {
  return (
    <div className={`badge-tile ${earned ? "" : "is-locked"}`.trim()}>
      <BadgeMedal id={id} size={76} />
      <div className="badge-tile__name">{earned ? name : "Locked"}</div>
      <div className="badge-tile__blurb">{earned ? blurb : "Complete the mission to earn it."}</div>
      <span className={`chip ${earned ? "chip--done" : "chip--locked"}`}>
        {earned ? <Check size={13} aria-hidden="true" /> : <Lock size={13} aria-hidden="true" />}
        {earned ? "Earned" : "Not yet"}
      </span>
    </div>
  );
}

export function allBadges() {
  return [
    ...MISSIONS.map((m) => ({ id: m.badge.id, name: m.badge.name, blurb: m.badge.blurb })),
    { id: FINAL_BADGE.id, name: FINAL_BADGE.name, blurb: FINAL_BADGE.blurb },
  ];
}

/* ------------------------------------------------------------------ */
/* Top bar                                                             */
/* ------------------------------------------------------------------ */

export function TopBar({
  title,
  meta,
  onBack,
  backLabel = "Back",
  right,
  points,
  sound,
  onToggleSound,
  onHome,
}: {
  title: string;
  meta?: string;
  onBack?: () => void;
  backLabel?: string;
  right?: ReactNode;
  points?: number;
  sound?: boolean;
  onToggleSound?: () => void;
  onHome?: () => void;
}) {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        {onBack ? (
          <button type="button" className="btn btn--ghost btn--icon" onClick={onBack} aria-label={backLabel}>
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        ) : null}
        <div style={{ minWidth: 0 }}>
          <div className="topbar__title">{title}</div>
          {meta ? <div className="topbar__meta">{meta}</div> : null}
        </div>
        <div className="spacer" />
        {right ?? (points !== undefined ? <ScorePill points={points} /> : null)}
        {onToggleSound ? (
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={onToggleSound}
            aria-label={sound ? "Mute sound" : "Turn sound on"}
            aria-pressed={!sound}
          >
            {sound ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
          </button>
        ) : null}
        {onHome ? (
          <button type="button" className="btn btn--ghost btn--icon" onClick={onHome} aria-label="Back to main menu">
            <Home size={20} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

const CONFETTI_COLORS = ["#e8873a", "#2f7d4f", "#f4c04f", "#1f7a8c", "#8fcf9a", "#ffffff"];

export function Confetti() {
  const pieces = Array.from({ length: 34 }, (_, i) => ({
    left: (i * 97) % 100,
    delay: (i % 7) * 0.35,
    duration: 2.6 + ((i * 13) % 5) * 0.5,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + ((i * 5) % 7),
  }));
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 1.4,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export const CLUE_ICONS = {
  trail: Route,
  water: Droplets,
  sign: TriangleAlert,
  shortcut: Footprints,
  weather: CloudRain,
  hiker: Users,
} as const;

export const SCENE_ICONS = {
  monkey: PawPrint,
  nest: Bird,
  deer: Eye,
  hikers: Users,
} as const;

export { Award, Check, Home, Lock, Recycle, ShieldCheck, Star, Trophy, Trash2, TriangleAlert };
