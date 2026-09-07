// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { VPlayer } from "./VPlayer";

// jsdom's HTMLMediaElement does not implement playback
const playMock = vi.fn(() => Promise.resolve());
const pauseMock = vi.fn();

beforeEach(() => {
  playMock.mockClear();
  pauseMock.mockClear();
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: playMock,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    writable: true,
    value: pauseMock,
  });
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
});

afterEach(() => {
  cleanup();
});

function getVideo(container: HTMLElement): HTMLVideoElement {
  const video = container.querySelector("video");
  if (!video) throw new Error("video element not rendered");
  return video;
}

describe("VPlayer rendering", () => {
  it("renders a native video element for an mp4 source", () => {
    const { container } = render(<VPlayer src="/clip.mp4" />);
    const video = getVideo(container);
    expect(video.getAttribute("src")).toBe("/clip.mp4");
  });

  it("renders no video element for a YouTube source", () => {
    const { container } = render(
      <VPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
    );
    expect(container.querySelector("video")).toBeNull();
    // iframe is lazy — not rendered until the poster is clicked
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("loads the YouTube iframe after clicking the poster play button", () => {
    const { container, getByLabelText } = render(
      <VPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
    );
    fireEvent.click(getByLabelText("Play video"));
    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute("src")).toContain("youtube-nocookie.com");
    expect(iframe!.getAttribute("src")).toContain("autoplay=1");
  });

  it("shows an error message when src is an empty array", () => {
    const { container, getByText } = render(<VPlayer src={[]} />);
    expect(container.querySelector("video")).toBeNull();
    expect(getByText("No video to play")).toBeTruthy();
    // Nothing to retry when there was never a source
    expect(container.querySelector("[data-vplayer-retry]")).toBeNull();
  });

  it("shows an HLS error when the browser cannot play .m3u8", () => {
    // jsdom's canPlayType always returns "" — behaves like an unsupporting browser
    const { getByText } = render(<VPlayer src="/stream.m3u8" />);
    expect(getByText("This browser can’t play HLS")).toBeTruthy();
  });

  it("hides the poster play button behind an error", () => {
    const { container } = render(<VPlayer src={[]} />);
    const play = container.querySelector(
      "[data-vplayer-poster-button]"
    ) as HTMLElement;
    // It used to glow through the translucent error overlay
    expect(play.hidden).toBe(true);
    expect(play.getAttribute("tabindex")).toBe("-1");
  });

  it("names a load failure without blaming the format, and offers a retry", () => {
    const { container, getByText } = render(<VPlayer src="/clip.mp4" />);
    const video = getVideo(container);
    Object.defineProperty(video, "error", {
      configurable: true,
      value: { code: 4 },
    });
    act(() => {
      fireEvent(video, new Event("error"));
    });
    expect(getByText("This video couldn’t be loaded")).toBeTruthy();
    expect(container.querySelector("[data-vplayer-retry]")).not.toBeNull();
  });

  it("passes crossOrigin through to the video element", () => {
    const { container } = render(
      <VPlayer src="/clip.mp4" crossOrigin="anonymous" />
    );
    expect(getVideo(container).getAttribute("crossorigin")).toBe("anonymous");
  });

  it("renders subtitle tracks", () => {
    const { container } = render(
      <VPlayer
        src="/clip.mp4"
        tracks={[
          { src: "/en.vtt", label: "English", lang: "en", default: true },
          { src: "/es.vtt", label: "Spanish", lang: "es" },
        ]}
      />
    );
    const tracks = container.querySelectorAll("track");
    expect(tracks.length).toBe(2);
    expect(tracks[0].getAttribute("srclang")).toBe("en");
  });

  it("injects a ::cue style block when captionStyle is set", () => {
    const { container } = render(
      <VPlayer src="/clip.mp4" captionStyle={{ color: "yellow" }} />
    );
    const style = container.querySelector("style");
    expect(style).not.toBeNull();
    expect(style!.textContent).toContain("::cue");
    expect(style!.textContent).toContain("color:yellow;");
  });
});

describe("VPlayer.canPlay", () => {
  it("is exposed as a static method", () => {
    expect(VPlayer.canPlay("/video.mp4")).toBe(true);
    expect(VPlayer.canPlay("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
    expect(VPlayer.canPlay("https://example.com/page.html")).toBe(false);
  });
});

describe("VPlayer playback control", () => {
  it("starts playback when the poster play button is clicked", () => {
    const { getByLabelText } = render(<VPlayer src="/clip.mp4" />);
    fireEvent.click(getByLabelText("Play video"));
    expect(playMock).toHaveBeenCalled();
  });

  it("toggles play from the keyboard when focused", () => {
    const { container } = render(<VPlayer src="/clip.mp4" />);
    const root = container.firstElementChild as HTMLElement;
    fireEvent.focus(root);
    fireEvent.keyDown(root, { key: "k" });
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it("ignores keyboard shortcuts with modifier keys held", () => {
    const { container } = render(<VPlayer src="/clip.mp4" />);
    const root = container.firstElementChild as HTMLElement;
    fireEvent.focus(root);
    fireEvent.keyDown(root, { key: "k", metaKey: true });
    fireEvent.keyDown(root, { key: "f", ctrlKey: true });
    expect(playMock).not.toHaveBeenCalled();
  });

  it("plays on mount when the controlled playing prop is true", () => {
    render(<VPlayer src="/clip.mp4" playing />);
    expect(playMock).toHaveBeenCalled();
  });

  it("pauses when the controlled playing prop flips to false", () => {
    const { container, rerender } = render(<VPlayer src="/clip.mp4" playing />);
    const video = getVideo(container);
    Object.defineProperty(video, "paused", { configurable: true, value: false });
    rerender(<VPlayer src="/clip.mp4" playing={false} />);
    expect(pauseMock).toHaveBeenCalled();
  });
});

describe("VPlayer callbacks", () => {
  it("fires onReady once per source on canplay", () => {
    const onReady = vi.fn();
    const { container } = render(<VPlayer src="/clip.mp4" onReady={onReady} />);
    const video = getVideo(container);
    fireEvent(video, new Event("canplay"));
    fireEvent(video, new Event("canplay"));
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("fires onStart on first play and onPlay on every play", () => {
    const onStart = vi.fn();
    const onPlay = vi.fn();
    const { container } = render(
      <VPlayer src="/clip.mp4" onStart={onStart} onPlay={onPlay} />
    );
    const video = getVideo(container);
    fireEvent(video, new Event("play"));
    fireEvent(video, new Event("play"));
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledTimes(2);
  });

  it("fires onDurationChange when duration becomes known", () => {
    const onDurationChange = vi.fn();
    const { container } = render(
      <VPlayer src="/clip.mp4" onDurationChange={onDurationChange} />
    );
    const video = getVideo(container);
    Object.defineProperty(video, "duration", { configurable: true, value: 120 });
    fireEvent(video, new Event("durationchange"));
    expect(onDurationChange).toHaveBeenCalledWith(120);
  });

  it("pauses and fires onEnded at endTime", () => {
    const onEnded = vi.fn();
    const { container } = render(
      <VPlayer src="/clip.mp4" endTime={20} onEnded={onEnded} />
    );
    const video = getVideo(container);
    Object.defineProperty(video, "currentTime", {
      configurable: true,
      writable: true,
      value: 25,
    });
    fireEvent(video, new Event("timeupdate"));
    expect(pauseMock).toHaveBeenCalled();
    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it("fires onRateChange from the ratechange event", () => {
    const onRateChange = vi.fn();
    const { container } = render(
      <VPlayer src="/clip.mp4" onRateChange={onRateChange} />
    );
    const video = getVideo(container);
    Object.defineProperty(video, "playbackRate", {
      configurable: true,
      writable: true,
      value: 1.5,
    });
    fireEvent(video, new Event("ratechange"));
    expect(onRateChange).toHaveBeenCalledWith(1.5);
  });
});

describe("VPlayer review regressions", () => {
  it("keeps the muted prop when a positive volume prop is set (muted autoplay)", () => {
    const { container } = render(
      <VPlayer src="/clip.mp4" autoPlay muted volume={0.7} />
    );
    const video = getVideo(container);
    expect(video.muted).toBe(true);
    expect(video.volume).toBeCloseTo(0.7);
  });

  it("keeps the muted prop when persistVolume restores a stored volume", () => {
    localStorage.setItem("vplayer-volume", "0.8");
    const { container } = render(<VPlayer src="/clip.mp4" muted persistVolume />);
    expect(getVideo(container).muted).toBe(true);
  });

  it("suppresses the paired onPause after a clip-end (endTime) stop", () => {
    const onEnded = vi.fn();
    const onPause = vi.fn();
    const { container } = render(
      <VPlayer src="/clip.mp4" endTime={20} onEnded={onEnded} onPause={onPause} />
    );
    const video = getVideo(container);
    Object.defineProperty(video, "currentTime", {
      configurable: true,
      writable: true,
      value: 25,
    });
    fireEvent(video, new Event("timeupdate"));
    fireEvent(video, new Event("pause"));
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(onPause).not.toHaveBeenCalled();
  });

  it("re-applies controlled playing when src changes", () => {
    const { rerender } = render(<VPlayer src="/a.mp4" playing />);
    expect(playMock).toHaveBeenCalledTimes(1);
    rerender(<VPlayer src="/b.mp4" playing />);
    expect(playMock).toHaveBeenCalledTimes(2);
  });

  it("attaches touch scrubbing to the progress bar once controls mount", () => {
    const onSeek = vi.fn();
    const { container } = render(<VPlayer src="/clip.mp4" onSeek={onSeek} />);
    const video = getVideo(container);
    Object.defineProperty(video, "duration", { configurable: true, value: 100 });
    Object.defineProperty(video, "currentTime", {
      configurable: true,
      writable: true,
      value: 0,
    });
    act(() => {
      fireEvent(video, new Event("play"));
    });
    const slider = container.querySelector('[aria-label="Seek"]') as HTMLElement;
    expect(slider).not.toBeNull();
    fireEvent.touchStart(slider, { touches: [{ clientX: 50 }] });
    // jsdom rects are zero-sized, so the seek clamps to 100% of duration
    expect(video.currentTime).toBe(100);
    fireEvent.touchEnd(window, { touches: [] });
    expect(onSeek).toHaveBeenCalledWith(100);
  });

  it("ignores progress clicks while duration is not finite (live streams)", () => {
    const onSeek = vi.fn();
    const { container } = render(<VPlayer src="/clip.mp4" onSeek={onSeek} />);
    const video = getVideo(container);
    Object.defineProperty(video, "duration", {
      configurable: true,
      value: Infinity,
    });
    act(() => {
      fireEvent(video, new Event("play"));
    });
    const slider = container.querySelector('[aria-label="Seek"]') as HTMLElement;
    fireEvent.click(slider, { clientX: 50 });
    expect(onSeek).not.toHaveBeenCalled();
  });

  it("mutes on volume-button click (accessible name matches behavior)", () => {
    const { container, getByLabelText } = render(<VPlayer src="/clip.mp4" />);
    const video = getVideo(container);
    act(() => {
      fireEvent(video, new Event("play"));
    });
    fireEvent.click(getByLabelText("Mute"));
    expect(video.muted).toBe(true);
    expect(getByLabelText("Unmute")).toBeTruthy();
  });
});

describe("VPlayer volume persistence", () => {
  it("applies the persisted volume to the media element on load", () => {
    localStorage.setItem("vplayer-volume", "0.4");
    const { container } = render(<VPlayer src="/clip.mp4" persistVolume />);
    const video = getVideo(container);
    Object.defineProperty(video, "duration", { configurable: true, value: 60 });
    fireEvent(video, new Event("loadedmetadata"));
    expect(video.volume).toBeCloseTo(0.4);
  });
});

describe("VPlayer accessibility", () => {
  it("labels the region with the title", () => {
    const { container } = render(<VPlayer src="/clip.mp4" title="My Movie" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("role")).toBe("region");
    expect(root.getAttribute("aria-label")).toContain("My Movie");
  });

  it("makes the seek slider focusable", () => {
    const onStart = vi.fn();
    const { container } = render(<VPlayer src="/clip.mp4" onStart={onStart} />);
    const video = getVideo(container);
    // Controls render after playback has started
    act(() => {
      fireEvent(video, new Event("play"));
    });
    const slider = container.querySelector('[aria-label="Seek"]');
    expect(slider).not.toBeNull();
    expect(slider!.getAttribute("tabindex")).toBe("0");
  });
});

// ---------------------------------------------------------------------------
// Captions
// ---------------------------------------------------------------------------

// jsdom parses <track> elements but never populates video.textTracks from
// them, so the cue pipeline is driven through a stand-in TextTrackList.
const nativeTextTracks = Object.getOwnPropertyDescriptor(
  HTMLMediaElement.prototype,
  "textTracks"
);

interface FakeTrack {
  mode: string;
  activeCues: unknown[];
  emit(type: string): void;
  addEventListener(type: string, fn: () => void): void;
  removeEventListener(type: string, fn: () => void): void;
}

function cue(text: string, over: Record<string, unknown> = {}) {
  return {
    startTime: 1,
    endTime: 4,
    text,
    align: "center",
    line: "auto",
    snapToLines: true,
    ...over,
  };
}

function makeTrack(cues: unknown[]): FakeTrack {
  const listeners = new Map<string, Set<() => void>>();
  return {
    mode: "disabled",
    activeCues: cues,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    emit(type) {
      listeners.get(type)?.forEach((fn) => fn());
    },
  };
}

function installTextTracks(tracks: FakeTrack[]) {
  const list: Record<string | number, unknown> = {
    length: tracks.length,
    addEventListener() {},
    removeEventListener() {},
  };
  tracks.forEach((t, i) => {
    list[i] = t;
  });
  Object.defineProperty(HTMLMediaElement.prototype, "textTracks", {
    configurable: true,
    get: () => list,
  });
}

function restoreTextTracks() {
  if (nativeTextTracks) {
    Object.defineProperty(
      HTMLMediaElement.prototype,
      "textTracks",
      nativeTextTracks
    );
  }
}

const EN_TRACK = [
  { src: "/en.vtt", label: "English", lang: "en", default: true },
];

describe("VPlayer captions", () => {
  afterEach(() => {
    restoreTextTracks();
  });

  it("keeps the active track hidden and paints the cues itself", () => {
    const track = makeTrack([cue("Ada is speaking")]);
    installTextTracks([track]);
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    // `showing` would let the browser draw cues under the control bar
    expect(track.mode).toBe("hidden");
    expect(container.textContent).toContain("Ada is speaking");
  });

  it("renders nothing while the track is switched off", () => {
    const track = makeTrack([cue("Should not appear")]);
    installTextTracks([track]);
    const { container } = render(
      <VPlayer
        src="/clip.mp4"
        tracks={[{ src: "/en.vtt", label: "English", lang: "en" }]}
      />
    );
    expect(track.mode).toBe("disabled");
    expect(container.querySelector("[data-vplayer-cue]")).toBeNull();
  });

  it("follows cuechange", () => {
    const track = makeTrack([cue("First line")]);
    installTextTracks([track]);
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    expect(container.textContent).toContain("First line");

    act(() => {
      track.activeCues = [cue("Second line")];
      track.emit("cuechange");
    });
    expect(container.textContent).toContain("Second line");
    expect(container.textContent).not.toContain("First line");

    act(() => {
      track.activeCues = [];
      track.emit("cuechange");
    });
    expect(container.querySelector("[data-vplayer-cue]")).toBeNull();
  });

  it("renders simultaneous cues as separate lines", () => {
    installTextTracks([makeTrack([cue("Ada:"), cue("Hello")])]);
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    expect(container.querySelectorAll("[data-vplayer-cue]").length).toBe(2);
  });

  it("splits cues into top and bottom regions", () => {
    installTextTracks([
      makeTrack([cue("On screen text", { line: 0 }), cue("Dialogue")]),
    ]);
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    const regions = container.querySelectorAll("[data-vplayer-caption-region]");
    expect(regions.length).toBe(2);
  });

  it("applies captionStyle to the rendered cue", () => {
    installTextTracks([makeTrack([cue("Styled")])]);
    const { container } = render(
      <VPlayer
        src="/clip.mp4"
        tracks={EN_TRACK}
        captionStyle={{ color: "yellow", background: "transparent" }}
      />
    );
    const el = container.querySelector("[data-vplayer-cue]") as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.style.color).toBe("yellow");
    expect(el.style.backgroundColor).toBe("transparent");
  });

  it("preserves cue markup when getCueAsHTML is available", () => {
    const fragment = document.createDocumentFragment();
    const bold = document.createElement("b");
    bold.textContent = "Loud";
    fragment.append(bold, document.createTextNode(" and clear"));
    installTextTracks([
      makeTrack([cue("<b>Loud</b> and clear", { getCueAsHTML: () => fragment })]),
    ]);
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    const el = container.querySelector("[data-vplayer-cue]") as HTMLElement;
    expect(el.querySelector("b")?.textContent).toBe("Loud");
    expect(el.textContent).toBe("Loud and clear");
  });

  it("pins the cue layer to the picture, not the letterboxed element", () => {
    installTextTracks([makeTrack([cue("In the band")])]);
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    const video = getVideo(container);
    // A 16:9 source fullscreened on a portrait phone
    for (const [prop, value] of [
      ["clientWidth", 390],
      ["clientHeight", 844],
      ["videoWidth", 1920],
      ["videoHeight", 1080],
    ] as const) {
      Object.defineProperty(video, prop, { configurable: true, value });
    }
    act(() => {
      // No ResizeObserver in jsdom, so the window fallback drives the remeasure
      fireEvent(window, new Event("resize"));
    });

    const layer = container.querySelector(
      "[data-vplayer-caption-region]"
    )!.parentElement as HTMLElement;
    // 390 / (16/9) = 219.375, centred in 844 -> top 312.3125
    expect(parseFloat(layer.style.height)).toBeCloseTo(219.375, 2);
    expect(parseFloat(layer.style.top)).toBeCloseTo(312.3125, 2);
    // The layer ends well above the bottom of the element, where the bar lives
    expect(parseFloat(layer.style.top) + parseFloat(layer.style.height)).toBeLessThan(844);
  });
});

// ---------------------------------------------------------------------------
// Control variants
// ---------------------------------------------------------------------------

describe("VPlayer control variants", () => {
  const variants = ["classic", "minimal", "floating"] as const;

  for (const variant of variants) {
    it(`renders every control in the ${variant} variant`, () => {
      const { container } = render(
        <VPlayer src="/clip.mp4" controlsVariant={variant} tracks={EN_TRACK} />
      );
      act(() => {
        fireEvent(getVideo(container), new Event("play"));
      });
      for (const label of [
        "Pause",
        "Mute",
        "Seek",
        "Captions",
        "Playback speed: 1×",
        "Enter fullscreen",
      ]) {
        expect(
          container.querySelector(`[aria-label="${label}"]`),
          `${label} missing from ${variant}`
        ).not.toBeNull();
      }
    });
  }

  it("keeps the control bar up when skipping through a playlist", () => {
    const { container } = render(<VPlayer src={["/a.mp4", "/b.mp4"]} />);
    const video = getVideo(container);
    act(() => {
      fireEvent(video, new Event("play"));
    });
    const next = container.querySelector(
      '[aria-label="Next video"]'
    ) as HTMLElement;
    expect(next).not.toBeNull();

    act(() => {
      next.click();
    });

    // The source reset used to clear hasStarted, which tore the bar down and
    // dropped the viewer back onto the poster mid-playlist.
    expect(container.querySelector('[aria-label="Seek"]')).not.toBeNull();
    expect(
      container.querySelector('[aria-label="Previous video"]')
    ).not.toBeNull();
    expect(getVideo(container).getAttribute("src")).toBe("/b.mp4");
  });

  it("returns to the poster when the src prop changes from outside", () => {
    const { container, rerender } = render(<VPlayer src="/a.mp4" />);
    act(() => {
      fireEvent(getVideo(container), new Event("play"));
    });
    expect(container.querySelector('[aria-label="Seek"]')).not.toBeNull();

    rerender(<VPlayer src="/c.mp4" />);
    // Not a playlist move — this one should reset
    expect(container.querySelector('[aria-label="Seek"]')).toBeNull();
  });

  it("anchors each menu to the control that opened it", () => {
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    act(() => {
      fireEvent(getVideo(container), new Event("play"));
    });

    const cc = container.querySelector('[aria-label="Captions"]') as HTMLElement;
    act(() => {
      cc.click();
    });
    const ccMenu = container.querySelector("[data-vplayer-menu]");
    // It used to be pinned to the player's bottom-right corner no matter which
    // control opened it, so the captions list appeared nowhere near the button
    expect(cc.parentElement!.contains(ccMenu)).toBe(true);

    const speed = container.querySelector(
      '[aria-label^="Playback speed"]'
    ) as HTMLElement;
    act(() => {
      speed.click();
    });
    const menus = container.querySelectorAll("[data-vplayer-menu]");
    // Opening one closes the other
    expect(menus.length).toBe(1);
    expect(speed.parentElement!.contains(menus[0])).toBe(true);
  });

  it("closes an open menu when the backdrop is clicked", () => {
    const { container } = render(
      <VPlayer src="/clip.mp4" tracks={EN_TRACK} />
    );
    act(() => {
      fireEvent(getVideo(container), new Event("play"));
    });
    act(() => {
      (container.querySelector('[aria-label="Captions"]') as HTMLElement).click();
    });
    expect(container.querySelector("[data-vplayer-menu]")).not.toBeNull();

    const backdrop = container.querySelector(
      '[aria-hidden="true"][style*="z-index: 19"]'
    ) as HTMLElement;
    expect(backdrop).not.toBeNull();
    act(() => {
      backdrop.click();
    });
    expect(container.querySelector("[data-vplayer-menu]")).toBeNull();
  });

  it("defaults to the classic stacked layout", () => {
    const { container } = render(<VPlayer src="/clip.mp4" />);
    act(() => {
      fireEvent(getVideo(container), new Event("play"));
    });
    const seek = container.querySelector('[aria-label="Seek"]') as HTMLElement;
    expect(seek.style.width).toBe("100%");
  });
});
