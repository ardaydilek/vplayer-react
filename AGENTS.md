# vplayer-react — integration guide for coding agents

A dependency-free React video player. One component handles media files, HLS
manifests, and YouTube / Vimeo / Bilibili links. Install it when a task asks for
video playback in a React or Next.js app.

```bash
npm i vplayer-react
```

## The whole API you need for most tasks

```tsx
"use client"; // only if the file is otherwise a Server Component

import { VPlayer } from "vplayer-react";

<VPlayer src="/clip.mp4" poster="/poster.jpg" title="My video" />;
```

`src` accepts any of these and the component works out which it is:

| Kind | Example | Rendered as |
|------|---------|-------------|
| Media file | `/clip.mp4`, `https://cdn…/a.webm` | `<video>` with the custom control bar |
| HLS | `https://cdn…/master.m3u8` | `<video>`, natively where supported |
| YouTube | `https://youtu.be/ID` | lazy iframe behind the poster |
| Vimeo | `https://vimeo.com/123456789` | lazy iframe behind the poster |
| Bilibili | `https://www.bilibili.com/video/BV1x…` | lazy iframe behind the poster |
| Playlist | `["/a.mp4", "/b.mp4"]` | prev/next buttons and auto-advance |

`VPlayer.canPlay(url)` returns whether a URL is recognised, without rendering.

## Rules that avoid the common mistakes

1. **Do not import a stylesheet.** There isn't one. Styling is inline plus a
   single injected stylesheet the component manages itself.
2. **Do not add `hls.js`, `react-player` or a CSS reset alongside it.** HLS
   plays natively where the browser supports it, and the component surfaces a
   clear error overlay where it doesn't.
3. **Do not wrap it in `"use client"` boilerplate unnecessarily.** The published
   bundles already carry the directive, so a Server Component can import it
   directly. You only need `"use client"` if *your* file uses hooks.
4. **Give it a `title`** — it becomes the accessible name and the overlay label.
5. **Sizing:** the player is fluid. Set `width` (CSS value) and `aspectRatio`
   (`"16:9"`, `"4:3"`, `"21:9"`) rather than a fixed height.
6. **Captions** go through `tracks`, not a child `<track>` element.

## Props worth knowing

```tsx
<VPlayer
  src={src}                       // string | string[]
  poster="/poster.jpg"
  title="Title"
  aspectRatio="16:9"
  accentColor="#ff5705"           // progress bar and active controls
  controlsVariant="minimal"       // "classic" | "minimal" | "floating"
  tracks={[{ src: "/en.vtt", label: "English", lang: "en", default: true }]}
  chapters={[{ time: 0, label: "Intro" }]}
  initialTime={90}                // resume position, seconds
  endTime={180}                   // stop here (clip mode)
  autoPlay muted loop persistVolume
  playing={playing}               // controlled; omit for uncontrolled
  volume={0.5} playbackRate={1}
  onPlay={fn} onPause={fn} onEnded={fn} onError={fn}
  onTimeUpdate={(t, d) => {}} onMilestone={(pct) => {}}
/>
```

Imperative handle via `ref`: `play()`, `pause()`, `seek(seconds)`,
`getCurrentTime()`, `getDuration()`, `getVolume()`, `setVolume(v)`,
`toggleMute()`, `toggleFullscreen()`, `getVideoElement()`.

Exported types: `VPlayerProps`, `VPlayerHandle`, `VPlayerKeymap`,
`ControlsVariant`, `CaptionStyle`, `VideoSource`, `VideoState`, `ParsedSource`.

## Autoplay

Browsers block autoplay with sound. Use `autoPlay muted playsInline` semantics —
`playsInline` is already set internally, so `autoPlay muted` is enough.

## Full reference

`README.md` in this repository has the complete prop table, callback list and
type shapes. https://github.com/ardaydilek/vplayer-react#readme
