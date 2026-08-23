# Changelog

## 1.5.0

### Features

- **Controlled playback props** — `playing`, `volume`, `muted`, and `playbackRate` now sync declaratively when their values change
- **Native HLS support** — `.m3u8` sources play natively where the browser supports HLS; unsupported browsers get a clear error overlay
- **New callbacks** — `onReady`, `onStart`, `onRateChange`, `onDurationChange`, `onWaiting`, `onEnterPiP`, `onLeavePiP`
- **`VPlayer.canPlay(url)` static** — check whether a URL is recognized before rendering (also exported as `canPlayUrl`)
- **Behavior customization** — `seekStep`, `volumeStep`, `playbackRates`, `hideControlsDelay`, and `showControls` (kiosk mode) props
- **Clip mode** — `endTime` prop pauses playback and fires `onEnded` at a custom timestamp
- **Caption styling** — `captionStyle` prop styles subtitle cues via a scoped `::cue` rule
- **Media element pass-throughs** — `crossOrigin`, `disableRemotePlayback`, `disablePictureInPicture` props
- **Double-click fullscreen** — double-clicking the video toggles fullscreen

### Accessibility

- Seek and volume sliders are now keyboard-operable (Tab to focus; arrows, Home, End)
- The volume button now mutes on click, matching its accessible name; the volume slider opens on hover or keyboard focus instead
- Speed and caption menus focus their active item when opened, and closing a menu restores focus to the player so keyboard shortcuts keep working
- Auto-hidden controls now leave the tab order (`visibility: hidden`), focusing a control reveals the bar, and the bar never hides while keyboard focus is inside it
- Removed a duplicate accessible label on the poster overlay

### Packaging

- The published bundles now carry the `"use client"` directive, so importing from a React Server Component works as documented
- ESM consumers get matching ESM type declarations (`exports` now maps per-condition types)
- Removed the broken IIFE/CDN bundle: it inlined a copy of React and crashed on load in browsers (`process is not defined`), and the React UMD builds the old CDN instructions referenced no longer exist. The README now shows a working no-build setup via esm.sh.

### Bug fixes

- Playback state now syncs from the media element's own `play`/`pause` events, so `autoPlay`, the ref API, remote controls, and the PiP window can no longer desync the UI (this also fixes the poster not fading out with `autoPlay`)
- `persistVolume` restored the saved volume to the UI but never applied it to the media element
- `persistVolume` no longer overrides the `muted` prop on load (muted autoplay keeps working after a visitor has changed the volume), and the final volume change is flushed to storage even when the player unmounts immediately
- Touch scrubbing reliably attaches to the progress bar (it previously depended on prop-identity churn to attach at all) and multi-touch no longer leaks window listeners
- Seeking on streams with non-finite durations (live HLS) no longer throws; the seek is ignored instead
- Keyboard shortcuts no longer swallow browser/OS shortcuts (Cmd/Ctrl/Alt combinations)
- Progress-bar drag listeners are cleaned up if the component unmounts mid-drag (mouse and touch)
- Drag seeking recomputes the track's bounding rect each move, so mid-drag layout shifts don't skew seeking
- Playlist auto-advance no longer gets stuck on a spinner when the next source fails to load
- An empty `src` array now shows a "No video source provided" message instead of loading the page URL as video
- `onMilestone(100)` is guaranteed on `ended` even when the last `timeupdate` lands short
- `onPlay`/`onPause` no longer fire when the underlying `play()` call is rejected by autoplay policy
- Exiting fullscreen works on WebKit browsers that only implement the prefixed API
- `localStorage` volume writes are debounced during slider drags
- Poster and thumbnail URLs are escaped before CSS interpolation
- Picture-in-Picture detection checks the actual `pictureInPictureEnabled` value
- Caption track switching no longer crashes in environments without `TextTrackList` events

## 1.4.2

- Subtitles reset on track change
- Volume slider redesigned as a vertical popup
- Speed/CC menus rendered as overlays (no overflow clipping on mobile)
- Duration fallback for late-loading metadata
- Default caption track initialization only on first mount

## 1.4.1

- Poster fade transition (no more flicker)
- `handleBlur` relatedTarget check (fixes click-through on menus)
- iOS fullscreen via `webkitEnterFullscreen` fallback
- Passive event listener fix for progress bar touch
- Decorative styles moved to an injected stylesheet for Tailwind compatibility

## 1.4.0

- `onError` callback + error overlay UI
- `initialTime`, `activeIndex` + `onIndexChange`, `onSeek`, `persistVolume`, `loopPlaylist`, `onChapterChange`, `onVolumeChange`
- Chapter keyboard shortcuts (`Shift+←/→`)
- `VPlayerHandle` ref API
- Per-track chapters in playlist mode

## 1.3.x

- Playlist support (`src` array) with prev/next and auto-advance
- `keymap` prop for remappable shortcuts

## 1.2.0

- Chapter markers, sprite-sheet thumbnail previews, `onMilestone`

## 1.1.0

- WebVTT captions with CC picker, keyboard shortcuts overlay (`?`), `onBuffer`

## 1.0.1

- Progress bar touch scrubbing

## 1.0.0

- Initial release: custom controls, YouTube/Vimeo/Bilibili embeds, keyboard shortcuts, poster overlay, aspect-ratio layout
