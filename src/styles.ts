import type React from "react";

/**
 * All styles are inline CSS objects so the component is dependency-free.
 * No external CSS, Tailwind, or styled-components required.
 */

export function getContainerStyle(
  width: string | number,
  isFocused: boolean
): React.CSSProperties {
  return {
    position: "relative",
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
    backgroundColor: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    outline: isFocused ? "2px solid rgba(255,255,255,0.2)" : "none",
    outlineOffset: "2px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
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
    objectFit: "cover",
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

export function getPosterOverlayStyle(posterUrl: string): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${posterUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
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
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
    position: "relative",
    cursor: "pointer",
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
    right: "8px",
    backgroundColor: "rgba(20,20,20,0.95)",
    borderRadius: "8px",
    padding: "4px 0",
    minWidth: "100px",
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
  return {
    position: "absolute",
    bottom: "24px",
    left: `${x}%`,
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

/** Keyframe injection for spinner animation - runs once */
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
  `;
  document.head.appendChild(style);
}
