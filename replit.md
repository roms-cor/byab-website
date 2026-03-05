# Because You Are Busy — Landing Page & Components

## Overview
A two-page site for Because You Are Busy (BYAB), an operations, transformation, and growth consultancy serving founders and managing partners since 2005. The homepage is the agency landing page; the Components page is the single source of truth — it defines the brand identity, design tokens, UI elements, and documents every section available on the site.

**Primary keyword:** "because you are busy"

## Architecture
- **Frontend only** — No backend API needed, purely static content
- React + Tailwind CSS + shadcn/ui tokens
- Semantic HTML5 throughout
- Proper heading hierarchy (h1 > h2 > h3)
- **Build-time injection:** `vite.config.ts` defines `__APP_VERSION__` (from package.json) and `__BUILD_DATE__` (ISO date at build time), displayed subtly in the footer bottom bar (text-[10px], color #BBBBBB)
- **Image optimization:** All images converted to WebP at 256px (hero/team) and 128px (orbit/story thumbnails), served from `client/public/images/`. Total image payload ~108KB (down from 6MB PNGs). Lazy loading + decoding="async" on below-fold images, fetchpriority="high" on LCP hero image.
- **Font loading:** Google Fonts loaded asynchronously via preload+onload pattern (non-render-blocking), with slimmed weight range (Inter 400-700, JetBrains Mono 400-500)
- **Preload hints:** LCP image (anne-256.webp) and header logo preloaded in `<head>`

## Routes
- `/` — Homepage (agency landing page)
- `/components` — Components (design system + site sections reference)

## SEO & AI Search Optimization
- **Primary keyword:** "because you are busy" — appears in title, meta, h1 subtext, hero description, about section, contact section, story quote, footer, schema.org, llms.txt
- **Title tag:** "Because You Are Busy — Operations, Transformation & Growth Consulting Since 2005"
- **Schema.org structured data** (6 blocks in index.html):
  1. Organization — name, alternateName, sameAs (all backlinks), founder, members, areaServed
  2. ProfessionalService — services catalog, address, email, aggregateRating
  3. WebSite — name, description, inLanguage
  4. FAQPage — 5 questions/answers about the company
  5. BreadcrumbList — Home, Components
- **Open Graph + Twitter cards** with keyword-rich titles/descriptions
- **hreflang** tags for en/fr
- **robots.txt** — Allows all major search + AI bots (Googlebot, GPTBot, ClaudeBot, PerplexityBot, FirecrawlBot, etc.)
- **llms.txt** — Comprehensive structured summary for LLM/AI consumption, keyword-dense
- **llms-full.txt** — Complete design system specification
- **sitemap.xml** — Both routes with priorities
- **Backlinks** (14+ external) embedded in Story section: annuaire-entreprises, Pappers, societe.com, Le Figaro, LinkedIn (4 profiles), Vatier, Avizio, Clay, Oysterz

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

## Brand Design Tokens (Pure Grayscale)
- **Primary**: #999999 — Decorative fills, accents
- **Accent**: #000000 — Primary buttons, dark sections
- **Background**: #FFFFFF
- **Text Primary**: #000000
- **Link/Secondary**: #666666
- **Card BG**: #F5F5F5 (Gray 50)
- **Card Border**: #E5E5E5 (Gray 100)
- **Dark Label**: #777777
- **Font**: Inter (body + headings), JetBrains Mono (code)
- **Spacing**: 8px grid
- **Border Radius**: 8px default, 10px buttons, 0px secondary buttons

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
11. Footer — Logo, © 2005–2026 Because You Are Busy, Components link
