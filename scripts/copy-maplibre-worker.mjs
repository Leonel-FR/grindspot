// maplibre-gl resolves its Web Worker via `import.meta.url`, which
// Next.js's bundler (Turbopack in dev, webpack in prod) doesn't rewrite
// correctly — the worker silently fails to load, so vector tiles never
// render (the style/background paint fine, but roads/labels/land never
// appear). Self-hosting the worker as a static file and pointing
// maplibregl.setWorkerUrl() at it (see components/SpotsMap.jsx) sidesteps
// that resolution entirely. Runs via predev/prebuild so it's always in
// sync with whatever maplibre-gl version is actually installed.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(root, "node_modules/maplibre-gl/dist");
const destDir = join(root, "public");

mkdirSync(destDir, { recursive: true });

// The worker imports maplibre-gl-shared.mjs via a same-directory relative
// path, so both have to land next to each other under public/.
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(srcDir, file), join(destDir, file));
  console.log(`Copied maplibre-gl worker file to public/${file}`);
}
