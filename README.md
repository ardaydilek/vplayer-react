# VPlayer React

A lightweight, dependency-free, production-ready video player for React. Supports local files, HLS streams, YouTube, Vimeo, and Bilibili with brand-configurable controls, playlists, captions, chapter markers, analytics callbacks, and fully remappable keyboard shortcuts.

---

## Features

- **Zero dependencies** — Pure React, inline styles, no CSS files to import
- **Universal sources** — Local/remote MP4, HLS (`.m3u8`, native), YouTube, Vimeo, Bilibili from one component
- **Controlled playback** — Declarative `playing`, `volume`, `muted`, and `playbackRate` props
- **Deep customization** — `seekStep`, `volumeStep`, `playbackRates`, `hideControlsDelay`, `showControls` (kiosk mode)
- **Clip mode** — `endTime` prop stops playback at a custom timestamp
- **Caption styling** — Style subtitle cues via the `captionStyle` prop (`::cue`)
- **Playlist support** — Pass a URL array for prev/next controls and auto-advance
- **Controlled playlists** — Drive the active track externally with `activeIndex` + `onIndexChange`
- **Captions & subtitles** — WebVTT tracks with a CC picker in the control bar
- **Chapter markers** — Tick marks on the progress bar with hover labels
- **Thumbnail preview** — Sprite-sheet frame preview while scrubbing
- **Ref API** — Programmatic control via `play()`, `pause()`, `seek()`, and more
- **Error handling** — `onError` callback with built-in error overlay UI
- **Resume playback** — `initialTime` prop to start at a specific timestamp
- **Volume persistence** — Remember volume across page reloads via `persistVolume`
- **Analytics callbacks** — `onBuffer`, `onMilestone`, `onSeek`, `onChapterChange`, `onVolumeChange`, and more
- **Custom keymaps** — Remap or disable any keyboard shortcut via `keymap` prop
- **Touch support** — Full mobile touch support on progress bar and controls
- **Brand configurable** — Accent color and icon color props for instant theming
- **Tailwind friendly** — Decorative styles use low-specificity rules, so `className` works without `!important`
- **Keyboard shortcuts** — Full keyboard support, scoped to the player (no page takeover)
- **Performance optimized** — Lazy-loaded embeds, metadata preloading, no layout shift
- **Accessible** — ARIA attributes, focus management, screen reader support
- **Responsive** — Fluid width with configurable aspect ratio
- **Picture-in-Picture** — Native PiP support where available
- **Playback speed** — 0.25x to 2x speed control

---

## Installation

```bash
npm install vplayer-react
```

```bash
yarn add vplayer-react
```

```bash
pnpm add vplayer-react
```

---

## Quick Start

```tsx
import { VPlayer } from 'vplayer-react';

export default function Page() {
  return (
    <VPlayer
      src="https://example.com/video.mp4"
      poster="/poster.jpg"
      title="Product Demo"
      accentColor="#e11d48"
    />
  );
}
```

Since `VPlayer` uses `"use client"` internally, it works seamlessly in both Server Components and Client Components in Next.js.

---

## Usage Examples

### YouTube / Vimeo / Bilibili

```tsx
<VPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="YouTube" />
<VPlayer src="https://vimeo.com/347119375" title="Vimeo" />
<VPlayer src="https://www.bilibili.com/video/BV1GJ411x7h7" title="Bilibili" />
```

### Playlist

Pass an array of URLs. Prev / Next buttons appear automatically in the control bar. When a track ends, playback advances to the next one seamlessly.

```tsx
<VPlayer
  src={["/episode-1.mp4", "/episode-2.mp4", "/episode-3.mp4"]}
  title="My Series"
  onNext={() => console.log("next")}
  onPrev={() => console.log("prev")}
  onEnded={() => console.log("playlist finished")}
/>
```

### Controlled Playlist

Drive the active track from your own UI (e.g. a sidebar episode list). When `activeIndex` is provided, the player treats it as the source of truth — your `onIndexChange` handler is responsible for updating the value.

```tsx
const [track, setTrack] = useState(0);

<VPlayer
  src={["/ep-1.mp4", "/ep-2.mp4", "/ep-3.mp4"]}
  activeIndex={track}
  onIndexChange={(i) => setTrack(i)}
/>

{/* External track list */}
<ul>
  {episodes.map((ep, i) => (
    <li key={i} onClick={() => setTrack(i)}>{ep.title}</li>
  ))}
</ul>
```

If `activeIndex` is omitted, the player manages the index internally and `onIndexChange` fires as an informational callback.

### Loop Playlist

Wrap back to the first track when the last one ends:

```tsx
<VPlayer
  src={["/track-1.mp4", "/track-2.mp4", "/track-3.mp4"]}
  loopPlaylist
/>
```

### Resume Playback (initialTime)

Start playback at a specific timestamp — useful for "continue where you left off" flows:

```tsx
<VPlayer
  src="/movie.mp4"
  initialTime={1234} // starts at 20:34
/>
```

`initialTime` is applied once on the first track load and does not re-apply when advancing through a playlist.

### Captions & Subtitles

```tsx
<VPlayer
  src="/documentary.mp4"
  tracks={[
    { src: "/en.vtt", label: "English", lang: "en", default: true },
    { src: "/es.vtt", label: "Espanol", lang: "es" },
    { src: "/fr.vtt", label: "Francais", lang: "fr" },
  ]}
/>
```

### Chapter Markers

Tick marks appear on the progress bar at each chapter's timestamp. Hovering over a tick shows the chapter label.

```tsx
<VPlayer
  src="/documentary.mp4"
  chapters={[
    { time: 0,   label: "Introduction" },
    { time: 120, label: "Act I" },
    { time: 360, label: "Act II" },
    { time: 600, label: "Finale" },
  ]}
  onChapterChange={(chapter) => {
    console.log("Now playing:", chapter?.label ?? "none");
  }}
/>
```

Use `Shift + Left Arrow` / `Shift + Right Arrow` to jump between chapters via keyboard.

### Thumbnail Preview

```tsx
<VPlayer
  src="/video.mp4"
  previewThumbnails={{
    src: "/thumbnails-sprite.jpg",
    width: 160,
    height: 90,
    count: 60,
  }}
/>
```

The sprite is expected to be a horizontal strip: all frames in a single row, each `width x height` pixels.

### Error Handling

```tsx
<VPlayer
  src="/video.mp4"
  onError={(error) => {
    console.error("Video error:", error?.code, error?.message);
    // MediaError.code: 1=ABORTED, 2=NETWORK, 3=DECODE, 4=SRC_NOT_SUPPORTED
  }}
/>
```

When a video fails to load, the player shows a built-in error overlay with a message. The `onError` callback receives the native `MediaError` object.

### Volume Persistence

Remember the user's volume preference across page reloads:

```tsx
<VPlayer src="/video.mp4" persistVolume />
```

Volume is stored in `localStorage` under the key `vplayer-volume`. Safe for SSR and private browsing (uses try/catch).

### Analytics Callbacks

```tsx
<VPlayer
  src="/product-demo.mp4"
  onPlay={() => analytics.track("video_play")}
  onPause={() => analytics.track("video_pause")}
  onEnded={() => analytics.track("video_complete")}
  onSeek={(time) => console.log(`seeked to ${time}s`)}
  onBuffer={(pct) => console.log(`buffered ${pct.toFixed(0)}%`)}
  onMilestone={(pct) => analytics.track("milestone", { percent: pct })}
  onVolumeChange={(vol, muted) => console.log(`volume: ${vol}, muted: ${muted}`)}
  onChapterChange={(ch) => console.log("chapter:", ch?.label)}
  onTimeUpdate={(time, duration) => console.log(time, duration)}
/>
```

### Ref API (Programmatic Control)

Control the player programmatically via a ref:

```tsx
import { useRef } from 'react';
import { VPlayer, type VPlayerHandle } from 'vplayer-react';

function MyPlayer() {
  const playerRef = useRef<VPlayerHandle>(null);

  return (
    <>
      <VPlayer ref={playerRef} src="/video.mp4" />

      <button onClick={() => playerRef.current?.play()}>Play</button>
      <button onClick={() => playerRef.current?.pause()}>Pause</button>
      <button onClick={() => playerRef.current?.seek(60)}>Jump to 1:00</button>
      <button onClick={() => playerRef.current?.toggleFullscreen()}>Fullscreen</button>
    </>
  );
}
```

**Available methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `play()` | `void` | Start playback |
| `pause()` | `void` | Pause playback |
| `seek(time)` | `void` | Seek to a specific time (seconds) |
| `getCurrentTime()` | `number` | Get the current playback time |
| `getDuration()` | `number` | Get the total duration |
| `getVolume()` | `number` | Get the current volume (0-1) |
| `setVolume(vol)` | `void` | Set volume (0-1) |
| `toggleMute()` | `void` | Toggle mute on/off |
| `toggleFullscreen()` | `void` | Toggle fullscreen mode |
| `getVideoElement()` | `HTMLVideoElement \| null` | Access the underlying video element |

### Custom Key Bindings

```tsx
import type { VPlayerKeymap } from 'vplayer-react';

const keymap: VPlayerKeymap = {
  play:       "p",            // p to play/pause instead of Space / K
  fullscreen: ["f", "F"],     // accept both cases
  mute:       false,          // disable M key completely
  shortcuts:  false,          // hide the ? overlay
};

<VPlayer src="/video.mp4" keymap={keymap} />
```

### Controlled Playback

Drive play/pause, volume, and speed declaratively. The user can still interact
with the controls; the props re-assert whenever their values change.

```tsx
const [isPlaying, setIsPlaying] = useState(false);

<VPlayer
  src="/video.mp4"
  playing={isPlaying}
  volume={0.8}
  playbackRate={1.25}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>
```

### HLS Streams

`.m3u8` sources play natively where the browser supports HLS (Safari, iOS, and
some Android browsers). On unsupported browsers the player shows a clear error
overlay instead of failing silently.

```tsx
<VPlayer src="https://cdn.example.com/stream/master.m3u8" />
```

Check support up front with `VPlayer.canPlay(url)` if you want to fall back to
an MP4 rendition yourself.

### Clip Mode (endTime)

Play an excerpt: combine `initialTime` with `endTime`. Playback pauses and
`onEnded` fires when the end timestamp is reached.

```tsx
<VPlayer src="/movie.mp4" initialTime={60} endTime={90} />
```

### Caption Styling

Style subtitle cues without any CSS files — rendered via a scoped `::cue` rule:

```tsx
<VPlayer
  src="/video.mp4"
  tracks={[{ src: "/en.vtt", label: "English", lang: "en", default: true }]}
  captionStyle={{
    color: "#ffe66d",
    background: "rgba(0,0,0,0.85)",
    fontSize: "1.1em",
  }}
/>
```

### Player Behavior Customization

```tsx
<VPlayer
  src="/video.mp4"
  seekStep={10}              // arrow keys jump 10s instead of 5s
  volumeStep={0.05}          // finer volume control
  playbackRates={[1, 1.5, 2, 3]} // custom speed menu
  hideControlsDelay={5000}   // controls stay for 5s of inactivity
  showControls               // or never hide them at all (kiosk mode)
/>
```

### URL Support Detection

```tsx
VPlayer.canPlay("/video.mp4");                  // true
VPlayer.canPlay("https://youtu.be/dQw4w9WgXcQ"); // true
VPlayer.canPlay("https://example.com/page.html"); // false
```

### Brand Configuration

```tsx
<VPlayer
  src="/product-demo.mp4"
  accentColor="#2563eb"  // progress bar, thumb, active states
  iconColor="#ffffff"    // play/pause, volume, fullscreen icons
  poster="/brand-poster.jpg"
  title="Brand Demo"
/>
```

### Styling with Tailwind CSS

Decorative styles (border-radius, font-family) use low-specificity CSS rules scoped to `[data-vplayer-root]`, so Tailwind classes on `className` work naturally:

```tsx
<VPlayer
  src="/video.mp4"
  className="rounded-none shadow-lg"
/>
```

For properties set as inline styles (like `backgroundColor`), use the `style` prop to override:

```tsx
<VPlayer
  src="/video.mp4"
  style={{ backgroundColor: "transparent" }}
/>
```

### Dynamic Import (optional SSR skip)

```tsx
import dynamic from 'next/dynamic';

const VPlayer = dynamic(
  () => import('vplayer-react').then((mod) => mod.VPlayer),
  { ssr: false }
);
```

### Vanilla JavaScript / CDN (no build step)

Use native ES modules via [esm.sh](https://esm.sh), which resolves React
automatically:

```html
<div id="player-root"></div>

<script type="module">
  import React from "https://esm.sh/react@19";
  import { createRoot } from "https://esm.sh/react-dom@19/client";
  import { VPlayer } from "https://esm.sh/vplayer-react@1.5.0";

  createRoot(document.getElementById("player-root")).render(
    React.createElement(VPlayer, {
      src: "https://example.com/video.mp4",
      title: "My Video",
      accentColor: "#e11d48",
    })
  );
</script>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| string[]` | **required** | Video URL or array of URLs (playlist mode) |
| `poster` | `string` | built-in default | Poster image shown before playback |
| `width` | `string \| number` | `"100%"` | Player width (CSS value or pixel number) |
| `aspectRatio` | `string` | `"16:9"` | Aspect ratio as `"w:h"` string |
| `accentColor` | `string` | `"#e11d48"` | Brand color for progress bar, thumb, and active UI |
| `iconColor` | `string` | `"#ffffff"` | Color for play/pause and control icons |
| `initialTime` | `number` | — | Start playback at this timestamp (seconds) |
| `autoPlay` | `boolean` | `false` | Autoplay on mount |
| `loop` | `boolean` | `false` | Loop single video playback |
| `loopPlaylist` | `boolean` | `false` | Loop entire playlist (wraps to first track after last) |
| `muted` | `boolean` | `false` | Start muted |
| `title` | `string` | — | Title overlay shown during playback |
| `className` | `string` | — | CSS class for the outer container |
| `style` | `CSSProperties` | — | Inline styles for the outer container |
| `preload` | `"none" \| "metadata" \| "auto"` | `"metadata"` | Preload behavior for native video |
| `ariaLabel` | `string` | auto-generated | Custom ARIA label |
| `tracks` | `Track[]` | — | WebVTT subtitle/caption tracks |
| `chapters` | `Chapter[]` | — | Chapter markers on the progress bar |
| `previewThumbnails` | `ThumbnailConfig` | — | Sprite-sheet config for hover preview |
| `keymap` | `VPlayerKeymap` | — | Override key bindings per action |
| `activeIndex` | `number` | — | Controlled playlist index |
| `persistVolume` | `boolean` | `false` | Persist volume to localStorage across reloads |
| `playing` | `boolean` | — | Controlled play state (declarative play/pause) |
| `volume` | `number` | — | Controlled volume (0–1), applied on change |
| `playbackRate` | `number` | — | Controlled playback rate, applied on change |
| `playbackRates` | `number[]` | `[0.25…2]` | Speeds offered in the rate menu and `<`/`>` keys |
| `seekStep` | `number` | `5` | Seconds jumped by arrow-key seeking |
| `volumeStep` | `number` | `0.1` | Volume change per arrow-key press |
| `hideControlsDelay` | `number` | `3000` | Idle milliseconds before controls hide |
| `showControls` | `boolean` | `false` | Keep controls always visible (kiosk mode) |
| `endTime` | `number` | — | Pause and fire `onEnded` at this timestamp |
| `crossOrigin` | `"anonymous" \| "use-credentials" \| ""` | — | CORS mode for the media element |
| `disableRemotePlayback` | `boolean` | `false` | Hide Chromecast/AirPlay UI |
| `disablePictureInPicture` | `boolean` | `false` | Disable PiP and hide its button |
| `captionStyle` | `CaptionStyle` | — | Subtitle cue styling (`::cue`) |
| `ref` | `Ref<VPlayerHandle>` | — | Ref for programmatic control |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onPlay` | `() => void` | Fires when playback starts |
| `onPause` | `() => void` | Fires when playback is paused |
| `onEnded` | `() => void` | Fires when playback ends (last track in playlist) |
| `onError` | `(error: MediaError \| null) => void` | Fires when the video encounters an error |
| `onSeek` | `(time: number) => void` | Fires after the user completes a seek |
| `onTimeUpdate` | `(time, duration) => void` | Fires on every time update |
| `onBuffer` | `(percent: number) => void` | Fires when the buffered range changes (0-100) |
| `onMilestone` | `(percent: 25 \| 50 \| 75 \| 100) => void` | Fires once per src at each watch milestone |
| `onNext` | `() => void` | Fires when advancing to the next playlist track |
| `onPrev` | `() => void` | Fires when going to the previous playlist track |
| `onIndexChange` | `(index: number) => void` | Fires when the playlist index changes |
| `onChapterChange` | `(chapter \| null) => void` | Fires when the current chapter changes |
| `onVolumeChange` | `(volume, muted) => void` | Fires when volume or mute state changes |
| `onReady` | `() => void` | Fires once per source when playback can start |
| `onStart` | `() => void` | Fires once per source on the very first play |
| `onRateChange` | `(rate: number) => void` | Fires when the playback rate changes |
| `onDurationChange` | `(duration: number) => void` | Fires when the duration becomes known |
| `onWaiting` | `() => void` | Fires when playback stalls to buffer |
| `onEnterPiP` | `() => void` | Fires on entering Picture-in-Picture |
| `onLeavePiP` | `() => void` | Fires on leaving Picture-in-Picture |

### Type Shapes

```ts
// Track (for captions/subtitles)
{ src: string; label: string; lang: string; default?: boolean }

// Chapter
{ time: number; label: string }

// ThumbnailConfig
{ src: string; width: number; height: number; count: number }

// CaptionStyle
{ color?: string; background?: string; fontSize?: string; fontFamily?: string }

// VPlayerKeymap
Partial<Record<VPlayerAction, string | string[] | false>>

// VPlayerAction
"play" | "mute" | "fullscreen" | "seekBack" | "seekForward"
| "volumeUp" | "volumeDown" | "speedDown" | "speedUp" | "shortcuts"
```

---

## Keyboard Shortcuts

All shortcuts are **scoped to the player** — they only work when the player has focus. They never hijack page-level keyboard behavior.

| Key | Action |
|-----|--------|
| `Space` / `K` | Play / Pause |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
| `Left Arrow` | Rewind 5 seconds |
| `Right Arrow` | Forward 5 seconds |
| `Shift + Left Arrow` | Jump to previous chapter |
| `Shift + Right Arrow` | Jump to next chapter |
| `Up Arrow` | Volume up 10% |
| `Down Arrow` | Volume down 10% |
| `0`-`9` | Seek to 0%-90% |
| `<` / `>` | Decrease / Increase playback speed |
| `?` | Toggle keyboard shortcuts overlay |
| `Escape` | Close menus / shortcuts overlay |

---

## Supported URL Formats

| Platform | Example URLs |
|----------|-------------|
| **Native** | `/video.mp4`, `https://cdn.example.com/video.webm` |
| **HLS** | `https://cdn.example.com/master.m3u8` (native support: Safari, iOS, some Android) |
| **YouTube** | `https://www.youtube.com/watch?v=ID`, `https://youtu.be/ID`, `https://youtube.com/shorts/ID` |
| **Vimeo** | `https://vimeo.com/123456789` |
| **Bilibili** | `https://www.bilibili.com/video/BV1xxxxx`, `https://www.bilibili.com/video/av12345` |

---

## Exports

```ts
// Component
export { VPlayer } from 'vplayer-react';

// Types
export type {
  VPlayerProps,
  VPlayerHandle,
  VPlayerAction,
  VPlayerKeymap,
  VideoSource,
  VideoState,
  ParsedSource,
} from 'vplayer-react';

// Utilities
export {
  parseVideoSource,
  formatTime,
  parseAspectRatio,
  canPlayUrl,
  isHlsSource,
} from 'vplayer-react';

// Static helper
VPlayer.canPlay(url); // boolean
```

---

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

Picture-in-Picture requires browser support (Chrome, Edge, Safari). Fullscreen uses the standard Fullscreen API with `webkitEnterFullscreen` fallback for iOS Safari. Touch scrubbing works on all mobile browsers.

---

## License

MIT
