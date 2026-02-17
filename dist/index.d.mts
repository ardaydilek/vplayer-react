import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties } from 'react';

type VideoSource = "native" | "youtube" | "vimeo" | "bilibili";
interface VPlayerProps {
    /** Video source URL - local file, YouTube, Vimeo, or Bilibili link */
    src: string;
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
}
interface VideoState {
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
interface ParsedSource {
    type: VideoSource;
    embedUrl: string;
    videoId: string;
}

declare function VPlayer({ src, poster, width, aspectRatio, accentColor, iconColor, autoPlay, loop, muted, title, className, style, onPlay, onPause, onEnded, onTimeUpdate, preload, ariaLabel, }: VPlayerProps): react_jsx_runtime.JSX.Element;

/**
 * Parse a video URL and determine its source type and embed URL.
 */
declare function parseVideoSource(src: string): ParsedSource;
/**
 * Format seconds into MM:SS or HH:MM:SS string.
 */
declare function formatTime(seconds: number): string;
/**
 * Parse aspect ratio string "w:h" to a numeric ratio.
 */
declare function parseAspectRatio(ratio: string): number;

export { type ParsedSource, VPlayer, type VPlayerProps, type VideoSource, type VideoState, formatTime, parseAspectRatio, parseVideoSource };
