import type { ParsedSource } from "./types";

/**
 * Parse a video URL and determine its source type and embed URL.
 */
export function parseVideoSource(src: string): ParsedSource {
  // YouTube
  const ytMatch = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
    };
  }

  // Vimeo
  const vimeoMatch = src.match(
    /(?:vimeo\.com\/)(\d+)/
  );
  if (vimeoMatch) {
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0&title=0`,
    };
  }

  // Bilibili
  const biliMatch = src.match(
    /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/
  );
  if (biliMatch) {
    return {
      type: "bilibili",
      videoId: biliMatch[1],
      embedUrl: `https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&high_quality=1&danmaku=0`,
    };
  }

  // Also match bilibili with aid
  const biliAidMatch = src.match(
    /bilibili\.com\/video\/av(\d+)/
  );
  if (biliAidMatch) {
    return {
      type: "bilibili",
      videoId: biliAidMatch[1],
      embedUrl: `https://player.bilibili.com/player.html?aid=${biliAidMatch[1]}&high_quality=1&danmaku=0`,
    };
  }

  // Native / local video
  return {
    type: "native",
    videoId: "",
    embedUrl: src,
  };
}

/**
 * Format seconds into MM:SS or HH:MM:SS string.
 */
export function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const sStr = s.toString().padStart(2, "0");
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${sStr}`;
  }
  return `${m}:${sStr}`;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Parse aspect ratio string "w:h" to a numeric ratio.
 */
export function parseAspectRatio(ratio: string): number {
  const parts = ratio.split(":");
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (w > 0 && h > 0) return h / w;
  }
  return 9 / 16; // default 16:9
}
