"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useId,
  useImperativeHandle,
  forwardRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type {
  VPlayerProps,
  VPlayerHandle,
  VideoState,
  VPlayerAction,
  ControlsVariant,
} from "./types";
import { parseVideoSource, formatTime, clamp, parseAspectRatio, canPlayUrl } from "./utils";
import {
  PlayIcon,
  PauseIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMuteIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
  SettingsIcon,
  PipIcon,
  SpinnerIcon,
  CCIcon,
  ErrorIcon,
  PrevIcon,
  NextIcon,
} from "./icons";
import {
  snapshotCue,
  getVideoContentBox,
  sameContentBox,
  getCaptionFontSize,
  type ContentBox,
  type CueSnapshot,
} from "./captions";
import {
  getContainerStyle,
  getAspectBoxStyle,
  getInnerStyle,
  getVideoStyle,
  getIframeStyle,
  getPosterOverlayStyle,
  getPosterGradientStyle,
  getPlayButtonLargeStyle,
  getControlsBarStyle,
  getProgressContainerStyle,
  getProgressTrackStyle,
  getProgressBufferStyle,
  getProgressFillStyle,
  getProgressThumbStyle,
  getControlsRowStyle,
  getInlineRowStyle,
  getControlsShellStyle,
  getControlGroupStyle,
  getControlButtonStyle,
  getPlayToggleStyle,
  getTimeDisplayStyle,
  getCaptionLayerStyle,
  getCaptionRegionStyle,
  getCaptionCueStyle,
  getVolumeSliderContainerStyle,
  getVolumePopupStyle,
  getVolumeVerticalTrackStyle,
  getVolumeVerticalFillStyle,
  getVolumeVerticalThumbStyle,
  getVolumeLabelStyle,
  getErrorOverlayStyle,
  getErrorMessageStyle,
  getLoadingOverlayStyle,
  getTitleOverlayStyle,
  getMenuOverlayStyle,
  getMenuPanelStyle,
  getSpeedMenuItemStyle,
  getTooltipStyle,
  getShortcutsOverlayStyle,
  getShortcutsBoxStyle,
  getShortcutRowStyle,
  getKbdStyle,
  getChapterMarkerStyle,
  getPreviewThumbnailStyle,
  injectKeyframes,
} from "./styles";

const DEFAULT_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%23111' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='central' textAnchor='middle' fontFamily='system-ui' fontSize='48' fill='%23333'%3EVideo%3C/text%3E%3C/svg%3E";

const DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const DEFAULT_HIDE_CONTROLS_DELAY = 3000;
// Deliberately shorter than the idle delay: the pointer left the player entirely
const HIDE_ON_LEAVE_DELAY = 800;
const VOLUME_STORAGE_KEY = "vplayer-volume";
/** Breathing room between the last line of captions and the top of the bar */
const CAPTION_CONTROLS_GAP = 10;
/** Below this the inline variants stack, because one row can no longer hold them */
const INLINE_LAYOUT_MIN_WIDTH = 480;

function getShortcuts(seekStep: number, volumeStep: number): [string, string][] {
  return [
    ["Space / K", "Play / Pause"],
    ["← / →", `Seek ±${seekStep}s`],
    ["Shift+← / →", "Prev / Next chapter"],
    ["↑ / ↓", `Volume ±${Math.round(volumeStep * 100)}%`],
    ["F", "Fullscreen"],
    ["M", "Mute"],
    ["0–9", "Seek to 0%–90%"],
    ["< / >", "Speed down / up"],
    ["?", "Toggle shortcuts"],
  ];
}

const DEFAULT_KEYMAP: Record<VPlayerAction, string | string[]> = {
  play:        [" ", "k"],
  mute:        "m",
  fullscreen:  "f",
  seekBack:    "ArrowLeft",
  seekForward: "ArrowRight",
  volumeUp:    "ArrowUp",
  volumeDown:  "ArrowDown",
  speedDown:   "<",
  speedUp:     ">",
  shortcuts:   "?",
};

// Geometry has to be settled before the browser paints, or an inline control
// bar renders stacked for one frame and visibly snaps.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function matchesKey(
  key: string,
  binding: string | string[] | false | undefined
): boolean {
  if (!binding) return false;
  return Array.isArray(binding) ? binding.includes(key) : binding === key;
}

const VPlayerBase = forwardRef<VPlayerHandle, VPlayerProps>(function VPlayer(
  {
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
    onLeavePiP,
  },
  ref
) {
  // ---- Playlist resolution ----
  const srcList = Array.isArray(src) ? src : [src];
  const isPlaylist = srcList.length > 1;
  const [internalIndex, setInternalIndex] = useState(0);

  const isControlled = activeIndex !== undefined;
  const currentIndex = isControlled ? activeIndex : internalIndex;

  const setCurrentIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const nextIndex =
        typeof updater === "function" ? updater(currentIndex) : updater;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  const hasStartedRef = useRef(false);
  const milestonesFiredRef = useRef<Set<number>>(new Set());
  const playlistAdvancingRef = useRef(false);
  const initialTimeAppliedRef = useRef(false);
  const currentChapterRef = useRef<string | null>(null);
  const readyFiredRef = useRef(false);
  const startFiredRef = useRef(false);
  const endTimeFiredRef = useRef(false);
  const clipEndPauseRef = useRef(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);
  const mediaSettingsRef = useRef({ volume: 1, muted: false, rate: 1 });
  const prevPlayingRef = useRef<boolean | undefined>(undefined);
  const controlsBarRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();

  // Latest onSeek for handlers registered in long-lived effects
  const onSeekRef = useRef(onSeek);
  useEffect(() => {
    onSeekRef.current = onSeek;
  }, [onSeek]);

  // Resolve per-track chapters: if chapters is a nested array, pick the current track's chapters
  const activeChapters = useMemo(() => {
    if (!chapters) return undefined;
    if (chapters.length === 0) return undefined;
    // Check if it's a nested array (Chapter[][])
    if (Array.isArray(chapters[0]) && Array.isArray((chapters as any[])[0])) {
      const perTrack = chapters as { time: number; label: string }[][];
      return perTrack[currentIndex] ?? undefined;
    }
    // Flat array — only show on first track in playlist mode, or always for single video
    if (isPlaylist) return currentIndex === 0 ? (chapters as { time: number; label: string }[]) : undefined;
    return chapters as { time: number; label: string }[];
  }, [chapters, currentIndex, isPlaylist]);

  const parsed = parseVideoSource(activeSrc);
  const ratio = parseAspectRatio(aspectRatio);
  const isNative = parsed.type === "native";

  const resolvedKeymap = useMemo(
    () => ({ ...DEFAULT_KEYMAP, ...keymap }),
    [keymap]
  );

  const resolvedRates = useMemo(
    () => (playbackRates && playbackRates.length > 0 ? playbackRates : DEFAULT_PLAYBACK_RATES),
    [playbackRates]
  );

  const [state, setState] = useState<VideoState>(() => {
    let volume = muted ? 0 : 1;
    let isMuted = muted;
    if (persistVolume && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
        if (stored !== null) {
          const vol = parseFloat(stored);
          if (isFinite(vol) && vol >= 0 && vol <= 1) {
            volume = vol;
            // Keep the muted prop's contract (muted autoplay) — the stored
            // level is only the volume to restore on unmute.
            isMuted = muted || vol === 0;
          }
        }
      } catch {
        // localStorage unavailable (SSR, private browsing)
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
      error: null,
    };
  });

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showCCMenu, setShowCCMenu] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [embedStarted, setEmbedStarted] = useState(false);
  const [supportsPip, setSupportsPip] = useState(false);
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [hlsUnsupported, setHlsUnsupported] = useState(false);
  const [activeCues, setActiveCues] = useState<CueSnapshot[]>([]);
  // iOS hands `webkitEnterFullscreen` to its own player, which draws the text
  // tracks itself — our overlay isn't on screen there, so the track has to go
  // back to `showing` for the duration.
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [metrics, setMetrics] = useState<{
    /** Where the picture sits inside the video element, letterboxing removed */
    box: ContentBox | null;
    /** How far captions must rise to clear the control bar */
    lift: number;
    /** Outer player width, which decides whether an inline row still fits */
    width: number;
  }>({ box: null, lift: 0, width: 0 });

  // Inject keyframes for spinner & detect PiP support
  useEffect(() => {
    injectKeyframes();
    setSupportsPip(!!(document as Document & { pictureInPictureEnabled?: boolean }).pictureInPictureEnabled);
  }, []);

  // HLS sources play natively only where the browser supports them (Safari,
  // iOS, some Chromium builds). Detect and surface a clear error otherwise.
  useEffect(() => {
    if (!parsed.isHls) {
      setHlsUnsupported(false);
      return;
    }
    const probe = document.createElement("video");
    setHlsUnsupported(
      probe.canPlayType("application/vnd.apple.mpegurl") === "" &&
        probe.canPlayType("application/x-mpegURL") === ""
    );
  }, [parsed.isHls]);

  // Persist volume to localStorage (debounced — slider drags fire rapidly)
  const pendingVolumeWriteRef = useRef<string | null>(null);
  useEffect(() => {
    if (!persistVolume) return;
    pendingVolumeWriteRef.current = String(state.isMuted ? 0 : state.volume);
    const id = setTimeout(() => {
      try {
        if (pendingVolumeWriteRef.current !== null) {
          localStorage.setItem(VOLUME_STORAGE_KEY, pendingVolumeWriteRef.current);
        }
      } catch {
        // ignore
      }
      pendingVolumeWriteRef.current = null;
    }, 250);
    return () => clearTimeout(id);
  }, [persistVolume, state.volume, state.isMuted]);

  // Flush an unsaved volume write if the player unmounts inside the debounce window
  useEffect(() => {
    return () => {
      if (pendingVolumeWriteRef.current !== null) {
        try {
          localStorage.setItem(VOLUME_STORAGE_KEY, pendingVolumeWriteRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Keep refs in sync for use inside resetHideTimer
  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);
  useEffect(() => {
    hasStartedRef.current = state.hasStarted;
  }, [state.hasStarted]);
  useEffect(() => {
    mediaSettingsRef.current = {
      volume: state.volume,
      muted: state.isMuted,
      rate: state.playbackRate,
    };
  }, [state.volume, state.isMuted, state.playbackRate]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setState((s) => (s.showControls ? s : { ...s, showControls: true }));
    if (!forceShowControls && isPlayingRef.current && hasStartedRef.current) {
      hideTimerRef.current = setTimeout(() => {
        // Never hide the bar out from under keyboard focus
        if (controlsBarRef.current?.contains(document.activeElement)) return;
        setState((s) => ({ ...s, showControls: false }));
        setShowSpeedMenu(false);
        setShowVolumeSlider(false);
      }, hideControlsDelay);
    }
  }, [forceShowControls, hideControlsDelay]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => {
      setState((s) => ({
        ...s,
        isFullscreen: !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement
        ),
      }));
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener("webkitfullscreenchange", handleFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener("webkitfullscreenchange", handleFSChange);
    };
  }, []);

  // Reset player state when activeSrc changes (including playlist advances)
  useEffect(() => {
    setState((s) => ({
      ...s,
      currentTime: 0,
      duration: 0,
      hasStarted: false,
      isPlaying: false,
      buffered: 0,
      isLoading: false,
      error: null,
    }));
    milestonesFiredRef.current = new Set();
    currentChapterRef.current = null;
    readyFiredRef.current = false;
    startFiredRef.current = false;
    endTimeFiredRef.current = false;
    clipEndPauseRef.current = false;
    // Let the controlled-playing effect re-apply `playing` to the new source
    prevPlayingRef.current = undefined;
    setActiveTrack(null);
    setEmbedStarted(false);

    if (playlistAdvancingRef.current) {
      playlistAdvancingRef.current = false;
      const v = videoRef.current;
      if (v) {
        // The browser queues play() until the new source is loadable, so no
        // canplay listener is needed — and a load error can't strand the
        // spinner because the error event clears isLoading.
        setState((s) => ({ ...s, hasStarted: true, isLoading: true }));
        v.play().catch(() =>
          setState((s) => ({ ...s, isPlaying: false, isLoading: false }))
        );
      }
    }
  }, [activeSrc]);

  // Initialize activeTrack from default track — only on first mount
  const defaultTrackAppliedRef = useRef(false);
  useEffect(() => {
    if (defaultTrackAppliedRef.current || !tracks?.length) return;
    defaultTrackAppliedRef.current = true;
    const defaultIdx = tracks.findIndex((t) => t.default);
    if (defaultIdx !== -1) setActiveTrack(defaultIdx);
  }, [tracks]);

  // TextTrack API — switch active caption track.
  //
  // The active track runs in `hidden`, not `showing`: it still parses and
  // still fires `cuechange`, but the browser doesn't paint it. Painting is the
  // player's job (see the cuechange effect below), because the native cue box
  // is anchored to the video *element* — underneath the control bar, and out
  // in the letterbox when the frame doesn't fill the element. The exception is
  // iOS's own fullscreen player, which is drawing the video itself and needs a
  // `showing` track to draw captions over it.
  const trackMode: TextTrackMode = nativeFullscreen ? "showing" : "hidden";
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !v.textTracks) return;
    // Captured, not re-read on teardown: `textTracks` is a live accessor and
    // the element may already be detached by then.
    const list = v.textTracks;

    const applyModes = () => {
      for (let i = 0; i < list.length; i++) {
        list[i].mode = i === activeTrack ? trackMode : "disabled";
      }
    };

    applyModes();
    // TextTrackList event support is missing in some environments (jsdom)
    if (typeof list.addEventListener !== "function") return;
    list.addEventListener("change", applyModes);
    return () => {
      list.removeEventListener("change", applyModes);
    };
  }, [activeTrack, trackMode, tracks]);

  // Mirror the active track's cues into state so they can be rendered as DOM.
  useEffect(() => {
    setActiveCues([]);
    const v = videoRef.current;
    if (!v || !v.textTracks || activeTrack === null) return;
    const track = v.textTracks[activeTrack];
    if (!track) return;

    const readCues = () => {
      const cues = track.activeCues;
      if (!cues || cues.length === 0) {
        setActiveCues((prev) => (prev.length === 0 ? prev : []));
        return;
      }
      const next: CueSnapshot[] = [];
      for (let i = 0; i < cues.length; i++) next.push(snapshotCue(cues[i], i));
      setActiveCues(next);
    };

    readCues();
    // TextTrack event support is missing in some environments (jsdom)
    if (typeof track.addEventListener !== "function") return;
    track.addEventListener("cuechange", readCues);
    return () => {
      track.removeEventListener("cuechange", readCues);
    };
  }, [activeTrack, activeSrc, tracks]);

  // iOS fullscreen hands rendering to the system player
  useEffect(() => {
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

  // ---- Geometry ----
  //
  // One pass produces the three numbers the layout depends on, so a resize
  // costs a single re-render: where the picture actually sits inside the
  // element, how far captions must rise to clear the control bar, and how wide
  // the player is.
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      let box: ContentBox | null = null;
      let lift = 0;

      const v = videoRef.current;
      if (v) {
        box = getVideoContentBox(v);
        const bar = controlsBarRef.current;
        if (bar) {
          const videoRect = v.getBoundingClientRect();
          const barRect = bar.getBoundingClientRect();
          // The bar's top padding is the scrim's run-up rather than chrome, so
          // what captions have to clear is the first real control below it.
          const padTop =
            parseFloat(window.getComputedStyle(bar).paddingTop) || 0;
          const overlap =
            videoRect.top + box.top + box.height - (barRect.top + padTop);
          // A letterboxed frame can end above the bar entirely — then there is
          // nothing to clear and the captions stay where they are.
          if (overlap > 0) {
            // On a very short player the bar can cover most of the picture;
            // capping the rise at half its height keeps captions on the frame
            // rather than shoving them off the top.
            lift = Math.round(
              Math.min(overlap + CAPTION_CONTROLS_GAP, box.height / 2)
            );
          }
        }
      }

      setMetrics((prev) =>
        prev.width === width &&
        prev.lift === lift &&
        sameContentBox(prev.box, box)
          ? prev
          : { width, lift, box }
      );
    };

    measure();

    const container = containerRef.current;
    const v = videoRef.current;
    const bar = controlsBarRef.current;
    v?.addEventListener("loadedmetadata", measure);
    // Fires once the intrinsic dimensions are known, and again if they change
    v?.addEventListener("resize", measure);

    let observer: ResizeObserver | undefined;
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
    isPlaylist,
  ]);

  // Picture-in-Picture enter/leave callbacks
  useEffect(() => {
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

  // Remote-playback / PiP opt-outs are set as element properties because
  // React 18 does not recognize them as attributes.
  useEffect(() => {
    const v = videoRef.current as
      | (HTMLVideoElement & {
          disableRemotePlayback?: boolean;
          disablePictureInPicture?: boolean;
        })
      | null;
    if (!v) return;
    if ("disableRemotePlayback" in v) v.disableRemotePlayback = disableRemotePlayback;
    if ("disablePictureInPicture" in v) v.disablePictureInPicture = disablePictureInPicture;
  }, [disableRemotePlayback, disablePictureInPicture, isNative, hasSource]);

  // Controlled `playing` prop — sync on change, and re-apply after a source
  // change (the src-reset effect above clears prevPlayingRef first).
  useEffect(() => {
    if (playing === undefined || playing === prevPlayingRef.current) {
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

  // Controlled `volume` prop. Volume 0 mutes, but a positive volume never
  // unmutes — mute stays owned by the muted prop and the user.
  useEffect(() => {
    if (volumeProp === undefined) return;
    const vol = clamp(volumeProp, 0, 1);
    const v = videoRef.current;
    if (v) {
      v.volume = vol;
      if (vol === 0) v.muted = true;
    }
    setState((s) => ({
      ...s,
      volume: vol,
      isMuted: vol === 0 ? true : s.isMuted,
    }));
  }, [volumeProp]);

  // `muted` prop — initial value is handled by state init; sync later changes
  const prevMutedRef = useRef(muted);
  useEffect(() => {
    if (muted === prevMutedRef.current) return;
    prevMutedRef.current = muted;
    setState((s) => ({ ...s, isMuted: muted }));
  }, [muted]);

  // Controlled `playbackRate` prop
  useEffect(() => {
    if (playbackRateProp === undefined) return;
    const v = videoRef.current;
    if (v) v.playbackRate = playbackRateProp;
    setState((s) => ({ ...s, playbackRate: playbackRateProp }));
  }, [playbackRateProp]);

  // If the component unmounts mid-drag, remove the window listeners the
  // drag handlers registered.
  useEffect(() => {
    return () => {
      dragCleanupRef.current?.();
    };
  }, []);

  // Menus autoFocus their active item; when a menu closes (unmounting the
  // focused element), pull focus back into the player so keyboard shortcuts
  // keep working instead of focus silently dropping to <body>.
  const anyMenuOpen = showSpeedMenu || showCCMenu || showVolumeSlider;
  const prevMenuOpenRef = useRef(false);
  useEffect(() => {
    const wasOpen = prevMenuOpenRef.current;
    prevMenuOpenRef.current = anyMenuOpen;
    if (wasOpen && !anyMenuOpen) {
      const c = containerRef.current;
      if (c && !c.contains(document.activeElement)) {
        c.focus({ preventScroll: true });
      }
    }
  }, [anyMenuOpen]);

  // ---- Native Video Event Handlers ----
  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (
      initialTime &&
      initialTime > 0 &&
      !initialTimeAppliedRef.current &&
      initialTime < v.duration
    ) {
      v.currentTime = initialTime;
      initialTimeAppliedRef.current = true;
    }
    // Apply the tracked volume/rate to the element — restores persisted or
    // controlled values that the element itself doesn't know about yet.
    const settings = mediaSettingsRef.current;
    v.volume = settings.volume;
    if (v.playbackRate !== settings.rate) v.playbackRate = settings.rate;
    setState((s) => ({
      ...s,
      // Live streams report Infinity; keep state.duration finite
      duration: isFinite(v.duration) ? v.duration : 0,
      currentTime: v.currentTime,
      isLoading: false,
    }));
  }, [initialTime]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      currentTime: v.currentTime,
      // Fallback: pick up duration if it wasn't captured by loadedmetadata/durationchange
      duration: s.duration > 0 ? s.duration : (isFinite(v.duration) ? v.duration : 0),
    }));
    onTimeUpdate?.(v.currentTime, v.duration);
    if (endTime && endTime > 0) {
      if (!endTimeFiredRef.current && v.currentTime >= endTime) {
        endTimeFiredRef.current = true;
        clipEndPauseRef.current = true;
        v.pause();
        onEnded?.();
      } else if (endTimeFiredRef.current && v.currentTime < endTime - 1) {
        // Re-arm when the user seeks back before the clip end
        endTimeFiredRef.current = false;
      }
    }
    if (onMilestone && v.duration > 0) {
      const pct = (v.currentTime / v.duration) * 100;
      for (const milestone of [25, 50, 75, 100] as const) {
        if (pct >= milestone && !milestonesFiredRef.current.has(milestone)) {
          milestonesFiredRef.current.add(milestone);
          onMilestone(milestone);
        }
      }
    }
    if (onChapterChange && activeChapters && activeChapters.length > 0 && v.duration > 0) {
      let current: { time: number; label: string } | null = null;
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

  const handleProgress = useCallback(() => {
    const v = videoRef.current;
    if (!v || v.buffered.length === 0) return;
    const end = v.buffered.end(v.buffered.length - 1);
    const pct = v.duration ? (end / v.duration) * 100 : 0;
    setState((s) => ({ ...s, buffered: pct }));
    onBuffer?.(pct);
  }, [onBuffer]);

  const handleWaiting = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true }));
    onWaiting?.();
  }, [onWaiting]);

  const handleDurationChange = useCallback(() => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    setState((s) => ({ ...s, duration: v.duration }));
    onDurationChange?.(v.duration);
  }, [onDurationChange]);

  const handleCanPlay = useCallback(() => {
    setState((s) => ({ ...s, isLoading: false }));
    if (!readyFiredRef.current) {
      readyFiredRef.current = true;
      onReady?.();
    }
  }, [onReady]);

  // DOM play/pause events are the source of truth for isPlaying — they also
  // cover autoplay, the ref API, and PiP-window / remote controls.
  const handleVideoPlay = useCallback(() => {
    const v = videoRef.current;
    // Resuming after a clip-end pause restarts the clip instead of playing
    // past the declared end.
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

  const handleVideoPause = useCallback(() => {
    const v = videoRef.current;
    isPlayingRef.current = false;
    setState((s) => ({ ...s, isPlaying: false, showControls: true }));
    // The browser fires pause right before ended — let onEnded cover that case
    if (v?.ended) return;
    // A clip-end pause already reported onEnded; suppress the paired onPause
    if (clipEndPauseRef.current) {
      clipEndPauseRef.current = false;
      return;
    }
    onPause?.();
  }, [onPause]);

  const handleRateChangeEvent = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) =>
      s.playbackRate === v.playbackRate ? s : { ...s, playbackRate: v.playbackRate }
    );
    onRateChange?.(v.playbackRate);
  }, [onRateChange]);

  const handleError = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const error = v.error ?? null;
    setState((s) => ({ ...s, error, isLoading: false }));
    onError?.(error);
  }, [onError]);

  const handleVideoEnded = useCallback(() => {
    // The last timeupdate can land short of 100% — guarantee the milestone
    if (onMilestone && !milestonesFiredRef.current.has(100)) {
      milestonesFiredRef.current.add(100);
      onMilestone(100);
    }
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
  }, [isPlaylist, currentIndex, srcList.length, loopPlaylist, onNext, onEnded, onMilestone]);

  // ---- Play / Pause ----
  // isPlaying state and the onPlay/onPause callbacks are driven by the DOM
  // play/pause events; these helpers only issue the commands.
  const togglePlay = useCallback(() => {
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

  const startPlayback = useCallback(() => {
    if (!hasSource || (parsed.isHls && hlsUnsupported)) return;
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

  // ---- Seek ----
  const handleProgressClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
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

  const handleProgressMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;

      const seekTo = (clientX: number) => {
        // Recompute the rect each move — layout can shift mid-drag.
        // currentTime's setter throws on non-finite values (live streams).
        if (!isFinite(v.duration)) return;
        const rect = bar.getBoundingClientRect();
        const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      };

      seekTo(e.clientX);

      const onMove = (ev: globalThis.MouseEvent) => seekTo(ev.clientX);

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

  // Attach progress bar touch listener via useEffect with { passive: false }
  // to avoid "Unable to preventDefault inside passive event listener" console
  // error. Depends on the flags that gate the bar's rendering (not on
  // callbacks) so it attaches exactly when the bar mounts and in-flight drags
  // survive parent re-renders.
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    let activeDragCleanup: (() => void) | null = null;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      // A second finger starts a new drag — drop the previous one's listeners
      activeDragCleanup?.();
      setIsDragging(true);
      const v = videoRef.current;
      if (!v) return;

      const seekTo = (clientX: number) => {
        if (!isFinite(v.duration)) return;
        const rect = bar.getBoundingClientRect();
        const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
        v.currentTime = pct * v.duration;
        setState((s) => ({ ...s, currentTime: v.currentTime }));
      };

      const touch = e.touches[0];
      if (touch) seekTo(touch.clientX);

      const onMove = (ev: TouchEvent) => {
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

  const handleProgressHover = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const pct = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
      setHoverProgress(pct);
    },
    []
  );

  // ---- Volume ----
  const setVolumeLevel = useCallback(
    (vol: number) => {
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

  const handleVolumeSliderClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      // Vertical slider: bottom = 0%, top = 100%
      setVolumeLevel((rect.bottom - e.clientY) / rect.height);
    },
    [setVolumeLevel]
  );

  // ---- Fullscreen ----
  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => void })
      | null;
    const v = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => void;
    };
    if (!c) return;
    if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
      if (c.requestFullscreen) {
        c.requestFullscreen().catch(() => {});
      } else if (c.webkitRequestFullscreen) {
        c.webkitRequestFullscreen();
      } else if (v?.webkitEnterFullscreen) {
        // iOS Safari fallback — fullscreen the video element directly
        v.webkitEnterFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else {
      doc.webkitExitFullscreen?.();
    }
  }, []);

  // ---- Picture in Picture ----
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
      // PiP not supported or blocked
    }
  }, []);

  // ---- Playback Rate ----
  const setPlaybackRate = useCallback((rate: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setState((s) => ({ ...s, playbackRate: rate }));
    setShowSpeedMenu(false);
  }, []);

  // ---- Focus / Keyboard ----
  const handleFocus = useCallback(() => {
    setState((s) => ({ ...s, isFocused: true }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    // Don't blur if focus is still within the container
    if (containerRef.current?.contains(e.relatedTarget as Node)) return;
    setState((s) => ({ ...s, isFocused: false }));
    setShowSpeedMenu(false);
    setShowCCMenu(false);
  }, []);

  // Step through resolvedRates relative to the current rate; handles rates
  // set from outside the list (e.g. via the playbackRate prop).
  const stepPlaybackRate = useCallback(
    (dir: 1 | -1) => {
      const current = state.playbackRate;
      const idx = resolvedRates.indexOf(current);
      let next: number | undefined;
      if (idx !== -1) {
        next = resolvedRates[idx + dir];
      } else if (dir === 1) {
        next = resolvedRates.find((r) => r > current);
      } else {
        next = [...resolvedRates].reverse().find((r) => r < current);
      }
      if (next !== undefined) setPlaybackRate(next);
    },
    [state.playbackRate, resolvedRates, setPlaybackRate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.isFocused || !isNative) return;
      // Never swallow browser/OS shortcuts (Cmd+F, Ctrl+R, Alt combos, ...)
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const v = videoRef.current;
      if (!v) return;

      // Chapter navigation (Shift + Arrow) — must be before regular seek
      if (e.shiftKey && e.key === "ArrowLeft" && activeChapters && activeChapters.length > 0) {
        e.preventDefault();
        const target = [...activeChapters]
          .reverse()
          .find((ch) => ch.time < v.currentTime - 2);
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
        // NaN duration -> Infinity bound -> plain step forward
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
        setShowVolumeSlider(false);
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        if (isFinite(v.duration)) {
          v.currentTime = (parseInt(e.key) / 10) * v.duration;
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
      activeChapters,
    ]
  );

  // Keyboard operation for the seek slider itself (ARIA slider pattern)
  const handleProgressKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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

  // Keyboard operation for the volume slider
  const handleVolumeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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

  // Mouse / touch activity
  const handleMouseMove = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (!forceShowControls && isPlayingRef.current) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, showControls: false }));
        setShowSpeedMenu(false);
        setShowVolumeSlider(false);
      }, HIDE_ON_LEAVE_DELAY);
    }
    setHoverProgress(null);
  }, [forceShowControls]);

  // Compute progress
  const progress =
    state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  // Thumbnail frame index for hover preview
  const thumbFrame =
    previewThumbnails && hoverProgress !== null
      ? Math.min(
          Math.floor((hoverProgress / 100) * previewThumbnails.count),
          previewThumbnails.count - 1
        )
      : null;

  // Chapter label near the hover position
  const nearChapter =
    activeChapters && hoverProgress !== null
      ? activeChapters.find(
          (ch) =>
            state.duration > 0 &&
            Math.abs((ch.time / state.duration) * 100 - hoverProgress) < 2
        )
      : undefined;

  const posterUrl = poster || DEFAULT_POSTER;
  const showPoster = !state.hasStarted;
  const hlsError = !!parsed.isHls && hlsUnsupported;
  const controlsVisible =
    forceShowControls ||
    state.showControls ||
    !state.isPlaying ||
    isDragging ||
    showSpeedMenu ||
    showCCMenu;

  // ---- Caption + layout derivations ----
  const layoutVariant: ControlsVariant =
    controlsVariant !== "classic" && metrics.width < INLINE_LAYOUT_MIN_WIDTH
      ? "classic"
      : controlsVariant;
  const inlineLayout = layoutVariant !== "classic";

  const captionFontSize = getCaptionFontSize(metrics.box?.height ?? 0);
  const topCues = activeCues.filter((c) => c.region === "top");
  const bottomCues = activeCues.filter((c) => c.region === "bottom");
  const showCaptions =
    isNative && !nativeFullscreen && !!metrics.box && activeCues.length > 0;
  // Captions only rise while the bar is on screen; when it fades out they drop
  // back to the bottom of the picture.
  const captionLift = controlsVisible ? metrics.lift : 0;

  const renderCues = (cues: CueSnapshot[], region: CueSnapshot["region"]) => (
    <div
      data-vplayer-caption-region=""
      style={getCaptionRegionStyle(
        region,
        region === "bottom" ? captionLift : 0,
        captionFontSize
      )}
    >
      {cues.map((cue) => (
        <span
          key={cue.key}
          data-vplayer-cue=""
          style={getCaptionCueStyle(cue.align, captionStyle)}
        >
          {cue.content}
        </span>
      ))}
    </div>
  );

  // Volume icon
  const VolumeIcon = state.isMuted
    ? VolumeMuteIcon
    : state.volume < 0.5
      ? VolumeLowIcon
      : VolumeHighIcon;

  // ---- Control bar pieces ----
  // Built once and arranged two ways below, so a control can never exist in
  // one variant and quietly go missing from another.
  const buttonStyle = getControlButtonStyle(layoutVariant);
  const timeStyle = getTimeDisplayStyle(layoutVariant);
  const remainingTime = Math.max(0, state.duration - state.currentTime);

  const playButton = (
    <button
      type="button"
      data-vplayer-btn=""
      style={getPlayToggleStyle(layoutVariant)}
      onClick={togglePlay}
      aria-label={state.isPlaying ? "Pause" : "Play"}
    >
      {state.isPlaying ? (
        <PauseIcon size={20} color={iconColor} />
      ) : (
        <PlayIcon
          size={20}
          color={iconColor}
          style={{ transform: "translateX(1px)" }}
        />
      )}
    </button>
  );

  const playlistButtons = isPlaylist ? (
    <>
      {currentIndex > 0 && (
        <button
          type="button"
          data-vplayer-btn=""
          style={buttonStyle}
          onClick={() => {
            setCurrentIndex((i) => i - 1);
            onPrev?.();
          }}
          aria-label="Previous video"
        >
          <PrevIcon size={18} color={iconColor} />
        </button>
      )}
      {currentIndex < srcList.length - 1 && (
        <button
          type="button"
          data-vplayer-btn=""
          style={buttonStyle}
          onClick={() => {
            setCurrentIndex((i) => i + 1);
            onNext?.();
          }}
          aria-label="Next video"
        >
          <NextIcon size={18} color={iconColor} />
        </button>
      )}
    </>
  ) : null;

  // Click mutes (matching the accessible name); the slider popup opens on
  // hover or keyboard focus, so it is never the only way to reach volume.
  const volumeControl = (
    <div
      style={getVolumeSliderContainerStyle()}
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
      onFocus={() => setShowVolumeSlider(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowVolumeSlider(false);
        }
      }}
    >
      <button
        type="button"
        data-vplayer-btn=""
        style={buttonStyle}
        onClick={toggleMute}
        aria-label={state.isMuted ? "Unmute" : "Mute"}
      >
        <VolumeIcon size={20} color={iconColor} />
      </button>
      {showVolumeSlider && (
        <div style={getVolumePopupStyle()}>
          <div
            style={getVolumeVerticalTrackStyle()}
            onClick={handleVolumeSliderClick}
            onKeyDown={handleVolumeKeyDown}
            role="slider"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((state.isMuted ? 0 : state.volume) * 100)}
            tabIndex={0}
          >
            <div
              style={getVolumeVerticalFillStyle(
                state.isMuted ? 0 : state.volume,
                accentColor
              )}
            />
            <div
              style={getVolumeVerticalThumbStyle(
                state.isMuted ? 0 : state.volume,
                accentColor
              )}
            />
          </div>
          <span style={getVolumeLabelStyle()}>
            {state.isMuted ? "0%" : `${Math.round(state.volume * 100)}%`}
          </span>
        </div>
      )}
    </div>
  );

  const progressBar = (
    <div
      ref={progressRef}
      style={getProgressContainerStyle(layoutVariant)}
      onClick={handleProgressClick}
      onMouseDown={handleProgressMouseDown}
      onMouseMove={handleProgressHover}
      onMouseLeave={() => setHoverProgress(null)}
      onKeyDown={handleProgressKeyDown}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-valuetext={`${formatTime(state.currentTime)} of ${formatTime(state.duration)}`}
      tabIndex={0}
    >
      <div
        style={{
          ...getProgressTrackStyle(),
          height: hoverProgress !== null || isDragging ? "6px" : "4px",
        }}
      >
        <div style={getProgressBufferStyle(state.buffered)} />
        <div style={getProgressFillStyle(progress, accentColor)} />
        {/* Chapter markers */}
        {activeChapters &&
          state.duration > 0 &&
          activeChapters.map((ch, i) => (
            <div
              key={i}
              style={getChapterMarkerStyle((ch.time / state.duration) * 100)}
            />
          ))}
      </div>
      <div
        style={getProgressThumbStyle(
          progress,
          accentColor,
          hoverProgress !== null || isDragging
        )}
      />
      {/* Thumbnail preview */}
      {thumbFrame !== null && previewThumbnails && hoverProgress !== null && (
        <div
          style={getPreviewThumbnailStyle(
            hoverProgress,
            previewThumbnails,
            thumbFrame
          )}
        />
      )}
      {/* Hover tooltip */}
      {hoverProgress !== null && state.duration > 0 && (
        <div style={getTooltipStyle(hoverProgress)}>
          {nearChapter?.label ??
            formatTime((hoverProgress / 100) * state.duration)}
        </div>
      )}
    </div>
  );

  const rightGroup = (
    <div style={getControlGroupStyle()}>
      {tracks && tracks.length > 0 && (
        <button
          type="button"
          data-vplayer-btn=""
          style={buttonStyle}
          onClick={() => setShowCCMenu(!showCCMenu)}
          aria-label="Captions"
          aria-expanded={showCCMenu}
        >
          <CCIcon
            size={18}
            color={activeTrack !== null ? accentColor : iconColor}
          />
        </button>
      )}

      <button
        type="button"
        data-vplayer-btn=""
        style={{
          ...buttonStyle,
          fontSize: "12px",
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
        }}
        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
        aria-label="Playback speed"
        aria-expanded={showSpeedMenu}
      >
        {state.playbackRate === 1 ? (
          <SettingsIcon size={18} color={iconColor} />
        ) : (
          <span style={{ color: accentColor }}>{state.playbackRate}×</span>
        )}
      </button>

      {supportsPip && !disablePictureInPicture && (
        <button
          type="button"
          data-vplayer-btn=""
          style={buttonStyle}
          onClick={togglePip}
          aria-label="Picture in picture"
        >
          <PipIcon size={18} color={iconColor} />
        </button>
      )}

      <button
        type="button"
        data-vplayer-btn=""
        style={buttonStyle}
        onClick={toggleFullscreen}
        aria-label={
          state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
        }
      >
        {state.isFullscreen ? (
          <ExitFullscreenIcon size={18} color={iconColor} />
        ) : (
          <FullscreenIcon size={18} color={iconColor} />
        )}
      </button>
    </div>
  );

  // ---- Imperative handle ----
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        const v = videoRef.current;
        if (v) v.play().catch(() => {});
      },
      pause: () => {
        const v = videoRef.current;
        if (v) v.pause();
      },
      seek: (time: number) => {
        const v = videoRef.current;
        if (v) v.currentTime = clamp(time, 0, v.duration || Infinity);
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
      getDuration: () => videoRef.current?.duration ?? 0,
      getVolume: () => videoRef.current?.volume ?? state.volume,
      setVolume: (volume: number) => setVolumeLevel(volume),
      toggleMute: () => toggleMute(),
      toggleFullscreen: () => toggleFullscreen(),
      getVideoElement: () => videoRef.current,
    }),
    [state.volume, toggleMute, toggleFullscreen, setVolumeLevel]
  );

  return (
    <div
      ref={containerRef}
      className={className}
      data-vplayer-root=""
      data-vplayer-id={instanceId}
      style={{ ...getContainerStyle(width), ...style }}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel || `Video player${title ? `: ${title}` : ""}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseMove}
    >
      {/* Per-instance caption styling via ::cue */}
      {captionStyle && (
        <style>
          {`[data-vplayer-id="${instanceId}"] video::cue {` +
            (captionStyle.color ? `color:${captionStyle.color};` : "") +
            (captionStyle.background
              ? `background-color:${captionStyle.background};`
              : "") +
            (captionStyle.fontSize ? `font-size:${captionStyle.fontSize};` : "") +
            (captionStyle.fontFamily
              ? `font-family:${captionStyle.fontFamily};`
              : "") +
            `}`}
        </style>
      )}
      {/* Aspect ratio box */}
      <div data-vplayer-aspect="" style={getAspectBoxStyle(ratio)}>
        <div data-vplayer-inner="" style={getInnerStyle()}>
          {/* ---- Native Video ---- */}
          {isNative && hasSource && (
            <video
              ref={videoRef}
              src={parsed.embedUrl}
              poster={posterUrl}
              preload={preload}
              loop={loop}
              autoPlay={autoPlay}
              muted={state.isMuted}
              crossOrigin={crossOrigin}
              playsInline
              style={getVideoStyle()}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleDurationChange}
              onTimeUpdate={handleTimeUpdate}
              onProgress={handleProgress}
              onWaiting={handleWaiting}
              onCanPlay={handleCanPlay}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onRateChange={handleRateChangeEvent}
              onEnded={handleVideoEnded}
              onError={handleError}
              onClick={togglePlay}
              onDoubleClick={toggleFullscreen}
              aria-hidden="true"
            >
              {tracks?.map((t, i) => (
                <track
                  key={i}
                  kind="subtitles"
                  src={t.src}
                  srcLang={t.lang}
                  label={t.label}
                  default={t.default}
                />
              ))}
            </video>
          )}

          {/* ---- Embed (YouTube / Vimeo / Bilibili) ---- */}
          {!isNative && embedStarted && (
            <iframe
              src={`${parsed.embedUrl}&autoplay=1`}
              style={getIframeStyle()}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || "Embedded video"}
              loading="lazy"
            />
          )}

          {/* ---- Captions ----
              Drawn here rather than by the browser so they can sit inside the
              picture (not the letterbox) and above the control bar. */}
          {showCaptions && metrics.box && (
            <div style={getCaptionLayerStyle(metrics.box)}>
              {topCues.length > 0 && renderCues(topCues, "top")}
              {bottomCues.length > 0 && renderCues(bottomCues, "bottom")}
            </div>
          )}

          {/* ---- Poster Overlay (fade transition) ---- */}
          <div
            style={getPosterOverlayStyle(posterUrl, showPoster)}
            onClick={showPoster ? startPlayback : undefined}
            aria-hidden={!showPoster}
          >
            <div style={getPosterGradientStyle()} />
            <button
              type="button"
              data-vplayer-poster-button=""
              style={getPlayButtonLargeStyle(accentColor)}
              tabIndex={showPoster ? 0 : -1}
              aria-label="Play video"
            >
              {/* A triangle's visual centre sits a third of the way from its
                  base, so a mathematically centred glyph reads as left of
                  centre — nudged back toward the point. */}
              <PlayIcon
                size={30}
                color={iconColor}
                style={{
                  width: "42%",
                  height: "42%",
                  transform: "translateX(4%)",
                }}
              />
            </button>
          </div>

          {/* ---- Loading Spinner ---- */}
          {state.isLoading && state.hasStarted && !state.error && (
            <div style={getLoadingOverlayStyle()}>
              <SpinnerIcon size={40} color={iconColor} />
            </div>
          )}

          {/* ---- Error State ---- */}
          {(state.error || hlsError || !hasSource) && (
            <div style={getErrorOverlayStyle()}>
              <ErrorIcon size={40} color={iconColor} />
              <span style={getErrorMessageStyle()}>
                {!hasSource
                  ? "No video source provided"
                  : hlsError
                    ? "HLS playback is not supported in this browser"
                    : state.error?.code === 4
                      ? "This video format is not supported"
                      : "Video could not be loaded"}
              </span>
            </div>
          )}

          {/* ---- Title ---- */}
          {title && state.hasStarted && controlsVisible && (
            <div style={getTitleOverlayStyle()}>{title}</div>
          )}

          {/* ---- Keyboard Shortcuts Overlay ---- */}
          {showShortcuts && (
            <div
              style={getShortcutsOverlayStyle()}
              onClick={() => setShowShortcuts(false)}
            >
              <div
                style={getShortcutsBoxStyle()}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "12px",
                    fontSize: "14px",
                  }}
                >
                  Keyboard Shortcuts
                </div>
                {getShortcuts(seekStep, volumeStep).map(([key, label]) => (
                  <div key={key} style={getShortcutRowStyle()}>
                    <kbd style={getKbdStyle()}>{key}</kbd>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.75)",
                        fontSize: "13px",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- CC Menu Overlay ---- */}
          {showCCMenu && tracks && tracks.length > 0 && (
            <div
              style={getMenuOverlayStyle()}
              onClick={() => setShowCCMenu(false)}
            >
              <div
                style={getMenuPanelStyle()}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  data-vplayer-menu-item=""
                  autoFocus={activeTrack === null}
                  style={getSpeedMenuItemStyle(
                    activeTrack === null,
                    accentColor
                  )}
                  onClick={() => {
                    setActiveTrack(null);
                    setShowCCMenu(false);
                  }}
                >
                  Off
                </button>
                {tracks.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    data-vplayer-menu-item=""
                    autoFocus={activeTrack === i}
                    style={getSpeedMenuItemStyle(
                      activeTrack === i,
                      accentColor
                    )}
                    onClick={() => {
                      setActiveTrack(i);
                      setShowCCMenu(false);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Speed Menu Overlay ---- */}
          {showSpeedMenu && (
            <div
              style={getMenuOverlayStyle()}
              onClick={() => setShowSpeedMenu(false)}
            >
              <div
                style={getMenuPanelStyle()}
                onClick={(e) => e.stopPropagation()}
              >
                {resolvedRates.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    data-vplayer-menu-item=""
                    autoFocus={state.playbackRate === rate}
                    style={getSpeedMenuItemStyle(
                      state.playbackRate === rate,
                      accentColor
                    )}
                    onClick={() => setPlaybackRate(rate)}
                  >
                    {rate === 1 ? "Normal" : `${rate}×`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Controls (native only) ---- */}
          {isNative && state.hasStarted && (
            <div
              ref={controlsBarRef}
              style={getControlsBarStyle(controlsVisible, layoutVariant)}
              onFocus={resetHideTimer}
            >
              <div style={getControlsShellStyle(layoutVariant)}>
                {inlineLayout ? (
                  // One row: the scrubber stretches between the two readouts.
                  <div style={getInlineRowStyle()}>
                    {playButton}
                    {playlistButtons}
                    {volumeControl}
                    <span style={timeStyle}>{formatTime(state.currentTime)}</span>
                    {progressBar}
                    <span style={timeStyle}>
                      {layoutVariant === "minimal"
                        ? `−${formatTime(remainingTime)}`
                        : formatTime(state.duration)}
                    </span>
                    {rightGroup}
                  </div>
                ) : (
                  // Stacked: full-width scrubber above, controls below.
                  <>
                    {progressBar}
                    <div style={getControlsRowStyle()}>
                      <div style={getControlGroupStyle()}>
                        {playButton}
                        {playlistButtons}
                        {volumeControl}
                        <span style={timeStyle}>
                          {formatTime(state.currentTime)}
                          {" / "}
                          {formatTime(state.duration)}
                        </span>
                      </div>
                      {rightGroup}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const VPlayer = Object.assign(VPlayerBase, {
  /** Returns true if a URL is recognized as playable (platform link, media file, blob/data URL) */
  canPlay: canPlayUrl,
});
