/**
 * build-defines.ts
 *
 * Single source of truth for the compile-time constants injected into the
 * client bundle (used by the footer version line in home.tsx).
 *
 * - vite.config.ts calls this for dev and standalone builds.
 * - script/build.ts calls it ONCE and passes the same values to BOTH the
 *   client build and the prerender build, so the prerendered static HTML
 *   and the browser-rendered app show identical footer text.
 */
import { readFileSync } from "fs";
import { execSync } from "child_process";

export function buildDefines(): Record<string, string> {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));

  let gitCommitDate = "";
  try {
    const log = execSync("git log -2 --format=%cI", { encoding: "utf-8" }).trim().split("\n");
    const msg = execSync("git log -1 --format=%s", { encoding: "utf-8" }).trim();
    // Skip the automated publish commit so the footer shows the last real change
    gitCommitDate = msg.startsWith("chore(publish)") && log[1] ? log[1] : log[0];
  } catch { /* no git available */ }

  return {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __GIT_COMMIT_DATE__: JSON.stringify(gitCommitDate),
  };
}
