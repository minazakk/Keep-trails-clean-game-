import { LitterArt, BinArt } from "./Items";

const BROWN = "#8a5a33";
const BROWN_DARK = "#6f4526";
const TAN = "#d9a06a";

/** Friendly seated monkey, drawn in a soft illustrated style. */
export function MonkeyArt({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 200 180" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="166" rx="58" ry="10" fill="#000000" opacity="0.12" />
      <path
        d="M150 118c34 4 44-30 24-44-13-9-28 2-24 16"
        fill="none"
        stroke={BROWN}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <ellipse cx="76" cy="150" rx="24" ry="12" fill={BROWN_DARK} />
      <ellipse cx="124" cy="150" rx="24" ry="12" fill={BROWN_DARK} />
      <ellipse cx="100" cy="116" rx="44" ry="40" fill={BROWN} />
      <ellipse cx="100" cy="124" rx="27" ry="27" fill={TAN} />
      <path d="M62 106c-12 10-16 26-8 36" stroke={BROWN} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M138 106c12 10 16 26 8 36" stroke={BROWN} strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="64" cy="64" r="14" fill={BROWN} />
      <circle cx="64" cy="64" r="7.5" fill={TAN} />
      <circle cx="136" cy="64" r="14" fill={BROWN} />
      <circle cx="136" cy="64" r="7.5" fill={TAN} />
      <circle cx="100" cy="66" r="36" fill={BROWN} />
      <ellipse cx="100" cy="72" rx="26" ry="24" fill="#f0cba0" />
      <ellipse cx="100" cy="84" rx="15" ry="11" fill="#f8e3ca" />
      <circle cx="89" cy="62" r="5.5" fill="#2b2b2b" />
      <circle cx="111" cy="62" r="5.5" fill="#2b2b2b" />
      <circle cx="91" cy="60" r="1.8" fill="#ffffff" />
      <circle cx="113" cy="60" r="1.8" fill="#ffffff" />
      <circle cx="95" cy="80" r="2" fill="#7a5533" />
      <circle cx="105" cy="80" r="2" fill="#7a5533" />
      <path d="M92 90c5 6 11 6 16 0" stroke="#7a5533" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Small songbird perched on a branch. */
export function BirdArt({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <path d="M8 112h184" stroke="#7a5533" strokeWidth="10" strokeLinecap="round" />
      <path d="M40 112c14-14 34-16 46-6" stroke="#6b9c4a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M132 66c22-6 40 6 44 22-16 10-36 8-48-4z" fill="#3f7fbf" />
      <ellipse cx="112" cy="76" rx="40" ry="34" fill="#4f95d1" />
      <path d="M96 62c16 0 30 10 34 24-16 8-34 4-42-10z" fill="#3f7fbf" />
      <circle cx="74" cy="52" r="26" fill="#4f95d1" />
      <circle cx="66" cy="46" r="5" fill="#22303f" />
      <circle cx="68" cy="44" r="1.8" fill="#ffffff" />
      <path d="M50 54l-16 6 16 7z" fill="#e8873a" />
      <path d="M104 106l-6 18M124 106l4 18" stroke="#e8873a" strokeWidth="5" strokeLinecap="round" />
      <path d="M96 66c8 6 20 8 30 6" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round" />
    </svg>
  );
}

/** Nest with three eggs hidden in a tree. */
export function NestArt({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 220 188" aria-hidden="true" focusable="false">
      <rect x="96" y="60" width="18" height="128" rx="8" fill="#7a5533" />
      <path d="M104 96c-30-6-56-26-64-52" stroke="#7a5533" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M108 108c30-4 54-22 64-46" stroke="#7a5533" strokeWidth="14" fill="none" strokeLinecap="round" />
      <g fill="#478f56">
        <circle cx="44" cy="44" r="24" />
        <circle cx="70" cy="30" r="20" />
        <circle cx="164" cy="60" r="24" />
        <circle cx="188" cy="44" r="18" />
        <circle cx="104" cy="34" r="26" />
      </g>
      <g>
        <ellipse cx="104" cy="132" rx="54" ry="26" fill="#9a6b3f" />
        <path d="M56 132c8 16 34 26 48 26s40-10 48-26" fill="#8a5a33" />
        <path d="M60 126c14 6 32 8 44 8s30-2 44-8" stroke="#c99a5f" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="88" cy="124" rx="13" ry="16" fill="#f4e7cf" />
        <ellipse cx="110" cy="120" rx="13" ry="16" fill="#f4e7cf" />
        <ellipse cx="130" cy="126" rx="12" ry="15" fill="#f4e7cf" />
        <circle cx="86" cy="120" r="3" fill="#d9c49c" />
        <circle cx="112" cy="116" r="3" fill="#d9c49c" />
      </g>
      <g fill="#4f95d1">
        <ellipse cx="150" cy="70" rx="16" ry="14" />
        <circle cx="138" cy="60" r="10" />
        <path d="M128 60l-8 3 8 3z" fill="#e8873a" />
      </g>
    </svg>
  );
}

/** Gentle deer standing in a clearing. */
export function DeerArt({ size = 220 }: { size?: number }) {
  const DEER = "#b98149";
  const DEER_LIGHT = "#e6c39a";
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 220 198" aria-hidden="true" focusable="false">
      <ellipse cx="112" cy="188" rx="72" ry="9" fill="#000000" opacity="0.12" />
      <g stroke="#8a5a33" strokeWidth="8" strokeLinecap="round">
        <path d="M76 132v48" />
        <path d="M96 134v46" />
        <path d="M144 134v46" />
        <path d="M164 132v48" />
      </g>
      <ellipse cx="120" cy="112" rx="58" ry="40" fill={DEER} />
      <path d="M76 96c-16 8-24 22-24 36" stroke={DEER} strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M164 92c14-6 24-18 26-32" stroke={DEER} strokeWidth="22" fill="none" strokeLinecap="round" />
      <ellipse cx="196" cy="52" rx="24" ry="20" fill={DEER} transform="rotate(-12 196 52)" />
      <path d="M214 44l16-6-14-6z" fill="#6f4526" />
      <circle cx="204" cy="46" r="4" fill="#2b2b2b" />
      <path d="M184 40c-6-14 2-24 10-24" stroke={DEER} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M198 34c2-14 12-20 18-16M198 34c8-8 18-6 22 0" stroke="#8a5a33" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g fill="#f6e6cf">
        <circle cx="104" cy="98" r="6" />
        <circle cx="126" cy="92" r="5" />
        <circle cx="144" cy="104" r="6" />
        <circle cx="88" cy="112" r="5" />
      </g>
      <path d="M64 116c-10 6-14 16-10 24" stroke="#6f4526" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M150 140c10 4 20 2 26-4" stroke={DEER_LIGHT} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/** Hiker with a backpack and walking stick. */
export function HikerArt({ size = 200, tone = "#2f7d4f" }: { size?: number; tone?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="190" rx="46" ry="8" fill="#000000" opacity="0.12" />
      <g stroke="#2b3a4a" strokeWidth="12" strokeLinecap="round">
        <path d="M88 132l-10 50" />
        <path d="M114 132l12 50" />
      </g>
      <g stroke="#e8873a" strokeWidth="13" strokeLinecap="round">
        <path d="M76 82l-16 44" />
        <path d="M126 82l18 40" />
      </g>
      <rect x="74" y="76" width="54" height="62" rx="20" fill={tone} />
      <rect x="122" y="84" width="26" height="46" rx="12" fill="#1f5132" />
      <path d="M126 96h18" stroke="#8fcf9a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="52" r="26" fill="#f0cba0" />
      <path d="M74 48c8-20 44-24 54-4l2 4H74z" fill="#e8873a" />
      <path d="M74 50h58" stroke="#b3641f" strokeWidth="5" strokeLinecap="round" />
      <circle cx="92" cy="54" r="4" fill="#2b2b2b" />
      <circle cx="110" cy="54" r="4" fill="#2b2b2b" />
      <path d="M94 66c4 4 10 4 14 0" stroke="#b3641f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M150 60v112" stroke="#7a5533" strokeWidth="7" strokeLinecap="round" />
      <g stroke="#2b3a4a" strokeWidth="12" strokeLinecap="round">
        <path d="M88 132l-10 50" />
      </g>
      <path d="M64 184h34M112 184h36" stroke="#22303f" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

/** Trail warning sign. */
export function TrailSignArt({ size = 180, text = "TRAIL CLOSED" }: { size?: number; text?: string }) {
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 180 170" aria-hidden="true" focusable="false">
      <rect x="82" y="70" width="16" height="94" rx="7" fill="#7a5533" />
      <rect x="24" y="24" width="132" height="62" rx="10" fill="#f6e7c6" stroke="#7a5533" strokeWidth="7" />
      <path d="M46 46h88M46 64h64" stroke="#b3641f" strokeWidth="7" strokeLinecap="round" />
      <path d="M90 86l-22 40h44z" fill="#e8483a" />
      <path d="M90 98v12" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="90" cy="116" r="3.4" fill="#ffffff" />
      <text x="90" y="46" textAnchor="middle" fontSize="15" fontWeight="800" fill="#7a4a12" fontFamily="Nunito, sans-serif">
        {text}
      </text>
    </svg>
  );
}

/** Water bottle used as a visual clue. */
export function WaterArt({ size = 150 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <path d="M80 20c14 16 26 30 26 50 0 30-14 52-26 62-12-10-26-32-26-62 0-20 12-34 26-50z" fill="#9ed6f2" stroke="#3f7fbf" strokeWidth="6" strokeLinejoin="round" />
      <path d="M64 88c6 14 14 24 16 34" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <path d="M80 30v96" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
    </svg>
  );
}

export type SituationScene = "monkey" | "nest" | "deer" | "hikers";

/** Illustration shown for each wildlife situation. */
export function SituationArt({ scene }: { scene: SituationScene }) {
  switch (scene) {
    case "monkey":
      return (
        <div className="row" style={{ justifyContent: "center", gap: 4 }}>
          <MonkeyArt size={190} />
          <HikerArt size={130} tone="#2f7d4f" />
        </div>
      );
    case "nest":
      return <NestArt size={230} />;
    case "deer":
      return (
        <div className="row" style={{ justifyContent: "center", gap: 4 }}>
          <DeerArt size={210} />
          <BirdArt size={110} />
        </div>
      );
    case "hikers":
      return (
        <div className="row" style={{ justifyContent: "center", gap: 2 }}>
          <HikerArt size={125} tone="#1f7a8c" />
          <HikerArt size={135} tone="#c2691c" />
          <DeerArt size={150} />
        </div>
      );
  }
}

export type SafetyClue = "trail" | "water" | "sign" | "shortcut" | "weather" | "hiker";

/** Small illustration for each hiking-safety situation. */
export function SafetyClueArt({ clue }: { clue: SafetyClue }) {
  switch (clue) {
    case "trail":
      return (
        <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
          <rect width="260" height="150" rx="16" fill="#dff0e2" />
          <path d="M0 96c60-16 110 16 170 2s70-10 90-4v56H0z" fill="#8ec27f" />
          <path d="M20 150c30-40 70-46 100-70 24-20 60-24 96-40" stroke="#e9dcbc" strokeWidth="26" fill="none" strokeLinecap="round" />
          <rect x="196" y="34" width="10" height="60" rx="5" fill="#7a5533" />
          <rect x="150" y="38" width="60" height="30" rx="7" fill="#f6e7c6" stroke="#7a5533" strokeWidth="5" />
          <path d="M162 53h30" stroke="#2f7d4f" strokeWidth="5" strokeLinecap="round" />
          <path d="M188 46l12 7-12 7z" fill="#2f7d4f" />
          <circle cx="54" cy="40" r="18" fill="#fbe19a" />
        </svg>
      );
    case "water":
      return (
        <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
          <rect width="260" height="150" rx="16" fill="#e2f1fa" />
          <path d="M0 110c50-12 90 12 140 0s80-8 120 0v40H0z" fill="#cfe8f5" />
          <g transform="translate(76 24)">
            <rect x="26" y="0" width="26" height="18" rx="5" fill="#3f7fbf" />
            <path d="M22 18h34v14l12 18v56a12 12 0 0 1-12 12H22a12 12 0 0 1-12-12V50l12-18z" fill="#d5eefb" stroke="#3f7fbf" strokeWidth="5" strokeLinejoin="round" />
            <rect x="10" y="62" width="58" height="22" rx="5" fill="#3f7fbf" opacity="0.75" />
          </g>
          <circle cx="200" cy="52" r="22" fill="#fbe19a" />
          <path d="M186 106c8-10 22-10 30 0" stroke="#3f7fbf" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "sign":
      return (
        <div className="clue-frame">
          <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
            <rect width="260" height="150" rx="16" fill="#e6f0e4" />
            <path d="M0 118c60-14 120 10 180-2s50-6 80-2v36H0z" fill="#8ec27f" />
            <path d="M206 132c16-16 34-18 48-8" stroke="#e9dcbc" strokeWidth="16" fill="none" strokeLinecap="round" />
          </svg>
          <div className="clue-layer" style={{ left: 78, top: 8 }}>
            <TrailSignArt size={132} text="CLOSED" />
          </div>
        </div>
      );
    case "shortcut":
      return (
        <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
          <rect width="260" height="150" rx="16" fill="#eef3e6" />
          <path d="M0 128L96 34l60 46 44-30 60 62v38H0z" fill="#a9c9a1" />
          <path d="M20 150c40-34 78-52 116-70 30-14 60-24 96-34" stroke="#e9dcbc" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray="4 20" />
          <path d="M40 150c26-46 62-74 104-96" stroke="#d9c79f" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M150 60l18 26" stroke="#b6462f" strokeWidth="6" strokeLinecap="round" />
          <circle cx="150" cy="58" r="12" fill="none" stroke="#b6462f" strokeWidth="6" />
        </svg>
      );
    case "weather":
      return (
        <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
          <rect width="260" height="150" rx="16" fill="#dfe6ee" />
          <path d="M0 132L70 62l44 36 40-30 56 64v18H0z" fill="#7f8fa3" />
          <g fill="#8b93a5">
            <ellipse cx="90" cy="44" rx="34" ry="18" />
            <ellipse cx="130" cy="38" rx="30" ry="16" />
            <ellipse cx="64" cy="50" rx="24" ry="13" />
          </g>
          <path d="M118 56l-14 24h18l-12 24" stroke="#f4c04f" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M176 62l-8 14M198 56l-8 14M220 66l-8 14" stroke="#4f95d1" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "hiker":
      return (
        <div className="clue-frame">
          <svg width="260" height="150" viewBox="0 0 260 150" aria-hidden="true" focusable="false">
            <rect width="260" height="150" rx="16" fill="#e8f2e6" />
            <path d="M0 112c60-12 110 14 170 0s60-8 90-2v40H0z" fill="#8ec27f" />
            <path d="M10 138c60-8 120-18 240-34" stroke="#e9dcbc" strokeWidth="22" fill="none" strokeLinecap="round" />
            <circle cx="216" cy="40" r="20" fill="#fbe19a" />
          </svg>
          <div className="clue-layer" style={{ left: 32, bottom: 8 }}>
            <HikerArt size={112} tone="#1f7a8c" />
          </div>
          <div className="clue-layer" style={{ left: 122, bottom: 16 }}>
            <HikerArt size={104} tone="#c2691c" />
          </div>
        </div>
      );
  }
}

/** Visual used by quiz questions. */
export function QuizVisual({ kind }: { kind: "bottle" | "monkey" | "deer" | "sign" | "bin" | "water" }) {
  switch (kind) {
    case "bottle":
      return (
        <div style={{ background: "#ffffff", borderRadius: 18, padding: 12, boxShadow: "var(--shadow-sm)" }}>
          <LitterArt kind="bottle" size={96} />
        </div>
      );
    case "monkey":
      return <MonkeyArt size={190} />;
    case "deer":
      return <DeerArt size={210} />;
    case "sign":
      return <TrailSignArt size={170} text="CLOSED" />;
    case "bin":
      return (
        <div className="row" style={{ gap: 8 }}>
          <BinArt color="#1f7a8c" size={72} />
          <BinArt color="#7a5b2e" size={72} />
          <BinArt color="#5b6470" size={72} />
        </div>
      );
    case "water":
      return <WaterArt size={140} />;
  }
}
