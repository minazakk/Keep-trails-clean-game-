import type { ReactNode } from "react";

interface SceneProps {
  className?: string;
}

function Pine({ x, y, s = 1, fill = "#2f6b45" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="-8" width="8" height="18" fill="#6b4a2b" rx="3" />
      <path d="M0 -74 L22 -34 L11 -34 L28 -2 L-28 -2 L-11 -34 L-22 -34 Z" fill={fill} />
      <path d="M0 -74 L22 -34 L11 -34 L28 -2 L0 -2 Z" fill="rgba(0,0,0,0.08)" />
    </g>
  );
}

function RoundTree({ x, y, s = 1, fill = "#3f8a56" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="-10" width="10" height="24" fill="#6b4a2b" rx="4" />
      <circle cx="0" cy="-34" r="24" fill={fill} />
      <circle cx="-18" cy="-20" r="17" fill={fill} />
      <circle cx="19" cy="-20" r="16" fill={fill} />
      <circle cx="6" cy="-46" r="15" fill="rgba(255,255,255,0.12)" />
    </g>
  );
}

function Clouds() {
  return (
    <g fill="#ffffff" opacity="0.9">
      <g className="cloud">
        <ellipse cx="220" cy="92" rx="58" ry="24" />
        <ellipse cx="180" cy="98" rx="40" ry="18" />
        <ellipse cx="262" cy="102" rx="44" ry="17" />
      </g>
      <g className="cloud cloud--slow">
        <ellipse cx="880" cy="70" rx="48" ry="20" />
        <ellipse cx="920" cy="76" rx="34" ry="15" />
        <ellipse cx="846" cy="78" rx="32" ry="14" />
      </g>
    </g>
  );
}

/** Wide mountain vista used behind the main menu. */
export function MountainScene({ className }: SceneProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustrated mountain trail in the Margalla Hills"
    >
      <defs>
        <linearGradient id="menu-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fd4ef" />
          <stop offset="55%" stopColor="#d7edf6" />
          <stop offset="100%" stopColor="#eef7ee" />
        </linearGradient>
        <linearGradient id="menu-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f8f5a" />
          <stop offset="100%" stopColor="#22603c" />
        </linearGradient>
      </defs>

      <rect width="1200" height="700" fill="url(#menu-sky)" />
      <circle cx="965" cy="128" r="58" fill="#fbe19a" />
      <circle cx="965" cy="128" r="86" fill="#fbe19a" opacity="0.35" />
      <Clouds />

      <path
        d="M0 340 L110 262 L196 316 L318 214 L430 306 L548 236 L688 320 L812 246 L944 330 L1076 272 L1200 344 L1200 430 L0 430 Z"
        fill="#a9c9cd"
      />
      <path
        d="M0 430 L140 356 L262 418 L392 336 L520 424 L664 366 L802 436 L944 378 L1082 434 L1200 404 L1200 520 L0 520 Z"
        fill="#79ac8b"
      />
      <path
        d="M0 520 C160 470 300 556 462 526 C620 496 762 566 902 536 C1030 508 1128 556 1200 534 L1200 700 L0 700 Z"
        fill="url(#menu-hill)"
      />

      <g opacity="0.95">
        <Pine x={80} y={560} s={0.9} />
        <Pine x={150} y={575} s={0.7} fill="#2c6340" />
        <RoundTree x={235} y={575} s={0.85} />
        <Pine x={330} y={565} s={0.75} fill="#2c6340" />
        <RoundTree x={430} y={585} s={0.7} />
        <Pine x={790} y={575} s={0.8} fill="#2c6340" />
        <RoundTree x={880} y={585} s={0.85} />
        <Pine x={985} y={565} s={0.95} />
        <Pine x={1090} y={580} s={0.7} fill="#2c6340" />
        <RoundTree x={1155} y={590} s={0.8} />
      </g>

      <path
        d="M470 700 C 512 632 660 616 636 556 C 616 508 546 506 578 460"
        stroke="#e9dbb8"
        strokeWidth="70"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M470 700 C 512 632 660 616 636 556 C 616 508 546 506 578 460"
        stroke="#d3c097"
        strokeWidth="4"
        strokeDasharray="16 22"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      <g>
        <ellipse cx="180" cy="668" rx="46" ry="16" fill="#1d5235" />
        <ellipse cx="1040" cy="676" rx="58" ry="18" fill="#1d5235" />
        <ellipse cx="800" cy="640" rx="30" ry="12" fill="#93907f" />
        <ellipse cx="812" cy="634" rx="20" ry="9" fill="#a8a595" />
        <ellipse cx="300" cy="646" rx="26" ry="11" fill="#93907f" />
      </g>

      <g opacity="0.9" fill="#2b3f5c">
        <path d="M300 150 q14 -12 28 0 q-14 -6 -28 0" />
        <path d="M350 132 q12 -10 24 0 q-12 -5 -24 0" />
        <path d="M690 118 q14 -12 28 0 q-14 -6 -28 0" />
      </g>
    </svg>
  );
}

/** Warm sunset vista used behind the final achievement screen. */
export function SunsetScene({ className }: SceneProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Sunset over the Margalla Hills with a clean hiking trail"
    >
      <defs>
        <linearGradient id="sunset-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5f96" />
          <stop offset="42%" stopColor="#e2865a" />
          <stop offset="78%" stopColor="#f7c877" />
          <stop offset="100%" stopColor="#fde8b7" />
        </linearGradient>
        <linearGradient id="sunset-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33704b" />
          <stop offset="100%" stopColor="#173f2a" />
        </linearGradient>
      </defs>

      <rect width="1200" height="700" fill="url(#sunset-sky)" />
      <circle cx="600" cy="392" r="88" fill="#ffe6a8" />
      <circle cx="600" cy="392" r="130" fill="#ffe6a8" opacity="0.35" />

      <path
        d="M0 430 L130 352 L250 414 L372 336 L498 420 L624 350 L760 424 L886 356 L1020 424 L1140 372 L1200 410 L1200 470 L0 470 Z"
        fill="#5b6f7d"
        opacity="0.75"
      />
      <path
        d="M0 470 L150 404 L286 462 L420 392 L556 468 L700 410 L846 470 L986 414 L1120 470 L1200 440 L1200 520 L0 520 Z"
        fill="#3a6b57"
        opacity="0.9"
      />
      <path
        d="M0 520 C170 476 320 556 470 526 C630 494 770 564 916 534 C1040 508 1130 552 1200 530 L1200 700 L0 700 Z"
        fill="url(#sunset-hill)"
      />

      <path
        d="M500 700 C 544 640 690 626 664 566 C 644 518 578 516 606 474"
        stroke="#e8d5ad"
        strokeWidth="64"
        fill="none"
        strokeLinecap="round"
        opacity="0.92"
      />

      <g>
        <Pine x={110} y={606} s={1} fill="#20503a" />
        <Pine x={210} y={624} s={0.78} fill="#1c4733" />
        <RoundTree x={320} y={634} s={0.8} fill="#27593f" />
        <Pine x={860} y={618} s={0.92} fill="#20503a" />
        <RoundTree x={965} y={636} s={0.86} fill="#27593f" />
        <Pine x={1085} y={610} s={1} fill="#1c4733" />
        <RoundTree x={1165} y={640} s={0.8} fill="#27593f" />
      </g>

      <g fill="#2a3b52">
        <path d="M760 210 q16 -14 32 0 q-16 -7 -32 0" />
        <path d="M812 190 q13 -11 26 0 q-13 -6 -26 0" />
        <path d="M400 176 q15 -13 30 0 q-15 -6 -30 0" />
      </g>
    </svg>
  );
}

/**
 * Base artwork for the hiking trail missions.
 * Coordinates are in an 800x500 box so items can be placed by percentage.
 */
export function TrailSceneBg({ className }: SceneProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="trail-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9dcf3" />
          <stop offset="100%" stopColor="#e6f5f4" />
        </linearGradient>
        <linearGradient id="trail-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ec27f" />
          <stop offset="100%" stopColor="#6fae63" />
        </linearGradient>
        <linearGradient id="trail-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9dcbc" />
          <stop offset="100%" stopColor="#d9c79f" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#trail-sky)" />
      <circle cx="688" cy="60" r="34" fill="#fbe19a" />
      <circle cx="688" cy="60" r="52" fill="#fbe19a" opacity="0.32" />
      <g fill="#ffffff" opacity="0.92">
        <g className="cloud">
          <ellipse cx="150" cy="56" rx="44" ry="17" />
          <ellipse cx="184" cy="60" rx="30" ry="13" />
        </g>
        <g className="cloud cloud--slow">
          <ellipse cx="470" cy="40" rx="36" ry="14" />
          <ellipse cx="440" cy="44" rx="26" ry="11" />
        </g>
      </g>

      <path
        d="M0 138 L78 96 L150 136 L232 84 L316 140 L398 100 L486 146 L574 96 L664 142 L744 104 L800 134 L800 190 L0 190 Z"
        fill="#a9c9cd"
      />
      <path
        d="M0 176 L70 142 L146 178 L228 136 L316 182 L404 146 L500 186 L592 148 L684 188 L764 152 L800 172 L800 214 L0 214 Z"
        fill="#7fb392"
      />

      <rect y="200" width="800" height="300" fill="url(#trail-grass)" />

      <g>
        <Pine x={44} y={248} s={0.62} />
        <RoundTree x={118} y={252} s={0.5} />
        <Pine x={196} y={244} s={0.5} fill="#2c6340" />
        <RoundTree x={300} y={250} s={0.44} />
        <Pine x={392} y={246} s={0.55} fill="#2c6340" />
        <RoundTree x={498} y={252} s={0.48} />
        <Pine x={596} y={244} s={0.58} />
        <RoundTree x={690} y={252} s={0.5} />
        <Pine x={764} y={246} s={0.62} fill="#2c6340" />
      </g>

      <path
        d="M-30 352 C 140 318 300 384 448 356 C 596 328 700 386 830 358"
        stroke="url(#trail-path)"
        strokeWidth="112"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-30 352 C 140 318 300 384 448 356 C 596 328 700 386 830 358"
        stroke="#c9b489"
        strokeWidth="3"
        strokeDasharray="18 26"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M-30 414 C 150 386 320 442 470 414 C 620 386 720 442 830 420"
        stroke="#e9dcbc"
        strokeWidth="46"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
      />

      <g>
        <ellipse cx="66" cy="446" rx="34" ry="13" fill="#5c9b52" />
        <ellipse cx="742" cy="452" rx="40" ry="15" fill="#5c9b52" />
        <ellipse cx="250" cy="470" rx="46" ry="14" fill="#5c9b52" />
        <ellipse cx="540" cy="466" rx="38" ry="13" fill="#5c9b52" />
        <g fill="#8d8a7a">
          <ellipse cx="196" cy="286" rx="22" ry="12" />
          <ellipse cx="210" cy="280" rx="14" ry="8" fill="#a3a091" />
          <ellipse cx="612" cy="292" rx="26" ry="13" />
          <ellipse cx="626" cy="285" rx="15" ry="8" fill="#a3a091" />
        </g>
        <g stroke="#4f8f47" strokeWidth="3" strokeLinecap="round">
          <path d="M130 430 v-14 M138 430 v-20 M146 430 v-12" />
          <path d="M470 448 v-16 M478 448 v-22 M486 448 v-14" />
          <path d="M700 424 v-14 M708 424 v-20 M716 424 v-12" />
        </g>
      </g>

      <g>
        <rect x="726" y="238" width="8" height="74" rx="4" fill="#8a6238" />
        <path d="M660 246 h78 v34 h-78 z" fill="#f3e7cd" stroke="#8a6238" strokeWidth="4" rx="6" />
        <path d="M672 264 h44" stroke="#2f7d4f" strokeWidth="5" strokeLinecap="round" />
        <path d="M716 256 l14 8 l-14 8 z" fill="#2f7d4f" />
      </g>

      <g fill="#ffffff" opacity="0.65">
        <circle cx="84" cy="318" r="5" />
        <circle cx="352" cy="300" r="4" />
        <circle cx="520" cy="286" r="5" />
        <circle cx="676" cy="322" r="4" />
      </g>
    </svg>
  );
}

/** Deep forest artwork used by the wildlife missions. */
export function ForestSceneBg({ className }: SceneProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="forest-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7eef4" />
          <stop offset="100%" stopColor="#eaf4e2" />
        </linearGradient>
        <linearGradient id="forest-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#79b264" />
          <stop offset="100%" stopColor="#4e8c4a" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="url(#forest-sky)" />
      <circle cx="132" cy="70" r="42" fill="#fbe19a" opacity="0.85" />

      <path d="M0 176 C 120 138 240 194 360 166 C 480 138 590 190 700 162 C 748 150 780 156 800 150 L800 240 L0 240 Z" fill="#9ec9a4" />
      <path d="M0 226 C 130 196 250 246 380 220 C 510 194 630 244 800 214 L800 290 L0 290 Z" fill="#6fa879" />

      <rect y="272" width="800" height="228" fill="url(#forest-floor)" />

      <g>
        <g transform="translate(52 0)">
          <rect x="-9" y="150" width="18" height="150" rx="8" fill="#7a5533" />
          <circle cx="0" cy="130" r="64" fill="#3c8a52" />
          <circle cx="-46" cy="164" r="42" fill="#357a49" />
          <circle cx="44" cy="162" r="40" fill="#438f57" />
        </g>
        <g transform="translate(748 10)">
          <rect x="-10" y="160" width="20" height="150" rx="9" fill="#7a5533" />
          <circle cx="0" cy="140" r="68" fill="#3c8a52" />
          <circle cx="46" cy="174" r="44" fill="#357a49" />
          <circle cx="-48" cy="172" r="42" fill="#438f57" />
        </g>
        <g transform="translate(210 60)">
          <rect x="-7" y="120" width="14" height="120" rx="7" fill="#8a6238" />
          <circle cx="0" cy="104" r="48" fill="#478f56" />
          <circle cx="-34" cy="130" r="32" fill="#3d7f4b" />
          <circle cx="34" cy="128" r="30" fill="#4e9b5e" />
        </g>
        <g transform="translate(586 74)">
          <rect x="-7" y="116" width="14" height="120" rx="7" fill="#8a6238" />
          <circle cx="0" cy="100" r="46" fill="#478f56" />
          <circle cx="-32" cy="126" r="30" fill="#3d7f4b" />
          <circle cx="32" cy="124" r="28" fill="#4e9b5e" />
        </g>
      </g>

      <path
        d="M-20 430 C 160 402 320 452 470 428 C 620 404 720 448 830 424"
        stroke="#e4d6b4"
        strokeWidth="62"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />

      <g>
        <ellipse cx="130" cy="470" rx="44" ry="15" fill="#3f7a41" />
        <ellipse cx="676" cy="466" rx="48" ry="16" fill="#3f7a41" />
        <ellipse cx="378" cy="474" rx="40" ry="13" fill="#3f7a41" />
        <g fill="#8d8a7a">
          <ellipse cx="300" cy="404" rx="24" ry="12" />
          <ellipse cx="536" cy="398" rx="20" ry="11" />
        </g>
        <g stroke="#3f7f43" strokeWidth="3" strokeLinecap="round">
          <path d="M78 456 v-16 M86 456 v-24 M94 456 v-14" />
          <path d="M604 462 v-16 M612 462 v-24 M620 462 v-14" />
        </g>
      </g>

      <g fill="#2b3f5c" opacity="0.75">
        <path d="M420 120 q13 -11 26 0 q-13 -5 -26 0" />
        <path d="M470 100 q11 -9 22 0 q-11 -4 -22 0" />
      </g>

      <g>
        <rect x="392" y="300" width="7" height="60" rx="4" fill="#8a6238" />
        <path d="M336 306 h66 v30 h-66 z" fill="#f3e7cd" stroke="#8a6238" strokeWidth="4" rx="6" />
        <path d="M348 322 h34" stroke="#2f7d4f" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Layered scene wrapper: art + optional overlays. */
export function Scene({
  art,
  label,
  children,
  className,
}: {
  art: ReactNode;
  label?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scene ${className ?? ""}`.trim()}>
      <div className="scene__art">{art}</div>
      {label ? <div className="scene__label">{label}</div> : null}
      {children}
    </div>
  );
}
