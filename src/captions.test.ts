import { describe, it, expect } from "vitest";
import {
  snapshotCue,
  getVideoContentBox,
  sameContentBox,
  getCaptionFontSize,
  stripCueTags,
} from "./captions";

function fakeCue(over: Record<string, unknown> = {}) {
  return {
    startTime: 1,
    endTime: 3,
    text: "Hello",
    align: "center",
    line: "auto",
    snapToLines: true,
    ...over,
  } as unknown as TextTrackCue;
}

function fakeVideo(over: {
  clientWidth?: number;
  clientHeight?: number;
  videoWidth?: number;
  videoHeight?: number;
}) {
  return {
    clientWidth: 0,
    clientHeight: 0,
    videoWidth: 0,
    videoHeight: 0,
    ...over,
  } as HTMLVideoElement;
}

describe("getVideoContentBox", () => {
  it("returns the full element box when the frame fills it", () => {
    const box = getVideoContentBox(
      fakeVideo({
        clientWidth: 640,
        clientHeight: 360,
        videoWidth: 1920,
        videoHeight: 1080,
      })
    );
    expect(box).toEqual({ left: 0, top: 0, width: 640, height: 360 });
  });

  it("excludes the letterbox bars of a 16:9 clip in a portrait element", () => {
    // 390x844 phone in fullscreen, 16:9 source -> 390x219.375 band, centred
    const box = getVideoContentBox(
      fakeVideo({
        clientWidth: 390,
        clientHeight: 844,
        videoWidth: 1920,
        videoHeight: 1080,
      })
    );
    expect(box.width).toBeCloseTo(390, 5);
    expect(box.height).toBeCloseTo(219.375, 3);
    expect(box.left).toBeCloseTo(0, 5);
    expect(box.top).toBeCloseTo((844 - 219.375) / 2, 3);
    // The picture ends far above the bottom of the element
    expect(box.top + box.height).toBeLessThan(844);
  });

  it("excludes pillarbox bars of a portrait clip in a landscape element", () => {
    const box = getVideoContentBox(
      fakeVideo({
        clientWidth: 800,
        clientHeight: 450,
        videoWidth: 1080,
        videoHeight: 1920,
      })
    );
    expect(box.height).toBeCloseTo(450, 5);
    expect(box.width).toBeCloseTo(253.125, 3);
    expect(box.left).toBeCloseTo((800 - 253.125) / 2, 3);
  });

  it("falls back to the element box before the intrinsic size is known", () => {
    const box = getVideoContentBox(
      fakeVideo({ clientWidth: 640, clientHeight: 360 })
    );
    expect(box).toEqual({ left: 0, top: 0, width: 640, height: 360 });
  });
});

describe("sameContentBox", () => {
  it("treats sub-pixel differences as equal", () => {
    const a = { left: 0, top: 10, width: 100, height: 50 };
    expect(sameContentBox(a, { ...a, top: 10.2 })).toBe(true);
    expect(sameContentBox(a, { ...a, top: 12 })).toBe(false);
    expect(sameContentBox(null, a)).toBe(false);
    expect(sameContentBox(null, null)).toBe(true);
  });
});

describe("getCaptionFontSize", () => {
  it("scales with the picture but stays inside legible bounds", () => {
    expect(getCaptionFontSize(720)).toBe(35);
    // Tiny players get a floor, huge ones a ceiling
    expect(getCaptionFontSize(100)).toBe(13);
    expect(getCaptionFontSize(0)).toBe(13);
    expect(getCaptionFontSize(4000)).toBe(40);
  });
});

describe("stripCueTags", () => {
  it("removes WebVTT markup", () => {
    expect(stripCueTags("<v Ada><b>Hi</b> there")).toBe("Hi there");
  });
});

describe("snapshotCue", () => {
  it("falls back to plain text when getCueAsHTML is unavailable", () => {
    const snap = snapshotCue(fakeCue({ text: "<i>Careful</i> now" }), 0);
    expect(snap.content).toBe("Careful now");
  });

  it("uses getCueAsHTML when the engine provides it", () => {
    const fragment = document.createDocumentFragment();
    const bold = document.createElement("b");
    bold.textContent = "Loud";
    fragment.append(bold, document.createTextNode(" and clear"));
    const snap = snapshotCue(
      fakeCue({ getCueAsHTML: () => fragment }),
      0
    );
    expect(typeof snap.content).toBe("object");
    expect(snap.content).not.toBeNull();
  });

  it("resolves cue alignment onto CSS text alignment", () => {
    expect(snapshotCue(fakeCue({ align: "start" }), 0).align).toBe("left");
    expect(snapshotCue(fakeCue({ align: "end" }), 0).align).toBe("right");
    expect(snapshotCue(fakeCue({ align: "left" }), 0).align).toBe("left");
    expect(snapshotCue(fakeCue({ align: "middle" }), 0).align).toBe("center");
    expect(snapshotCue(fakeCue({ align: undefined }), 0).align).toBe("center");
  });

  it("places auto-line and negative-line cues at the bottom", () => {
    expect(snapshotCue(fakeCue({ line: "auto" }), 0).region).toBe("bottom");
    expect(snapshotCue(fakeCue({ line: -1 }), 0).region).toBe("bottom");
    expect(
      snapshotCue(fakeCue({ line: 90, snapToLines: false }), 0).region
    ).toBe("bottom");
  });

  it("places cues the VTT anchors near the top in the top region", () => {
    expect(snapshotCue(fakeCue({ line: 0 }), 0).region).toBe("top");
    expect(snapshotCue(fakeCue({ line: 2 }), 0).region).toBe("top");
    expect(
      snapshotCue(fakeCue({ line: 10, snapToLines: false }), 0).region
    ).toBe("top");
  });

  it("gives concurrent cues distinct keys", () => {
    const a = snapshotCue(fakeCue(), 0);
    const b = snapshotCue(fakeCue(), 1);
    expect(a.key).not.toBe(b.key);
  });
});
