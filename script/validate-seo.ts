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
 *   4. Files — robots.txt, sitemap.xml (auto-stamped lastmod), llms.txt,
 *      llms-full.txt and CNAME consistent with site.config; no unresolved
 *      {{TOKENS}} anywhere; og:image and icon/preload assets exist on disk.
 *   5. Template safety — brand name, short name, domain, email and street
 *      address from site.config are not hardcoded in build inputs outside
 *      the content/ layer (so a duplicate only needs to edit content/).
 */
import { readFile, readdir } from "fs/promises";
import { join, relative, resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

// timeline.tsx contains JSX (not importable under plain tsx without a React
// pragma) — extract the plain-string fields from source instead.
const timelineSrc = await readFile(resolve(root, "content/timeline.tsx"), "utf-8");
const timelineTitles = [...timelineSrc.matchAll(/^\s*title:\s*"([^"]+)"/gm)].map((m) => m[1]);
const timelineYears = [...timelineSrc.matchAll(/^\s*year:\s*"([^"]+)"/gm)].map((m) => m[1]);

const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf-8"));

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
  const expectedLangs = [...cfg.locales, "x-default"];
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
        if (wClaim && hClaim && (w !== wClaim || h !== hClaim)) {
          warn(`og-image is ${w}×${h} but og:image:width/height claims ${wClaim}×${hClaim} — regenerate the share image (1200×630 recommended)`);
        }
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

// ── 4: generated metadata files ──────────────────────────────────────────────
const robots = await readOrNull(resolve(distPub, "robots.txt"));
if (robots === null) fail("dist/public/robots.txt is missing");
else {
  check(robots.includes(`Sitemap: ${cfg.url}sitemap.xml`), `robots.txt Sitemap line ≠ "Sitemap: ${cfg.url}sitemap.xml"`);
  check(robots.includes("Disallow: /design"), "robots.txt: missing Disallow: /design");
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "CCBot"]) {
    check(new RegExp(`User-agent: ${bot}\\s*\\nAllow: /`).test(robots), `robots.txt: AI crawler ${bot} not explicitly allowed`);
  }
}

const sitemap = await readOrNull(resolve(distPub, "sitemap.xml"));
if (sitemap === null) fail("dist/public/sitemap.xml is missing");
else {
  check(sitemap.includes(`<loc>${cfg.url}</loc>`), `sitemap.xml <loc> ≠ config url`);
  const lm = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/);
  if (!lm) fail("sitemap.xml: <lastmod> missing or not YYYY-MM-DD");
  else {
    const age = Math.abs(Date.now() - new Date(`${lm[1]}T00:00:00Z`).getTime());
    check(age < 48 * 3600 * 1000, `sitemap.xml <lastmod> "${lm[1]}" is not the build date — auto-stamping broken`);
  }
}

const llms = await readOrNull(resolve(distPub, "llms.txt"));
if (llms === null) fail("dist/public/llms.txt is missing");
else {
  check(llms.includes(cfg.name), "llms.txt does not mention the site name");
  check(llms.includes(cfg.email), "llms.txt does not contain the contact email");
}

const llmsFull = await readOrNull(resolve(distPub, "llms-full.txt"));
if (llmsFull === null) fail("dist/public/llms-full.txt is missing");
else {
  check(llmsFull.includes(cfg.name), "llms-full.txt does not mention the site name");
  check(llmsFull.includes(cfg.domain), "llms-full.txt does not mention the domain");
}

const cname = await readOrNull(resolve(root, "CNAME"));
if (cname === null) fail("CNAME is missing at the repo root");
else check(cname.trim() === cfg.domain, `CNAME "${cname.trim()}" ≠ config domain "${cfg.domain}"`);

for (const [label, content] of [
  ["dist/public/index.html", html],
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
  { label: "site name", value: cfg.name, ci: false },
  { label: "short name", value: cfg.shortName, ci: false },
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

let scanHits = 0;
for (const file of scanFiles) {
  const text = await readOrNull(file);
  if (text === null) continue;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const n of needles) {
      const hit = n.ci ? line.toLowerCase().includes(n.value.toLowerCase()) : line.includes(n.value);
      if (hit) {
        scanHits++;
        fail(`hardcoded ${n.label} outside content/: ${relative(root, file)}:${i + 1} — "${shorten(line.trim())}"`);
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
