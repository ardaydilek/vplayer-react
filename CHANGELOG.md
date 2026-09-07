# Changelog

## 1.6.0

### Bug fixes

- **Skipping through a playlist no longer drops back to the poster.** Changing the source reset `hasStarted`, which tore down the control bar the prev/next buttons live in — so pressing Next stranded the viewer on a play button mid-playlist, and Previous never appeared on the track after. Manual skips now keep the bar up and continue playback if the player was playing; an external `src` change still resets, as it should.
- **The error overlay no longer shows the play button through itself.** At 70% black over a visible poster, the play button underneath showed straight through the alert glyph, so a failed video read as a play button wearing a red halo. The overlay is now near-opaque and the poster button is hidden behind it.
- **A failed load is no longer blamed on the format.** `MEDIA_ERR_SRC_NOT_SUPPORTED` fires for a 404, a CORS refusal and an undecodable codec alike, so "This video format is not supported" was wrong in the most common case. Each error code now gets copy naming something the viewer can actually check.
- **The control bar could overflow its own width.** Below roughly 470px the row was wider than the player, because the layout thresholds were round numbers rather than the widths the arrangements need.
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

  Each skin adapts down to a ~300px player: below ~580px the inline ones fall back to the stacked arrangement, below ~480px the volume slider drops to its mute toggle, and below ~400px the time readout shows elapsed only while Picture-in-Picture steps aside. Every remaining control keeps a 40×44px hit area at every size.
- `ControlsVariant` and `CaptionStyle` are now exported types.
- **Retry on a failed load** — the error overlay now offers "Try again", which reloads the media element instead of leaving the viewer at a dead end.

### Design

- **The icon set was redrawn on one grid.** Every glyph now sits in a 24×24 viewBox optically centred on (12, 12) with a single 1.8 stroke weight, and every control renders at 20px. The old set mixed 1.5/2/3 weights and 18/20px sizes in the same row, drew Picture-in-Picture two units above centre and the speaker one and a half units left of it — so a row of buttons whose boxes were perfectly aligned still read as ragged. Captions went back to two open "C"s (bars in a rounded rectangle read as a message bubble), and the PiP window is now inset far enough to read as a window rather than a filled screen.
- **The speed control shows the rate instead of a gear.** A cog says "settings"; this menu only ever changes the rate. `1×` says what the control does and takes the busiest glyph out of the row.
- **Volume is an inline slider that is always there, and quiet until you reach it.** The vertical popup opened on hover, which put the only pointer route to volume behind a capability touch devices don't have, and made a fiddly vertical drag out of a flat control. It now drags with pointer capture, so the gesture survives leaving the track — and it sits back at 55% white with no thumb until the pointer or keyboard arrives, because a full-strength bar beside the accent scrubber was the loudest thing in a row nobody is looking at.
- **Menus open from the control that opened them.** The captions and speed panels were both pinned to the player's bottom-right corner regardless of trigger, so the captions list appeared nowhere near the captions button and the two menus were indistinguishable in place. Each now anchors above its own button, scales up from that corner, and opening one closes the other. The scrim that dimmed the whole frame to pick a playback speed is gone; a transparent catcher below the bar closes the menu on an outside click while the bar's own controls stay live.
- **The control row is tighter.** Buttons went from 40×40 to 36×40 around a consistent 20px glyph, dropping the pitch from 44px to 40px while the `::before` bleed keeps a 40×44 target that still never overlaps a neighbour.
- **Poster play button reworked.** It is now dark glass — a translucent, blurred disc with a hairline ring — rather than a saturated accent circle stamped over the artwork, so it borrows the poster underneath instead of competing with it, and the accent colour keeps one job: playback progress. Sized as a share of the frame (bounded 56–84px) so it neither swamps a small embed nor disappears in a full-bleed hero; the play triangle is optically nudged toward its point; hover grows a translucent ring; press gives `scale(0.96)`.
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
