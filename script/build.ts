import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile } from "fs/promises";
import { execSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, resolve } from "path";
import { buildDefines } from "./build-defines";

// Force production behavior regardless of the shell environment so the build
// is identical on Replit and in GitHub Actions: prod React in the prerender,
// no Replit-only dev plugins.
process.env.NODE_ENV ||= "production";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

/**
 * Prerender the full homepage to static HTML and inject it into the built
 * index.html in place of the <!--ssr-outlet--> marker.
 *
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) and other non-JS
 * agents therefore see the complete page content, not an empty shell.
 * The client bundle re-renders into #root on load from the same components
 * and content/, so the visible result is unchanged.
 */
async function prerender(define: Record<string, string>) {
  const prerenderOut = resolve(rootDir, "dist/prerender");

  await viteBuild({
    configFile: resolve(rootDir, "vite.config.ts"),
    define,
    logLevel: "warn",
    publicDir: false as const,
    build: {
      ssr: resolve(rootDir, "client/src/entry-prerender.tsx"),
      outDir: prerenderOut,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "entry-prerender.mjs" } },
    },
  });

  const mod = await import(pathToFileURL(resolve(prerenderOut, "entry-prerender.mjs")).href);
  const appHtml: string = mod.render();
  if (!appHtml || appHtml.length < 5000) {
    throw new Error(`prerender: rendered HTML suspiciously small (${appHtml?.length ?? 0} chars) — homepage render is broken`);
  }

  const htmlPath = resolve(rootDir, "dist/public/index.html");
  let html = await readFile(htmlPath, "utf-8");
  const marker = "<!--ssr-outlet-->";
  if (!html.includes(marker)) {
    throw new Error(`prerender: ${marker} marker not found in dist/public/index.html — check client/index.html.template`);
  }
  // Function replacement avoids `$`-pattern interpretation in the HTML.
  html = html.replace(marker, () => appHtml);
  await writeFile(htmlPath, html, "utf-8");

  await rm(prerenderOut, { recursive: true, force: true });
  console.log(`prerender: injected ${(appHtml.length / 1024).toFixed(1)} kB of static homepage HTML`);
}

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  // Blocking guard: no hardcoded color literals outside the token sheet.
  console.log("linting (hardcoded-color guard)...");
  execSync("npx eslint client/src content", { stdio: "inherit", cwd: rootDir });

  console.log("generating site metadata...");
  execSync(`npx tsx "${resolve(scriptDir, "generate-meta.ts")}"`, {
    stdio: "inherit",
  });

  // Regenerate the social share card from the current logo + brand colors so
  // it can never go stale. Runs before the client build because Vite copies
  // client/public into dist/public.
  console.log("generating share card (og-image)...");
  execSync(`npx tsx "${resolve(scriptDir, "generate-og-image.ts")}"`, {
    stdio: "inherit",
  });

  // One set of compile-time constants shared by the client and prerender
  // builds so the footer version line is identical in both renders.
  const define = buildDefines();

  console.log("building client...");
  await viteBuild({
    configFile: resolve(rootDir, "vite.config.ts"),
    define,
  });

  console.log("prerendering homepage...");
  await prerender(define);

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("validating SEO/GEO output...");
  execSync(`npx tsx "${resolve(scriptDir, "validate-seo.ts")}"`, {
    stdio: "inherit",
  });
}

buildAll()
  .then(() => {
    const pushScript = resolve(scriptDir, "push-to-github.sh");
    console.log("pushing to GitHub...");
    try {
      execSync(`bash "${pushScript}"`, { stdio: "inherit" });
    } catch {
      console.warn("⚠ GitHub push failed — build succeeded, deploy manually if needed");
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
