"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  VPlayer: () => VPlayer,
  formatTime: () => formatTime,
  parseAspectRatio: () => parseAspectRatio,
  parseVideoSource: () => parseVideoSource
});
module.exports = __toCommonJS(index_exports);

// src/VPlayer.tsx
var import_react = require("react");

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
var import_jsx_runtime = require("react/jsx-runtime");
function PlayIcon({ size = 24, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", fill: color }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", fill: color })
      ]
    }
  );
}
function VolumeHighIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M11 5L6 9H2v6h4l5 4V5Z",
            fill: color
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M11 5L6 9H2v6h4l5 4V5Z",
            fill: color
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M11 5L6 9H2v6h4l5 4V5Z",
            fill: color
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style,
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "3", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", stroke: color, strokeWidth: "2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "11", y: "9", width: "9", height: "6", rx: "1", fill: color })
      ]
    }
  );
}
function SpinnerIcon({ size = 40, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      style: { animation: "vplayer-spin 1s linear infinite", ...style },
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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

// src/styles.ts
function getContainerStyle(width, isFocused) {
  return {
    position: "relative",
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
    backgroundColor: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    outline: isFocused ? "2px solid rgba(255,255,255,0.2)" : "none",
    outlineOffset: "2px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.5,
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
function getPosterOverlayStyle(posterUrl) {
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
    zIndex: 10
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
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "2px",
    position: "relative",
    cursor: "pointer"
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
    right: "8px",
    backgroundColor: "rgba(20,20,20,0.95)",
    borderRadius: "8px",
    padding: "4px 0",
    minWidth: "100px",
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
  `;
  document.head.appendChild(style);
}

// src/VPlayer.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%23111' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='central' textAnchor='middle' fontFamily='system-ui' fontSize='48' fill='%23333'%3EVideo%3C/text%3E%3C/svg%3E";
var PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
var HIDE_CONTROLS_DELAY = 3e3;
function VPlayer({
  src,
  poster,
  width = "100%",
  aspectRatio = "16:9",
  accentColor = "#e11d48",
  iconColor = "#ffffff",
  autoPlay = false,
  loop = false,
  muted = false,
  title,
  className,
  style,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  preload = "metadata",
  ariaLabel
}) {
  const containerRef = (0, import_react.useRef)(null);
  const videoRef = (0, import_react.useRef)(null);
  const progressRef = (0, import_react.useRef)(null);
  const hideTimerRef = (0, import_react.useRef)(null);
  const isPlayingRef = (0, import_react.useRef)(false);
  const hasStartedRef = (0, import_react.useRef)(false);
  const parsed = parseVideoSource(src);
  const ratio = parseAspectRatio(aspectRatio);
  const isNative = parsed.type === "native";
  const [state, setState] = (0, import_react.useState)({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: muted ? 0 : 1,
    isMuted: muted,
    isFullscreen: false,
    buffered: 0,
    isLoading: false,
    hasStarted: false,
    showControls: true,
    isFocused: false,
    playbackRate: 1
  });
  const [showSpeedMenu, setShowSpeedMenu] = (0, import_react.useState)(false);
  const [showVolumeSlider, setShowVolumeSlider] = (0, import_react.useState)(false);
  const [hoverProgress, setHoverProgress] = (0, import_react.useState)(null);
  const [isDragging, setIsDragging] = (0, import_react.useState)(false);
  const [embedStarted, setEmbedStarted] = (0, import_react.useState)(false);
  const [supportsPip, setSupportsPip] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    injectKeyframes();
    setSupportsPip("pictureInPictureEnabled" in document);
  }, []);
  (0, import_react.useEffect)(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);
  (0, import_react.useEffect)(() => {
    hasStartedRef.current = state.hasStarted;
  }, [state.hasStarted]);
  const resetHideTimer = (0, import_react.useCallback)(() => {
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
  (0, import_react.useEffect)(() => {
    const handleFSChange = () => {
      setState((s) => ({
        ...s,
        isFullscreen: !!document.fullscreenElement
      }));
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);
  (0, import_react.useEffect)(() => {
    setState((s) => ({
      ...s,
      currentTime: 0,
      duration: 0,
      hasStarted: false,
      isPlaying: false,
      buffered: 0,
      isLoading: false
    }));
    setEmbedStarted(false);
  }, [src]);
  const handleLoadedMetadata = (0, import_react.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      duration: v.duration,
      isLoading: false
    }));
  }, []);
  const handleTimeUpdate = (0, import_react.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      currentTime: v.currentTime
    }));
    onTimeUpdate?.(v.currentTime, v.duration);
  }, [onTimeUpdate]);
  const handleProgress = (0, import_react.useCallback)(() => {
    const v = videoRef.current;
    if (!v || v.buffered.length === 0) return;
    const end = v.buffered.end(v.buffered.length - 1);
    setState((s) => ({
      ...s,
      buffered: v.duration ? end / v.duration * 100 : 0
    }));
  }, []);
  const handleWaiting = (0, import_react.useCallback)(() => {
    setState((s) => ({ ...s, isLoading: true }));
  }, []);
  const handleCanPlay = (0, import_react.useCallback)(() => {
    setState((s) => ({ ...s, isLoading: false }));
  }, []);
  const handleVideoEnded = (0, import_react.useCallback)(() => {
    setState((s) => ({ ...s, isPlaying: false, showControls: true }));
    onEnded?.();
  }, [onEnded]);
  const togglePlay = (0, import_react.useCallback)(() => {
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
  const startPlayback = (0, import_react.useCallback)(() => {
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
  const handleProgressClick = (0, import_react.useCallback)(
    (e) => {
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      v.currentTime = pct * v.duration;
      setState((s) => ({ ...s, currentTime: v.currentTime }));
    },
    []
  );
  const handleProgressMouseDown = (0, import_react.useCallback)(
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
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    []
  );
  const handleProgressHover = (0, import_react.useCallback)(
    (e) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width * 100, 0, 100);
      setHoverProgress(pct);
    },
    []
  );
  const toggleMute = (0, import_react.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted || v.volume === 0) {
      v.muted = false;
      v.volume = state.volume > 0 ? state.volume : 1;
      setState((s) => ({ ...s, isMuted: false, volume: v.volume }));
    } else {
      v.muted = true;
      setState((s) => ({ ...s, isMuted: true }));
    }
  }, [state.volume]);
  const handleVolumeChange = (0, import_react.useCallback)(
    (e) => {
      const v = videoRef.current;
      const target = e.currentTarget;
      if (!v) return;
      const rect = target.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      v.volume = pct;
      v.muted = pct === 0;
      setState((s) => ({ ...s, volume: pct, isMuted: pct === 0 }));
    },
    []
  );
  const toggleFullscreen = (0, import_react.useCallback)(() => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);
  const togglePip = (0, import_react.useCallback)(async () => {
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
  const setPlaybackRate = (0, import_react.useCallback)((rate) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setState((s) => ({ ...s, playbackRate: rate }));
    setShowSpeedMenu(false);
  }, []);
  const handleFocus = (0, import_react.useCallback)(() => {
    setState((s) => ({ ...s, isFocused: true }));
  }, []);
  const handleBlur = (0, import_react.useCallback)(() => {
    setState((s) => ({ ...s, isFocused: false }));
    setShowSpeedMenu(false);
  }, []);
  const handleKeyDown = (0, import_react.useCallback)(
    (e) => {
      if (!state.isFocused || !isNative) return;
      const v = videoRef.current;
      if (!v) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          v.currentTime = Math.min(v.duration, v.currentTime + 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          v.volume = clamp(v.volume + 0.1, 0, 1);
          setState((s) => ({ ...s, volume: v.volume, isMuted: false }));
          v.muted = false;
          break;
        case "ArrowDown":
          e.preventDefault();
          v.volume = clamp(v.volume - 0.1, 0, 1);
          setState((s) => ({
            ...s,
            volume: v.volume,
            isMuted: v.volume === 0
          }));
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          e.preventDefault();
          const pct = parseInt(e.key) / 10;
          v.currentTime = pct * v.duration;
          break;
        }
        case "<":
          e.preventDefault();
          {
            const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
            if (idx > 0) setPlaybackRate(PLAYBACK_RATES[idx - 1]);
          }
          break;
        case ">":
          e.preventDefault();
          {
            const idx = PLAYBACK_RATES.indexOf(state.playbackRate);
            if (idx < PLAYBACK_RATES.length - 1)
              setPlaybackRate(PLAYBACK_RATES[idx + 1]);
          }
          break;
        default:
          break;
      }
      resetHideTimer();
    },
    [
      state.isFocused,
      state.playbackRate,
      isNative,
      togglePlay,
      toggleFullscreen,
      toggleMute,
      setPlaybackRate,
      resetHideTimer
    ]
  );
  const handleMouseMove = (0, import_react.useCallback)(() => {
    resetHideTimer();
  }, [resetHideTimer]);
  const handleMouseLeave = (0, import_react.useCallback)(() => {
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
  const posterUrl = poster || DEFAULT_POSTER;
  const showPoster = !state.hasStarted;
  const controlsVisible = state.showControls || !state.isPlaying || isDragging || showSpeedMenu;
  const VolumeIcon = state.isMuted ? VolumeMuteIcon : state.volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      ref: containerRef,
      className,
      style: { ...getContainerStyle(width, state.isFocused), ...style },
      tabIndex: 0,
      role: "region",
      "aria-label": ariaLabel || `Video player${title ? `: ${title}` : ""}`,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getAspectBoxStyle(ratio), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getInnerStyle(), children: [
        isNative && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
            onTimeUpdate: handleTimeUpdate,
            onProgress: handleProgress,
            onWaiting: handleWaiting,
            onCanPlay: handleCanPlay,
            onEnded: handleVideoEnded,
            onClick: togglePlay,
            "aria-hidden": "true"
          }
        ),
        !isNative && embedStarted && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
        showPoster && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            style: getPosterOverlayStyle(posterUrl),
            onClick: startPlayback,
            role: "button",
            tabIndex: -1,
            "aria-label": "Play video",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getPosterGradientStyle() }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  type: "button",
                  style: getPlayButtonLargeStyle(accentColor),
                  onMouseEnter: (e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  },
                  "aria-label": "Play video",
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayIcon, { size: 32, color: iconColor })
                }
              )
            ]
          }
        ),
        state.isLoading && state.hasStarted && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getLoadingOverlayStyle(), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SpinnerIcon, { size: 40, color: iconColor }) }),
        title && state.hasStarted && controlsVisible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getTitleOverlayStyle(), children: title }),
        isNative && state.hasStarted && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlsBarStyle(controlsVisible), children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
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
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                  "div",
                  {
                    style: {
                      ...getProgressTrackStyle(),
                      height: hoverProgress !== null || isDragging ? "6px" : "4px"
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getProgressBufferStyle(state.buffered) }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                        "div",
                        {
                          style: getProgressFillStyle(progress, accentColor)
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "div",
                  {
                    style: getProgressThumbStyle(
                      progress,
                      accentColor,
                      hoverProgress !== null || isDragging
                    )
                  }
                ),
                hoverProgress !== null && state.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getTooltipStyle(hoverProgress), children: formatTime(hoverProgress / 100 * state.duration) })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlsRowStyle(), children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
                  children: state.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PauseIcon, { size: 20, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PlayIcon, { size: 20, color: iconColor })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "div",
                {
                  style: getVolumeSliderContainerStyle(),
                  onMouseEnter: () => setShowVolumeSlider(true),
                  onMouseLeave: () => setShowVolumeSlider(false),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
                        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(VolumeIcon, { size: 20, color: iconColor })
                      }
                    ),
                    showVolumeSlider && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                      "div",
                      {
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
                          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                            "div",
                            {
                              style: getVolumeSliderFillStyle(
                                state.isMuted ? 0 : state.volume,
                                accentColor
                              )
                            }
                          ),
                          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: getTimeDisplayStyle(), children: [
                formatTime(state.currentTime),
                " / ",
                formatTime(state.duration)
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { position: "relative" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
                    children: state.playbackRate === 1 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SettingsIcon, { size: 18, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: { color: accentColor }, children: [
                      state.playbackRate,
                      "x"
                    ] })
                  }
                ),
                showSpeedMenu && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getSpeedMenuStyle(), children: PLAYBACK_RATES.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
              supportsPip && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
                  children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PipIcon, { size: 18, color: iconColor })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
                  children: state.isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ExitFullscreenIcon, { size: 18, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FullscreenIcon, { size: 18, color: iconColor })
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VPlayer,
  formatTime,
  parseAspectRatio,
  parseVideoSource
});
