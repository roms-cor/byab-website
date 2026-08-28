# Because You Are Busy — Landing Page & Components

## Overview
A three-page site for Because You Are Busy (BYAB), an operations, transformation, and growth consultancy serving founders and managing partners since 2005. The homepage is the agency landing page; `/why` is a prerendered, indexable conversion page; the Components page is the single source of truth — it defines the brand identity, design tokens, UI elements, and documents every section available on the site.

**Primary keyword:** "because you are busy"

## Architecture
- React + Tailwind CSS + shadcn/ui tokens + Express backend
- **Database:** PostgreSQL via Drizzle ORM (node-postgres driver). Tables: users, contact_submissions
- **Contact form:** POST /api/contact saves submissions to `contact_submissions` table, then opens visitor's mailto: client pre-filled for hello@becausebusy.com. Response is minimal (`{ ok, id }`) — no PII in API responses/logs
- Semantic HTML5 throughout
- Proper heading hierarchy (h1 > h2 > h3)
- **Build-time injection:** `script/build-defines.ts` (shared by `vite.config.ts` and the prerender step) defines `__APP_VERSION__` (from package.json), `__BUILD_DATE__` (full ISO datetime at build/publish time), and `__GIT_COMMIT_DATE__` (ISO datetime of the latest git commit). Both timestamps are displayed in the footer bottom bar (`text-3xs` = 10px, `text-gray-250` #BBBBBB) as "Published {date} {time} · Commit {date} {time}". **This footer version line must always be preserved** — it is a persistent project requirement.
- **Image optimization:** All images converted to WebP at 256px (hero/team) and 128px (orbit/story thumbnails), served from `client/public/images/`. Logos resized to 504×168 (2x retina). Total image payload ~92KB. Lazy loading + decoding="async" on below-fold images, fetchpriority="high" on LCP hero image + header logo.
- **LCP optimization:** Hero first image renders with opacity:1 and NO CSS transition on initial paint (hasAdvanced ref). LCP image (anne-256.webp) preloaded in `<head>`.
- **Full build-time prerender:** `script/build.ts` renders the complete homepage (`client/src/entry-prerender.tsx`, renderToString) into `dist/public/index.html` — ~67KB of static HTML. Non-JS crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) see the entire page. React replaces it on mount (`createRoot().render`; DOM output is identical so there is no visible flash). The dev server stays client-rendered only. The `/design` page is prerendered the same way into `dist/public/design/index.html` with its own dedicated shell (`client/design/index.html.template`: own title/description, canonical `/design`, **static noindex**, no homepage JSON-LD), remounted by the eager entry `client/src/entry-design.tsx` — no Suspense fallback, so no flash. The public `/why` page follows the same pattern: prerendered into `dist/public/why/index.html` from its own **indexable** shell (`client/why/index.html.template`, canonical `/why`), eager entry `client/src/entry-why.tsx`. Inside /why sections, links back to home must be plain `<a href="/">` (the static shell mounts no Router — a wouter Link would change the URL without navigating).
- **CSS is render-blocking by design:** the old `media="print"` async-CSS hack was removed when the full prerender landed — with the whole page in static HTML, async CSS causes a flash of unstyled content. Do not re-add it.
- **Code splitting:** Components/design page lazy-loaded via React.lazy + Suspense — not bundled with homepage JS. The built `/design` page loads through its own eager entry (`entry-design.tsx`); the SPA lazy route remains for dev + client-side navigation. The SEO validator fails the build if design or /why page code leaks into the homepage JS graph; `/why` mirrors the same pattern (lazy SPA route + eager `entry-why.tsx`, marker `why-page-root`).
- **Accessibility:** WCAG AA contrast (#767676 decorative text, #595959 small badge text, #949494 text on dark bg), 44×44px touch targets on slider dots/orbit buttons, prefers-reduced-motion support, form inputs with required/aria-required, skip-nav link, marquee aria-hidden, descriptive image alt text, orbit button images use alt="" with aria-label.
- **Canonical + hreflang:** generated statically into the `<head>` at build time from `content/site.config.ts` (via the `{{HREFLANG_LINKS}}` token in `client/index.html.template`). No client-side head injection remains (`useHeadLinks` was removed).
- **SEO/GEO validation:** `script/validate-seo.ts` runs at the end of every `npm run build` and fails it with a numbered report if any invariant breaks — head tags, JSON-LD consistency with config, prerendered content completeness, robots/sitemap/llms/CNAME consistency, unresolved `{{TOKENS}}`, missing og-image/icon assets, or brand/domain strings hardcoded outside `content/`. It also validates the prerendered `/design` page: dedicated head (title/canonical/static noindex, zero JSON-LD), all 8 sections present, real token values + font names visible without JS, robots/llms/sitemap coherence, and homepage-bundle isolation. Sitemap `<lastmod>`, `{{BUILD_YEAR}}` and `{{BUILD_MONTH_YEAR}}` ("as of …" copy) are stamped automatically at build time. The prerendered `/why` page gets the same treatment: dedicated indexable head (title/description from `content/why.ts`, canonical `/why`, index-follow robots parsed as directives), exactly one WebPage + one BreadcrumbList JSON-LD block (deliberately NO FAQPage — the homepage owns it), every section's copy visible without JS, sitemap + llms.txt listing, and homepage-bundle isolation.
- **Font loading:** Google Fonts loaded asynchronously via preload+onload pattern (non-render-blocking), with slimmed weight range (Inter 400-700, JetBrains Mono 400-500)
- **Preload hints:** LCP image (anne-256.webp) and header logo preloaded in `<head>`
- **Auto-push on Publish:** `script/build.ts` runs `script/push-to-github.sh` after building, which syncs the workspace to GitHub `main` using `GITHUB_PAT` (Replit secret). GitHub Actions then auto-deploys to `becausebusy.com`. Replit = staging, Publish = production.
- **Auto-release:** `.github/workflows/release.yml` uses `TriPSs/conventional-changelog-action` to bump `package.json` and create a GitHub Release from accepted Conventional Commit messages. `feat:` produces a minor release; `fix:`, `docs:`, `refactor:`, `perf:`, `style:`, and `test:` produce a patch release; `chore:` is accepted for maintenance publishing without a release. `CHANGELOG.md` is generated separately by the git-cliff workflow. The deploy workflow skips bot-authored commits and `chore(release)` messages to prevent double-deploy loops.
- **Styling convention (ESLint-enforced):** No inline `style={{…}}` props in `client/src/pages/**`, `client/src/sections/**`, or `content/**` — Tailwind token classes only, so Subframe and the Tailwind scanner can see every style. Recurring sizes have named tokens (`text-hero`, `text-2xs`/`text-3xs`, `h-header`, `max-w-container`, `rounded-button`, `tracking-eyebrow`/`tracking-label`, `shadow-slider-*`, `duration-400`/`delay-60`); see `docs/design-tokens.md`. Irreducibly dynamic values (TeamSlider orbit `--thumb-angle` variable, /design type-scale & spacing previews) carry explicit `eslint-disable` comments. `content/**` is included in the Tailwind content globs because timeline JSX is prerendered into the homepage.
- **Conventional commits (persistent convention):** All commit messages in this project must follow [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat: ...` → minor version bump (new feature)
  - `fix: ...` → patch version bump (bug fix)
  - `docs:`, `refactor:`, `perf:`, `style:`, `test:` → patch version bump
  - `chore: ...` → no version bump (maintenance, default publish)
  - To control the next Publish message, put exactly one accepted Conventional Commit line in the local `.publish-message` file. Accepted types are `feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `style`, and `test`, with an optional scope, for example `docs: clarify publishing`.
  - On Publish, `script/push-to-github.sh` trims and validates `.publish-message`, uses it for the GitHub commit, and empties the local file only after a successful push. An absent or blank file falls back to `chore(publish): v{version} — {UTC date}`. `.publish-message` is local-only and is never copied to GitHub.
- **Version sync caveat:** After a GitHub release bumps `package.json` version on GitHub, you must update the version in Replit's `package.json` **before the next deploy**, otherwise the footer will display the old version. `__APP_VERSION__` in `vite.config.ts` reads dynamically from `package.json` at build time — no hardcoding.

## Homepage Sections (in order)
1. **Header** — fixed nav (`h-header` = 72px), logo (h-[38px]), anchor links with title attributes (Services, Track Record, Team, Story, Contact), pill-shaped "Get in touch" CTA
2. **Hero** — h1 "We run what you can't get to anymore.", subtitle, proof stats row (20 years, 57%, 0€), TeamSlider
3. **Marquee** — scrolling keyword strip (Organization, Finance, Strategy, Operations, Transformation, Growth, Outbound, Data)
4. **Pain Recognition** — dark section (#000), 3 numbered pain points with bold leads
5. **Services** — "Four ways we take it off your plate." — 4 service cards with descriptions + outcome lists (→ prefix)
6. **Stats/Proof Bar** — dark section, "by the numbers" label, 4 stats with yellow accent suffixes (#E8E020) + subtexts
7. **Track Record** — "Recent engagements." — 3 engagement rows with category, description, year, outcome badge (yellow)
8. **About** — "We partner with founders who refuse to keep drowning." — 3 pillars (Operations-first, Data-driven, Growth-engineered) with descriptions
9. **Team** — "Our team." — 4 team cards (Anne, Cécile, Georges, Romain) with photos, bios, LinkedIn
10. **Story** — Timeline (2005, 2015, 2020, 2025, 2025–26) + brand promise blockquote
11. **Testimonial** — M. Laurent quote
12. **Contact** — "Let's take something off your plate." — form + contact details (bg #F5F5F5)
13. **Footer** — logo, nav, People (Cécile listed first as "Founder, B Y A B 2005"), Companies with SIREN numbers, version timestamps

## Team Members (persistent data)
- **Cécile Noiriel** — Founder — B Y A B, 2005 (original founder, created the company April 1, 2005)
- **Anne Grosz** — Founder & Operations (Co-founder of second entity, 2015; 8 years at Vatier & Associés)
- **Georges Grosz** — Transformation & Data (22+ years at CGI, professor at Sorbonne, co-manager since July 2025)
- **Romain Cornu** — Growth Engine (nearly 6 yrs at MerciApp: Growth Advisor → Investor → GTM & Key Accounts Lead; 4+ yrs Head of Growth at Clovis; Head of Marketing at Datananas; Outbound Teacher at GrowthMakers)

## Routes
- `/` — Full homepage (agency landing page)
- `/home` — Redirects to `/` (legacy URL preserved)
- `/why` — Why-us conversion page ("blueprint/run-book" landing graduated from a canvas mockup). **Public and indexable**: prerendered static HTML from `why/index.html`, dedicated head + canonical, listed in sitemap.xml; all copy in `content/why.ts` (FAQ entries reused from `content/faq.ts` via `faqIndexes`)
- `/design` — Design system page (design tokens + site sections reference). **Crawlable but noindex**: served as prerendered static HTML from `design/index.html` (real 200 for non-JS agents), kept out of Google via a static `<meta name="robots" content="noindex">`, deliberately absent from sitemap.xml

## SEO & AI Search Optimization
- **Primary keyword:** "because you are busy" — appears in title, meta, h1 subtext, hero description, about section, contact section, story quote, footer, schema.org, llms.txt
- **Title tag:** "Because You Are Busy — Operations, Transformation & Growth Consultancy"
- **All URLs absolute** — sitemap, robots.txt Sitemap directive, JSON-LD, canonical, hreflang all use `https://becausebusy.com/`
- **Schema.org structured data** (6 blocks in `client/index.html`):
  1. Organization — name, alternateName, sameAs (all backlinks), founder, members, areaServed (structured objects)
  2. ProfessionalService — services catalog, address, email, aggregateRating, areaServed (structured objects)
  3. WebSite — name, description, inLanguage
  4. FAQPage — 5 questions/answers about the company
  5. BreadcrumbList — Home, Services, Track Record, Team, Story, Contact (6 items, all correct anchors)
  6. SiteNavigationElement — 5 nav items with descriptive text for LLM/AEO discoverability
- **Open Graph + Twitter cards** — og:image (1200×630), og:url, twitter:image, all absolute URLs
- **Favicons** — apple-touch-icon (180×180), favicon-32x32, favicon-16x16 + original favicon.png
- **theme-color** — #ffffff
- **Viewport** — No maximum-scale restriction (accessibility)
- **hreflang** tags for en/fr + x-default — static in `<head>`, generated from `site.config.ts` locales
- **robots.txt** — Allows all major search + AI bots (Googlebot, GPTBot, ClaudeBot, PerplexityBot, FirecrawlBot, OAI-SearchBot, Diffbot, Applebot, DataForSeoBot, iaskspider, omgili, etc.). `/design` is NOT disallowed — it is crawlable; its static noindex meta keeps it out of the index
- **llms.txt** — Comprehensive structured summary + Tone & Voice, Competitive Differentiation, Citations sections
- **llms-full.txt** — Full editorial site content (hero, services, team bios, FAQ, track record, company history)
- **sitemap.xml** — Homepage + `/why`, absolute URLs + auto-stamped lastmod (`/design` is noindex and does not belong in a sitemap)
- **Backlinks** (14+ external) embedded in Story section: annuaire-entreprises, Pappers, societe.com, Le Figaro, LinkedIn (4 profiles), Vatier, Avizio, Clay
- **CNAME** — Single file at root (`becausebusy.com`), copied to dist during deploy

## Key Files
- **Generated metadata files — never edit the outputs directly.** Edit the matching `.template` file for structure/editorial framing, or edit `content/` for site data and generated sections; `script/generate-meta.ts` recreates every output at build time:
  - `client/index.html.template` → `client/index.html`
  - `client/design/index.html.template` → `client/design/index.html`
  - `client/why/index.html.template` → `client/why/index.html`
  - `client/public/robots.txt.template` → `client/public/robots.txt`
  - `client/public/sitemap.xml.template` → `client/public/sitemap.xml`
  - `client/public/llms.txt.template` → `client/public/llms.txt`
  - `client/public/llms-full.txt.template` → `client/public/llms-full.txt`
  - `CNAME.template` → `CNAME`
- `content/site.config.ts` — single source of truth for brand/domain/SEO values (see TEMPLATE.md)
- `script/build.ts` — build orchestrator (generate-meta → vite → prerender → server → validate-seo → push)
- `script/validate-seo.ts` — post-build SEO/GEO validation harness (fails the build on violations)
- `client/src/entry-prerender.tsx` — SSR entry for the build-time prerenders (homepage + /design + /why)
- `client/src/entry-design.tsx` — eager client entry for the built /design page (shell: `client/design/index.html.template`)
- `client/src/entry-why.tsx` — eager client entry for the built /why page (shell: `client/why/index.html.template`)
- `client/src/pages/home.tsx` — Homepage: thin ordered assembly of `client/src/sections/home/*` (one file per section)
- `client/src/pages/components.tsx` — /design page: assembly of `client/src/sections/design/*` blocks (keeps side-nav observer + token resolution)
- `client/src/sections/` — Presentational section components (home/ + design/ + why/); logic lives in hooks (`use-mobile-nav`, `use-contact-form`, `use-team-slider`) so Subframe can replace JSX without touching behavior
- `client/src/App.tsx` — Router setup (/, /home redirect, lazy /design + /why + /coming-soon, 404)
- `design-tokens.ts` — Design-token sheet (repo root): every color as a literal value, single sanctioned home for color literals; also feeds the /design page's static token texts
- `tailwind.config.ts` — Tailwind theme wired to `design-tokens.ts`, re-emits every token as :root CSS vars (Subframe-importable)
- `docs/design-tokens.md` — Full token reference (palette + old-name mapping, typography, spacing, radius)
- `client/src/index.css` — Derived interaction tokens (--*-border), elevate system, animations (marquee, ring-pulse, slider-rotate)
- `client/index.html` — Meta tags, OG, JSON-LD structured data
- `client/public/llms.txt` — AI-optimized summary
- `client/public/llms-full.txt` — Full design system docs
- `client/public/robots.txt` — Bot permissions
- `client/public/sitemap.xml` — Sitemap
- `shared/schema.ts` — Drizzle schema (users, contact_submissions)
- `server/db.ts` — Database connection (node-postgres)
- `server/storage.ts` — Storage interface + DatabaseStorage implementation
- `server/routes.ts` — API routes (POST /api/contact)

## Brand Design Tokens (Pure Grayscale)
Single source of truth: `design-tokens.ts` at the repo root (all colors as literal values; imported by `tailwind.config.ts` and emitted as `--*` CSS vars). Full reference: `docs/design-tokens.md`.
- **Gray scale**: gray-50 #F5F5F5 → gray-900 #000000 ordered by lightness; in-between stops 225/250/350/450/550 preserve historical brand values (old hex-encoded names --gray-c0/--gray-bb/--gray-94/--gray-76/--gray-59 were renamed, values unchanged)
- **Primary**: #999999 (gray-300) — Decorative fills, accents (NOT for text)
- **Accent**: #000000 (gray-900) — Primary buttons, dark sections
- **Background**: #FFFFFF
- **Text Primary**: #000000
- **Text on white**: #666666 gray-500 (5.74:1) body text, #767676 gray-450 (4.6:1) decorative, #595959 gray-550 (7:1) small badges
- **Text on dark**: #949494 gray-350 (4.7:1 on black) labels, meta
- **Card BG**: #F5F5F5 (gray-50)
- **Card Border**: #E5E5E5 (gray-100)
- **Exact-value traps**: `border` hsl(0 0% 90%) computes #E6E6E6 ≠ gray-100 #E5E5E5; `destructive` hsl(0 72% 51%) computes #DC2828 ≠ red-600 #DC2626 (form errors use red-600)
- **Font**: Inter (body + headings), JetBrains Mono (code)
- **Spacing**: 8px grid
- **Border Radius**: 8px default, 9999px (pill) header CTA, 0px secondary buttons

## Logo Assets (naming is counterintuitive)
- `logoHorizontalWhite` = light-bg version (black bolt/text) — used in Header + Footer on home
- `logoHorizontalBlack` = dark-bg version (white bolt/text) — used in components page footer
- `logoSquareBlack` = light-bg square — used in components page Logomark section
- `logoSquareWhite` = dark-bg square — used in components page Logomark section

## TeamSlider (Hero)
- Circular slider with animated concentric rings (3 levels)
- Orbiting thumbnail avatars (slider-orbit CSS animation, 20s rotation)
- Counter-rotation on thumbnails to keep them upright (slider-orbit-reverse)
- Smooth crossfade between active photos (700ms cubic-bezier)
- Name + role + skill tags (no bio/description)
- Progress dots + 4-second auto-rotation
- Data fields: src, name, role, bio, skills, since

## Components Page Sections
1. Overview — Design system intro + key stats
2. Logo — Light/dark usage, minimum size, clear space, file format
3. Colors — Brand palette, extended grayscale palette, contrast ratios, usage guide
4. Typography — Inter + JetBrains Mono specimens, type scale table
5. Spacing — 8px grid scale table, padding/gap/radius reference
6. UI Components — Buttons (primary/secondary), inputs (text/states), cards (default/elevated/dark)
7. Site Sections — All 10 homepage sections documented with purpose, structure, and tokens used
8. Guidelines — 4 design principles, CSS tokens reference, machine-readable resources
