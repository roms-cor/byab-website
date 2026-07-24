# Revue approfondie — Tâches 6, 7 et 8 (Template · GEO · SEO)

*Rapport d'audit indépendant — 24 juillet 2026. Aucun fichier du site n'a été modifié par cette revue (les fichiers touchés pendant les stress-tests ont été restaurés à l'identique, vérifié par `git status` propre).*

**Verdict global : les trois tâches sont conformes.** Le build passe (149 vérifications ✓, 1 avertissement non bloquant), le validateur échoue bien quand on casse un invariant, et la page complète est visible sans JavaScript. Score GEO : **82/100**. Quelques trous subsistent, surtout côté « template-readiness » (chaînes de marque en dur qui échappent au scan).

---

## 1. Audit de conformité

### Tâche #6 — Extraction de la couche contenu

| Critère | Verdict | Preuve |
|---|---|---|
| Contenu éditorial typé sous `content/`, importé par la homepage | ✅ | 8 fichiers (`site.config.ts`, `team.ts`, `services.ts`, `timeline.tsx`, `work.ts`, `stats.ts`, `pain.ts`, `testimonial.ts`), tous importés dans `client/src/pages/home.tsx` via l'alias `@content` |
| Métadonnées générées au build depuis `site.config.ts` | ✅ | `script/generate-meta.ts` génère les 6 fichiers depuis leurs `.template` ; `npm run build` (exécuté ce jour) : `generate-meta: done.` ; tokens `{{…}}` non résolus = échec du build |
| Les blocs JSON-LD restent valides | ✅ | Les 6 blocs de `dist/public/index.html` parsent en JSON valide (Organization, ProfessionalService, WebSite, FAQPage, BreadcrumbList, SiteNavigationElement). ⚠️ Les plans parlent de « 7 blocs » : l'historique git montre qu'il n'y en a **jamais eu que 6** (vérifié sur les commits `3a7e89c`, `72280a3`, `22a6d6c`, `8fe8a4f`) — erreur de comptage dans les plans, pas une régression |
| `GITHUB_REPO` en variable d'env avec fallback | ✅ | `script/push-to-github.sh` : `REPO="${GITHUB_REPO:-roms-cor/byab-website}"` |
| `TEMPLATE.md` pour non-technicien | ✅ | Présent, 7 sections : fichiers à éditer, secrets, DNS Namecheap + GitHub Pages, liste « ne jamais toucher », images, pipeline SEO/GEO, checklist de duplication |
| Validation utilisateur étape par étape | ➖ | Processus conversationnel historique, non vérifiable dans le code — les 4 étapes existent bien dans les commits |

### Tâche #7 — Optimisation GEO du contenu

| Critère | Verdict | Preuve |
|---|---|---|
| Réécriture GEO de tous les fichiers `content/` | ✅ | Commit `22a6d6c`. Chaque bloc porte des données concrètes (« 57% operating profitability », « SIREN 481 631 471 », « since April 2005 »), entité nommée explicitement (« Because You Are Busy externalizes… » dans chaque description de service), marqueurs de fraîcheur (« Since April 2005 — as of 2026 ») |
| Titres de sections en questions/réponses « là où ça améliore l'extractabilité » | ⚠️ Partiel | Les H2 restent des affirmations (« Four ways we take it off your plate. », « You didn't start a company to manage its back-office. ») — quotables mais pas interrogatifs. Les vraies questions vivent dans le FAQ JSON-LD et les llms (« What is Because You Are Busy? »). Choix défendable (design intact), mais le critère n'est que partiellement exploité |
| `llms.txt` / `llms-full.txt` régénérés, format structuré | ✅ | 137 et 170 lignes, sections structurées, 13+ références externes sourcées (Pappers, Annuaire Entreprises, Le Figaro, Societe.com, LinkedIn) |
| FAQ JSON-LD : 5 Q&R en langage utilisateur, autonomes | ✅ | 5 questions (« What is… », « Who founded… », « Where is… located? »…), réponses de 2-4 phrases autosuffisantes, avec chiffres |
| Mot-clé « because you are busy » préservé partout | ✅ | title/config ✓, hero (`home.tsx:361`) ✓, about (`:641`) ✓, story quote (`:810`) ✓, contact (`:927`) ✓, schema (alternateName « Because Busy ») ✓, llms.txt (« ## Primary Keyword ») ✓. Footer : présent via les liens registres + logo, pas en phrase — cohérent avec l'existant |
| Site visuellement intact | ✅ | Seuls les fichiers de contenu/copy touchés dans `22a6d6c` ; aucun changement de composant/layout |

### Tâche #8 — Fondation build SEO/GEO & validation

| Critère | Verdict | Preuve |
|---|---|---|
| curl sans JS = homepage complète | ✅ | Prerender injecte **67,2 kB** de HTML statique ; texte visible = **11 770 caractères** (seuil validateur : 3 000). Vérifié dans `dist/public/index.html` : hero (« We run what »), services (« Operational Backbone »), équipe (« Cécile Noiriel »), story (« The founding conviction »), testimonial (« M. Laurent »), contact (`hello@becausebusy.com`), footer version — tous présents |
| Canonical, hreflang, JSON-LD dans le head statique, générés depuis la config | ✅ | `generate-meta.ts` produit `{{HREFLANG_LINKS}}` (en, fr, x-default) + canonical ; le validateur exige exactement 1 canonical = `cfg.url` |
| `lastmod` du sitemap stampé au build | ✅ | `<lastmod>2026-07-24</lastmod>` (date du jour) ; le validateur échoue si l'écart dépasse 48 h |
| `npm run build` échoue avec rapport explicite si invariant cassé | ✅ | Stress-tests (copies restaurées ensuite) : canonical supprimé → `exit=1`, « canonical: expected exactly 1, found 0 » ; JSON-LD corrompu → `exit=1`, « JSON-LD block #1 is invalid JSON » ; marque en dur ajoutée dans `client/src/` → `exit=1`, « hardcoded site name outside content/ ». ⚠️ Mais le scan est **contournable** (voir constat C1) |
| Même pipeline Replit / GitHub Actions | ✅ | `package.json` : `"build": "tsx script/build.ts"` ; `.github/workflows/deploy.yml:39` : `run: npm run build`. `NODE_ENV ||= "production"` force un comportement identique |
| Dupliquer = éditer `content/` seulement | ⚠️ Partiel | Vrai pour les métadonnées et le gros du contenu ; faux pour les chaînes listées en C1 |

### Invariants absolus

| Invariant | Verdict | Preuve |
|---|---|---|
| Ligne de version du footer intacte | ✅ | `home.tsx:1175-1176` (`__APP_VERSION__` / `__BUILD_DATE__` / `__GIT_COMMIT_DATE__`) ; le validateur vérifie `data-testid="text-footer-version"` + `v{version}` dans le HTML prerendu |
| `.github/workflows/` intouché | ✅ | `git log -- .github/workflows/` : dernier commit `9d08fa1`, **antérieur** aux commits des tâches 6-8 (`72280a3`, `22a6d6c`, `8fe8a4f`) |
| Site visuellement/fonctionnellement identique | ✅ | Hydratation React re-rend depuis les mêmes composants + `content/` ; les commits 6-8 ne touchent aucun style/composant ; build vert |

---

## 2. Scorecard GEO — **82/100**

Périmètre : contenu homepage, `llms.txt`, `llms-full.txt`, FAQ JSON-LD.

### Réponse directe — 17/20
Chaque section répond dans ses premiers mots. Exemples forts : *« Because You Are Busy externalizes your entire back-office — general secretariat, admin, finance, and compliance — so founders… stop drowning »* (réponse complète en ~30 mots) ; FAQ : *« Because You Are Busy (BYAB) is an operations, transformation, and growth consultancy founded in April 2005 by Cécile Noiriel in France. »* — citable telle quelle par un moteur IA.
**Manque** : les H2 homepage ne sont pas des questions ; le hero (*« We run what you can't get to anymore. »*) est un slogan, pas une réponse (compensé par le sous-texte).

### Autorité & statistiques — 18/20
Le point le plus fort. Données chiffrées sourcées partout : 57 % de rentabilité, 0 € de dette, ~130 000 € de CA, 2 SIREN, dates précises (1er avril 2005, 20 novembre 2015, 4 juillet 2025), et **13 sources tierces vérifiables** (Pappers, Annuaire Entreprises data.gouv, Le Figaro, Societe.com, LinkedIn) liées inline dans la timeline et les llms.
**Faiblesses** : le témoignage *« M. Laurent, Managing Partner, National Law Firm »* est anonymisé et invérifiable — c'est la seule affirmation non sourcée du site, et elle alimente un `aggregateRating` 5/5 basé sur 1 avis (signal fragile, voire risqué pour Google). Les outcomes du track record (*« Pipeline engineered »*) restent qualitatifs, sans chiffre.

### Structure & formatage — 15/20
llms.txt/llms-full.txt : excellents (titres questions, listes, paragraphes courts, sections Citations/Key Metrics). Homepage : bonnes listes (outcomes de services, pain points numérotés) mais titres non interrogatifs et pas de bloc Q&R visible sur la page (le FAQ n'existe qu'en JSON-LD — Google exige normalement que le contenu FAQPage soit visible sur la page).

### Profondeur thématique — 16/20
Couverture riche du positionnement (ops externalisées, secrétariat général cabinets d'avocats, growth B2B, transformation/data), différenciation explicite (*« neither a freelancer marketplace nor a large consulting firm »*), historique détaillé. **Manque** : une seule page — pas de contenu profond par service/métier (hors périmètre, mais plafonne le score).

### Optimisation technique — 16/20
6 blocs JSON-LD valides et cohérents avec la config, hreflang + canonical statiques, `lastmod` auto, `robots.txt` autorisant 18+ crawlers IA, fraîcheur auto-stampée (`{{BUILD_YEAR}}`, `{{BUILD_MONTH_YEAR}}`, `as of July 2026`).
**Faiblesses** : og-image réelle 400×210 vs 1200×630 déclaré (avertissement du validateur — déjà tâche #14) ; hreflang `fr` pointe vers la même page anglaise sans version française réelle ; pas de `dateModified` dans les schémas ; Cécile absente de `member[]` dans Organization (déjà tâche #11).

---

## 3. Vérifications techniques (résultats bruts)

- `GITHUB_PAT= npx tsx script/build.ts` : **succès** — 149 checks ✓, 1 warning (og-image), push GitHub proprement sauté sans PAT.
- HTML sans JS : 67,2 kB injectés, `<!--ssr-outlet-->` absent du build final, `#root` peuplé, 11 770 caractères de texte visible, 1 seul `<h1>`, landmarks `<main>/<footer>/<form>/<nav>` présents.
- JSON-LD : 6/6 blocs parsent ; tous les types requis présents ; URLs own-domain sur l'origine canonique.
- Cohérence config : `CNAME` = `becausebusy.com` = `cfg.domain` ✓ ; robots.txt `Sitemap:` ✓ ; sitemap `<loc>` ✓ ; llms* contiennent nom + email/domaine ✓ ; aucun `{{TOKEN}}` résiduel ✓.
- Stress-tests validateur (sur copies, tout restauré) : 3/3 cassures détectées avec `exit=1` et message explicite. **Mais** : un commentaire `// because you are busy` en minuscules ajouté dans `client/src/` **passe le scan** (0 détection) — le needle « site name » est sensible à la casse.

---

## 4. Template-readiness

Scan indépendant (`grep -i 'because you are busy|becausebusy|BYAB'` hors `content/` et `.template`) — chaînes de marque en dur trouvées dans les inputs de build :

| Fichier | Chaîne | Échappe au scan car |
|---|---|---|
| `client/src/pages/home.tsx` (×4 : lignes 361, 641, 810, 927) | « Because you are busy, » | casse différente de `cfg.name` (scan sensible à la casse) |
| `client/src/pages/home.tsx` (footer, ~lignes 1043-1055) | URLs Pappers/Figaro/Annuaire avec SIREN BYAB | URLs externes, ne contiennent pas `becausebusy.com` |
| `client/src/pages/coming-soon.tsx:39` | « Because you are busy » | casse |
| `client/src/pages/components.tsx` (×4) | noms de fichiers `byab-*.png` | « byab » minuscule ≠ `BYAB` |

Nuance : les 4 occurrences de `home.tsx` sont le **mot-clé principal voulu par la tâche #7** — les paramétrer naïvement casserait la copy. Mais pour un duplicata « autre métier », ces phrases, les liens registres du footer (SIREN BYAB) et les noms de téléchargement `byab-*` resteraient en dur. Le critère T8 « dupliquer = éditer seulement `content/` » est donc **partiellement** tenu.

**TEMPLATE.md** : exact et honnête (la §7.2 signale bien les textes FAQ/JSON-LD à revoir dans les templates, la §7.4 le fallback `GITHUB_REPO`). Deux imprécisions : (1) il mentionne `favicon.svg`, qui n'existe pas dans `client/public/` ; (2) il ne mentionne pas les chaînes en dur de `home.tsx`/footer listées ci-dessus dans la checklist de duplication.

---

## 5. Constats et recommandations

| # | Sévérité | Constat | Recommandation |
|---|---|---|---|
| C1 | **Important** | Le scan template-safety est contournable : casse différente (« Because you are busy ») et URLs registres/SIREN en dur dans `home.tsx`, `coming-soon.tsx`, `components.tsx` ne sont pas détectées | Rendre le needle « site name » insensible à la casse (avec liste d'exceptions pour les emplacements keyword voulus), et déplacer les liens registres du footer + le slogan vers `content/` |
| C2 | **Important** | og-image réelle 400×210 vs 1200×630 déclaré | Déjà couvert par la tâche #14 — rien à créer |
| C3 | Mineur | `aggregateRating` 5/5 fondé sur 1 témoignage anonyme invérifiable — risque de pénalité « self-serving reviews » Google et signal GEO faible | Retirer l'`aggregateRating` ou l'appuyer sur des avis vérifiables (Google Business Profile) ; idéalement sourcer/nommer le témoignage |
| C4 | Mineur | hreflang `fr` pointe vers la page anglaise ; il n'existe aucune version française | Retirer l'alternate `fr` tant qu'une version FR n'existe pas, ou créer la version FR |
| C5 | Mineur | Le FAQ n'existe qu'en JSON-LD, sans bloc Q&R visible sur la page — Google peut ignorer un FAQPage dont le contenu n'est pas affiché | Ajouter une section FAQ visible (couplée au JSON-LD) — améliorerait aussi le score « structure » |
| C6 | Mineur | Les plans parlent de « 7 blocs JSON-LD » ; il n'y en a que 6 (depuis toujours) | Corriger la référence dans la documentation projet ; aucune action code |
| C7 | Mineur | `validate-seo.ts` extrait `timeline.tsx` par regex (`title:`, `year:`) — fragile si le format change (guillemets échappés, template literals) | Accepté en l'état ; à durcir si `timeline` évolue |
| C8 | Mineur | TEMPLATE.md : `favicon.svg` inexistant ; checklist de duplication muette sur les chaînes en dur de C1 | Corriger lors du fix C1 |

### Liste d'actions priorisée
1. **C1** — Durcir le scan (insensibilité à la casse + exceptions) et externaliser slogan/liens registres vers `content/` — c'est le seul vrai trou du dispositif template.
2. **C3** — Assainir `aggregateRating`/témoignage (risque Google + faiblesse GEO).
3. **C5** — Section FAQ visible sur la page.
4. **C4** — Retirer ou concrétiser le hreflang `fr`.
5. **C6/C7/C8** — Corrections documentaires et durcissements opportunistes.

*(C2 = tâche #14 existante ; l'enrichissement du member[] Organization = tâche #11 ; la mise à jour auto des fichiers IA = tâche #15 — non re-proposés.)*
