/**
 * validate-seo.ts — post-build SEO/GEO validation harness.
 *
 * Runs at the end of `npm run build` (see script/build.ts), after the client
 * build and prerender injection, and fails the build (exit 1) with an
 * explicit report when any SEO/GEO invariant is violated.
 *
 * Dependency-free: regex + JSON.parse only. Every expected value derives
 * from content/ (site.config.ts and the content collections), so the harness
 * works unchanged when the template is duplicated for another profession.
 *
 * What it guarantees:
 *   1. Head — exactly one title / description / canonical matching
 *      site.config; hreflang alternates for every locale + x-default;
 *      complete OG/Twitter set without duplicates; theme-color.
 *   2. JSON-LD — every block parses; required @types present; name / url /
 *      email / address / foundingDate consistent with site.config; all
 *      own-domain URLs use the canonical origin.
 *   3. Prerender — the full homepage content (hero, pain points, services,
 *      stats, engagements, team, timeline, testimonial, contact, footer) is
 *      present in the raw HTML, visible to crawlers that do NOT execute
 *      JavaScript (GPTBot, ClaudeBot, PerplexityBot, CCBot…).
 *   3b. /design page — prerendered static HTML at design/index.html with a
 *      dedicated head (own title/description, canonical /design, static
 *      noindex, no homepage JSON-LD), all sections and real token values
 *      visible without JS, and the design code kept out of the homepage JS
 *      graph (code-splitting invariant).
 *   3b′. /why page — prerendered, INDEXABLE conversion page at
 *      why/index.html: dedicated head from content/why.ts (canonical /why,
 *      index-follow robots), WebPage + BreadcrumbList JSON-LD only (no
 *      FAQPage duplication), full copy visible without JS, listed in
 *      sitemap.xml + llms.txt, own JS chunk out of the homepage graph.
 *   4. Files — robots.txt (crawlable /design, AI bots allowed), sitemap.xml
 *      (auto-stamped lastmod, no /design — noindex pages stay out), llms.txt,
 *      llms-full.txt and CNAME consistent with site.config; no unresolved
 *      {{TOKENS}} anywhere; og:image and icon/preload assets exist on disk.
 *   5. Template safety — brand name, short name, domain, email and street
 *      address from site.config are not hardcoded in build inputs outside
 *      the content/ layer (so a duplicate only needs to edit content/).
 */
import { readFile, readdir } from "fs/promises";
import { resolvedFaq, timelineEntries, orgSameAs } from "./meta-tokens";
import { join, relative, resolve, dirname } from "path";
import { fileURLToPath } from "url";
// Static token display texts — same code path the /design page renders
// (design-tokens.ts sheet literals), so expectations can never drift.
import { resolveTokenTexts } from "../client/src/sections/design/tokens";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distPub = resolve(root, "dist/public");

// ── Content layer (single source of truth) ──────────────────────────────────
const { siteConfig: cfg } = await import("../content/site.config.js").catch(
  () => import("../content/site.config.ts" as any)
);
const { services } = await import("../content/services.js").catch(() => import("../content/services.ts" as any));
const { teamMembers } = await import("../content/team.js").catch(() => import("../content/team.ts" as any));
const { stats } = await import("../content/stats.js").catch(() => import("../content/stats.ts" as any));
const { painPoints } = await import("../content/pain.js").catch(() => import("../content/pain.ts" as any));
const { engagements } = await import("../content/work.js").catch(() => import("../content/work.ts" as any));
const { testimonial } = await import("../content/testimonial.js").catch(() => import("../content/testimonial.ts" as any));
const { companies } = await import("../content/companies.js").catch(() => import("../content/companies.ts" as any));
const { whyContent } = await import("../content/why.js").catch(() => import("../content/why.ts" as any));

// timeline.tsx contains JSX (not importable under plain tsx without a React
// pragma) — extract the plain-string fields from source instead.
const timelineSrc = await readFile(resolve(root, "content/timeline.tsx"), "utf-8");
const timelineTitles = [...timelineSrc.matchAll(/^\s*title:\s*"([^"]+)"/gm)].map((m) => m[1]);
const timelineYears = [...timelineSrc.matchAll(/^\s*year:\s*"([^"]+)"/gm)].map((m) => m[1]);

const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf-8"));
const designTokenTexts = resolveTokenTexts();

// ── Reporting ────────────────────────────────────────────────────────────────
let passed = 0;
const errors: string[] = [];
const warnings: string[] = [];
const pass = () => { passed++; };
const fail = (msg: string) => { errors.push(msg); };
const warn = (msg: string) => { warnings.push(msg); };
const check = (cond: boolean, failMsg: string) => (cond ? pass() : fail(failMsg));

// ── Helpers ──────────────────────────────────────────────────────────────────
function decode(s: string): string {
  return s
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function escRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readOrNull(p: string): Promise<string | null> {
  try { return await readFile(p, "utf-8"); } catch { return null; }
}

function metaContents(scope: string, attr: "name" | "property", key: string): string[] {
  const out: string[] = [];
  for (const tag of scope.match(/<meta\b[^>]*>/g) ?? []) {
    if (new RegExp(`\\b${attr}\\s*=\\s*"${escRe(key)}"`).test(tag)) {
      const m = tag.match(/\bcontent\s*=\s*"([^"]*)"/);
      out.push(m ? decode(m[1]) : "");
    }
  }
  return out;
}

function expectMeta(scope: string, attr: "name" | "property", key: string, expected: string) {
  const vals = metaContents(scope, attr, key);
  if (vals.length !== 1) fail(`meta ${attr}="${key}": expected exactly 1, found ${vals.length}`);
  else if (vals[0] !== expected) fail(`meta ${attr}="${key}" mismatch:\n        got:      "${vals[0]}"\n        expected: "${expected}"`);
  else pass();
}

const shorten = (s: string, n = 70) => (s.length > n ? s.slice(0, n) + "…" : s);

// ── 1+2+3: built index.html (head, JSON-LD, prerendered body) ───────────────
const html = await readOrNull(resolve(distPub, "index.html"));
if (html === null) {
  fail("dist/public/index.html is missing — client build did not run");
} else {
  await checkHtml(html);
}

async function checkHtml(html: string) {
  const headEnd = html.indexOf("</head>");
  const head = html.slice(0, Math.max(headEnd, 0));
  const body = html.slice(Math.max(headEnd, 0));
  const headLinks = head.match(/<link\b[^>]*>/g) ?? [];

  // ── Head basics ──
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]));
  if (titles.length !== 1) fail(`<title>: expected exactly 1, found ${titles.length}`);
  else if (titles[0] !== cfg.title) fail(`<title> "${titles[0]}" ≠ config title "${cfg.title}"`);
  else pass();

  expectMeta(head, "name", "description", cfg.description);
  expectMeta(head, "name", "keywords", cfg.keywords);
  expectMeta(head, "name", "author", `${cfg.name} (${cfg.shortName})`);
  expectMeta(head, "name", "theme-color", cfg.colors.themeColor);

  const robotsMeta = metaContents(head, "name", "robots");
  if (robotsMeta.length !== 1) fail(`meta name="robots": expected exactly 1, found ${robotsMeta.length}`);
  else check(robotsMeta[0].includes("index") && robotsMeta[0].includes("follow"), `meta robots "${robotsMeta[0]}" does not allow index, follow`);

  // ── Open Graph / Twitter ──
  expectMeta(head, "property", "og:type", "website");
  expectMeta(head, "property", "og:site_name", cfg.name);
  expectMeta(head, "property", "og:title", cfg.title);
  expectMeta(head, "property", "og:description", cfg.description);
  expectMeta(head, "property", "og:url", cfg.url);
  expectMeta(head, "property", "og:image", cfg.ogImage);
  expectMeta(head, "name", "twitter:card", "summary_large_image");
  expectMeta(head, "name", "twitter:title", cfg.title);
  expectMeta(head, "name", "twitter:description", cfg.description);
  expectMeta(head, "name", "twitter:image", cfg.ogImage);

  const ogLocale = metaContents(head, "property", "og:locale");
  if (ogLocale.length !== 1) fail(`og:locale: expected exactly 1, found ${ogLocale.length}`);
  else check(ogLocale[0].startsWith(cfg.locales[0]), `og:locale "${ogLocale[0]}" does not match default locale "${cfg.locales[0]}"`);

  // ── Canonical + hreflang (static, from config) ──
  const canonicals = headLinks.filter((t) => /rel="canonical"/.test(t)).map((t) => t.match(/href="([^"]*)"/)?.[1] ?? "");
  if (canonicals.length !== 1) fail(`canonical: expected exactly 1, found ${canonicals.length}`);
  else if (canonicals[0] !== cfg.url) fail(`canonical "${canonicals[0]}" ≠ config url "${cfg.url}"`);
  else pass();

  const hreflangs: Record<string, string[]> = {};
  for (const t of headLinks) {
    if (/rel="alternate"/.test(t) && /hreflang="/.test(t)) {
      const lang = t.match(/hreflang="([^"]*)"/)?.[1] ?? "";
      const href = t.match(/href="([^"]*)"/)?.[1] ?? "";
      (hreflangs[lang] ??= []).push(href);
    }
  }
  // Only the default locale + x-default: no translated URLs exist yet, so
  // hreflang alternates for other locales must not be emitted (they would
  // point at an untranslated page — see meta-tokens.ts).
  const expectedLangs = [cfg.locales[0], "x-default"];
  for (const lang of expectedLangs) {
    const hrefs = hreflangs[lang] ?? [];
    if (hrefs.length !== 1) fail(`hreflang "${lang}": expected exactly 1 link, found ${hrefs.length}`);
    else if (hrefs[0] !== cfg.url) fail(`hreflang "${lang}" href "${hrefs[0]}" ≠ config url`);
    else pass();
  }
  const extraLangs = Object.keys(hreflangs).filter((l) => !expectedLangs.includes(l));
  check(extraLangs.length === 0, `unexpected hreflang entries: ${extraLangs.join(", ")}`);

  // ── JSON-LD ──
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  check(ldBlocks.length >= 6, `expected ≥ 6 JSON-LD blocks, found ${ldBlocks.length}`);

  const ldByType: Record<string, any[]> = {};
  ldBlocks.forEach((block, i) => {
    try {
      const obj = JSON.parse(block);
      (ldByType[String(obj["@type"])] ??= []).push(obj);
      pass();
    } catch (e: any) {
      fail(`JSON-LD block #${i + 1} is invalid JSON: ${e.message}`);
    }
  });

  for (const t of ["Organization", "ProfessionalService", "WebSite", "FAQPage", "BreadcrumbList", "SiteNavigationElement"]) {
    check(!!ldByType[t]?.length, `JSON-LD: missing required @type "${t}"`);
  }

  const org = ldByType["Organization"]?.[0];
  if (org) {
    check(org.name === cfg.name, `Organization.name "${org.name}" ≠ config name`);
    check(org.url === cfg.url, `Organization.url "${org.url}" ≠ config url`);
    check(org.foundingDate === cfg.foundingDate, `Organization.foundingDate "${org.foundingDate}" ≠ config foundingDate`);
    // Cross-check sameAs against content/companies.ts registry links +
    // content/team.ts LinkedIn URLs (composed in meta-tokens.ts).
    const sameAs: string[] = Array.isArray(org.sameAs) ? org.sameAs : [];
    check(
      sameAs.length === orgSameAs.length &&
        orgSameAs.every((u, i) => sameAs[i] === u),
      `Organization.sameAs stale: got [${sameAs.join(", ")}], expected registry links from content/companies.ts + LinkedIn URLs from content/team.ts [${orgSameAs.join(", ")}]`
    );
    // Cross-check founder + member against content/team.ts (single source of
    // truth): founder = first entry, member = the rest.
    const expectPerson = (label: string, p: any, m: any) => {
      check(p?.name === m.name, `${label}.name "${p?.name}" ≠ content/team.ts "${m.name}"`);
      check(p?.jobTitle === m.role, `${label} (${m.name}): jobTitle "${p?.jobTitle}" ≠ role "${m.role}"`);
      check(p?.description === m.bio, `${label} (${m.name}): description does not match content/team.ts bio (stale copy)`);
      if (m.linkedin) check(p?.url === m.linkedin, `${label} (${m.name}): url "${p?.url}" ≠ LinkedIn "${m.linkedin}"`);
    };
    expectPerson("Organization.founder", org.founder, teamMembers[0]);
    const members: any[] = Array.isArray(org.member) ? org.member : [];
    check(
      members.length === teamMembers.length - 1,
      `Organization.member: ${members.length} entries ≠ ${teamMembers.length - 1} non-founder members in content/team.ts`
    );
    teamMembers.slice(1).forEach((m: any, i: number) => expectPerson(`Organization.member[${i}]`, members[i], m));
  }
  const svc = ldByType["ProfessionalService"]?.[0];
  if (svc) {
    check(svc.name === cfg.name, `ProfessionalService.name ≠ config name`);
    check(svc.email === cfg.email, `ProfessionalService.email "${svc.email}" ≠ config email`);
    check(svc.url === cfg.url, `ProfessionalService.url ≠ config url`);
    const a = svc.address ?? {};
    check(
      a.streetAddress === cfg.address.street && a.postalCode === cfg.address.postalCode &&
      a.addressLocality === cfg.address.city && a.addressCountry === cfg.address.countryCode,
      `ProfessionalService.address inconsistent with config address (${JSON.stringify(a)})`
    );
  }
  const web = ldByType["WebSite"]?.[0];
  if (web) {
    check(web.name === cfg.name, `WebSite.name ≠ config name`);
    check(web.url === cfg.url, `WebSite.url ≠ config url`);
  }
  const faq = ldByType["FAQPage"]?.[0];
  if (faq) {
    const qs: any[] = Array.isArray(faq.mainEntity) ? faq.mainEntity : [];
    check(qs.length >= 3, `FAQPage: expected ≥ 3 questions, found ${qs.length}`);
    const broken = qs.filter((q) => !q?.name || !q?.acceptedAnswer?.text);
    check(broken.length === 0, `FAQPage: ${broken.length} question(s) missing name or acceptedAnswer.text`);
    // Cross-check against content/faq.ts (single source of truth).
    check(qs.length === resolvedFaq.length, `FAQPage: ${qs.length} question(s) ≠ ${resolvedFaq.length} in content/faq.ts`);
    resolvedFaq.forEach((f, i) => {
      const q = qs[i];
      check(q?.name === f.question, `FAQPage question #${i + 1} "${shorten(String(q?.name ?? ""))}" ≠ content/faq.ts question "${shorten(f.question)}"`);
      check(q?.acceptedAnswer?.text === f.answer, `FAQPage answer #${i + 1} does not match content/faq.ts (stale FAQ copy)`);
    });
  }
  let anchorIds: string[] = ["hero"];
  const bc = ldByType["BreadcrumbList"]?.[0];
  if (bc) {
    const items: any[] = Array.isArray(bc.itemListElement) ? bc.itemListElement : [];
    check(items.length >= 2 && items[0]?.item === cfg.url, `BreadcrumbList first item ≠ config url`);
    anchorIds.push(...items.slice(1).map((it) => String(it?.item ?? "")).filter((u) => u.includes("#")).map((u) => u.split("#")[1]));
  }
  const nav = ldByType["SiteNavigationElement"]?.[0];
  if (nav) {
    const parts: any[] = Array.isArray(nav.hasPart) ? nav.hasPart : [];
    check(parts.length >= 3, `SiteNavigationElement: expected ≥ 3 entries, found ${parts.length}`);
    const bad = parts.filter((p) => !String(p?.url ?? "").startsWith(cfg.url));
    check(bad.length === 0, `SiteNavigationElement: ${bad.length} url(s) not on the canonical origin`);
  }

  // Every own-domain URL in JSON-LD must use the canonical origin (protocol + host).
  ldBlocks.forEach((block, i) => {
    try {
      const bad: string[] = [];
      (function walkObj(v: any) {
        if (typeof v === "string") {
          if (v.startsWith("http") && v.includes(cfg.domain) && !v.startsWith(cfg.url)) bad.push(v);
        } else if (Array.isArray(v)) v.forEach(walkObj);
        else if (v && typeof v === "object") Object.values(v).forEach(walkObj);
      })(JSON.parse(block));
      check(bad.length === 0, `JSON-LD block #${i + 1}: own-domain URLs not on canonical origin: ${bad.slice(0, 3).join(", ")}`);
    } catch { /* parse failure already reported */ }
  });

  // ── Prerendered body completeness (what non-JS crawlers see) ──
  check(!html.includes("<!--ssr-outlet-->"), "prerender: <!--ssr-outlet--> marker still present — static HTML was not injected");
  check(!/<div id="root">\s*<\/div>/.test(html), "prerender: #root is empty — homepage was not prerendered");

  // renderToString inserts <!-- --> separators between adjacent text nodes
  // (e.g. `v{version}` → `v<!-- -->1.0.0`); strip comments so needles that
  // span expression boundaries still match. The <!--ssr-outlet--> absence
  // check above runs on the raw HTML, before this normalization.
  const bodyDecoded = decode(body.replace(/<!--[\s\S]*?-->/g, ""));
  const needContent = (what: string, needle: string) => {
    if (!needle) return;
    check(bodyDecoded.includes(needle), `prerendered HTML missing ${what}: "${shorten(needle)}"`);
  };

  needContent("site name", cfg.name);
  needContent("contact email", cfg.email);
  needContent("locations", cfg.locations);
  for (const s of services) {
    needContent("service title", s.title);
    needContent(`service description (${s.title})`, s.description.slice(0, 80));
  }
  for (const m of teamMembers) {
    needContent("team member name", m.name);
    needContent(`team member role (${m.name})`, m.role);
    needContent(`team member bio (${m.name})`, m.bio.slice(0, 80));
  }
  for (const p of painPoints) needContent("pain point lead", p.lead);
  for (const e of engagements) {
    needContent("engagement title", e.title);
    needContent(`engagement outcome (${e.title})`, e.outcome);
    needContent(`engagement description (${e.title})`, e.description.slice(0, 80));
  }
  for (const s of stats) needContent("stat label", s.label);
  for (const t of timelineTitles) needContent("timeline title", t);
  for (const y of timelineYears) needContent("timeline year", y);
  needContent("testimonial quote", testimonial.quote.slice(0, 80));
  needContent("testimonial author", testimonial.author);
  // Google requires FAQPage content to be visible on the page — every
  // question and answer from content/faq.ts must be in the prerendered HTML.
  for (const f of resolvedFaq) {
    needContent("FAQ question", f.question);
    needContent(`FAQ answer (${shorten(f.question, 40)})`, f.answer.slice(0, 80));
  }

  const h1s = body.match(/<h1[\s>]/g) ?? [];
  check(h1s.length === 1, `expected exactly one <h1> in the page, found ${h1s.length}`);
  for (const id of [...new Set(anchorIds)]) {
    check(body.includes(`id="${id}"`), `missing section anchor id="${id}" (referenced by structured data)`);
  }
  check(body.includes("<main"), "missing <main> landmark in prerendered HTML");
  check(body.includes("<footer"), "missing <footer> landmark in prerendered HTML");
  check(body.includes("<form"), "missing contact <form> in prerendered HTML");
  check(body.includes("<nav"), "missing <nav> landmark in prerendered HTML");
  check(body.includes('data-testid="text-footer-version"'), "missing footer version line in prerendered HTML");
  check(bodyDecoded.includes(`v${pkg.version}`), `footer version line does not show v${pkg.version}`);

  const visible = body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  check(
    visible.length >= 3000,
    `prerendered visible text is only ${visible.length} chars — the full homepage should be ≥ 3000 (prerender incomplete)`
  );

  // ── og:image + icon/preload assets exist on disk ──
  let ogPathname = "";
  try { ogPathname = new URL(cfg.ogImage).pathname; } catch { fail(`config ogImage "${cfg.ogImage}" is not an absolute URL`); }
  if (ogPathname) {
    const buf = await readFile(join(distPub, ogPathname)).catch(() => null);
    if (!buf) fail(`og:image file missing from build output: dist/public${ogPathname}`);
    else {
      check(buf.length > 1024, `og:image file is suspiciously small (${buf.length} bytes)`);
      if (ogPathname.endsWith(".png") && buf.length > 24 && buf.readUInt32BE(12) === 0x49484452) {
        const w = buf.readUInt32BE(16);
        const h = buf.readUInt32BE(20);
        const wClaim = Number(metaContents(head, "property", "og:image:width")[0] ?? 0);
        const hClaim = Number(metaContents(head, "property", "og:image:height")[0] ?? 0);
        check(
          !(wClaim && hClaim) || (w === wClaim && h === hClaim),
          `og-image is ${w}×${h} but og:image:width/height claims ${wClaim}×${hClaim} — the PNG is regenerated every build, so the declared meta values are wrong: fix og:image:width/height in the template (or the WIDTH/HEIGHT constants in script/generate-og-image.ts) to match`
        );
      }
    }
  }
  for (const t of headLinks) {
    const rel = t.match(/rel="([^"]*)"/)?.[1] ?? "";
    const href = t.match(/href="([^"]*)"/)?.[1] ?? "";
    const as = t.match(/\bas="([^"]*)"/)?.[1] ?? "";
    if ((rel.includes("icon") || (rel === "preload" && as === "image")) && href.startsWith("/")) {
      const ok = await readFile(join(distPub, href)).then(() => true).catch(() => false);
      check(ok, `head references an asset missing from build output: ${href}`);
    }
  }
}

// ── 3b: /design — crawlable design-system page (own shell, static noindex) ──
const designHtml = await readOrNull(resolve(distPub, "design/index.html"));
if (designHtml === null) {
  fail("dist/public/design/index.html is missing — the /design prerender did not run (check rollupOptions.input + prerender() in script/build.ts)");
} else {
  await checkDesignHtml(designHtml);
}

async function checkDesignHtml(dHtml: string) {
  const headEnd = dHtml.indexOf("</head>");
  const head = dHtml.slice(0, Math.max(headEnd, 0));
  const body = dHtml.slice(Math.max(headEnd, 0));
  const headLinks = head.match(/<link\b[^>]*>/g) ?? [];

  // ── Dedicated head ──
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]));
  const expectedTitle = `Design System — ${cfg.name}`;
  if (titles.length !== 1) fail(`/design <title>: expected exactly 1, found ${titles.length}`);
  else if (titles[0] !== expectedTitle) fail(`/design <title> "${titles[0]}" ≠ "${expectedTitle}" (must match the client-side document.title in pages/components.tsx)`);
  else pass();

  const descs = metaContents(head, "name", "description");
  if (descs.length !== 1) fail(`/design meta description: expected exactly 1, found ${descs.length}`);
  else {
    check(descs[0].length >= 50, `/design meta description suspiciously short: "${descs[0]}"`);
    check(descs[0] !== cfg.description, "/design meta description must be dedicated, not a copy of the homepage description");
  }

  const robotsMeta = metaContents(head, "name", "robots");
  if (robotsMeta.length !== 1) fail(`/design meta name="robots": expected exactly 1 static tag, found ${robotsMeta.length}`);
  else check(robotsMeta[0].includes("noindex"), `/design meta robots "${robotsMeta[0]}" must contain "noindex" — the page is crawlable but stays out of the index`);

  const canonicals = headLinks.filter((t) => /rel="canonical"/.test(t)).map((t) => t.match(/href="([^"]*)"/)?.[1] ?? "");
  if (canonicals.length !== 1) fail(`/design canonical: expected exactly 1, found ${canonicals.length}`);
  else if (canonicals[0] !== `${cfg.url}design`) fail(`/design canonical "${canonicals[0]}" ≠ "${cfg.url}design"`);
  else pass();

  // The homepage's JSON-LD (FAQPage & friends) must not be duplicated here —
  // the /design shell carries no structured data at all.
  check(!/application\/ld\+json/.test(dHtml), "/design must not embed JSON-LD blocks — FAQPage etc. are homepage-specific");

  // ── Prerender completeness (what non-JS crawlers see) ──
  check(!dHtml.includes("<!--ssr-outlet-->"), "/design prerender: <!--ssr-outlet--> marker still present — static HTML was not injected");
  check(!/<div id="root">\s*<\/div>/.test(dHtml), "/design prerender: #root is empty — page was not prerendered");

  const bodyDecoded = decode(body.replace(/<!--[\s\S]*?-->/g, ""));

  // Section registry derives from side-nav.tsx (the page's single source of
  // structure) — every registered section must exist in the static HTML.
  const sideNavSrc = await readFile(resolve(root, "client/src/sections/design/side-nav.tsx"), "utf-8");
  const sectionIds = [...sideNavSrc.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
  check(sectionIds.length >= 8, `side-nav.tsx: expected ≥ 8 sections in navSections, found ${sectionIds.length}`);
  for (const id of sectionIds) {
    check(body.includes(`id="${id}"`), `/design prerender missing section id="${id}" (registered in side-nav.tsx)`);
  }

  // Real token values must be visible without JS — no empty fields.
  for (const [name, text] of Object.entries(designTokenTexts)) {
    check(bodyDecoded.includes(text), `/design prerender missing token value ${name} = "${text}" — token texts must resolve statically from design-tokens.ts`);
  }
  for (const font of [cfg.fonts.body, cfg.fonts.mono]) {
    check(bodyDecoded.includes(font), `/design prerender missing font name "${font}" (typography section incomplete)`);
  }

  const h1s = body.match(/<h1[\s>]/g) ?? [];
  check(h1s.length === 1, `/design: expected exactly one <h1>, found ${h1s.length}`);
  check(body.includes("<main"), "/design: missing <main> landmark in prerendered HTML");
  check(body.includes("<nav"), "/design: missing <nav> landmark in prerendered HTML");
  check(body.includes("<footer"), "/design: missing <footer> landmark in prerendered HTML");

  const visible = body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  check(
    visible.length >= 3000,
    `/design prerendered visible text is only ${visible.length} chars — the full page should be ≥ 3000 (prerender incomplete)`
  );

  // Head-referenced assets must exist in the build output.
  for (const t of headLinks) {
    const rel = t.match(/rel="([^"]*)"/)?.[1] ?? "";
    const href = t.match(/href="([^"]*)"/)?.[1] ?? "";
    const as = t.match(/\bas="([^"]*)"/)?.[1] ?? "";
    if ((rel.includes("icon") || (rel === "preload" && as === "image")) && href.startsWith("/")) {
      const ok = await readFile(join(distPub, href)).then(() => true).catch(() => false);
      check(ok, `/design head references an asset missing from build output: ${href}`);
    }
  }
}


// ── 3b′: /why — public, indexable conversion page (own shell + prerender) ───
const whyHtml = await readOrNull(resolve(distPub, "why/index.html"));
if (whyHtml === null) {
  fail("dist/public/why/index.html is missing — the /why prerender did not run (check rollupOptions.input + prerender() in script/build.ts)");
} else {
  await checkWhyHtml(whyHtml);
}

async function checkWhyHtml(wHtml: string) {
  const headEnd = wHtml.indexOf("</head>");
  const head = wHtml.slice(0, Math.max(headEnd, 0));
  const body = wHtml.slice(Math.max(headEnd, 0));
  const headLinks = head.match(/<link\b[^>]*>/g) ?? [];
  const whyUrl = `${cfg.url}why`;

  // ── Dedicated, indexable head (values from content/why.ts) ──
  const titles = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]));
  if (titles.length !== 1) fail(`/why <title>: expected exactly 1, found ${titles.length}`);
  else if (titles[0] !== whyContent.seo.title) fail(`/why <title> "${titles[0]}" ≠ content/why.ts seo.title "${whyContent.seo.title}" (must also match the client-side document.title in pages/why.tsx)`);
  else pass();
  check(whyContent.seo.title !== cfg.title, "/why seo.title must differ from the homepage title (duplicate <title>)");

  const descs = metaContents(head, "name", "description");
  if (descs.length !== 1) fail(`/why meta description: expected exactly 1, found ${descs.length}`);
  else {
    check(descs[0] === whyContent.seo.description, `/why meta description ≠ content/why.ts seo.description`);
    check(descs[0] !== cfg.description, "/why meta description must be dedicated, not a copy of the homepage description");
  }

  const robotsMeta = metaContents(head, "name", "robots");
  if (robotsMeta.length !== 1) fail(`/why meta name="robots": expected exactly 1, found ${robotsMeta.length}`);
  else {
    // Parse directives — substring checks would let "nofollow" pass ("follow"
    // is a substring of it) and vice versa.
    const directives = robotsMeta[0].split(",").map((d) => d.trim().toLowerCase());
    check(directives.includes("index") && directives.includes("follow") && !directives.includes("noindex") && !directives.includes("nofollow"), `/why meta robots "${robotsMeta[0]}" must allow index, follow — this page is public and indexable`);
  }

  const canonicals = headLinks.filter((t) => /rel="canonical"/.test(t)).map((t) => t.match(/href="([^"]*)"/)?.[1] ?? "");
  if (canonicals.length !== 1) fail(`/why canonical: expected exactly 1, found ${canonicals.length}`);
  else if (canonicals[0] !== whyUrl) fail(`/why canonical "${canonicals[0]}" ≠ "${whyUrl}"`);
  else pass();

  const hreflangs: Record<string, string[]> = {};
  for (const t of headLinks) {
    if (/rel="alternate"/.test(t) && /hreflang="/.test(t)) {
      const lang = t.match(/hreflang="([^"]*)"/)?.[1] ?? "";
      const href = t.match(/href="([^"]*)"/)?.[1] ?? "";
      (hreflangs[lang] ??= []).push(href);
    }
  }
  for (const lang of [cfg.locales[0], "x-default"]) {
    const hrefs = hreflangs[lang] ?? [];
    if (hrefs.length !== 1) fail(`/why hreflang "${lang}": expected exactly 1 link, found ${hrefs.length}`);
    else if (hrefs[0] !== whyUrl) fail(`/why hreflang "${lang}" href "${hrefs[0]}" ≠ "${whyUrl}"`);
    else pass();
  }
  const extraWhyLangs = Object.keys(hreflangs).filter((l) => ![cfg.locales[0], "x-default"].includes(l));
  check(extraWhyLangs.length === 0, `/why: unexpected hreflang entries: ${extraWhyLangs.join(", ")}`);

  expectMeta(head, "property", "og:type", "website");
  expectMeta(head, "property", "og:site_name", cfg.name);
  expectMeta(head, "property", "og:title", whyContent.seo.title);
  expectMeta(head, "property", "og:description", whyContent.seo.description);
  expectMeta(head, "property", "og:url", whyUrl);
  expectMeta(head, "property", "og:image", cfg.ogImage);
  expectMeta(head, "name", "twitter:card", "summary_large_image");
  expectMeta(head, "name", "twitter:title", whyContent.seo.title);
  expectMeta(head, "name", "twitter:description", whyContent.seo.description);
  expectMeta(head, "name", "twitter:image", cfg.ogImage);

  // ── JSON-LD: WebPage + BreadcrumbList ONLY (homepage graph not duplicated) ──
  const ldBlocks = [...wHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const topTypes: string[] = [];
  ldBlocks.forEach((block, i) => {
    try { topTypes.push(String(JSON.parse(block)["@type"])); pass(); }
    catch (e: any) { fail(`/why JSON-LD block #${i + 1} is invalid JSON: ${e.message}`); }
  });
  check(topTypes.filter((t) => t === "WebPage").length === 1, `/why JSON-LD: expected exactly one WebPage block, found ${topTypes.filter((t) => t === "WebPage").length}`);
  check(topTypes.filter((t) => t === "BreadcrumbList").length === 1, `/why JSON-LD: expected exactly one BreadcrumbList block, found ${topTypes.filter((t) => t === "BreadcrumbList").length}`);
  const extraTypes = topTypes.filter((t) => !["WebPage", "BreadcrumbList"].includes(t));
  check(extraTypes.length === 0, `/why JSON-LD: unexpected top-level @type(s): ${extraTypes.join(", ")} — FAQPage/Organization & friends live on the homepage only`);

  for (const block of ldBlocks) {
    let obj: any;
    try { obj = JSON.parse(block); } catch { continue; }
    if (obj["@type"] === "WebPage") {
      check(obj.url === whyUrl, `/why WebPage.url "${obj.url}" ≠ "${whyUrl}"`);
      check(obj.name === whyContent.seo.title, "/why WebPage.name ≠ content/why.ts seo.title");
      check(obj.isPartOf?.url === cfg.url, "/why WebPage.isPartOf.url ≠ config url");
    }
    if (obj["@type"] === "BreadcrumbList") {
      const items: any[] = Array.isArray(obj.itemListElement) ? obj.itemListElement : [];
      check(items.length === 2, `/why BreadcrumbList: expected 2 items, found ${items.length}`);
      check(items[0]?.item === cfg.url, "/why BreadcrumbList first item ≠ config url");
      check(items[1]?.item === whyUrl && items[1]?.name === whyContent.seo.breadcrumbLabel, `/why BreadcrumbList second item must be "${whyContent.seo.breadcrumbLabel}" → ${whyUrl}`);
    }
    const bad: string[] = [];
    (function walkObj(v: any) {
      if (typeof v === "string") {
        if (v.startsWith("http") && v.includes(cfg.domain) && !v.startsWith(cfg.url)) bad.push(v);
      } else if (Array.isArray(v)) v.forEach(walkObj);
      else if (v && typeof v === "object") Object.values(v).forEach(walkObj);
    })(obj);
    check(bad.length === 0, `/why JSON-LD: own-domain URLs not on canonical origin: ${bad.slice(0, 3).join(", ")}`);
  }

  // ── Prerender completeness (what non-JS crawlers see) ──
  check(!wHtml.includes("<!--ssr-outlet-->"), "/why prerender: <!--ssr-outlet--> marker still present — static HTML was not injected");
  check(!/<div id="root">\s*<\/div>/.test(wHtml), "/why prerender: #root is empty — page was not prerendered");

  const bodyDecoded = decode(body.replace(/<!--[\s\S]*?-->/g, ""));
  const needWhy = (what: string, needle: string) => {
    if (!needle) return;
    check(bodyDecoded.includes(needle), `/why prerendered HTML missing ${what}: "${shorten(needle)}"`);
  };

  needWhy("site name", cfg.name);
  needWhy("contact email", cfg.email);
  needWhy("locations", cfg.locations);
  needWhy("hero heading", whyContent.hero.heading);
  needWhy("hero description", whyContent.hero.description.slice(0, 80));
  needWhy("hero kicker", whyContent.hero.kicker);
  needWhy("volume line", whyContent.hero.volumeLine);
  needWhy("console title", whyContent.console.title);
  needWhy("console uptime label", whyContent.console.uptimeLabel);
  for (const line of whyContent.console.terminalLines) needWhy("console terminal line", line);
  for (const g of whyContent.console.gauges) {
    needWhy("console gauge label", g.label);
    needWhy("console gauge value", g.value);
  }
  needWhy("problem heading", whyContent.problem.heading);
  needWhy("problem why-alone lead", whyContent.problem.whyAloneLead);
  needWhy("problem why-alone text", whyContent.problem.whyAloneText.slice(0, 80));
  needWhy("how heading", whyContent.how.heading);
  for (const s of whyContent.how.steps) {
    needWhy("how step title", s.title);
    needWhy(`how step text (${s.title})`, s.text.slice(0, 80));
  }
  needWhy("model heading", whyContent.model.heading);
  for (const b of whyContent.model.benefits) {
    needWhy("model benefit title", b.title);
    needWhy(`model benefit text (${b.title})`, b.text.slice(0, 80));
  }
  needWhy("track heading", whyContent.track.heading);
  needWhy("final CTA heading", whyContent.finalCta.heading);
  needWhy("final CTA description", whyContent.finalCta.description.slice(0, 80));
  needWhy("appendix heading", whyContent.appendix.heading);
  needWhy("email-capture title", whyContent.appendix.capture.title);
  needWhy("email-capture subtitle", whyContent.appendix.capture.subtitle);
  for (const s of stats) {
    needWhy("stat label", s.label);
    needWhy(`stat sub (${shorten(s.label, 30)})`, s.sub);
  }
  for (const p of painPoints) {
    needWhy("pain point lead", p.lead);
    needWhy(`pain point rest (${shorten(p.lead, 30)})`, p.rest.slice(0, 80));
  }
  for (const e of engagements) {
    needWhy("engagement title", e.title);
    needWhy(`engagement outcome (${e.title})`, e.outcome);
    needWhy(`engagement description (${e.title})`, e.description.slice(0, 80));
  }
  needWhy("testimonial quote", testimonial.quote.slice(0, 80));
  needWhy("testimonial author", testimonial.author);
  // FAQ subset: whyContent.appendix.faqIndexes selects entries from
  // content/faq.ts — both question and answer must be visible without JS
  // (native <details> keeps closed answers in the DOM).
  const selectedWhyFaq = (whyContent.appendix.faqIndexes as readonly number[])
    .map((i: number) => resolvedFaq[i])
    .filter(Boolean);
  check(selectedWhyFaq.length >= 3, `/why FAQ selection: expected ≥ 3 valid faqIndexes into content/faq.ts, found ${selectedWhyFaq.length}`);
  for (const f of selectedWhyFaq) {
    needWhy("FAQ question", f.question);
    needWhy(`FAQ answer (${shorten(f.question, 40)})`, f.answer.slice(0, 80));
  }

  const h1s = body.match(/<h1[\s>]/g) ?? [];
  check(h1s.length === 1, `/why: expected exactly one <h1>, found ${h1s.length}`);
  check(body.includes("<main"), "/why: missing <main> landmark in prerendered HTML");
  check(body.includes("<nav"), "/why: missing <nav> landmark in prerendered HTML");
  check(body.includes("<footer"), "/why: missing <footer> landmark in prerendered HTML");

  const visible = body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  check(visible.length >= 3000, `/why prerendered visible text is only ${visible.length} chars — the full page should be ≥ 3000 (prerender incomplete)`);

  for (const t of headLinks) {
    const rel = t.match(/rel="([^"]*)"/)?.[1] ?? "";
    const href = t.match(/href="([^"]*)"/)?.[1] ?? "";
    const as = t.match(/\bas="([^"]*)"/)?.[1] ?? "";
    if ((rel.includes("icon") || (rel === "preload" && as === "image")) && href.startsWith("/")) {
      const ok = await readFile(join(distPub, href)).then(() => true).catch(() => false);
      check(ok, `/why head references an asset missing from build output: ${href}`);
    }
  }
}


// ── 3c: code splitting — homepage JS must not embark the design page ────────
// "badge-design-system" is a design-page-only testid literal (overview.tsx)
// that survives minification. The design graph must contain it (sanity: if
// the marker is ever renamed, this fails loudly instead of the homepage
// check silently passing) and the homepage graph must not.
const DESIGN_JS_MARKER = "badge-design-system";
// "why-page-root" is the /why page-root testid literal (pages/why.tsx).
const WHY_JS_MARKER = "why-page-root";
function moduleGraph(pageHtml: string): string[] {
  return [
    ...[...pageHtml.matchAll(/<script type="module"[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]),
    ...[...pageHtml.matchAll(/<link rel="modulepreload"[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]),
  ].filter((p) => p.startsWith("/"));
}
if (html !== null) {
  const scripts = moduleGraph(html);
  check(scripts.length > 0, "homepage: no module scripts found in dist/public/index.html");
  for (const src of scripts) {
    const js = await readOrNull(join(distPub, src));
    if (js === null) fail(`homepage references a JS file missing from build output: ${src}`);
    else {
      check(!js.includes(DESIGN_JS_MARKER), `homepage JS graph embarks the /design page code (${src}) — the design chunk must stay out of the homepage bundle`);
      check(!js.includes(WHY_JS_MARKER), `homepage JS graph embarks the /why page code (${src}) — the why chunk must stay out of the homepage bundle`);
    }
  }
}
if (designHtml !== null) {
  let markerFound = false;
  for (const src of moduleGraph(designHtml)) {
    const js = await readOrNull(join(distPub, src));
    if (js !== null && js.includes(DESIGN_JS_MARKER)) markerFound = true;
  }
  check(markerFound, `/design JS graph does not contain its own page code (marker "${DESIGN_JS_MARKER}") — entry wiring broken, or the marker was renamed in overview.tsx`);
}
if (whyHtml !== null) {
  let whyMarkerFound = false;
  for (const src of moduleGraph(whyHtml)) {
    const js = await readOrNull(join(distPub, src));
    if (js !== null && js.includes(WHY_JS_MARKER)) whyMarkerFound = true;
  }
  check(whyMarkerFound, `/why JS graph does not contain its own page code (marker "${WHY_JS_MARKER}") — entry wiring broken, or the testid was renamed in pages/why.tsx`);
}

// ── 4: generated metadata files ──────────────────────────────────────────────
const robots = await readOrNull(resolve(distPub, "robots.txt"));
if (robots === null) fail("dist/public/robots.txt is missing");
else {
  check(robots.includes(`Sitemap: ${cfg.url}sitemap.xml`), `robots.txt Sitemap line ≠ "Sitemap: ${cfg.url}sitemap.xml"`);
  // /design is deliberately crawlable (static noindex keeps it out of the
  // index) — a Disallow would hide the design system from AI crawlers again.
  check(!robots.includes("Disallow: /design"), "robots.txt must NOT contain Disallow: /design — the design system page is crawlable (noindex-only policy)");
  check(!robots.includes("Disallow: /why"), "robots.txt must NOT contain Disallow: /why — /why is public and indexable");
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot"]) {
    check(new RegExp(`User-agent: ${bot}\\s*\\nAllow: /`).test(robots), `robots.txt: AI crawler ${bot} not explicitly allowed`);
  }
}

const sitemap = await readOrNull(resolve(distPub, "sitemap.xml"));
if (sitemap === null) fail("dist/public/sitemap.xml is missing");
else {
  check(sitemap.includes(`<loc>${cfg.url}</loc>`), `sitemap.xml <loc> ≠ config url`);
  check(sitemap.includes(`<loc>${cfg.url}why</loc>`), `sitemap.xml missing <loc>${cfg.url}why</loc> — the indexable /why page must be listed`);
  const lm = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/);
  if (!lm) fail("sitemap.xml: <lastmod> missing or not YYYY-MM-DD");
  else {
    const age = Math.abs(Date.now() - new Date(`${lm[1]}T00:00:00Z`).getTime());
    check(age < 48 * 3600 * 1000, `sitemap.xml <lastmod> "${lm[1]}" is not the build date — auto-stamping broken`);
  }
  check(!sitemap.includes("/design"), "sitemap.xml must not list /design — a noindex page does not belong in a sitemap");
}

// Cross-check the AI-crawler files against the content/ collections so they
// can never silently go stale when content/ is edited.
function checkLlmsContent(label: string, text: string) {
  const need = (what: string, needle: string) => {
    if (!needle) return;
    check(text.includes(needle), `${label} missing ${what}: "${shorten(needle)}"`);
  };
  for (const s of services) {
    need("service title", s.title);
    need(`service description (${s.title})`, s.description.slice(0, 80));
  }
  for (const m of teamMembers) {
    need("team member name", m.name);
    need(`team member bio (${m.name})`, m.bio.slice(0, 80));
    if (m.linkedin) need(`team member LinkedIn (${m.name})`, m.linkedin);
  }
  for (const s of stats) need("stat label", s.label);
  for (const e of engagements) {
    need("engagement title", e.title);
    need(`engagement description (${e.title})`, e.description.slice(0, 80));
  }
  for (const t of timelineEntries) {
    need(`history year (${t.year})`, t.year);
    need(`history summary (${t.year})`, t.summary.slice(0, 80));
  }
  for (const f of resolvedFaq) {
    need("FAQ question", f.question);
    need(`FAQ answer (${shorten(f.question, 40)})`, f.answer.slice(0, 80));
  }
  // Legal identifiers + registry links derive from content/companies.ts.
  for (const c of companies) {
    need(`company SIREN (${c.name})`, c.siren);
    for (const l of c.links) need(`registry link (${c.name} — ${l.label})`, l.href);
  }
}

const llms = await readOrNull(resolve(distPub, "llms.txt"));
if (llms === null) fail("dist/public/llms.txt is missing");
else {
  check(llms.includes(cfg.name), "llms.txt does not mention the site name");
  check(llms.includes(cfg.email), "llms.txt does not contain the contact email");
  // Coherence with the /design crawl policy: the design system must be
  // referenced as a fully consultable resource, not flagged as restricted.
  check(llms.includes("](/design)"), "llms.txt: missing the /design design-system link");
  check(llms.includes("](/why)"), "llms.txt: missing the /why page link");
  check(!llms.toLowerCase().includes("noindex"), "llms.txt must not describe /design as noindex/restricted — it is fully crawlable static HTML");
  checkLlmsContent("llms.txt", llms);
}

const llmsFull = await readOrNull(resolve(distPub, "llms-full.txt"));
if (llmsFull === null) fail("dist/public/llms-full.txt is missing");
else {
  check(llmsFull.includes(cfg.name), "llms-full.txt does not mention the site name");
  check(llmsFull.includes(cfg.domain), "llms-full.txt does not mention the domain");
  checkLlmsContent("llms-full.txt", llmsFull);
  check(llmsFull.includes(testimonial.quote), "llms-full.txt missing the testimonial quote");
}

const cname = await readOrNull(resolve(root, "CNAME"));
if (cname === null) fail("CNAME is missing at the repo root");
else check(cname.trim() === cfg.domain, `CNAME "${cname.trim()}" ≠ config domain "${cfg.domain}"`);

for (const [label, content] of [
  ["dist/public/index.html", html],
  ["dist/public/design/index.html", designHtml],
  ["dist/public/why/index.html", whyHtml],
  ["dist/public/robots.txt", robots],
  ["dist/public/sitemap.xml", sitemap],
  ["dist/public/llms.txt", llms],
  ["dist/public/llms-full.txt", llmsFull],
  ["CNAME", cname],
] as const) {
  if (content == null) continue;
  const leftovers = content.match(/\{\{[A-Z_]+\}\}/g);
  check(!leftovers, `${label}: unresolved template tokens: ${[...new Set(leftovers ?? [])].join(", ")}`);
}

// ── 5: template-safety scan (brand strings outside content/) ────────────────
// Build inputs must not hardcode brand/domain values — they belong in
// content/. Generated outputs (client/index.html, robots.txt, sitemap.xml,
// llms*.txt, CNAME) are regenerated every build and therefore exempt, as are
// content/ itself, docs (*.md), attached_assets/ and .github/ (workflow
// plumbing, never page content). script/*.sh is deploy plumbing (repo slug ≠
// brand string) and is reviewed via the duplication checklist instead.
async function walk(dir: string, exts: string[], out: string[] = []): Promise<string[]> {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (["node_modules", "dist", ".git"].includes(e.name)) continue;
      await walk(p, exts, out);
    } else if (exts.some((x) => e.name.endsWith(x))) {
      out.push(p);
    }
  }
  return out;
}

const scanFiles = [
  ...(await walk(resolve(root, "client/src"), [".ts", ".tsx", ".css", ".html"])),
  ...(await walk(resolve(root, "server"), [".ts"])),
  ...(await walk(resolve(root, "shared"), [".ts"])),
  ...(await walk(resolve(root, "script"), [".ts"])),
  resolve(root, "client/index.html.template"),
  resolve(root, "client/design/index.html.template"),
  resolve(root, "client/why/index.html.template"),
  resolve(root, "design-tokens.ts"),
  resolve(root, "client/public/robots.txt.template"),
  resolve(root, "client/public/sitemap.xml.template"),
  resolve(root, "client/public/llms.txt.template"),
  resolve(root, "client/public/llms-full.txt.template"),
  resolve(root, "client/public/404.html"),
  resolve(root, "CNAME.template"),
  resolve(root, "vite.config.ts"),
  resolve(root, "tailwind.config.ts"),
  resolve(root, "postcss.config.js"),
  resolve(root, "drizzle.config.ts"),
  resolve(root, "components.json"),
];

const needles = [
  { label: "site name", value: cfg.name, ci: true },
  { label: "short name", value: cfg.shortName, ci: true },
  { label: "domain", value: cfg.domain, ci: true },
  { label: "email", value: cfg.email, ci: true },
  { label: "street address", value: cfg.address.street, ci: true },
].filter((n) => {
  if ((n.value ?? "").length < 4) {
    warn(`template-safety scan: skipping needle "${n.label}" — value "${n.value}" is too short to scan reliably`);
    return false;
  }
  return true;
});

// Additional needles applied to client/src AND the narrative template files
// (client/index.html.template, llms*.txt.template). People and registry
// numbers now reach those templates only through derived {{TOKENS}}
// (FOUNDER_NAME, TEAM_NAMES, COMPANY_n_SIREN, LLMS_LEGAL_IDS,
// LLMS_EXTERNAL_REFS…), so any literal occurrence is a duplication leak —
// exactly how the /design page leaked the previous brand after duplication.
//
// Personal names derived from content/ (team members, testimonial author):
const clientSrcNeedles: { label: string; value: string; ci: boolean }[] = [];
const personalNames = new Set<string>(
  [...teamMembers.map((m: any) => String(m.name ?? "")), String(testimonial.author ?? "")]
    .filter((v) => v.length >= 4)
);
const surnames = new Set<string>();
for (const name of personalNames) {
  clientSrcNeedles.push({ label: "personal name", value: name, ci: true });
  // Surnames alone are distinctive enough to flag (e.g. a surname left in a
  // caption). First names are too generic to scan safely.
  const surname = name.split(/\s+/).at(-1) ?? "";
  if (surname.length >= 4 && surname.toLowerCase() !== name.toLowerCase()) {
    surnames.add(surname);
  }
}
for (const surname of surnames) {
  clientSrcNeedles.push({ label: "personal surname", value: surname, ci: true });
}

// Spaced / dotted renderings of the brand acronym (letters separated by
// spaces or periods) — these evade the plain short-name needle.
if ((cfg.shortName ?? "").replace(/[^A-Za-z]/g, "").length >= 3) {
  const letters = cfg.shortName.replace(/[^A-Za-z]/g, "").toUpperCase().split("");
  clientSrcNeedles.push({ label: "spaced short name", value: letters.join(" "), ci: true });
  clientSrcNeedles.push({ label: "dotted short name", value: letters.join("."), ci: true });
}

// Company names and SIREN numbers derived from content/companies.ts —
// both the spaced registry form ("481 631 471") and the bare 9-digit form
// used in registry URLs ("481631471").
for (const c of companies) {
  if (String(c.name ?? "").length >= 4 && c.name.toLowerCase() !== cfg.name.toLowerCase()) {
    clientSrcNeedles.push({ label: "company name", value: c.name, ci: true });
  }
  const siren = String(c.siren ?? "");
  if (siren.replace(/\D/g, "").length >= 9) {
    clientSrcNeedles.push({ label: "SIREN", value: siren, ci: true });
    clientSrcNeedles.push({ label: "SIREN (unspaced)", value: siren.replace(/\D/g, ""), ci: true });
  }
}

// Pattern-based needles, same scope: catch the whole *category* of
// leak even when the literal differs from the current content/ values —
// spaced acronyms and SIREN-like grouped 9-digit numbers. Intentional
// occurrences must use a template-ok: marker.
const regexNeedles: { label: string; re: RegExp }[] = [
  { label: "spaced acronym", re: new RegExp("\\b(?:[A-Z] ){2,}[A-Z]\\b") },
  { label: "SIREN-like number", re: new RegExp("\\b\\d{3}[ .]\\d{3}[ .]\\d{3}\\b") },
];
const clientSrcPrefix = resolve(root, "client/src");
// Narrative templates whose prose is now fully tokenized — scanned with the
// same derived needles as client/src so names/SIRENs can never come back.
const narrativeTemplates = new Set([
  resolve(root, "client/index.html.template"),
  resolve(root, "client/why/index.html.template"),
  resolve(root, "client/public/llms.txt.template"),
  resolve(root, "client/public/llms-full.txt.template"),
]);

// All needles are matched case-insensitively so a differently-cased copy of
// the brand name or acronym cannot slip past the scan.
// Intentional keyword occurrences must be exempted explicitly with a
// `template-ok:` marker on the same line (e.g. `// template-ok: <reason>`),
// or — better — moved into content/ (cfg.slogan, content/companies.ts).
const EXEMPT_MARKER = "template-ok:";

let scanHits = 0;
for (const file of scanFiles) {
  const text = await readOrNull(file);
  if (text === null) continue;
  const lines = text.split("\n");
  const isClientSrc = file.startsWith(clientSrcPrefix);
  const isDerivedScope = isClientSrc || narrativeTemplates.has(file);
  lines.forEach((line, i) => {
    if (line.includes(EXEMPT_MARKER)) return;
    for (const n of needles) {
      const hit = n.ci ? line.toLowerCase().includes(n.value.toLowerCase()) : line.includes(n.value);
      if (hit) {
        scanHits++;
        fail(`hardcoded ${n.label} outside content/: ${relative(root, file)}:${i + 1} — "${shorten(line.trim())}"`);
      }
    }
    if (isDerivedScope) {
      const where = isClientSrc ? "client/src" : "narrative template";
      for (const n of clientSrcNeedles) {
        const hit = n.ci ? line.toLowerCase().includes(n.value.toLowerCase()) : line.includes(n.value);
        if (hit) {
          scanHits++;
          fail(`hardcoded ${n.label} in ${where} (move to content/): ${relative(root, file)}:${i + 1} — "${shorten(line.trim())}"`);
        }
      }
      for (const rn of regexNeedles) {
        const m = line.match(rn.re);
        if (m) {
          scanHits++;
          fail(`${rn.label} hardcoded in ${where} (move to content/ or mark template-ok:): ${relative(root, file)}:${i + 1} — "${shorten(line.trim())}" (matched "${m[0]}")`);
        }
      }
    }
  });
}
if (scanHits === 0) pass();

// ── Report ───────────────────────────────────────────────────────────────────
console.log("\n──────────────────────────────────────────────────────────────");
console.log(" SEO/GEO validation report");
console.log("──────────────────────────────────────────────────────────────");
console.log(`  ✓ ${passed} checks passed`);
if (warnings.length > 0) {
  console.log(`  ⚠ ${warnings.length} warning(s) — non-blocking:`);
  for (const w of warnings) console.log(`     - ${w}`);
}
if (errors.length > 0) {
  console.error(`  ✗ BUILD FAILED — ${errors.length} SEO/GEO invariant violation(s):`);
  errors.forEach((e, i) => console.error(`     ${i + 1}. ${e}`));
  console.log("──────────────────────────────────────────────────────────────");
  process.exit(1);
}
console.log("──────────────────────────────────────────────────────────────");
