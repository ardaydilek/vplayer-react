// src/VPlayer.tsx
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef
} from "react";

// src/utils.ts
function parseVideoSource(src) {
  const ytMatch = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    };
  }
  const vimeoMatch = src.match(
    /(?:vimeo\.com\/)(\d+)/
  );
  if (vimeoMatch) {
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0&title=0`
    };
  }
  const biliMatch = src.match(
    /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/
  );
  if (biliMatch) {
    return {
      type: "bilibili",
      videoId: biliMatch[1],
      embedUrl: `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&high_quality=1&danmaku=0`
    };
  }
  const biliAidMatch = src.match(
    /bilibili\.com\/video\/av(\d+)/
  );
  if (biliAidMatch) {
    return {
      type: "bilibili",
      videoId: biliAidMatch[1],
      embedUrl: `https://player.bilibili.com/player.html?aid=${biliAidMatch[1]}&high_quality=1&danmaku=0`
    };
  }
  return {
    type: "native",
    videoId: "",
    embedUrl: src
  };
}
function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  const sStr = s.toString().padStart(2, "0");
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${sStr}`;
  }
  return `${m}:${sStr}`;
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function parseAspectRatio(ratio) {
  const parts = ratio.split(":");
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (w > 0 && h > 0) return h / w;
  }
  return 9 / 16;
}

// src/icons.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function PlayIcon({ size = 24, color = "#fff", style }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M6.5 4.226a.75.75 0 0 1 1.146-.638l11.2 7.274a.75.75 0 0 1 0 1.276l-11.2 7.274A.75.75 0 0 1 6.5 18.774V4.226Z",
          fill: color
        }
      )
    }
  );
}
function PauseIcon({ size = 24, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", fill: color }),
        /* @__PURE__ */ jsx("rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", fill: color })
      ]
    }
  );
}
function VolumeHighIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M11 5L6 9H2v6h4l5 4V5Z",
            fill: color
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function VolumeLowIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M11 5L6 9H2v6h4l5 4V5Z",
            fill: color
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15.54 8.46a5 5 0 0 1 0 7.07",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function VolumeMuteIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M11 5L6 9H2v6h4l5 4V5Z",
            fill: color
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M23 9l-6 6M17 9l6 6",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function FullscreenIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3",
          stroke: color,
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function ExitFullscreenIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3",
          stroke: color,
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  );
}
function SettingsIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function PipIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ jsx("rect", { x: "11", y: "9", width: "9", height: "6", rx: "1", fill: color })
      ]
    }
  );
}
function SpinnerIcon({ size = 40, color = "#fff", style }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { animation: "vplayer-spin 1s linear infinite", ...style },
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          stroke: color,
          strokeWidth: "3",
          strokeDasharray: "31.4 31.4",
          strokeLinecap: "round",
          opacity: "0.7"
        }
      )
    }
  );
}
function CCIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style, children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", stroke: color, strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M7 12.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2", stroke: color, strokeWidth: "1.5", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M13 12.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2", stroke: color, strokeWidth: "1.5", strokeLinecap: "round" })
  ] });
}
function ErrorIcon({ size = 40, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", stroke: "#ef4444", strokeWidth: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M12 8v4", stroke: "#ef4444", strokeWidth: "2", strokeLinecap: "round" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "16", r: "1", fill: "#ef4444" })
      ]
    }
  );
}
function PrevIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style, children: [
    /* @__PURE__ */ jsx("path", { d: "M19 5L9 12l10 7V5Z", fill: color }),
    /* @__PURE__ */ jsx("rect", { x: "5", y: "5", width: "2", height: "14", rx: "1", fill: color })
  ] });
}
function NextIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", style, children: [
    /* @__PURE__ */ jsx("path", { d: "M5 5l10 7-10 7V5Z", fill: color }),
    /* @__PURE__ */ jsx("rect", { x: "17", y: "5", width: "2", height: "14", rx: "1", fill: color })
  ] });
}

// src/styles.ts
function getContainerStyle(width) {
  return {
    position: "relative",
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    isolation: "isolate"
  };
}
function getAspectBoxStyle(ratio) {
  return {
    position: "relative",
    width: "100%",
    paddingTop: `${ratio * 100}%`
  };
}
function getInnerStyle() {
  return {
    position: "absolute",
    inset: 0
  };
}
function getVideoStyle() {
  return {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block"
  };
}
function getIframeStyle() {
  return {
    width: "100%",
    height: "100%",
    border: "none"
  };
}
function getPosterOverlayStyle(posterUrl, visible) {
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
    pointerEvents: visible ? "auto" : "none"
  };
}
function getPosterGradientStyle() {
  return {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)"
  };
}
function getPlayButtonLargeStyle(accentColor) {
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
    padding: 0
  };
}
function getControlsBarStyle(visible) {
  return {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.85))",
    padding: "32px 16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    opacity: visible ? 1 : 0,
    transition: "opacity 0.3s ease",
    pointerEvents: visible ? "auto" : "none",
    zIndex: 20
  };
}
function getProgressContainerStyle() {
  return {
    position: "relative",
    width: "100%",
    height: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  };
}
function getProgressTrackStyle() {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
    overflow: "hidden",
    transition: "height 0.15s ease"
  };
}
function getProgressBufferStyle(buffered) {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${buffered}%`,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: "2px"
  };
}
function getProgressFillStyle(progress, accentColor) {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${progress}%`,
    backgroundColor: accentColor,
    borderRadius: "2px",
    transition: "none"
  };
}
function getProgressThumbStyle(progress, accentColor, isHovering) {
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
    pointerEvents: "none"
  };
}
function getControlsRowStyle() {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px"
  };
}
function getControlGroupStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  };
}
function getControlButtonStyle() {
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
    lineHeight: 1
  };
}
function getTimeDisplayStyle() {
  return {
    color: "rgba(255,255,255,0.85)",
    fontSize: "13px",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    letterSpacing: "0.02em",
    padding: "0 4px"
  };
}
function getVolumeSliderContainerStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    position: "relative"
  };
}
function getVolumeSliderTrackStyle() {
  return {
    width: "60px",
    height: "20px",
    backgroundColor: "transparent",
    borderRadius: "2px",
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  };
}
function getVolumeSliderTrackBarStyle() {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px"
  };
}
function getVolumeSliderFillStyle(volume, accentColor) {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${volume * 100}%`,
    backgroundColor: accentColor,
    borderRadius: "2px"
  };
}
function getVolumeSliderThumbStyle(volume, accentColor) {
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
    pointerEvents: "none"
  };
}
function getErrorOverlayStyle() {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 15
  };
}
function getErrorMessageStyle() {
  return {
    color: "rgba(255,255,255,0.85)",
    fontSize: "14px",
    textAlign: "center",
    maxWidth: "80%"
  };
}
function getLoadingOverlayStyle() {
  return {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 15,
    pointerEvents: "none"
  };
}
function getTitleOverlayStyle() {
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
    whiteSpace: "nowrap"
  };
}
function getSpeedMenuStyle() {
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
    border: "1px solid rgba(255,255,255,0.1)"
  };
}
function getSpeedMenuItemStyle(isActive, accentColor) {
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
    transition: "background-color 0.1s ease"
  };
}
function getTooltipStyle(x) {
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
    zIndex: 5
  };
}
function getCCMenuStyle() {
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
    border: "1px solid rgba(255,255,255,0.1)"
  };
}
function getShortcutsOverlayStyle() {
  return {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40
  };
}
function getShortcutsBoxStyle() {
  return {
    backgroundColor: "rgba(20,20,20,0.97)",
    borderRadius: "12px",
    padding: "20px 24px",
    minWidth: "280px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#fff"
  };
}
function getShortcutRowStyle() {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 0",
    gap: "16px"
  };
}
function getKbdStyle() {
  return {
    fontFamily: "monospace",
    fontSize: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    padding: "2px 6px",
    color: "#fff",
    whiteSpace: "nowrap"
  };
}
function getChapterMarkerStyle(pct) {
  return {
    position: "absolute",
    left: `${pct}%`,
    top: 0,
    bottom: 0,
    width: "2px",
    backgroundColor: "rgba(255,255,255,0.5)",
    transform: "translateX(-50%)",
    pointerEvents: "none",
    zIndex: 3
  };
}
function getPreviewThumbnailStyle(x, thumb, frameIndex) {
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
    zIndex: 5
  };
}
var injected = false;
function injectKeyframes() {
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

// src/VPlayer.tsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%23111' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='central' textAnchor='middle' fontFamily='system-ui' fontSize='48' fill='%23333'%3EVideo%3C/text%3E%3C/svg%3E";
var PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
var HIDE_CONTROLS_DELAY = 3e3;
var VOLUME_STORAGE_KEY = "vplayer-volume";
var SHORTCUTS = [
  ["Space / K", "Play / Pause"],
  ["\u2190 / \u2192", "Seek \xB15s"],
  ["Shift+\u2190 / \u2192", "Prev / Next chapter"],
  ["\u2191 / \u2193", "Volume \xB110%"],
  ["F", "Fullscreen"],
  ["M", "Mute"],
  ["0\u20139", "Seek to 0%\u201390%"],
  ["< / >", "Speed down / up"],
  ["?", "Toggle shortcuts"]
];
var DEFAULT_KEYMAP = {
  play: [" ", "k"],
  mute: "m",
  fullscreen: "f",
  seekBack: "ArrowLeft",
  seekForward: "ArrowRight",
  volumeUp: "ArrowUp",
  volumeDown: "ArrowDown",
  speedDown: "<",
  speedUp: ">",
  shortcuts: "?"
};
function matchesKey(key, binding) {
  if (!binding) return false;
  return Array.isArray(binding) ? binding.includes(key) : binding === key;
}
var VPlayer = forwardRef(function VPlayer2({
  src,
  poster,
  width = "100%",
  aspectRatio = "16:9",
  accentColor = "#e11d48",
  iconColor = "#ffffff",
  initialTime,
  autoPlay = false,
  loop = false,
  loopPlaylist = false,
  muted = false,
  title,
  className,
  style,
  onPlay,
  onPause,
  onEnded,
  onError,
  onSeek,
  onTimeUpdate,
  preload = "metadata",
  ariaLabel,
  tracks,
  onBuffer,
  chapters,
  previewThumbnails,
  onMilestone,
  onNext,
  onPrev,
  activeIndex,
  onIndexChange,
  persistVolume = false,
  onChapterChange,
  onVolumeChange,
  keymap
}, ref) {
  const srcList = Array.isArray(src) ? src : [src];
  const isPlaylist = srcList.length > 1;
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = activeIndex !== void 0;
  const currentIndex = isControlled ? activeIndex : internalIndex;
  const setCurrentIndex = useCallback(
    (updater) => {
      const nextIndex = typeof updater === "function" ? updater(currentIndex) : updater;
      if (isControlled) {
        onIndexChange?.(nextIndex);
      } else {
        setInternalIndex(nextIndex);
        onIndexChange?.(nextIndex);
      }
    },
    [isControlled, currentIndex, onIndexChange]
  );
  const activeSrc = srcList[currentIndex] ?? srcList[0];
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const hideTimerRef = useRef(null);
  const isPlayingRef = useRef(false);
  const hasStartedRef = useRef(false);
  const milestonesFiredRef = useRef(/* @__PURE__ */ new Set());
  const playlistAdvancingRef = useRef(false);
  const initialTimeAppliedRef = useRef(false);
  const currentChapterRef = useRef(null);
  const parsed = parseVideoSource(activeSrc);
  const ratio = parseAspectRatio(aspectRatio);
  const isNative = parsed.type === "native";
  const resolvedKeymap = useMemo(
    () => ({ ...DEFAULT_KEYMAP, ...keymap }),
    [keymap]
  );
  const [state, setState] = useState(() => {
    let volume = muted ? 0 : 1;
    let isMuted = muted;
    if (persistVolume && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (stored !== null) {
          const vol = parseFloat(stored);
          if (isFinite(vol) && vol >= 0 && vol <= 1) {
            volume = vol;
            isMuted = vol === 0;
          }
        }
      } catch {
      }
    }
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume,
      isMuted,
      isFullscreen: false,
      buffered: 0,
      isLoading: false,
      hasStarted: false,
      showControls: true,
      isFocused: false,
      playbackRate: 1,
      error: null
    };
  });
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showCCMenu, setShowCCMenu] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [embedStarted, setEmbedStarted] = useState(false);
  const [supportsPip, setSupportsPip] = useState(false);
  const [activeTrack, setActiveTrack] = useState(null);
  useEffect(() => {
    injectKeyframes();
    setSupportsPip("pictureInPictureEnabled" in document);
  }, []);
  useEffect(() => {
    if (!persistVolume) return;
    try {
      localStorage.setItem(
        VOLUME_STORAGE_KEY,
        String(state.isMuted ? 0 : state.volume)
      );
    } catch {
    }
  }, [persistVolume, state.volume, state.isMuted]);
  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);
  useEffect(() => {
    hasStartedRef.current = state.hasStarted;
  }, [state.hasStarted]);
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setState((s) => ({ ...s, showControls: true }));
    if (isPlayingRef.current && hasStartedRef.current) {
      hideTimerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, showControls: false }));
        setShowSpeedMenu(false);
        setShowVolumeSlider(false);
      }, HIDE_CONTROLS_DELAY);
    }
  }, []);
  useEffect(() => {
    const handleFSChange = () => {
      setState((s) => ({
        ...s,
        isFullscreen: !!(document.fullscreenElement || document.webkitFullscreenElement)
      }));
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener("webkitfullscreenchange", handleFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener("webkitfullscreenchange", handleFSChange);
    };
  }, []);
  useEffect(() => {
    setState((s) => ({
      ...s,
      currentTime: 0,
      duration: 0,
      hasStarted: false,
      isPlaying: false,
      buffered: 0,
      isLoading: false,
      error: null
    }));
    milestonesFiredRef.current = /* @__PURE__ */ new Set();
    setEmbedStarted(false);
    if (playlistAdvancingRef.current) {
      playlistAdvancingRef.current = false;
      const v = videoRef.current;
      if (v) {
        setState((s) => ({ ...s, hasStarted: true, isLoading: true }));
        const attemptPlay = () => {
          v.play().then(
            () => setState((s) => ({ ...s, isPlaying: true, isLoading: false }))
          ).catch(() => setState((s) => ({ ...s, isPlaying: false })));
        };
        v.addEventListener("canplay", attemptPlay, { once: true });
        return () => {
          v.removeEventListener("canplay", attemptPlay);
        };
      }
    }
  }, [activeSrc]);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !tracks?.length) return;
    Array.from(v.textTracks).forEach((track, i) => {
      track.mode = i === activeTrack ? "showing" : "hidden";
    });
  }, [activeTrack, tracks]);
  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (initialTime && initialTime > 0 && !initialTimeAppliedRef.current && initialTime < v.duration) {
      v.currentTime = initialTime;
      initialTimeAppliedRef.current = true;
    }
    setState((s) => ({
      ...s,
      duration: v.duration,
      currentTime: v.currentTime,
      isLoading: false
    }));
  }, [initialTime]);
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      currentTime: v.currentTime
    }));
    onTimeUpdate?.(v.currentTime, v.duration);
    if (onMilestone && v.duration > 0) {
      const pct = v.currentTime / v.duration * 100;
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !milestonesFiredRef.current.has(milestone)) {
          milestonesFiredRef.current.add(milestone);
          onMilestone(milestone);
        }
      }
    }
    if (onChapterChange && chapters && chapters.length > 0 && v.duration > 0) {
      let current = null;
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (v.currentTime >= chapters[i].time) {
          current = chapters[i];
          break;
        }
      }
      const currentLabel = current?.label ?? null;
      if (currentLabel !== currentChapterRef.current) {
        currentChapterRef.current = currentLabel;
        onChapterChange(current);
      }
    }
  }, [onTimeUpdate, onMilestone, onChapterChange, chapters]);
  const handleProgress = useCallback(() => {
    const v = videoRef.current;
    if (!v || v.buffered.length === 0) return;
    const end = v.buffered.end(v.buffered.length - 1);
    const pct = v.duration ? end / v.duration * 100 : 0;
    setState((s) => ({ ...s, buffered: pct }));
    onBuffer?.(pct);
  }, [onBuffer]);
  const handleWaiting = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true }));
  }, []);
  const handleDurationChange = useCallback(() => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    setState((s) => ({ ...s, duration: v.duration }));
  }, []);
  const handleCanPlay = useCallback(() => {
    setState((s) => ({ ...s, isLoading: false }));
  }, []);
  const handleError = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const error = v.error ?? null;
    setState((s) => ({ ...s, error, isLoading: false }));
    onError?.(error);
  }, [onError]);
  const handleVideoEnded = useCallback(() => {
    if (isPlaylist && currentIndex < srcList.length - 1) {
      playlistAdvancingRef.current = true;
      setCurrentIndex((i) => i + 1);
      onNext?.();
    } else if (isPlaylist && loopPlaylist) {
      playlistAdvancingRef.current = true;
      setCurrentIndex(0);
      onNext?.();
    } else {
      setState((s) => ({ ...s, isPlaying: false, showControls: true }));
      onEnded?.();
    }
  }, [isPlaylist, currentIndex, srcList.length, loopPlaylist, onNext, onEnded]);
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {
        setState((s) => ({ ...s, isPlaying: false }));
      });
      setState((s) => ({ ...s, isPlaying: true, hasStarted: true }));
      onPlay?.();
    } else {
      v.pause();
      setState((s) => ({ ...s, isPlaying: false, showControls: true }));
      onPause?.();
    }
  }, [onPlay, onPause]);
  const startPlayback = useCallback(() => {
    if (!isNative) {
      setEmbedStarted(true);
      setState((s) => ({ ...s, hasStarted: true }));
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      setState((s) => ({ ...s, isPlaying: false }));
    });
    setState((s) => ({ ...s, isPlaying: true, hasStarted: true }));
    onPlay?.();
  }, [isNative, onPlay]);
  const handleProgressClick = useCallback(
    (e) => {
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      v.currentTime = pct * v.duration;
      setState((s) => ({ ...s, currentTime: v.currentTime }));
      onSeek?.(v.currentTime);
    },
    [onSeek]
  );
  const handleProgressMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;
      const rect = bar.getBoundingClientRect();
      const onMove = (ev) => {
        const pct = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      };
      const onUp = () => {
        setIsDragging(false);
        if (v) onSeek?.(v.currentTime);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [onSeek]
  );
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const onTouchStart = (e) => {
      e.preventDefault();
      setIsDragging(true);
      const v = videoRef.current;
      if (!v) return;
      const rect = bar.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        const pct = clamp((touch.clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      }
      const onMove = (ev) => {
        const t = ev.touches[0];
        if (!t) return;
        const pct = clamp((t.clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      };
      const onEnd = () => {
        setIsDragging(false);
        onSeek?.(v.currentTime);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    };
    bar.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => {
      bar.removeEventListener("touchstart", onTouchStart);
    };
  }, [onSeek]);
  const handleProgressHover = useCallback(
    (e) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width * 100, 0, 100);
      setHoverProgress(pct);
    },
    []
  );
  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted || v.volume === 0) {
      v.muted = false;
      v.volume = state.volume > 0 ? state.volume : 1;
      setState((s) => ({ ...s, isMuted: false, volume: v.volume }));
      onVolumeChange?.(v.volume, false);
    } else {
      v.muted = true;
      setState((s) => ({ ...s, isMuted: true }));
      onVolumeChange?.(0, true);
    }
  }, [state.volume, onVolumeChange]);
  const handleVolumeChange = useCallback(
    (e) => {
      const v = videoRef.current;
      const target = e.currentTarget;
      if (!v) return;
      const rect = target.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      v.volume = pct;
      v.muted = pct === 0;
      setState((s) => ({ ...s, volume: pct, isMuted: pct === 0 }));
      onVolumeChange?.(pct, pct === 0);
    },
    [onVolumeChange]
  );
  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current;
    const v = videoRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      if (c.requestFullscreen) {
        c.requestFullscreen();
      } else if (v && v.webkitEnterFullscreen) {
        v.webkitEnterFullscreen();
      }
    } else {
      document.exitFullscreen?.();
    }
  }, []);
  const togglePip = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await v.requestPictureInPicture();
      }
    } catch {
    }
  }, []);
  const setPlaybackRate = useCallback((rate) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setState((s) => ({ ...s, playbackRate: rate }));
    setShowSpeedMenu(false);
  }, []);
  const handleFocus = useCallback(() => {
    setState((s) => ({ ...s, isFocused: true }));
  }, []);
  const handleBlur = useCallback((e) => {
    if (containerRef.current?.contains(e.relatedTarget)) return;
    setState((s) => ({ ...s, isFocused: false }));
    setShowSpeedMenu(false);
    setShowCCMenu(false);
  }, []);
  const handleKeyDown = useCallback(
    (e) => {
      if (!state.isFocused || !isNative) return;
      const v = videoRef.current;
      if (!v) return;
      if (e.shiftKey && e.key === "ArrowLeft" && chapters && chapters.length > 0) {
        e.preventDefault();
        const target = [...chapters].reverse().find((ch) => ch.time < v.currentTime - 2);
        v.currentTime = target ? target.time : 0;
        resetHideTimer();
        return;
      }
      if (e.shiftKey && e.key === "ArrowRight" && chapters && chapters.length > 0) {
        e.preventDefault();
        const target = chapters.find((ch) => ch.time > v.currentTime + 0.5);
        if (target) v.currentTime = target.time;
        resetHideTimer();
        return;
      }
      if (matchesKey(e.key, resolvedKeymap.play)) {
        e.preventDefault();
        togglePlay();
      } else if (matchesKey(e.key, resolvedKeymap.seekBack)) {
        e.preventDefault();
        v.currentTime = Math.max(0, v.currentTime - 5);
      } else if (matchesKey(e.key, resolvedKeymap.seekForward)) {
        e.preventDefault();
        v.currentTime = Math.min(v.duration, v.currentTime + 5);
      } else if (matchesKey(e.key, resolvedKeymap.volumeUp)) {
        e.preventDefault();
        v.volume = clamp(v.volume + 0.1, 0, 1);
        setState((s) => ({ ...s, volume: v.volume, isMuted: false }));
        v.muted = false;
        onVolumeChange?.(v.volume, false);
      } else if (matchesKey(e.key, resolvedKeymap.volumeDown)) {
        e.preventDefault();
        v.volume = clamp(v.volume - 0.1, 0, 1);
        setState((s) => ({ ...s, volume: v.volume, isMuted: v.volume === 0 }));
        onVolumeChange?.(v.volume, v.volume === 0);
      } else if (matchesKey(e.key, resolvedKeymap.fullscreen)) {
        e.preventDefault();
        toggleFullscreen();
      } else if (matchesKey(e.key, resolvedKeymap.mute)) {
        e.preventDefault();
        toggleMute();
      } else if (matchesKey(e.key, resolvedKeymap.speedDown)) {
        e.preventDefault();
        const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
        if (idx > 0) setPlaybackRate(PLAYBACK_RATES[idx - 1]);
      } else if (matchesKey(e.key, resolvedKeymap.speedUp)) {
        e.preventDefault();
        const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
        if (idx < PLAYBACK_RATES.length - 1)
          setPlaybackRate(PLAYBACK_RATES[idx + 1]);
      } else if (matchesKey(e.key, resolvedKeymap.shortcuts)) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowShortcuts(false);
        setShowSpeedMenu(false);
        setShowCCMenu(false);
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const pct = parseInt(e.key) / 10;
        v.currentTime = pct * v.duration;
      }
      resetHideTimer();
    },
    [
      state.isFocused,
      state.playbackRate,
      isNative,
      resolvedKeymap,
      togglePlay,
      toggleFullscreen,
      toggleMute,
      setPlaybackRate,
      resetHideTimer,
      chapters,
      onVolumeChange
    ]
  );
  const handleMouseMove = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);
  const handleMouseLeave = useCallback(() => {
    if (isPlayingRef.current) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, showControls: false }));
        setShowSpeedMenu(false);
        setShowVolumeSlider(false);
      }, 800);
    }
    setHoverProgress(null);
  }, []);
  const progress = state.duration > 0 ? state.currentTime / state.duration * 100 : 0;
  const thumbFrame = previewThumbnails && hoverProgress !== null ? Math.min(
    Math.floor(hoverProgress / 100 * previewThumbnails.count),
    previewThumbnails.count - 1
  ) : null;
  const nearChapter = chapters && hoverProgress !== null ? chapters.find(
    (ch) => state.duration > 0 && Math.abs(ch.time / state.duration * 100 - hoverProgress) < 2
  ) : void 0;
  const posterUrl = poster || DEFAULT_POSTER;
  const showPoster = !state.hasStarted;
  const controlsVisible = state.showControls || !state.isPlaying || isDragging || showSpeedMenu || showCCMenu;
  const VolumeIcon = state.isMuted ? VolumeMuteIcon : state.volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        const v = videoRef.current;
        if (v) v.play().catch(() => {
        });
      },
      pause: () => {
        const v = videoRef.current;
        if (v) v.pause();
      },
      seek: (time) => {
        const v = videoRef.current;
        if (v) v.currentTime = clamp(time, 0, v.duration || Infinity);
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
      getDuration: () => videoRef.current?.duration ?? 0,
      getVolume: () => videoRef.current?.volume ?? state.volume,
      setVolume: (volume) => {
        const v = videoRef.current;
        if (!v) return;
        v.volume = clamp(volume, 0, 1);
        v.muted = volume === 0;
        setState((s) => ({ ...s, volume: v.volume, isMuted: v.muted }));
      },
      toggleMute: () => toggleMute(),
      toggleFullscreen: () => toggleFullscreen(),
      getVideoElement: () => videoRef.current
    }),
    [state.volume, toggleMute, toggleFullscreen]
  );
  return /* @__PURE__ */ jsx2(
    "div",
    {
      ref: containerRef,
      className,
      "data-vplayer-root": "",
      style: { ...getContainerStyle(width), ...style },
      tabIndex: 0,
      role: "region",
      "aria-label": ariaLabel || `Video player${title ? `: ${title}` : ""}`,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleMouseMove,
      children: /* @__PURE__ */ jsx2("div", { "data-vplayer-aspect": "", style: getAspectBoxStyle(ratio), children: /* @__PURE__ */ jsxs2("div", { "data-vplayer-inner": "", style: getInnerStyle(), children: [
        isNative && /* @__PURE__ */ jsx2(
          "video",
          {
            ref: videoRef,
            src: parsed.embedUrl,
            poster: posterUrl,
            preload,
            loop,
            autoPlay,
            muted: state.isMuted,
            playsInline: true,
            style: getVideoStyle(),
            onLoadedMetadata: handleLoadedMetadata,
            onDurationChange: handleDurationChange,
            onTimeUpdate: handleTimeUpdate,
            onProgress: handleProgress,
            onWaiting: handleWaiting,
            onCanPlay: handleCanPlay,
            onEnded: handleVideoEnded,
            onError: handleError,
            onClick: togglePlay,
            "aria-hidden": "true",
            children: tracks?.map((t, i) => /* @__PURE__ */ jsx2(
              "track",
              {
                kind: "subtitles",
                src: t.src,
                srcLang: t.lang,
                label: t.label,
                default: t.default
              },
              i
            ))
          }
        ),
        !isNative && embedStarted && /* @__PURE__ */ jsx2(
          "iframe",
          {
            src: `${parsed.embedUrl}&autoplay=1`,
            style: getIframeStyle(),
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            title: title || "Embedded video",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsxs2(
          "div",
          {
            style: getPosterOverlayStyle(posterUrl, showPoster),
            onClick: showPoster ? startPlayback : void 0,
            role: showPoster ? "button" : void 0,
            tabIndex: showPoster ? -1 : void 0,
            "aria-label": showPoster ? "Play video" : void 0,
            "aria-hidden": !showPoster,
            children: [
              /* @__PURE__ */ jsx2("div", { style: getPosterGradientStyle() }),
              /* @__PURE__ */ jsx2(
                "button",
                {
                  type: "button",
                  style: getPlayButtonLargeStyle(accentColor),
                  tabIndex: showPoster ? 0 : -1,
                  onMouseEnter: (e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  },
                  "aria-label": "Play video",
                  children: /* @__PURE__ */ jsx2(PlayIcon, { size: 32, color: iconColor })
                }
              )
            ]
          }
        ),
        state.isLoading && state.hasStarted && !state.error && /* @__PURE__ */ jsx2("div", { style: getLoadingOverlayStyle(), children: /* @__PURE__ */ jsx2(SpinnerIcon, { size: 40, color: iconColor }) }),
        state.error && /* @__PURE__ */ jsxs2("div", { style: getErrorOverlayStyle(), children: [
          /* @__PURE__ */ jsx2(ErrorIcon, { size: 40, color: iconColor }),
          /* @__PURE__ */ jsx2("span", { style: getErrorMessageStyle(), children: state.error.code === 4 ? "This video format is not supported" : "Video could not be loaded" })
        ] }),
        title && state.hasStarted && controlsVisible && /* @__PURE__ */ jsx2("div", { style: getTitleOverlayStyle(), children: title }),
        showShortcuts && /* @__PURE__ */ jsx2(
          "div",
          {
            style: getShortcutsOverlayStyle(),
            onClick: () => setShowShortcuts(false),
            children: /* @__PURE__ */ jsxs2(
              "div",
              {
                style: getShortcutsBoxStyle(),
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx2(
                    "div",
                    {
                      style: {
                        fontWeight: 600,
                        marginBottom: "12px",
                        fontSize: "14px"
                      },
                      children: "Keyboard Shortcuts"
                    }
                  ),
                  SHORTCUTS.map(([key, label]) => /* @__PURE__ */ jsxs2("div", { style: getShortcutRowStyle(), children: [
                    /* @__PURE__ */ jsx2("kbd", { style: getKbdStyle(), children: key }),
                    /* @__PURE__ */ jsx2(
                      "span",
                      {
                        style: {
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "13px"
                        },
                        children: label
                      }
                    )
                  ] }, key))
                ]
              }
            )
          }
        ),
        isNative && state.hasStarted && /* @__PURE__ */ jsxs2("div", { style: getControlsBarStyle(controlsVisible), children: [
          /* @__PURE__ */ jsxs2(
            "div",
            {
              ref: progressRef,
              style: getProgressContainerStyle(),
              onClick: handleProgressClick,
              onMouseDown: handleProgressMouseDown,
              onMouseMove: handleProgressHover,
              onMouseLeave: () => setHoverProgress(null),
              role: "slider",
              "aria-label": "Seek",
              "aria-valuemin": 0,
              "aria-valuemax": 100,
              "aria-valuenow": Math.round(progress),
              "aria-valuetext": `${formatTime(state.currentTime)} of ${formatTime(state.duration)}`,
              tabIndex: -1,
              children: [
                /* @__PURE__ */ jsxs2(
                  "div",
                  {
                    style: {
                      ...getProgressTrackStyle(),
                      height: hoverProgress !== null || isDragging ? "6px" : "4px"
                    },
                    children: [
                      /* @__PURE__ */ jsx2("div", { style: getProgressBufferStyle(state.buffered) }),
                      /* @__PURE__ */ jsx2(
                        "div",
                        {
                          style: getProgressFillStyle(progress, accentColor)
                        }
                      ),
                      chapters && state.duration > 0 && chapters.map((ch, i) => /* @__PURE__ */ jsx2(
                        "div",
                        {
                          style: getChapterMarkerStyle(
                            ch.time / state.duration * 100
                          )
                        },
                        i
                      ))
                    ]
                  }
                ),
                /* @__PURE__ */ jsx2(
                  "div",
                  {
                    style: getProgressThumbStyle(
                      progress,
                      accentColor,
                      hoverProgress !== null || isDragging
                    )
                  }
                ),
                thumbFrame !== null && previewThumbnails && hoverProgress !== null && /* @__PURE__ */ jsx2(
                  "div",
                  {
                    style: getPreviewThumbnailStyle(
                      hoverProgress,
                      previewThumbnails,
                      thumbFrame
                    )
                  }
                ),
                hoverProgress !== null && state.duration > 0 && /* @__PURE__ */ jsx2("div", { style: getTooltipStyle(hoverProgress), children: nearChapter?.label ?? formatTime(hoverProgress / 100 * state.duration) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs2("div", { style: getControlsRowStyle(), children: [
            /* @__PURE__ */ jsxs2("div", { style: getControlGroupStyle(), children: [
              /* @__PURE__ */ jsx2(
                "button",
                {
                  type: "button",
                  style: getControlButtonStyle(),
                  onClick: togglePlay,
                  "aria-label": state.isPlaying ? "Pause" : "Play",
                  onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  },
                  children: state.isPlaying ? /* @__PURE__ */ jsx2(PauseIcon, { size: 20, color: iconColor }) : /* @__PURE__ */ jsx2(PlayIcon, { size: 20, color: iconColor })
                }
              ),
              isPlaylist && /* @__PURE__ */ jsxs2(Fragment, { children: [
                currentIndex > 0 && /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    style: getControlButtonStyle(),
                    onClick: () => {
                      setCurrentIndex((i) => i - 1);
                      onPrev?.();
                    },
                    "aria-label": "Previous",
                    children: /* @__PURE__ */ jsx2(PrevIcon, { size: 18, color: iconColor })
                  }
                ),
                currentIndex < srcList.length - 1 && /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    style: getControlButtonStyle(),
                    onClick: () => {
                      setCurrentIndex((i) => i + 1);
                      onNext?.();
                    },
                    "aria-label": "Next",
                    children: /* @__PURE__ */ jsx2(NextIcon, { size: 18, color: iconColor })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs2(
                "div",
                {
                  style: getVolumeSliderContainerStyle(),
                  onMouseEnter: () => setShowVolumeSlider(true),
                  onMouseLeave: () => setShowVolumeSlider(false),
                  children: [
                    /* @__PURE__ */ jsx2(
                      "button",
                      {
                        type: "button",
                        style: getControlButtonStyle(),
                        onClick: toggleMute,
                        "aria-label": state.isMuted ? "Unmute" : "Mute",
                        onMouseEnter: (e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        },
                        children: /* @__PURE__ */ jsx2(VolumeIcon, { size: 20, color: iconColor })
                      }
                    ),
                    showVolumeSlider && /* @__PURE__ */ jsxs2(
                      "div",
                      {
                        "data-vplayer-volume-slider": "",
                        style: getVolumeSliderTrackStyle(),
                        onClick: handleVolumeChange,
                        role: "slider",
                        "aria-label": "Volume",
                        "aria-valuemin": 0,
                        "aria-valuemax": 100,
                        "aria-valuenow": Math.round(
                          (state.isMuted ? 0 : state.volume) * 100
                        ),
                        tabIndex: -1,
                        children: [
                          /* @__PURE__ */ jsx2("div", { style: getVolumeSliderTrackBarStyle() }),
                          /* @__PURE__ */ jsx2(
                            "div",
                            {
                              style: getVolumeSliderFillStyle(
                                state.isMuted ? 0 : state.volume,
                                accentColor
                              )
                            }
                          ),
                          /* @__PURE__ */ jsx2(
                            "div",
                            {
                              style: getVolumeSliderThumbStyle(
                                state.isMuted ? 0 : state.volume,
                                accentColor
                              )
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs2("span", { style: getTimeDisplayStyle(), children: [
                formatTime(state.currentTime),
                " / ",
                formatTime(state.duration)
              ] })
            ] }),
            /* @__PURE__ */ jsxs2("div", { style: getControlGroupStyle(), children: [
              tracks && tracks.length > 0 && /* @__PURE__ */ jsxs2("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    style: getControlButtonStyle(),
                    onClick: () => setShowCCMenu(!showCCMenu),
                    "aria-label": "Captions",
                    "aria-expanded": showCCMenu,
                    children: /* @__PURE__ */ jsx2(
                      CCIcon,
                      {
                        size: 18,
                        color: activeTrack !== null ? accentColor : iconColor
                      }
                    )
                  }
                ),
                showCCMenu && /* @__PURE__ */ jsxs2("div", { style: getCCMenuStyle(), children: [
                  /* @__PURE__ */ jsx2(
                    "button",
                    {
                      type: "button",
                      style: getSpeedMenuItemStyle(
                        activeTrack === null,
                        accentColor
                      ),
                      onClick: () => {
                        setActiveTrack(null);
                        setShowCCMenu(false);
                      },
                      children: "Off"
                    }
                  ),
                  tracks.map((t, i) => /* @__PURE__ */ jsx2(
                    "button",
                    {
                      type: "button",
                      style: getSpeedMenuItemStyle(
                        activeTrack === i,
                        accentColor
                      ),
                      onClick: () => {
                        setActiveTrack(i);
                        setShowCCMenu(false);
                      },
                      children: t.label
                    },
                    i
                  ))
                ] })
              ] }),
              /* @__PURE__ */ jsxs2("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    style: {
                      ...getControlButtonStyle(),
                      fontSize: "12px",
                      fontWeight: 600,
                      minWidth: "32px"
                    },
                    onClick: () => setShowSpeedMenu(!showSpeedMenu),
                    "aria-label": "Playback speed",
                    "aria-expanded": showSpeedMenu,
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    },
                    children: state.playbackRate === 1 ? /* @__PURE__ */ jsx2(SettingsIcon, { size: 18, color: iconColor }) : /* @__PURE__ */ jsxs2("span", { style: { color: accentColor }, children: [
                      state.playbackRate,
                      "x"
                    ] })
                  }
                ),
                showSpeedMenu && /* @__PURE__ */ jsx2("div", { style: getSpeedMenuStyle(), children: PLAYBACK_RATES.map((rate) => /* @__PURE__ */ jsx2(
                  "button",
                  {
                    type: "button",
                    style: getSpeedMenuItemStyle(
                      state.playbackRate === rate,
                      accentColor
                    ),
                    onClick: () => setPlaybackRate(rate),
                    onMouseEnter: (e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    },
                    children: rate === 1 ? "Normal" : `${rate}x`
                  },
                  rate
                )) })
              ] }),
              supportsPip && /* @__PURE__ */ jsx2(
                "button",
                {
                  type: "button",
                  style: getControlButtonStyle(),
                  onClick: togglePip,
                  "aria-label": "Picture in Picture",
                  onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  },
                  children: /* @__PURE__ */ jsx2(PipIcon, { size: 18, color: iconColor })
                }
              ),
              /* @__PURE__ */ jsx2(
                "button",
                {
                  type: "button",
                  style: getControlButtonStyle(),
                  onClick: toggleFullscreen,
                  "aria-label": state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
                  onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  },
                  children: state.isFullscreen ? /* @__PURE__ */ jsx2(ExitFullscreenIcon, { size: 18, color: iconColor }) : /* @__PURE__ */ jsx2(FullscreenIcon, { size: 18, color: iconColor })
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    }
  );
});
export {
  VPlayer,
  formatTime,
  parseAspectRatio,
  parseVideoSource
};
