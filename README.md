# VPlayer React

A lightweight, dependency-free, production-ready video player for React. Supports local files, YouTube, Vimeo, and Bilibili with brand-configurable controls, playlists, captions, chapter markers, analytics callbacks, and fully remappable keyboard shortcuts.

---

## Features

- **Zero dependencies** — Pure React, inline styles, no CSS files to import
- **Universal sources** — Local/remote MP4, YouTube, Vimeo, Bilibili from one component
- **Playlist support** — Pass a URL array for prev/next controls and auto-advance
- **Captions & subtitles** — WebVTT tracks with a CC picker in the control bar
- **Chapter markers** — Tick marks on the progress bar with hover labels
- **Thumbnail preview** — Sprite-sheet frame preview while scrubbing
- **Analytics callbacks** — `onBuffer`, `onMilestone` (25/50/75/100%), `onPlay`, `onPause`, `onEnded`
- **Custom keymaps** — Remap or disable any keyboard shortcut via `keymap` prop
- **Touch scrubbing** — Full mobile touch support on the progress bar
- **Brand configurable** — Accent color and icon color props for instant theming
- **Keyboard shortcuts** — Full keyboard support, scoped to the player (no page takeover)
- **Performance optimized** — Lazy-loaded embeds, metadata preloading, no layout shift
- **Accessible** — ARIA attributes, focus management, screen reader support
- **Responsive** — Fluid width with configurable aspect ratio
- **Picture-in-Picture** — Native PiP support where available
- **Playback speed** — 0.25× to 2× speed control

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

## Usage

### Basic — Next.js App Router

```tsx
import { VPlayer } from 'vplayer-react';

export default function Page() {
  return (
    <VPlayer
      src="https://example.com/video.mp4"
      poster="/poster.jpg"
      title="Product Demo"
      accentColor="#e11d48"
      iconColor="#ffffff"
      aspectRatio="16:9"
    />
  );
}
```

Since `VPlayer` uses `"use client"` internally, it works seamlessly in both Server Components and Client Components.

### YouTube / Vimeo / Bilibili

```tsx
<VPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="YouTube Video" accentColor="#ff0000" />
<VPlayer src="https://vimeo.com/347119375" title="Vimeo Video" accentColor="#1ab7ea" />
<VPlayer src="https://www.bilibili.com/video/BV1GJ411x7h7" title="Bilibili Video" accentColor="#fb7299" />
```

### Playlist

Pass an array of URLs. Prev / Next buttons appear automatically in the control bar. When a track ends, playback advances to the next one seamlessly.

```tsx
<VPlayer
  src={[
    "/episode-1.mp4",
    "/episode-2.mp4",
    "/episode-3.mp4",
  ]}
  title="My Series"
  onNext={() => console.log("advanced to next")}
  onPrev={() => console.log("went back")}
  onEnded={() => console.log("playlist finished")}
/>
```

### Captions & Subtitles

Provide an array of WebVTT track descriptors. A CC button appears in the control bar — the user can pick any track or turn them off.

```tsx
<VPlayer
  src="/documentary.mp4"
  tracks={[
    { src: "/en.vtt", label: "English", lang: "en", default: true },
    { src: "/es.vtt", label: "Español", lang: "es" },
    { src: "/fr.vtt", label: "Français", lang: "fr" },
  ]}
/>
```

### Chapter Markers

Tick marks appear on the progress bar at each chapter's timestamp. Hovering over a tick shows the chapter label instead of the time.

```tsx
<VPlayer
  src="/documentary.mp4"
  chapters={[
    { time: 0,   label: "Introduction" },
    { time: 120, label: "Act I" },
    { time: 360, label: "Act II" },
    { time: 600, label: "Finale" },
  ]}
/>
```

### Thumbnail Preview on Scrub

Provide a sprite-sheet image to show frame previews while hovering the progress bar.

```tsx
<VPlayer
  src="/video.mp4"
  previewThumbnails={{
    src: "/thumbnails-sprite.jpg",
    width: 160,
    height: 90,
    count: 60,   // number of frames in the sprite
  }}
/>
```

The sprite is expected to be a horizontal strip: all frames in a single row, each `width × height` pixels.

### Analytics Callbacks

```tsx
<VPlayer
  src="/product-demo.mp4"
  onPlay={()  => analytics.track("video_play")}
  onPause={()  => analytics.track("video_pause")}
  onEnded={()  => analytics.track("video_complete")}
  onBuffer={(pct) => console.log(`buffered ${pct.toFixed(0)}%`)}
  onMilestone={(pct) => {
    // Fires exactly once per src at 25, 50, 75, and 100 %
    analytics.track("video_milestone", { percent: pct });
  }}
  onTimeUpdate={(time, duration) => console.log(time, duration)}
/>
```

### Custom Key Bindings

Override any action with a different key, an array of keys, or `false` to disable it entirely.

```tsx
import type { VPlayerKeymap } from 'vplayer-react';

const keymap: VPlayerKeymap = {
  play:       "p",            // p → play/pause instead of Space / K
  fullscreen: ["f", "F"],     // accept both cases
  mute:       false,          // disable M key completely
  shortcuts:  false,          // hide the ? overlay
};

<VPlayer src="/video.mp4" keymap={keymap} />
```

Available actions: `play`, `mute`, `fullscreen`, `seekBack`, `seekForward`, `volumeUp`, `volumeDown`, `speedDown`, `speedUp`, `shortcuts`.

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

### Dynamic Import (optional SSR skip)

```tsx
import dynamic from 'next/dynamic';

const VPlayer = dynamic(
  () => import('vplayer-react').then((mod) => mod.VPlayer),
  { ssr: false }
);
```

### Vanilla JavaScript / CDN

```html
<script src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/vplayer-react/dist/index.global.js"></script>

<script>
  const root = ReactDOM.createRoot(document.getElementById('player-root'));
  root.render(
    React.createElement(VPlayerReact.VPlayer, {
      src: 'https://example.com/video.mp4',
      title: 'My Video',
      accentColor: '#e11d48',
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
| `autoPlay` | `boolean` | `false` | Autoplay on mount |
| `loop` | `boolean` | `false` | Loop video playback |
| `muted` | `boolean` | `false` | Start muted |
| `title` | `string` | — | Title overlay shown during playback |
| `className` | `string` | — | CSS class for the outer container |
| `style` | `CSSProperties` | — | Inline styles for the outer container |
| `preload` | `"none" \| "metadata" \| "auto"` | `"metadata"` | Preload behavior for native video |
| `ariaLabel` | `string` | auto-generated | Custom ARIA label |
| `tracks` | `Track[]` | — | WebVTT subtitle/caption tracks (see below) |
| `chapters` | `Chapter[]` | — | Chapter markers on the progress bar (see below) |
| `previewThumbnails` | `ThumbnailConfig` | — | Sprite-sheet config for hover preview (see below) |
| `keymap` | `VPlayerKeymap` | — | Override key bindings per action (see below) |
| `onPlay` | `() => void` | — | Fires when playback starts |
| `onPause` | `() => void` | — | Fires when playback is paused |
| `onEnded` | `() => void` | — | Fires when playback ends (last track in playlist) |
| `onTimeUpdate` | `(time, duration) => void` | — | Fires on every time update |
| `onBuffer` | `(percent: number) => void` | — | Fires when the buffered range changes (0–100) |
| `onMilestone` | `(percent: 25 \| 50 \| 75 \| 100) => void` | — | Fires once per src at each watch milestone |
| `onNext` | `() => void` | — | Fires when advancing to the next playlist track |
| `onPrev` | `() => void` | — | Fires when going back to the previous playlist track |

### Track shape

```ts
{
  src: string;      // URL to a .vtt file
  label: string;    // Display name in the CC menu
  lang: string;     // BCP-47 language tag, e.g. "en"
  default?: boolean // Pre-select this track on load
}
```

### Chapter shape

```ts
{ time: number; label: string }
// time is in seconds from the start of the video
```

### ThumbnailConfig shape

```ts
{
  src: string;   // URL to a horizontal sprite-sheet image
  width: number; // Width of each frame in pixels
  height: number;// Height of each frame in pixels
  count: number; // Total number of frames in the sprite
}
```

### VPlayerKeymap shape

```ts
type VPlayerAction =
  | "play" | "mute" | "fullscreen"
  | "seekBack" | "seekForward"
  | "volumeUp" | "volumeDown"
  | "speedDown" | "speedUp" | "shortcuts";

type VPlayerKeymap = Partial<Record<VPlayerAction, string | string[] | false>>;
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
| `Up Arrow` | Volume up 10% |
| `Down Arrow` | Volume down 10% |
| `0`–`9` | Seek to 0%–90% |
| `<` / `>` | Decrease / Increase playback speed |
| `?` | Toggle keyboard shortcuts overlay |
| `Escape` | Close menus / shortcuts overlay |

---

## Supported URL Formats

| Platform | Example URLs |
|----------|-------------|
| **Native** | `/video.mp4`, `https://cdn.example.com/video.webm` |
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
  VPlayerAction,
  VPlayerKeymap,
  VideoSource,
  VideoState,
  ParsedSource,
} from 'vplayer-react';

// Utilities
export { parseVideoSource, formatTime, parseAspectRatio } from 'vplayer-react';
```

---

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

Picture-in-Picture requires browser support (Chrome, Edge, Safari). Fullscreen API is supported in all modern browsers. Touch scrubbing works on all mobile browsers.

---

## License

MIT
