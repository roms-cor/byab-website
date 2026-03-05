import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, writeFile } from "fs/promises";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

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

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

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
}

async function postBuildOptimize() {
  const htmlPath = resolve("dist/public/index.html");
  let html = await readFile(htmlPath, "utf-8");
  html = html.replace(
    /<link\s+rel="stylesheet"\s+[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g,
    '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'" crossorigin><noscript><link rel="stylesheet" href="$1" crossorigin></noscript>'
  );
  await writeFile(htmlPath, html);
  console.log("post-build: CSS made non-render-blocking");
}

buildAll()
  .then(() => postBuildOptimize())
  .then(() => {
    const scriptDir = dirname(fileURLToPath(import.meta.url));
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
