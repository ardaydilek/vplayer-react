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
    expect(getByText("No video source provided")).toBeTruthy();
  });

  it("shows an HLS error when the browser cannot play .m3u8", () => {
    // jsdom's canPlayType always returns "" — behaves like an unsupporting browser
    const { getByText } = render(<VPlayer src="/stream.m3u8" />);
    expect(getByText("HLS playback is not supported in this browser")).toBeTruthy();
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
