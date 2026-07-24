/**
 * generate-meta.ts
 *
 * Reads content/site.config.ts and generates all site metadata files from
 * their .template counterparts.  Called at the very start of the build so
 * Vite and every downstream tool always sees up-to-date values.
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Import siteConfig ────────────────────────────────────────────────────────
// We use a dynamic import with ts-node/esm or tsx support.
// At build time this is executed via `tsx script/generate-meta.ts`.
const { siteConfig } = await import("../content/site.config.js").catch(
  () => import("../content/site.config.ts" as any)
);

// ── Build the token map ──────────────────────────────────────────────────────
const cfg = siteConfig;

// "en_US", "fr_FR" — derive from locales array
function toOgLocale(locale: string): string {
  const map: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    de: "de_DE",
    es: "es_ES",
    pt: "pt_PT",
    it: "it_IT",
    nl: "nl_NL",
    pl: "pl_PL",
  };
  return map[locale] ?? locale;
}

// ── Computed build-time values ───────────────────────────────────────────────
// Sitemap <lastmod> and "as of" freshness markers are stamped automatically at
// build time so they can never go stale or stay wrong on a duplicated site.
const now = new Date();
const buildDateISO = now.toISOString().slice(0, 10); // UTC YYYY-MM-DD
const buildYear = String(now.getUTCFullYear());
const buildMonthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

// <link rel="alternate" hreflang="…"> tags for the static head — one per
// locale plus x-default (single-page site: all point at the canonical URL).
const hreflangLinks = [
  ...cfg.locales.map((locale: string) => `<link rel="alternate" hreflang="${locale}" href="${cfg.url}" />`),
  `<link rel="alternate" hreflang="x-default" href="${cfg.url}" />`,
].join("\n    ");

const tokens: Record<string, string> = {
  SITE_NAME: cfg.name,
  SITE_SHORT_NAME: cfg.shortName,
  SITE_DOMAIN: cfg.domain,
  SITE_URL: cfg.url,
  SITE_EMAIL: cfg.email,
  SITE_TITLE: cfg.title,
  // HTML-encoded version of the title (for use inside HTML attribute values)
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
  SITEMAP_LASTMOD: buildDateISO,
  BUILD_YEAR: buildYear,
  BUILD_MONTH_YEAR: buildMonthYear,
  HREFLANG_LINKS: hreflangLinks,
};

// ── Replacement helper ───────────────────────────────────────────────────────
function applyTokens(template: string): string {
  return Object.entries(tokens).reduce((text, [key, value]) => {
    // Global replace of {{KEY}} with the resolved value
    return text.replaceAll(`{{${key}}}`, value);
  }, template);
}

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
