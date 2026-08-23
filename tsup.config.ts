import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react", "react-dom"],
  // Preserve the React Server Components boundary — esbuild strips the
  // directive from module bodies, so re-inject it at the top of each bundle.
  banner: { js: '"use client";' },
});
