import React, { CSSProperties } from 'react';

type VideoSource = "native" | "youtube" | "vimeo" | "bilibili";
type VPlayerAction = "play" | "mute" | "fullscreen" | "seekBack" | "seekForward" | "volumeUp" | "volumeDown" | "speedDown" | "speedUp" | "shortcuts";
type VPlayerKeymap = Partial<Record<VPlayerAction, string | string[] | false>>;
interface VPlayerProps {
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
    /** Start playback at this timestamp (seconds) */
    initialTime?: number;
    /** Whether the video should autoplay */
    autoPlay?: boolean;
    /** Whether the video should loop */
    loop?: boolean;
    /** When true and in playlist mode, wraps back to the first video after the last one ends */
    loopPlaylist?: boolean;
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
    /** Callback when the video encounters an error */
    onError?: (error: MediaError | null) => void;
    /** Callback fired after the user completes a seek (mouseup/touchend on progress bar) */
    onSeek?: (time: number) => void;
    /** Callback with current time updates */
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    /** Preload behavior for native video */
    preload?: "none" | "metadata" | "auto";
    /** ARIA label for accessibility */
    ariaLabel?: string;
    /** Subtitle/caption tracks */
    tracks?: {
        src: string;
        label: string;
        lang: string;
        default?: boolean;
    }[];
    /** Callback when buffer progress changes (0–100) */
    onBuffer?: (percent: number) => void;
    /** Chapter markers displayed on the progress bar */
    chapters?: {
        time: number;
        label: string;
    }[];
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
    /** Controlled playlist index. When provided, the player treats this as the source of truth. */
    activeIndex?: number;
    /** Callback when the playlist index changes (called for both user navigation and auto-advance) */
    onIndexChange?: (index: number) => void;
    /** Persist volume to localStorage so it survives page reloads */
    persistVolume?: boolean;
    /** Callback when the current chapter changes during playback */
    onChapterChange?: (chapter: {
        time: number;
        label: string;
    } | null) => void;
    /** Callback when volume or mute state changes */
    onVolumeChange?: (volume: number, muted: boolean) => void;
    /** Custom key bindings — set a binding to false to disable it */
    keymap?: VPlayerKeymap;
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
    error: MediaError | null;
}
interface VPlayerHandle {
    /** Start playback */
    play: () => void;
    /** Pause playback */
    pause: () => void;
    /** Seek to a specific time in seconds */
    seek: (time: number) => void;
    /** Get the current playback time in seconds */
    getCurrentTime: () => number;
    /** Get the total duration in seconds */
    getDuration: () => number;
    /** Get the current volume (0-1) */
    getVolume: () => number;
    /** Set volume (0-1) */
    setVolume: (volume: number) => void;
    /** Toggle mute */
    toggleMute: () => void;
    /** Toggle fullscreen */
    toggleFullscreen: () => void;
    /** Get the underlying HTMLVideoElement (for advanced use) */
    getVideoElement: () => HTMLVideoElement | null;
}
interface ParsedSource {
    type: VideoSource;
    embedUrl: string;
    videoId: string;
}

declare const VPlayer: React.ForwardRefExoticComponent<VPlayerProps & React.RefAttributes<VPlayerHandle>>;

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

export { type ParsedSource, VPlayer, type VPlayerAction, type VPlayerHandle, type VPlayerKeymap, type VPlayerProps, type VideoSource, type VideoState, formatTime, parseAspectRatio, parseVideoSource };
