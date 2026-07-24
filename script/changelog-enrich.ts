/**
 * Enrichissement du changelog par les titres d'issues GitHub.
 *
 * Détecte « Closes #N » / « Refs #N » dans les messages de commit et ajoute
 * le titre de l'issue à la fin de l'entrée correspondante du changelog.
 * Repli silencieux : si le titre est introuvable, l'entrée reste inchangée.
 * Le mot-clé « Closes » n'est jamais modifié dans le message de commit —
 * GitHub garde ainsi son comportement natif de fermeture d'issue.
 */

export interface IssueRef {
  keyword: string; // "Closes" ou "Refs" (casse d'origine préservée)
  number: number;
}

/** Extrait les références « Closes #N » / « Refs #N » d'un message de commit complet. */
export function extractIssueRefs(message: string): IssueRef[] {
  const refs: IssueRef[] = [];
  const re = /\b(Closes|Refs)\s+#(\d+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(message)) !== null) {
    refs.push({ keyword: m[1], number: parseInt(m[2], 10) });
  }
  return refs;
}

/** Récupère le titre d'une issue ; retourne null en cas d'échec (jamais d'exception). */
export type IssueTitleFetcher = (issueNumber: number) => Promise<string | null>;

/**
 * Post-traite le markdown généré par git-cliff : pour chaque ligne d'entrée
 * contenant un lien de commit dont le SHA court figure dans `shaToRefs`,
 * ajoute « — Closes #N : <titre> » pour chaque référence dont le titre a pu
 * être récupéré. Les échecs sont silencieux (ligne inchangée).
 */
export async function enrichChangelog(
  markdown: string,
  shaToRefs: Map<string, IssueRef[]>,
  fetchTitle: IssueTitleFetcher,
  repoUrl = "https://github.com/roms-cor/byab-website",
): Promise<string> {
  const lines = markdown.split("\n");
  const out: string[] = [];
  for (const line of lines) {
    const m = line.match(/\[([0-9a-f]{7})\]\([^)]*\/commit\/[0-9a-f]+\)/);
    const refs = m ? shaToRefs.get(m[1]) : undefined;
    if (!refs || refs.length === 0) {
      out.push(line);
      continue;
    }
    const suffixes: string[] = [];
    for (const ref of refs) {
      let title: string | null = null;
      try {
        title = await fetchTitle(ref.number);
      } catch {
        title = null; // repli silencieux
      }
      if (title) {
        suffixes.push(
          `${ref.keyword} [#${ref.number}](${repoUrl}/issues/${ref.number}) : ${title}`,
        );
      }
    }
    out.push(suffixes.length > 0 ? `${line} — ${suffixes.join(" ; ")}` : line);
  }
  return out.join("\n");
}
