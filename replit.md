# Because You Are Busy — Landing Page & Components

## Overview
A two-page site for Because You Are Busy (BYAB), an operations, transformation, and growth consultancy serving founders and managing partners since 2005. The homepage is the agency landing page; the Components page is the single source of truth — it defines the brand identity, design tokens, UI elements, and documents every section available on the site.

**Primary keyword:** "because you are busy"

## Architecture
- React + Tailwind CSS + shadcn/ui tokens + Express backend
- **Database:** PostgreSQL via Drizzle ORM (node-postgres driver). Tables: users, contact_submissions
- **Contact form:** POST /api/contact saves submissions to `contact_submissions` table, then opens visitor's mailto: client pre-filled for hello@becausebusy.com. Response is minimal (`{ ok, id }`) — no PII in API responses/logs
- Semantic HTML5 throughout
- Proper heading hierarchy (h1 > h2 > h3)
- **Build-time injection:** `vite.config.ts` defines `__APP_VERSION__` (from package.json), `__BUILD_DATE__` (full ISO datetime at build/publish time), and `__GIT_COMMIT_DATE__` (ISO datetime of the latest git commit). Both timestamps are displayed in the footer bottom bar (text-[10px], color #BBBBBB) as "Published {date} {time} · Commit {date} {time}". **This footer version line must always be preserved** — it is a persistent project requirement.
- **Image optimization:** All images converted to WebP at 256px (hero/team) and 128px (orbit/story thumbnails), served from `client/public/images/`. Logos resized to 504×168 (2x retina). Total image payload ~92KB. Lazy loading + decoding="async" on below-fold images, fetchpriority="high" on LCP hero image + header logo.
- **LCP optimization:** Hero first image renders with opacity:1 and NO CSS transition on initial paint (hasAdvanced ref). LCP image (anne-256.webp) preloaded in `<head>`.
- **Pre-rendered HTML shell:** `<div id="root">` contains a static HTML skeleton (header with full nav links + hero title) so FCP happens before JS loads. Crawlers/LLMs see the navigation even without JS. React replaces it entirely on mount.
- **Non-render-blocking CSS:** Post-build script in `script/build.ts` transforms the Vite-injected `<link rel="stylesheet">` to async loading (`media="print" onload="this.media='all'"`).
- **Code splitting:** Components/design page lazy-loaded via React.lazy + Suspense — not bundled with homepage JS.
- **Accessibility:** WCAG AA contrast (#767676 decorative text, #595959 small badge text, #949494 text on dark bg), 44×44px touch targets on slider dots/orbit buttons, prefers-reduced-motion support, form inputs with required/aria-required, skip-nav link, marquee aria-hidden, descriptive image alt text, orbit button images use alt="" with aria-label.
- **Canonical:** Static canonical in index.html `<head>`, overridden by useHeadLinks on /home (removes static before injecting page-specific).
- **Font loading:** Google Fonts loaded asynchronously via preload+onload pattern (non-render-blocking), with slimmed weight range (Inter 400-700, JetBrains Mono 400-500)
- **Preload hints:** LCP image (anne-256.webp) and header logo preloaded in `<head>`
- **Auto-push on Publish:** `script/build.ts` runs `script/push-to-github.sh` after building, which syncs the workspace to GitHub `main` using `GITHUB_PAT` (Replit secret). GitHub Actions then auto-deploys to `becausebusy.com`. Replit = staging, Publish = production.
- **Auto-release:** `.github/workflows/release.yml` uses `TriPSs/conventional-changelog-action` to bump `package.json` version, generate `CHANGELOG.md`, and create a GitHub Release — only when conventional commits (`feat:`, `fix:`) are present. The deploy workflow skips bot-authored commits and `chore(release)` messages to prevent double-deploy loops.
- **Conventional commits (persistent convention):** All commit messages in this project must follow [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat: ...` → minor version bump (new feature)
  - `fix: ...` → patch version bump (bug fix)
  - `chore: ...` → no version bump (maintenance, publish)
  - `refactor:`, `perf:`, `docs:`, `style:`, `test:` → also valid, no bump
  - The push script uses `chore(publish):` prefix automatically
- **Version sync caveat:** After a GitHub release bumps `package.json` version on GitHub, you must update the version in Replit's `package.json` **before the next deploy**, otherwise the footer will display the old version. `__APP_VERSION__` in `vite.config.ts` reads dynamically from `package.json` at build time — no hardcoding.

## Homepage Sections (in order)
1. **Header** — fixed nav (h-[72px]), logo (h-[38px]), anchor links with title attributes (Services, Track Record, Team, Story, Contact), pill-shaped "Get in touch" CTA
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
- `/design` — Design system page (noindex, design tokens + site sections reference)

## SEO & AI Search Optimization
- **Primary keyword:** "because you are busy" — appears in title, meta, h1 subtext, hero description, about section, contact section, story quote, footer, schema.org, llms.txt
- **Title tag:** "Because You Are Busy — Operations, Transformation & Growth Consultancy"
- **All URLs absolute** — sitemap, robots.txt Sitemap directive, JSON-LD, canonical, hreflang all use `https://becausebusy.com/`
- **Schema.org structured data** (7 blocks in index.html):
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
- **hreflang** tags for en/fr (absolute URLs via useHeadLinks)
- **robots.txt** — Allows all major search + AI bots (Googlebot, GPTBot, ClaudeBot, PerplexityBot, FirecrawlBot, OAI-SearchBot, Diffbot, Applebot, DataForSeoBot, iaskspider, omgili, etc.)
- **llms.txt** — Comprehensive structured summary + Tone & Voice, Competitive Differentiation, Citations sections
- **llms-full.txt** — Full editorial site content (hero, services, team bios, FAQ, track record, company history)
- **sitemap.xml** — Both routes with absolute URLs and priorities
- **Backlinks** (14+ external) embedded in Story section: annuaire-entreprises, Pappers, societe.com, Le Figaro, LinkedIn (4 profiles), Vatier, Avizio, Clay
- **CNAME** — Single file at root (`becausebusy.com`), copied to dist during deploy

## Key Files
- `client/src/pages/home.tsx` — Homepage landing page
- `client/src/pages/components.tsx` — Components page (design system + sections)
- `client/src/App.tsx` — Router setup (/ and /components)
- `client/src/index.css` — Design tokens + animations (marquee, ring-pulse, slider-rotate)
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
- **Primary**: #999999 — Decorative fills, accents (NOT for text)
- **Accent**: #000000 — Primary buttons, dark sections
- **Background**: #FFFFFF
- **Text Primary**: #000000
- **Text on white**: #666666 (5.74:1) body text, #767676 (4.6:1) decorative, #595959 (7:1) small badges
- **Text on dark**: #949494 (4.7:1 on black) labels, meta
- **Card BG**: #F5F5F5 (Gray 50)
- **Card Border**: #E5E5E5 (Gray 100)
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

## Homepage Sections
1. Header — Fixed nav, Because Busy logo, anchor links (Services, Track Record, Story, About, Contact), CTA
2. Hero — "We run what you can't get to anymore." + "Because you are busy" in description, circular team slider, Since 2005 label
3. Marquee — Infinite scrolling expertise keywords (Operations, Transformation, Growth, etc.)
4. Services — 2×2 grid: Operational Backbone, Transformation & Data, Growth Engine, Legal Practice Ops
5. Work — Stacked engagement rows (B2B SaaS Scale-Up, National Law Firm, Tech PME)
6. Stats — Dark panel: 20 years, 57% profitability, 3 pillars, 0€ debt
7. About — Three converging forces at Because You Are Busy: operations (Anne, Cécile), systems & data (Georges), growth (Romain)
8. Story — Full company history timeline (2005–2026) with 5 phases + 14 external backlinks + brand promise ("Because you are busy, we do the work...")
9. Testimonial — "They didn't just take work off my plate..." — M. Laurent, Managing Partner
10. Contact — "Because you are busy, we'll take it from here." + hello@becausebusy.com, Paris & La Rochelle
11. Footer — Logo, © 2026 Because You Are Busy, Components link
