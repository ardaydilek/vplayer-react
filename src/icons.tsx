import React from "react";

/**
 * One icon system, one grid.
 *
 * Every glyph is drawn in a 24×24 viewBox and optically centred on (12, 12),
 * inside a 4→20 safe area. Outlines are all stroked at `STROKE` with round
 * caps and joins; the transport controls (play, pause, prev, next) are the
 * only filled shapes, which is the convention and reads better at 20px.
 *
 * Getting this wrong is visible even when nobody can say why: the previous set
 * mixed 1.5/2/3 stroke weights, drew the picture-in-picture glyph two units
 * above centre and the speaker one and a half units left of it, and rendered
 * at 18px next to 20px neighbours — so a row of buttons whose boxes were
 * perfectly aligned still read as ragged.
 */

const STROKE = 1.8;

interface IconProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

function Svg({
  size = 20,
  style,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Shared props for every stroked glyph, so no icon can drift off the system. */
function strokeProps(color: string) {
  return {
    stroke: color,
    strokeWidth: STROKE,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

/**
 * The triangle is drawn small and stroked in its own colour to round the
 * corners, then sits ~1 unit right of the grid centre: a right-pointing
 * triangle's mass is toward its base, so a mathematically centred one reads
 * as left of centre.
 */
export function PlayIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path
        d="M9.1 6.5 17.3 12 9.1 17.5Z"
        fill={color}
        stroke={color}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PauseIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <rect x="7.6" y="5" width="3.2" height="14" rx="1.3" fill={color} />
      <rect x="13.2" y="5" width="3.2" height="14" rx="1.3" fill={color} />
    </Svg>
  );
}

/** Prev and Next are exact mirrors about x = 12, so they read as a pair. */
export function PrevIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path
        d="M17.8 7 10.4 12l7.4 5Z"
        fill={color}
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <rect x="5.2" y="5.8" width="2.4" height="12.4" rx="1.2" fill={color} />
    </Svg>
  );
}

export function NextIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path
        d="M6.2 7 13.6 12l-7.4 5Z"
        fill={color}
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <rect x="16.4" y="5.8" width="2.4" height="12.4" rx="1.2" fill={color} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Volume — the cone stays put across all three states so the glyph never
// jumps as the level changes; only the waves swap.
// ---------------------------------------------------------------------------

const SPEAKER =
  "M12.1 6.2a.85.85 0 0 0-1.4-.65L7.6 8.4H4.9a1.4 1.4 0 0 0-1.4 1.4v4.4a1.4 1.4 0 0 0 1.4 1.4h2.7l3.1 2.85a.85.85 0 0 0 1.4-.65V6.2Z";

export function VolumeHighIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path d={SPEAKER} fill={color} />
      <path d="M15.3 9.2a4 4 0 0 1 0 5.6" {...strokeProps(color)} />
      <path d="M18 6.5a7.8 7.8 0 0 1 0 11" {...strokeProps(color)} />
    </Svg>
  );
}

export function VolumeLowIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path d={SPEAKER} fill={color} />
      <path d="M15.3 9.2a4 4 0 0 1 0 5.6" {...strokeProps(color)} />
    </Svg>
  );
}

export function VolumeMuteIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path d={SPEAKER} fill={color} />
      <path d="m15.8 9.6 4.7 4.8m0-4.8-4.7 4.8" {...strokeProps(color)} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Bar controls
// ---------------------------------------------------------------------------

/** CC and PiP share one screen rectangle so the pair reads as a set. */
const SCREEN = { x: 3, y: 5.6, width: 18, height: 12.8, rx: 3.2 } as const;

/**
 * Two open "C"s rather than stacked text lines: bars inside a rounded
 * rectangle are the icon for a message bubble, and read as one here too.
 */
export function CCIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <rect {...SCREEN} {...strokeProps(color)} />
      <path d="M10.8 10.5a2.3 2.3 0 1 0 0 3" {...strokeProps(color)} />
      <path d="M17.2 10.5a2.3 2.3 0 1 0 0 3" {...strokeProps(color)} />
    </Svg>
  );
}

export function PipIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <rect {...SCREEN} {...strokeProps(color)} />
      {/* Inset equally from the frame's inner edge, and small enough to read
          as an inset window rather than a filled screen */}
      <rect x="12.6" y="11.2" width="6" height="4.8" rx="1.3" fill={color} />
    </Svg>
  );
}

export function FullscreenIcon({ size = 20, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path d="M9 4H6.5A2.5 2.5 0 0 0 4 6.5V9" {...strokeProps(color)} />
      <path d="M15 4h2.5A2.5 2.5 0 0 1 20 6.5V9" {...strokeProps(color)} />
      <path d="M20 15v2.5a2.5 2.5 0 0 1-2.5 2.5H15" {...strokeProps(color)} />
      <path d="M4 15v2.5A2.5 2.5 0 0 0 6.5 20H9" {...strokeProps(color)} />
    </Svg>
  );
}

export function ExitFullscreenIcon({
  size = 20,
  color = "#fff",
  style,
}: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path d="M4 9h2.5A2.5 2.5 0 0 0 9 6.5V4" {...strokeProps(color)} />
      <path d="M20 9h-2.5A2.5 2.5 0 0 1 15 6.5V4" {...strokeProps(color)} />
      <path d="M15 20v-2.5a2.5 2.5 0 0 1 2.5-2.5H20" {...strokeProps(color)} />
      <path d="M9 20v-2.5A2.5 2.5 0 0 0 6.5 15H4" {...strokeProps(color)} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export function ErrorIcon({ size = 32, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <circle cx="12" cy="12" r="8.2" {...strokeProps(color)} />
      <path d="M12 8.1v4.6" {...strokeProps(color)} />
      <circle cx="12" cy="16.1" r="1.05" fill={color} />
    </Svg>
  );
}

export function RetryIcon({ size = 16, color = "#fff", style }: IconProps) {
  return (
    <Svg size={size} style={style}>
      <path
        d="M19.9 12a7.9 7.9 0 1 1-2.3-5.6"
        {...strokeProps(color)}
      />
      <path d="M19.9 4.6v4.6h-4.6" {...strokeProps(color)} />
    </Svg>
  );
}

export function SpinnerIcon({ size = 36, color = "#fff", style }: IconProps) {
  return (
    <Svg
      size={size}
      style={{ animation: "vplayer-spin 0.9s linear infinite", ...style }}
    >
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2.2" opacity="0.22" />
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        // Circumference is 53.4; a 16-unit dash draws a 30% arc.
        strokeDasharray="16 37.4"
      />
    </Svg>
  );
}
