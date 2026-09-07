# Changelog

## 1.6.0

### Bug fixes

- **Captions no longer sit behind the control bar.** The player now keeps its `<track>` elements in `hidden` mode and draws the active cues itself. The browser's own cue box is anchored to the video *element*, so it rendered underneath the controls; the player's cue layer rises to clear the bar while it is on screen and drops back down when it fades.
- **Captions stay inside the picture when the frame is letterboxed.** Fullscreening a 16:9 clip on a portrait phone letterboxes the picture into a band in the middle of the screen — native cues landed in the black bar far below it. Cues are now positioned against the video's real content box, so they sit at the bottom of the picture wherever that falls.
- Cue placement now honours `align` and top-anchored `line` values from the VTT, sizes cues relative to the picture as WebVTT specifies, and preserves cue markup (`<b>`, `<i>`, `<u>`, `<ruby>`) through `getCueAsHTML()`.
- iOS `webkitEnterFullscreen` hands playback to the system player, so the active track is switched back to `showing` for its duration and iOS keeps drawing captions itself.
- The fullscreen stylesheet sizes the frame with `height: 100%` instead of `100vh`, so a player fullscreened inside another element is measured correctly.
- The text-track `change` listener is removed from the captured list rather than a re-read of the live `textTracks` accessor, which could already be detached at teardown.

### Features

- **`controlsVariant` prop** — three skins for the native control bar, carrying identical controls:
  - `classic` *(default)* — full-width gradient scrim, scrubber stacked above the buttons
  - `minimal` — one row, scrubber inline between elapsed and remaining time, almost no scrim
  - `floating` — the same row inside a detached, blurred pill inset from the frame

  `minimal` and `floating` fall back to the stacked arrangement below ~480px, where a single row can no longer hold the scrubber and every control at once. No control is ever dropped.
- `ControlsVariant` and `CaptionStyle` are now exported types.

### Design

- **Poster play button reworked.** The coloured glow is gone in favour of a stacked neutral shadow with an inner highlight; the button is now sized as a share of the frame (bounded 54–88px) so it neither swamps a small embed nor disappears in a full-bleed hero; the play triangle is optically nudged toward its point; hover grows a translucent ring; press gives `scale(0.96)`.
- **Poster scrim eased.** The flat radial wash that dimmed the whole poster is now an eased vignette with intermediate stops — no banding, and the artwork stays bright through the mid-ring.
- Control buttons are 40×40 with a 44px hit area, sized so neighbouring targets meet without overlapping.
- Hover, press and focus states moved from inline JS handlers into the injected stylesheet, so they are gated behind `(hover: hover) and (pointer: fine)` — no more stuck hover states after a tap on touch devices.
- Menu items keep a constant font weight across states (selection no longer reflows the row), and menu/popup surfaces use shadow rings instead of solid borders, with radii derived from their padding.
- The progress thumb scales from a fixed box instead of animating width/height, which removes the sub-pixel jitter at the ends of the track.
- Every transition now has a `prefers-reduced-motion` path. The loading spinner is deliberately exempt — a frozen spinner reads as a hung player.
- Focus rings are neutral white and never removed; `touch-action: manipulation` on controls prevents double-tap zoom.

### Accessibility

- Playlist buttons are labelled "Previous video" / "Next video" rather than "Previous" / "Next".
- The title overlay is `pointer-events: none`, so it can't intercept a click meant for the video.
- Control bar padding accounts for `env(safe-area-inset-bottom)`.


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
