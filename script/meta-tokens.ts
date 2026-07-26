/**
 * meta-tokens.ts — single source of the {{TOKEN}} map used by
 * script/generate-meta.ts (to fill the .template files) and by
 * script/validate-seo.ts (to compute the expected values for cross-checks).
 *
 * Two kinds of tokens:
 *   1. Base tokens — direct values from content/site.config.ts plus
 *      build-time stamps (BUILD_YEAR, SITEMAP_LASTMOD…).
 *   2. Composed sections — Markdown/JSON fragments generated from the
 *      content/ collections (services, team, stats, work, timeline,
 *      testimonial, faq) so llms.txt, llms-full.txt and the FAQPage /
 *      OfferCatalog JSON-LD can never go stale when content/ changes.
 *
 * Composed values are fully resolved (no leftover {{TOKENS}} inside them)
 * before being added to the map.
 */
import { readFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const { siteConfig: cfg } = await import("../content/site.config.js").catch(
  () => import("../content/site.config.ts" as any)
);
const { services } = await import("../content/services.js").catch(() => import("../content/services.ts" as any));
const { teamMembers } = await import("../content/team.js").catch(() => import("../content/team.ts" as any));
const { stats } = await import("../content/stats.js").catch(() => import("../content/stats.ts" as any));
const { companies } = await import("../content/companies.js").catch(() => import("../content/companies.ts" as any));
const { engagements } = await import("../content/work.js").catch(() => import("../content/work.ts" as any));
const { testimonial } = await import("../content/testimonial.js").catch(() => import("../content/testimonial.ts" as any));
const { resolvedFaq, servicesInline } = await import("../content/faq.js").catch(() => import("../content/faq.ts" as any));
const { whyContent } = await import("../content/why.js").catch(() => import("../content/why.ts" as any));

/** Re-exported for validate-seo.ts — resolved in content/faq.ts, the single source of truth. */
export { resolvedFaq };
export type ResolvedFaqItem = { question: string; answer: string };

// timeline.tsx contains JSX (not importable under plain tsx without a React
// pragma) — extract the plain-string fields from source instead.
const timelineSrc = await readFile(resolve(root, "content/timeline.tsx"), "utf-8");
export const timelineEntries = [...timelineSrc.matchAll(
  /^\s*year:\s*"([^"]+)",\s*\n\s*title:\s*"([^"]+)",\s*\n\s*summary:\s*\n?\s*"([^"]+)"/gm
)].map((m) => ({ year: m[1], title: m[2], summary: m[3] }));
if (timelineEntries.length === 0) {
  throw new Error(
    "meta-tokens: no timeline entries extracted from content/timeline.tsx — every entry needs year, title and summary string fields (in that order)"
  );
}

// "en_US", "fr_FR" — derive from locales array
function toOgLocale(locale: string): string {
  const map: Record<string, string> = {
    en: "en_US", fr: "fr_FR", de: "de_DE", es: "es_ES",
    pt: "pt_PT", it: "it_IT", nl: "nl_NL", pl: "pl_PL",
  };
  return map[locale] ?? locale;
}

// ── Computed build-time values ───────────────────────────────────────────────
const now = new Date();
const buildDateISO = now.toISOString().slice(0, 10); // UTC YYYY-MM-DD
const buildYear = String(now.getUTCFullYear());
const buildMonthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

// hreflang: only the default locale + x-default. Other entries in
// cfg.locales feed knowsLanguage / og:locale:alternate, but until a dedicated
// translated URL exists we must not emit hreflang alternates that point at
// the same page (Google treats hreflang to an untranslated URL as incorrect).
const hreflangLinks = [
  `<link rel="alternate" hreflang="${cfg.locales[0]}" href="${cfg.url}" />`,
  `<link rel="alternate" hreflang="x-default" href="${cfg.url}" />`,
].join("\n    ");

// ── Base tokens ──────────────────────────────────────────────────────────────
const baseTokens: Record<string, string> = {
  SITE_NAME: cfg.name,
  SITE_SHORT_NAME: cfg.shortName,
  SITE_DOMAIN: cfg.domain,
  SITE_URL: cfg.url,
  SITE_EMAIL: cfg.email,
  SITE_TITLE: cfg.title,
  SITE_TITLE_HTML: cfg.title.replace(/&/g, "&amp;"),
  SITE_TAGLINE: cfg.tagline,
  SLOGAN: cfg.slogan,
  SLOGAN_LOWER: cfg.slogan.charAt(0).toLowerCase() + cfg.slogan.slice(1),
  SITE_DESCRIPTION: cfg.description,
  SITE_KEYWORDS: cfg.keywords,
  SITE_OG_IMAGE: cfg.ogImage,
  SITE_THEME_COLOR: cfg.colors.themeColor,
  SITE_LOCALE: cfg.locales[0],
  SITE_LOCALE_OG: toOgLocale(cfg.locales[0]),
  SITE_ALT_LOCALE_OG: toOgLocale(cfg.locales[1] ?? cfg.locales[0]),
  SITE_FOUNDING_DATE: cfg.foundingDate,
  SITE_ADDRESS_STREET: cfg.address.street,
  SITE_ADDRESS_CITY: cfg.address.city,
  SITE_ADDRESS_POSTAL: cfg.address.postalCode,
  SITE_ADDRESS_COUNTRY: cfg.address.country,
  SITE_ADDRESS_COUNTRY_CODE: cfg.address.countryCode,
  SITE_ADDRESS_FULL: `${cfg.address.street}, ${cfg.address.postalCode} ${cfg.address.city}, ${cfg.address.country}`,
  SITE_LOCATIONS: cfg.locations,
  SITE_LOCATIONS_PROSE:
    cfg.locationCities.length > 1
      ? `${cfg.locationCities.slice(0, -1).join(", ")} and ${cfg.locationCities.at(-1)}`
      : cfg.locationCities.join(""),
  AREA_SERVED_JSONLD: [
    ...cfg.locationCities.map((city: string) => ["City", city] as const),
    ["Country", cfg.address.country] as const,
  ]
    .map(([type, name]) => `{ "@type": ${JSON.stringify(type)}, "name": ${JSON.stringify(name)} }`)
    .join(",\n        "),
  TEAM_PRELOAD_IMAGE: teamMembers[0].src,
  SITEMAP_LASTMOD: buildDateISO,
  BUILD_YEAR: buildYear,
  BUILD_MONTH_YEAR: buildMonthYear,
  HREFLANG_LINKS: hreflangLinks,
};

/** Replace every {{TOKEN}} in `text` using the base token map. */
export function resolveBase(text: string): string {
  return Object.entries(baseTokens).reduce(
    (t, [key, value]) => t.replaceAll(`{{${key}}}`, value),
    text
  );
}

// ── Composed sections (fully resolved) ───────────────────────────────────────
// FAQ + inline services summary now resolve in content/faq.ts (shared with
// the visible homepage FAQ section) — imported above.

// Organization sameAs — registry links from content/companies.ts + team
// LinkedIn URLs from content/team.ts, so the list can never go stale when
// the team or the registered entities change. Exported for validate-seo.ts.
export const orgSameAs: string[] = [
  ...companies.flatMap((c: any) => c.links.map((l: any) => l.href)),
  ...teamMembers.filter((m: any) => m.linkedin).map((m: any) => m.linkedin),
];

// Derived people/company tokens so the narrative templates never hardcode
// personal names, spaced acronyms, or SIREN numbers (template-safety):
// everything below comes from content/team.ts and content/companies.ts.
const numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const teamNames: string[] = teamMembers.map((m: any) => String(m.name));
const teamNamesList =
  teamNames.length > 1 ? `${teamNames.slice(0, -1).join(", ")}, and ${teamNames.at(-1)}` : teamNames.join("");

const externalRefs: { label: string; href: string }[] = [
  ...companies.flatMap((c: any) =>
    c.links.map((l: any) => ({ label: `${l.label} — ${c.name} (SIREN ${c.siren})`, href: l.href }))
  ),
  ...teamMembers.flatMap((m: any) => [
    ...(m.linkedin ? [{ label: `${m.name} — LinkedIn`, href: m.linkedin }] : []),
    ...((m.refs ?? []) as { label: string; href: string }[]),
  ]),
];

// Organization.alternateName — short name + registered entity names that
// differ from the public brand name (e.g. the spaced acronym of an older
// legal entity), so no alternate spelling is hardcoded in the template.
const alternateNames = [
  ...new Set<string>([cfg.shortName, ...companies.map((c: any) => String(c.name)).filter((n: string) => n !== cfg.name)]),
];

// Per-company tokens for narrative prose ({{COMPANY_1_SIREN}}, …).
const companyTokens: Record<string, string> = {};
companies.forEach((c: any, i: number) => {
  const n = i + 1;
  companyTokens[`COMPANY_${n}_NAME`] = c.name;
  companyTokens[`COMPANY_${n}_SIREN`] = c.siren;
  companyTokens[`COMPANY_${n}_FOUNDED`] = c.founded;
  companyTokens[`COMPANY_${n}_FOUNDED_TEXT`] = c.foundedDateText ?? c.founded;
  companyTokens[`COMPANY_${n}_FOUNDER`] = c.founder ?? "";
});

const composed: Record<string, string> = {
  SERVICES_INLINE: servicesInline,

  // /why page head tokens (client/why/index.html.template) — sourced from
  // content/why.ts so the /why head can never drift from the page copy.
  WHY_TITLE: whyContent.seo.title,
  WHY_DESCRIPTION: whyContent.seo.description,
  WHY_BREADCRUMB_LABEL: whyContent.seo.breadcrumbLabel,
  // hreflang for /why: default locale + x-default only (same policy as the
  // homepage — no translated /why URL exists yet).
  WHY_HREFLANG_LINKS: [
    `<link rel="alternate" hreflang="${cfg.locales[0]}" href="${cfg.url}why" />`,
    `<link rel="alternate" hreflang="x-default" href="${cfg.url}why" />`,
  ].join("\n    "),

  // People / legal-entity tokens (derived from content/, never hardcoded)
  ...companyTokens,
  FOUNDER_NAME: teamMembers[0].name,
  FOUNDING_YEAR: cfg.foundingDate.slice(0, 4),
  TEAM_COUNT_WORD: numberWords[teamMembers.length] ?? String(teamMembers.length),
  TEAM_NAMES: teamNamesList,
  LLMS_LEGAL_IDS: companies
    .map((c: any) =>
      `- SIREN ${c.siren} (${c.name}, created ${c.foundedDateText ?? c.founded}${c.founder ? ` by ${c.founder}` : ""})`
    )
    .join("\n"),
  LLMS_EXTERNAL_REFS: externalRefs.map((r) => `- [${r.label}](${r.href})`).join("\n"),
  LLMS_EXTERNAL_REFS_PLAIN: externalRefs.map((r) => `- ${r.label}: ${r.href}`).join("\n"),
  ORG_ALTERNATE_NAMES_JSONLD: alternateNames.map((n) => JSON.stringify(n)).join(", "),

  // llms.txt (summary format)
  LLMS_SERVICES: services
    .map((s: any, i: number) => `${i + 1}. **${s.title}** — ${s.description}`)
    .join("\n"),
  LLMS_TEAM: teamMembers
    .map((m: any) => `- **${m.name}**${m.linkedin ? ` ([LinkedIn](${m.linkedin}))` : ""} — ${m.role}. ${m.bio}`)
    .join("\n"),
  LLMS_STATS: stats
    .map((s: any) => `- **${s.value}${s.suffix}** ${s.label} (${s.sub})`)
    .join("\n"),
  LLMS_TRACK_RECORD: engagements
    .map((e: any) => `- **${e.title}** — ${e.category} (${e.year}): ${e.description} Outcome: ${e.outcome}.`)
    .join("\n"),
  LLMS_HISTORY: timelineEntries
    .map((t) => `- **${t.year}** — ${t.title}: ${t.summary}`)
    .join("\n"),
  LLMS_FAQ: resolvedFaq
    .map((f) => `**${f.question}**\n${f.answer}`)
    .join("\n\n"),

  // llms-full.txt (expanded format)
  LLMS_SERVICES_FULL: services
    .map((s: any, i: number) => `### ${i + 1}. ${s.title}\n${s.description}\n\nOutcomes: ${s.outcomes.join("; ")}.`)
    .join("\n\n"),
  LLMS_TEAM_FULL: teamMembers
    .map((m: any) => `### ${m.name} — ${m.role} (${m.since})\n${m.linkedin ? `LinkedIn: ${m.linkedin}\n\n` : ""}${m.bio}`)
    .join("\n\n"),
  LLMS_TESTIMONIAL: `"${testimonial.quote}"\n— ${testimonial.author}, ${testimonial.role}`,

  // JSON-LD fragments for client/index.html
  FAQ_JSONLD_ENTITIES: resolvedFaq
    .map((f) =>
      JSON.stringify(
        { "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } },
        null, 2
      ).replace(/^/gm, "        ").trimStart()
    )
    .join(",\n        "),
  ORG_SAMEAS_JSONLD: orgSameAs
    .map((u) => JSON.stringify(u))
    .join(",\n        "),
  // Organization founder (first entry in content/team.ts) + member list (the
  // rest), so the JSON-LD team can never go stale when content/team.ts changes.
  TEAM_JSONLD_FOUNDER: JSON.stringify(
    {
      "@type": "Person",
      name: teamMembers[0].name,
      jobTitle: teamMembers[0].role,
      ...(teamMembers[0].linkedin ? { url: teamMembers[0].linkedin } : {}),
      description: teamMembers[0].bio,
    },
    null, 2
  ).replace(/^/gm, "      ").trimStart(),
  TEAM_JSONLD_MEMBERS: teamMembers
    .slice(1)
    .map((m: any) =>
      JSON.stringify(
        {
          "@type": "Person",
          name: m.name,
          jobTitle: m.role,
          ...(m.linkedin ? { url: m.linkedin } : {}),
          description: m.bio,
        },
        null, 2
      ).replace(/^/gm, "        ").trimStart()
    )
    .join(",\n        "),
  SERVICES_OFFER_JSONLD_ENTITIES: services
    .map((s: any) =>
      JSON.stringify(
        { "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.description } },
        null, 2
      ).replace(/^/gm, "          ").trimStart()
    )
    .join(",\n          "),
};

// Composed values must be fully resolved before entering the map.
for (const key of Object.keys(composed)) composed[key] = resolveBase(composed[key]);

export const tokens: Record<string, string> = { ...baseTokens, ...composed };

/** Replace every {{TOKEN}} (base + composed) in a template. */
export function applyTokens(template: string): string {
  return Object.entries(tokens).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value),
    template
  );
}
