# Because Busy — Landing Page & Components

## Overview
A two-page site for Because You Are Busy (BYAB), an operations, transformation, and growth consultancy serving founders and managing partners since 2005. The homepage is the agency landing page; the Components page is the single source of truth — it defines the brand identity, design tokens, UI elements, and documents every section available on the site.

## Architecture
- **Frontend only** — No backend API needed, purely static content
- React + Tailwind CSS + shadcn/ui tokens
- Semantic HTML5 throughout
- Proper heading hierarchy (h1 > h2 > h3)

## Routes
- `/` — Homepage (agency landing page)
- `/components` — Components (design system + site sections reference)

## AI / Scraping Optimization
- `client/public/robots.txt` — Allows all major AI bots
- `client/public/llms.txt` — Structured summary for LLM consumption
- `client/public/llms-full.txt` — Complete design system specification
- `client/public/sitemap.xml` — Sitemap for search engines
- `client/index.html` — JSON-LD structured data

## Key Files
- `client/src/pages/home.tsx` — Homepage landing page
- `client/src/pages/components.tsx` — Components page (design system + sections)
- `client/src/App.tsx` — Router setup (/ and /components)
- `client/src/index.css` — Design tokens + marquee animation

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
1. Header — Fixed nav, Because Busy logo, anchor links (Services, Track Record, About, Contact), CTA
2. Hero — "We run what you can't get to anymore." + Since 2005 label, primary/secondary buttons
3. Marquee — Infinite scrolling expertise keywords (Operations, Transformation, Growth, etc.)
4. Services — 2×2 grid: Operational Backbone, Transformation & Data, Growth Engine, Legal Practice Ops
5. Work — Stacked engagement rows (B2B SaaS Scale-Up, National Law Firm, Tech PME)
6. Stats — Dark panel: 20 years, 57% profitability, 3 pillars, 0€ debt
7. About — Three converging forces: operations (Anne), systems & data (Georges), growth (Romain)
8. Testimonial — "They didn't just take work off my plate..." — M. Laurent, Managing Partner
9. Contact — "Let's take something off your plate." + hello@becausebusy.com, Paris & La Rochelle
10. Footer — Logo, © 2005–2026, Components link
