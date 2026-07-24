/**
 * generate-meta.ts
 *
 * Generates all site metadata files from their .template counterparts using
 * the token map built by script/meta-tokens.ts (values from content/ plus
 * composed sections generated from the content collections). Called at the
 * very start of the build so Vite and every downstream tool always sees
 * up-to-date values.
 *
 * Output files (git-tracked, never hand-edit):
 *   client/index.html
 *   client/public/robots.txt
 *   client/public/sitemap.xml
 *   client/public/llms.txt
 *   client/public/llms-full.txt
 *   CNAME
 *
 * Source templates (git-tracked, edit these instead):
 *   client/index.html.template
 *   client/public/robots.txt.template
 *   client/public/sitemap.xml.template
 *   client/public/llms.txt.template
 *   client/public/llms-full.txt.template
 *   CNAME.template
 */

import { readFile, writeFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { applyTokens } from "./meta-tokens";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── File pairs ───────────────────────────────────────────────────────────────
const pairs: [string, string][] = [
  ["client/index.html.template", "client/index.html"],
  ["client/public/robots.txt.template", "client/public/robots.txt"],
  ["client/public/sitemap.xml.template", "client/public/sitemap.xml"],
  ["client/public/llms.txt.template", "client/public/llms.txt"],
  ["client/public/llms-full.txt.template", "client/public/llms-full.txt"],
  ["CNAME.template", "CNAME"],
];

// ── Run ──────────────────────────────────────────────────────────────────────
console.log("generate-meta: building site metadata files...");

const problems: string[] = [];

await Promise.all(
  pairs.map(async ([templateRel, outputRel]) => {
    const templatePath = resolve(root, templateRel);
    const outputPath = resolve(root, outputRel);

    const template = await readFile(templatePath, "utf-8");
    const output = applyTokens(template);

    // Detect leftover placeholders — typos or missing config values must
    // fail the build, never ship as literal {{TOKENS}}.
    const remaining = output.match(/\{\{[A-Z_]+\}\}/g);
    if (remaining) {
      problems.push(`${outputRel}: unresolved tokens: ${[...new Set(remaining)].join(", ")}`);
    }

    await writeFile(outputPath, output, "utf-8");
    console.log(`  ✓  ${outputRel}`);
  })
);

if (problems.length > 0) {
  console.error("\ngenerate-meta: FAILED — unresolved template tokens:");
  for (const p of problems) console.error(`  ✗  ${p}`);
  process.exit(1);
}

console.log("generate-meta: done.");
