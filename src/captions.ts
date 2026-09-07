import { createElement, Fragment, type ReactNode } from "react";

/**
 * Caption rendering support.
 *
 * The browser draws native `::cue` text at the bottom of the *video element's
 * box* — which is the wrong place twice over: it sits underneath the control
 * bar, and when the frame is letterboxed (a 16:9 clip fullscreened on a
 * portrait phone) it lands in the black bar far below the picture. So the
 * player keeps its text tracks in `hidden` mode — still parsed, still firing
 * `cuechange`, just not painted — and renders the active cues itself, inside
 * the letterbox-corrected content box and above the controls.
 */

/** A rectangle in the video element's own coordinate space. */
export interface ContentBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** One active cue, flattened into something React can render. */
export interface CueSnapshot {
  key: string;
  content: ReactNode;
  align: "left" | "center" | "right";
  /** Cues the VTT anchors to the top of the frame render in the top region */
  region: "top" | "bottom";
}

const TEXT_NODE = 3;
const ELEMENT_NODE = 1;

/**
 * The tags `getCueAsHTML()` is specified to produce. Everything else in the
 * WebVTT node tree (`<c>`, `<v>`, `<lang>`) arrives as a `<span>` already, and
 * anything unexpected is flattened to one — the cue's own markup never becomes
 * arbitrary HTML in the page.
 */
const CUE_TAGS: Record<string, string> = {
  B: "b",
  I: "i",
  U: "u",
  RUBY: "ruby",
  RT: "rt",
};

function cueNodeToReact(node: Node, key: string): ReactNode {
  if (node.nodeType === TEXT_NODE) return node.nodeValue;
  if (node.nodeType !== ELEMENT_NODE) return null;
  const el = node as Element;
  const children: ReactNode[] = [];
  for (let i = 0; i < el.childNodes.length; i++) {
    children.push(cueNodeToReact(el.childNodes[i], `${key}.${i}`));
  }
  return createElement(
    CUE_TAGS[el.tagName] ?? "span",
    { key },
    ...children
  );
}

/** Last resort when `getCueAsHTML` is missing (jsdom, older engines). */
export function stripCueTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

function resolveAlign(align: unknown): CueSnapshot["align"] {
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

/**
 * A cue is drawn at the top of the frame when the VTT says so — either a
 * snap-to-lines row counted down from the top, or a percentage in the upper
 * half. `line: "auto"` (by far the common case) means bottom.
 */
function resolveRegion(cue: {
  line?: number | "auto";
  snapToLines?: boolean;
}): CueSnapshot["region"] {
  const { line } = cue;
  if (typeof line !== "number" || !isFinite(line)) return "bottom";
  if (cue.snapToLines === false) return line < 50 ? "top" : "bottom";
  return line >= 0 ? "top" : "bottom";
}

/** Flatten one live cue into an immutable snapshot React can render. */
export function snapshotCue(cue: TextTrackCue, index: number): CueSnapshot {
  const vtt = cue as TextTrackCue & {
    text?: string;
    align?: string;
    line?: number | "auto";
    snapToLines?: boolean;
    getCueAsHTML?: () => DocumentFragment;
  };

  let content: ReactNode = null;
  if (typeof vtt.getCueAsHTML === "function") {
    try {
      const fragment = vtt.getCueAsHTML();
      const children: ReactNode[] = [];
      for (let i = 0; i < fragment.childNodes.length; i++) {
        children.push(cueNodeToReact(fragment.childNodes[i], String(i)));
      }
      content = createElement(Fragment, null, ...children);
    } catch {
      content = null;
    }
  }
  if (content === null) content = stripCueTags(vtt.text ?? "");

  return {
    key: `${cue.startTime}:${cue.endTime}:${index}`,
    content,
    align: resolveAlign(vtt.align),
    region: resolveRegion(vtt),
  };
}

/**
 * Where the picture actually is inside the video element, given
 * `object-fit: contain`. Everything outside this rectangle is letterbox.
 */
export function getVideoContentBox(video: HTMLVideoElement): ContentBox {
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
    height,
  };
}

export function sameContentBox(
  a: ContentBox | null,
  b: ContentBox | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

/**
 * WebVTT sizes cues relative to the video, so captions stay legible on a
 * thumbnail-sized player and don't turn into billboards in fullscreen.
 */
export function getCaptionFontSize(contentHeight: number): number {
  return Math.round(Math.min(Math.max(contentHeight * 0.048, 13), 40));
}
