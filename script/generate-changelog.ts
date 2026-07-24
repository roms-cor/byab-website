/**
 * Génère CHANGELOG.md avec git-cliff puis l'enrichit avec les titres des
 * issues GitHub référencées par « Closes #N » / « Refs #N ».
 *
 * Usage : npx tsx script/generate-changelog.ts
 * Optionnel : GITHUB_TOKEN pour l'API GitHub (dépôt public → fonctionne sans).
 * L'enrichissement ne fait jamais échouer la génération (repli silencieux).
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { extractIssueRefs, enrichChangelog, type IssueRef } from "./changelog-enrich";

const REPO = "roms-cor/byab-website"; // template-ok: repo slug (deploy/changelog plumbing), reviewed via duplication checklist
const OUTPUT = "CHANGELOG.md";

// 1. Génération de base avec git-cliff
execFileSync("npx", ["git-cliff", "--output", OUTPUT], { stdio: "inherit" });

// 2. Cartographie SHA court → références d'issues dans les messages complets
const log = execFileSync("git", ["log", "--pretty=%h%x00%B%x01"], {
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});
const shaToRefs = new Map<string, IssueRef[]>();
for (const entry of log.split("\x01")) {
  const [sha, body] = entry.split("\x00");
  if (!sha || body === undefined) continue;
  const refs = extractIssueRefs(body);
  if (refs.length > 0) shaToRefs.set(sha.trim(), refs);
}

// 3. Récupération des titres d'issues (repli silencieux)
async function fetchIssueTitle(issueNumber: number): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "byab-changelog", // template-ok: repo slug (deploy/changelog plumbing), reviewed via duplication checklist
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}`, {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return typeof data.title === "string" && data.title.length > 0 ? data.title : null;
  } catch {
    return null;
  }
}

// 4. Enrichissement du markdown généré
const markdown = readFileSync(OUTPUT, "utf8");
const enriched = await enrichChangelog(markdown, shaToRefs, fetchIssueTitle);
if (enriched !== markdown) writeFileSync(OUTPUT, enriched);

console.log(
  `CHANGELOG.md généré (${shaToRefs.size} commit(s) avec référence d'issue détectée).`,
);
