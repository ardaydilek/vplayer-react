# VPlayer

A lightweight, dependency-free, production-ready video player for React. Supports local files, YouTube, Vimeo, and Bilibili with brand-configurable controls, scoped keyboard shortcuts, and excellent Core Web Vitals.

---

## Features

- **Zero dependencies** - Pure React, inline styles, no CSS files to import
- **Universal sources** - Local/remote MP4, YouTube, Vimeo, Bilibili from one component
- **Brand configurable** - Accent color and icon color props for instant theming
- **Keyboard shortcuts** - Full keyboard support, scoped to the player (no page takeover)
- **Performance optimized** - Lazy-loaded embeds, metadata preloading, no layout shift
- **Accessible** - ARIA attributes, focus management, screen reader support
- **Poster support** - Custom poster images with matching aspect ratio, plus a built-in default
- **Responsive** - Fluid width with configurable aspect ratio
- **Picture-in-Picture** - Native PiP support where available
- **Playback speed** - 0.25x to 2x speed control

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

### Next.js 16 (App Router) - Primary

```tsx
// app/page.tsx
import { VPlayer } from 'vplayer-react';

export default function Page() {
  return (
    <main>
      <VPlayer
        src="https://example.com/video.mp4"
        poster="/poster.jpg"
        title="Product Demo"
        accentColor="#e11d48"
        iconColor="#ffffff"
        aspectRatio="16:9"
      />
    </main>
  );
}
```

Since VPlayer uses `"use client"` internally, it works seamlessly in both Server Components (as an imported client boundary) and Client Components.

### Next.js with dynamic import (optional lazy loading)

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const VPlayer = dynamic(
  () => import('vplayer-react').then((mod) => mod.VPlayer),
  { ssr: false }
);

export default function Page() {
  return (
    <VPlayer
      src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      title="YouTube Video"
      accentColor="#ff0000"
    />
  );
}
```

### React (Vite, CRA, etc.)

```tsx
import { VPlayer } from 'vplayer-react';

function App() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <VPlayer
        src="/videos/intro.mp4"
        poster="/images/poster.jpg"
        title="Welcome Video"
        accentColor="#2563eb"
      />
    </div>
  );
}

export default App;
```

### YouTube

```tsx
<VPlayer
  src="https://www.youtube.com/watch?v=jNQXAC9IVRw"
  title="Me at the zoo"
  accentColor="#ff0000"
/>
```

### Vimeo

```tsx
<VPlayer
  src="https://vimeo.com/347119375"
  title="Vimeo Video"
  accentColor="#1ab7ea"
/>
```

### Bilibili

```tsx
<VPlayer
  src="https://www.bilibili.com/video/BV1GJ411x7h7"
  title="Bilibili Video"
  accentColor="#fb7299"
/>
```

### Brand Configuration

```tsx
<VPlayer
  src="/product-demo.mp4"
  accentColor="#2563eb"  // Progress bar, thumb, active states
  iconColor="#ffffff"    // Play/pause, volume, fullscreen icons
  poster="/brand-poster.jpg"
  title="Brand Demo"
/>
```

### Vanilla JavaScript / CDN

VPlayer is a React component, so for vanilla JS usage you need React as a peer dependency. You can use it via a bundler or CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VPlayer Demo</title>
</head>
<body>
  <div id="player-root"></div>

  <script src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/vplayer-react/dist/index.umd.js"></script>

  <script>
    const root = ReactDOM.createRoot(document.getElementById('player-root'));
    root.render(
      React.createElement(VPlayerReact.VPlayer, {
        src: 'https://example.com/video.mp4',
        poster: 'https://example.com/poster.jpg',
        title: 'My Video',
        accentColor: '#e11d48',
        iconColor: '#ffffff',
        aspectRatio: '16:9',
      })
    );
  </script>
</body>
</html>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Video source URL (local, YouTube, Vimeo, or Bilibili) |
| `poster` | `string` | built-in default | Poster image URL shown before playback |
| `width` | `string \| number` | `"100%"` | Player width (CSS value or pixel number) |
| `aspectRatio` | `string` | `"16:9"` | Aspect ratio as `"w:h"` string |
| `accentColor` | `string` | `"#e11d48"` | Brand color for progress bar, thumb, and active UI |
| `iconColor` | `string` | `"#ffffff"` | Color for play/pause and control icons |
| `autoPlay` | `boolean` | `false` | Autoplay on mount |
| `loop` | `boolean` | `false` | Loop video playback |
| `muted` | `boolean` | `false` | Start muted |
| `title` | `string` | - | Title overlay shown during playback |
| `className` | `string` | - | CSS class for the outer container |
| `style` | `CSSProperties` | - | Inline styles for the outer container |
| `preload` | `"none" \| "metadata" \| "auto"` | `"metadata"` | Preload behavior for native video |
| `ariaLabel` | `string` | auto-generated | Custom ARIA label |
| `onPlay` | `() => void` | - | Callback when video starts playing |
| `onPause` | `() => void` | - | Callback when video is paused |
| `onEnded` | `() => void` | - | Callback when video ends |
| `onTimeUpdate` | `(time, duration) => void` | - | Callback with current time updates |

---

## Keyboard Shortcuts

All shortcuts are **scoped to the player** - they only work when the player has focus (after clicking on it). They never hijack the page's keyboard behavior.

| Key | Action |
|-----|--------|
| `Space` / `K` | Play / Pause |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
| `Left Arrow` | Rewind 5 seconds |
| `Right Arrow` | Forward 5 seconds |
| `Up Arrow` | Volume up |
| `Down Arrow` | Volume down |
| `0`-`9` | Seek to 0%-90% |
| `<` / `>` | Decrease / Increase playback speed |

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
// Components
export { VPlayer } from 'vplayer-react';

// Types
export type { VPlayerProps, VideoSource, VideoState, ParsedSource } from 'vplayer-react';

// Utilities
export { parseVideoSource, formatTime, parseAspectRatio } from 'vplayer-react';
```

---

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

Picture-in-Picture requires browser support (Chrome, Edge, Safari). Fullscreen API is supported in all modern browsers.

---

## License

MIT
