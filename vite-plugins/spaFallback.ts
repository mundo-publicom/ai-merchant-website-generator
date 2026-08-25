import { copyFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Writes dist/404.html as a copy of dist/index.html.
 *
 * GitHub Pages is static hosting with no rewrite rules, so a deep link like
 * /plan/basics would otherwise 404 instead of reaching BrowserRouter. Pages
 * serves 404.html for unknown paths without changing the URL, so the SPA boots
 * and React Router resolves the route as normal.
 */
export function spaFallback(): Plugin {
  let outDir = "dist";

  return {
    name: "WebBlueprint-spa-fallback",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
    },
  };
}
