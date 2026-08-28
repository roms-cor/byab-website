# Site Template Guide

This codebase is a reusable site template. To launch a new site with the same stack, you only need to edit files in the `content/` folder and configure a few Replit Secrets. No React code changes are required.

---

## 1. Files to Edit (content/ only)

Everything a new site needs to customize lives under `content/`. Do not touch any other folders.

### `content/site.config.ts` — Site identity & metadata

This is the single source of truth for all brand and domain values. Edit it first.

| Field | What it controls |
|---|---|
| `name` | Brand name used everywhere (page title, JSON-LD, copy) |
| `shortName` | Acronym (used in schema.org and FAQ copy) |
| `domain` | Naked domain for CNAME, e.g. `yoursite.com` |
| `url` | Canonical URL with trailing slash, e.g. `https://yoursite.com/` |
| `email` | Public contact email |
| `title` | Full browser tab title |
| `tagline` | Short tagline shown after the em-dash in the title |
| `slogan` | Brand slogan used as the bold lead-in phrase in page copy and in `llms*.txt` (via the `{{SLOGAN}}` / `{{SLOGAN_LOWER}}` tokens) |
| `description` | Meta description (≤160 chars) |
| `keywords` | Meta keywords, comma-separated |
| `ogImage` | Absolute URL of the OG/Twitter share image (1200×630 PNG) |
| `foundingDate` | ISO 8601 date used in schema.org, e.g. `2005-04-01` |
| `address` | Postal address (street, postalCode, city, country, countryCode) |
| `locations` | Human-readable location line, e.g. `Paris & Lyon` |
| `locales` | Supported language codes, first is default, e.g. `["en", "fr"]` |
| `colors.themeColor` | Browser theme-color meta tag |

After editing `site.config.ts`, the build step regenerates:
- `client/index.html` — all meta tags, canonical + hreflang links, and the JSON-LD blocks
- `client/public/robots.txt` — sitemap URL
- `client/public/sitemap.xml` — canonical URL (`<lastmod>` is stamped automatically with the build date)
- `client/public/llms.txt` — AI-readable site summary
- `client/public/llms-full.txt` — full site content for AI crawlers
- `CNAME` — GitHub Pages custom domain

### `content/team.ts` — Team members

Each entry controls the team slider, team grid, and JSON-LD member list. Replace photo paths (put images in `client/public/images/`), names, roles, bios, skills, and social links.

### `content/services.ts` — Service offerings

Four service cards shown in the Services section. Edit title, description, and outcome bullet points.

### `content/stats.ts` — Key metrics

Four stats shown in the dark numbers block. Edit value, suffix, label, and sub-label.

### `content/pain.ts` — Pain points

Three "pain recognition" items shown in the dark section. Edit the bold lead-in and the rest of the sentence.

### `content/work.ts` — Recent engagements

Client engagement cards shown in the Track Record section. Edit title, category, year, description, and outcome badge text.

### `content/timeline.tsx` — Company history

Timeline entries for the Story section. Each entry has a year, title, optional photo, rich text content (JSX), and a plain-text `summary`. Update years, titles, photos, and narrative text. The `summary` field feeds the Company History sections of `llms.txt` / `llms-full.txt` — keep it in sync with the JSX content.

### `content/faq.ts` — Frequently asked questions

Single source of truth for the FAQ. Each entry has a question and an answer (both may use `{{TOKENS}}` such as `{{SITE_NAME}}` or `{{BUILD_YEAR}}`; `{{SERVICES_INLINE}}` expands to the current services list). The build generates the FAQPage JSON-LD in `client/index.html` and the FAQ sections of `llms.txt` / `llms-full.txt` from this file.

### `content/why.ts` — `/why` conversion page

Single source of truth for copy that exists only on the public `/why` page, including its SEO title and description, hero, operating model, steps, benefits, CTA, and FAQ selection. Shared stats, pain points, engagements, testimonial, and FAQ entries remain in their own `content/` files and are imported rather than duplicated.

### `content/testimonial.ts` — Client testimonial

Single testimonial quote, initials, author name, and role.

### `content/companies.ts` — Registered legal entities

The footer "Companies" column: legal entity names, SIREN numbers, founding years, and public registry links (Pappers, Annuaire Entreprises, Le Figaro, Société.com…). Replace every entry when duplicating — these are brand-specific backlinks.

---

## 2. Required Replit Secrets

Set these in **Replit > Secrets** (the padlock icon). Never hard-code them in files.

| Secret | Required | Description |
|---|---|---|
| `GITHUB_PAT` | Yes (for deploy) | GitHub Personal Access Token with `repo` scope. Used to push the built site to your GitHub Pages repo. |
| `GITHUB_REPO` | Yes (for deploy) | Target GitHub repository in `owner/repo` format, e.g. `your-org/your-site`. The build script reads this and falls back to the original BYAB repo if unset. |
| `DATABASE_URL` | Yes (for contact form) | PostgreSQL connection string. Used to store contact form submissions. Provision a Replit PostgreSQL database and copy the connection string here. |
| `SESSION_SECRET` | Yes (for server) | A long random string used to sign session cookies. Generate with `openssl rand -base64 32`. |

---

## 3. Namecheap DNS + GitHub Pages Setup

### Step 1 — Create a GitHub repository

1. Create a new **public** GitHub repository named anything you like (e.g. `your-site`).
2. Go to **Settings > Pages** and set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Under **Custom domain**, enter your domain (e.g. `yoursite.com`) and save. GitHub will create a `CNAME` file in the repo automatically — the build script will overwrite it with the correct value.

### Step 2 — Configure Namecheap DNS

In Namecheap **Advanced DNS** for your domain, add these records:

| Type | Host | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |
| CNAME | www | your-org.github.io | Automatic |

Replace `your-org` with your GitHub username or organization name.

> DNS propagation can take up to 48 hours. GitHub Pages will automatically provision an HTTPS certificate (Let's Encrypt) once DNS resolves.

### Step 3 — Set the Replit Secrets

Set `GITHUB_PAT`, `GITHUB_REPO`, `DATABASE_URL`, and `SESSION_SECRET` as described above.

### Step 4 — Deploy

Run the build command from the Replit Shell:

```bash
npm run build
```

This will:
1. Generate all metadata files from `content/site.config.ts`
2. Build the client with Vite
3. Prerender the full homepage into static HTML (crawlers and AI bots see everything without JavaScript)
4. Build the server with esbuild
5. Validate every SEO/GEO invariant — the build fails with an explicit report if anything is broken
6. Push the result to your GitHub Pages repository

The site will be live at your custom domain within minutes.

---

## 4. Never Touch These

The following files are critical infrastructure. Editing them can break the CI loop, the anti-publish-loop filters, or the build pipeline. Leave them alone unless you know exactly what you are doing.

| Path | Why it must not be modified |
|---|---|
| `.github/workflows/` | Contains anti-loop filters that prevent infinite publish cycles. Any change risks triggering recursive GitHub Actions. |
| `script/build.ts` | Orchestrates the entire build pipeline. Changes here break the deploy. |
| `vite.config.ts` | Configures the client build. The `@content` alias and `__APP_VERSION__` / `__BUILD_DATE__` / `__GIT_COMMIT_DATE__` defines are required. |
| `script/generate-meta.ts` | Template engine. Edit the `.template` source files instead, not this script. |
| `script/meta-tokens.ts` | Builds the `{{TOKEN}}` map (config values + sections composed from `content/`). Edit `content/` instead. |
| `script/validate-seo.ts` | Post-build SEO/GEO validation harness. All expectations derive from `content/`, so it needs no edits when duplicating the site. |
| `client/src/entry-prerender.tsx` | Server-side entry used to prerender the homepage at build time. |
| `script/build-defines.ts` | Single source of the footer version/build-date values shared by Vite and the prerender. |

### Footer version line

The footer displays `v{APP_VERSION} · {BUILD_DATE} · commit {GIT_COMMIT_DATE}`. These values are injected at build time via `vite.config.ts` using `__APP_VERSION__`, `__BUILD_DATE__`, and `__GIT_COMMIT_DATE__`. Do not remove or rename these defines.

---

## 5. Adding Images

Place all images in `client/public/images/`. Reference them in content files as `/images/filename.webp`.

For team member photos, provide two sizes:
- `name-256.webp` — 256×256 px, used in the team grid and slider main view
- `name-128.webp` — 128×128 px, used in the slider thumbnails and timeline

The OG image is regenerated **automatically on every `npm run build`** (`script/generate-og-image.ts`, called from `script/build.ts` before the client build): `client/public/og-image.png` is rebuilt at 1200×630 from `client/public/images/logo-horizontal-black.webp` and the brand colors in `site.config.ts` (uses the `sharp` devDependency). It can therefore never go stale. `npm run og-image` still exists to preview the card without a full build. Update `ogImage` in `site.config.ts` only if the URL changed.

---

## 6. SEO/GEO Pipeline (automatic)

Every `npm run build` produces a fully crawlable, self-verifying site:

1. **Metadata generation** — `script/generate-meta.ts` fills the `.template` files with values from `content/site.config.ts`: meta tags, canonical + hreflang links, JSON-LD, robots.txt, sitemap.xml (`<lastmod>` stamped with the build date automatically), llms.txt, llms-full.txt, and CNAME. "As of …" dates in the FAQ and llms files are stamped from the build date too.
2. **Homepage prerender** — the complete homepage (hero, pain points, services, stats, track record, about, team, story, testimonial, contact, footer) is rendered to static HTML inside `dist/public/index.html`. AI crawlers that do not execute JavaScript (GPTBot, ClaudeBot, PerplexityBot, CCBot) see the full page content. React takes over in the browser with no visual change.
3. **Validation** — `script/validate-seo.ts` parses the final output and **fails the build with a numbered report** if any invariant breaks:
   - exactly one title / description / canonical, all matching `site.config.ts`
   - hreflang alternates for every locale + x-default
   - complete OG/Twitter tag set; valid JSON-LD (Organization, ProfessionalService, WebSite, FAQPage, BreadcrumbList, SiteNavigationElement) consistent with the config
   - the content of every `content/` collection present in the raw prerendered HTML
   - robots.txt / sitemap.xml / llms.txt / llms-full.txt / CNAME consistent with the config; no unresolved `{{TOKENS}}` anywhere
   - og-image and icon files actually exist in the build output
   - **template safety**: the brand name, short name, domain, email, or street address hardcoded anywhere outside `content/` fails the build. Matching is **case-insensitive** (a lowercase "because you are busy" is caught too). An intentional occurrence can only be exempted explicitly with a `template-ok: <reason>` marker on the same line — prefer moving the string into `content/` instead (`slogan` in `site.config.ts`, registry links in `companies.ts`)

The exact same `npm run build` runs on Replit and in GitHub Actions — no workflow file changes are needed.

---

## 7. Duplication Checklist (new profession / new site)

1. Edit every file in `content/` (see §1) — the only code change needed. Services, team bios, stats, track record, company history, and FAQ copy in `llms.txt` / `llms-full.txt` and the FAQPage / OfferCatalog JSON-LD are all generated from `content/` at build time.
2. Review the remaining template editorial text: the short framing lines in `client/public/llms*.txt.template` (brand promise, tone & voice, competitive differentiation, external reference links) are written for the current profession. The Organization JSON-LD `founder`/`member` entries are generated from `content/team.ts` at build time (founder = first entry) — no template edit needed.
3. Replace images in `client/public/images/`, plus `favicon.png` / `favicon-16x16.png` / `favicon-32x32.png` / `apple-touch-icon.png` in `client/public/`. The share card (`og-image.png`, **1200×630**) is regenerated automatically on every `npm run build` from the new logo and brand colors (see §5) — no manual step needed; `npm run og-image` only if you want to preview it before building.
4. Set the Replit Secrets (`GITHUB_PAT`, `GITHUB_REPO`, `DATABASE_URL`, `SESSION_SECRET`). Note `script/push-to-github.sh` falls back to the original repo slug when `GITHUB_REPO` is unset — always set it for a duplicate.
5. Grep for leftover strings from the previous brand outside `content/` (old slogan, old acronym, old registry/SIREN links, `<oldacronym>-*.png` asset names). The build's template-safety scan catches the configured brand values case-insensitively, but a duplicate must also make sure no *previous*-brand editorial text survives in `client/src` or the `.template` files (§1 covers the files to edit).
6. Run `npm run build` — if it passes, the site is fully crawlable and consistent, and every remaining brand reference lives in `content/`.
7. Manual / off-platform: DNS records (§3), Google Search Console property + sitemap submission, and a social-card preview check (e.g. opengraph.xyz).
