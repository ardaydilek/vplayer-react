import type { CSSProperties } from "react";
export type VideoSource = "native" | "youtube" | "vimeo" | "bilibili";

export type VPlayerAction =
  | "play"
  | "mute"
  | "fullscreen"
  | "seekBack"
  | "seekForward"
  | "volumeUp"
  | "volumeDown"
  | "speedDown"
  | "speedUp"
  | "shortcuts";

export type VPlayerKeymap = Partial<Record<VPlayerAction, string | string[] | false>>;

export interface VPlayerProps {
  /** Video source URL(s) - local file, YouTube, Vimeo, or Bilibili link. Pass an array for playlist mode. */
  src: string | string[];
  /** Poster image URL shown before playback */
  poster?: string;
  /** Player width - accepts CSS value or number (px) */
  width?: string | number;
  /** Aspect ratio as "w:h" string, defaults to "16:9" */
  aspectRatio?: string;
  /** Brand accent color for progress thumb and active controls */
  accentColor?: string;
  /** Icon color for play/pause and control icons */
  iconColor?: string;
  /** Whether the video should autoplay */
  autoPlay?: boolean;
  /** Whether the video should loop */
  loop?: boolean;
  /** Whether the video is muted by default */
  muted?: boolean;
  /** Title shown in the top-left overlay */
  title?: string;
  /** Custom CSS class for the outer container */
  className?: string;
  /** Custom inline styles for the outer container */
  style?: CSSProperties;
  /** Callback when the video starts playing */
  onPlay?: () => void;
  /** Callback when the video is paused */
  onPause?: () => void;
  /** Callback when the video ends */
  onEnded?: () => void;
  /** Callback with current time updates */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** Preload behavior for native video */
  preload?: "none" | "metadata" | "auto";
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Subtitle/caption tracks */
  tracks?: { src: string; label: string; lang: string; default?: boolean }[];
  /** Callback when buffer progress changes (0–100) */
  onBuffer?: (percent: number) => void;
  /** Chapter markers displayed on the progress bar */
  chapters?: { time: number; label: string }[];
  /** Thumbnail preview sprite sheet for hover scrubbing */
  previewThumbnails?: {
    src: string;
    width: number;
    height: number;
    count: number;
  };
  /** Callback fired once each time a 25/50/75/100% milestone is reached */
  onMilestone?: (percent: 25 | 50 | 75 | 100) => void;
  /** Callback when navigating to the next playlist item */
  onNext?: () => void;
  /** Callback when navigating to the previous playlist item */
  onPrev?: () => void;
  /** Custom key bindings — set a binding to false to disable it */
  keymap?: VPlayerKeymap;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  buffered: number;
  isLoading: boolean;
  hasStarted: boolean;
  showControls: boolean;
  isFocused: boolean;
  playbackRate: number;
}

export interface ParsedSource {
  type: VideoSource;
  embedUrl: string;
  videoId: string;
}
