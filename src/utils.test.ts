import { describe, it, expect } from "vitest";
import { parseVideoSource, formatTime, clamp, parseAspectRatio } from "./utils";

// ---------------------------------------------------------------------------
// parseVideoSource
// ---------------------------------------------------------------------------

describe("parseVideoSource", () => {
  describe("YouTube", () => {
    it("parses a standard watch URL", () => {
      const result = parseVideoSource("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      expect(result.type).toBe("youtube");
      expect(result.videoId).toBe("dQw4w9WgXcQ");
      expect(result.embedUrl).toContain("dQw4w9WgXcQ");
      expect(result.embedUrl).toContain("youtube-nocookie.com");
    });

    it("parses a youtu.be short URL", () => {
      const result = parseVideoSource("https://youtu.be/dQw4w9WgXcQ");
      expect(result.type).toBe("youtube");
      expect(result.videoId).toBe("dQw4w9WgXcQ");
    });

    it("parses a YouTube embed URL", () => {
      const result = parseVideoSource("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(result.type).toBe("youtube");
      expect(result.videoId).toBe("dQw4w9WgXcQ");
    });

    it("parses a YouTube Shorts URL", () => {
      const result = parseVideoSource("https://www.youtube.com/shorts/dQw4w9WgXcQ");
      expect(result.type).toBe("youtube");
      expect(result.videoId).toBe("dQw4w9WgXcQ");
    });
  });

  describe("Vimeo", () => {
    it("parses a standard vimeo URL", () => {
      const result = parseVideoSource("https://vimeo.com/123456789");
      expect(result.type).toBe("vimeo");
      expect(result.videoId).toBe("123456789");
      expect(result.embedUrl).toContain("player.vimeo.com");
      expect(result.embedUrl).toContain("123456789");
    });
  });

  describe("Bilibili", () => {
    it("parses a BV-style bilibili URL", () => {
      const result = parseVideoSource("https://www.bilibili.com/video/BV1xx411c7mD");
      expect(result.type).toBe("bilibili");
      expect(result.videoId).toBe("BV1xx411c7mD");
      expect(result.embedUrl).toContain("bvid=BV1xx411c7mD");
    });

    it("parses an av-style bilibili URL", () => {
      const result = parseVideoSource("https://www.bilibili.com/video/av12345678");
      expect(result.type).toBe("bilibili");
      expect(result.videoId).toBe("12345678");
      expect(result.embedUrl).toContain("aid=12345678");
    });
  });

  describe("Native", () => {
    it("treats an mp4 path as native", () => {
      const result = parseVideoSource("/videos/clip.mp4");
      expect(result.type).toBe("native");
      expect(result.videoId).toBe("");
      expect(result.embedUrl).toBe("/videos/clip.mp4");
    });

    it("treats a blob URL as native", () => {
      const result = parseVideoSource("blob:https://example.com/abc-123");
      expect(result.type).toBe("native");
    });

    it("treats an unrecognised http URL as native", () => {
      const result = parseVideoSource("https://cdn.example.com/video.webm");
      expect(result.type).toBe("native");
      expect(result.embedUrl).toBe("https://cdn.example.com/video.webm");
    });
  });
});

// ---------------------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------------------

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("0:00");
  });

  it("formats sub-minute durations", () => {
    expect(formatTime(45)).toBe("0:45");
  });

  it("pads seconds with leading zero", () => {
    expect(formatTime(65)).toBe("1:05");
  });

  it("formats exactly one hour", () => {
    expect(formatTime(3600)).toBe("1:00:00");
  });

  it("formats hours:minutes:seconds", () => {
    expect(formatTime(3661)).toBe("1:01:01");
  });

  it("handles NaN", () => {
    expect(formatTime(NaN)).toBe("0:00");
  });

  it("handles Infinity", () => {
    expect(formatTime(Infinity)).toBe("0:00");
  });
});

// ---------------------------------------------------------------------------
// clamp
// ---------------------------------------------------------------------------

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 1)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(2, 0, 1)).toBe(1);
  });

  it("handles exact boundary values", () => {
    expect(clamp(0, 0, 1)).toBe(0);
    expect(clamp(1, 0, 1)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// parseAspectRatio
// ---------------------------------------------------------------------------

describe("parseAspectRatio", () => {
  it("parses 16:9", () => {
    expect(parseAspectRatio("16:9")).toBeCloseTo(9 / 16);
  });

  it("parses 4:3", () => {
    expect(parseAspectRatio("4:3")).toBeCloseTo(3 / 4);
  });

  it("parses 1:1", () => {
    expect(parseAspectRatio("1:1")).toBe(1);
  });

  it("falls back to 16:9 for invalid input", () => {
    expect(parseAspectRatio("bad")).toBeCloseTo(9 / 16);
  });

  it("falls back to 16:9 when parts are zero", () => {
    expect(parseAspectRatio("0:9")).toBeCloseTo(9 / 16);
  });

  it("falls back to 16:9 for empty string", () => {
    expect(parseAspectRatio("")).toBeCloseTo(9 / 16);
  });
});
