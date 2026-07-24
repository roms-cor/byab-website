/**
 * Test synthétique du mécanisme d'enrichissement par issues.
 * (L'historique réel ne contient pas encore de « Closes #N » / « Refs #N ».)
 *
 * Usage : npx tsx script/test-changelog-enrich.ts
 */

import assert from "node:assert/strict";
import { extractIssueRefs, enrichChangelog } from "./changelog-enrich";

// --- extractIssueRefs ---
assert.deepEqual(extractIssueRefs("fix: bug\n\nCloses #42"), [
  { keyword: "Closes", number: 42 },
]);
assert.deepEqual(extractIssueRefs("feat: x — Refs #7 et Closes #12"), [
  { keyword: "Refs", number: 7 },
  { keyword: "Closes", number: 12 },
]);
assert.deepEqual(extractIssueRefs("feat: sans référence"), []);
assert.deepEqual(extractIssueRefs("voir issue #5 sans mot-clé"), []);

// --- enrichChangelog : enrichissement nominal ---
const md = [
  "### Corrections",
  "",
  "- fix: bug de formulaire ([abc1234](https://github.com/roms-cor/byab-website/commit/abc1234def))", // template-ok: repo slug (deploy/changelog plumbing), reviewed via duplication checklist
  "- fix: autre bug ([def5678](https://github.com/roms-cor/byab-website/commit/def5678abc))", // template-ok: repo slug (deploy/changelog plumbing), reviewed via duplication checklist
].join("\n");

const refs = new Map([["abc1234", [{ keyword: "Closes", number: 42 }]]]);

const enriched = await enrichChangelog(md, refs, async (n) =>
  n === 42 ? "Le formulaire ne s'envoie pas" : null,
);
assert.ok(
  enriched.includes(
    "— Closes [#42](https://github.com/roms-cor/byab-website/issues/42) : Le formulaire ne s'envoie pas", // template-ok: repo slug (deploy/changelog plumbing), reviewed via duplication checklist
  ),
  "l'entrée doit être enrichie du titre de l'issue",
);
assert.ok(
  enriched.includes("- fix: autre bug ([def5678]"),
  "les entrées sans référence restent inchangées",
);

// --- Repli silencieux : issue introuvable → ligne inchangée ---
const notFound = await enrichChangelog(md, refs, async () => null);
assert.equal(notFound, md, "issue introuvable → markdown identique");

// --- Repli silencieux : API en échec (exception) → ligne inchangée ---
const apiDown = await enrichChangelog(md, refs, async () => {
  throw new Error("API indisponible");
});
assert.equal(apiDown, md, "API en échec → markdown identique");

console.log("✓ Tous les tests d'enrichissement passent (4 groupes).");
