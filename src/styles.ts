import type React from "react";
import { escapeCssUrl } from "./utils";
import type { CaptionStyle, ControlsVariant } from "./types";
import type { ContentBox, CueSnapshot } from "./captions";

/**
 * All styles are inline CSS objects so the component is dependency-free.
 * No external CSS, Tailwind, or styled-components required.
 *
 * The one exception is `injectKeyframes()` at the bottom: hover, press, focus
 * and reduced-motion rules can't be expressed as inline styles, so they live
 * in a single stylesheet injected once per page and scoped to `data-vplayer-*`
 * attributes.
 */

/** Bar chrome sits flush against the frame edge in every variant but `floating`. */
const isInlineLayout = (v: ControlsVariant) => v !== "classic";

export function getContainerStyle(
  width: string | number
): React.CSSProperties {
  return {
    position: "relative",
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    isolation: "isolate",
  };
}

export function getAspectBoxStyle(ratio: number): React.CSSProperties {
  return {
    position: "relative",
    width: "100%",
    paddingTop: `${ratio * 100}%`,
  };
}

export function getInnerStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
  };
}

export function getVideoStyle(): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  };
}

export function getIframeStyle(): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    border: "none",
  };
}

// ---------------------------------------------------------------------------
// Poster
// ---------------------------------------------------------------------------

export function getPosterOverlayStyle(
  posterUrl: string,
  visible: boolean
): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("${escapeCssUrl(posterUrl)}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: visible ? "pointer" : "default",
    zIndex: 10,
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease",
    pointerEvents: visible ? "auto" : "none",
  };
}

/**
 * An eased vignette rather than a flat wash: the artwork stays bright through
 * the mid-ring, and the small amount of darkening that does land sits behind
 * the button and along the edges, where it buys contrast instead of costing it.
 * Two-stop gradients this large band visibly, hence the intermediate stops.
 */
export function getPosterGradientStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(125% 125% at 50% 50%," +
      "rgba(0,0,0,0.34) 0%," +
      "rgba(0,0,0,0.30) 14%," +
      "rgba(0,0,0,0.24) 28%," +
      "rgba(0,0,0,0.19) 42%," +
      "rgba(0,0,0,0.17) 55%," +
      "rgba(0,0,0,0.20) 68%," +
      "rgba(0,0,0,0.27) 82%," +
      "rgba(0,0,0,0.38) 100%)",
    pointerEvents: "none",
  };
}

/**
 * Depth comes from a stacked neutral shadow plus an inner highlight, not from
 * a coloured glow — a wash of accent behind an accent disc reads as a bloom
 * artefact rather than as elevation. Hover, press, focus and the expanding
 * ring live in the injected stylesheet so they can be gated behind
 * `(hover: hover)` and `prefers-reduced-motion`.
 */
export function getPlayButtonLargeStyle(
  accentColor: string
): React.CSSProperties {
  return {
    position: "relative",
    zIndex: 1,
    // Sized as a share of the frame rather than a fixed 72px, so it neither
    // swamps a 320px embed nor disappears in a full-bleed hero — bounded at
    // both ends so it stays a real hit target and never becomes a billboard.
    width: "7.5%",
    minWidth: "54px",
    maxWidth: "88px",
    aspectRatio: "1",
    borderRadius: "50%",
    backgroundColor: accentColor,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.22)," +
      "inset 0 0 0 1px rgba(255,255,255,0.10)," +
      "0 2px 4px rgba(0,0,0,0.22)," +
      "0 14px 34px -10px rgba(0,0,0,0.55)",
    padding: 0,
    touchAction: "manipulation",
  };
}

// ---------------------------------------------------------------------------
// Captions
// ---------------------------------------------------------------------------

/**
 * Pinned to the picture, not the element: in a letterboxed frame the cue layer
 * ends at the bottom of the image, never down in the black bar.
 */
export function getCaptionLayerStyle(box: ContentBox): React.CSSProperties {
  return {
    position: "absolute",
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    pointerEvents: "none",
    zIndex: 12,
    overflow: "hidden",
  };
}

export function getCaptionRegionStyle(
  region: CueSnapshot["region"],
  lift: number,
  fontSize: number
): React.CSSProperties {
  const edge = Math.max(10, Math.round(fontSize * 0.6));
  return {
    position: "absolute",
    left: 0,
    right: 0,
    ...(region === "top" ? { top: `${edge}px` } : { bottom: `${edge}px` }),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: `${Math.max(2, Math.round(fontSize * 0.16))}px`,
    padding: `0 ${edge}px`,
    fontSize: `${fontSize}px`,
    lineHeight: 1.34,
    // Only the bottom region moves, and only far enough to clear the bar.
    transform: region === "bottom" && lift > 0 ? `translateY(-${lift}px)` : "none",
  };
}

export function getCaptionCueStyle(
  align: CueSnapshot["align"],
  captionStyle: CaptionStyle | undefined
): React.CSSProperties {
  return {
    alignSelf:
      align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
    maxWidth: "100%",
    padding: "0.14em 0.46em",
    borderRadius: "0.22em",
    backgroundColor: captionStyle?.background ?? "rgba(8,8,10,0.72)",
    color: captionStyle?.color ?? "#fff",
    fontFamily: captionStyle?.fontFamily,
    fontSize: captionStyle?.fontSize,
    fontWeight: 500,
    textAlign: align,
    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
    whiteSpace: "pre-line",
  };
}

// ---------------------------------------------------------------------------
// Control bar
// ---------------------------------------------------------------------------

/**
 * `classic` reads over any frame because it brings its own scrim; `minimal`
 * trades most of that scrim for a drop shadow so the picture stays visible to
 * the very bottom; `floating` carries its contrast in the pill itself, so the
 * bar behind it is pure spacing.
 */
export function getControlsBarStyle(
  visible: boolean,
  variant: ControlsVariant
): React.CSSProperties {
  const scrim: Record<ControlsVariant, string> = {
    classic:
      "linear-gradient(to top," +
      "rgba(0,0,0,0.86) 0%,rgba(0,0,0,0.80) 12%,rgba(0,0,0,0.68) 26%," +
      "rgba(0,0,0,0.52) 41%,rgba(0,0,0,0.35) 56%,rgba(0,0,0,0.20) 70%," +
      "rgba(0,0,0,0.09) 83%,rgba(0,0,0,0) 100%)",
    minimal:
      "linear-gradient(to top," +
      "rgba(0,0,0,0.58) 0%,rgba(0,0,0,0.46) 22%,rgba(0,0,0,0.30) 46%," +
      "rgba(0,0,0,0.15) 70%,rgba(0,0,0,0.05) 87%,rgba(0,0,0,0) 100%)",
    floating: "none",
  };
  // Top padding is the scrim's run-up, not chrome — the caption layer
  // subtracts it again when working out how far to lift.
  const padding: Record<ControlsVariant, [string, string]> = {
    classic: ["40px", "16px"],
    minimal: ["34px", "14px"],
    floating: ["40px", "12px"],
  };
  const [padTop, padSide] = padding[variant];
  return {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: scrim[variant],
    padding: `${padTop} ${padSide} 12px`,
    paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    opacity: visible ? 1 : 0,
    // visibility removes the hidden bar from the tab order; the transition
    // delays it until the fade-out finishes (and lifts it instantly on show)
    visibility: visible ? "visible" : "hidden",
    transition: "opacity 0.3s ease, visibility 0.3s",
    pointerEvents: visible ? "auto" : "none",
    zIndex: 20,
  };
}

/**
 * The `floating` shell. Outer radius 16 with 8px of padding puts nested
 * controls at 8 — derived, not copied, so the corner gap stays even.
 */
export function getControlsShellStyle(
  variant: ControlsVariant
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: 0,
  };
  if (variant !== "floating") return base;
  return {
    ...base,
    backgroundColor: "rgba(18,18,21,0.62)",
    backdropFilter: "blur(20px) saturate(1.6)",
    WebkitBackdropFilter: "blur(20px) saturate(1.6)",
    borderRadius: "16px",
    padding: "6px 8px",
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,0.10)," +
      "0 1px 2px rgba(0,0,0,0.28)," +
      "0 12px 32px -10px rgba(0,0,0,0.65)",
  };
}

export function getProgressContainerStyle(
  variant: ControlsVariant
): React.CSSProperties {
  return {
    position: "relative",
    height: isInlineLayout(variant) ? "18px" : "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    touchAction: "none",
    width: isInlineLayout(variant) ? "auto" : "100%",
    flex: isInlineLayout(variant) ? "1 1 0%" : undefined,
    minWidth: isInlineLayout(variant) ? "48px" : undefined,
  };
}

export function getProgressTrackStyle(): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: "999px",
    overflow: "hidden",
    transition: "height 0.15s ease",
  };
}

export function getProgressBufferStyle(buffered: number): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${buffered}%`,
    backgroundColor: "rgba(255,255,255,0.34)",
    borderRadius: "999px",
  };
}

export function getProgressFillStyle(
  progress: number,
  accentColor: string
): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${progress}%`,
    backgroundColor: accentColor,
    borderRadius: "999px",
    transition: "none",
  };
}

export function getProgressThumbStyle(
  progress: number,
  accentColor: string,
  isHovering: boolean
): React.CSSProperties {
  return {
    position: "absolute",
    left: `${progress}%`,
    top: "50%",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    backgroundColor: accentColor,
    // Scaling from a fixed box keeps the thumb on the GPU and stops the 1px
    // jitter a width/height transition produces at the ends of the track.
    transform: `translate(-50%, -50%) scale(${isHovering ? 1 : 0})`,
    transition: "transform 0.15s cubic-bezier(0.32, 0.72, 0, 1)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.45)",
    zIndex: 2,
    pointerEvents: "none",
  };
}

export function getControlsRowStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  };
}

/** Single-row arrangement: the scrubber sits between the two time readouts. */
export function getInlineRowStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };
}

export function getControlGroupStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };
}

/**
 * 40×40 visual box, extended to 44 by the `::before` bleed in the stylesheet.
 * The 4px group gap is exactly consumed by two 2px bleeds, so neighbouring
 * targets meet without ever overlapping.
 */
export function getControlButtonStyle(
  variant: ControlsVariant = "classic"
): React.CSSProperties {
  return {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    minWidth: "40px",
    height: "40px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: variant === "floating" ? "8px" : "10px",
    transition: "background-color 0.15s ease-out",
    color: "#fff",
    lineHeight: 1,
    flexShrink: 0,
    touchAction: "manipulation",
  };
}

/** The play/pause toggle gets a surface of its own outside the classic bar. */
export function getPlayToggleStyle(
  variant: ControlsVariant
): React.CSSProperties {
  const base = getControlButtonStyle(variant);
  if (variant === "classic") return base;
  return {
    ...base,
    width: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.16)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
  };
}

export function getTimeDisplayStyle(
  variant: ControlsVariant
): React.CSSProperties {
  return {
    color: "rgba(255,255,255,0.9)",
    fontSize: "13px",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
    padding: isInlineLayout(variant) ? "0 2px" : "0 6px",
    flexShrink: 0,
  };
}

// ---------------------------------------------------------------------------
// Volume
// ---------------------------------------------------------------------------

export function getVolumeSliderContainerStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    position: "relative",
  };
}

export function getVolumePopupStyle(): React.CSSProperties {
  return {
    position: "absolute",
    // Touches the top of the volume button so the pointer can travel from
    // button to popup without crossing a gap that would close it
    bottom: "40px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(20,20,22,0.94)",
    borderRadius: "10px",
    padding: "12px 10px 8px",
    zIndex: 30,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,0.10)," +
      "0 8px 24px -8px rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    minWidth: "40px",
  };
}

export function getVolumeVerticalTrackStyle(): React.CSSProperties {
  return {
    width: "4px",
    height: "80px",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: "999px",
    position: "relative",
    cursor: "pointer",
    touchAction: "none",
  };
}

export function getVolumeVerticalFillStyle(
  volume: number,
  accentColor: string
): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: `${volume * 100}%`,
    backgroundColor: accentColor,
    borderRadius: "999px",
  };
}

export function getVolumeVerticalThumbStyle(
  volume: number,
  accentColor: string
): React.CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    bottom: `${volume * 100}%`,
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: accentColor,
    transform: "translate(-50%, 50%)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.45)",
    zIndex: 1,
    pointerEvents: "none",
  };
}

export function getVolumeLabelStyle(): React.CSSProperties {
  return {
    color: "rgba(255,255,255,0.85)",
    fontSize: "11px",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  };
}

// ---------------------------------------------------------------------------
// Overlays
// ---------------------------------------------------------------------------

export function getErrorOverlayStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "24px",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 15,
  };
}

export function getErrorMessageStyle(): React.CSSProperties {
  return {
    color: "rgba(255,255,255,0.85)",
    fontSize: "14px",
    textAlign: "center",
    maxWidth: "80%",
    textWrap: "balance",
  } as React.CSSProperties;
}

export function getLoadingOverlayStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
    pointerEvents: "none",
  };
}

export function getTitleOverlayStyle(): React.CSSProperties {
  return {
    position: "absolute",
    top: "16px",
    left: "16px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    textShadow: "0 1px 4px rgba(0,0,0,0.5)",
    zIndex: 5,
    maxWidth: "70%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  };
}

export function getMenuOverlayStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: "0 12px 64px 0",
    zIndex: 35,
  };
}

export function getMenuPanelStyle(): React.CSSProperties {
  return {
    backgroundColor: "rgba(20,20,22,0.94)",
    borderRadius: "12px",
    padding: "6px",
    minWidth: "132px",
    maxHeight: "60%",
    overflowY: "auto",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,0.10)," +
      "0 12px 32px -10px rgba(0,0,0,0.7)",
  };
}

export function getSpeedMenuItemStyle(
  isActive: boolean,
  accentColor: string
): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    // 12px inner radius on a 12px panel with 6px padding would pinch; 6 is the
    // derived value (12 − 6).
    borderRadius: "6px",
    padding: "8px 12px",
    background: "none",
    border: "none",
    color: isActive ? accentColor : "rgba(255,255,255,0.85)",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
    // Weight stays put across states so the row can't reflow on selection.
    fontWeight: 500,
    transition: "background-color 0.12s ease-out",
    touchAction: "manipulation",
  };
}

export function getTooltipStyle(x: number): React.CSSProperties {
  const safeX = Math.min(Math.max(x, 5), 95);
  return {
    position: "absolute",
    bottom: "24px",
    left: `${safeX}%`,
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0,0,0,0.85)",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    zIndex: 5,
  };
}

export function getShortcutsOverlayStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    zIndex: 40,
  };
}

export function getShortcutsBoxStyle(): React.CSSProperties {
  return {
    backgroundColor: "rgba(20,20,22,0.97)",
    borderRadius: "14px",
    padding: "20px 24px",
    minWidth: "280px",
    maxHeight: "100%",
    overflowY: "auto",
    boxShadow:
      "inset 0 0 0 1px rgba(255,255,255,0.10)," +
      "0 16px 40px -12px rgba(0,0,0,0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    color: "#fff",
  };
}

export function getShortcutRowStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 0",
    gap: "16px",
  };
}

export function getKbdStyle(): React.CSSProperties {
  return {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
    borderRadius: "5px",
    padding: "3px 6px",
    color: "#fff",
    whiteSpace: "nowrap",
  };
}

export function getChapterMarkerStyle(pct: number): React.CSSProperties {
  return {
    position: "absolute",
    left: `${pct}%`,
    top: 0,
    bottom: 0,
    width: "2px",
    backgroundColor: "rgba(255,255,255,0.55)",
    transform: "translateX(-50%)",
    pointerEvents: "none",
    zIndex: 3,
  };
}

export function getPreviewThumbnailStyle(
  x: number,
  thumb: { src: string; width: number; height: number; count: number },
  frameIndex: number
): React.CSSProperties {
  const safeX = Math.min(Math.max(x, 5), 95);
  return {
    position: "absolute",
    bottom: "52px",
    left: `${safeX}%`,
    transform: "translateX(-50%)",
    width: `${thumb.width}px`,
    height: `${thumb.height}px`,
    backgroundImage: `url("${escapeCssUrl(thumb.src)}")`,
    backgroundPosition: `-${frameIndex * thumb.width}px 0`,
    backgroundSize: `${thumb.width * thumb.count}px ${thumb.height}px`,
    backgroundRepeat: "no-repeat",
    borderRadius: "6px",
    outline: "1px solid rgba(255,255,255,0.18)",
    outlineOffset: "-1px",
    boxShadow: "0 8px 24px -8px rgba(0,0,0,0.8)",
    pointerEvents: "none",
    zIndex: 5,
  };
}

// ---------------------------------------------------------------------------
// Injected stylesheet — states that inline styles can't express
// ---------------------------------------------------------------------------

/** Scoped stylesheet injection — runs once */
let injected = false;
export function injectKeyframes(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes vplayer-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    [data-vplayer-root] {
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    [data-vplayer-root]:focus-visible {
      outline: 2px solid rgba(255,255,255,0.4);
      outline-offset: -2px;
    }
    [data-vplayer-root] :focus-visible {
      outline: 2px solid rgba(255,255,255,0.75);
      outline-offset: 2px;
    }
    [data-vplayer-root]:fullscreen,
    [data-vplayer-root]:-webkit-full-screen {
      width: 100% !important;
      max-width: 100% !important;
      border-radius: 0 !important;
    }
    [data-vplayer-root]:fullscreen [data-vplayer-aspect],
    [data-vplayer-root]:-webkit-full-screen [data-vplayer-aspect] {
      padding-top: 0 !important;
      height: 100%;
    }

    /* --- Poster play button ------------------------------------------- */
    [data-vplayer-poster-button] {
      transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1),
                  box-shadow 0.2s ease-out;
    }
    [data-vplayer-poster-button]::after {
      content: "";
      position: absolute;
      inset: -15%;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.28);
      opacity: 0;
      transform: scale(0.86);
      transition: opacity 0.2s ease-out,
                  transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
      pointer-events: none;
    }
    @media (hover: hover) and (pointer: fine) {
      [data-vplayer-poster-button]:hover {
        transform: scale(1.06);
      }
      [data-vplayer-poster-button]:hover::after {
        opacity: 1;
        transform: scale(1);
      }
    }
    [data-vplayer-poster-button]:active {
      transform: scale(0.96);
    }

    /* --- Control buttons ---------------------------------------------- */
    /* 40px visual box bled out to 44; the 2px per side exactly consumes the
       4px group gap, so neighbouring targets touch but never overlap. */
    [data-vplayer-btn]::before {
      content: "";
      position: absolute;
      inset: -2px;
    }
    @media (hover: hover) and (pointer: fine) {
      [data-vplayer-btn]:hover {
        background-color: rgba(255,255,255,0.14);
      }
      [data-vplayer-menu-item]:hover {
        background-color: rgba(255,255,255,0.09);
      }
    }
    [data-vplayer-btn]:active {
      transform: scale(0.96);
    }

    /* --- Captions ------------------------------------------------------ */
    [data-vplayer-caption-region] {
      transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    }
    [data-vplayer-cue] {
      text-wrap: balance;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }

    /* The loading spinner is deliberately exempt: it reports that work is in
       flight, and a frozen one reads as a hung player. Everything the user
       merely looks at stops moving. */
    @media (prefers-reduced-motion: reduce) {
      [data-vplayer-root] *,
      [data-vplayer-root] *::before,
      [data-vplayer-root] *::after {
        transition-duration: 0.01ms !important;
      }
      [data-vplayer-poster-button]:hover,
      [data-vplayer-poster-button]:active,
      [data-vplayer-poster-button]:hover::after,
      [data-vplayer-btn]:active {
        transform: none;
      }
    }
  `;
  document.head.appendChild(style);
}
