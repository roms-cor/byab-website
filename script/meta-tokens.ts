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
const { engagements } = await import("../content/work.js").catch(() => import("../content/work.ts" as any));
const { testimonial } = await import("../content/testimonial.js").catch(() => import("../content/testimonial.ts" as any));
const { faq } = await import("../content/faq.js").catch(() => import("../content/faq.ts" as any));

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

const hreflangLinks = [
  ...cfg.locales.map((locale: string) => `<link rel="alternate" hreflang="${locale}" href="${cfg.url}" />`),
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
// Inline services summary, usable inside FAQ answers.
const servicesInline = services
  .map((s: any, i: number) => `(${i + 1}) ${s.title} — ${s.description}`)
  .join(" ");

/** Resolve base tokens + {{SERVICES_INLINE}} inside FAQ copy. */
const resolveFaq = (text: string) =>
  resolveBase(text.replaceAll("{{SERVICES_INLINE}}", servicesInline));

/** FAQ with all tokens resolved — also used by validate-seo.ts. */
export const resolvedFaq: { question: string; answer: string }[] = faq.map(
  (f: any) => ({ question: resolveFaq(f.question), answer: resolveFaq(f.answer) })
);

const composed: Record<string, string> = {
  SERVICES_INLINE: servicesInline,

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
