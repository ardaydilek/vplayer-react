"use client";
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
  VPlayer: () => VPlayer2,
  canPlayUrl: () => canPlayUrl,
  formatTime: () => formatTime,
  isHlsSource: () => isHlsSource,
  parseAspectRatio: () => parseAspectRatio,
  parseVideoSource: () => parseVideoSource
});
module.exports = __toCommonJS(index_exports);

// src/VPlayer.tsx
var import_react2 = require("react");

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
    embedUrl: src,
    isHls: isHlsSource(src)
  };
}
function isHlsSource(src) {
  return /\.m3u8($|\?|#)/i.test(src);
}
var MEDIA_EXTENSIONS = /\.(mp4|webm|ogv|ogg|mov|m4v|mp3|m4a|aac|wav|flac|m3u8)($|\?|#)/i;
function canPlayUrl(url) {
  if (typeof url !== "string" || url.length === 0) return false;
  if (url.startsWith("blob:") || url.startsWith("data:")) return true;
  if (parseVideoSource(url).type !== "native") return true;
  return MEDIA_EXTENSIONS.test(url);
}
function escapeCssUrl(url) {
  return url.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "");
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
var STROKE = 1.8;
function Svg({
  size = 20,
  style,
  children
}) {
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
      focusable: "false",
      children
    }
  );
}
function strokeProps(color) {
  return {
    stroke: color,
    strokeWidth: STROKE,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
}
function PlayIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Svg, { size, style, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "path",
    {
      d: "M9.1 6.5 17.3 12 9.1 17.5Z",
      fill: color,
      stroke: color,
      strokeWidth: "2.6",
      strokeLinejoin: "round"
    }
  ) });
}
function PauseIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "7.6", y: "5", width: "3.2", height: "14", rx: "1.3", fill: color }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "13.2", y: "5", width: "3.2", height: "14", rx: "1.3", fill: color })
  ] });
}
function PrevIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        d: "M17.8 7 10.4 12l7.4 5Z",
        fill: color,
        stroke: color,
        strokeWidth: "2.4",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5.2", y: "5.8", width: "2.4", height: "12.4", rx: "1.2", fill: color })
  ] });
}
function NextIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        d: "M6.2 7 13.6 12l-7.4 5Z",
        fill: color,
        stroke: color,
        strokeWidth: "2.4",
        strokeLinejoin: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "16.4", y: "5.8", width: "2.4", height: "12.4", rx: "1.2", fill: color })
  ] });
}
var SPEAKER = "M12.1 6.2a.85.85 0 0 0-1.4-.65L7.6 8.4H4.9a1.4 1.4 0 0 0-1.4 1.4v4.4a1.4 1.4 0 0 0 1.4 1.4h2.7l3.1 2.85a.85.85 0 0 0 1.4-.65V6.2Z";
function VolumeHighIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: SPEAKER, fill: color }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15.3 9.2a4 4 0 0 1 0 5.6", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6.5a7.8 7.8 0 0 1 0 11", ...strokeProps(color) })
  ] });
}
function VolumeLowIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: SPEAKER, fill: color }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15.3 9.2a4 4 0 0 1 0 5.6", ...strokeProps(color) })
  ] });
}
function VolumeMuteIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: SPEAKER, fill: color }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m15.8 9.6 4.7 4.8m0-4.8-4.7 4.8", ...strokeProps(color) })
  ] });
}
var SCREEN = { x: 3, y: 5.6, width: 18, height: 12.8, rx: 3.2 };
function CCIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { ...SCREEN, ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.8 10.5a2.3 2.3 0 1 0 0 3", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.2 10.5a2.3 2.3 0 1 0 0 3", ...strokeProps(color) })
  ] });
}
function PipIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { ...SCREEN, ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "12.6", y: "11.2", width: "6", height: "4.8", rx: "1.3", fill: color })
  ] });
}
function FullscreenIcon({ size = 20, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 4H6.5A2.5 2.5 0 0 0 4 6.5V9", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 4h2.5A2.5 2.5 0 0 1 20 6.5V9", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 15v2.5a2.5 2.5 0 0 1-2.5 2.5H15", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 15v2.5A2.5 2.5 0 0 0 6.5 20H9", ...strokeProps(color) })
  ] });
}
function ExitFullscreenIcon({
  size = 20,
  color = "#fff",
  style
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 9h2.5A2.5 2.5 0 0 0 9 6.5V4", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 9h-2.5A2.5 2.5 0 0 1 15 6.5V4", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M15 20v-2.5a2.5 2.5 0 0 1 2.5-2.5H20", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 20v-2.5A2.5 2.5 0 0 0 6.5 15H4", ...strokeProps(color) })
  ] });
}
function ErrorIcon({ size = 32, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "8.2", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 8.1v4.6", ...strokeProps(color) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "16.1", r: "1.05", fill: color })
  ] });
}
function RetryIcon({ size = 16, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Svg, { size, style, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        d: "M19.9 12a7.9 7.9 0 1 1-2.3-5.6",
        ...strokeProps(color)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.9 4.6v4.6h-4.6", ...strokeProps(color) })
  ] });
}
function SpinnerIcon({ size = 36, color = "#fff", style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Svg,
    {
      size,
      style: { animation: "vplayer-spin 0.9s linear infinite", ...style },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "8.5", stroke: color, strokeWidth: "2.2", opacity: "0.22" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "8.5",
            stroke: color,
            strokeWidth: "2.2",
            strokeLinecap: "round",
            strokeDasharray: "16 37.4"
          }
        )
      ]
    }
  );
}

// src/captions.ts
var import_react = require("react");
var TEXT_NODE = 3;
var ELEMENT_NODE = 1;
var CUE_TAGS = {
  B: "b",
  I: "i",
  U: "u",
  RUBY: "ruby",
  RT: "rt"
};
function cueNodeToReact(node, key) {
  if (node.nodeType === TEXT_NODE) return node.nodeValue;
  if (node.nodeType !== ELEMENT_NODE) return null;
  const el = node;
  const children = [];
  for (let i = 0; i < el.childNodes.length; i++) {
    children.push(cueNodeToReact(el.childNodes[i], `${key}.${i}`));
  }
  return (0, import_react.createElement)(
    CUE_TAGS[el.tagName] ?? "span",
    { key },
    ...children
  );
}
function stripCueTags(text) {
  return text.replace(/<[^>]*>/g, "");
}
function resolveAlign(align) {
  switch (align) {
    case "left":
    case "start":
      return "left";
    case "right":
    case "end":
      return "right";
    default:
      return "center";
  }
}
function resolveRegion(cue) {
  const { line } = cue;
  if (typeof line !== "number" || !isFinite(line)) return "bottom";
  if (cue.snapToLines === false) return line < 50 ? "top" : "bottom";
  return line >= 0 ? "top" : "bottom";
}
function snapshotCue(cue, index) {
  const vtt = cue;
  let content = null;
  if (typeof vtt.getCueAsHTML === "function") {
    try {
      const fragment = vtt.getCueAsHTML();
      const children = [];
      for (let i = 0; i < fragment.childNodes.length; i++) {
        children.push(cueNodeToReact(fragment.childNodes[i], String(i)));
      }
      content = (0, import_react.createElement)(import_react.Fragment, null, ...children);
    } catch {
      content = null;
    }
  }
  if (content === null) content = stripCueTags(vtt.text ?? "");
  return {
    key: `${cue.startTime}:${cue.endTime}:${index}`,
    content,
    align: resolveAlign(vtt.align),
    region: resolveRegion(vtt)
  };
}
function getVideoContentBox(video) {
  const boxWidth = video.clientWidth;
  const boxHeight = video.clientHeight;
  const { videoWidth, videoHeight } = video;
  if (!videoWidth || !videoHeight || !boxWidth || !boxHeight) {
    return { left: 0, top: 0, width: boxWidth, height: boxHeight };
  }
  const scale = Math.min(boxWidth / videoWidth, boxHeight / videoHeight);
  const width = videoWidth * scale;
  const height = videoHeight * scale;
  return {
    left: (boxWidth - width) / 2,
    top: (boxHeight - height) / 2,
    width,
    height
  };
}
function sameContentBox(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  return Math.abs(a.left - b.left) < 0.5 && Math.abs(a.top - b.top) < 0.5 && Math.abs(a.width - b.width) < 0.5 && Math.abs(a.height - b.height) < 0.5;
}
function getCaptionFontSize(contentHeight) {
  return Math.round(Math.min(Math.max(contentHeight * 0.048, 13), 40));
}

// src/styles.ts
var isInlineLayout = (v) => v !== "classic";
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
    pointerEvents: visible ? "auto" : "none"
  };
}
function getPosterGradientStyle() {
  return {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(125% 125% at 50% 50%,rgba(0,0,0,0.34) 0%,rgba(0,0,0,0.30) 14%,rgba(0,0,0,0.24) 28%,rgba(0,0,0,0.19) 42%,rgba(0,0,0,0.17) 55%,rgba(0,0,0,0.20) 68%,rgba(0,0,0,0.27) 82%,rgba(0,0,0,0.38) 100%)",
    pointerEvents: "none"
  };
}
function getPlayButtonLargeStyle() {
  return {
    position: "relative",
    zIndex: 1,
    // Sized as a share of the frame rather than a fixed 72px, so it neither
    // swamps a 320px embed nor disappears in a full-bleed hero — bounded at
    // both ends so it stays a real hit target and never becomes a billboard.
    width: "7%",
    minWidth: "56px",
    maxWidth: "84px",
    aspectRatio: "1",
    borderRadius: "50%",
    // Dark glass, not light: a white triangle needs something behind it on a
    // bright poster, and the ring keeps the disc visible on a dark one.
    backgroundColor: "rgba(16,16,20,0.40)",
    backdropFilter: "blur(16px) saturate(1.4)",
    WebkitBackdropFilter: "blur(16px) saturate(1.4)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.34),inset 0 1px 0 rgba(255,255,255,0.22),0 2px 6px rgba(0,0,0,0.3),0 16px 40px -12px rgba(0,0,0,0.7)",
    padding: 0,
    touchAction: "manipulation"
  };
}
function getCaptionLayerStyle(box) {
  return {
    position: "absolute",
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    pointerEvents: "none",
    zIndex: 12,
    overflow: "hidden"
  };
}
function getCaptionRegionStyle(region, lift, fontSize) {
  const edge = Math.max(10, Math.round(fontSize * 0.6));
  return {
    position: "absolute",
    left: 0,
    right: 0,
    ...region === "top" ? { top: `${edge}px` } : { bottom: `${edge}px` },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: `${Math.max(2, Math.round(fontSize * 0.16))}px`,
    padding: `0 ${edge}px`,
    fontSize: `${fontSize}px`,
    lineHeight: 1.34,
    // Only the bottom region moves, and only far enough to clear the bar.
    transform: region === "bottom" && lift > 0 ? `translateY(-${lift}px)` : "none"
  };
}
function getCaptionCueStyle(align, captionStyle) {
  return {
    alignSelf: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
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
    whiteSpace: "pre-line"
  };
}
function getControlsBarStyle(visible, variant, compact = false) {
  const scrim = {
    classic: "linear-gradient(to top,rgba(0,0,0,0.86) 0%,rgba(0,0,0,0.80) 12%,rgba(0,0,0,0.68) 26%,rgba(0,0,0,0.52) 41%,rgba(0,0,0,0.35) 56%,rgba(0,0,0,0.20) 70%,rgba(0,0,0,0.09) 83%,rgba(0,0,0,0) 100%)",
    minimal: "linear-gradient(to top,rgba(0,0,0,0.58) 0%,rgba(0,0,0,0.46) 22%,rgba(0,0,0,0.30) 46%,rgba(0,0,0,0.15) 70%,rgba(0,0,0,0.05) 87%,rgba(0,0,0,0) 100%)",
    floating: "none"
  };
  const padding = {
    classic: ["40px", "16px"],
    minimal: ["34px", "14px"],
    floating: ["40px", "12px"]
  };
  const [padTop, padSideDefault] = padding[variant];
  const padSide = compact ? "8px" : padSideDefault;
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
    zIndex: 20
  };
}
function getControlsShellStyle(variant) {
  const base = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    minWidth: 0
  };
  if (variant !== "floating") return base;
  return {
    ...base,
    backgroundColor: "rgba(18,18,21,0.62)",
    backdropFilter: "blur(20px) saturate(1.6)",
    WebkitBackdropFilter: "blur(20px) saturate(1.6)",
    borderRadius: "16px",
    padding: "6px 8px",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10),0 1px 2px rgba(0,0,0,0.28),0 12px 32px -10px rgba(0,0,0,0.65)"
  };
}
function getProgressContainerStyle(variant) {
  return {
    position: "relative",
    height: isInlineLayout(variant) ? "18px" : "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    touchAction: "none",
    width: isInlineLayout(variant) ? "auto" : "100%",
    flex: isInlineLayout(variant) ? "1 1 0%" : void 0,
    minWidth: isInlineLayout(variant) ? "48px" : void 0
  };
}
function getProgressTrackStyle() {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: "999px",
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
    backgroundColor: "rgba(255,255,255,0.34)",
    borderRadius: "999px"
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
    borderRadius: "999px",
    transition: "none"
  };
}
function getProgressThumbStyle(progress, accentColor, isHovering) {
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
function getInlineRowStyle() {
  return {
    display: "flex",
    alignItems: "center",
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
function getControlButtonStyle(variant = "classic") {
  return {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    minWidth: "36px",
    height: "40px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: variant === "floating" ? "8px" : "9px",
    transition: "background-color 0.15s ease-out",
    color: "#fff",
    lineHeight: 1,
    flexShrink: 0,
    touchAction: "manipulation"
  };
}
function getSpeedButtonStyle(variant, isDefaultRate) {
  return {
    ...getControlButtonStyle(variant),
    // Wide enough for "0.25×" so the row can't shift as the rate changes
    minWidth: "46px",
    padding: "0 6px",
    fontSize: "12.5px",
    // Weight and figure width are constant across states: neither selecting a
    // rate nor ticking past 9 may reflow the bar.
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.01em",
    color: isDefaultRate ? "rgba(255,255,255,0.9)" : "#fff"
  };
}
function getPlayToggleStyle(variant) {
  const base = getControlButtonStyle(variant);
  if (variant === "classic") return base;
  return {
    ...base,
    width: "36px",
    minWidth: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.16)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)"
  };
}
function getTimeDisplayStyle(variant) {
  return {
    color: "rgba(255,255,255,0.9)",
    fontSize: "13px",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
    padding: isInlineLayout(variant) ? "0 2px" : "0 6px",
    flexShrink: 0
  };
}
function getVolumeSliderContainerStyle() {
  return {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    position: "relative"
  };
}
function getVolumeSliderStyle() {
  return {
    position: "relative",
    width: "48px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    touchAction: "none",
    flexShrink: 0,
    marginRight: "2px"
  };
}
function getVolumeTrackStyle() {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    height: "3px",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: "999px",
    overflow: "hidden"
  };
}
function getVolumeFillStyle(level, isActive) {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${level * 100}%`,
    backgroundColor: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
    borderRadius: "999px",
    transition: "background-color 0.15s ease-out"
  };
}
function getVolumeThumbStyle(level, isActive) {
  return {
    position: "absolute",
    left: `${level * 100}%`,
    top: "50%",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    transform: `translate(-50%, -50%) scale(${isActive ? 1 : 0})`,
    transition: "transform 0.15s cubic-bezier(0.32, 0.72, 0, 1)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.45)",
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
    gap: "14px",
    padding: "24px",
    backgroundColor: "rgba(9,9,11,0.94)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 25
  };
}
function getErrorTitleStyle() {
  return {
    color: "#fff",
    fontSize: "15px",
    fontWeight: 550,
    textAlign: "center",
    letterSpacing: "-0.01em"
  };
}
function getErrorMessageStyle() {
  return {
    color: "rgba(255,255,255,0.62)",
    fontSize: "13px",
    lineHeight: 1.5,
    textAlign: "center",
    // 46ch keeps the explanation to two comfortable lines on a wide player
    maxWidth: "46ch",
    marginTop: "-6px"
  };
}
function getRetryButtonStyle() {
  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "4px",
    height: "34px",
    padding: "0 14px",
    borderRadius: "9px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.1)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14)",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "inherit",
    transition: "background-color 0.15s ease-out",
    touchAction: "manipulation"
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
    whiteSpace: "nowrap",
    pointerEvents: "none"
  };
}
function getMenuBackdropStyle() {
  return {
    position: "absolute",
    inset: 0,
    zIndex: 19
  };
}
function getMenuPanelStyle() {
  return {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    right: 0,
    backgroundColor: "rgba(20,20,22,0.94)",
    borderRadius: "12px",
    padding: "6px",
    minWidth: "136px",
    // A percentage would resolve against the 40px button wrapper
    maxHeight: "220px",
    overflowY: "auto",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10),0 12px 32px -10px rgba(0,0,0,0.7)",
    zIndex: 5,
    transformOrigin: "bottom right"
  };
}
function getMenuAnchorStyle() {
  return { position: "relative", display: "inline-flex" };
}
function getSpeedMenuItemStyle(isActive, accentColor) {
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
    touchAction: "manipulation"
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
    padding: "4px 8px",
    borderRadius: "6px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    zIndex: 5
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
    padding: "16px",
    zIndex: 40
  };
}
function getShortcutsBoxStyle() {
  return {
    backgroundColor: "rgba(20,20,22,0.97)",
    borderRadius: "14px",
    padding: "20px 24px",
    minWidth: "280px",
    maxHeight: "100%",
    overflowY: "auto",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10),0 16px 40px -12px rgba(0,0,0,0.7)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
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
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "12px",
    backgroundColor: "rgba(255,255,255,0.1)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
    borderRadius: "5px",
    padding: "3px 6px",
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
    backgroundColor: "rgba(255,255,255,0.55)",
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
    backgroundImage: `url("${escapeCssUrl(thumb.src)}")`,
    backgroundPosition: `-${frameIndex * thumb.width}px 0`,
    backgroundSize: `${thumb.width * thumb.count}px ${thumb.height}px`,
    backgroundRepeat: "no-repeat",
    borderRadius: "6px",
    outline: "1px solid rgba(255,255,255,0.18)",
    outlineOffset: "-1px",
    boxShadow: "0 8px 24px -8px rgba(0,0,0,0.8)",
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
    /* Menus grow from the control that opened them, never from nowhere */
    @keyframes vplayer-menu-in {
      from { opacity: 0; transform: scale(0.94) translateY(4px); }
      to   { opacity: 1; transform: none; }
    }
    [data-vplayer-menu] {
      animation: vplayer-menu-in 0.16s cubic-bezier(0.32, 0.72, 0, 1);
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.22) transparent;
    }
    /* Scoped to the menu \u2014 the page's own scrollbar is never touched */
    [data-vplayer-menu]::-webkit-scrollbar {
      width: 8px;
    }
    [data-vplayer-menu]::-webkit-scrollbar-track {
      background: transparent;
    }
    [data-vplayer-menu]::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.22);
      border-radius: 4px;
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
                  background-color 0.2s ease-out;
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
        transform: scale(1.05);
        background-color: rgba(28,28,34,0.52);
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
    /* 36\xD740 visual box bled out to 40\xD744; the 2px per side exactly consumes
       the 4px group gap, so neighbouring targets touch but never overlap. */
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
      [data-vplayer-retry]:hover {
        background-color: rgba(255,255,255,0.16);
      }
    }
    [data-vplayer-btn]:active,
    [data-vplayer-retry]:active {
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
      [data-vplayer-btn]:active,
      [data-vplayer-retry]:active {
        transform: none;
      }
      [data-vplayer-menu] {
        animation: none;
      }
    }
  `;
  document.head.appendChild(style);
}

// src/VPlayer.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var DEFAULT_POSTER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%23111' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='central' textAnchor='middle' fontFamily='system-ui' fontSize='48' fill='%23333'%3EVideo%3C/text%3E%3C/svg%3E";
var DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
var DEFAULT_HIDE_CONTROLS_DELAY = 3e3;
var HIDE_ON_LEAVE_DELAY = 800;
var VOLUME_STORAGE_KEY = "vplayer-volume";
var CAPTION_CONTROLS_GAP = 10;
var INLINE_LAYOUT_MIN_WIDTH = 580;
var VOLUME_SLIDER_MIN_WIDTH = 480;
var COMPACT_CONTROLS_MAX_WIDTH = 400;
function getShortcuts(seekStep, volumeStep) {
  return [
    ["Space / K", "Play / Pause"],
    ["\u2190 / \u2192", `Seek \xB1${seekStep}s`],
    ["Shift+\u2190 / \u2192", "Prev / Next chapter"],
    ["\u2191 / \u2193", `Volume \xB1${Math.round(volumeStep * 100)}%`],
    ["F", "Fullscreen"],
    ["M", "Mute"],
    ["0\u20139", "Seek to 0%\u201390%"],
    ["< / >", "Speed down / up"],
    ["?", "Toggle shortcuts"]
  ];
}
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
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react2.useLayoutEffect : import_react2.useEffect;
function matchesKey(key, binding) {
  if (!binding) return false;
  return Array.isArray(binding) ? binding.includes(key) : binding === key;
}
var VPlayerBase = (0, import_react2.forwardRef)(function VPlayer({
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
  keymap,
  playing,
  volume: volumeProp,
  playbackRate: playbackRateProp,
  playbackRates,
  seekStep = 5,
  volumeStep = 0.1,
  hideControlsDelay = DEFAULT_HIDE_CONTROLS_DELAY,
  showControls: forceShowControls = false,
  endTime,
  crossOrigin,
  disableRemotePlayback = false,
  disablePictureInPicture = false,
  captionStyle,
  controlsVariant = "classic",
  onReady,
  onStart,
  onRateChange,
  onDurationChange,
  onWaiting,
  onEnterPiP,
  onLeavePiP
}, ref) {
  const srcList = Array.isArray(src) ? src : [src];
  const isPlaylist = srcList.length > 1;
  const [internalIndex, setInternalIndex] = (0, import_react2.useState)(0);
  const isControlled = activeIndex !== void 0;
  const currentIndex = isControlled ? activeIndex : internalIndex;
  const setCurrentIndex = (0, import_react2.useCallback)(
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
  const activeSrc = srcList[currentIndex] ?? srcList[0] ?? "";
  const hasSource = typeof activeSrc === "string" && activeSrc.length > 0;
  const containerRef = (0, import_react2.useRef)(null);
  const videoRef = (0, import_react2.useRef)(null);
  const progressRef = (0, import_react2.useRef)(null);
  const hideTimerRef = (0, import_react2.useRef)(null);
  const isPlayingRef = (0, import_react2.useRef)(false);
  const hasStartedRef = (0, import_react2.useRef)(false);
  const milestonesFiredRef = (0, import_react2.useRef)(/* @__PURE__ */ new Set());
  const trackChangeRef = (0, import_react2.useRef)(null);
  const initialTimeAppliedRef = (0, import_react2.useRef)(false);
  const currentChapterRef = (0, import_react2.useRef)(null);
  const readyFiredRef = (0, import_react2.useRef)(false);
  const startFiredRef = (0, import_react2.useRef)(false);
  const endTimeFiredRef = (0, import_react2.useRef)(false);
  const clipEndPauseRef = (0, import_react2.useRef)(false);
  const dragCleanupRef = (0, import_react2.useRef)(null);
  const mediaSettingsRef = (0, import_react2.useRef)({ volume: 1, muted: false, rate: 1 });
  const prevPlayingRef = (0, import_react2.useRef)(void 0);
  const controlsBarRef = (0, import_react2.useRef)(null);
  const volumeBarRef = (0, import_react2.useRef)(null);
  const instanceId = (0, import_react2.useId)();
  const onSeekRef = (0, import_react2.useRef)(onSeek);
  (0, import_react2.useEffect)(() => {
    onSeekRef.current = onSeek;
  }, [onSeek]);
  const activeChapters = (0, import_react2.useMemo)(() => {
    if (!chapters) return void 0;
    if (chapters.length === 0) return void 0;
    if (Array.isArray(chapters[0]) && Array.isArray(chapters[0])) {
      const perTrack = chapters;
      return perTrack[currentIndex] ?? void 0;
    }
    if (isPlaylist) return currentIndex === 0 ? chapters : void 0;
    return chapters;
  }, [chapters, currentIndex, isPlaylist]);
  const parsed = parseVideoSource(activeSrc);
  const ratio = parseAspectRatio(aspectRatio);
  const isNative = parsed.type === "native";
  const resolvedKeymap = (0, import_react2.useMemo)(
    () => ({ ...DEFAULT_KEYMAP, ...keymap }),
    [keymap]
  );
  const resolvedRates = (0, import_react2.useMemo)(
    () => playbackRates && playbackRates.length > 0 ? playbackRates : DEFAULT_PLAYBACK_RATES,
    [playbackRates]
  );
  const [state, setState] = (0, import_react2.useState)(() => {
    let volume = muted ? 0 : 1;
    let isMuted = muted;
    if (persistVolume && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (stored !== null) {
          const vol = parseFloat(stored);
          if (isFinite(vol) && vol >= 0 && vol <= 1) {
            volume = vol;
            isMuted = muted || vol === 0;
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
  const [showSpeedMenu, setShowSpeedMenu] = (0, import_react2.useState)(false);
  const [showCCMenu, setShowCCMenu] = (0, import_react2.useState)(false);
  const [isVolumeDragging, setIsVolumeDragging] = (0, import_react2.useState)(false);
  const [volumeHover, setVolumeHover] = (0, import_react2.useState)(false);
  const [showShortcuts, setShowShortcuts] = (0, import_react2.useState)(false);
  const [hoverProgress, setHoverProgress] = (0, import_react2.useState)(null);
  const [isDragging, setIsDragging] = (0, import_react2.useState)(false);
  const [embedStarted, setEmbedStarted] = (0, import_react2.useState)(false);
  const [supportsPip, setSupportsPip] = (0, import_react2.useState)(false);
  const [activeTrack, setActiveTrack] = (0, import_react2.useState)(null);
  const [hlsUnsupported, setHlsUnsupported] = (0, import_react2.useState)(false);
  const [activeCues, setActiveCues] = (0, import_react2.useState)([]);
  const [nativeFullscreen, setNativeFullscreen] = (0, import_react2.useState)(false);
  const [metrics, setMetrics] = (0, import_react2.useState)({ box: null, lift: 0, width: 0 });
  (0, import_react2.useEffect)(() => {
    injectKeyframes();
    setSupportsPip(!!document.pictureInPictureEnabled);
  }, []);
  (0, import_react2.useEffect)(() => {
    if (!parsed.isHls) {
      setHlsUnsupported(false);
      return;
    }
    const probe = document.createElement("video");
    setHlsUnsupported(
      probe.canPlayType("application/vnd.apple.mpegurl") === "" && probe.canPlayType("application/x-mpegURL") === ""
    );
  }, [parsed.isHls]);
  const pendingVolumeWriteRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    if (!persistVolume) return;
    pendingVolumeWriteRef.current = String(state.isMuted ? 0 : state.volume);
    const id = setTimeout(() => {
      try {
        if (pendingVolumeWriteRef.current !== null) {
          localStorage.setItem(VOLUME_STORAGE_KEY, pendingVolumeWriteRef.current);
        }
      } catch {
      }
      pendingVolumeWriteRef.current = null;
    }, 250);
    return () => clearTimeout(id);
  }, [persistVolume, state.volume, state.isMuted]);
  (0, import_react2.useEffect)(() => {
    return () => {
      if (pendingVolumeWriteRef.current !== null) {
        try {
          localStorage.setItem(VOLUME_STORAGE_KEY, pendingVolumeWriteRef.current);
        } catch {
        }
      }
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);
  (0, import_react2.useEffect)(() => {
    hasStartedRef.current = state.hasStarted;
  }, [state.hasStarted]);
  (0, import_react2.useEffect)(() => {
    mediaSettingsRef.current = {
      volume: state.volume,
      muted: state.isMuted,
      rate: state.playbackRate
    };
  }, [state.volume, state.isMuted, state.playbackRate]);
  const resetHideTimer = (0, import_react2.useCallback)(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setState((s) => s.showControls ? s : { ...s, showControls: true });
    if (!forceShowControls && isPlayingRef.current && hasStartedRef.current) {
      hideTimerRef.current = setTimeout(() => {
        if (controlsBarRef.current?.contains(document.activeElement)) return;
        setState((s) => ({ ...s, showControls: false }));
        setShowSpeedMenu(false);
      }, hideControlsDelay);
    }
  }, [forceShowControls, hideControlsDelay]);
  (0, import_react2.useEffect)(() => {
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
  (0, import_react2.useEffect)(() => {
    const change = trackChangeRef.current;
    trackChangeRef.current = null;
    const wasPlaying = isPlayingRef.current;
    setState((s) => ({
      ...s,
      currentTime: 0,
      duration: 0,
      // Moving through a playlist must not drop the player back to its poster:
      // the control bar renders on `hasStarted`, so resetting it mid-playlist
      // tore the bar down and stranded the viewer on a play button.
      hasStarted: change !== null,
      isPlaying: false,
      buffered: 0,
      isLoading: false,
      error: null
    }));
    milestonesFiredRef.current = /* @__PURE__ */ new Set();
    currentChapterRef.current = null;
    readyFiredRef.current = false;
    startFiredRef.current = false;
    endTimeFiredRef.current = false;
    clipEndPauseRef.current = false;
    prevPlayingRef.current = void 0;
    setActiveTrack(null);
    setEmbedStarted(false);
    if (change === "auto" || change === "manual" && wasPlaying) {
      const v = videoRef.current;
      if (v) {
        setState((s) => ({ ...s, isLoading: true }));
        v.play().catch(
          () => setState((s) => ({ ...s, isPlaying: false, isLoading: false }))
        );
      }
    }
  }, [activeSrc]);
  const defaultTrackAppliedRef = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    if (defaultTrackAppliedRef.current || !tracks?.length) return;
    defaultTrackAppliedRef.current = true;
    const defaultIdx = tracks.findIndex((t) => t.default);
    if (defaultIdx !== -1) setActiveTrack(defaultIdx);
  }, [tracks]);
  const trackMode = nativeFullscreen ? "showing" : "hidden";
  (0, import_react2.useEffect)(() => {
    const v = videoRef.current;
    if (!v || !v.textTracks) return;
    const list = v.textTracks;
    const applyModes = () => {
      for (let i = 0; i < list.length; i++) {
        list[i].mode = i === activeTrack ? trackMode : "disabled";
      }
    };
    applyModes();
    if (typeof list.addEventListener !== "function") return;
    list.addEventListener("change", applyModes);
    return () => {
      list.removeEventListener("change", applyModes);
    };
  }, [activeTrack, trackMode, tracks]);
  (0, import_react2.useEffect)(() => {
    setActiveCues([]);
    const v = videoRef.current;
    if (!v || !v.textTracks || activeTrack === null) return;
    const track = v.textTracks[activeTrack];
    if (!track) return;
    const readCues = () => {
      const cues = track.activeCues;
      if (!cues || cues.length === 0) {
        setActiveCues((prev) => prev.length === 0 ? prev : []);
        return;
      }
      const next = [];
      for (let i = 0; i < cues.length; i++) next.push(snapshotCue(cues[i], i));
      setActiveCues(next);
    };
    readCues();
    if (typeof track.addEventListener !== "function") return;
    track.addEventListener("cuechange", readCues);
    return () => {
      track.removeEventListener("cuechange", readCues);
    };
  }, [activeTrack, activeSrc, tracks]);
  (0, import_react2.useEffect)(() => {
    const v = videoRef.current;
    if (!v) return;
    const onBegin = () => setNativeFullscreen(true);
    const onEnd = () => setNativeFullscreen(false);
    v.addEventListener("webkitbeginfullscreen", onBegin);
    v.addEventListener("webkitendfullscreen", onEnd);
    return () => {
      v.removeEventListener("webkitbeginfullscreen", onBegin);
      v.removeEventListener("webkitendfullscreen", onEnd);
    };
  }, [isNative, hasSource]);
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const container2 = containerRef.current;
      if (!container2) return;
      const width2 = container2.clientWidth;
      let box = null;
      let lift = 0;
      const v2 = videoRef.current;
      if (v2) {
        box = getVideoContentBox(v2);
        const bar2 = controlsBarRef.current;
        if (bar2) {
          const videoRect = v2.getBoundingClientRect();
          const barRect = bar2.getBoundingClientRect();
          const padTop = parseFloat(window.getComputedStyle(bar2).paddingTop) || 0;
          const overlap = videoRect.top + box.top + box.height - (barRect.top + padTop);
          if (overlap > 0) {
            lift = Math.round(
              Math.min(overlap + CAPTION_CONTROLS_GAP, box.height / 2)
            );
          }
        }
      }
      setMetrics(
        (prev) => prev.width === width2 && prev.lift === lift && sameContentBox(prev.box, box) ? prev : { width: width2, lift, box }
      );
    };
    measure();
    const container = containerRef.current;
    const v = videoRef.current;
    const bar = controlsBarRef.current;
    v?.addEventListener("loadedmetadata", measure);
    v?.addEventListener("resize", measure);
    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      if (container) observer.observe(container);
      if (v) observer.observe(v);
      if (bar) observer.observe(bar);
    } else if (typeof window !== "undefined") {
      window.addEventListener("resize", measure);
    }
    return () => {
      v?.removeEventListener("loadedmetadata", measure);
      v?.removeEventListener("resize", measure);
      observer?.disconnect();
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", measure);
      }
    };
  }, [
    isNative,
    hasSource,
    activeSrc,
    state.hasStarted,
    state.isFullscreen,
    controlsVariant,
    isPlaylist
  ]);
  (0, import_react2.useEffect)(() => {
    const v = videoRef.current;
    if (!v) return;
    const handleEnter = () => onEnterPiP?.();
    const handleLeave = () => onLeavePiP?.();
    v.addEventListener("enterpictureinpicture", handleEnter);
    v.addEventListener("leavepictureinpicture", handleLeave);
    return () => {
      v.removeEventListener("enterpictureinpicture", handleEnter);
      v.removeEventListener("leavepictureinpicture", handleLeave);
    };
  }, [onEnterPiP, onLeavePiP, isNative, hasSource]);
  (0, import_react2.useEffect)(() => {
    const v = videoRef.current;
    if (!v) return;
    if ("disableRemotePlayback" in v) v.disableRemotePlayback = disableRemotePlayback;
    if ("disablePictureInPicture" in v) v.disablePictureInPicture = disablePictureInPicture;
  }, [disableRemotePlayback, disablePictureInPicture, isNative, hasSource]);
  (0, import_react2.useEffect)(() => {
    if (playing === void 0 || playing === prevPlayingRef.current) {
      prevPlayingRef.current = playing;
      return;
    }
    prevPlayingRef.current = playing;
    const v = videoRef.current;
    if (!v || !isNative) return;
    if (playing) {
      setState((s) => ({ ...s, hasStarted: true }));
      v.play().catch(() => setState((s) => ({ ...s, isPlaying: false })));
    } else {
      v.pause();
    }
  }, [playing, isNative, activeSrc]);
  (0, import_react2.useEffect)(() => {
    if (volumeProp === void 0) return;
    const vol = clamp(volumeProp, 0, 1);
    const v = videoRef.current;
    if (v) {
      v.volume = vol;
      if (vol === 0) v.muted = true;
    }
    setState((s) => ({
      ...s,
      volume: vol,
      isMuted: vol === 0 ? true : s.isMuted
    }));
  }, [volumeProp]);
  const prevMutedRef = (0, import_react2.useRef)(muted);
  (0, import_react2.useEffect)(() => {
    if (muted === prevMutedRef.current) return;
    prevMutedRef.current = muted;
    setState((s) => ({ ...s, isMuted: muted }));
  }, [muted]);
  (0, import_react2.useEffect)(() => {
    if (playbackRateProp === void 0) return;
    const v = videoRef.current;
    if (v) v.playbackRate = playbackRateProp;
    setState((s) => ({ ...s, playbackRate: playbackRateProp }));
  }, [playbackRateProp]);
  (0, import_react2.useEffect)(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);
  const anyMenuOpen = showSpeedMenu || showCCMenu;
  const closeMenus = (0, import_react2.useCallback)(() => {
    setShowSpeedMenu(false);
    setShowCCMenu(false);
  }, []);
  const prevMenuOpenRef = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    const wasOpen = prevMenuOpenRef.current;
    prevMenuOpenRef.current = anyMenuOpen;
    if (wasOpen && !anyMenuOpen) {
      const c = containerRef.current;
      if (c && !c.contains(document.activeElement)) {
        c.focus({ preventScroll: true });
      }
    }
  }, [anyMenuOpen]);
  const handleLoadedMetadata = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    if (initialTime && initialTime > 0 && !initialTimeAppliedRef.current && initialTime < v.duration) {
      v.currentTime = initialTime;
      initialTimeAppliedRef.current = true;
    }
    const settings = mediaSettingsRef.current;
    v.volume = settings.volume;
    if (v.playbackRate !== settings.rate) v.playbackRate = settings.rate;
    setState((s) => ({
      ...s,
      // Live streams report Infinity; keep state.duration finite
      duration: isFinite(v.duration) ? v.duration : 0,
      currentTime: v.currentTime,
      isLoading: false
    }));
  }, [initialTime]);
  const handleTimeUpdate = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      currentTime: v.currentTime,
      // Fallback: pick up duration if it wasn't captured by loadedmetadata/durationchange
      duration: s.duration > 0 ? s.duration : isFinite(v.duration) ? v.duration : 0
    }));
    onTimeUpdate?.(v.currentTime, v.duration);
    if (endTime && endTime > 0) {
      if (!endTimeFiredRef.current && v.currentTime >= endTime) {
        endTimeFiredRef.current = true;
        clipEndPauseRef.current = true;
        v.pause();
        onEnded?.();
      } else if (endTimeFiredRef.current && v.currentTime < endTime - 1) {
        endTimeFiredRef.current = false;
      }
    }
    if (onMilestone && v.duration > 0) {
      const pct = v.currentTime / v.duration * 100;
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !milestonesFiredRef.current.has(milestone)) {
          milestonesFiredRef.current.add(milestone);
          onMilestone(milestone);
        }
      }
    }
    if (onChapterChange && activeChapters && activeChapters.length > 0 && v.duration > 0) {
      let current = null;
      for (let i = activeChapters.length - 1; i >= 0; i--) {
        if (v.currentTime >= activeChapters[i].time) {
          current = activeChapters[i];
          break;
        }
      }
      const currentLabel = current?.label ?? null;
      if (currentLabel !== currentChapterRef.current) {
        currentChapterRef.current = currentLabel;
        onChapterChange(current);
      }
    }
  }, [onTimeUpdate, onMilestone, onChapterChange, activeChapters, endTime, onEnded]);
  const handleProgress = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v || v.buffered.length === 0) return;
    const end = v.buffered.end(v.buffered.length - 1);
    const pct = v.duration ? end / v.duration * 100 : 0;
    setState((s) => ({ ...s, buffered: pct }));
    onBuffer?.(pct);
  }, [onBuffer]);
  const handleWaiting = (0, import_react2.useCallback)(() => {
    setState((s) => ({ ...s, isLoading: true }));
    onWaiting?.();
  }, [onWaiting]);
  const handleDurationChange = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    setState((s) => ({ ...s, duration: v.duration }));
    onDurationChange?.(v.duration);
  }, [onDurationChange]);
  const handleCanPlay = (0, import_react2.useCallback)(() => {
    setState((s) => ({ ...s, isLoading: false }));
    if (!readyFiredRef.current) {
      readyFiredRef.current = true;
      onReady?.();
    }
  }, [onReady]);
  const handleVideoPlay = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (endTime && endTimeFiredRef.current && v && v.currentTime >= endTime) {
      v.currentTime = initialTime && initialTime < endTime ? initialTime : 0;
      endTimeFiredRef.current = false;
    }
    isPlayingRef.current = true;
    hasStartedRef.current = true;
    setState((s) => ({ ...s, isPlaying: true, hasStarted: true }));
    if (!startFiredRef.current) {
      startFiredRef.current = true;
      onStart?.();
    }
    onPlay?.();
    resetHideTimer();
  }, [onPlay, onStart, resetHideTimer, endTime, initialTime]);
  const handleVideoPause = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    isPlayingRef.current = false;
    setState((s) => ({ ...s, isPlaying: false, showControls: true }));
    if (v?.ended) return;
    if (clipEndPauseRef.current) {
      clipEndPauseRef.current = false;
      return;
    }
    onPause?.();
  }, [onPause]);
  const handleRateChangeEvent = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    setState(
      (s) => s.playbackRate === v.playbackRate ? s : { ...s, playbackRate: v.playbackRate }
    );
    onRateChange?.(v.playbackRate);
  }, [onRateChange]);
  const handleError = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    const error = v.error ?? null;
    setState((s) => ({ ...s, error, isLoading: false }));
    onError?.(error);
  }, [onError]);
  const handleVideoEnded = (0, import_react2.useCallback)(() => {
    if (onMilestone && !milestonesFiredRef.current.has(100)) {
      milestonesFiredRef.current.add(100);
      onMilestone(100);
    }
    if (isPlaylist && currentIndex < srcList.length - 1) {
      trackChangeRef.current = "auto";
      setCurrentIndex((i) => i + 1);
      onNext?.();
    } else if (isPlaylist && loopPlaylist) {
      trackChangeRef.current = "auto";
      setCurrentIndex(0);
      onNext?.();
    } else {
      setState((s) => ({ ...s, isPlaying: false, showControls: true }));
      onEnded?.();
    }
  }, [isPlaylist, currentIndex, srcList.length, loopPlaylist, onNext, onEnded, onMilestone]);
  const togglePlay = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setState((s) => ({ ...s, hasStarted: true }));
      v.play().catch(() => {
        setState((s) => ({ ...s, isPlaying: false }));
      });
    } else {
      v.pause();
    }
  }, []);
  const startPlayback = (0, import_react2.useCallback)(() => {
    if (!hasSource || parsed.isHls && hlsUnsupported) return;
    if (!isNative) {
      setEmbedStarted(true);
      setState((s) => ({ ...s, hasStarted: true }));
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({ ...s, hasStarted: true }));
    v.play().catch(() => {
      setState((s) => ({ ...s, isPlaying: false }));
    });
  }, [isNative, hasSource, parsed.isHls, hlsUnsupported]);
  const handleProgressClick = (0, import_react2.useCallback)(
    (e) => {
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar || !isFinite(v.duration)) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      v.currentTime = pct * v.duration;
      setState((s) => ({ ...s, currentTime: v.currentTime }));
      onSeek?.(v.currentTime);
    },
    [onSeek]
  );
  const handleProgressMouseDown = (0, import_react2.useCallback)(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;
      const seekTo = (clientX) => {
        if (!isFinite(v.duration)) return;
        const rect = bar.getBoundingClientRect();
        const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      };
      seekTo(e.clientX);
      const onMove = (ev) => seekTo(ev.clientX);
      const onUp = () => {
        setIsDragging(false);
        onSeekRef.current?.(v.currentTime);
        removeListeners();
      };
      const removeListeners = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        dragCleanupRef.current = null;
      };
      dragCleanupRef.current = removeListeners;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [onSeek]
  );
  (0, import_react2.useEffect)(() => {
    const bar = progressRef.current;
    if (!bar) return;
    let activeDragCleanup = null;
    const onTouchStart = (e) => {
      e.preventDefault();
      activeDragCleanup?.();
      setIsDragging(true);
      const v = videoRef.current;
      if (!v) return;
      const seekTo = (clientX) => {
        if (!isFinite(v.duration)) return;
        const rect = bar.getBoundingClientRect();
        const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      };
      const touch = e.touches[0];
      if (touch) seekTo(touch.clientX);
      const onMove = (ev) => {
        const t = ev.touches[0];
        if (t) seekTo(t.clientX);
      };
      const cleanup = () => {
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
        if (activeDragCleanup === cleanup) activeDragCleanup = null;
      };
      const onEnd = () => {
        setIsDragging(false);
        onSeekRef.current?.(v.currentTime);
        cleanup();
      };
      activeDragCleanup = cleanup;
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
      window.addEventListener("touchcancel", onEnd);
    };
    bar.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => {
      bar.removeEventListener("touchstart", onTouchStart);
      activeDragCleanup?.();
    };
  }, [isNative, hasSource, state.hasStarted]);
  const handleProgressHover = (0, import_react2.useCallback)(
    (e) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp((e.clientX - rect.left) / rect.width * 100, 0, 100);
      setHoverProgress(pct);
    },
    []
  );
  const setVolumeLevel = (0, import_react2.useCallback)(
    (vol) => {
      const v = videoRef.current;
      const level = clamp(vol, 0, 1);
      if (v) {
        v.volume = level;
        v.muted = level === 0;
      }
      setState((s) => ({ ...s, volume: level, isMuted: level === 0 }));
      onVolumeChange?.(level, level === 0);
    },
    [onVolumeChange]
  );
  const toggleMute = (0, import_react2.useCallback)(() => {
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
  const handleVolumePointerDown = (0, import_react2.useCallback)(
    (e) => {
      const bar = volumeBarRef.current;
      if (!bar) return;
      e.preventDefault();
      const apply = (clientX) => {
        const rect = bar.getBoundingClientRect();
        if (rect.width === 0) return;
        setVolumeLevel((clientX - rect.left) / rect.width);
      };
      apply(e.clientX);
      setIsVolumeDragging(true);
      bar.setPointerCapture?.(e.pointerId);
      const onMove = (ev) => apply(ev.clientX);
      const onUp = (ev) => {
        setIsVolumeDragging(false);
        bar.releasePointerCapture?.(ev.pointerId);
        bar.removeEventListener("pointermove", onMove);
        bar.removeEventListener("pointerup", onUp);
        bar.removeEventListener("pointercancel", onUp);
      };
      bar.addEventListener("pointermove", onMove);
      bar.addEventListener("pointerup", onUp);
      bar.addEventListener("pointercancel", onUp);
    },
    [setVolumeLevel]
  );
  const toggleFullscreen = (0, import_react2.useCallback)(() => {
    const c = containerRef.current;
    const v = videoRef.current;
    const doc = document;
    if (!c) return;
    if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
      if (c.requestFullscreen) {
        c.requestFullscreen().catch(() => {
        });
      } else if (c.webkitRequestFullscreen) {
        c.webkitRequestFullscreen();
      } else if (v?.webkitEnterFullscreen) {
        v.webkitEnterFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
      });
    } else {
      doc.webkitExitFullscreen?.();
    }
  }, []);
  const togglePip = (0, import_react2.useCallback)(async () => {
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
  const setPlaybackRate = (0, import_react2.useCallback)((rate) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setState((s) => ({ ...s, playbackRate: rate }));
    setShowSpeedMenu(false);
  }, []);
  const handleFocus = (0, import_react2.useCallback)(() => {
    setState((s) => ({ ...s, isFocused: true }));
  }, []);
  const handleBlur = (0, import_react2.useCallback)((e) => {
    if (containerRef.current?.contains(e.relatedTarget)) return;
    setState((s) => ({ ...s, isFocused: false }));
    setShowSpeedMenu(false);
    setShowCCMenu(false);
  }, []);
  const stepPlaybackRate = (0, import_react2.useCallback)(
    (dir) => {
      const current = state.playbackRate;
      const idx = resolvedRates.indexOf(current);
      let next;
      if (idx !== -1) {
        next = resolvedRates[idx + dir];
      } else if (dir === 1) {
        next = resolvedRates.find((r) => r > current);
      } else {
        next = [...resolvedRates].reverse().find((r) => r < current);
      }
      if (next !== void 0) setPlaybackRate(next);
    },
    [state.playbackRate, resolvedRates, setPlaybackRate]
  );
  const handleKeyDown = (0, import_react2.useCallback)(
    (e) => {
      if (!state.isFocused || !isNative) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const v = videoRef.current;
      if (!v) return;
      if (e.shiftKey && e.key === "ArrowLeft" && activeChapters && activeChapters.length > 0) {
        e.preventDefault();
        const target = [...activeChapters].reverse().find((ch) => ch.time < v.currentTime - 2);
        v.currentTime = target ? target.time : 0;
        resetHideTimer();
        return;
      }
      if (e.shiftKey && e.key === "ArrowRight" && activeChapters && activeChapters.length > 0) {
        e.preventDefault();
        const target = activeChapters.find((ch) => ch.time > v.currentTime + 0.5);
        if (target) v.currentTime = target.time;
        resetHideTimer();
        return;
      }
      if (matchesKey(e.key, resolvedKeymap.play)) {
        e.preventDefault();
        togglePlay();
      } else if (matchesKey(e.key, resolvedKeymap.seekBack)) {
        e.preventDefault();
        v.currentTime = Math.max(0, v.currentTime - seekStep);
      } else if (matchesKey(e.key, resolvedKeymap.seekForward)) {
        e.preventDefault();
        v.currentTime = Math.min(v.duration || Infinity, v.currentTime + seekStep);
      } else if (matchesKey(e.key, resolvedKeymap.volumeUp)) {
        e.preventDefault();
        setVolumeLevel((state.isMuted ? 0 : state.volume) + volumeStep);
      } else if (matchesKey(e.key, resolvedKeymap.volumeDown)) {
        e.preventDefault();
        setVolumeLevel((state.isMuted ? 0 : state.volume) - volumeStep);
      } else if (matchesKey(e.key, resolvedKeymap.fullscreen)) {
        e.preventDefault();
        toggleFullscreen();
      } else if (matchesKey(e.key, resolvedKeymap.mute)) {
        e.preventDefault();
        toggleMute();
      } else if (matchesKey(e.key, resolvedKeymap.speedDown)) {
        e.preventDefault();
        stepPlaybackRate(-1);
      } else if (matchesKey(e.key, resolvedKeymap.speedUp)) {
        e.preventDefault();
        stepPlaybackRate(1);
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
        if (isFinite(v.duration)) {
          v.currentTime = parseInt(e.key) / 10 * v.duration;
        }
      }
      resetHideTimer();
    },
    [
      state.isFocused,
      state.volume,
      state.isMuted,
      isNative,
      resolvedKeymap,
      togglePlay,
      toggleFullscreen,
      toggleMute,
      stepPlaybackRate,
      setVolumeLevel,
      seekStep,
      volumeStep,
      resetHideTimer,
      activeChapters
    ]
  );
  const handleProgressKeyDown = (0, import_react2.useCallback)(
    (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const v = videoRef.current;
      if (!v) return;
      let handled = true;
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          v.currentTime = Math.max(0, v.currentTime - seekStep);
          break;
        case "ArrowRight":
        case "ArrowUp":
          v.currentTime = Math.min(v.duration || Infinity, v.currentTime + seekStep);
          break;
        case "Home":
          v.currentTime = 0;
          break;
        case "End":
          if (isFinite(v.duration)) v.currentTime = v.duration;
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        onSeek?.(v.currentTime);
        resetHideTimer();
      }
    },
    [seekStep, onSeek, resetHideTimer]
  );
  const handleVolumeKeyDown = (0, import_react2.useCallback)(
    (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const current = state.isMuted ? 0 : state.volume;
      let handled = true;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight":
          setVolumeLevel(current + volumeStep);
          break;
        case "ArrowDown":
        case "ArrowLeft":
          setVolumeLevel(current - volumeStep);
          break;
        case "Home":
          setVolumeLevel(0);
          break;
        case "End":
          setVolumeLevel(1);
          break;
        default:
          handled = false;
      }
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
        resetHideTimer();
      }
    },
    [state.isMuted, state.volume, volumeStep, setVolumeLevel, resetHideTimer]
  );
  const handleMouseMove = (0, import_react2.useCallback)(() => {
    resetHideTimer();
  }, [resetHideTimer]);
  const handleMouseLeave = (0, import_react2.useCallback)(() => {
    if (!forceShowControls && isPlayingRef.current) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, showControls: false }));
        setShowSpeedMenu(false);
      }, HIDE_ON_LEAVE_DELAY);
    }
    setHoverProgress(null);
  }, [forceShowControls]);
  const progress = state.duration > 0 ? state.currentTime / state.duration * 100 : 0;
  const thumbFrame = previewThumbnails && hoverProgress !== null ? Math.min(
    Math.floor(hoverProgress / 100 * previewThumbnails.count),
    previewThumbnails.count - 1
  ) : null;
  const nearChapter = activeChapters && hoverProgress !== null ? activeChapters.find(
    (ch) => state.duration > 0 && Math.abs(ch.time / state.duration * 100 - hoverProgress) < 2
  ) : void 0;
  const posterUrl = poster || DEFAULT_POSTER;
  const showPoster = !state.hasStarted;
  const hlsError = !!parsed.isHls && hlsUnsupported;
  const hasError = !!state.error || hlsError || !hasSource;
  const errorCopy = !hasError ? null : !hasSource ? {
    title: "No video to play",
    detail: "This player was rendered without a source.",
    canRetry: false
  } : hlsError ? {
    title: "This browser can\u2019t play HLS",
    detail: "Live and adaptive streams need Safari, iOS, or a browser with native HLS support.",
    canRetry: false
  } : state.error?.code === 2 ? {
    title: "The connection dropped",
    detail: "Loading stopped partway through. Check your connection and try again.",
    canRetry: true
  } : state.error?.code === 3 ? {
    title: "This video couldn\u2019t be decoded",
    detail: "The file may be damaged, or it uses a codec this browser doesn\u2019t support.",
    canRetry: true
  } : {
    title: "This video couldn\u2019t be loaded",
    detail: "The file may be missing, blocked by the server, or in a format this browser can\u2019t play.",
    canRetry: true
  };
  const retryPlayback = (0, import_react2.useCallback)(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((st) => ({ ...st, error: null, isLoading: true }));
    v.load();
    v.play().catch(() => setState((st) => ({ ...st, isPlaying: false, isLoading: false })));
  }, []);
  const controlsVisible = forceShowControls || state.showControls || !state.isPlaying || isDragging || showSpeedMenu || showCCMenu || isVolumeDragging;
  const layoutVariant = controlsVariant !== "classic" && metrics.width < INLINE_LAYOUT_MIN_WIDTH ? "classic" : controlsVariant;
  const inlineLayout = layoutVariant !== "classic";
  const showVolumeSlider = metrics.width >= VOLUME_SLIDER_MIN_WIDTH;
  const compactControls = metrics.width > 0 && metrics.width < COMPACT_CONTROLS_MAX_WIDTH;
  const captionFontSize = getCaptionFontSize(metrics.box?.height ?? 0);
  const topCues = activeCues.filter((c) => c.region === "top");
  const bottomCues = activeCues.filter((c) => c.region === "bottom");
  const showCaptions = isNative && !nativeFullscreen && !!metrics.box && activeCues.length > 0;
  const captionLift = controlsVisible ? metrics.lift : 0;
  const renderCues = (cues, region) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-vplayer-caption-region": "",
      style: getCaptionRegionStyle(
        region,
        region === "bottom" ? captionLift : 0,
        captionFontSize
      ),
      children: cues.map((cue) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "span",
        {
          "data-vplayer-cue": "",
          style: getCaptionCueStyle(cue.align, captionStyle),
          children: cue.content
        },
        cue.key
      ))
    }
  );
  const VolumeIcon = state.isMuted ? VolumeMuteIcon : state.volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
  const buttonStyle = getControlButtonStyle(layoutVariant);
  const timeStyle = getTimeDisplayStyle(layoutVariant);
  const remainingTime = Math.max(0, state.duration - state.currentTime);
  const playButton = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      type: "button",
      "data-vplayer-btn": "",
      style: getPlayToggleStyle(layoutVariant),
      onClick: togglePlay,
      "aria-label": state.isPlaying ? "Pause" : "Play",
      children: state.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PauseIcon, { size: 20, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        PlayIcon,
        {
          size: 20,
          color: iconColor,
          style: { transform: "translateX(1px)" }
        }
      )
    }
  );
  const playlistButtons = isPlaylist ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
    currentIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        "data-vplayer-btn": "",
        style: buttonStyle,
        onClick: () => {
          trackChangeRef.current = "manual";
          setCurrentIndex((i) => i - 1);
          onPrev?.();
        },
        "aria-label": "Previous video",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PrevIcon, { size: 20, color: iconColor })
      }
    ),
    currentIndex < srcList.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        "data-vplayer-btn": "",
        style: buttonStyle,
        onClick: () => {
          trackChangeRef.current = "manual";
          setCurrentIndex((i) => i + 1);
          onNext?.();
        },
        "aria-label": "Next video",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(NextIcon, { size: 20, color: iconColor })
      }
    )
  ] }) : null;
  const volumeLevel = state.isMuted ? 0 : state.volume;
  const volumeActive = isVolumeDragging || volumeHover;
  const volumeControl = /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getVolumeSliderContainerStyle(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        "data-vplayer-btn": "",
        style: buttonStyle,
        onClick: toggleMute,
        "aria-label": state.isMuted ? "Unmute" : "Mute",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(VolumeIcon, { size: 20, color: iconColor })
      }
    ),
    showVolumeSlider && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "div",
      {
        ref: volumeBarRef,
        style: getVolumeSliderStyle(),
        onPointerDown: handleVolumePointerDown,
        onKeyDown: handleVolumeKeyDown,
        onPointerEnter: () => setVolumeHover(true),
        onPointerLeave: () => setVolumeHover(false),
        onFocus: () => setVolumeHover(true),
        onBlur: () => setVolumeHover(false),
        role: "slider",
        "aria-label": "Volume",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": Math.round(volumeLevel * 100),
        "aria-valuetext": `${Math.round(volumeLevel * 100)}% volume`,
        tabIndex: 0,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getVolumeTrackStyle(), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getVolumeFillStyle(volumeLevel, volumeActive) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getVolumeThumbStyle(volumeLevel, volumeActive) })
        ]
      }
    )
  ] });
  const progressBar = /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      ref: progressRef,
      style: getProgressContainerStyle(layoutVariant),
      onClick: handleProgressClick,
      onMouseDown: handleProgressMouseDown,
      onMouseMove: handleProgressHover,
      onMouseLeave: () => setHoverProgress(null),
      onKeyDown: handleProgressKeyDown,
      role: "slider",
      "aria-label": "Seek",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(progress),
      "aria-valuetext": `${formatTime(state.currentTime)} of ${formatTime(state.duration)}`,
      tabIndex: 0,
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
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getProgressFillStyle(progress, accentColor) }),
              activeChapters && state.duration > 0 && activeChapters.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "div",
                {
                  style: getChapterMarkerStyle(ch.time / state.duration * 100)
                },
                i
              ))
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
        thumbFrame !== null && previewThumbnails && hoverProgress !== null && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            style: getPreviewThumbnailStyle(
              hoverProgress,
              previewThumbnails,
              thumbFrame
            )
          }
        ),
        hoverProgress !== null && state.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getTooltipStyle(hoverProgress), children: nearChapter?.label ?? formatTime(hoverProgress / 100 * state.duration) })
      ]
    }
  );
  const rightGroup = /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
    tracks && tracks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getMenuAnchorStyle(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          "data-vplayer-btn": "",
          style: buttonStyle,
          onClick: () => {
            setShowSpeedMenu(false);
            setShowCCMenu((open) => !open);
          },
          "aria-label": "Captions",
          "aria-haspopup": "menu",
          "aria-expanded": showCCMenu,
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            CCIcon,
            {
              size: 20,
              color: activeTrack !== null ? accentColor : iconColor
            }
          )
        }
      ),
      showCCMenu && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { "data-vplayer-menu": "", style: getMenuPanelStyle(), role: "menu", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            role: "menuitemradio",
            "aria-checked": activeTrack === null,
            "data-vplayer-menu-item": "",
            autoFocus: activeTrack === null,
            style: getSpeedMenuItemStyle(activeTrack === null, accentColor),
            onClick: () => {
              setActiveTrack(null);
              setShowCCMenu(false);
            },
            children: "Off"
          }
        ),
        tracks.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "button",
          {
            type: "button",
            role: "menuitemradio",
            "aria-checked": activeTrack === i,
            "data-vplayer-menu-item": "",
            autoFocus: activeTrack === i,
            style: getSpeedMenuItemStyle(activeTrack === i, accentColor),
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
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getMenuAnchorStyle(), children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          "data-vplayer-btn": "",
          style: getSpeedButtonStyle(layoutVariant, state.playbackRate === 1),
          onClick: () => {
            setShowCCMenu(false);
            setShowSpeedMenu((open) => !open);
          },
          "aria-label": `Playback speed: ${state.playbackRate}\xD7`,
          "aria-haspopup": "menu",
          "aria-expanded": showSpeedMenu,
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "span",
            {
              style: state.playbackRate === 1 ? void 0 : { color: accentColor },
              children: [
                state.playbackRate,
                "\xD7"
              ]
            }
          )
        }
      ),
      showSpeedMenu && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-vplayer-menu": "", style: getMenuPanelStyle(), role: "menu", children: resolvedRates.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          role: "menuitemradio",
          "aria-checked": state.playbackRate === rate,
          "data-vplayer-menu-item": "",
          autoFocus: state.playbackRate === rate,
          style: getSpeedMenuItemStyle(
            state.playbackRate === rate,
            accentColor
          ),
          onClick: () => setPlaybackRate(rate),
          children: rate === 1 ? "Normal" : `${rate}\xD7`
        },
        rate
      )) })
    ] }),
    supportsPip && !disablePictureInPicture && !compactControls && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        "data-vplayer-btn": "",
        style: buttonStyle,
        onClick: togglePip,
        "aria-label": "Picture in picture",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PipIcon, { size: 20, color: iconColor })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        type: "button",
        "data-vplayer-btn": "",
        style: buttonStyle,
        onClick: toggleFullscreen,
        "aria-label": state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen",
        children: state.isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ExitFullscreenIcon, { size: 20, color: iconColor }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FullscreenIcon, { size: 20, color: iconColor })
      }
    )
  ] });
  (0, import_react2.useImperativeHandle)(
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
      setVolume: (volume) => setVolumeLevel(volume),
      toggleMute: () => toggleMute(),
      toggleFullscreen: () => toggleFullscreen(),
      getVideoElement: () => videoRef.current
    }),
    [state.volume, toggleMute, toggleFullscreen, setVolumeLevel]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      ref: containerRef,
      className,
      "data-vplayer-root": "",
      "data-vplayer-id": instanceId,
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
      children: [
        captionStyle && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("style", { children: `[data-vplayer-id="${instanceId}"] video::cue {` + (captionStyle.color ? `color:${captionStyle.color};` : "") + (captionStyle.background ? `background-color:${captionStyle.background};` : "") + (captionStyle.fontSize ? `font-size:${captionStyle.fontSize};` : "") + (captionStyle.fontFamily ? `font-family:${captionStyle.fontFamily};` : "") + `}` }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { "data-vplayer-aspect": "", style: getAspectBoxStyle(ratio), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { "data-vplayer-inner": "", style: getInnerStyle(), children: [
          isNative && hasSource && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "video",
            {
              ref: videoRef,
              src: parsed.embedUrl,
              poster: posterUrl,
              preload,
              loop,
              autoPlay,
              muted: state.isMuted,
              crossOrigin,
              playsInline: true,
              style: getVideoStyle(),
              onLoadedMetadata: handleLoadedMetadata,
              onDurationChange: handleDurationChange,
              onTimeUpdate: handleTimeUpdate,
              onProgress: handleProgress,
              onWaiting: handleWaiting,
              onCanPlay: handleCanPlay,
              onPlay: handleVideoPlay,
              onPause: handleVideoPause,
              onRateChange: handleRateChangeEvent,
              onEnded: handleVideoEnded,
              onError: handleError,
              onClick: togglePlay,
              onDoubleClick: toggleFullscreen,
              "aria-hidden": "true",
              children: tracks?.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
          showCaptions && metrics.box && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getCaptionLayerStyle(metrics.box), children: [
            topCues.length > 0 && renderCues(topCues, "top"),
            bottomCues.length > 0 && renderCues(bottomCues, "bottom")
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "div",
            {
              style: getPosterOverlayStyle(posterUrl, showPoster),
              onClick: showPoster ? startPlayback : void 0,
              "aria-hidden": !showPoster,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getPosterGradientStyle() }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "button",
                  {
                    type: "button",
                    "data-vplayer-poster-button": "",
                    style: getPlayButtonLargeStyle(),
                    tabIndex: showPoster && !hasError ? 0 : -1,
                    hidden: hasError,
                    "aria-label": "Play video",
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                      PlayIcon,
                      {
                        size: 30,
                        color: iconColor,
                        style: {
                          width: "40%",
                          height: "40%",
                          transform: "translateX(3%)"
                        }
                      }
                    )
                  }
                )
              ]
            }
          ),
          state.isLoading && state.hasStarted && !state.error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getLoadingOverlayStyle(), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SpinnerIcon, { size: 36, color: iconColor }) }),
          errorCopy && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getErrorOverlayStyle(), role: "alert", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ErrorIcon, { size: 30, color: "rgba(255,255,255,0.55)" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: getErrorTitleStyle(), children: errorCopy.title }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: getErrorMessageStyle(), children: errorCopy.detail }),
            errorCopy.canRetry && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "button",
              {
                type: "button",
                "data-vplayer-retry": "",
                style: getRetryButtonStyle(),
                onClick: retryPlayback,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(RetryIcon, { size: 15, color: "currentColor" }),
                  "Try again"
                ]
              }
            )
          ] }),
          title && state.hasStarted && controlsVisible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getTitleOverlayStyle(), children: title }),
          showShortcuts && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "div",
            {
              style: getShortcutsOverlayStyle(),
              onClick: () => setShowShortcuts(false),
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "div",
                {
                  style: getShortcutsBoxStyle(),
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
                    getShortcuts(seekStep, volumeStep).map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getShortcutRowStyle(), children: [
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("kbd", { style: getKbdStyle(), children: key }),
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
          anyMenuOpen && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "div",
            {
              style: getMenuBackdropStyle(),
              onClick: closeMenus,
              "aria-hidden": "true"
            }
          ),
          isNative && state.hasStarted && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "div",
            {
              ref: controlsBarRef,
              style: getControlsBarStyle(
                controlsVisible,
                layoutVariant,
                compactControls
              ),
              onFocus: resetHideTimer,
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: getControlsShellStyle(layoutVariant), children: inlineLayout ? (
                // One row: the scrubber stretches between the two readouts.
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getInlineRowStyle(), children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
                    playButton,
                    playlistButtons,
                    volumeControl
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: timeStyle, children: formatTime(state.currentTime) }),
                  progressBar,
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: timeStyle, children: layoutVariant === "minimal" ? `\u2212${formatTime(remainingTime)}` : formatTime(state.duration) }),
                  rightGroup
                ] })
              ) : (
                // Stacked: full-width scrubber above, controls below.
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
                  progressBar,
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlsRowStyle(), children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: getControlGroupStyle(), children: [
                      playButton,
                      playlistButtons,
                      volumeControl,
                      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { style: timeStyle, children: [
                        formatTime(state.currentTime),
                        !compactControls && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
                          " / ",
                          formatTime(state.duration)
                        ] })
                      ] })
                    ] }),
                    rightGroup
                  ] })
                ] })
              ) })
            }
          )
        ] }) })
      ]
    }
  );
});
var VPlayer2 = Object.assign(VPlayerBase, {
  /** Returns true if a URL is recognized as playable (platform link, media file, blob/data URL) */
  canPlay: canPlayUrl
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VPlayer,
  canPlayUrl,
  formatTime,
  isHlsSource,
  parseAspectRatio,
  parseVideoSource
});
