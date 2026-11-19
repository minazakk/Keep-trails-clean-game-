interface ArtProps {
  size?: number;
  className?: string;
}

/** Flat illustration of a piece of trail litter. */
export function LitterArt({
  kind,
  size = 48,
  className,
}: ArtProps & { kind: "bottle" | "can" | "wrapper" | "packet" | "paper" | "cup" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {kind === "bottle" && (
        <g>
          <rect x="27" y="4" width="10" height="7" rx="2" fill="#3f7fbf" />
          <path
            d="M25 11h14v5l5 8v26a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V24l5-8z"
            fill="#d5eefb"
            stroke="#3f7fbf"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="20" y="30" width="24" height="10" rx="2" fill="#3f7fbf" opacity="0.75" />
          <path d="M27 16v34" stroke="#ffffff" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
        </g>
      )}

      {kind === "can" && (
        <g>
          <rect x="20" y="12" width="24" height="40" rx="6" fill="#c9ccd3" stroke="#8a8f99" strokeWidth="2.5" />
          <ellipse cx="32" cy="14" rx="12" ry="5" fill="#e4e7ec" stroke="#8a8f99" strokeWidth="2.5" />
          <rect x="20" y="26" width="24" height="12" fill="#e8873a" />
          <path d="M28 11h8" stroke="#8a8f99" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M23 46h18" stroke="#ffffff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
        </g>
      )}

      {kind === "wrapper" && (
        <g>
          <path
            d="M8 24l8-6 8 4h16l8-4 8 6-8 6v4l8 6-8 6-8-4H24l-8 4-8-6 8-6v-4z"
            fill="#f4d35e"
            stroke="#c9a227"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M26 26h12M26 34h12" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {kind === "packet" && (
        <g>
          <path
            d="M16 14h32a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z"
            fill="#e8873a"
            stroke="#b3641f"
            strokeWidth="2.5"
          />
          <path d="M12 22h40" stroke="#b3641f" strokeWidth="2.5" />
          <path d="M24 10l4 6M36 10l-4 6" stroke="#b3641f" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="22" y="30" width="20" height="12" rx="3" fill="#fdf0dd" />
          <path d="M26 36h12" stroke="#b3641f" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {kind === "paper" && (
        <g>
          <path
            d="M14 34c-4-8 2-18 10-20 6-8 20-8 24 0 8 2 12 12 8 19-2 8-12 13-20 12-9 1-19-3-22-11z"
            fill="#f6f2e7"
            stroke="#b9b2a1"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M24 28c4 2 6 6 6 10M34 24c5 3 7 8 6 13" stroke="#b9b2a1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {kind === "cup" && (
        <g>
          <path d="M18 20h28l-4 32a5 5 0 0 1-5 4H27a5 5 0 0 1-5-4z" fill="#f6f2e7" stroke="#a9a394" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="15" y="14" width="34" height="8" rx="4" fill="#e8873a" stroke="#b3641f" strokeWidth="2.5" />
          <path d="M22 34h20" stroke="#a9a394" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export type WasteArtKind =
  | "bottle"
  | "can"
  | "newspaper"
  | "banana"
  | "tissue"
  | "box"
  | "leftovers"
  | "chipbag";

/** Flat illustration of a sortable waste item. */
export function WasteArt({ kind, size = 56, className }: ArtProps & { kind: WasteArtKind }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {kind === "bottle" && (
        <g>
          <rect x="27" y="4" width="10" height="7" rx="2" fill="#3f7fbf" />
          <path
            d="M25 11h14v5l5 8v26a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V24l5-8z"
            fill="#d5eefb"
            stroke="#3f7fbf"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x="20" y="30" width="24" height="10" rx="2" fill="#3f7fbf" opacity="0.75" />
        </g>
      )}

      {kind === "can" && (
        <g>
          <rect x="20" y="12" width="24" height="40" rx="6" fill="#c9ccd3" stroke="#8a8f99" strokeWidth="2.5" />
          <ellipse cx="32" cy="14" rx="12" ry="5" fill="#e4e7ec" stroke="#8a8f99" strokeWidth="2.5" />
          <rect x="20" y="26" width="24" height="12" fill="#3f7fbf" />
        </g>
      )}

      {kind === "newspaper" && (
        <g>
          <rect x="10" y="16" width="44" height="34" rx="4" fill="#f6f2e7" stroke="#b9b2a1" strokeWidth="2.5" />
          <rect x="16" y="22" width="14" height="10" rx="2" fill="#cfe0ea" />
          <path d="M36 24h12M36 30h12M16 38h32M16 44h24" stroke="#b9b2a1" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {kind === "banana" && (
        <g>
          <path
            d="M14 20c2 18 16 30 34 30 4 0 6-3 4-6-14 0-26-9-30-24-1-4-6-4-8 0z"
            fill="#f4d35e"
            stroke="#c9a227"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M14 20l-4-4M48 50l5 3" stroke="#8a6a1d" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {kind === "tissue" && (
        <g>
          <path
            d="M16 36c-4-7 1-16 8-18 5-7 17-7 21 0 7 2 11 11 7 17-2 7-11 11-18 10-8 1-16-3-18-9z"
            fill="#ffffff"
            stroke="#c3bfb4"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M26 30c3 2 5 5 5 9M35 27c4 3 6 7 5 11" stroke="#c3bfb4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {kind === "box" && (
        <g>
          <path d="M12 26l20-8 20 8-20 8z" fill="#d6a574" stroke="#9c7042" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M12 26v18l20 8V34z" fill="#c08f5b" stroke="#9c7042" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M52 26v18l-20 8V34z" fill="#d6a574" stroke="#9c7042" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M32 18v16" stroke="#9c7042" strokeWidth="2.5" />
        </g>
      )}

      {kind === "leftovers" && (
        <g>
          <ellipse cx="32" cy="42" rx="24" ry="10" fill="#e9ecf0" stroke="#a9aeb7" strokeWidth="2.5" />
          <path d="M8 42c0-6 11-10 24-10s24 4 24 10" fill="#f4f6f8" stroke="#a9aeb7" strokeWidth="2.5" />
          <path d="M18 36c4-6 10-8 14-6M34 32c5 0 9 3 11 7" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="34" r="4" fill="#e8873a" />
        </g>
      )}

      {kind === "chipbag" && (
        <g>
          <path
            d="M18 14h28l4 10-4 6 4 6-4 14H18l-4-14 4-6-4-6z"
            fill="#d9dee6"
            stroke="#8f97a3"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M14 24h36M14 36h36" stroke="#8f97a3" strokeWidth="2.5" />
          <rect x="24" y="30" width="16" height="14" rx="3" fill="#e8873a" />
        </g>
      )}
    </svg>
  );
}

/** Waste bin illustration used by the sorting mission and quiz. */
export function BinArt({ color = "#1f7a8c", size = 56 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect x="12" y="18" width="40" height="8" rx="4" fill={color} />
      <rect x="26" y="12" width="12" height="8" rx="3" fill={color} />
      <path d="M16 26h32l-3 28a5 5 0 0 1-5 4H24a5 5 0 0 1-5-4z" fill="#ffffff" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      <path d="M27 34v16M37 34v16" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}
