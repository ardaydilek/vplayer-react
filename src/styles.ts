import type React from "react";

/**
 * All styles are inline CSS objects so the component is dependency-free.
 * No external CSS, Tailwind, or styled-components required.
 */

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

export function getPosterOverlayStyle(
  posterUrl: string,
  visible: boolean
): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${posterUrl})`,
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

export function getPosterGradientStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
  };
}

export function getPlayButtonLargeStyle(
  accentColor: string
): React.CSSProperties {
  return {
    position: "relative",
    zIndex: 1,
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: accentColor,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: `0 4px 24px ${accentColor}66`,
    padding: 0,
  };
}

export function getControlsBarStyle(visible: boolean): React.CSSProperties {
  return {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background:
      "linear-gradient(transparent, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.85))",
    padding: "32px 16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease",
    pointerEvents: visible ? "auto" : "none",
    zIndex: 20,
  };
}

export function getProgressContainerStyle(): React.CSSProperties {
  return {
    position: "relative",
    width: "100%",
    height: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  };
}

export function getProgressTrackStyle(): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
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
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: "2px",
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
    borderRadius: "2px",
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
    width: isHovering ? "14px" : "0px",
    height: isHovering ? "14px" : "0px",
    borderRadius: "50%",
    backgroundColor: accentColor,
    transform: "translate(-50%, -50%)",
    transition: "width 0.15s ease, height 0.15s ease",
    boxShadow: `0 0 6px ${accentColor}88`,
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

export function getControlGroupStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };
}

export function getControlButtonStyle(): React.CSSProperties {
  return {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "background-color 0.15s ease",
    color: "#fff",
    lineHeight: 1,
  };
}

export function getTimeDisplayStyle(): React.CSSProperties {
  return {
    color: "rgba(255,255,255,0.85)",
    fontSize: "13px",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    letterSpacing: "0.02em",
    padding: "0 4px",
  };
}

export function getVolumeSliderContainerStyle(): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    position: "relative",
  };
}

export function getVolumeSliderTrackStyle(): React.CSSProperties {
  return {
    width: "60px",
    height: "20px",
    backgroundColor: "transparent",
    borderRadius: "2px",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  };
}

export function getVolumeSliderTrackBarStyle(): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
  };
}

export function getVolumeSliderFillStyle(
  volume: number,
  accentColor: string
): React.CSSProperties {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${volume * 100}%`,
    backgroundColor: accentColor,
    borderRadius: "2px",
  };
}

export function getVolumeSliderThumbStyle(
  volume: number,
  accentColor: string
): React.CSSProperties {
  return {
    position: "absolute",
    left: `${volume * 100}%`,
    top: "50%",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: accentColor,
    transform: "translate(-50%, -50%)",
    boxShadow: `0 0 4px ${accentColor}66`,
    zIndex: 1,
    pointerEvents: "none",
  };
}

export function getErrorOverlayStyle(): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
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
  };
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
  };
}

export function getSpeedMenuStyle(): React.CSSProperties {
  return {
    position: "absolute",
    bottom: "48px",
    right: 0,
    backgroundColor: "rgba(20,20,20,0.95)",
    borderRadius: "8px",
    padding: "4px 0",
    minWidth: "100px",
    maxHeight: "240px",
    overflowY: "auto",
    zIndex: 30,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
  };
}

export function getSpeedMenuItemStyle(
  isActive: boolean,
  accentColor: string
): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    padding: "6px 16px",
    background: "none",
    border: "none",
    color: isActive ? accentColor : "rgba(255,255,255,0.85)",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "left",
    fontWeight: isActive ? 600 : 400,
    transition: "background-color 0.1s ease",
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
    padding: "3px 8px",
    borderRadius: "4px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    zIndex: 5,
  };
}

export function getCCMenuStyle(): React.CSSProperties {
  return {
    position: "absolute",
    bottom: "48px",
    right: "0",
    backgroundColor: "rgba(20,20,20,0.95)",
    borderRadius: "8px",
    padding: "4px 0",
    minWidth: "120px",
    zIndex: 30,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
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
    zIndex: 40,
  };
}

export function getShortcutsBoxStyle(): React.CSSProperties {
  return {
    backgroundColor: "rgba(20,20,20,0.97)",
    borderRadius: "12px",
    padding: "20px 24px",
    minWidth: "280px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
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
    fontFamily: "monospace",
    fontSize: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    padding: "2px 6px",
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
    backgroundColor: "rgba(255,255,255,0.5)",
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
    backgroundImage: `url(${thumb.src})`,
    backgroundPosition: `-${frameIndex * thumb.width}px 0`,
    backgroundSize: `${thumb.width * thumb.count}px ${thumb.height}px`,
    backgroundRepeat: "no-repeat",
    borderRadius: "4px",
    border: "2px solid rgba(255,255,255,0.3)",
    pointerEvents: "none",
    zIndex: 5,
  };
}

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
    }
    [data-vplayer-root]:focus-visible {
      outline: 2px solid rgba(255,255,255,0.2);
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
      height: 100vh;
    }
    [data-vplayer-root]:fullscreen [data-vplayer-inner],
    [data-vplayer-root]:-webkit-full-screen [data-vplayer-inner] {
      position: static;
    }
    @media (pointer: coarse) {
      [data-vplayer-volume-slider] {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}
