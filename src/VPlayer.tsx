"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { VPlayerProps, VideoState } from "./types";
import { parseVideoSource, formatTime, clamp, parseAspectRatio } from "./utils";
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
} from "./icons";
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
  getControlGroupStyle,
  getControlButtonStyle,
  getTimeDisplayStyle,
  getVolumeSliderContainerStyle,
  getVolumeSliderTrackStyle,
  getVolumeSliderFillStyle,
  getVolumeSliderThumbStyle,
  getLoadingOverlayStyle,
  getTitleOverlayStyle,
  getSpeedMenuStyle,
  getSpeedMenuItemStyle,
  getTooltipStyle,
  injectKeyframes,
} from "./styles";

const DEFAULT_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%23111' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' dominantBaseline='central' textAnchor='middle' fontFamily='system-ui' fontSize='48' fill='%23333'%3EVideo%3C/text%3E%3C/svg%3E";

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const HIDE_CONTROLS_DELAY = 3000;

export function VPlayer({
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
  ariaLabel,
}: VPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);
  const hasStartedRef = useRef(false);

  const parsed = parseVideoSource(src);
  const ratio = parseAspectRatio(aspectRatio);
  const isNative = parsed.type === "native";

  const [state, setState] = useState<VideoState>({
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
    playbackRate: 1,
  });

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [embedStarted, setEmbedStarted] = useState(false);
  const [supportsPip, setSupportsPip] = useState(false);

  // Inject keyframes for spinner & detect PiP support
  useEffect(() => {
    injectKeyframes();
    setSupportsPip("pictureInPictureEnabled" in document);
  }, []);

  // Keep refs in sync for use inside resetHideTimer
  useEffect(() => { isPlayingRef.current = state.isPlaying; }, [state.isPlaying]);
  useEffect(() => { hasStartedRef.current = state.hasStarted; }, [state.hasStarted]);

  // Auto-hide controls
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

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => {
      setState((s) => ({
        ...s,
        isFullscreen: !!document.fullscreenElement,
      }));
    };
    document.addEventListener("fullscreenchange", handleFSChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFSChange);
  }, []);

  // Reset player state when src changes
  useEffect(() => {
    setState((s) => ({
      ...s,
      currentTime: 0,
      duration: 0,
      hasStarted: false,
      isPlaying: false,
      buffered: 0,
      isLoading: false,
    }));
    setEmbedStarted(false);
  }, [src]);

  // ---- Native Video Event Handlers ----
  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      duration: v.duration,
      isLoading: false,
    }));
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setState((s) => ({
      ...s,
      currentTime: v.currentTime,
    }));
    onTimeUpdate?.(v.currentTime, v.duration);
  }, [onTimeUpdate]);

  const handleProgress = useCallback(() => {
    const v = videoRef.current;
    if (!v || v.buffered.length === 0) return;
    const end = v.buffered.end(v.buffered.length - 1);
    setState((s) => ({
      ...s,
      buffered: v.duration ? (end / v.duration) * 100 : 0,
    }));
  }, []);

  const handleWaiting = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true }));
  }, []);

  const handleCanPlay = useCallback(() => {
    setState((s) => ({ ...s, isLoading: false }));
  }, []);

  const handleVideoEnded = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false, showControls: true }));
    onEnded?.();
  }, [onEnded]);

  // ---- Play / Pause ----
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

  // ---- Seek ----
  const handleProgressClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
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

  const handleProgressMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;
      const rect = bar.getBoundingClientRect();

      const onMove = (ev: globalThis.MouseEvent) => {
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
  const toggleMute = useCallback(() => {
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

  const handleVolumeChange = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
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

  // ---- Fullscreen ----
  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
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

  const handleBlur = useCallback(() => {
    setState((s) => ({ ...s, isFocused: false }));
    setShowSpeedMenu(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
            isMuted: v.volume === 0,
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
      resetHideTimer,
    ]
  );

  // Mouse activity
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

  // Compute progress
  const progress =
    state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const posterUrl = poster || DEFAULT_POSTER;
  const showPoster = !state.hasStarted;
  const controlsVisible =
    state.showControls || !state.isPlaying || isDragging || showSpeedMenu;

  // Volume icon
  const VolumeIcon = state.isMuted
    ? VolumeMuteIcon
    : state.volume < 0.5
      ? VolumeLowIcon
      : VolumeHighIcon;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...getContainerStyle(width, state.isFocused), ...style }}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel || `Video player${title ? `: ${title}` : ""}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Aspect ratio box */}
      <div style={getAspectBoxStyle(ratio)}>
        <div style={getInnerStyle()}>
          {/* ---- Native Video ---- */}
          {isNative && (
            <video
              ref={videoRef}
              src={parsed.embedUrl}
              poster={posterUrl}
              preload={preload}
              loop={loop}
              autoPlay={autoPlay}
              muted={state.isMuted}
              playsInline
              style={getVideoStyle()}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onProgress={handleProgress}
              onWaiting={handleWaiting}
              onCanPlay={handleCanPlay}
              onEnded={handleVideoEnded}
              onClick={togglePlay}
              aria-hidden="true"
            />
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

          {/* ---- Poster Overlay ---- */}
          {showPoster && (
            <div
              style={getPosterOverlayStyle(posterUrl)}
              onClick={startPlayback}
              role="button"
              tabIndex={-1}
              aria-label="Play video"
            >
              <div style={getPosterGradientStyle()} />
              <button
                type="button"
                style={getPlayButtonLargeStyle(accentColor)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
                aria-label="Play video"
              >
                <PlayIcon size={32} color={iconColor} />
              </button>
            </div>
          )}

          {/* ---- Loading Spinner ---- */}
          {state.isLoading && state.hasStarted && (
            <div style={getLoadingOverlayStyle()}>
              <SpinnerIcon size={40} color={iconColor} />
            </div>
          )}

          {/* ---- Title ---- */}
          {title && state.hasStarted && controlsVisible && (
            <div style={getTitleOverlayStyle()}>{title}</div>
          )}

          {/* ---- Controls (native only) ---- */}
          {isNative && state.hasStarted && (
            <div style={getControlsBarStyle(controlsVisible)}>
              {/* Progress bar */}
              <div
                ref={progressRef}
                style={getProgressContainerStyle()}
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
                onMouseMove={handleProgressHover}
                onMouseLeave={() => setHoverProgress(null)}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-valuetext={`${formatTime(state.currentTime)} of ${formatTime(state.duration)}`}
                tabIndex={-1}
              >
                <div
                  style={{
                    ...getProgressTrackStyle(),
                    height:
                      hoverProgress !== null || isDragging ? "6px" : "4px",
                  }}
                >
                  <div style={getProgressBufferStyle(state.buffered)} />
                  <div
                    style={getProgressFillStyle(progress, accentColor)}
                  />
                </div>
                <div
                  style={getProgressThumbStyle(
                    progress,
                    accentColor,
                    hoverProgress !== null || isDragging
                  )}
                />
                {/* Hover tooltip */}
                {hoverProgress !== null && state.duration > 0 && (
                  <div style={getTooltipStyle(hoverProgress)}>
                    {formatTime((hoverProgress / 100) * state.duration)}
                  </div>
                )}
              </div>

              {/* Controls row */}
              <div style={getControlsRowStyle()}>
                {/* Left group */}
                <div style={getControlGroupStyle()}>
                  <button
                    type="button"
                    style={getControlButtonStyle()}
                    onClick={togglePlay}
                    aria-label={state.isPlaying ? "Pause" : "Play"}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                    }}
                  >
                    {state.isPlaying ? (
                      <PauseIcon size={20} color={iconColor} />
                    ) : (
                      <PlayIcon size={20} color={iconColor} />
                    )}
                  </button>

                  {/* Volume */}
                  <div
                    style={getVolumeSliderContainerStyle()}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <button
                      type="button"
                      style={getControlButtonStyle()}
                      onClick={toggleMute}
                      aria-label={state.isMuted ? "Unmute" : "Mute"}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "rgba(255,255,255,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "transparent";
                      }}
                    >
                      <VolumeIcon size={20} color={iconColor} />
                    </button>
                    {showVolumeSlider && (
                      <div
                        style={getVolumeSliderTrackStyle()}
                        onClick={handleVolumeChange}
                        role="slider"
                        aria-label="Volume"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(
                          (state.isMuted ? 0 : state.volume) * 100
                        )}
                        tabIndex={-1}
                      >
                        <div
                          style={getVolumeSliderFillStyle(
                            state.isMuted ? 0 : state.volume,
                            accentColor
                          )}
                        />
                        <div
                          style={getVolumeSliderThumbStyle(
                            state.isMuted ? 0 : state.volume,
                            accentColor
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <span style={getTimeDisplayStyle()}>
                    {formatTime(state.currentTime)}
                    {" / "}
                    {formatTime(state.duration)}
                  </span>
                </div>

                {/* Right group */}
                <div style={getControlGroupStyle()}>
                  {/* Speed */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      style={{
                        ...getControlButtonStyle(),
                        fontSize: "12px",
                        fontWeight: 600,
                        minWidth: "32px",
                      }}
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      aria-label="Playback speed"
                      aria-expanded={showSpeedMenu}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "rgba(255,255,255,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "transparent";
                      }}
                    >
                      {state.playbackRate === 1 ? (
                        <SettingsIcon size={18} color={iconColor} />
                      ) : (
                        <span style={{ color: accentColor }}>
                          {state.playbackRate}x
                        </span>
                      )}
                    </button>
                    {showSpeedMenu && (
                      <div style={getSpeedMenuStyle()}>
                        {PLAYBACK_RATES.map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            style={getSpeedMenuItemStyle(
                              state.playbackRate === rate,
                              accentColor
                            )}
                            onClick={() => setPlaybackRate(rate)}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255,255,255,0.08)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "transparent";
                            }}
                          >
                            {rate === 1 ? "Normal" : `${rate}x`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PiP */}
                  {supportsPip && (
                    <button
                      type="button"
                      style={getControlButtonStyle()}
                      onClick={togglePip}
                      aria-label="Picture in Picture"
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "rgba(255,255,255,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "transparent";
                      }}
                    >
                      <PipIcon size={18} color={iconColor} />
                    </button>
                  )}

                  {/* Fullscreen */}
                  <button
                    type="button"
                    style={getControlButtonStyle()}
                    onClick={toggleFullscreen}
                    aria-label={
                      state.isFullscreen
                        ? "Exit fullscreen"
                        : "Enter fullscreen"
                    }
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "rgba(255,255,255,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                    }}
                  >
                    {state.isFullscreen ? (
                      <ExitFullscreenIcon size={18} color={iconColor} />
                    ) : (
                      <FullscreenIcon size={18} color={iconColor} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
